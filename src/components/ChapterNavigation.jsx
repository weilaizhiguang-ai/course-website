import React from 'react'

const ChapterNavigation = ({ chapters, currentChapter, userProgress, courseId, onChapterChange }) => {
  const getChapterStatus = (chapter, index) => {
    const progress = userProgress[`${courseId}-${chapter.id}`]
    if (progress?.completed) return 'completed'
    if (index === currentChapter) return 'current'
    if (progress && progress.progress > 0) return 'in-progress'
    return 'not-started'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅'
      case 'current': return '▶️'
      case 'in-progress': return '⏸️'
      default: return '⭕'
    }
  }

  const getChapterProgress = (chapter) => {
    const progress = userProgress[`${courseId}-${chapter.id}`]
    return progress?.progress || 0
  }

  const getTotalCourseProgress = () => {
    const totalChapters = chapters.length
    const completedChapters = chapters.filter(chapter =>
      userProgress[`${courseId}-${chapter.id}`]?.completed
    ).length
    return Math.round((completedChapters / totalChapters) * 100)
  }

  const totalProgress = getTotalCourseProgress()

  return (
    <div className="chapter-navigation">
      <div className="course-progress-summary">
        <h3>课程进度</h3>
        <div className="overall-progress">
          <div className="progress-info">
            <span>总体完成度</span>
            <span>{totalProgress}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${totalProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <h3>课程章节</h3>
      <div className="chapters-list">
        {chapters.map((chapter, index) => {
          const status = getChapterStatus(chapter, index)
          const icon = getStatusIcon(status)
          const chapterProgress = getChapterProgress(chapter)

          return (
            <div
              key={chapter.id}
              className={`chapter-item ${status}`}
              onClick={() => onChapterChange(index)}
            >
              <div className="chapter-header">
                <span className="chapter-icon">{icon}</span>
                <span className="chapter-title">{chapter.title}</span>
              </div>
              <div className="chapter-meta">
                <span className="chapter-duration">{chapter.duration}</span>
                {status === 'in-progress' && (
                  <span className="progress-text">
                    {Math.round(chapterProgress)}%
                  </span>
                )}
              </div>

              {/* Individual chapter progress bar */}
              {(status === 'in-progress' || status === 'current') && chapterProgress > 0 && (
                <div className="chapter-progress-bar">
                  <div
                    className="chapter-progress-fill"
                    style={{ width: `${chapterProgress}%` }}
                  ></div>
                </div>
              )}

              {status === 'current' && (
                <div className="current-indicator">
                  <div className="playing-indicator"></div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ChapterNavigation
