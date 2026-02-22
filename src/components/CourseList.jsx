import React from 'react'
import { Link } from 'react-router-dom'

const CourseList = ({ courses, userProgress }) => {
  const getCourseProgress = (course) => {
    const totalChapters = course.chapters.length
    const completedChapters = course.chapters.filter(
      chapter => userProgress[`${course.id}-${chapter.id}`]?.completed
    ).length
    return { completed: completedChapters, total: totalChapters }
  }

  return (
    <div className="course-list">
      <header className="header">
        <h1>课程学习平台</h1>
        <p>选择课程开始学习</p>
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
                </div>

                <Link to={`/course/${course.id}`} className="start-btn">
                  {progress.completed > 0 ? '继续学习' : '开始学习'}
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CourseList
