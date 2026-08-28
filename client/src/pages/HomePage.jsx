import React from 'react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import Hero from '../components/Hero/Hero'
import Categories from '../components/Categories/Categories'
import BestDeals from '../components/BestDeals/BestDeals'
import Events from '../components/Events/Events'
import FeaturedProduct from '../components/FeaturedProduct/FeaturedProduct'
import Sponsored from '../components/Sponsored/Sponsored'

const HomePage = () => {
  return (
    <div>
      <Header activeHeading={1} />
      <Hero />
      <Categories />
      <BestDeals />
      <Events />
      <FeaturedProduct />
      <Sponsored />
      <Footer />
    </div>
  )
}

export default HomePage
