import React from 'react';

const DEFAULT_BG = '/images/hero-home.jpg';

export default function Hero({ title, subtitle, backgroundImage }) {
    const bgImage = backgroundImage || DEFAULT_BG;

    return (
        <div className="relative bg-[#1E3A5F] text-white overflow-hidden">
            <div className={`absolute inset-0 bg-cover bg-[50%_35%]`} style={{ backgroundImage: `url('${bgImage}')` }}></div>
            <div className="absolute inset-0 bg-[#1E3A5F]/60"></div>

            <div className="relative max-w-5xl mx-auto px-6 py-24 md:py-32">
                <div className="text-center space-y-6">
                    <div className="inline-block">
                        <div className="h-1 w-16 bg-[#E8C468] rounded-full mb-6 mx-auto"></div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
