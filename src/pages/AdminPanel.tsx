import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface Order {
  id: number;
  customer_type: string;
  company_name?: string;
  inn?: string;
  email: string;
  phone?: string;
  length?: number;
  width?: number;
  height?: number;
  plastic_type?: string;
  color?: string;
  infill?: number;
  quantity: number;
  description?: string;
  file_url?: string;
  file_name?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const statusLabels: Record<string, string> = {
  new: 'Новая',
  processing: 'В работе',
  completed: 'Выполнена',
  cancelled: 'Отменена'
};

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  processing: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const login = () => {
    if (token.trim()) {
      localStorage.setItem('admin_token', token);
      setIsAuthenticated(true);
      loadOrders(token);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setToken('');
    setOrders([]);
  };

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
        setError('Неверный токен доступа');
        logout();
        return;
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError('Ошибка загрузки заявок');
      console.error(err);
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

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      loadOrders(savedToken);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Lock" size={24} />
              Вход в админ-панель
            </CardTitle>
            <CardDescription>Введите токен доступа для управления заявками</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token">Токен доступа</Label>
              <Input
                id="token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && login()}
                placeholder="Введите токен"
              />
            </div>
            <Button onClick={login} className="w-full">
              <Icon name="LogIn" size={18} className="mr-2" />
              Войти
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Icon name="LayoutDashboard" size={28} className="text-primary" />
            <h1 className="text-2xl font-bold">Админ-панель</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => loadOrders(token)}>
              <Icon name="RefreshCw" size={18} className="mr-2" />
              Обновить
            </Button>
            <Button variant="outline" onClick={logout}>
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <Icon name="AlertCircle" className="text-red-600" size={24} />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <Icon name="Loader2" size={48} className="animate-spin mx-auto text-primary" />
            <p className="mt-4 text-gray-600">Загрузка заявок...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Icon name="Inbox" size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gray-600">Заявок пока нет</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Всего заявок: {orders.length}</h2>
            </div>

            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-3">
                        <span>Заявка #{order.id}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                          {statusLabels[order.status]}
                        </span>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {order.email} • {new Date(order.created_at).toLocaleString('ru-RU')}
                      </CardDescription>
                    </div>
                    <Icon 
                      name={expandedOrder === order.id ? "ChevronUp" : "ChevronDown"} 
                      size={24} 
                      className="text-gray-400"
                    />
                  </div>
                </CardHeader>

                {expandedOrder === order.id && (
                  <CardContent className="border-t bg-gray-50 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Icon name="User" size={18} />
                          Информация о клиенте
                        </h3>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Тип:</span> {order.customer_type === 'legal' ? 'Юр. лицо' : 'Физ. лицо'}</p>
                          {order.company_name && <p><span className="font-medium">Компания:</span> {order.company_name}</p>}
                          {order.inn && <p><span className="font-medium">ИНН:</span> {order.inn}</p>}
                          <p><span className="font-medium">Email:</span> {order.email}</p>
                          {order.phone && <p><span className="font-medium">Телефон:</span> {order.phone}</p>}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Icon name="Box" size={18} />
                          Параметры печати
                        </h3>
                        <div className="space-y-2 text-sm">
                          {order.length && <p><span className="font-medium">Размеры:</span> {order.length}×{order.width}×{order.height} мм</p>}
                          {order.plastic_type && <p><span className="font-medium">Материал:</span> {order.plastic_type}</p>}
                          {order.color && <p><span className="font-medium">Цвет:</span> {order.color}</p>}
                          {order.infill && <p><span className="font-medium">Заполнение:</span> {order.infill}%</p>}
                          <p><span className="font-medium">Количество:</span> {order.quantity} шт</p>
                        </div>
                      </div>
                    </div>

                    {order.description && (
                      <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <Icon name="FileText" size={18} />
                          Описание
                        </h3>
                        <p className="text-sm bg-white p-4 rounded-lg border">{order.description}</p>
                      </div>
                    )}

                    {order.file_url && (
                      <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <Icon name="Paperclip" size={18} />
                          Файл модели
                        </h3>
                        <a 
                          href={order.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-primary hover:underline"
                        >
                          <Icon name="Download" size={16} />
                          {order.file_name || 'Скачать файл'}
                        </a>
                      </div>
                    )}

                    <div className="pt-4 border-t">
                      <Label className="mb-2 block">Изменить статус</Label>
                      <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                        <SelectTrigger className="w-full md:w-64">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Новая</SelectItem>
                          <SelectItem value="processing">В работе</SelectItem>
                          <SelectItem value="completed">Выполнена</SelectItem>
                          <SelectItem value="cancelled">Отменена</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
