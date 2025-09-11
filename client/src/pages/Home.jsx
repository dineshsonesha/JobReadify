import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import Testimonial from '../components/Testimonial'
import Plan from '../components/Plan'
import Features from '../components/Features'

export default function Home() {
    return (
        <div>
            <Navbar />
            <Hero />
            <Features />
            <Testimonial />
            <Plan />
            <Footer />
        </div>
    )
}
