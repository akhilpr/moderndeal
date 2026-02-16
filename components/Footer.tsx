
import React from 'react';
import ChaddockLogo from './ChaddockLogo';
import { ShareIcon } from './icons/ShareIcon';
import { WorldIcon } from './icons/WorldIcon';
import { Page } from '../App';
import { ProductCategory } from '../types';

interface FooterProps {
    navigateTo: (page: Page, category?: ProductCategory) => void;
}

const Footer: React.FC<FooterProps> = ({ navigateTo }) => {
    const footerLinks = {
        'SHOP BY CATEGORY': [
            { text: 'Living Room', page: 'deals' as Page, category: 'Living Room' as ProductCategory }, 
            { text: 'Dining Room', page: 'deals' as Page, category: 'Dining Room' as ProductCategory }, 
            { text: 'Bedroom Furniture', page: 'deals' as Page, category: 'Bedroom' as ProductCategory },
            { text: 'Home Office', page: 'deals' as Page, category: 'Home Office' as ProductCategory },
            { text: 'Outdoor Sets', page: 'deals' as Page, category: 'Outdoor' as ProductCategory }
        ],
        'OUR SERVICES': [
            { text: 'Live Bidding', page: 'bidding' as Page },
            { text: 'AI Stylist Chat', page: 'home' as Page }, // Or open chat
            { text: 'White Glove Delivery', page: 'appointments' as Page },
            { text: 'Schedule Visit', page: 'appointments' as Page },
            { text: 'Seller Portal', page: 'home' as Page }
        ],
        'CUSTOMER CARE': [
            { text: 'Track Order', page: 'home' as Page },
            { text: 'Returns & Refunds', page: 'home' as Page },
            { text: 'Shipping Info', page: 'home' as Page },
            { text: 'Help Center', page: 'home' as Page },
            { text: 'Contact Us', page: 'home' as Page }
        ],
    };

    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2 pr-8">
                         <button onClick={() => navigateTo('home')}>
                            <ChaddockLogo className="h-12 mb-4" />
                        </button>
                        <p className="text-gray-600">
                           The premier destination for custom, handcrafted furniture designed for luxury living.
                        </p>
                        <div className="flex space-x-3 mt-6">
                            <button className="bg-gray-100 h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition">
                                <ShareIcon className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="bg-gray-100 h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition">
                                <WorldIcon className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="font-semibold text-gray-500 uppercase tracking-wider text-sm mb-4">{title}</h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.text}>
                                        <button onClick={() => navigateTo(link.page, link.category)} className="text-gray-600 hover:text-brand-primary transition text-left">{link.text}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <div className="border-t border-gray-200">
                <div className="container mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} CHADDOCK. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 sm:mt-0">
                        <a href="#" className="hover:text-brand-primary">Privacy Policy</a>
                        <a href="#" className="hover:text-brand-primary">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
