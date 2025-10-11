import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { translations } from '@/lib/translations';

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
      <div className="floating-cube" style={{ top: '10%', left: '5%', animationDelay: '0s' }}></div>
      <div className="floating-cube" style={{ top: '60%', right: '10%', animationDelay: '2s' }}></div>
      <div className="floating-shape shape-circle" style={{ top: '20%', right: '15%', animationDelay: '1s' }}></div>
      <div className="floating-shape shape-triangle" style={{ bottom: '15%', left: '8%', animationDelay: '3s' }}></div>
      <div className="floating-shape shape-hexagon" style={{ top: '45%', left: '12%', animationDelay: '4s' }}></div>
      <div className="floating-shape shape-circle" style={{ bottom: '25%', right: '20%', animationDelay: '2.5s' }}></div>
      <div className="floating-shape shape-triangle" style={{ top: '70%', right: '5%', animationDelay: '5s' }}></div>
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://cdn.poehali.dev/files/3c3906bd-e851-4dbd-8fe8-2b8a7acff3cc.jpg" 
                alt="3DPrintCustoms Logo" 
                className="w-12 h-12 object-contain rounded-xl"
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                3DPrintCustoms
              </h1>
            </div>
            <div className="hidden md:flex gap-6 items-center">
              {[
                { id: 'home', label: t.nav.home, color: 'from-blue-600 to-cyan-500' },
                { id: 'technologies', label: t.nav.technologies, color: 'from-purple-600 to-pink-500' },
                { id: 'materials', label: t.nav.materials, color: 'from-green-600 to-emerald-500' },
                { id: 'portfolio', label: t.nav.portfolio, color: 'from-orange-600 to-yellow-500' },
                { id: 'order', label: t.nav.order, color: 'from-pink-600 to-rose-500' },
                { id: 'contacts', label: t.nav.contacts, color: 'from-indigo-600 to-purple-500' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`font-medium transition-all duration-200 relative group ${
                    activeSection === item.id ? `bg-gradient-to-r ${item.color} bg-clip-text text-transparent` : 'text-gray-600 hover:opacity-80'
                  }`}
                >
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r ${item.color} transition-all duration-200 ${
                    activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </button>
              ))}
              <div className="flex gap-2 ml-4 border-l pl-4">
                <button
                  onClick={() => setLanguage('ru')}
                  className={`px-2 py-1 rounded text-sm font-medium transition-all ${language === 'ru' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  RU
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 rounded text-sm font-medium transition-all ${language === 'en' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('zh')}
                  className={`px-2 py-1 rounded text-sm font-medium transition-all ${language === 'zh' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  中文
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="md:hidden flex gap-1">
                <button
                  onClick={() => setLanguage('ru')}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${language === 'ru' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  RU
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${language === 'en' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('zh')}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${language === 'zh' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  中文
                </button>
              </div>
              <button
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={24} />
              </button>
            </div>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-gray-200 space-y-2 animate-in slide-in-from-top-5 duration-200">
              {[
                { id: 'home', label: t.nav.home, color: 'from-blue-600 to-cyan-500' },
                { id: 'technologies', label: t.nav.technologies, color: 'from-purple-600 to-pink-500' },
                { id: 'materials', label: t.nav.materials, color: 'from-green-600 to-emerald-500' },
                { id: 'portfolio', label: t.nav.portfolio, color: 'from-orange-600 to-yellow-500' },
                { id: 'order', label: t.nav.order, color: 'from-pink-600 to-rose-500' },
                { id: 'contacts', label: t.nav.contacts, color: 'from-indigo-600 to-purple-500' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeSection === item.id
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      <section id="home" className="pt-32 pb-20 px-4 relative">
        <div className="container mx-auto text-center relative z-10">
          <div className="mb-8 inline-block">
            <Badge className="text-lg px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600">
              {t.hero.badge}
            </Badge>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
            {t.hero.title}<br />{t.hero.titleBreak}
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="text-lg px-8" onClick={() => scrollToSection('contacts')}>
              {t.hero.contactBtn}
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => scrollToSection('portfolio')}>
              {t.hero.portfolioBtn}
            </Button>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: 'Zap', title: t.hero.feature1Title, desc: t.hero.feature1Desc },
              { icon: 'Award', title: t.hero.feature2Title, desc: t.hero.feature2Desc },
              { icon: 'Users', title: t.hero.feature3Title, desc: t.hero.feature3Desc },
            ].map((item) => (
              <Card key={item.title} className="border-2 hover:border-primary transition-all hover:shadow-lg group cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <Icon name={item.icon} className="text-white" size={24} />
                  </div>
                  <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="technologies" className="py-20 px-4 relative">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t.technologies.title}
            </h2>
            <p className="text-xl text-gray-600">{t.technologies.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {technologies.map((tech) => (
              <Card key={tech.name} className="group hover:shadow-xl transition-all border-2 hover:border-primary cursor-pointer">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Icon name={tech.icon} className="text-white" size={32} />
                  </div>
                  <CardTitle className="text-2xl">{tech.name}</CardTitle>
                  <CardDescription className="text-base">{tech.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon name="Check" className="text-green-600" size={20} />
                      <span className="text-sm">{t.technologies.check1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Check" className="text-green-600" size={20} />
                      <span className="text-sm">{t.technologies.check2}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Check" className="text-green-600" size={20} />
                      <span className="text-sm">{t.technologies.check3}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="materials" className="py-20 px-4 relative">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t.materials.title}
            </h2>
            <p className="text-xl text-gray-600">{t.materials.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
              <Card key={material.name} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${material.color} rounded-lg`}></div>
                    <div>
                      <CardTitle className="text-xl">{material.name}</CardTitle>
                      <CardDescription>{material.props}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">{t.materials.info}</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Badge variant="outline" className="text-base px-4 py-2">{t.materials.badge1}</Badge>
              <Badge variant="outline" className="text-base px-4 py-2">{t.materials.badge2}</Badge>
              <Badge variant="outline" className="text-base px-4 py-2">{t.materials.badge3}</Badge>
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" className="py-20 px-4 relative">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t.portfolio.title}
            </h2>
            <p className="text-xl text-gray-600">{t.portfolio.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolio.map((item, index) => (
              <Card key={index} className="group overflow-hidden hover:shadow-xl transition-all border-2 hover:border-primary cursor-pointer">
                <div className="h-64 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
                  <Icon name="Box" className="text-gray-300 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" size={120} />
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">{item.title}</CardTitle>
                  <CardDescription className="text-base">{item.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    {t.portfolio.detailsBtn}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      <section id="order" className="py-20 px-4 relative">
        <div className="container mx-auto max-w-3xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t.order.sectionTitle}
            </h2>
            <p className="text-xl text-gray-600">{t.order.sectionSubtitle}</p>
          </div>
          
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">{t.order.title}</CardTitle>
              <CardDescription>{t.order.subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="order-length">{t.order.length}</Label>
                    <Input id="order-length" name="length" type="number" placeholder="100" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order-width">{t.order.width}</Label>
                    <Input id="order-width" name="width" type="number" placeholder="100" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order-height">{t.order.height}</Label>
                    <Input id="order-height" name="height" type="number" placeholder="100" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="plastic-type">{t.order.plastic}</Label>
                  <Select name="plastic" required>
                    <SelectTrigger id="plastic-type">
                      <SelectValue placeholder={t.order.plasticPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pla">{t.order.plasticOptions.pla}</SelectItem>
                      <SelectItem value="abs">{t.order.plasticOptions.abs}</SelectItem>
                      <SelectItem value="petg">{t.order.plasticOptions.petg}</SelectItem>
                      <SelectItem value="nylon">{t.order.plasticOptions.nylon}</SelectItem>
                      <SelectItem value="resin">{t.order.plasticOptions.resin}</SelectItem>
                      <SelectItem value="tpu">{t.order.plasticOptions.tpu}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="color">{t.order.color}</Label>
                  <Select name="color" required>
                    <SelectTrigger id="color">
                      <SelectValue placeholder={t.order.colorPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="white">{t.order.colorOptions.white}</SelectItem>
                      <SelectItem value="black">{t.order.colorOptions.black}</SelectItem>
                      <SelectItem value="red">{t.order.colorOptions.red}</SelectItem>
                      <SelectItem value="blue">{t.order.colorOptions.blue}</SelectItem>
                      <SelectItem value="green">{t.order.colorOptions.green}</SelectItem>
                      <SelectItem value="yellow">{t.order.colorOptions.yellow}</SelectItem>
                      <SelectItem value="orange">{t.order.colorOptions.orange}</SelectItem>
                      <SelectItem value="purple">{t.order.colorOptions.purple}</SelectItem>
                      <SelectItem value="gray">{t.order.colorOptions.gray}</SelectItem>
                      <SelectItem value="transparent">{t.order.colorOptions.transparent}</SelectItem>
                      <SelectItem value="custom">{t.order.colorOptions.custom}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="infill">{t.order.infill}</Label>
                  <Input id="infill" name="infill" type="number" min="10" max="100" placeholder="20" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">{t.order.quantity}</Label>
                  <Input id="quantity" name="quantity" type="number" min="1" placeholder="1" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model-file">{t.order.file}</Label>
                  <Input id="model-file" name="model" type="file" accept=".stl,.step,.dwg,.obj,.3mf" />
                  <p className="text-xs text-gray-500">{t.order.fileFormats}</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="order-description">{t.order.description}</Label>
                  <Textarea 
                    id="order-description" 
                    name="description" 
                    placeholder={t.order.descriptionPlaceholder} 
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-email">{t.order.email}</Label>
                  <Input id="contact-email" name="email" type="email" placeholder="example@mail.com" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">{t.order.phone}</Label>
                  <Input id="contact-phone" name="phone" type="tel" placeholder="+7 (999) 123-45-67" />
                </div>
                
                <Button type="submit" size="lg" className="w-full text-lg py-6">
                  <Icon name="Send" className="mr-2" size={20} />
                  {t.order.submit}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="contacts" className="py-20 px-4 relative">
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t.contacts.title}
            </h2>
            <p className="text-xl text-gray-600">{t.contacts.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg group cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Icon name="Mail" className="text-white" size={24} />
                </div>
                <CardTitle>{t.contacts.email}</CardTitle>
                <CardDescription className="text-base">{t.contacts.emailValue}</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg group cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Icon name="MapPin" className="text-white" size={24} />
                </div>
                <CardTitle>{t.contacts.address}</CardTitle>
                <CardDescription className="text-base">{t.contacts.addressValue}</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="mt-12 text-center">
            <div className="flex justify-center gap-4 flex-wrap">
              <Badge variant="outline" className="text-base px-4 py-2">{t.contacts.badge1}</Badge>
              <Badge variant="outline" className="text-base px-4 py-2">{t.contacts.badge2}</Badge>
              <Badge variant="outline" className="text-base px-4 py-2">{t.contacts.badge3}</Badge>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-gray-900 to-blue-900 text-white py-12 px-4 relative z-50">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img 
              src="https://cdn.poehali.dev/files/3c3906bd-e851-4dbd-8fe8-2b8a7acff3cc.jpg" 
              alt="3DPrintCustoms Logo" 
              className="w-12 h-12 object-contain rounded-xl"
            />
            <h3 className="text-2xl font-bold">3DPrintCustoms</h3>
          </div>
          <p className="text-gray-300 mb-4">Инновационные технологии 3D-печати для вашего бизнеса</p>
          <p className="text-gray-400 text-sm">© 2024 3DPrintCustoms. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;