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
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault()
        alert('复制功能已禁用')
        return false
      }

      // Ctrl+A, Cmd+A (Select All)
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault()
        return false
      }

      // Ctrl+S, Cmd+S (Save)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        return false
      }

      // PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault()
        return false
      }

      // F12 (Developer Tools)
      if (e.key === 'F12') {
        e.preventDefault()
        return false
      }

      // Ctrl+Shift+I (Developer Tools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault()
        return false
      }

      // Ctrl+Shift+J (Developer Tools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
        e.preventDefault()
        return false
      }

      // Ctrl+U (View Source)
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault()
        return false
      }

      // Ctrl+P (Print)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault()
        return false
      }
    }

    // Prevent screenshot detection
    const preventScreenshotDetection = () => {
      // Monitor for potential screenshot tools
      let hidden, visibilityChange;
      if (typeof document.hidden !== "undefined") {
        hidden = "hidden";
        visibilityChange = "visibilitychange";
      } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
      } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
      }

      const handleVisibilityChange = () => {
        if (document[hidden]) {
          // Tab/window hidden - could be screenshot
          console.log('Window hidden - potential screenshot attempt')
        }
      }

      document.addEventListener(visibilityChange, handleVisibilityChange)
    }

    // Disable browser context menu
    const disableContextMenu = (e) => {
      e.preventDefault()
      return false
    }

    // Prevent drag operations
    const preventDragOperations = (e) => {
      e.preventDefault()
      return false
    }

    // Prevent text selection with CSS
    const addSelectionStyles = () => {
      const style = document.createElement('style')
      style.textContent = `
        .course-player, .video-element, .chapter-content {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }
        .notes-panel, .notes-textarea {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
        }
      `
      document.head.appendChild(style)
      return style
    }

    // Add event listeners
    document.addEventListener('selectstart', preventSelection)
    document.addEventListener('copy', preventCopy)
    document.addEventListener('cut', preventCopy)
    document.addEventListener('contextmenu', disableContextMenu)
    document.addEventListener('keydown', preventKeyboardShortcuts)
    document.addEventListener('dragstart', preventDragOperations)
    document.addEventListener('drop', preventDragOperations)
    document.addEventListener('dragover', preventDragOperations)

    // Add CSS styles
    const styleElement = addSelectionStyles()

    // Initialize screenshot detection
    preventScreenshotDetection()

    // Clean up function
    return () => {
      document.removeEventListener('selectstart', preventSelection)
      document.removeEventListener('copy', preventCopy)
      document.removeEventListener('cut', preventCopy)
      document.removeEventListener('contextmenu', disableContextMenu)
      document.removeEventListener('keydown', preventKeyboardShortcuts)
      document.removeEventListener('dragstart', preventDragOperations)
      document.removeEventListener('drop', preventDragOperations)
      document.removeEventListener('dragover', preventDragOperations)

      // Remove injected styles
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement)
      }
    }
  }, [])

  // This component doesn't render anything visible
  return null
}

export default ContentProtection