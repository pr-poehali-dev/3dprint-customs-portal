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
    { name: t.materials.pla.name, color: 'bg-green-500', props: t.materials.pla.props },
    { name: t.materials.abs.name, color: 'bg-blue-500', props: t.materials.abs.props },
    { name: t.materials.petg.name, color: 'bg-purple-500', props: t.materials.petg.props },
    { name: t.materials.nylon.name, color: 'bg-orange-500', props: t.materials.nylon.props },
    { name: t.materials.resin.name, color: 'bg-pink-500', props: t.materials.resin.props },
    { name: t.materials.tpu.name, color: 'bg-yellow-500', props: t.materials.tpu.props },
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