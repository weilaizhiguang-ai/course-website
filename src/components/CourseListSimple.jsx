import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import PaymentModal from './PaymentModal.jsx';
import deviceFingerprintService from '../services/deviceFingerprintService.js'

const CourseList = ({ courses, userProgress }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const checkCourseAccess = (courseId) => {
    const userId = 'user_' + Date.now(); // Simulated user ID
    const deviceFingerprint = deviceFingerprintService.getCurrentDeviceFingerprint();
    return deviceFingerprintService.verifyDeviceAccess(userId, courseId, deviceFingerprint);
  };

  const handlePurchaseClick = (course) => {
    setSelectedCourse(course);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentData) => {
    // Refresh the page or update course access status
    window.location.reload();
  };

  const getCourseProgress = (course) => {
    const totalChapters = course.chapters?.length || 0
    const completedChapters = course.chapters?.filter(
      chapter => userProgress[`${course.id}-${chapter.id}`]?.completed
    ).length || 0
    const inProgressChapters = course.chapters?.filter(
      chapter => {
        const progress = userProgress[`${course.id}-${chapter.id}`]
        return progress && progress.progress > 0 && !progress.completed
      }
    ).length || 0

    return {
      total: totalChapters,
      completed: completedChapters,
      inProgress: inProgressChapters
    }
  }

  const getLastWatchedChapter = (course) => {
    let lastWatched = null
    let lastTimestamp = 0

    course.chapters?.forEach(chapter => {
      const progress = userProgress[`${course.id}-${chapter.id}`]
      if (progress && progress.lastWatched && progress.lastWatched > lastTimestamp) {
        lastTimestamp = progress.lastWatched
        lastWatched = chapter
      }
    })

    return lastWatched
  }

  return (
    <div className="course-list">
      <header className="header">
        <h1>课程学习平台</h1>
        <p>选择课程开始学习</p>

        <div className="user-actions">
          <Link to="/orders" className="action-btn">
            订单记录
          </Link>
          <Link to="/licenses" className="action-btn">
            许可证管理
          </Link>
        </div>
      </header>

      {courses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>还没有课程</h3>
          <p>请联系管理员创建课程或等待课程发布</p>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map(course => {
            const progress = getCourseProgress(course)
            const progressPercentage = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0
            const lastWatchedChapter = getLastWatchedChapter(course)

            return (
              <div key={course.id} className="course-card">
                <div className="course-content">
                  <h2>{course.title}</h2>
                  <p>{course.description}</p>

                  <div className="progress-section">
                    <div className="progress-info">
                      <span>进度: {progress.completed}/{progress.total} 章节</span>
                      <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>

                    {/* Progress details */}
                    <div className="progress-details">
                      {progress.completed > 0 && (
                        <span className="completed-count">✅ 已完成 {progress.completed} 章</span>
                      )}
                      {progress.inProgress > 0 && (
                        <span className="in-progress-count">⏸️ 学习中 {progress.inProgress} 章</span>
                      )}
                      {progress.completed === 0 && progress.inProgress === 0 && (
                        <span className="not-started">⭕ 未开始学习</span>
                      )}
                    </div>

                    {/* Last watched chapter */}
                    {lastWatchedChapter && (
                      <div className="last-watched">
                        📖 上次学到: {lastWatchedChapter.title}
                      </div>
                    )}
                  </div>

                  <div className="course-actions">
                    {checkCourseAccess(course.id).success ? (
                      <Link to={`/course/${course.id}`} className="start-btn">
                        {progress.completed > 0 || progress.inProgress > 0 ? '继续学习' : '开始学习'}
                      </Link>
                    ) : (
                      <button
                        onClick={() => handlePurchaseClick(course)}
                        className="purchase-btn"
                      >
                        购买课程 ¥{course.price || 99}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        courseId={selectedCourse?.id}
        courseTitle={selectedCourse?.title}
        price={selectedCourse?.price || 99}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>