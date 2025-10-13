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

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    toast({
      title: t.order.successTitle,
      description: `${t.order.successDesc} ${data.email} ${t.order.successTime}`,
    });
    
    e.currentTarget.reset();
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
      props: t.materials.pla.props 
    },
    { 
      name: t.materials.abs.name, 
      image: 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/2c23d8c4-af25-4f74-958b-413d3c9a110f.jpg', 
      props: t.materials.abs.props 
    },
    { 
      name: t.materials.petg.name, 
      image: 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/2be20e02-622a-4be0-8e29-9b564c94e5a1.jpg', 
      props: t.materials.petg.props 
    },
    { 
      name: t.materials.nylon.name, 
      image: 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/79a2beac-5caa-4be8-86e2-be072c8c6fd9.jpg', 
      props: t.materials.nylon.props 
    },
    { 
      name: t.materials.resin.name, 
      image: 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/1fa0eb5f-71e8-43a2-a426-93554f371eb0.jpg', 
      props: t.materials.resin.props 
    },
    { 
      name: t.materials.tpu.name, 
      image: 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/912c640d-8ba8-458e-aee4-c6c6ed9046ca.jpg', 
      props: t.materials.tpu.props 
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