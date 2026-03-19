import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Info, Settings, Scale } from 'lucide-react';
import emblem from '../assets/emblem.png';
import { getT } from '../utils/translations';

const Layout = ({ children }) => {
    const lang = localStorage.getItem('laws-navigator-lang') || 'english';
    const t = getT(lang);

    return (
        <div className="flex h-screen bg-white text-slate-800 overflow-hidden relative">
            {/* Background Emblem (Satyamev Jayate) - Shifted Right */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 translate-x-[100px]">
                <img
                    src={emblem}
                    alt="Satyamev Jayate"
                    className="w-[400px] md:w-[550px] lg:w-[650px] opacity-[0.35]"
                />
                <p className="mt-2 text-2xl md:text-3xl font-bold text-slate-500 opacity-80">
                    सत्यमेव जयते
                </p>
            </div>

            {/* Sidebar */}
            <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200 z-20 hidden md:flex flex-col shadow-xl">
                <div className="p-6 flex items-center gap-3 border-b border-slate-100">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-lg">
                        <Scale size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-serif font-bold text-lg text-slate-900">Laws Navigator</h1>
                        <p className="text-xs text-slate-400">भारतीय कानून</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-2">
                    <NavItem to="/" icon={<Home size={20} />} label={t.home} />
                    <NavItem to="/about" icon={<Info size={20} />} label={t.about} />
                    <NavItem to="/settings" icon={<Settings size={20} />} label={t.settings} />
                </nav>

                <div className="p-4 border-t border-slate-100 text-xs text-slate-400 text-center">
                    {t.copyright}
                </div>
            </aside>

            {/* Mobile Navbar */}
            <nav className="md:hidden fixed bottom-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-200 z-50 flex justify-around p-2 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
                <MobileNavItem to="/" icon={<Home size={22} />} label={t.home} />
                <MobileNavItem to="/about" icon={<Info size={22} />} label={t.about} />
                <MobileNavItem to="/settings" icon={<Settings size={22} />} label={t.settings} />
            </nav>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative z-10 w-full">
                <div className="max-w-5xl mx-auto p-6 md:p-10 pt-8 md:pt-10 pb-24">
                    {children}
                </div>
            </main>
        </div>
    );
};

const NavItem = ({ to, icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`
        }
    >
        {icon}
        <span>{label}</span>
    </NavLink>
);

const MobileNavItem = ({ to, icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-2 rounded-xl min-w-[70px] transition-all ${isActive ? 'text-slate-900 bg-slate-100' : 'text-slate-400'}`
        }
    >
        {icon}
        <span className="text-xs font-medium">{label}</span>
    </NavLink>
);

export default Layout;
