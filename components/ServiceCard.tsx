
import React from 'react';
import { Service } from '../types';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface ServiceCardProps {
    service: Service & { action: () => void };
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <div className="bg-brand-primary w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                {service.icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{service.title}</h3>
            <p className="text-gray-600 mt-2 flex-grow">{service.description}</p>
            <button onClick={service.action} className="mt-6 text-brand-primary font-semibold flex items-center space-x-2 group text-left">
                <span>{service.linkText}</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
};

export default ServiceCard;
