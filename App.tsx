import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Characters from './components/Characters';
import Gallery from './components/Gallery';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-storm-950 text-white font-sans selection:bg-storm-accent selection:text-black">
      {/* Global Particle Overlay (Static CSS noise for texture) */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Characters />
        <Gallery />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default App;