
import React from 'react';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { Page } from '../App';
import { ProductCategory } from '../types';

interface HeroProps {
    navigateTo: (page: Page, category?: ProductCategory) => void;
}

const Hero: React.FC<HeroProps> = ({ navigateTo }) => {
    return (
        <section className="container mx-auto px-6 py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="max-w-xl">
                    <span className="inline-block bg-brand-primary-light text-brand-primary font-semibold px-3 py-1 rounded-md text-sm mb-4">
                        NEW INVENTORY ADDED DAILY
                    </span>
                    <h1 className="font-serif text-4xl md:text-6xl font-extrabold text-brand-dark tracking-tighter leading-tight">
                        Discover Today's <br />
                        <span className="text-brand-primary">Best Furniture</span> Deals
                    </h1>
                    <p className="mt-6 text-lg text-gray-600">
                        Luxury living made affordable. Shop high-end pieces at exclusive direct-to-consumer prices. Save up to 60% on premium overstock.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <button onClick={() => navigateTo('deals')} className="bg-brand-primary text-white font-semibold px-8 py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-amber-700 transition-all duration-300 transform hover:scale-105">
                            <span>Shop the Collection</span>
                            <ArrowRightIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => navigateTo('bidding')} className="bg-white text-gray-700 font-semibold px-8 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 transform hover:scale-105">
                            View Auctions
                        </button>
                    </div>
                </div>
                <div className="relative">
                    <div className="bg-stone-800 rounded-3xl transform -rotate-3 w-full h-full absolute top-0 left-0 transition-transform duration-500 hover:rotate-0"></div>
                    <img
                        src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop"
                        alt="Stylish modern furniture in a room"
                        className="relative rounded-3xl shadow-2xl w-full"
                    />
                    <div className="absolute bottom-8 -left-8 bg-white p-4 rounded-xl shadow-lg flex items-center space-x-4 animate-pulse">
                        <div className="bg-brand-primary text-white rounded-lg p-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800">Best Seller</p>
                            <p className="text-xs text-gray-500">Velvet Sectional Series</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;