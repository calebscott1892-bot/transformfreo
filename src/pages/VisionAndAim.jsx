import React from 'react';
import Hero from '../components/Hero';
import ContentSection from '../components/ContentSection';
import { Crown, Church, Home, Lightbulb } from 'lucide-react';

export default function VisionAndAim() {
    const aims = [
        {
            number: '01',
            icon: Crown,
            title: 'Jesus as King',
            description: 'That Jesus be welcomed as King of Fremantle.',
            gradient: 'from-amber-400 via-amber-500 to-orange-600',
            bgGradient: 'from-amber-50 to-orange-50'
        },
        {
            number: '02',
            icon: Church,
            title: 'Thriving Churches',
            description: 'That the churches in Fremantle thrive, are filled to overflowing with worshipping believers, and that new places of worship are needed to accommodate church growth.',
            gradient: 'from-blue-500 via-indigo-500 to-purple-600',
            bgGradient: 'from-blue-50 to-purple-50'
        },
        {
            number: '03',
            icon: Home,
            title: 'Christ-Centred Lives',
            description: 'That believers in Fremantle transform their homes and workplaces to be Christ-centred.',
            gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
            bgGradient: 'from-emerald-50 to-cyan-50'
        },
        {
            number: '04',
            icon: Lightbulb,
            title: 'Lights in Darkness',
            description: 'That the churches in Fremantle will be lights in a dark place—bringing peace, a reduction in anti-social behaviour, prosperity in business, and a reduction in the presence of false religions and the occult.',
            gradient: 'from-rose-500 via-pink-500 to-fuchsia-600',
            bgGradient: 'from-rose-50 to-fuchsia-50'
        }
    ];

    return (
        <div>
            <Hero 
                title="Vision & Aim"
                subtitle="What we're believing God for in Fremantle"
                backgroundImage="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692045aca399a9594f748006/c822ef677_Aerial_view_of_Fremantle.JPG"
            />

            <ContentSection>
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-slate-200">
                    <h2 className="text-3xl font-bold text-[#1E3A5F] mb-6 text-center">Our Vision</h2>
                    <p className="text-xl text-slate-700 leading-relaxed text-center max-w-3xl mx-auto">
                        Our vision is for Fremantle to be a peaceful city where multitudes encounter Jesus, 
                        transform their lives, and go on to serve Christ.
                    </p>
                </div>
            </ContentSection>

            <ContentSection className="py-12">
                <h2 className="text-3xl font-bold text-[#1E3A5F] text-center mb-4">Our Aims</h2>
                <p className="text-slate-600 text-center max-w-2xl mx-auto mb-12">
                    Four distinct expressions of what we're praying and believing God for in Fremantle:
                </p>
                
                <div className="space-y-6 max-w-5xl mx-auto">
                    {aims.map((aim, index) => (
                        <div 
                            key={index}
                            className="group relative bg-white rounded-2xl shadow-md border-2 border-slate-200 overflow-hidden hover:shadow-2xl hover:border-[#E8C468] transition-all duration-500 hover:-translate-y-1"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-r ${aim.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                            
                            <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-start gap-6">
                                {/* Number Badge */}
                                <div className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${aim.gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                    <span className="text-3xl font-bold text-white">{aim.number}</span>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <aim.icon className={`w-6 h-6 bg-gradient-to-br ${aim.gradient} bg-clip-text text-transparent`} strokeWidth={2.5} />
                                        <h3 className="text-2xl font-bold text-[#1E3A5F] group-hover:text-[#7C6A9F] transition-colors duration-300">
                                            {aim.title}
                                        </h3>
                                    </div>
                                    <p className="text-lg text-slate-600 leading-relaxed">
                                        {aim.description}
                                    </p>
                                </div>

                                {/* Decorative Element */}
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${aim.gradient} opacity-5 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700`}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </ContentSection>

            <ContentSection className="py-12">
                <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2A4A6F] rounded-2xl p-8 md:p-12 text-white text-center shadow-2xl">
                    <h3 className="text-2xl font-bold mb-4">Praying with Purpose</h3>
                    <p className="text-lg text-slate-200 mb-6 max-w-3xl mx-auto leading-relaxed">
                        These four aims guide our prayers and shape our intercession for Fremantle. 
                        We believe God will move powerfully as we unite in faith, asking boldly for His kingdom to come in our city.
                    </p>
                    <div className="inline-block">
                        <div className="h-1 w-24 bg-[#E8C468] rounded-full"></div>
                    </div>
                </div>
            </ContentSection>
        </div>
    );
}
