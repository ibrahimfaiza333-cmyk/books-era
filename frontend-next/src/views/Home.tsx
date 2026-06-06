"use client";
// src/pages/Home.tsx

import HeroSection    from "../components/home/HeroSection"
import Features       from "../components/home/Features"
import FeaturedBooks  from "../components/home/FeaturedBooks"
import Categories     from "../components/home/categories"
import Bestsellers    from "../components/home/bestsellers"
import Newsletter     from "../components/home/Newsletter"
import { APP_NAME, APP_TAGLINE } from "../utils/constants"

const Home = () => {
    return (
        <>
            

            <div className="w-full">
                {/* Hero Carousel */}
                <HeroSection />

                {/* Features */}
                <Features />

                {/* Featured Books */}
                <FeaturedBooks />

                {/* Categories */}
                <Categories />

                {/* Bestsellers */}
                <Bestsellers />

                {/* Newsletter */}
                <Newsletter />
            </div>
        </>
    )
}

export default Home