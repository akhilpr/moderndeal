
import React, { useState } from 'react';

const Newsletter: React.FC = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    return (
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-6">
                <div className="bg-brand-dark text-white p-10 md:p-16 rounded-3xl text-center max-w-4xl mx-auto">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold">Never miss a limited deal.</h2>
                    <p className="mt-4 text-gray-300 max-w-xl mx-auto">
                        Join our early access list and get notified 24 hours before our biggest furniture auctions go live.
                    </p>
                    {isSubmitted ? (
                        <div className="mt-8 text-lg font-semibold text-brand-primary-light bg-stone-700/50 py-4 rounded-lg">
                            Thank you for subscribing! Keep an eye on your inbox.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-grow px-5 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-brand-primary text-white font-semibold px-8 py-3 rounded-lg hover:bg-amber-700 transition-all duration-300 transform hover:scale-105"
                            >
                                Subscribe Now
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
