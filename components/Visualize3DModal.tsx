
import React, { useState } from 'react';
import { Product } from '../types';
import { generate3DPhotoVideo } from '../services/geminiService';
import { CloseIcon } from './icons/CloseIcon';
import { urlToGenerativePart } from '../utils/imageHelpers';

interface Visualize3DModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
}

const Visualize3DModal: React.FC<Visualize3DModalProps> = ({ isOpen, onClose, product }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Convert product image URL to base64
            // We reuse urlToGenerativePart which returns { text: ..., inlineData: { data: ..., mimeType: ... } }
            // We just need the inlineData part.
            const imagePart = await urlToGenerativePart(product.imageUrl, 'image/jpeg');

            if (!imagePart.inlineData) {
                throw new Error("Failed to process product image.");
            }

            const video = await generate3DPhotoVideo(
                imagePart.inlineData.data,
                imagePart.inlineData.mimeType,
                '16:9'
            );
            setVideoUrl(video);
        } catch (err: any) {
            console.error("Error generating 3D video:", err);
            setError(err.message || "Failed to generate 3D video.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setVideoUrl(null);
        setError(null);
        setIsLoading(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-up overflow-hidden max-h-[90vh]">
                <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white z-10">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-gray-800">Visualize in 3D</h2>
                        <span className="bg-brand-primary/10 text-brand-primary text-xs px-2 py-1 rounded-full font-medium">BETA</span>
                    </div>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition-colors">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50 flex flex-col items-center justify-center min-h-[400px]">
                    {error ? (
                        <div className="text-center max-w-md">
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 text-sm">
                                {error}
                            </div>
                            <button
                                onClick={handleGenerate}
                                className="bg-brand-dark text-white font-semibold px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : isLoading ? (
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Generating 3D Animation...</h3>
                            <p className="text-gray-500 max-w-xs mx-auto">This creates a depth-aware video from your 2D image. It make take up to 20-30 seconds.</p>
                        </div>
                    ) : videoUrl ? (
                        <div className="w-full max-w-3xl aspect-video bg-black rounded-lg shadow-lg overflow-hidden relative group">
                            <video
                                src={videoUrl}
                                autoPlay
                                loop
                                controls
                                className="w-full h-full object-contain"
                            />
                            <a
                                href={videoUrl}
                                download={`chaddock-3d-${product.id}.mp4`}
                                className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                Download Video
                            </a>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center max-w-2xl w-full">
                            <div className="relative group mb-8 w-full max-w-md aspect-[4/3] overflow-hidden rounded-xl shadow-md">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                            </div>

                            <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">Bring {product.name} to Life</h3>
                            <p className="text-gray-600 text-center mb-8 max-w-lg">
                                Our AI analyzes the product image to create a realistic 3D motion video, helping you visualize depth and form.
                            </p>

                            <button
                                onClick={handleGenerate}
                                className="bg-gradient-to-r from-brand-primary to-amber-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all flex items-center gap-2"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Generate 3D Video
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.3s forwards; }
            `}</style>
        </div>
    );
};

export default Visualize3DModal;
