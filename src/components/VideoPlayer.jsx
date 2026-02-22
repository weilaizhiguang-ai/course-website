import React, { useState, useRef, useEffect } from 'react'

const VideoPlayer = ({ chapter, onProgress, onNext, onPrev, hasNext, hasPrev }) => {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const progressIntervalRef = useRef(null)

  // 模拟视频源 - 实际项目中应该使用真实的视频URL
  const mockVideoSources = {
    1: [
      { type: 'video/mp4', src: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },
      { type: 'video/webm', src: 'https://sample-videos.com/zip/10/webm/SampleVideo_1280x720_1mb.webm' }
    ],
    2: [
      { type: 'video/mp4', src: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4' }
    ],
    default: [
      { type: 'video/mp4', src: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' }
    ]
  }

  const videoSources = mockVideoSources[chapter.id] || mockVideoSources.default

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      try {
        const current = video.currentTime
        const total = video.duration
        setCurrentTime(current)
        setDuration(total)

        if (total > 0) {
          const progress = (current / total) * 100
          onProgress(progress)
        }
      } catch (err) {
        console.error('时间更新错误:', err)
        setError('视频播放出现错误')
      }
    }

    const handleLoadedMetadata = () => {
      try {
        setDuration(video.duration)
        setIsLoading(false)
        setError(null)
        // Resume from saved position if available
        const savedPosition = localStorage.getItem(`video-position-${chapter.id}`)
        if (savedPosition) {
          const position = parseFloat(savedPosition)
          if (position < video.duration) {
            video.currentTime = position
            setCurrentTime(position)
          }
        }
      } catch (err) {
        console.error('元数据加载错误:', err)
        setError('视频元数据加载失败')
      }
    }

    const handleError = (e) => {
      console.error('视频加载错误:', e)
      setError('视频加载失败，请检查网络连接或联系管理员')
      setIsLoading(false)
    }

    const handleLoadStart = () => {
      setIsLoading(true)
      setError(null)
    }

    const handleCanPlay = () => {
      setIsLoading(false)
      setError(null)
    }

    const handleStalled = () => {
      console.warn('视频播放卡顿')
      setError('视频播放卡顿，正在重新连接...')
    }

    const handlePlay = () => {
      setIsPlaying(true)
      // Start the 5-second interval auto-save when playing
      startProgressSaving()
    }

    const handlePause = () => {
      setIsPlaying(false)
      // Stop the interval and save final position
      stopProgressSaving()
      if (video.currentTime > 0 && video.duration > 0) {
        localStorage.setItem(`video-position-${chapter.id}`, video.currentTime.toString())
        localStorage.setItem(`video-timestamp-${chapter.id}`, Date.now().toString())
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      stopProgressSaving()
      // Mark as completed and save final position
      if (video.duration > 0) {
        localStorage.setItem(`video-position-${chapter.id}`, video.duration.toString())
        localStorage.setItem(`video-timestamp-${chapter.id}`, Date.now().toString())
      }
    }

    // Auto-save progress every 5 seconds (only when playing)
    const startProgressSaving = () => {
      // Clear any existing interval first
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }

      progressIntervalRef.current = setInterval(() => {
        if (video.currentTime > 0 && video.duration > 0 && !video.paused) {
          localStorage.setItem(`video-position-${chapter.id}`, video.currentTime.toString())
          localStorage.setItem(`video-timestamp-${chapter.id}`, Date.now().toString())
          console.log(`进度已保存: ${Math.round(video.currentTime)}s / ${Math.round(video.duration)}s`)
        }
      }, 5000) // 5 seconds
    }

    const stopProgressSaving = () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('error', handleError)
    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('stalled', handleStalled)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('error', handleError)
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('stalled', handleStalled)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
      stopProgressSaving()
    }
  }, [chapter.id, onProgress])

  const togglePlayPause = () => {
    const video = videoRef.current
    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const handleSeek = (e) => {
    const video = videoRef.current
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    const newTime = percentage * duration

    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const changePlaybackRate = (rate) => {
    const video = videoRef.current
    video.playbackRate = rate
    setPlaybackRate(rate)
  }

  return (
    <div className="video-player">
      <div className="video-container">
        {isLoading && (
          <div className="video-loading">
            <div className="loading-spinner"></div>
            <p>视频加载中...</p>
          </div>
        )}

        {error && (
          <div className="video-error">
            <div className="error-icon">⚠️</div>
            <h3>视频加载失败</h3>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="retry-btn"
            >
              重新加载
            </button>
          </div>
        )}

        <video
          ref={videoRef}
          className="video-element"
          onContextMenu={(e) => e.preventDefault()} // 禁用右键菜单防止下载
          controlsList="nodownload" // 禁用下载控件
          disablePictureInPicture // 禁用画中画
          controls // 显示浏览器默认控件
        >
          {videoSources.map((source, index) => (
            <source key={index} src={source.src} type={source.type} />
          ))}
          您的浏览器不支持视频播放。
        </video>

        {/* 自定义播放控制覆盖层 */}
        <div className="video-overlay">
          <div className="chapter-info">
            <h2>{chapter.title}</h2>
            <span className="duration">{chapter.duration}</span>
            {localStorage.getItem(`video-position-${chapter.id}`) && (
              <div className="resume-indicator">
                ⏯️ 继续上次观看位置
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="video-controls">
        <div className="progress-section">
          <div className="time-info">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="progress-bar" onClick={handleSeek}>
            <div
              className="progress-fill"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        <div className="control-buttons">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className="control-btn"
          >
            ⏮ 上一章
          </button>

          <button onClick={togglePlayPause} className="control-btn play-pause">
            {isPlaying ? '⏸ 暂停' : '▶ 播放'}
          </button>

          <button
            onClick={onNext}
            disabled={!hasNext}
            className="control-btn"
          >
            下一章 ⏭
          </button>

          <div className="playback-rate">
            <label>播放速度:</label>
            <select
              value={playbackRate}
              onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
