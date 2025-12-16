import React from 'react';
import Hero from '../components/Hero';
import ContentSection from '../components/ContentSection';
import { Book } from 'lucide-react';

export default function StatementOfFaith() {
    return (
        <div>
            <Hero 
                title="Statement of Faith"
                subtitle="The foundational truths that unite us"
                backgroundImage="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692045aca399a9594f748006/6d4c63607_daadf793-043b-4b08-95b6-a7f252bc5f94.jpg"
            />

            <ContentSection>
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-slate-200">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1E3A5F] to-[#7C6A9F] rounded-2xl mb-4">
                            <Book className="w-8 h-8 text-white" strokeWidth={2} />
                        </div>
                        <h2 className="text-3xl font-bold text-[#1E3A5F] mb-3">The Apostles' Creed</h2>
                        <p className="text-lg text-slate-600">
                            We hold to the doctrinal teaching contained in this historic creed:
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-8 md:p-10 border-2 border-[#E8C468]">
                        <div className="text-slate-700 leading-relaxed space-y-4 text-lg">
                            <p>
                                I believe in God, the Father almighty,<br />
                                <span className="ml-4">creator of heaven and earth.</span>
                            </p>

                            <p>
                                I believe in Jesus Christ, his only Son, our Lord,<br />
                                <span className="ml-4">who was conceived by the Holy Spirit,</span><br />
                                <span className="ml-4">born of the virgin Mary,</span><br />
                                <span className="ml-4">suffered under Pontius Pilate,</span><br />
                                <span className="ml-4">was crucified, died, and was buried;</span><br />
                                <span className="ml-4">he descended to the dead.</span><br />
                                <span className="ml-4">On the third day he rose again;</span><br />
                                <span className="ml-4">he ascended into heaven,</span><br />
                                <span className="ml-4">he is seated at the right hand of the Father,</span><br />
                                <span className="ml-4">and he will come to judge the living and the dead.</span>
                            </p>

                            <p>
                                I believe in the Holy Spirit,<br />
                                <span className="ml-4">the holy Christian church,</span><br />
                                <span className="ml-4">the communion of saints,</span><br />
                                <span className="ml-4">the forgiveness of sins,</span><br />
                                <span className="ml-4">the resurrection of the body,</span><br />
                                <span className="ml-4">and the life everlasting.</span>
                            </p>

                            <p className="text-center font-semibold text-[#1E3A5F] mt-6">
                                Amen.
                            </p>
                        </div>
                    </div>
                </div>
            </ContentSection>


        </div>
    );
}