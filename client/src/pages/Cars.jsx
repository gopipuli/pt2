 import React, { useEffect, useState } from 'react'
import { assets, dummyCarData } from '../assets/assets'
import Title from '../components/Title'
import CarCard from '../components/CarCard'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const Cars = () => {

  //getting search params from url
  const [searchParams] = useSearchParams()
  const pickupLocation = searchParams.get('pickupLocation')
   const pickupDate= searchParams.get('pickupDate')
    const returnDate = searchParams.get('returndate')

    const {cars, axios} = useAppContext()


  const [input, setInput] = useState('')

  const isSearchData = pickupLocation && pickupDate && returnDate

  const [filteredCars, setFilteredCars] = useState([])

    

  const applyFilter = async () =>{
    if(input === ''){
      setFilteredCars(cars)
      return null
    }
  

  const filtered = cars.slice().filter((car)=>{
    return car.brand.toLowerCase().includes(input.toLowerCase())
    || car.model.toLowerCase().includes(input.toLowerCase())
    || car.category.toLowerCase().includes(input.toLowerCase())
    || car.transmission.toLowerCase().includes(input.toLowerCase())
  })
  setFilteredCars(filtered)
}


  const searchAvailability = async () =>{
    const {data} = await axios.post('/api/bookings/check-availability', {location: pickupLocation, pickupDate, returnDate})
    if(data.success){
      setFilteredCars(data.availablleCars)
      if(data.availablleCars.length===0){
        toast('No cars available')
      }
      return null
    }
  }

  useEffect(()=>{
    isSearchData && searchAvailability()
  }, [])

  useEffect(()=>{
     cars.length > 0 && !isSearchData && applyFilter()
  }, [input, cars])

  return (
    <motion.div 
    initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, ease: 'easeOut' }}
    
    
    className="bg-white">

      {/* 🔥 Full Width Gray Section */}
      <motion.div
      
      initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-gray-100 py-16 px-4">

        {/* Centered Content */}
        <motion.div 
        initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-4xl mx-auto text-center">

          <Title
            title="Available Cars"
            subTitle="Browse our selection of premium vehicles available for your next adventure"
          />

          {/* Search Bar */}
          <motion.div 
          linitial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
Itransition={{ delay: 0.3, duration: 0.5 }}
          
          className="flex items-center bg-white px-5 mt-6 w-full max-w-xl mx-auto h-12 rounded-full border border-gray-200 shadow-sm">

            <img src={assets.search_icon} alt="" className="w-4 h-4 mr-3 opacity-50" />

            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Search by make, model, or features"
              className="w-full h-full outline-none text-sm text-gray-600 placeholder-gray-400 bg-transparent"
            />

            <img src={assets.filter_icon} alt="" className="w-4 h-4 ml-3 opacity-50" />

          </motion.div>

        </motion.div>
      </motion.div>

      {/* Cars Section */}
      <motion.div
      initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ delay: 0.6, duration: 0.5 }}
      
      
      className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>

        <p className="text-gray-500 xl:px-20 max-w-7xl mx-auto">Showing {filteredCars.length} cars</p>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto'>
          
          {filteredCars.map((car, index) => (
            <motion.div key={index}
            initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.1 * index, duration: 0.4 }}>
              <CarCard car={car} />
            </motion.div>
          ))}

        </div>

      </motion.div>

    </motion.div>
  )
}

export default Cars 