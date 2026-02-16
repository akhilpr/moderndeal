
import React from 'react';
import Hero from '../components/Hero';
import FeaturedCurations from '../components/FeaturedCurations';
import ShopByRoom from '../components/ShopByRoom';
import PremiumServices from '../components/PremiumServices';
import Newsletter from '../components/Newsletter';
// FIX: Import `Product` type.
import { ProductCategory, Product } from '../types';

type Page = 'home' | 'deals' | 'bidding' | 'appointments';

interface HomePageProps {
    navigateTo: (page: Page, category?: ProductCategory) => void;
    openChat: () => void;
    // FIX: Add `onTryInRoomClick` to props.
    onTryInRoomClick: (product: Product) => void;
    onVisualizeClick: (product: Product) => void;
}

const HomePage: React.FC<HomePageProps> = ({ navigateTo, openChat, onTryInRoomClick, onVisualizeClick }) => {
    return (
        <>
            <Hero navigateTo={navigateTo} />
            {/* FIX: Pass `onTryInRoomClick` down to `FeaturedCurations`. */}
            <FeaturedCurations navigateTo={navigateTo} onTryInRoomClick={onTryInRoomClick} onVisualizeClick={onVisualizeClick} />
            <ShopByRoom navigateTo={navigateTo} />
            <PremiumServices navigateTo={navigateTo} openChat={openChat} />
            <Newsletter />
        </>
    );
};

export default HomePage;