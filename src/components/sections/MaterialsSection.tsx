import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MaterialsSectionProps {
  t: any;
  materials: Array<{
    name: string;
    color: string;
    props: string;
  }>;
}

const MaterialsSection = ({ t, materials }: MaterialsSectionProps) => {
  return (
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
  );
};

export default MaterialsSection;
