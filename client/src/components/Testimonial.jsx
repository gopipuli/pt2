 import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets';
import { motion } from 'motion/react';

const Testimonial = () => {

  const testimonials = [
  { 
    name: "Arjun Kumar",
    address: "Barcelona, Spain", 
    image: "https://randomuser.me/api/portraits/men/32.jpg", // ✅ male image
    review: "I've rented cars from various companies, but the experience with CarRental was exceptional."

  },
  { 
    name: "Manasa",
    address: "New York, USA", 
    image: assets.testimonial_image_2,
    review: "CarRental made my trip so much easier. The car was delivered right to my door, and the customer service was fantastic!"
  },
  { 
    name: "Pavani",
    address: "Seoul, South Korea",
    image: "https://randomuser.me/api/portraits/women/3.jpg" ,
    review: "I highly recommend CarRental! Their fleet is amazing, and I always feel like I'm getting the best deal with excellent service."
  }
];
  return (
    <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44">

      <Title 
        title="What Our Customers Say" 
        subTitle="Discover why customers choose CarRental for their journeys." 
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
        {testimonials.map((testimonial, index) => (
          <motion.div
           initial={{opacity: 0, y: 40}}
           whileInView={{opacity: 1, y: 0}}
           transition={{duration: 0.6, delay: index * 0.2,  ease:'easeOut'}}
           viewport={{once: true, amount: 0.3}}
            key={index} 
            className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-500"
          >
            
            {/* User Info */}
            <div className="flex items-center gap-3">
              <img 
                className="w-12 h-12 rounded-full" 
                src={testimonial.image} 
                alt={testimonial.name} 
              />
              <div>
                <p className="text-lg font-medium">{testimonial.name}</p>
                <p className="text-gray-500 text-sm">
                  {testimonial.address}
                </p>
              </div>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 mt-4">
              {Array(5).fill(0).map((_, i) => (
                <img key={i} src={assets.star_icon} alt="star" className="h-4" />
              ))}
            </div>

            {/* Review */}
            <p className="text-gray-500 max-w-md mt-4 text-sm">
              "{testimonial.review}"
            </p>

          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Testimonial