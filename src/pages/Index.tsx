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

const Index = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('home');
  


  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    toast({
      title: "Заявка отправлена!",
      description: `Мы свяжемся с вами по почте ${data.email} в течение 24 часов.`,
    });
    
    e.currentTarget.reset();
  };

  const technologies = [
    { icon: 'Box', name: 'FDM', desc: 'Послойное наплавление материала' },
    { icon: 'Layers', name: 'SLA', desc: 'Стереолитография высокой точности' },
    { icon: 'Zap', name: 'DLA', desc: 'Цифровая световая обработка' },
  ];

  const materials = [
    { name: 'PLA', color: 'bg-green-500', props: 'Экологичный, доступный' },
    { name: 'ABS', color: 'bg-blue-500', props: 'Прочный, термостойкий' },
    { name: 'PETG', color: 'bg-purple-500', props: 'Гибкий, долговечный' },
    { name: 'Nylon', color: 'bg-orange-500', props: 'Износостойкий, прочный' },
    { name: 'Resin', color: 'bg-pink-500', props: 'Высокая детализация' },
    { name: 'TPU', color: 'bg-yellow-500', props: 'Эластичный, гибкий' },
  ];

  const portfolio = [
    { title: 'Архитектурные модели', desc: 'Прототипы зданий и сооружений' },
    { title: 'Промышленные детали', desc: 'Функциональные запчасти и механизмы' },
    { title: 'Дизайнерские изделия', desc: 'Уникальные декоративные объекты' },
    { title: 'Цветная печать', desc: 'Цветные и люминесцентные материалы' },
  ];

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
            <div className="hidden md:flex gap-6">
              {[
                { id: 'home', label: 'Главная' },
                { id: 'technologies', label: 'Технологии' },
                { id: 'materials', label: 'Материалы' },
                { id: 'portfolio', label: 'Портфолио' },
                { id: 'order', label: 'Заявка' },
                { id: 'contacts', label: 'Контакты' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`font-medium transition-colors hover:text-primary ${
                    activeSection === item.id ? 'text-primary' : 'text-gray-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <section id="home" className="pt-32 pb-20 px-4 relative">
        <div className="container mx-auto text-center relative z-10">
          <div className="mb-8 inline-block">
            <Badge className="text-lg px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600">
              Инновационные технологии 3D-печати
            </Badge>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
            Воплощаем ваши идеи<br />в реальность
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Профессиональная 3D-печать для бизнеса и частных лиц. Широкий выбор материалов и технологий.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="text-lg px-8" onClick={() => scrollToSection('contacts')}>
              Связаться с нами
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => scrollToSection('portfolio')}>
              Посмотреть работы
            </Button>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: 'Zap', title: 'Быстро', desc: 'От 24 часов' },
              { icon: 'Award', title: 'Качественно', desc: 'Точность до 0.5мм' },
              { icon: 'Users', title: 'Надежно', desc: '500+ клиентов' },
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
              Современные технологии
            </h2>
            <p className="text-xl text-gray-600">Используем передовое оборудование для высокого качества</p>
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
                      <span className="text-sm">Высокая точность</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Check" className="text-green-600" size={20} />
                      <span className="text-sm">Быстрая печать</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Check" className="text-green-600" size={20} />
                      <span className="text-sm">Доступная цена</span>
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
              Разнообразие материалов
            </h2>
            <p className="text-xl text-gray-600">Подберем оптимальный материал для вашего проекта</p>
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
            <p className="text-gray-600 mb-4">Для юридических и физических лиц</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Badge variant="outline" className="text-base px-4 py-2">Скидки для оптовых заказов</Badge>
              <Badge variant="outline" className="text-base px-4 py-2">Работаем по договору</Badge>
              <Badge variant="outline" className="text-base px-4 py-2">Гарантия качества</Badge>
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" className="py-20 px-4 relative">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Наши работы
            </h2>
            <p className="text-xl text-gray-600">Образцы выполненных проектов</p>
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
                    Подробнее
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
              Заявка на расчет
            </h2>
            <p className="text-xl text-gray-600">Заполните форму и мы рассчитаем стоимость вашего заказа</p>
          </div>
          
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Параметры заказа</CardTitle>
              <CardDescription>Укажите детали для точного расчета стоимости</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="order-length">Длина (мм)</Label>
                    <Input id="order-length" name="length" type="number" placeholder="100" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order-width">Ширина (мм)</Label>
                    <Input id="order-width" name="width" type="number" placeholder="100" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order-height">Высота (мм)</Label>
                    <Input id="order-height" name="height" type="number" placeholder="100" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="plastic-type">Вид пластика</Label>
                  <Select name="plastic" required>
                    <SelectTrigger id="plastic-type">
                      <SelectValue placeholder="Выберите материал" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pla">PLA - Экологичный, доступный</SelectItem>
                      <SelectItem value="abs">ABS - Прочный, термостойкий</SelectItem>
                      <SelectItem value="petg">PETG - Гибкий, долговечный</SelectItem>
                      <SelectItem value="nylon">Nylon - Износостойкий</SelectItem>
                      <SelectItem value="resin">Resin - Высокая детализация</SelectItem>
                      <SelectItem value="tpu">TPU - Эластичный, гибкий</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="infill">Процент заполнения (%)</Label>
                  <Input id="infill" name="infill" type="number" min="10" max="100" placeholder="20" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Количество (шт)</Label>
                  <Input id="quantity" name="quantity" type="number" min="1" placeholder="1" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model-file">Файл 3D модели</Label>
                  <Input id="model-file" name="model" type="file" accept=".stl,.step,.dwg,.obj,.3mf" />
                  <p className="text-xs text-gray-500">Форматы: STL, STEP, DWG, OBJ, 3MF</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="order-description">Описание</Label>
                  <Textarea 
                    id="order-description" 
                    name="description" 
                    placeholder="Опишите ваши пожелания: цвет, постобработка, особые требования..." 
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email для связи</Label>
                  <Input id="contact-email" name="email" type="email" placeholder="example@mail.com" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Телефон (необязательно)</Label>
                  <Input id="contact-phone" name="phone" type="tel" placeholder="+7 (999) 123-45-67" />
                </div>
                
                <Button type="submit" size="lg" className="w-full text-lg py-6">
                  <Icon name="Send" className="mr-2" size={20} />
                  Отправить на расчет
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
              Контакты
            </h2>
            <p className="text-xl text-gray-600">Свяжитесь с нами удобным способом</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg group cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Icon name="Mail" className="text-white" size={24} />
                </div>
                <CardTitle>Email</CardTitle>
                <CardDescription className="text-base">info@3dprintcustoms.ru</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg group cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Icon name="MapPin" className="text-white" size={24} />
                </div>
                <CardTitle>Адрес</CardTitle>
                <CardDescription className="text-base">г. Москва, ул. Лобановский Лес, дом 11 (м. Прокшино)</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="mt-12 text-center">
            <div className="flex justify-center gap-4 flex-wrap">
              <Badge variant="outline" className="text-base px-4 py-2">Работаем ежедневно</Badge>
              <Badge variant="outline" className="text-base px-4 py-2">3D моделирование</Badge>
              <Badge variant="outline" className="text-base px-4 py-2">Доставка по всей России</Badge>
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