import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

if (import.meta.env.PROD && typeof window !== 'undefined' && typeof window.fetch === 'function') {
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (input, init) => {
        const url = typeof input === 'string' ? input : input?.url;
        if (typeof url === 'string' && /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?\//.test(url)) {
            throw new Error(`Blocked network request to local address in production: ${url}`);
        }
        return originalFetch(input, init);
    };
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
) 