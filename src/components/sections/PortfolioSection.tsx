import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface PortfolioSectionProps {
  t: any;
  portfolio: Array<{
    title: string;
    desc: string;
    image?: string;
  }>;
}

const PortfolioSection = ({ t, portfolio }: PortfolioSectionProps) => {
  return (
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
              <div className="h-64 relative overflow-hidden bg-gray-100">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
  );
};

export default PortfolioSection;