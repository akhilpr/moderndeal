
import React from 'react';
import { ProductCategory } from '../types';

type Page = 'home' | 'deals' | 'bidding' | 'appointments';

interface ShopByRoomProps {
    navigateTo: (page: Page, category?: ProductCategory) => void;
}

const rooms: { name: ProductCategory, imageUrl: string }[] = [
    {
        name: 'Living Room',
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop'
    },
    {
        name: 'Bedroom',
        imageUrl: 'https://images.unsplash.com/photo-1560185893-a5536c80e64d?q=80&w=800&auto=format&fit=crop'
    },
    {
        name: 'Dining Room',
        imageUrl: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?q=80&w=800&auto=format&fit=crop'
    },
    {
        name: 'Outdoor',
        imageUrl: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=800&auto=format&fit=crop'
    },
];

const ShopByRoom: React.FC<ShopByRoomProps> = ({ navigateTo }) => {
    return (
        <section className="bg-white py-16 md:py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark">Shop by Room</h2>
                    <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                        Find curated collections designed to bring harmony and style to every space in your home.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {rooms.map((room) => (
                        <div key={room.name} onClick={() => navigateTo('deals', room.name)} className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-300">
                            <img src={room.imageUrl} alt={`A stylish ${room.name}`} className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-6">
                                <h3 className="text-2xl font-bold text-white group-hover:text-brand-primary-light transition-colors">{room.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShopByRoom;