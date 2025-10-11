import Icon from '@/components/ui/icon';

interface NavigationProps {
  activeSection: string;
  mobileMenuOpen: boolean;
  language: 'ru' | 'en' | 'zh';
  t: any;
  scrollToSection: (sectionId: string) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setLanguage: (lang: 'ru' | 'en' | 'zh') => void;
}

const Navigation = ({
  activeSection,
  mobileMenuOpen,
  language,
  t,
  scrollToSection,
  setMobileMenuOpen,
  setLanguage,
}: NavigationProps) => {
  const navItems = [
    { id: 'home', label: t.nav.home, color: 'from-blue-600 to-cyan-500' },
    { id: 'technologies', label: t.nav.technologies, color: 'from-purple-600 to-pink-500' },
    { id: 'materials', label: t.nav.materials, color: 'from-green-600 to-emerald-500' },
    { id: 'portfolio', label: t.nav.portfolio, color: 'from-orange-600 to-yellow-500' },
    { id: 'order', label: t.nav.order, color: 'from-pink-600 to-rose-500' },
    { id: 'contacts', label: t.nav.contacts, color: 'from-indigo-600 to-purple-500' },
  ];

  return (
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
            {navItems.map((item) => (
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
            {navItems.map((item) => (
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
  );
};

export default Navigation;
