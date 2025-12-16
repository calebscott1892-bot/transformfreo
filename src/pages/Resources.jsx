import React from 'react';
import Hero from '../components/Hero';
import ContentSection from '../components/ContentSection';
import { Download, FileText } from 'lucide-react';

export default function Resources() {
    const resources = [
        {
            title: 'What is Salvation? And what should I do next?',
            url: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692045aca399a9594f748006/342fbd43b_TransformFremantleSalvationandNextStepsDec2025-1.pdf'
        }
    ];

    return (
        <div>
            <Hero 
                title="Resources"
                subtitle="Equipping you to pray and partner with God's work in Fremantle"
                backgroundImage="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692045aca399a9594f748006/e62309fc0_679e2880-219e-4bf4-bcf8-8c7d817d2d42.jpeg"
            />

            <ContentSection>
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-slate-200 mb-12 text-center">
                    <h2 className="text-2xl font-bold text-[#1E3A5F] mb-4">Available Resources</h2>
                    <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        Explore our range of biblically-based resources.
                    </p>
                </div>

                <div className="space-y-4 max-w-3xl mx-auto">
                    {resources.map((resource, index) => (
                        <a
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-4 p-6 bg-white rounded-xl shadow-md border-2 border-slate-200 hover:border-[#E8C468] hover:shadow-xl transition-all duration-300"
                        >
                            <div className="w-14 h-14 bg-gradient-to-br from-[#1E3A5F] to-[#7C6A9F] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                <FileText className="w-7 h-7 text-white" strokeWidth={2} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-[#1E3A5F] group-hover:text-[#7C6A9F] transition-colors mb-1">
                                    {resource.title}
                                </h3>
                                <p className="text-sm text-slate-500">PDF Document</p>
                            </div>
                            <Download className="w-6 h-6 text-[#7C6A9F] group-hover:text-[#1E3A5F] transition-colors flex-shrink-0" strokeWidth={2} />
                        </a>
                    ))}
                </div>
            </ContentSection>

            <ContentSection className="py-16">
                <div className="bg-gradient-to-br from-[#7C6A9F] to-[#1E3A5F] rounded-2xl p-8 md:p-12 text-white text-center shadow-2xl">
                    <h3 className="text-2xl font-bold mb-4">After Something Specific?</h3>
                    <p className="text-lg text-slate-200 mb-6 max-w-2xl mx-auto">
                        If you're looking for a particular resource or have suggestions for materials we should create, 
                        we'd love to hear from you.
                    </p>
                    <p className="text-slate-300 text-sm">
                        Get in touch via our Connect page
                    </p>
                </div>
            </ContentSection>
        </div>
    );
}