import React, { useState } from 'react';
import Hero from '../components/Hero';
import ContentSection from '../components/ContentSection';
import { Mail, Send, MapPin, Heart, Building2, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AnimatePresence, motion } from 'framer-motion';
import { getIcon } from '@/content/icons';
import content from '@/content/connect.json';

export default function Connect() {
    const phoneDisplay = content.phone?.display || '';
    const phoneTel = content.phone?.tel || '';
    const form = content.form || {};

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        church: '',
        message: '',
        // Honeypot field (bots often fill hidden inputs)
        website: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notice, setNotice] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setNotice(null);

        try {
            if (import.meta.env.DEV) {
                // Proves the handler is wired and will call the API.
                console.log('[Connect] submit -> POST /api/send-email');
            }

            const res = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    church: formData.church,
                    message: formData.message,
                    website: formData.website
                })
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data?.ok) {
                throw new Error(data?.error || 'Failed to send message');
            }

            setNotice({
                type: 'success',
                message: form.successMessage
            });
            setFormData({ name: '', email: '', church: '', message: '', website: '' });
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error('[Connect] send failed', error);
            }

            setNotice({
                type: 'error',
                message: `Your email was not sent. Please try again, or call/text ${phoneDisplay}.`
            });
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

    const connectOptions = content.options || [];

    return (
        <div>
            <Hero
                title={content.hero?.title}
                subtitle={content.hero?.subtitle}
                backgroundImage={content.hero?.image}
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
                                <h2 className="text-2xl font-bold text-[#1E3A5F]">{form.heading}</h2>
                                <p className="text-sm text-slate-600">{form.subheading}</p>
                            </div>
                        </div>

                        <AnimatePresence initial={false}>
                            {notice ? (
                                <motion.div
                                    key={notice.type}
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.2 }}
                                    role={notice.type === 'error' ? 'alert' : 'status'}
                                    aria-live={notice.type === 'error' ? 'assertive' : 'polite'}
                                    className={
                                        notice.type === 'error'
                                            ? 'mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900'
                                            : 'mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900'
                                    }
                                >
                                    {notice.message}
                                </motion.div>
                            ) : null}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="hidden">
                                <label htmlFor="website" className="block text-sm font-medium text-slate-700 mb-2">
                                    Website
                                </label>
                                <Input
                                    id="website"
                                    name="website"
                                    type="text"
                                    value={formData.website}
                                    onChange={handleChange}
                                    autoComplete="off"
                                    tabIndex={-1}
                                />
                            </div>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                                    {form.nameLabel}
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder={form.namePlaceholder}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                    {form.emailLabel}
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder={form.emailPlaceholder}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label htmlFor="church" className="block text-sm font-medium text-slate-700 mb-2">
                                    {form.churchLabel}
                                </label>
                                <Input
                                    id="church"
                                    name="church"
                                    type="text"
                                    value={formData.church}
                                    onChange={handleChange}
                                    placeholder={form.churchPlaceholder}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                                    {form.messageLabel}
                                </label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder={form.messagePlaceholder}
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
                                    form.buttonSendingLabel
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        {form.buttonLabel}
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Connection Options */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2A4A6F] rounded-2xl p-8 text-white shadow-lg">
                            <h3 className="text-2xl font-bold mb-3">{content.waysToConnect?.heading}</h3>
                            <p className="text-slate-200 leading-relaxed">
                                {content.waysToConnect?.text}
                            </p>
                        </div>

                        {connectOptions.map((option, index) => {
                            const OptionIcon = getIcon(option.icon, Mail);

                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl p-6 shadow-md border border-slate-200 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#E8C468] to-[#D4AF37] rounded-xl flex items-center justify-center flex-shrink-0">
                                            <OptionIcon className="w-6 h-6 text-[#1E3A5F]" strokeWidth={2} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-lg font-bold text-[#1E3A5F] mb-2">{option.title}</h4>
                                            <p className="text-slate-600 text-sm mb-3 leading-relaxed">{option.description}</p>
                                            {option.usePhone && phoneDisplay && (
                                                <a
                                                    href={`tel:${phoneTel}`}
                                                    className="text-sm text-[#7C6A9F] font-medium hover:underline"
                                                >
                                                    Phone: {phoneDisplay}
                                                </a>
                                            )}
                                            {option.link && (
                                                <a
                                                    href={option.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
                                                >
                                                    <Instagram className="w-5 h-5" strokeWidth={2} />
                                                    {option.linkLabel}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </ContentSection>

            <ContentSection className="py-12">
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-slate-200">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1E3A5F] to-[#7C6A9F] rounded-2xl mb-4">
                            <Heart className="w-8 h-8 text-white" strokeWidth={2} />
                        </div>
                        <h2 className="text-3xl font-bold text-[#1E3A5F] mb-3">{content.giving?.heading}</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-6">
                            {content.giving?.text}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-8 border-2 border-[#E8C468]">
                        <div className="flex items-start gap-4">
                            <Building2 className="w-6 h-6 text-[#7C6A9F] mt-1 flex-shrink-0" strokeWidth={2} />
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-[#1E3A5F] mb-2">{content.giving?.detailsHeading}</h3>
                                <p className="text-slate-600 mb-4">
                                    {content.giving?.detailsText}
                                </p>
                                <div className="space-y-2 text-slate-700">
                                    <div className="flex flex-col sm:flex-row sm:gap-2">
                                        <span className="font-semibold min-w-32">Account Name:</span>
                                        <span>{content.giving?.accountName}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:gap-2">
                                        <span className="font-semibold min-w-32">BSB:</span>
                                        <span>{content.giving?.bsb}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:gap-2">
                                        <span className="font-semibold min-w-32">Account Number:</span>
                                        <span>{content.giving?.accountNumber}</span>
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
                            <h3 className="text-2xl font-bold text-[#1E3A5F] mb-2">{content.location?.heading}</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {content.location?.text}
                            </p>
                        </div>
                    </div>
                </div>
            </ContentSection>

            <ContentSection className="py-12">
                <div className="bg-gradient-to-br from-[#7C6A9F] to-[#1E3A5F] rounded-2xl p-8 md:p-12 text-white text-center shadow-2xl">
                    <h3 className="text-2xl font-bold mb-4">{content.closing?.heading}</h3>
                    <p className="text-lg text-slate-200 mb-6 max-w-2xl mx-auto leading-relaxed">
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
