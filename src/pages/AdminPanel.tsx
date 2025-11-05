import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import * as XLSX from 'xlsx';

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

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at?: string;
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchEmail, setSearchEmail] = useState('');
  
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newItem, setNewItem] = useState<Partial<PortfolioItem>>({
    title: '',
    description: '',
    image_url: '',
    display_order: 0,
    is_visible: true
  });

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

  const exportToExcel = (ordersToExport: Order[]) => {
    const exportData = ordersToExport.map(order => ({
      'ID заявки': order.id,
      'Дата создания': new Date(order.created_at).toLocaleString('ru-RU'),
      'Статус': statusLabels[order.status],
      'Тип клиента': order.customer_type === 'legal' ? 'Юр. лицо' : 'Физ. лицо',
      'Компания': order.company_name || '-',
      'ИНН': order.inn || '-',
      'Email': order.email,
      'Телефон': order.phone || '-',
      'Длина (мм)': order.length || '-',
      'Ширина (мм)': order.width || '-',
      'Высота (мм)': order.height || '-',
      'Материал': order.plastic_type || '-',
      'Цвет': order.color || '-',
      'Заполнение (%)': order.infill || '-',
      'Количество': order.quantity,
      'Описание': order.description || '-',
      'Файл': order.file_name || '-'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Заявки');

    const colWidths = [
      { wch: 10 }, { wch: 18 }, { wch: 12 }, { wch: 12 },
      { wch: 20 }, { wch: 12 }, { wch: 25 }, { wch: 15 },
      { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 12 },
      { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 40 }, { wch: 20 }
    ];
    worksheet['!cols'] = colWidths;

    const fileName = `Заявки_3DPrint_${new Date().toLocaleDateString('ru-RU').replace(/\./g, '-')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const loadPortfolio = async (adminToken: string) => {
    setPortfolioLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/62b66f50-3759-4932-8376-7ae44620797b', {
        method: 'GET',
        headers: {
          'X-Admin-Token': adminToken
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPortfolio(data.portfolio || []);
      }
    } catch (err) {
      console.error('Ошибка загрузки портфолио:', err);
    } finally {
      setPortfolioLoading(false);
    }
  };

  const savePortfolioItem = async (item: Partial<PortfolioItem>) => {
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) return;

    try {
      const method = item.id ? 'PUT' : 'POST';
      const response = await fetch('https://functions.poehali.dev/62b66f50-3759-4932-8376-7ae44620797b', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken
        },
        body: JSON.stringify(item)
      });

      if (response.ok) {
        loadPortfolio(adminToken);
        setIsDialogOpen(false);
        setEditingItem(null);
        setNewItem({
          title: '',
          description: '',
          image_url: '',
          display_order: 0,
          is_visible: true
        });
      }
    } catch (err) {
      console.error('Ошибка сохранения:', err);
    }
  };

  const deletePortfolioItem = async (id: number) => {
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) return;

    if (!confirm('Удалить эту работу из портфолио?')) return;

    try {
      const response = await fetch('https://functions.poehali.dev/62b66f50-3759-4932-8376-7ae44620797b', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken
        },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        loadPortfolio(adminToken);
      }
    } catch (err) {
      console.error('Ошибка удаления:', err);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://functions.poehali.dev/b08b5e90-3265-4ae3-8494-e33f8fdd77c8', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setNewItem({ ...newItem, image_url: data.url });
      } else {
        alert('Ошибка загрузки изображения');
      }
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      alert('Ошибка загрузки изображения');
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      loadOrders(savedToken);
      loadPortfolio(savedToken);
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="orders">
              <Icon name="ShoppingCart" size={18} className="mr-2" />
              Заявки
            </TabsTrigger>
            <TabsTrigger value="portfolio">
              <Icon name="Image" size={18} className="mr-2" />
              Портфолио
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search-email">Поиск по email</Label>
                <div className="relative">
                  <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="search-email"
                    type="text"
                    placeholder="Введите email..."
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="filter-status">Фильтр по статусу</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="filter-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все заявки</SelectItem>
                    <SelectItem value="new">Новые</SelectItem>
                    <SelectItem value="processing">В работе</SelectItem>
                    <SelectItem value="completed">Выполненные</SelectItem>
                    <SelectItem value="cancelled">Отменённые</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

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
        ) : (() => {
            const filteredOrders = orders.filter(order => {
              const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
              const matchesEmail = !searchEmail || order.email.toLowerCase().includes(searchEmail.toLowerCase());
              return matchesStatus && matchesEmail;
            });

            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    Найдено заявок: {filteredOrders.length} из {orders.length}
                  </h2>
                  <Button 
                    onClick={() => exportToExcel(filteredOrders)}
                    variant="default"
                    disabled={filteredOrders.length === 0}
                  >
                    <Icon name="Download" size={18} className="mr-2" />
                    Экспорт в Excel
                  </Button>
                </div>

                {filteredOrders.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Icon name="Search" size={64} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-xl text-gray-600">Заявки не найдены</p>
                      <p className="text-sm text-gray-500 mt-2">Попробуйте изменить фильтры</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredOrders.map((order) => (
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
            ))
                )}
              </div>
            );
          })()}
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Управление портфолио</CardTitle>
                    <CardDescription>Добавляйте и редактируйте работы в разделе "Наши работы"</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        const adminToken = localStorage.getItem('admin_token');
                        if (adminToken) loadPortfolio(adminToken);
                      }}
                      disabled={portfolioLoading}
                    >
                      {portfolioLoading ? (
                        <>
                          <Icon name="Loader2" size={18} className="animate-spin mr-2" />
                          Загрузка...
                        </>
                      ) : (
                        <>
                          <Icon name="RefreshCw" size={18} className="mr-2" />
                          Обновить
                        </>
                      )}
                    </Button>
                    <Button onClick={() => { setEditingItem(null); setIsDialogOpen(true); }}>
                      <Icon name="Plus" size={18} className="mr-2" />
                      Добавить работу
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {portfolioLoading ? (
                  <div className="text-center py-12">
                    <Icon name="Loader2" size={48} className="animate-spin mx-auto text-primary" />
                    <p className="mt-4 text-gray-600">Загрузка...</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolio.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <div className="aspect-video relative">
                          <img 
                            src={item.image_url} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://placehold.co/600x400?text=Нет+изображения';
                            }}
                          />
                          {!item.is_visible && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                              Скрыто
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                          <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => {
                                setEditingItem(item);
                                setNewItem(item);
                                setIsDialogOpen(true);
                              }}
                            >
                              <Icon name="Edit" size={16} className="mr-1" />
                              Изменить
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => deletePortfolioItem(item.id)}
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Редактировать работу' : 'Добавить работу'}</DialogTitle>
              <DialogDescription>
                Заполните информацию о работе для портфолио
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Название работы</Label>
                <Input
                  id="title"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="Например: Архитектурные модели"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Краткое описание работы"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Изображение</Label>
                <div className="flex gap-2">
                  <Input
                    id="image_url"
                    value={newItem.image_url}
                    onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg или загрузите файл"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploadingImage}
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    {uploadingImage ? (
                      <>
                        <Icon name="Loader2" size={18} className="animate-spin mr-2" />
                        Загрузка...
                      </>
                    ) : (
                      <>
                        <Icon name="Upload" size={18} className="mr-2" />
                        Загрузить
                      </>
                    )}
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                </div>
                {newItem.image_url && (
                  <div className="mt-2 border rounded-lg overflow-hidden">
                    <img 
                      src={newItem.image_url} 
                      alt="Предпросмотр"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/600x400?text=Ошибка+загрузки';
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="display_order">Порядок отображения</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={newItem.display_order}
                    onChange={(e) => setNewItem({ ...newItem, display_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="is_visible">Видимость</Label>
                  <Select 
                    value={newItem.is_visible ? 'true' : 'false'}
                    onValueChange={(value) => setNewItem({ ...newItem, is_visible: value === 'true' })}
                  >
                    <SelectTrigger id="is_visible">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Видимо</SelectItem>
                      <SelectItem value="false">Скрыто</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={() => savePortfolioItem(editingItem ? { ...newItem, id: editingItem.id } : newItem)}>
                <Icon name="Save" size={18} className="mr-2" />
                Сохранить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}