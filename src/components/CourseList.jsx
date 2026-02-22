import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PaymentModal from './PaymentModal'
import OrderHistory from './OrderHistory'
import LicenseManagement from './LicenseManagement'
import deviceFingerprintService from '../services/deviceFingerprintService'

const CourseList = ({ courses, userProgress }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showOrderHistory, setShowOrderHistory] = useState(false)
  const [showLicenseManagement, setShowLicenseManagement] = useState(false)
  const [userId] = useState('user_' + Date.now()) // Simulated user ID
  const getCourseProgress = (course) => {
    const totalChapters = course.chapters.length
    const completedChapters = course.chapters.filter(
      chapter => userProgress[`${course.id}-${chapter.id}`]?.completed
    ).length
    const inProgressChapters = course.chapters.filter(
      chapter => {
        const progress = userProgress[`${course.id}-${chapter.id}`]
        return progress && progress.progress > 0 && !progress.completed
      }
    ).length
    const handlePurchaseClick = (course) => {
    setSelectedCourse(course)
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = (paymentData) => {
    // Handle successful payment/activation
    console.log('Payment successful:', paymentData)
    // You can add additional logic here, such as updating course access
  }

  const canAccessCourse = (courseId) => {
    // Check if user has access to the course
    const binding = deviceFingerprintService.getDeviceBinding(userId, courseId)
    return binding && binding.isValid
  }

  const getLastWatchedChapter = (course) => {
    let lastWatched = null
    let lastTimestamp = 0

    course.chapters.forEach(chapter => {
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
          <button
            className="action-btn order-history-btn"
            onClick={() => setShowOrderHistory(true)}
          >
            订单记录
          </button>
          <button
            className="action-btn license-btn"
            onClick={() => setShowLicenseManagement(true)}
          >
            许可证管理
          </button>
        </div>
      </header>

      <div className="courses-grid">
        {courses.map(course => {
          const progress = getCourseProgress(course)
          const progressPercentage = (progress.completed / progress.total) * 100

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
                  {canAccessCourse(course.id) ? (
                    <Link to={`/course/${course.id}`} className="start-btn">
                      {progress.completed > 0 || progress.inProgress > 0 ? '继续学习' : '开始学习'}
                    </Link>
                  ) : (
                    <button
                      className="purchase-btn"
                      onClick={() => handlePurchaseClick(course)}
                    >
                      购买课程 ¥99
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>

    {/* Payment Modal */}
    {showPaymentModal && selectedCourse && (
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        courseId={selectedCourse.id}
        courseTitle={selectedCourse.title}
        price={99}
        onPaymentSuccess={handlePaymentSuccess}
      />
    )}

    {/* Order History Modal */}
    {showOrderHistory && (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h2>订单记录</h2>
            <button className="close-button" onClick={() => setShowOrderHistory(false)}>×</button>
          </div>
          <div className="modal-content">
            <OrderHistory userId={userId} />
          </div>
        </div>
      </div>
    )}

    {/* License Management Modal */}
    {showLicenseManagement && (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h2>许可证管理</h2>
            <button className="close-button" onClick={() => setShowLicenseManagement(false)}>×</button>
          </div>
          <div className="modal-content">
            <LicenseManagement userId={userId} />
          </div>
        </div>
      </div>
    )}
  )
}

export default CourseList
