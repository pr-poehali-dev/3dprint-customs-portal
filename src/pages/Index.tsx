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
  
  const [calcParams, setCalcParams] = useState({
    length: 10,
    width: 10,
    height: 10,
    technology: 'fdm',
    material: 'pla',
    quantity: 1,
    infill: 20,
  });
  
  const materialPrices: Record<string, number> = {
    pla: 150,
    abs: 180,
    petg: 200,
    nylon: 350,
    resin: 450,
    tpu: 400,
  };
  
  const technologyMultiplier: Record<string, number> = {
    fdm: 1.0,
    sla: 1.5,
    sls: 2.0,
  };
  
  const calculatePrice = () => {
    const volume = (calcParams.length * calcParams.width * calcParams.height) / 1000;
    const materialCost = materialPrices[calcParams.material] || 150;
    const techMult = technologyMultiplier[calcParams.technology] || 1.0;
    const infillFactor = calcParams.infill / 100;
    
    const basePrice = volume * materialCost * techMult * infillFactor;
    const total = basePrice * calcParams.quantity;
    
    return Math.round(total);
  };
  
  const estimatedPrice = calculatePrice();

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
    { icon: 'Sparkles', name: 'SLS', desc: 'Селективное лазерное спекание' },
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
    { title: 'Медицинские протезы', desc: 'Индивидуальные ортопедические решения' },
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
                { id: 'calculator', label: 'Расчет' },
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
            <Button size="lg" className="text-lg px-8" onClick={() => scrollToSection('calculator')}>
              Рассчитать стоимость
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => scrollToSection('portfolio')}>
              Посмотреть работы
            </Button>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: 'Zap', title: 'Быстро', desc: 'От 24 часов' },
              { icon: 'Award', title: 'Качественно', desc: 'Точность до 0.1мм' },
              { icon: 'Users', title: 'Надежно', desc: '500+ клиентов' },
            ].map((item) => (
              <Card key={item.title} className="border-2 hover:border-primary transition-all hover:shadow-lg">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
              <Card key={tech.name} className="group hover:shadow-xl transition-all border-2 hover:border-primary">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
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
              <Card key={index} className="group overflow-hidden hover:shadow-xl transition-all border-2 hover:border-primary">
                <div className="h-64 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
                  <Icon name="Box" className="text-gray-300 group-hover:scale-110 transition-transform" size={120} />
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

      <section id="calculator" className="py-20 px-4 relative">
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Калькулятор стоимости
            </h2>
            <p className="text-xl text-gray-600">Рассчитайте стоимость печати в режиме реального времени</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Параметры модели</CardTitle>
                <CardDescription>Укажите размеры и настройки печати</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="length">Длина (см)</Label>
                    <Input
                      id="length"
                      type="number"
                      min="1"
                      max="50"
                      value={calcParams.length}
                      onChange={(e) => setCalcParams({ ...calcParams, length: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="width">Ширина (см)</Label>
                    <Input
                      id="width"
                      type="number"
                      min="1"
                      max="50"
                      value={calcParams.width}
                      onChange={(e) => setCalcParams({ ...calcParams, width: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Высота (см)</Label>
                    <Input
                      id="height"
                      type="number"
                      min="1"
                      max="50"
                      value={calcParams.height}
                      onChange={(e) => setCalcParams({ ...calcParams, height: Number(e.target.value) })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Технология печати</Label>
                  <Select value={calcParams.technology} onValueChange={(value) => setCalcParams({ ...calcParams, technology: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fdm">FDM - Послойное наплавление (x1.0)</SelectItem>
                      <SelectItem value="sla">SLA - Стереолитография (x1.5)</SelectItem>
                      <SelectItem value="sls">SLS - Лазерное спекание (x2.0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Материал</Label>
                  <Select value={calcParams.material} onValueChange={(value) => setCalcParams({ ...calcParams, material: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pla">PLA - 150₽/см³</SelectItem>
                      <SelectItem value="abs">ABS - 180₽/см³</SelectItem>
                      <SelectItem value="petg">PETG - 200₽/см³</SelectItem>
                      <SelectItem value="nylon">Nylon - 350₽/см³</SelectItem>
                      <SelectItem value="resin">Resin - 450₽/см³</SelectItem>
                      <SelectItem value="tpu">TPU - 400₽/см³</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="infill">Заполнение: {calcParams.infill}%</Label>
                    <span className="text-sm text-gray-600">Влияет на прочность и расход</span>
                  </div>
                  <input
                    id="infill"
                    type="range"
                    min="10"
                    max="100"
                    step="10"
                    value={calcParams.infill}
                    onChange={(e) => setCalcParams({ ...calcParams, infill: Number(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Количество экземпляров</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max="100"
                    value={calcParams.quantity}
                    onChange={(e) => setCalcParams({ ...calcParams, quantity: Number(e.target.value) })}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card className="border-2 bg-gradient-to-br from-blue-50 to-purple-50">
                <CardHeader>
                  <CardTitle className="text-2xl">Расчет стоимости</CardTitle>
                  <CardDescription>Предварительная оценка</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-gray-600">Объем модели:</span>
                      <span className="font-semibold">{((calcParams.length * calcParams.width * calcParams.height) / 1000).toFixed(2)} см³</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-gray-600">Материал:</span>
                      <span className="font-semibold">{calcParams.material.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-gray-600">Технология:</span>
                      <span className="font-semibold">{calcParams.technology.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-gray-600">Заполнение:</span>
                      <span className="font-semibold">{calcParams.infill}%</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-gray-600">Количество:</span>
                      <span className="font-semibold">{calcParams.quantity} шт</span>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6 text-center">
                    <p className="text-gray-600 mb-2">Итоговая стоимость</p>
                    <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {estimatedPrice.toLocaleString('ru-RU')} ₽
                    </p>
                    <p className="text-sm text-gray-500 mt-2">* Финальная цена может отличаться</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Icon name="Clock" size={16} />
                      <span>Срок изготовления: 1-3 дня</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Icon name="Shield" size={16} />
                      <span>Гарантия качества</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Icon name="Truck" size={16} />
                      <span>Доставка по всей России</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl">Заказать печать</CardTitle>
                  <CardDescription>Оставьте контакты для оформления заказа</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ваше имя</Label>
                      <Input id="name" name="name" placeholder="Иван Иванов" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="ivan@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="+7 (999) 123-45-67" />
                    </div>
                    <input type="hidden" name="price" value={estimatedPrice} />
                    <input type="hidden" name="params" value={JSON.stringify(calcParams)} />
                    <Button type="submit" className="w-full text-lg py-6">
                      Заказать за {estimatedPrice.toLocaleString('ru-RU')} ₽
                    </Button>
                    <p className="text-xs text-center text-gray-500">Также можете отправить 3D-модель на info@3dprintcustoms.ru</p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
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
            <Card className="border-2 hover:border-primary transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Mail" className="text-white" size={24} />
                </div>
                <CardTitle>Email</CardTitle>
                <CardDescription className="text-base">info@3dprintcustoms.ru</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-primary transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="MessageCircle" className="text-white" size={24} />
                </div>
                <CardTitle>Онлайн-чат</CardTitle>
                <CardDescription className="text-base">Ответим в течение 5 минут</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Открыть чат</Button>
              </CardContent>
            </Card>
          </div>
          <div className="mt-12 text-center">
            <div className="flex justify-center gap-4 flex-wrap">
              <Badge variant="outline" className="text-base px-4 py-2">Работаем ежедневно</Badge>
              <Badge variant="outline" className="text-base px-4 py-2">Консультации бесплатно</Badge>
              <Badge variant="outline" className="text-base px-4 py-2">Доставка по всей России</Badge>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-gray-900 to-blue-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Icon name="Box" className="text-white" size={24} />
            </div>
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