import { useState } from 'react';
import { ClientItem } from '@/components/admin/types';

export function useClientsManager() {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientItem | null>(null);
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState<Partial<ClientItem>>({
    name: '',
    logo_url: '',
    display_order: 0,
    is_visible: true
  });

  const loadClients = async (adminToken: string) => {
    setClientsLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/e9de2896-8e7d-4fc8-aaa0-e00876a2f5b1', {
        method: 'GET',
        headers: {
          'X-Admin-Token': adminToken
        }
      });

      if (response.ok) {
        const data = await response.json();
        setClients(data.clients || []);
      }
    } catch (err) {
      console.error('Ошибка загрузки клиентов:', err);
    } finally {
      setClientsLoading(false);
    }
  };

  const saveClient = async (client: Partial<ClientItem>) => {
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) return;

    try {
      const method = client.id ? 'PUT' : 'POST';
      const response = await fetch('https://functions.poehali.dev/e9de2896-8e7d-4fc8-aaa0-e00876a2f5b1', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken
        },
        body: JSON.stringify(client)
      });

      if (response.ok) {
        loadClients(adminToken);
        setIsClientDialogOpen(false);
        setEditingClient(null);
        setNewClient({
          name: '',
          logo_url: '',
          display_order: 0,
          is_visible: true
        });
      }
    } catch (err) {
      console.error('Ошибка сохранения клиента:', err);
    }
  };

  const deleteClient = async (id: number) => {
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) return;

    if (!confirm('Удалить этого клиента?')) return;

    try {
      const response = await fetch('https://functions.poehali.dev/e9de2896-8e7d-4fc8-aaa0-e00876a2f5b1', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken
        },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        loadClients(adminToken);
      }
    } catch (err) {
      console.error('Ошибка удаления клиента:', err);
    }
  };

  return {
    clients,
    clientsLoading,
    editingClient,
    setEditingClient,
    isClientDialogOpen,
    setIsClientDialogOpen,
    newClient,
    setNewClient,
    loadClients,
    saveClient,
    deleteClient
  };
}
