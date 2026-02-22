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

  return (
    <div className="chapter-navigation">
      <h3>课程章节</h3>
      <div className="chapters-list">
        {chapters.map((chapter, index) => {
          const status = getChapterStatus(chapter, index)
          const icon = getStatusIcon(status)

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
                    {Math.round(userProgress[`${courseId}-${chapter.id}`]?.progress || 0)}%
                  </span>
                )}
              </div>

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
