interface ClientsSectionProps {
  t: any;
}

const ClientsSection = ({ t }: ClientsSectionProps) => {
  const clients = [
    { 
      name: 'Yandex', 
      logo: 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/f59d3d52-10e3-4c65-8448-bb13279fecfa.jpg'
    },
    { 
      name: 'iRayple', 
      logo: 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/ddd1e75f-968d-4590-847d-9ac38cfa2a45.jpg'
    },
    { 
      name: 'Gazprom', 
      logo: 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/e158635f-fd30-4ef4-9de2-6642746774ce.jpg'
    },
    { 
      name: 'Rosneft', 
      logo: 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/22e16cd4-4f3c-4d70-86e8-2043b3a1b223.jpg'
    },
    { 
      name: 'Alfa Bank', 
      logo: 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/eda10eaf-86eb-44ad-b7af-21c03ef0e296.jpg'
    },
    { 
      name: 'Moscow Metro', 
      logo: 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/bd5f4241-5588-4f44-b60a-d1359b199ef9.jpg'
    },
  ];

  return (
    <section id="clients" className="relative py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t.clients.title}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t.clients.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
          {clients.map((client, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200/50 flex flex-col items-center justify-center"
            >
              <div className="w-full h-20 mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <img 
                  src={client.logo} 
                  alt={client.name}
                  className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <p className="text-sm font-semibold text-gray-700 text-center group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                {client.name}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-lg">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                500+
              </div>
              <div className="text-sm text-gray-600 mt-1">{t.clients.stat1}</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-blue-300 to-purple-300"></div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                98%
              </div>
              <div className="text-sm text-gray-600 mt-1">{t.clients.stat2}</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-purple-300 to-pink-300"></div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                5+
              </div>
              <div className="text-sm text-gray-600 mt-1">{t.clients.stat3}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;