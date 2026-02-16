
import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AIChatModal from './components/AIChatModal';
import { ChatIcon } from './components/icons/ChatIcon';
import TryInRoomModal from './components/TryInRoomModal';
import Visualize3DModal from './components/Visualize3DModal';

import HomePage from './pages/HomePage';
import DealsPage from './pages/DealsPage';
import BiddingPage from './pages/BiddingPage';
import AppointmentsPage from './pages/AppointmentsPage';
import { ProductCategory, Product } from './types';

export type Page = 'home' | 'deals' | 'bidding' | 'appointments';

const App: React.FC = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [initialCategory, setInitialCategory] = useState<ProductCategory | null>(null);

    const [isTryInRoomOpen, setIsTryInRoomOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const [isVisualize3DOpen, setIsVisualize3DOpen] = useState(false);
    const [visualizeProduct, setVisualizeProduct] = useState<Product | null>(null);

    const handleOpenTryInRoom = (product: Product) => {
        setSelectedProduct(product);
        setIsTryInRoomOpen(true);
    };

    const handleCloseTryInRoom = () => {
        setIsTryInRoomOpen(false);
        setSelectedProduct(null);
    };

    const handleOpenVisualize3D = (product: Product) => {
        setVisualizeProduct(product);
        setIsVisualize3DOpen(true);
    };

    const handleCloseVisualize3D = () => {
        setIsVisualize3DOpen(false);
        setVisualizeProduct(null);
    };

    const navigateTo = (page: Page, category?: ProductCategory) => {
        if (page === 'deals' && category) {
            setInitialCategory(category);
        } else {
            setInitialCategory(null);
        }
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage
                    navigateTo={navigateTo}
                    openChat={() => setIsChatOpen(true)}
                    onTryInRoomClick={handleOpenTryInRoom}
                    onVisualizeClick={handleOpenVisualize3D}
                />;
            case 'deals':
                return <DealsPage
                    initialCategory={initialCategory}
                    onTryInRoomClick={handleOpenTryInRoom}
                    onVisualizeClick={handleOpenVisualize3D}
                />;
            case 'bidding':
                return <BiddingPage />;
            case 'appointments':
                return <AppointmentsPage />;
            default:
                return <HomePage
                    navigateTo={navigateTo}
                    openChat={() => setIsChatOpen(true)}
                    onTryInRoomClick={handleOpenTryInRoom}
                    onVisualizeClick={handleOpenVisualize3D}
                />;
        }
    };

    return (
        <div className="relative min-h-screen bg-[#F8F9FA] flex flex-col">
            <Header onChatClick={() => setIsChatOpen(true)} navigateTo={navigateTo} />
            <div className="flex-grow">
                {renderPage()}
            </div>
            <Footer navigateTo={navigateTo} />

            <button
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-6 right-6 bg-brand-dark text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-transform transform hover:scale-110 z-50 flex items-center gap-2"
                aria-label="Ask AI Stylist"
            >
                <ChatIcon className="w-6 h-6" />
                <span className="hidden sm:inline font-semibold">ASK AI STYLIST</span>
            </button>

            <AIChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
            {selectedProduct && <TryInRoomModal isOpen={isTryInRoomOpen} onClose={handleCloseTryInRoom} product={selectedProduct} />}
            {visualizeProduct && <Visualize3DModal isOpen={isVisualize3DOpen} onClose={handleCloseVisualize3D} product={visualizeProduct} />}
        </div>
    );
};

export default App;