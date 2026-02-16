
import React from 'react';

const logoBase64 = 'https://chaddock.com/Client/CHAD/images/logo.png?040524';
const ChaddockLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img
        src={logoBase64}
        alt="Chaddock Furniture Workroom Logo"
        className={className}
    />
);

export default ChaddockLogo;
