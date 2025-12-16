import React from 'react';

export default function ContentSection({ children, className = '' }) {
    return (
        <section className={`max-w-4xl mx-auto px-6 py-16 ${className}`}>
            {children}
        </section>
    );
}