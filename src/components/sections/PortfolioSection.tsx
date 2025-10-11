import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface PortfolioSectionProps {
  t: any;
  portfolio: Array<{
    title: string;
    desc: string;
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
  );
};

export default PortfolioSection;
