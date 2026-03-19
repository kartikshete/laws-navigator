import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Terminal, Cpu, Layout, Feather } from 'lucide-react';
import { getT } from '../utils/translations';

const About = () => {
    const lang = localStorage.getItem('laws-navigator-lang') || 'english';
    const t = getT(lang);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-10 pb-20"
        >
            {/* Header Section */}
            <header className="text-center space-y-5 pb-8 border-b border-slate-200">
                <h1 className="text-4xl font-serif font-bold text-slate-900">{t.aboutTitle}</h1>
                <p className="text-xl text-slate-500 font-light">{t.aboutSubtitle}</p>

                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-medium mt-4 shadow-lg">
                    <Feather size={16} /> {t.developedBy}
                </div>
            </header>

            {/* Vision Section */}
            <section className="card">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    🎯 {t.theVision}
                </h2>
                <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
                    {lang === 'hindi' ? (
                        <>
                            <p><strong>Laws Navigator</strong> एक अत्याधुनिक कानूनी तकनीक पहल है जो आम नागरिकों और भारतीय कानूनी प्रणाली के बीच की खाई को पाटने के लिए डिज़ाइन की गई है।</p>
                            <p>यह प्रोजेक्ट एक सरल सवाल पूछता है: <em>"क्या होगा अगर आप AI को अपनी कहानी बता सकें, और यह तुरंत बता दे कि आप कहां खड़े हैं?"</em></p>
                            <p>यह उन्नत <strong>Dual Engine AI (Gemini)</strong> का उपयोग करके कथाओं को प्रमुख कानूनी तथ्यों में विश्लेषित करता है और उन्हें भारतीय कानूनों से जोड़ता है।</p>
                        </>
                    ) : lang === 'marathi' ? (
                        <>
                            <p><strong>Laws Navigator</strong> ही एक अत्याधुनिक कायदेशीर तंत्रज्ञान उपक्रम आहे जी सामान्य नागरिक आणि भारतीय कायदेशीर प्रणाली यांच्यातील दरी कमी करण्यासाठी डिझाइन केलेली आहे.</p>
                            <p>हा प्रकल्प एक साधा प्रश्न विचारतो: <em>"जर तुम्ही AI ला तुमची कथा सांगू शकलात आणि ते लगेच सांगू शकले की तुम्ही कुठे उभे आहात?"</em></p>
                            <p>हे प्रगत <strong>Dual Engine AI (Gemini)</strong> वापरून कथांचे प्रमुख कायदेशीर तथ्यांमध्ये विश्लेषण करते.</p>
                        </>
                    ) : (
                        <>
                            <p>The <strong>Laws Navigator</strong> is a cutting-edge legal technology initiative designed to bridge the massive gap between common citizens and the complex world of the Indian Legal System.</p>
                            <p>This project asks a simple question: <em>"What if you could tell your story to an AI, and it could immediately tell you where you stand?"</em></p>
                            <p>Functioning as a "Legal Triage" system, it leverages advanced <strong>Dual Engine AI (Gemini)</strong> to deconstruct narratives into key legal facts and map them to Indian Laws.</p>
                        </>
                    )}
                </div>
            </section>

            {/* Tech Stack Grid */}
            <section className="card">
                <h2 className="text-xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">
                    💻 {t.techStack}
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                    <StackItem
                        icon={<Layout size={20} />}
                        title="Frontend"
                        desc="React.js (Vite) + Tailwind CSS"
                        color="text-blue-600 bg-blue-50"
                    />
                    <StackItem
                        icon={<Cpu size={20} />}
                        title="AI Engine"
                        desc="Google Gemini 2.5 Flash"
                        color="text-purple-600 bg-purple-50"
                    />
                    <StackItem
                        icon={<Terminal size={20} />}
                        title="Voice Input"
                        desc="Web Speech API"
                        color="text-emerald-600 bg-emerald-50"
                    />
                    <StackItem
                        icon={<Globe size={20} />}
                        title="Languages"
                        desc="English, Hindi, Marathi, Hinglish"
                        color="text-orange-600 bg-orange-50"
                    />
                </div>
            </section>
        </motion.div>
    );
};

const StackItem = ({ icon, title, desc, color }) => (
    <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${color} shrink-0`}>
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-slate-900 text-base">{title}</h4>
            <p className="text-sm text-slate-500 mt-1">{desc}</p>
        </div>
    </div>
);

export default About;
