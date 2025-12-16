import Layout from "./Layout.jsx";

import AboutUs from "./AboutUs";

import StatementOfFaith from "./StatementOfFaith";

import VisionAndAim from "./VisionAndAim";

import Resources from "./Resources";

import Connect from "./Connect";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    AboutUs: AboutUs,
    
    StatementOfFaith: StatementOfFaith,
    
    VisionAndAim: VisionAndAim,
    
    Resources: Resources,
    
    Connect: Connect,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<AboutUs />} />
                
                
                <Route path="/AboutUs" element={<AboutUs />} />
                
                <Route path="/StatementOfFaith" element={<StatementOfFaith />} />
                
                <Route path="/VisionAndAim" element={<VisionAndAim />} />
                
                <Route path="/Resources" element={<Resources />} />
                
                <Route path="/Connect" element={<Connect />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}