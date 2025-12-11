import React from 'react';
import { useLoaderData } from 'react-router';
import Banner from './Banner';
import PopularServices from './PopularServices';
import TopDecorators from './TopDecorators';
import WhyChooseUs from './WhyChooseUs';
import CoverageMap from './CoverageMap';

const Home = () => {
    const locations = useLoaderData()
    return (
        <div>
            <Banner></Banner>
            <PopularServices></PopularServices>
            <TopDecorators></TopDecorators>
            <WhyChooseUs></WhyChooseUs>
            <CoverageMap locations={locations}></CoverageMap>
        </div>
    );
};

export default Home;