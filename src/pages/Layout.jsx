
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils/utils.js';
import { Menu, X } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { name: 'About Us', path: 'AboutUs' },
        { name: 'Statement of Faith', path: 'StatementOfFaith' },
        { name: 'Vision & Aim', path: 'VisionAndAim' },
        { name: 'Resources', path: 'Resources' },
        { name: 'Connect', path: 'Connect' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50">
            <style>{`
                :root {
                    --navy: #1E3A5F;
                    --gold: #E8C468;
                    --gold-dark: #D4AF37;
                    --lavender: #7C6A9F;
                    --cream: #FAF9F6;
                }
            `}</style>

            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-5">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to={createPageUrl('AboutUs')} className="flex items-center gap-3 group">
                            <div className="relative">
                                <img 
                                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692045aca399a9594f748006/78da45737_test2.png"
                                    alt="Transform Fremantle Logo"
                                    className="w-11 h-11 object-contain transform transition-transform group-hover:scale-105"
                                />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-[#1E3A5F] tracking-tight">Transform Fremantle</h1>
                                <p className="text-xs text-slate-500 tracking-wide">United in Prayer</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={createPageUrl(item.path)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        currentPageName === item.path
                                            ? 'bg-[#1E3A5F] text-white shadow-md'
                                            : 'text-slate-600 hover:text-[#1E3A5F] hover:bg-slate-100'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-slate-600 hover:text-[#1E3A5F] hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {mobileMenuOpen && (
                        <nav className="md:hidden pt-4 pb-2 space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={createPageUrl(item.path)}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                        currentPageName === item.path
                                            ? 'bg-[#1E3A5F] text-white'
                                            : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main>
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-[#1E3A5F] text-white mt-24">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <img 
                                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692045aca399a9594f748006/78da45737_test2.png"
                                    alt="Transform Fremantle"
                                    className="w-5 h-5 object-contain"
                                />
                                <h3 className="font-bold text-lg">Transform Fremantle</h3>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                A group of Christians united in prayer for the transformation of the City of Fremantle.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-[#E8C468]">Quick Links</h4>
                            <div className="space-y-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={createPageUrl(item.path)}
                                        className="block text-sm text-slate-300 hover:text-[#E8C468] transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-[#E8C468]">Our Vision</h4>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                For Fremantle to be a peaceful city where many encounter Jesus, experience real life change, and go on to serve Christ.
                            </p>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-700 text-center text-sm text-slate-400">
                        <p>© {new Date().getFullYear()} Transform Fremantle. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
