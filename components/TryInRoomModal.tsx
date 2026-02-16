
import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types';
import { generateImageInRoom } from '../services/geminiService';
import { CloseIcon } from './icons/CloseIcon';
import { UploadIcon } from './icons/UploadIcon';
import { CameraIcon } from './icons/CameraIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { urlToGenerativePart, fileToGenerativePart } from '../utils/imageHelpers';

interface TryInRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
}

const TryInRoomModal: React.FC<TryInRoomModalProps> = ({ isOpen, onClose, product }) => {
    const [roomImageFile, setRoomImageFile] = useState<File | null>(null);
    const [roomImagePreview, setRoomImagePreview] = useState<string | null>(null);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<'initial' | 'camera' | 'preview' | 'result'>('initial');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const cleanup = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setRoomImageFile(null);
        setRoomImagePreview(null);
        setGeneratedImageUrl(null);
        setIsLoading(false);
        setError(null);
        setView('initial');
    };

    const handleClose = () => {
        cleanup();
        onClose();
    };

    useEffect(() => {
        if (!isOpen) {
            cleanup();
        }
    }, [isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setRoomImageFile(file);
            setRoomImagePreview(URL.createObjectURL(file));
            setView('preview');
        }
    };

    const startCamera = async () => {
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setView('camera');
            } else {
                setError("Your browser does not support camera access.");
            }
        } catch (err) {
            console.error("Camera access denied:", err);
            setError("Camera access was denied. Please enable it in your browser settings.");
            setView('initial');
        }
    };

    const captureImage = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const context = canvas.getContext('2d');
            context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(blob => {
                if (blob) {
                    const file = new File([blob], "room-capture.jpg", { type: "image/jpeg" });
                    setRoomImageFile(file);
                    setRoomImagePreview(URL.createObjectURL(file));
                    setView('preview');
                }
            }, 'image/jpeg');
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        }
    };


    const handleGenerate = async () => {
        if (!roomImageFile) {
            setError("Please provide an image of your room.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const roomImagePart = await fileToGenerativePart(roomImageFile);
            const productImagePart = await urlToGenerativePart(product.imageUrl, 'image/jpeg');
            const prompt = `Seamlessly and realistically place the second image (the piece of furniture, '${product.name}') into the first image (the room). Pay close attention to scale, perspective, lighting, and shadows to make it look like the furniture is naturally part of the room. Do not add any other objects or text. The output should be only the final image.`;

            const resultImageUrl = await generateImageInRoom(roomImagePart, productImagePart, prompt);
            debugger
            if (resultImageUrl) {
                setGeneratedImageUrl(resultImageUrl);
                setView('result');
            } else {
                throw new Error("AI did not return a valid result. Please try again.");
            }
        } catch (err: any) {
            console.error("Error generating result via backend service:", err);
            setError(err.message || "Failed to generate result.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="text-center p-8 flex flex-col items-center justify-center h-full">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-primary"></div>
                    <p className="mt-4 text-lg font-semibold text-gray-700">Our AI is redecorating...</p>
                    <p className="text-sm text-gray-500">This may take a moment.</p>
                </div>
            )
        }
        if (error) {
            return (
                <div className="text-center p-8">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button onClick={() => { setError(null); setView('initial'); }} className="bg-brand-dark text-white font-semibold px-6 py-2 rounded-lg">Try Again</button>
                </div>
            )
        }

        switch (view) {
            case 'camera':
                return (
                    <div className="p-4 flex flex-col items-center">
                        <video ref={videoRef} autoPlay playsInline className="w-full h-auto max-h-[60vh] rounded-lg bg-gray-900"></video>
                        <button onClick={captureImage} className="mt-4 bg-brand-primary text-white font-semibold px-8 py-3 rounded-lg flex items-center gap-2">
                            <CameraIcon className="w-6 h-6" /> <span>Capture</span>
                        </button>
                    </div>
                );
            case 'preview':
                return (
                    <div className="p-4 flex flex-col items-center">
                        <img src={roomImagePreview} alt="Your room" className="w-full max-h-[60vh] rounded-lg object-contain mb-4" />
                        <div className="flex gap-4">
                            <button onClick={() => { setRoomImageFile(null); setRoomImagePreview(null); setView('initial'); }} className="bg-gray-200 text-gray-800 font-semibold px-6 py-2 rounded-lg">Change Photo</button>
                            <button onClick={handleGenerate} className="bg-brand-primary text-white font-semibold px-8 py-2 rounded-lg">Generate</button>
                        </div>
                    </div>
                );
            case 'result':
                return (
                    <div className="p-4 flex flex-col items-center">
                        <img src={generatedImageUrl} alt="Generated scene" className="w-full max-h-[60vh] rounded-lg object-contain mb-4" />
                        <div className="flex gap-4">
                            <button onClick={cleanup} className="bg-gray-200 text-gray-800 font-semibold px-6 py-2 rounded-lg">Start Over</button>
                            <a href={generatedImageUrl} download={`chaddock-room-${product.id}.png`} className="bg-brand-primary text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2">
                                <DownloadIcon className="w-5 h-5" /> Download
                            </a>
                        </div>
                    </div>
                )
            default: // initial
                return (
                    <div className="text-center p-8">
                        <p className="text-lg text-gray-600 mb-6">Provide a photo of your room to see how it looks.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                            <button onClick={() => fileInputRef.current?.click()} className="bg-brand-dark text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2">
                                <UploadIcon className="w-5 h-5" /> Upload Photo
                            </button>
                            <button onClick={startCamera} className="bg-white text-gray-800 font-semibold px-6 py-3 rounded-lg border border-gray-300 flex items-center justify-center gap-2">
                                <CameraIcon className="w-5 h-5" /> Use Camera
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-up">
                <header className="flex items-start justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Try in your room</h2>
                            <p className="text-sm text-gray-600">{product.name}</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-800 p-1">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>
                <div className="flex-1">
                    {renderContent()}
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

export default TryInRoomModal;
