import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import orderManagementService from '../services/orderManagementService';

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);
  const [userId] = useState('user_' + Date.now()); // Simulated user ID

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = () => {
    setLoading(true);
    try {
      const userOrders = orderManagementService.getUserOrders(userId);
      const userPaymentRecords = orderManagementService.getUserPaymentRecords(userId);

      setOrders(userOrders);
      setPaymentRecords(userPaymentRecords);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'paid': return '#27ae60';
      case 'completed': return '#2ecc71';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '待支付';
      case 'paid': return '已支付';
      case 'completed': return '已完成';
      case 'cancelled': return '已取消';
      default: return '未知状态';
    }
  };

  if (loading) {
    return (
      <div className="order-history-page">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <header className="page-header">
        <button onClick={() => navigate('/')} className="back-btn">
          ← 返回课程列表
        </button>
        <h1>订单记录</h1>
      </header>

      <div className="history-tabs">
        <button
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          订单列表 ({orders.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          支付记录 ({paymentRecords.length})
        </button>
      </div>

      {activeTab === 'orders' && (
        <div className="orders-section">
          {orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>暂无订单记录</h3>
              <p>您还没有购买任何课程</p>
              <button onClick={() => navigate('/')} className="action-btn">
                去购买课程
              </button>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.orderId} className="order-item">
                  <div className="order-header">
                    <span className="order-id">订单号：{order.orderId}</span>
                    <span
                      className="order-status"
                      style={{ color: getStatusColor(order.status) }}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="order-details">
                    <div className="order-info">
                      <span>课程ID：{order.courseId}</span>
                      <span>金额：¥{order.amount}</span>
                      <span>支付方式：{order.paymentMethod === 'wechat' ? '微信支付' : '激活码'}</span>
                    </div>
                    <div className="order-time">
                      <span>创建时间：{formatDate(order.createdAt)}</span>
                      {order.paidAt && (
                        <span>支付时间：{formatDate(order.paidAt)}</span>
                      )}
                      {order.completedAt && (
                        <span>完成时间：{formatDate(order.completedAt)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="payments-section">
          {paymentRecords.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💳</div>
              <h3>暂无支付记录</h3>
              <p>您还没有完成任何支付</p>
            </div>
          ) : (
            <div className="payments-list">
              {paymentRecords.map((record) => (
                <div key={record.recordId} className="payment-item">
                  <div className="payment-header">
                    <span className="payment-id">交易号：{record.transactionId}</span>
                    <span className="payment-amount">¥{record.amount}</span>
                  </div>
                  <div className="payment-details">
                    <div className="payment-info">
                      <span>订单号：{record.orderId}</span>
                      <span>支付方式：{record.paymentMethod === 'wechat' ? '微信支付' : '激活码'}</span>
                    </div>
                    <div className="payment-time">
                      <span>支付时间：{formatDate(record.recordedAt)}</span>
                    </div>
                    {record.details && Object.keys(record.details).length > 0 && (
                      <div className="payment-extra">
                        <strong>附加信息：</strong>
                        <pre>{JSON.stringify(record.details, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;