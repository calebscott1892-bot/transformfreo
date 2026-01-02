import React, { useState } from 'react';
import Hero from '../components/Hero';
import ContentSection from '../components/ContentSection';
import { Mail, Send, Phone, Instagram, MapPin, Heart, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

export default function Connect() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        church: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            await base44.integrations.Core.SendEmail({
                to: 'transformfreo@gmail.com',
                subject: `Contact Form: Message from ${formData.name}`,
                body: `Name: ${formData.name}\nEmail: ${formData.email}\nChurch: ${formData.church || 'Not provided'}\n\nMessage:\n${formData.message}`
            });
            
            toast.success('Thank you for reaching out! We\'ll be in touch soon.');
            setFormData({ name: '', email: '', church: '', message: '' });
        } catch (error) {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const connectOptions = [
        {
            icon: Phone,
            title: 'Give Us a Call',
            description: 'Please reach out to Liz Petersen',
            contact: 'Phone: 0404 077 194'
        },
        {
            icon: Instagram,
            title: 'Find Us on Instagram',
            description: 'Follow us on Instagram for updates',
            link: 'https://www.instagram.com/transformfreo?igsh=NXRveXByYm9jMHAy&utm_source=qr'
        }
    ];

    return (
        <div>
            <Hero 
                title="Connect With Us"
                subtitle="Join us in praying for and serving Fremantle"
                backgroundImage="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692045aca399a9594f748006/c56eed31b_The_Love_Fremantle_sign.jpg"
            />

            <ContentSection>
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* Contact Form */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#1E3A5F] to-[#7C6A9F] rounded-xl flex items-center justify-center">
                                <Mail className="w-6 h-6 text-white" strokeWidth={2} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-[#1E3A5F]">Get In Touch</h2>
                                <p className="text-sm text-slate-600">We'd love to hear from you</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                                    Your Name *
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Smith"
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                    Email Address *
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label htmlFor="church" className="block text-sm font-medium text-slate-700 mb-2">
                                    Your Church (Optional)
                                </label>
                                <Input
                                    id="church"
                                    name="church"
                                    type="text"
                                    value={formData.church}
                                    onChange={handleChange}
                                    placeholder="Grace Community Church"
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                                    Your Message *
                                </label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us how you'd like to connect or what questions you have..."
                                    rows={5}
                                    className="w-full"
                                />
                            </div>

                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full bg-[#1E3A5F] hover:bg-[#2A4A6F] text-white font-medium py-6"
                            >
                                {isSubmitting ? (
                                    'Sending...'
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Send Message
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Connection Options */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2A4A6F] rounded-2xl p-8 text-white shadow-lg">
                            <h3 className="text-2xl font-bold mb-3">Ways to Connect</h3>
                            <p className="text-slate-200 leading-relaxed">
                                Get in touch with us or follow our journey on social media.
                            </p>
                        </div>

                        {connectOptions.map((option, index) => (
                            <div 
                                key={index}
                                className="bg-white rounded-xl p-6 shadow-md border border-slate-200 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#E8C468] to-[#D4AF37] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <option.icon className="w-6 h-6 text-[#1E3A5F]" strokeWidth={2} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-bold text-[#1E3A5F] mb-2">{option.title}</h4>
                                        <p className="text-slate-600 text-sm mb-3 leading-relaxed">{option.description}</p>
                                        {option.contact && (
                                            <p className="text-sm text-[#7C6A9F] font-medium">{option.contact}</p>
                                        )}
                                        {option.link && (
                                            <a 
                                                href={option.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
                                            >
                                                <Instagram className="w-5 h-5" strokeWidth={2} />
                                                Follow @transformfreo
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </ContentSection>

            <ContentSection className="py-12">
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-slate-200">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1E3A5F] to-[#7C6A9F] rounded-2xl mb-4">
                            <Heart className="w-8 h-8 text-white" strokeWidth={2} />
                        </div>
                        <h2 className="text-3xl font-bold text-[#1E3A5F] mb-3">Support Our Mission</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-6">
                            We believe in giving out of conviction and not out of compulsion. If you feel convicted to give to us, thank you!
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-8 border-2 border-[#E8C468]">
                        <div className="flex items-start gap-4">
                            <Building2 className="w-6 h-6 text-[#7C6A9F] mt-1 flex-shrink-0" strokeWidth={2} />
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-[#1E3A5F] mb-2">Bank Transfer Details</h3>
                                <p className="text-slate-600 mb-4">
                                    You can support Transform Fremantle through a direct bank transfer:
                                </p>
                                <div className="space-y-2 text-slate-700">
                                    <div className="flex flex-col sm:flex-row sm:gap-2">
                                        <span className="font-semibold min-w-32">Account Name:</span>
                                        <span>Transform Fremantle</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:gap-2">
                                        <span className="font-semibold min-w-32">BSB:</span>
                                        <span>116879</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:gap-2">
                                        <span className="font-semibold min-w-32">Account Number:</span>
                                        <span>454199464</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ContentSection>

            <ContentSection className="py-12">
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-lg p-8 md:p-12 border border-slate-200">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#1E3A5F] to-[#7C6A9F] rounded-2xl flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-8 h-8 text-white" strokeWidth={2} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-[#1E3A5F] mb-2">Based in Fremantle, WA</h3>
                            <p className="text-slate-600 leading-relaxed">
                                We're a local movement serving the City of Fremantle and surrounding areas. 
                                Our prayer gatherings take place at various locations across the city.
                            </p>
                        </div>
                    </div>
                </div>
            </ContentSection>

            <ContentSection className="py-12">
                <div className="bg-gradient-to-br from-[#7C6A9F] to-[#1E3A5F] rounded-2xl p-8 md:p-12 text-white text-center shadow-2xl">
                    <h3 className="text-2xl font-bold mb-4">Join the Movement</h3>
                    <p className="text-lg text-slate-200 mb-6 max-w-2xl mx-auto leading-relaxed">
                        We believe God is calling His people to unite in prayer for Fremantle. No matter your 
                        church background or where you're at in your faith journey, you're welcome to join us.
                    </p>
                    <div className="inline-block">
                        <div className="h-1 w-24 bg-[#E8C468] rounded-full"></div>
                    </div>
                </div>
            </ContentSection>
        </div>
    );
}
