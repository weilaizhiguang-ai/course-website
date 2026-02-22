import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import CoursePlayer from './components/CoursePlayer.jsx'
import CourseList from './components/CourseList.jsx'
import './index.css'

function App() {
  const [courses, setCourses] = useState([])
  const [userProgress, setUserProgress] = useState({})

  useEffect(() => {
    // 模拟课程数据
    const mockCourses = [
      {
        id: 1,
        title: 'React 基础教程',
        description: '从零开始学习React开发',
        chapters: [
          { id: 1, title: 'React 简介', duration: '10:30' },
          { id: 2, title: '组件基础', duration: '15:45' },
          { id: 3, title: '状态管理', duration: '20:15' },
          { id: 4, title: '生命周期', duration: '18:20' }
        ]
      },
      {
        id: 2,
        title: 'JavaScript 进阶',
        description: '深入学习JavaScript高级特性',
        chapters: [
          { id: 1, title: '闭包与作用域', duration: '12:30' },
          { id: 2, title: '异步编程', duration: '25:00' },
          { id: 3, title: 'ES6+ 特性', duration: '22:15' }
        ]
      }
    ]
    setCourses(mockCourses)

    // 从localStorage加载进度
    const savedProgress = localStorage.getItem('courseProgress')
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress))
    }
  }, [])

  const updateProgress = (courseId, chapterId, progress) => {
    const newProgress = {
      ...userProgress,
      [`${courseId}-${chapterId}`]: progress
    }
    setUserProgress(newProgress)
    localStorage.setItem('courseProgress', JSON.stringify(newProgress))
  }

  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={<CourseList courses={courses} userProgress={userProgress} />}
        />
        <Route
          path="/course/:courseId"
          element={
            <CoursePlayer
              courses={courses}
              userProgress={userProgress}
              updateProgress={updateProgress}
            />
          }
        />
      </Routes>
    </div>
  )
}

export default App
