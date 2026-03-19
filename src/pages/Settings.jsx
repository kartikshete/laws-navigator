import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Check, MessageSquare, CheckCircle } from 'lucide-react';
import { getT } from '../utils/translations';

const LANGUAGES = [
    { id: 'english', label: 'English', native: 'English', flag: '🇬🇧' },
    { id: 'hindi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    { id: 'marathi', label: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
    { id: 'hinglish', label: 'Hinglish', native: 'Hinglish', flag: '🌏' },
];

const Settings = () => {
    const [selectedLang, setSelectedLang] = useState(() => {
        return localStorage.getItem('laws-navigator-lang') || 'english';
    });
    const [saved, setSaved] = useState(false);
    const t = getT(selectedLang);

    const handleLanguageChange = (id) => {
        setSelectedLang(id);
        localStorage.setItem('laws-navigator-lang', id);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        // Force page refresh for immediate effect
        window.location.reload();
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto space-y-8"
        >
            <h1 className="text-3xl font-serif font-bold text-slate-900 mb-8">
                {t.settingsTitle}
            </h1>

            {/* Success Toast */}
            {saved && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-xl shadow-lg"
                >
                    <CheckCircle size={18} />
                    Language saved!
                </motion.div>
            )}

            {/* AI Provider Info */}
            <div className="card">
                <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                    🤖 {t.aiEngine}
                </h2>
                <p className="text-slate-500 text-sm mb-4">{t.aiEngineDesc}</p>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">G</div>
                    <div>
                        <p className="font-bold text-emerald-800">Gemini 2.5 Flash</p>
                        <p className="text-xs text-emerald-600">Fast & Accurate by Google</p>
                    </div>
                    <Check size={20} className="ml-auto text-emerald-600" />
                </div>
            </div>

            {/* Language Section */}
            <div className="card">
                <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Globe size={20} /> {t.outputLang}
                </h2>
                <p className="text-slate-500 text-sm mb-6">{t.outputLangDesc}</p>

                <div className="grid grid-cols-2 gap-3">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.id}
                            onClick={() => handleLanguageChange(lang.id)}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${selectedLang === lang.id
                                ? 'bg-slate-900 border-slate-900 text-white shadow-lg scale-[1.02]'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                        >
                            <span className="text-2xl">{lang.flag}</span>
                            <div className="text-left">
                                <div className="font-semibold">{lang.label}</div>
                                <div className={`text-xs ${selectedLang === lang.id ? 'text-slate-300' : 'text-slate-400'}`}>{lang.native}</div>
                            </div>
                            {selectedLang === lang.id && (
                                <Check size={18} className="ml-auto" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 text-sm text-amber-700">
                    <MessageSquare size={18} className="shrink-0 mt-0.5" />
                    <p>{t.langNote}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default Settings;
