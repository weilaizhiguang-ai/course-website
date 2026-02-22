import React, { useEffect } from 'react'

const ContentProtection = () => {
  useEffect(() => {
    // Prevent text selection
    const preventSelection = (e) => {
      e.preventDefault()
      return false
    }

    // Prevent copy operations
    const preventCopy = (e) => {
      e.preventDefault()
      return false
    }

    // Prevent keyboard shortcuts
    const preventKeyboardShortcuts = (e) => {
      // Ctrl+C, Cmd+C (Copy)
      if ((e.ctrlKey || e.metaKey) && e.keyCode === 67) {
        e.preventDefault()
        return false
      }

      // Ctrl+A, Cmd+A (Select All)
      if ((e.ctrlKey || e.metaKey) && e.keyCode === 65) {
        e.preventDefault()
        return false
      }

      // Ctrl+S, Cmd+S (Save)
      if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) {
        e.preventDefault()
        return false
      }

      // PrintScreen
      if (e.keyCode === 44) {
        e.preventDefault()
        return false
      }

      // F12 (Developer Tools)
      if (e.keyCode === 123) {
        e.preventDefault()
        return false
      }

      // Ctrl+Shift+I (Developer Tools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 73) {
        e.preventDefault()
        return false
      }

      // Ctrl+Shift+J (Developer Tools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 74) {
        e.preventDefault()
        return false
      }

      // Ctrl+U (View Source)
      if ((e.ctrlKey || e.metaKey) && e.keyCode === 85) {
        e.preventDefault()
        return false
      }
    }

    // Add event listeners
    document.addEventListener('selectstart', preventSelection)
    document.addEventListener('copy', preventCopy)
    document.addEventListener('cut', preventCopy)
    document.addEventListener('contextmenu', preventSelection)
    document.addEventListener('keydown', preventKeyboardShortcuts)

    // Disable drag and drop
    document.addEventListener('dragstart', preventCopy)
    document.addEventListener('drop', preventCopy)

    // Clean up function
    return () => {
      document.removeEventListener('selectstart', preventSelection)
      document.removeEventListener('copy', preventCopy)
      document.removeEventListener('cut', preventCopy)
      document.removeEventListener('contextmenu', preventSelection)
      document.removeEventListener('keydown', preventKeyboardShortcuts)
      document.removeEventListener('dragstart', preventCopy)
      document.removeEventListener('drop', preventCopy)
    }
  }, [])

  // This component doesn't render anything visible
  return null
}

export default ContentProtection