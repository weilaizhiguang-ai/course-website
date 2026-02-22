import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import VideoPlayer from './VideoPlayer.jsx'
import ChapterNavigation from './ChapterNavigation.jsx'
import NotesPanel from './NotesPanel.jsx'
import ContentProtection from './ContentProtection.jsx'

const CoursePlayer = ({ courses, userProgress, updateProgress }) => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [currentCourse, setCurrentCourse] = useState(null)
  const [currentChapter, setCurrentChapter] = useState(0)
  const [showNotes, setShowNotes] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)

  useEffect(() => {
    const course = courses.find(c => c.id === parseInt(courseId))
    if (course) {
      setCurrentCourse(course)
      // 找到用户上次学习的章节
      const lastChapterIndex = course.chapters.findIndex((chapter, index) => {
        const progress = userProgress[`${courseId}-${chapter.id}`]
        return !progress?.completed
      })
      setCurrentChapter(lastChapterIndex === -1 ? 0 : lastChapterIndex)
    }
  }, [courseId, courses, userProgress])

  const handleChapterChange = (chapterIndex) => {
    setCurrentChapter(chapterIndex)
    setVideoProgress(0)
  }

  const handleVideoProgress = (progress) => {
    setVideoProgress(progress)
    if (currentCourse) {
      const chapter = currentCourse.chapters[currentChapter]
      const isCompleted = progress >= 90 // 观看超过90%算完成

      updateProgress(currentCourse.id, chapter.id, {
        progress,
        completed: isCompleted,
        lastWatched: Date.now()
      })
    }
  }

  const handleNextChapter = () => {
    if (currentCourse && currentChapter < currentCourse.chapters.length - 1) {
      handleChapterChange(currentChapter + 1)
    }
  }

  const handlePrevChapter = () => {
    if (currentChapter > 0) {
      handleChapterChange(currentChapter - 1)
    }
  }

  if (!currentCourse) {
    return (
      <div className="loading">
        <p>加载中...</p>
      </div>
    )
  }

  const currentChapterData = currentCourse.chapters[currentChapter]
  const currentProgress = userProgress[`${courseId}-${currentChapterData.id}`]

  return (
    <div className="course-player">
      <ContentProtection />
      <header className="player-header">
        <button onClick={() => navigate('/')} className="back-btn">
          ← 返回课程列表
        </button>
        <h1>{currentCourse.title}</h1>
        <button
          onClick={() => setShowNotes(!showNotes)}
          className={`notes-btn ${showNotes ? 'active' : ''}`}
        >
          📝 笔记
        </button>
      </header>

      <div className="player-content">
        <div className="main-content">
          <VideoPlayer
            chapter={currentChapterData}
            onProgress={handleVideoProgress}
            onNext={handleNextChapter}
            onPrev={handlePrevChapter}
            hasNext={currentChapter < currentCourse.chapters.length - 1}
            hasPrev={currentChapter > 0}
          />
        </div>

        <div className={`side-panel ${showNotes ? 'notes-open' : ''}`}>
          <ChapterNavigation
            chapters={currentCourse.chapters}
            currentChapter={currentChapter}
            userProgress={userProgress}
            courseId={courseId}
            onChapterChange={handleChapterChange}
          />

          {showNotes && (
            <NotesPanel
              courseId={courseId}
              chapterId={currentChapterData.id}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default CoursePlayer
