import React from 'react';
import { Hero } from '../hero';
import { Services } from '../services/Services';
import { Features } from '../features';
import { UsageGuidelines } from '../usageGuidelines/UsageGuidelines';
import { Faq } from '../faq/Faq';
import { Footer } from '../footer';

export const Home = () => {
    return (
        <div className="overflow-hidden">
            <Hero />
            {/* <Services />
            <Features />
            <UsageGuidelines />
            <Faq />
            <Footer /> */}
        </div>
    );
};