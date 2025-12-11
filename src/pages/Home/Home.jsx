import React from 'react';
import { useLoaderData } from 'react-router';
import Banner from './Banner';
import PopularServices from './PopularServices';
import WhyChooseUs from './WhyChooseUs';
import CoverageMap from './CoverageMap';

const Home = () => {
    const locations = useLoaderData()
    return (
        <div className='bg-base-200/50'>
            <Banner></Banner>
            <PopularServices></PopularServices>
            <WhyChooseUs></WhyChooseUs>
            <CoverageMap locations={locations}></CoverageMap>
        </div>
    );
};

export default Home;