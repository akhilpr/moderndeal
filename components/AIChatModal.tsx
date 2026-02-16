
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Part } from '../types';
import { generateChatResponse } from '../services/geminiService';
import { CloseIcon } from './icons/CloseIcon';
import { SendIcon } from './icons/SendIcon';
import ChaddockLogo from './ChaddockLogo';
import { PaperclipIcon } from './icons/PaperclipIcon';
import { fileToGenerativePart } from '../utils/imageHelpers';

interface AIChatModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AIChatModal: React.FC<AIChatModalProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

    // This will now store the full history in the format our service expects
    const chatHistory = useRef<Part[][]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                { role: 'model', content: "Hello! I'm your AI Stylist. Upload a photo of your room or ask me anything about furniture and design!" }
            ]);
            chatHistory.current = []; // Reset history when modal opens
        }
    }, [isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!input.trim() && !imageFile) || isLoading) return;

        setIsLoading(true);
        const userMessage: ChatMessage = { role: 'user', content: input, imageUrl: imagePreviewUrl };
        setMessages(prev => [...prev, userMessage]);

        const currentInput = input;
        const currentImageFile = imageFile;

        setInput('');
        setImageFile(null);
        setImagePreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";

        try {
            const requestParts: Part[] = [];
            if (currentImageFile) {
                const imagePart = await fileToGenerativePart(currentImageFile);
                requestParts.push(imagePart);
            }
            requestParts.push({ text: currentInput || "Please analyze this image and give me design advice." });

            const responseText = await generateChatResponse(chatHistory.current, requestParts);

            // Update history for the next turn
            chatHistory.current.push(requestParts);
            chatHistory.current.push([{ text: responseText }]);

            const modelMessage: ChatMessage = { role: 'model', content: responseText };
            setMessages(prev => [...prev, modelMessage]);

        } catch (error: any) {
            console.error("Error communicating with backend service:", error);
            const errorMessage: ChatMessage = { role: 'model', content: error.message || "I'm sorry, I encountered an error. Please try your request again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg h-[90vh] max-h-[700px] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-up">
                <header className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <ChaddockLogo className="h-8" />
                        <h2 className="text-xl font-bold text-gray-800">AI Stylist</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>
                <div className="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-brand-primary text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                {msg.imageUrl && (
                                    <img src={msg.imageUrl} alt="User upload" className="rounded-lg mb-2 max-h-48" />
                                )}
                                {msg.content && <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="max-w-[80%] p-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none flex items-center space-x-2">
                                <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <footer className="p-4 border-t border-gray-200">
                    {imagePreviewUrl && (
                        <div className="p-2 mb-2 bg-gray-100 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <img src={imagePreviewUrl} alt="Preview" className="w-12 h-12 rounded object-cover" />
                                <span className="text-xs text-gray-600 truncate max-w-[200px]">{imageFile?.name}</span>
                            </div>
                            <button onClick={removeImage} className="text-gray-500 hover:text-gray-800">
                                <CloseIcon className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                    <form onSubmit={handleSend} className="flex items-center gap-3">
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="text-gray-500 hover:text-brand-primary p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <PaperclipIcon className="w-6 h-6" />
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask for design advice..."
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary focus:outline-none"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="bg-brand-primary text-white p-3 rounded-lg hover:bg-amber-700 disabled:bg-gray-400 transition-colors"
                            disabled={isLoading || (!input.trim() && !imageFile)}
                        >
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </form>
                </footer>
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

export default AIChatModal;
