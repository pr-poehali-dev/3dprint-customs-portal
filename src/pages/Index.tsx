import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { translations } from '@/lib/translations';
import Navigation from '@/components/sections/Navigation';
import HeroSection from '@/components/sections/HeroSection';
import TechnologiesSection from '@/components/sections/TechnologiesSection';
import MaterialsSection from '@/components/sections/MaterialsSection';
import PortfolioSection from '@/components/sections/PortfolioSection';
import OrderSection from '@/components/sections/OrderSection';
import ContactsSection from '@/components/sections/ContactsSection';
import ClientsSection from '@/components/sections/ClientsSection';
import Footer from '@/components/sections/Footer';
import BackgroundShapes from '@/components/BackgroundShapes';

const Index = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'ru' | 'en' | 'zh'>('ru');
  
  const t = translations[language];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('model') as File;
    
    let fileBase64 = '';
    let fileName = '';
    
    if (file && file.size > 0) {
      fileName = file.name;
      const reader = new FileReader();
      fileBase64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64.split(',')[1]);
        };
        reader.readAsDataURL(file);
      });
    }
    
    const data = {
      length: formData.get('length'),
      width: formData.get('width'),
      height: formData.get('height'),
      plastic: formData.get('plastic'),
      color: formData.get('color'),
      infill: formData.get('infill'),
      quantity: formData.get('quantity'),
      description: formData.get('description'),
      customerType: formData.get('customerType'),
      companyName: formData.get('companyName'),
      inn: formData.get('inn'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      fileName,
      fileBase64,
    };
    
    try {
      const response = await fetch('https://functions.poehali.dev/f1f77e68-f10f-4dd3-beb4-47bb23587a7c', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (result.success) {
        const orderNumberText = typeof t.order.orderNumber !== 'undefined' ? t.order.orderNumber : 'Номер заказа:';
        toast({
          title: t.order.successTitle,
          description: `${t.order.successDesc} ${data.email} ${t.order.successTime}\n\n${orderNumberText} ${result.orderNumber}`,
        });
        
        e.currentTarget.reset();
      } else {
        toast({
          title: 'Ошибка',
          description: 'Не удалось отправить заказ. Попробуйте позже.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Ошибка отправки заказа:', error);
      toast({
        title: 'Ошибка',
        description: `Не удалось отправить заказ: ${error instanceof Error ? error.message : 'Проверьте соединение'}`,
        variant: 'destructive',
      });
    }
  };

  const technologies = [
    { icon: 'Box', name: t.technologies.fdm.name, desc: t.technologies.fdm.desc },
    { icon: 'Layers', name: t.technologies.sla.name, desc: t.technologies.sla.desc },
    { icon: 'Zap', name: t.technologies.dla.name, desc: t.technologies.dla.desc },
  ];

  const materials = [
    { 
      name: t.materials.pla.name, 
      image: 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/bd8567ab-a249-49ce-8d87-a9e4e6a16f0a.jpg', 
      props: t.materials.pla.props,
      advantages: t.materials.pla.advantages
    },
    { 
      name: t.materials.abs.name, 
      image: 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/2c23d8c4-af25-4f74-958b-413d3c9a110f.jpg', 
      props: t.materials.abs.props,
      advantages: t.materials.abs.advantages
    },
    { 
      name: t.materials.petg.name, 
      image: 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/2be20e02-622a-4be0-8e29-9b564c94e5a1.jpg', 
      props: t.materials.petg.props,
      advantages: t.materials.petg.advantages
    },
    { 
      name: t.materials.nylon.name, 
      image: 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/79a2beac-5caa-4be8-86e2-be072c8c6fd9.jpg', 
      props: t.materials.nylon.props,
      advantages: t.materials.nylon.advantages
    },
    { 
      name: t.materials.resin.name, 
      image: 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/1fa0eb5f-71e8-43a2-a426-93554f371eb0.jpg', 
      props: t.materials.resin.props,
      advantages: t.materials.resin.advantages
    },
    { 
      name: t.materials.tpu.name, 
      image: 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/912c640d-8ba8-458e-aee4-c6c6ed9046ca.jpg', 
      props: t.materials.tpu.props,
      advantages: t.materials.tpu.advantages
    },
  ];

  const portfolio = t.portfolio.items;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 geometric-bg">
      <BackgroundShapes />
      
      <Navigation
        activeSection={activeSection}
        mobileMenuOpen={mobileMenuOpen}
        language={language}
        t={t}
        scrollToSection={scrollToSection}
        setMobileMenuOpen={setMobileMenuOpen}
        setLanguage={setLanguage}
      />

      <HeroSection t={t} scrollToSection={scrollToSection} />
      
      <TechnologiesSection t={t} technologies={technologies} />
      
      <MaterialsSection t={t} materials={materials} />
      
      <PortfolioSection t={t} portfolio={portfolio} />
      
      <OrderSection t={t} handleFormSubmit={handleFormSubmit} />
      
      <ContactsSection t={t} />
      
      <ClientsSection t={t} />
      
      <Footer />
    </div>
  );
};

export default Index;