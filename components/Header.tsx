
import React from 'react';
import ChaddockLogo from './ChaddockLogo';
import { SearchIcon } from './icons/SearchIcon';
import { ChatIcon } from './icons/ChatIcon';
import { Page } from '../App';
import { ProductCategory } from '../types';

interface HeaderProps {
    onChatClick: () => void;
    navigateTo: (page: Page, category?: ProductCategory) => void;
}

const Header: React.FC<HeaderProps> = ({ onChatClick, navigateTo }) => {
    return (
        <header className="bg-[#F8F9FA] sticky top-0 z-40 shadow-sm">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-8">
                    <button onClick={() => navigateTo('home')}>
                        <ChaddockLogo className="h-12" />
                    </button>
                    <nav className="hidden md:flex items-center space-x-6">
                        <button onClick={() => navigateTo('home')} className="text-gray-600 hover:text-brand-primary transition-colors">Home</button>
                        <button onClick={() => navigateTo('deals')} className="text-gray-600 hover:text-brand-primary transition-colors">Deals</button>
                        <button onClick={() => navigateTo('bidding')} className="text-gray-600 hover:text-brand-primary transition-colors">Bidding</button>
                        <button onClick={() => navigateTo('appointments')} className="text-gray-600 hover:text-brand-primary transition-colors">Appointments</button>
                        <button onClick={onChatClick} className="flex items-center space-x-1 text-brand-primary hover:text-amber-700 transition-colors font-medium">
                            <ChatIcon className="h-5 w-5" />
                            <span>AI Chat</span>
                        </button>
                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative hidden sm:block">
                        <input
                            type="text"
                            placeholder="Search modern sofas..."
                            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary focus:outline-none w-48 lg:w-64 transition"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                    <button className="bg-brand-primary text-white font-semibold px-5 py-2 rounded-lg hover:bg-amber-700 transition-all duration-300 transform hover:scale-105">
                        Sign In
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
