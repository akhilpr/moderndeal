
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { allProducts } from '../data/products';
import { ProductCategory, Product } from '../types';

interface DealsPageProps {
    initialCategory: ProductCategory | null;
    onTryInRoomClick: (product: Product) => void;
    onVisualizeClick: (product: Product) => void;
}

const DealsPage: React.FC<DealsPageProps> = ({ initialCategory, onTryInRoomClick, onVisualizeClick }) => {
    const categories: ('All' | ProductCategory)[] = ['All', ...Array.from(new Set(allProducts.map(p => p.category)))];
    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');

    useEffect(() => {
        setSelectedCategory(initialCategory || 'All');
    }, [initialCategory]);

    const filteredProducts = selectedCategory === 'All'
        ? allProducts
        : allProducts.filter(p => p.category === selectedCategory);

    return (
        <main className="container mx-auto px-6 py-12">
            <div className="text-center mb-8">
                <h1 className="font-serif text-4xl md:text-5xl font-extrabold text-brand-dark">All Deals</h1>
                <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                    Explore our entire collection of premium overstock furniture. Limited quantities available.
                </p>
            </div>

            <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-12">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full font-semibold text-sm md:text-base transition-colors duration-300 ${selectedCategory === category
                                ? 'bg-brand-dark text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onTryInRoomClick={onTryInRoomClick} onVisualizeClick={onVisualizeClick} />
                ))}
            </div>
        </main>
    );
};

export default DealsPage;
