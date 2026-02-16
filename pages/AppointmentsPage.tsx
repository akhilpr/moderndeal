
import React from 'react';

const AppointmentsPage: React.FC = () => {
    return (
        <main className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-3xl mx-auto">
                <h1 className="font-serif text-4xl md:text-5xl font-extrabold text-brand-dark">Book an Appointment</h1>
                <p className="text-lg text-gray-600 mt-4">
                    Experience our collection in person or get expert advice from our design consultants. Schedule a visit to our showroom or a virtual consultation.
                </p>
                <div className="mt-12 grid md:grid-cols-2 gap-8 text-left">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                        <h3 className="text-2xl font-bold text-brand-dark mb-3">Visit Our Showroom</h3>
                        <p className="text-gray-600 mb-6">
                            Explore our curated spaces and see the quality of our furniture firsthand. Our staff will be on hand to assist you.
                        </p>
                        <button className="w-full bg-brand-primary text-white font-semibold py-3 rounded-lg hover:bg-amber-700 transition-colors">
                            Schedule a Visit
                        </button>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                        <h3 className="text-2xl font-bold text-brand-dark mb-3">Virtual Consultation</h3>
                        <p className="text-gray-600 mb-6">
                            Meet with a design expert online. We'll help you select pieces, plan layouts, and create the perfect look for your home.
                        </p>
                        <button className="w-full bg-brand-dark text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors">
                            Book a Video Call
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AppointmentsPage;
