 import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion} from 'motion/react'

const CarDetails = () => {

  const { id } = useParams()
  const {cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate} = useAppContext()
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const currency = import.meta.env.VITE_CURRENCY

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
       const {data} =await axios.post('/api/bookings/create', {car: id, pickupDate, returnDate})
       if(data.success){
        toast.success(data.message)
        navigate('/my-bookings')
       }else{
        toast.error(data.message)
       }
    } catch (error) {
      toast.error(error.message)
    }
  }

   

  // format date → DD-MM-YYYY
  const formatDate = (date) => {
    if (!date) return ''
    const [year, month, day] = date.split('-')
    return `${day}-${month}-${year}`
  }

  useEffect(() => {
    setCar(cars.find(car => car._id === id))
  }, [cars, id])

  return car ? (
    <motion.div 
    initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
    
    className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>

      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer'
      >
        <img src={assets.arrow_icon} alt="" className='rotate-180 opacity-65' />
        Back to all cars
      </button>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>

        {/* Left Section */}
        <div className='lg:col-span-2'>
          <img 
            src={car.image} 
            alt="" 
            className='w-full h-auto md:max-h-[420px] object-cover rounded-xl mb-6 shadow-md'
          />

          <div className='space-y-6'>
            <div>
              <h1 className='text-3xl font-bold'>
                {car.brand} {car.model}
              </h1>
              <p className='text-gray-500 text-lg'>
                {car.category} • {car.year}
              </p>
            </div>

            <hr className='my-6 border-gray-200'/>

            {/* 4 Boxes */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              <div className='flex flex-col items-center bg-gray-100 p-4 rounded-lg'>
                <img src={assets.users_icon} alt="" className='h-5 mb-2' />
                <span className='text-sm text-gray-700'>{car.seating_capacity} Seats</span>
              </div>

              <div className='flex flex-col items-center bg-gray-100 p-4 rounded-lg'>
                <img src={assets.fuel_icon} alt="" className='h-5 mb-2' />
                <span className='text-sm text-gray-700'>{car.fuel_type}</span>
              </div>

              <div className='flex flex-col items-center bg-gray-100 p-4 rounded-lg'>
                <img src={assets.car_icon} alt="" className='h-5 mb-2' />
                <span className='text-sm text-gray-700'>{car.transmission}</span>
              </div>

              <div className='flex flex-col items-center bg-gray-100 p-4 rounded-lg'>
                <img src={assets.location_icon} alt="" className='h-5 mb-2' />
                <span className='text-sm text-gray-700'>{car.location}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className='text-xl font-medium mb-3'>Description</h2>
              <p className='text-gray-500 text-sm'>{car.description}</p>
            </div>

            {/* Features */}
            <div>
              <h2 className='text-xl font-medium mb-3'>Features</h2>
              <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                {["360-degree camera","Bluetooth","GPS","Heated seats","Sunroof"].map((item) => (
                  <li key={item} className='flex items-center text-sm'>
                    <img src={assets.check_icon} alt="" className='h-4 mr-2' />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <form onSubmit={handleSubmit} className='shadow-lg h-max sticky top-20 rounded-xl p-6 space-y-6 text-gray-500'>

          {/* Price */}
          <p className='flex items-center justify-between text-2xl text-gray-800 font-semibold'>
            {currency}{car.pricePerDay}
            <span className='text-base text-gray-400 font-normal'> per day</span>
          </p>

          <hr className='my-4 border-gray-200' />

          {/* Pickup */}
          <div className='flex flex-col gap-2'>
            <label>Pickup Date</label>
            <input 
              type="date"
              required id='pickup-date'
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className='border border-gray-300 px-3 py-2 rounded-lg'
              min={new Date().toISOString().split('T')[0]}
            />
            <p className='text-sm text-gray-400'>
              {formatDate(pickupDate)}
            </p>
          </div>

          {/* Return */}
          <div className='flex flex-col gap-2'>
            <label>Return Date</label>
            <input 
              type="date"
              required id ='return-date'
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className='border border-gray-300 px-3 py-2 rounded-lg'
            />
            <p className='text-sm text-gray-400'>
              {formatDate(returnDate)}
            </p>
          </div>

          {/* Button */}
          <button className='w-full bg-blue-600 hover:bg-blue-700 py-3 text-white rounded-xl'>
            Book Now
          </button>

          <p className='text-center text-sm'>
            No credit card required to reserve
          </p>

        </form>

      </div>
    </motion.div>
  ) : <Loader />
}

export default CarDetails