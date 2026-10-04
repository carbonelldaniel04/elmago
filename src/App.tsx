/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/home/Hero';
import { CategoryShowcase } from './components/home/CategoryShowcase';
import { FeaturedProducts } from './components/home/FeaturedProducts';
import { OffersSection } from './components/home/OffersSection';
import { CorporateSection } from './components/home/CorporateSection';
import { CatalogView } from './components/catalog/CatalogView';
import { ContactPage } from './components/contact/ContactPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CorporateModal } from './components/corporate/CorporateModal';
import { SearchModal } from './components/common/SearchModal';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { ChatBot } from './components/chat/ChatBot';
import { IntroAnimation } from './components/common/IntroAnimation';

const MainAppContent: React.FC = () => {
  const { activeView, setActiveView } = useStore();

  // If user lands on offers, smoothly route them to home offers section
  React.useEffect(() => {
    if (activeView === 'offers') {
      setActiveView('home');
      setTimeout(() => {
        document.getElementById('ofertas-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, [activeView, setActiveView]);

  return (
    <div className="min-h-screen flex flex-col bg-[#1C1C1E] text-[#E5E5E3] font-body selection:bg-[#6C2BD9]/30 selection:text-white">
      {/* Top Sticky Header */}
      <Header />

      {/* Dynamic View Content */}
      <main className="flex-1">
        {activeView === 'home' && (
          <>
            <Hero />
            <CategoryShowcase />
            <FeaturedProducts />
            <OffersSection />
          </>
        )}

        {activeView === 'catalog' && <CatalogView />}

        {activeView === 'corporate' && (
          <div className="min-h-[70vh] bg-[#1C1C1E]">
            <CorporateSection />
          </div>
        )}

        {activeView === 'contact' && <ContactPage />}

        {activeView === 'admin' && <AdminDashboard />}
      </main>

      {/* Dark Footer */}
      <Footer />

      {/* Global Interactive Overlays */}
      <ProductDetailModal />
      <CartDrawer />
      <CorporateModal />
      <SearchModal />
      <WhatsAppButton />
      <ChatBot />
      <IntroAnimation />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
