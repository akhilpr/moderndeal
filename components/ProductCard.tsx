
import React from 'react';
import { Product } from '../types';
import { CameraIcon } from './icons/CameraIcon';

interface ProductCardProps {
    product: Product;
    onTryInRoomClick: (product: Product) => void;
    onVisualizeClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onTryInRoomClick, onVisualizeClick }) => {
    return (
        <div className="group overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="relative">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.tag && (
                    <span className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm text-brand-dark font-semibold px-3 py-1 rounded-full text-xs">
                        {product.tag}
                    </span>
                )}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onVisualizeClick(product);
                    }}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-brand-dark p-2 rounded-full shadow-lg hover:bg-brand-primary hover:text-white transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                    title="Visualize in 3D"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800 flex-grow">{product.name}</h3>
                <div className="mt-2 flex items-baseline space-x-2">
                    <p className="text-2xl font-bold text-brand-primary">${product.price.toLocaleString()}</p>
                    {product.originalPrice && (
                        <p className="text-gray-400 line-through">${product.originalPrice.toLocaleString()}</p>
                    )}
                </div>
                <button
                    onClick={() => onTryInRoomClick(product)}
                    className="mt-4 w-full bg-brand-dark text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                >
                    <CameraIcon className="w-5 h-5" />
                    <span>Try in your room</span>
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
