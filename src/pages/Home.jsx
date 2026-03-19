import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, AlertTriangle, Gavel, FileText, Download, Copy, X, Sparkles, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeCase, generateFIRDraft } from '../utils/laws';
import { getT } from '../utils/translations';

const Home = () => {
    const [lang, setLang] = useState(() => localStorage.getItem('laws-navigator-lang') || 'english');
    const t = getT(lang);

    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [firDraft, setFirDraft] = useState(null);
    const [showFirModal, setShowFirModal] = useState(false);
    const recognitionRef = useRef(null);

    // Listen for language changes
    useEffect(() => {
        const checkLang = () => {
            const newLang = localStorage.getItem('laws-navigator-lang') || 'english';
            if (newLang !== lang) setLang(newLang);
        };
        window.addEventListener('storage', checkLang);
        const interval = setInterval(checkLang, 500);
        return () => {
            window.removeEventListener('storage', checkLang);
            clearInterval(interval);
        };
    }, [lang]);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = lang === 'hindi' ? 'hi-IN' : lang === 'marathi' ? 'mr-IN' : 'en-IN';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput((prev) => prev + (prev ? ' ' : '') + transcript);
                setIsListening(false);
            };
            recognitionRef.current.onend = () => setIsListening(false);
        }
    }, [lang]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const handleAnalyze = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setResult(null);
        try {
            const data = await analyzeCase(input, lang);
            setResult(data);
        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateFIR = () => {
        if (!result) return;
        const draft = generateFIRDraft(input, result);
        setFirDraft(draft);
        setShowFirModal(true);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(firDraft);
    };

    const downloadFIR = () => {
        const element = document.createElement("a");
        const file = new Blob([firDraft], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "FIR_Draft.txt";
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div className="space-y-10">
            {/* Hero Header */}
            <header className="text-center space-y-5 max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    {t.dualEngine}
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight"
                >
                    {t.heroTitle} <br />
                    <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent">{t.heroTitleHighlight}</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-500 text-lg max-w-xl mx-auto"
                >
                    {t.heroDesc}
                </motion.p>
            </header>

            {/* Input Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-3xl mx-auto"
            >
                <div className="card overflow-hidden">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t.placeholder}
                        className="w-full bg-transparent text-slate-800 p-5 min-h-[140px] outline-none text-lg resize-none placeholder-slate-400 border-b border-slate-100"
                    />

                    <div className="flex items-center justify-between p-4 bg-slate-50/80">
                        <button
                            onClick={toggleListening}
                            className={`btn-secondary flex items-center gap-2 ${isListening ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
                        >
                            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                            {isListening ? t.listening : t.dictate}
                        </button>

                        <button
                            onClick={handleAnalyze}
                            disabled={loading || !input.trim()}
                            className={`btn-primary flex items-center gap-2 ${loading || !input.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Scale size={18} /> {t.analyzeCase}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Results Section */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="max-w-4xl mx-auto space-y-6"
                    >
                        {/* Summary Card */}
                        <div className="card border-l-4 border-l-amber-500">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                    <Sparkles size={20} className="text-amber-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">{t.analysisSummary}</h3>
                            </div>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {result.summary}
                            </p>
                        </div>

                        {/* Laws Grid */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {result.relevantLaws?.map((law, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="badge badge-info">{law.section}</span>
                                        <Gavel size={18} className="text-slate-300 group-hover:text-slate-600 transition" />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-1">{law.law}</h4>
                                    <h5 className="text-sm font-medium text-slate-500 mb-4">{law.title}</h5>

                                    <div className="space-y-3 text-sm">
                                        <div className="p-3 bg-slate-50 rounded-lg">
                                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">{t.explanation}</p>
                                            <p className="text-slate-600">{law.explanation}</p>
                                        </div>
                                        <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                                            <p className="text-xs font-bold text-red-500 uppercase mb-1">{t.penalty}</p>
                                            <p className="text-red-700 font-medium">{law.punishment}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col items-center gap-4 pt-4">
                            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl text-blue-700 text-sm max-w-2xl border border-blue-100">
                                <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                                <p>{result.disclaimer}</p>
                            </div>

                            <button onClick={handleGenerateFIR} className="btn-primary flex items-center gap-2">
                                <FileText size={18} /> {t.generateFIR}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FIR Modal */}
            <AnimatePresence>
                {showFirModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{t.firTitle}</h3>
                                    <p className="text-sm text-slate-500">{t.firDesc}</p>
                                </div>
                                <button onClick={() => setShowFirModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50 font-mono text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                {firDraft}
                            </div>

                            <div className="p-4 border-t border-slate-100 flex gap-3 justify-end bg-white">
                                <button onClick={copyToClipboard} className="btn-secondary flex items-center gap-2">
                                    <Copy size={16} /> {t.copy}
                                </button>
                                <button onClick={downloadFIR} className="btn-primary flex items-center gap-2">
                                    <Download size={16} /> {t.download}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;
