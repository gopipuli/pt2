 import React from 'react'
import Title from './Title'
import { assets, dummyCarData } from '../assets/assets'
import CarCard from './CarCard'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { motion } from 'motion/react'

const FeatureSection = () => {

  const navigate = useNavigate()

  const {cars} = useAppContext()

  return (
    <motion.div 
    initial={{opacity: 0,y: 40 }}
    whileInView={{opacity: 1,y:  0}}
    transition={{duration: 1, ease: "easeOut"}}
    
    
    className='flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32'>
      
      <motion.div
      initial={{opacity: 0,y: 20 }}
    whileInView={{opacity: 1,y:  0}}
    transition={{duration: 1,  delay: 0.5}}>
        <Title 
          title='Our Features' 
          subTitle='Explore our selection of premium vehicles available for your next adventure.' 
        />
      </motion.div>

      {/* Cars Grid */}
      < motion.div
      initial={{opacity: 0,y: 100 }}
    whileInView={{opacity: 1,y:  0}}
    transition={{duration: 1, delay: 0.5}}
      className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16'>
        {
          cars.slice(0, 6).map((car) => (
            <motion.div 
            
            key={car._id}
            initial={{opacity: 0, scale: 0.95 }}
    whileInView={{opacity: 1, scale: 1}}
    transition={{duration: 0.4, ease: "easeOut"}}
            
            >
              <CarCard car={car}/>
            </motion.div>
          ))
        }
      </motion.div>

      {/* Explore Button */}
      <motion.button

      initial={{opacity: 0,y: 20 }}
    whileInView={{opacity: 1,y:  0}}
    transition={{duration: 0.4,  delay: 0.6}}
        onClick={() => {
          navigate('/cars')
          window.scrollTo(0, 0)
        }}
        className='mt-12 flex items-center gap-2 border border-gray-300 px-5 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-300'
      >
        Explore all cars
        <img src={assets.arrow_icon} alt="arrow" className='h-4' />
      </motion.button>

    </motion.div>
  )
}

export default FeatureSection