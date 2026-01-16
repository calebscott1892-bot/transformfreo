import React from 'react';
import Hero from '../components/Hero';
import ContentSection from '../components/ContentSection';
import { MapPin, Clock, Calendar } from 'lucide-react';

export default function AboutUs() {
    const prayerMeetings = [
        {
            day: 'Mondays',
            time: '7:30–8:30pm',
            location: 'Scots Presbyterian Church',
            address: '90 South Terrace, Fremantle WA 6160'
        },

        {
            day: 'Wednesdays',
            time: '7:00–8:00pm',
            note: '* Youth & young adults focused (but all ages are welcome).',
            location: 'St John\'s Anglican Church',
            address: '24 Adelaide Street, Fremantle WA 6160'
        },
        {
            day: 'Thursdays',
            time: 'Coming Soon',
            comingSoon: true
        },
        {
            day: 'Fridays',
            time: '10:00–11:00am',
            location: 'Fremantle Wesley Uniting Church',
            address: '4 Cantonment Street, Fremantle WA 6160'
        }
    ];

    return (
        <div>
            <Hero 
                title="Transform Fremantle"
                subtitle="United in prayer for the transformation of our city"
            />

            <ContentSection>
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-slate-200">
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        We are a group of Christians from various churches, united in prayer 
                        for the transformation of the City of Fremantle.
                    </p>
                    <p className="text-lg text-slate-700 leading-relaxed">
                        Our vision is for Fremantle to be a peaceful city where multitudes encounter Jesus, transform their lives, and go on to serve Christ.
                    </p>
                </div>
            </ContentSection>

            <ContentSection className="py-12">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1E3A5F] to-[#7C6A9F] rounded-2xl mb-4">
                        <Calendar className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                    <h2 className="text-3xl font-bold text-[#1E3A5F] mb-3">Prayer Meetings</h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        We warmly invite all Christians to join us at the Transform Fremantle 
                        prayer meetings held throughout the week.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto mb-4">
                    <div className="bg-white rounded-xl px-4 py-3 shadow-sm border border-slate-200 border-l-4 border-l-[#E8C468] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2 motion-safe:duration-500 motion-reduce:animate-none">
                        <p className="text-sm md:text-[0.95rem] text-slate-700 leading-relaxed">
                            We are pausing Transform Fremantle prayer groups from 19–31 Jan. Meetings will recommence on 2 Feb.
                        </p>
                    </div>
                </div>

                <div className="space-y-4 max-w-4xl mx-auto">
                    {prayerMeetings.map((meeting, index) => (
                        <div 
                            key={index}
                            className={`bg-white rounded-xl p-6 md:p-8 shadow-md border-2 hover:shadow-xl transition-all duration-300 ${
                                meeting.comingSoon 
                                    ? 'border-slate-200 opacity-75' 
                                    : 'border-slate-200 hover:border-[#E8C468]'
                            }`}
                        >
                            <div className="flex flex-col md:flex-row md:items-start gap-6">
                                {/* Day and Time */}
                                <div className="md:w-48 flex-shrink-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="w-5 h-5 text-[#7C6A9F]" strokeWidth={2} />
                                        <h3 className="text-xl font-bold text-[#1E3A5F]">{meeting.day}</h3>
                                    </div>
                                    <p className={`text-lg font-semibold ${
                                        meeting.comingSoon ? 'text-slate-500' : 'text-[#7C6A9F]'
                                    }`}>
                                        {meeting.time}
                                    </p>

                                    {meeting.note && (
                                        <p className="mt-2 text-sm text-slate-500 leading-snug">
                                            {meeting.note}
                                        </p>
                                    )}
                                </div>

                                {/* Location Details */}
                                {meeting.location && (
                                    <div className="flex-1">
                                        <h4 className="text-lg font-bold text-slate-800 mb-2">
                                            {meeting.location}
                                        </h4>
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-[#E8C468] mt-1 flex-shrink-0" strokeWidth={2} />
                                            <p className="text-slate-600 leading-relaxed">
                                                {meeting.address}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {meeting.comingSoon && (
                                <div className="mt-4 pt-4 border-t border-slate-200">
                                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-full">
                                        Coming Soon
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </ContentSection>

            <ContentSection className="py-12">
                <div className="bg-gradient-to-br from-[#7C6A9F] to-[#1E3A5F] rounded-2xl p-8 md:p-12 text-white shadow-2xl">
                    <div className="text-center max-w-3xl mx-auto">
                        <h3 className="text-2xl font-bold mb-4">Unity in Essentials</h3>
                        <p className="text-lg text-slate-200 leading-relaxed mb-6">
                            "In essentials, unity; in non-essentials, liberty; in all things, charity."
                        </p>
                        <p className="text-slate-300 leading-relaxed">
                            We recognize that Christians may differ on secondary matters of theology and practice. 
                            What unites us is far greater than what divides us - our common faith in Jesus Christ 
                            and our shared mission to see His kingdom come in Fremantle.
                        </p>
                    </div>
                </div>
            </ContentSection>
        </div>
    );
}
