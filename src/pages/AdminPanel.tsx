import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import OrdersList from '@/components/admin/OrdersList';
import PortfolioManagement from '@/components/admin/PortfolioManagement';
import PortfolioDialog from '@/components/admin/PortfolioDialog';
import ClientsManagement from '@/components/admin/ClientsManagement';
import ClientDialog from '@/components/admin/ClientDialog';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import { useOrdersManager } from '@/components/admin/useOrdersManager';
import { usePortfolioManager } from '@/components/admin/usePortfolioManager';
import { useClientsManager } from '@/components/admin/useClientsManager';
import { useExportImport } from '@/components/admin/useExportImport';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [activeTab, setActiveTab] = useState('orders');

  const ordersManager = useOrdersManager();
  const portfolioManager = usePortfolioManager();
  const clientsManager = useClientsManager();
  const exportImportManager = useExportImport(
    portfolioManager.loadPortfolio,
    clientsManager.loadClients
  );

  const login = async () => {
    if (token.trim()) {
      localStorage.setItem('admin_token', token);
      const success = await ordersManager.loadOrders(token);
      if (success) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setToken('');
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
      ordersManager.loadOrders(savedToken).then(success => {
        if (success) {
          setIsAuthenticated(true);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'portfolio') {
      const adminToken = localStorage.getItem('admin_token');
      if (adminToken) {
        portfolioManager.loadPortfolio(adminToken);
      }
    }
    if (isAuthenticated && activeTab === 'clients') {
      const adminToken = localStorage.getItem('admin_token');
      if (adminToken) {
        clientsManager.loadClients(adminToken);
      }
    }
  }, [isAuthenticated, activeTab]);

  if (!isAuthenticated) {
    return (
      <AdminLoginForm
        token={token}
        setToken={setToken}
        error={ordersManager.error}
        loading={ordersManager.loading}
        onLogin={login}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Панель администратора</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportImportManager.exportCompleteSite}>
              <Icon name="Download" size={18} className="mr-2" />
              Скачать сайт
            </Button>
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('import-file')?.click()} 
              disabled={exportImportManager.importing}
            >
              <Icon 
                name={exportImportManager.importing ? "Loader2" : "Upload"} 
                size={18} 
                className={`mr-2 ${exportImportManager.importing ? 'animate-spin' : ''}`} 
              />
              {exportImportManager.importing ? 'Импорт...' : 'Загрузить сайт'}
            </Button>
            <input
              id="import-file"
              type="file"
              accept=".json"
              onChange={exportImportManager.importCompleteSite}
              className="hidden"
            />
            <Button variant="outline" onClick={logout}>
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="orders">
              <Icon name="ShoppingCart" size={18} className="mr-2" />
              Заявки
            </TabsTrigger>
            <TabsTrigger value="portfolio">
              <Icon name="Briefcase" size={18} className="mr-2" />
              Портфолио
            </TabsTrigger>
            <TabsTrigger value="clients">
              <Icon name="Users" size={18} className="mr-2" />
              Клиенты
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <OrdersList
              orders={ordersManager.orders}
              loading={ordersManager.loading}
              expandedOrder={ordersManager.expandedOrder}
              setExpandedOrder={ordersManager.setExpandedOrder}
              updateOrderStatus={ordersManager.updateOrderStatus}
              deleteOrder={ordersManager.deleteOrder}
              exportToExcel={exportImportManager.exportToExcel}
              filterStatus={ordersManager.filterStatus}
              setFilterStatus={ordersManager.setFilterStatus}
              searchEmail={ordersManager.searchEmail}
              setSearchEmail={ordersManager.setSearchEmail}
            />
          </TabsContent>

          <TabsContent value="portfolio">
            <PortfolioManagement
              portfolio={portfolioManager.portfolio}
              loading={portfolioManager.portfolioLoading}
              onEdit={(item) => {
                portfolioManager.setEditingItem(item);
                portfolioManager.setNewItem(item);
                portfolioManager.setIsDialogOpen(true);
              }}
              onDelete={portfolioManager.deletePortfolioItem}
              onAddNew={() => {
                portfolioManager.setEditingItem(null);
                portfolioManager.setNewItem({
                  title: '',
                  description: '',
                  image_url: '',
                  display_order: portfolioManager.portfolio.length + 1,
                  is_visible: true
                });
                portfolioManager.setIsDialogOpen(true);
              }}
            />
            <PortfolioDialog
              isOpen={portfolioManager.isDialogOpen}
              onClose={() => {
                portfolioManager.setIsDialogOpen(false);
                portfolioManager.setEditingItem(null);
              }}
              item={portfolioManager.newItem}
              setItem={portfolioManager.setNewItem}
              onSave={() => portfolioManager.savePortfolioItem(portfolioManager.newItem)}
              uploadingImage={portfolioManager.uploadingImage}
              isDragging={portfolioManager.isDragging}
              onImageUpload={portfolioManager.handleImageUpload}
              onDragOver={portfolioManager.handleDragOver}
              onDragLeave={portfolioManager.handleDragLeave}
              onDrop={portfolioManager.handleDrop}
            />
          </TabsContent>

          <TabsContent value="clients">
            <ClientsManagement
              clients={clientsManager.clients}
              loading={clientsManager.clientsLoading}
              onEdit={(client) => {
                clientsManager.setEditingClient(client);
                clientsManager.setNewClient(client);
                clientsManager.setIsClientDialogOpen(true);
              }}
              onDelete={clientsManager.deleteClient}
              onAddNew={() => {
                clientsManager.setEditingClient(null);
                clientsManager.setNewClient({
                  name: '',
                  logo_url: '',
                  display_order: clientsManager.clients.length + 1,
                  is_visible: true
                });
                clientsManager.setIsClientDialogOpen(true);
              }}
            />
            <ClientDialog
              isOpen={clientsManager.isClientDialogOpen}
              onClose={() => {
                clientsManager.setIsClientDialogOpen(false);
                clientsManager.setEditingClient(null);
              }}
              client={clientsManager.newClient}
              setClient={clientsManager.setNewClient}
              onSave={() => clientsManager.saveClient(clientsManager.newClient)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
