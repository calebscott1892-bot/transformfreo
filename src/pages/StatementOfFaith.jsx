import React from 'react';
import Hero from '../components/Hero';
import ContentSection from '../components/ContentSection';
import { Book } from 'lucide-react';
import content from '@/content/statement-of-faith.json';

export default function StatementOfFaith() {
    const stanzas = content.stanzas || [];

    return (
        <div>
            <Hero
                title={content.hero?.title}
                subtitle={content.hero?.subtitle}
                backgroundImage={content.hero?.image}
            />

            <ContentSection>
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-slate-200">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1E3A5F] to-[#7C6A9F] rounded-2xl mb-4">
                            <Book className="w-8 h-8 text-white" strokeWidth={2} />
                        </div>
                        <h2 className="text-3xl font-bold text-[#1E3A5F] mb-3">{content.heading}</h2>
                        <p className="text-lg text-slate-600">
                            {content.intro}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-8 md:p-10 border-2 border-[#E8C468]">
                        <div className="text-slate-700 leading-relaxed space-y-4 text-lg">
                            {stanzas.map((stanza, stanzaIndex) => {
                                // Each stanza is plain text. The first line sits flush;
                                // every line after it is indented, matching creed setting.
                                const lines = String(stanza).split('\n').filter((line) => line.trim() !== '');

                                return (
                                    <p key={stanzaIndex}>
                                        {lines.map((line, lineIndex) => (
                                            <React.Fragment key={lineIndex}>
                                                {lineIndex === 0 ? line : <span className="ml-4">{line}</span>}
                                                {lineIndex < lines.length - 1 && <br />}
                                            </React.Fragment>
                                        ))}
                                    </p>
                                );
                            })}

                            {content.closing && (
                                <p className="text-center font-semibold text-[#1E3A5F] mt-6">
                                    {content.closing}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </ContentSection>
        </div>
    );
}
