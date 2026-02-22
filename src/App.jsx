import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import CoursePlayer from './components/CoursePlayer.jsx'
import CourseListSimple from './components/CourseListSimple.jsx'
import OrderHistoryPage from './components/OrderHistoryPage.jsx'
import LicenseManagementPage from './components/LicenseManagementPage.jsx'
// import CourseManagement from './components/CourseManagement.jsx'
import CourseDatabase from './services/CourseDatabase.js'
import './index.css'

function App() {
  const [courses, setCourses] = useState([])
  const [userProgress, setUserProgress] = useState({})

  useEffect(() => {
    // Load courses from database
    const dbCourses = CourseDatabase.getAllCourses()
    setCourses(dbCourses)

    // Load user progress from localStorage
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
          element={<CourseListSimple courses={courses} userProgress={userProgress} />}
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
        <Route
          path="/orders"
          element={<OrderHistoryPage />}
        />
        <Route
          path="/licenses"
          element={<LicenseManagementPage />}
        />
      </Routes>
    </div>
  )
}

export default App