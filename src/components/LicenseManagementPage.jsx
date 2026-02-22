import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import deviceFingerprintService from '../services/deviceFingerprintService';

const LicenseManagementPage = () => {
  const navigate = useNavigate();
  const [deviceBindings, setDeviceBindings] = useState([]);
  const [currentFingerprint, setCurrentFingerprint] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId] = useState('user_' + Date.now()); // Simulated user ID

  useEffect(() => {
    loadLicenseData();
  }, [userId]);

  const loadLicenseData = () => {
    setLoading(true);
    try {
      // Load bindings from storage
      deviceFingerprintService.loadBindingsFromStorage();

      // Get all bindings for this user
      const allBindings = Array.from(deviceFingerprintService.deviceBindings.values());
      const userBindings = allBindings.filter(binding => binding.userId === userId);

      setDeviceBindings(userBindings);
      setCurrentFingerprint(deviceFingerprintService.getCurrentDeviceFingerprint());
    } catch (error) {
      console.error('Failed to load license data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeAccess = (courseId) => {
    if (window.confirm('确定要撤销此课程的访问权限吗？撤销后需要重新激活才能访问。')) {
      const success = deviceFingerprintService.revokeDeviceAccess(userId, courseId);
      if (success) {
        loadLicenseData(); // Refresh the data
        alert('访问权限已撤销');
      } else {
        alert('撤销失败，请重试');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const getStatusBadge = (isValid) => {
    return isValid ? (
      <span className="status-badge active">有效</span>
    ) : (
      <span className="status-badge inactive">已失效</span>
    );
  };

  if (loading) {
    return (
      <div className="license-management-page">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  return (
    <div className="license-management-page">
      <header className="page-header">
        <button onClick={() => navigate('/')} className="back-btn">
          ← 返回课程列表
        </button>
        <h1>许可证管理</h1>
      </header>

      <div className="current-device">
        <h2>当前设备信息</h2>
        <div className="device-info">
          <p><strong>设备指纹：</strong></p>
          <code className="fingerprint">{currentFingerprint}</code>
        </div>
      </div>

      <div className="device-bindings">
        <h2>已绑定的课程许可证</h2>

        {deviceBindings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔐</div>
            <h3>暂无绑定的许可证</h3>
            <p>您还没有购买任何课程</p>
            <button onClick={() => navigate('/')} className="action-btn">
              去购买课程
            </button>
          </div>
        ) : (
          <div className="bindings-list">
            {deviceBindings.map((binding) => (
              <div key={`${binding.userId}_${binding.courseId}`} className="binding-item">
                <div className="binding-header">
                  <div className="binding-info">
                    <span className="course-id">课程ID：{binding.courseId}</span>
                    {getStatusBadge(binding.isValid)}
                  </div>
                  {binding.isValid && (
                    <button
                      className="revoke-button"
                      onClick={() => handleRevokeAccess(binding.courseId)}
                    >
                      撤销访问
                    </button>
                  )}
                </div>

                <div className="binding-details">
                  <div className="detail-row">
                    <span className="label">许可证密钥：</span>
                    <code className="license-key">{binding.licenseKey}</code>
                  </div>

                  <div className="detail-row">
                    <span className="label">设备指纹：</span>
                    <code className="device-fingerprint">{binding.deviceFingerprint}</code>
                  </div>

                  <div className="detail-row">
                    <span className="label">绑定时间：</span>
                    <span>{formatDate(binding.boundAt)}</span>
                  </div>

                  <div className="detail-row">
                    <span className="label">最后访问：</span>
                    <span>{formatDate(binding.lastAccessAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LicenseManagementPage;