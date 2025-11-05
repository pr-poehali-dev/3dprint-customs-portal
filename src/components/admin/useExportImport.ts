import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Order, statusLabels } from '@/components/admin/types';

export function useExportImport(loadPortfolio: (token: string) => void, loadClients: (token: string) => void) {
  const [importing, setImporting] = useState(false);

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

  const exportCompleteSite = async () => {
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) return;

    try {
      console.log('Начинаем экспорт данных...');
      
      let ordersData = { orders: [] };
      let portfolioData = { portfolio: [] };
      let clientsData = { clients: [] };

      try {
        console.log('Загрузка заявок...');
        const ordersRes = await fetch('https://functions.poehali.dev/df2e7780-9527-410f-8848-48ea6e18479d', {
          method: 'GET',
          headers: { 
            'X-Admin-Token': adminToken,
            'Content-Type': 'application/json'
          }
        });
        if (ordersRes.ok) {
          ordersData = await ordersRes.json();
          console.log('Заявки загружены:', ordersData);
        } else {
          console.warn('Не удалось загрузить заявки:', ordersRes.status);
        }
      } catch (err) {
        console.warn('Ошибка загрузки заявок:', err);
      }

      try {
        console.log('Загрузка портфолио...');
        const portfolioRes = await fetch('https://functions.poehali.dev/62b66f50-3759-4932-8376-7ae44620797b', {
          method: 'GET',
          headers: { 
            'X-Admin-Token': adminToken,
            'Content-Type': 'application/json'
          }
        });
        if (portfolioRes.ok) {
          portfolioData = await portfolioRes.json();
          console.log('Портфолио загружено:', portfolioData);
        } else {
          console.warn('Не удалось загрузить портфолио:', portfolioRes.status);
        }
      } catch (err) {
        console.warn('Ошибка загрузки портфолио:', err);
      }

      try {
        console.log('Загрузка клиентов...');
        const clientsRes = await fetch('https://functions.poehali.dev/e9de2896-8e7d-4fc8-aaa0-e00876a2f5b1', {
          method: 'GET',
          headers: { 
            'X-Admin-Token': adminToken,
            'Content-Type': 'application/json'
          }
        });
        if (clientsRes.ok) {
          clientsData = await clientsRes.json();
          console.log('Клиенты загружены:', clientsData);
        } else {
          console.warn('Не удалось загрузить клиентов:', clientsRes.status);
        }
      } catch (err) {
        console.warn('Ошибка загрузки клиентов:', err);
      }

      console.log('Все данные загружены, создаём экспорт...');

      const exportData = {
        project_info: {
          name: '3D Print Service',
          export_date: new Date().toISOString(),
          platform: 'poehali.dev',
          domain: window.location.hostname
        },
        tech_stack: {
          frontend: 'React + TypeScript + Vite + Tailwind CSS',
          backend: 'Python 3.11 Cloud Functions',
          database: 'PostgreSQL',
          ui_library: 'shadcn/ui'
        },
        backend_functions: [
          { name: 'orders-get', url: 'https://functions.poehali.dev/df2e7780-9527-410f-8848-48ea6e18479d', description: 'Управление заявками' },
          { name: 'send-order', url: 'https://functions.poehali.dev/4e39cc6e-4dca-4b45-9636-bf45d5c74b3f', description: 'Создание новой заявки' },
          { name: 'order-update-status', url: 'https://functions.poehali.dev/1b30405e-8c9f-44e4-b6c7-6a8d3df8a2e8', description: 'Обновление статуса заявки' },
          { name: 'portfolio-admin', url: 'https://functions.poehali.dev/62b66f50-3759-4932-8376-7ae44620797b', description: 'Управление портфолио' },
          { name: 'clients-get', url: 'https://functions.poehali.dev/e9de2896-8e7d-4fc8-aaa0-e00876a2f5b1', description: 'Управление клиентами' }
        ],
        database: {
          orders: ordersData.orders || [],
          portfolio: portfolioData.portfolio || [],
          clients: clientsData.clients || []
        },
        secrets: {
          note: 'Значения секретов не экспортируются по соображениям безопасности. Указаны только названия.',
          required: [
            'DATABASE_URL - строка подключения к PostgreSQL',
            'ADMIN_TOKEN - токен доступа к админ-панели'
          ]
        },
        instructions: {
          deployment: 'Проект развернут на платформе poehali.dev',
          github_integration: 'Для получения исходного кода подключите GitHub через кнопку "Скачать → Подключить GitHub"',
          build_download: 'Для скачивания статической версии сайта используйте "Скачать → Скачать билд"'
        }
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `3DPrint_Complete_Export_${new Date().toLocaleDateString('ru-RU').replace(/\./g, '-')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('Экспорт успешно завершен!');
      alert('✅ Экспорт завершен! Файл содержит все данные о сайте, функциях и базе данных.');
    } catch (err) {
      console.error('❌ Ошибка экспорта:', err);
      alert(`❌ Ошибка при экспорте данных:\n${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const importCompleteSite = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) return;

    setImporting(true);

    try {
      const text = await file.text();
      const importData = JSON.parse(text);

      if (!importData.database) {
        alert('❌ Неверный формат файла');
        return;
      }

      const portfolioItems = importData.database.portfolio || [];
      const clientItems = importData.database.clients || [];

      let successCount = 0;
      let errorCount = 0;

      for (const item of portfolioItems) {
        try {
          const { id, ...itemData } = item;
          await fetch('https://functions.poehali.dev/62b66f50-3759-4932-8376-7ae44620797b', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Admin-Token': adminToken
            },
            body: JSON.stringify(itemData)
          });
          successCount++;
        } catch (err) {
          console.error('Ошибка импорта портфолио:', err);
          errorCount++;
        }
      }

      for (const item of clientItems) {
        try {
          const { id, ...itemData } = item;
          await fetch('https://functions.poehali.dev/e9de2896-8e7d-4fc8-aaa0-e00876a2f5b1', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Admin-Token': adminToken
            },
            body: JSON.stringify(itemData)
          });
          successCount++;
        } catch (err) {
          console.error('Ошибка импорта клиентов:', err);
          errorCount++;
        }
      }

      loadPortfolio(adminToken);
      loadClients(adminToken);

      if (errorCount === 0) {
        alert(`✅ Импорт завершен! Импортировано элементов: ${successCount}`);
      } else {
        alert(`⚠️ Импорт завершен с ошибками.\nУспешно: ${successCount}\nОшибок: ${errorCount}`);
      }

      event.target.value = '';
    } catch (err) {
      console.error('Ошибка импорта:', err);
      alert('❌ Ошибка при импорте данных. Проверьте формат файла.');
    } finally {
      setImporting(false);
    }
  };

  return {
    importing,
    exportToExcel,
    exportCompleteSite,
    importCompleteSite
  };
}
