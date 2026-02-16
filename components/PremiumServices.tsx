
import React from 'react';
import { Service, ProductCategory } from '../types';
import ServiceCard from './ServiceCard';
import { AuctionIcon } from './icons/AuctionIcon';
import { LogisticsIcon } from './icons/LogisticsIcon';
import { ConciergeIcon } from './icons/ConciergeIcon';
import { Page } from '../App';

interface PremiumServicesProps {
    navigateTo: (page: Page, category?: ProductCategory) => void;
    openChat: () => void;
}

const PremiumServices: React.FC<PremiumServicesProps> = ({ navigateTo, openChat }) => {
    
    const services: (Service & { action: () => void })[] = [
        {
            id: 1,
            title: 'Live Auctions',
            description: 'Bid on exclusive overstock and save. Real-time participation from top global brands.',
            linkText: 'Enter Arena',
            icon: <AuctionIcon className="w-8 h-8 text-white" />,
            action: () => navigateTo('bidding'),
        },
        {
            id: 2,
            title: 'VIP Logistics',
            description: 'White-glove delivery or showroom visits. Seamless scheduling at your fingertips.',
            linkText: 'Book Slot',
            icon: <LogisticsIcon className="w-8 h-8 text-white" />,
            action: () => navigateTo('appointments'),
        },
        {
            id: 3,
            title: 'AI Concierge',
            description: 'Personalized style logic. Upload your room photo for a complete spatial design.',
            linkText: 'Start Design',
            icon: <ConciergeIcon className="w-8 h-8 text-white" />,
            action: openChat,
        },
    ];

    return (
        <section className="bg-white py-16 md:py-24">
            <div className="container mx-auto px-6 text-center">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark">Premium Services</h2>
                <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                    Experience a smarter way to shop for high-end furniture with our suite of modern shopping tools.
                </p>
                <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                    {services.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PremiumServices;
