
import React from 'react';
import { Product, ProductCategory } from '../types';
import ProductCard from './ProductCard';
import { allProducts } from '../data/products';
import { Page } from '../App';

interface FeaturedCurationsProps {
    navigateTo: (page: Page, category?: ProductCategory) => void;
    onTryInRoomClick: (product: Product) => void;
    onVisualizeClick: (product: Product) => void;
}

const featuredProducts: Product[] = allProducts.slice(0, 4);

const FeaturedCurations: React.FC<FeaturedCurationsProps> = ({ navigateTo, onTryInRoomClick, onVisualizeClick }) => {
    return (
        <section className="bg-white py-16 md:py-24">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark">Featured Curations</h2>
                        <p className="text-gray-600 mt-2">Hand-picked premium pieces with limited-time price advantages.</p>
                    </div>
                    <button onClick={() => navigateTo('deals')} className="text-brand-primary font-semibold hover:underline hidden md:block">
                        EXPLORE ALL DEALS
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} onTryInRoomClick={onTryInRoomClick} onVisualizeClick={onVisualizeClick} />
                    ))}
                </div>
                <div className="text-center mt-12 md:hidden">
                    <button onClick={() => navigateTo('deals')} className="text-brand-primary font-semibold hover:underline">
                        EXPLORE ALL DEALS
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FeaturedCurations;
