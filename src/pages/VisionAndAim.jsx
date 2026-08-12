import React from 'react';
import Hero from '../components/Hero';
import ContentSection from '../components/ContentSection';
import { getIcon } from '@/content/icons';
import { Crown } from 'lucide-react';
import content from '@/content/vision.json';

// Card colourways stay in code so editors can add or reorder aims without
// having to reason about gradients. Styles cycle if there are more than four.
const AIM_STYLES = [
    { gradient: 'from-amber-400 via-amber-500 to-orange-600', bgGradient: 'from-amber-50 to-orange-50' },
    { gradient: 'from-blue-500 via-indigo-500 to-purple-600', bgGradient: 'from-blue-50 to-purple-50' },
    { gradient: 'from-emerald-500 via-teal-500 to-cyan-600', bgGradient: 'from-emerald-50 to-cyan-50' },
    { gradient: 'from-rose-500 via-pink-500 to-fuchsia-600', bgGradient: 'from-rose-50 to-fuchsia-50' }
];

export default function VisionAndAim() {
    const aims = content.aims || [];

    return (
        <div>
            <Hero
                title={content.hero?.title}
                subtitle={content.hero?.subtitle}
                backgroundImage={content.hero?.image}
            />

            <ContentSection>
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-slate-200">
                    <h2 className="text-3xl font-bold text-[#1E3A5F] mb-6 text-center">{content.vision?.heading}</h2>
                    <p className="text-xl text-slate-700 leading-relaxed text-center max-w-3xl mx-auto">
                        {content.vision?.text}
                    </p>
                </div>
            </ContentSection>

            <ContentSection className="py-12">
                <h2 className="text-3xl font-bold text-[#1E3A5F] text-center mb-4">{content.aimsSection?.heading}</h2>
                <p className="text-slate-600 text-center max-w-2xl mx-auto mb-12">
                    {content.aimsSection?.intro}
                </p>

                <div className="space-y-6 max-w-5xl mx-auto">
                    {aims.map((aim, index) => {
                        const style = AIM_STYLES[index % AIM_STYLES.length];
                        const AimIcon = getIcon(aim.icon, Crown);

                        return (
                            <div
                                key={index}
                                className="group relative bg-white rounded-2xl shadow-md border-2 border-slate-200 overflow-hidden hover:shadow-2xl hover:border-[#E8C468] transition-all duration-500 hover:-translate-y-1"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r ${style.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                                <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-start gap-6">
                                    {/* Number Badge */}
                                    <div className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${style.gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                        <span className="text-3xl font-bold text-white">{aim.number}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <AimIcon className={`w-6 h-6 bg-gradient-to-br ${style.gradient} bg-clip-text text-transparent`} strokeWidth={2.5} />
                                            <h3 className="text-2xl font-bold text-[#1E3A5F] group-hover:text-[#7C6A9F] transition-colors duration-300">
                                                {aim.title}
                                            </h3>
                                        </div>
                                        <p className="text-lg text-slate-600 leading-relaxed">
                                            {aim.description}
                                        </p>
                                    </div>

                                    {/* Decorative Element */}
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${style.gradient} opacity-5 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700`}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ContentSection>

            <ContentSection className="py-12">
                <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2A4A6F] rounded-2xl p-8 md:p-12 text-white text-center shadow-2xl">
                    <h3 className="text-2xl font-bold mb-4">{content.closing?.heading}</h3>
                    <p className="text-lg text-slate-200 mb-6 max-w-3xl mx-auto leading-relaxed">
                        {content.closing?.text}
                    </p>
                    <div className="inline-block">
                        <div className="h-1 w-24 bg-[#E8C468] rounded-full"></div>
                    </div>
                </div>
            </ContentSection>
        </div>
    );
}
