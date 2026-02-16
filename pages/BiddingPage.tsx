
import React from 'react';

const BiddingPage: React.FC = () => {
    return (
        <main className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-3xl mx-auto">
                <h1 className="font-serif text-4xl md:text-5xl font-extrabold text-brand-dark">Live Auctions</h1>
                <p className="text-lg text-gray-600 mt-4">
                    Welcome to the CHADDOCK Auction Arena. Here you can bid on exclusive, one-of-a-kind pieces and overstock items from top luxury brands.
                </p>
                <div className="mt-12 p-8 border border-gray-200 rounded-2xl bg-white shadow-sm">
                    <h2 className="text-2xl font-bold text-brand-dark mb-4">How It Works</h2>
                    <ol className="text-left space-y-4 text-gray-600">
                        <li className="flex items-start">
                            <span className="font-bold text-brand-primary mr-3">1.</span>
                            <span>Browse upcoming auctions and register for the items you're interested in.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-bold text-brand-primary mr-3">2.</span>
                            <span>Join the live auction at the scheduled time. Bidding happens in real-time.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-bold text-brand-primary mr-3">3.</span>
                            <span>Place your bids. The highest bidder when the timer runs out wins the item.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-bold text-brand-primary mr-3">4.</span>
                            <span>Complete your purchase and arrange for our white-glove delivery service.</span>
                        </li>
                    </ol>
                </div>
                <button className="mt-12 bg-brand-primary text-white font-semibold px-8 py-3 rounded-lg hover:bg-amber-700 transition-all duration-300 transform hover:scale-105">
                    View Upcoming Auctions
                </button>
            </div>
        </main>
    );
};

export default BiddingPage;
