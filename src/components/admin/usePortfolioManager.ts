import { useState } from 'react';
import { PortfolioItem } from '@/components/admin/types';

export function usePortfolioManager() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [newItem, setNewItem] = useState<Partial<PortfolioItem>>({
    title: '',
    description: '',
    image_url: '',
    display_order: 0,
    is_visible: true
  });

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
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  return {
    portfolio,
    portfolioLoading,
    editingItem,
    setEditingItem,
    isDialogOpen,
    setIsDialogOpen,
    uploadingImage,
    isDragging,
    newItem,
    setNewItem,
    loadPortfolio,
    savePortfolioItem,
    deletePortfolioItem,
    handleImageUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
}
