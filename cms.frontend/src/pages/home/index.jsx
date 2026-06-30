// src/pages/home/index.jsx
import React, { useState } from 'react';
import CategoryMenu from './CategoryMenu';
import ProductGrid from './ProductGrid';
import LatestBlog from './LatestBlog';
import HeroBanner from './HeroBanner';


const Home = () => {
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    return (
        <>
            <HeroBanner/> 
            <div className="container-fluid px-5">
         
                <CategoryMenu
                    onCategorySelect={setSelectedCategoryId}
                    activeCategoryId={selectedCategoryId}
                />
                <ProductGrid categoryId={selectedCategoryId} />
                <LatestBlog />
            </div>
        </>
    );
};

export default Home;