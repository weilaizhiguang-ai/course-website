import React, { useState, useEffect } from 'react'

const NotesPanel = ({ courseId, chapterId }) => {
  const [notes, setNotes] = useState('')
  const [savedNotes, setSavedNotes] = useState('')

  useEffect(() => {
    // 从localStorage加载笔记
    const notesKey = `notes-${courseId}-${chapterId}`
    const saved = localStorage.getItem(notesKey)
    if (saved) {
      setNotes(saved)
      setSavedNotes(saved)
    } else {
      setNotes('')
      setSavedNotes('')
    }
  }, [courseId, chapterId])

  const handleNotesChange = (e) => {
    setNotes(e.target.value)
  }

  const saveNotes = () => {
    const notesKey = `notes-${courseId}-${chapterId}`
    localStorage.setItem(notesKey, notes)
    setSavedNotes(notes)
  }

  const clearNotes = () => {
    setNotes('')
    const notesKey = `notes-${courseId}-${chapterId}`
    localStorage.removeItem(notesKey)
    setSavedNotes('')
  }

  const hasChanges = notes !== savedNotes

  return (
    <div className="notes-panel">
      <div className="notes-header">
        <h3>学习笔记</h3>
        <div className="notes-actions">
          {hasChanges && (
            <button onClick={saveNotes} className="save-btn">
              💾 保存
            </button>
          )}
          <button onClick={clearNotes} className="clear-btn">
            🗑️ 清空
          </button>
        </div>
      </div>

      <textarea
        value={notes}
        onChange={handleNotesChange}
        placeholder="在这里记录你的学习笔记..."
        className="notes-textarea"
      />

      <div className="notes-footer">
        {hasChanges && (
          <p className="unsaved-warning">
            ⚠️ 有未保存的更改
          </p>
        )}
        <p className="notes-tip">
          💡 提示: 笔记会自动保存在浏览器中
        </p>
      </div>
    </div>
  )
}

export default NotesPanel
