import { useState } from 'react';
import { Order } from '@/components/admin/types';

export function useOrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchEmail, setSearchEmail] = useState('');

  const loadOrders = async (adminToken: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://functions.poehali.dev/df2e7780-9527-410f-8848-48ea6e18479d', {
        method: 'GET',
        headers: {
          'X-Admin-Token': adminToken
        }
      });

      if (response.status === 401) {
        setError('Неверный токен доступа. Проверьте правильность введённого токена.');
        return false;
      }

      if (!response.ok) {
        setError(`Ошибка сервера: ${response.status}`);
        return false;
      }

      const data = await response.json();
      setOrders(data.orders || []);
      return true;
    } catch (err) {
      setError('Ошибка загрузки заявок. Проверьте подключение к интернету.');
      console.error('Orders fetch error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) return;

    try {
      const response = await fetch('https://functions.poehali.dev/1b30405e-8c9f-44e4-b6c7-6a8d3df8a2e8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken
        },
        body: JSON.stringify({ order_id: orderId, status: newStatus })
      });

      if (response.ok) {
        loadOrders(adminToken);
      }
    } catch (err) {
      console.error('Ошибка обновления статуса:', err);
    }
  };

  const deleteOrder = async (orderId: number) => {
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) return;

    if (!confirm('Вы уверены, что хотите удалить эту заявку? Это действие нельзя отменить.')) return;

    try {
      const response = await fetch('https://functions.poehali.dev/df2e7780-9527-410f-8848-48ea6e18479d', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken
        },
        body: JSON.stringify({ order_id: orderId })
      });

      if (response.ok) {
        loadOrders(adminToken);
      } else {
        alert('Ошибка при удалении заявки');
      }
    } catch (err) {
      console.error('Ошибка удаления заявки:', err);
      alert('Ошибка при удалении заявки');
    }
  };

  return {
    orders,
    loading,
    error,
    expandedOrder,
    setExpandedOrder,
    filterStatus,
    setFilterStatus,
    searchEmail,
    setSearchEmail,
    loadOrders,
    updateOrderStatus,
    deleteOrder
  };
}
