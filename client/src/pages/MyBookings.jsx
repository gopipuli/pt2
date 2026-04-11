import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const MyBookings = () => {

  const { axios, user, currency } = useAppContext()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/user')

      if (data.success && Array.isArray(data.bookings)) {
        setBookings(data.bookings)
      } else {
        setBookings([])
        toast.error(data.message || "No bookings found")
      }

    } catch (error) {
      toast.error(error.message)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchMyBookings()
    }
  }, [user])

  // ✅ Loading UI
  if (loading) {
    return <p className="mt-20 text-center">Loading bookings...</p>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl'
    >

      <Title
        title='My Bookings'
        subTitle="View and manage your all car bookings"
        align="left"
      />

      <div>
        {bookings.length === 0 ? (
          <p className="mt-10 text-gray-500">No bookings available</p>
        ) : (
          bookings.map((booking, index) => (

            <div
              key={booking?._id || index}
              className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-gray-200 rounded-lg mt-5 first:mt-12'
            >

              {/* Car Info */}
              <div className='rounded-md overflow-hidden mb-3'>
                <img
                  src={booking?.car?.image || ''}
                  alt=""
                  className='w-full h-auto aspect-video object-cover'
                />
                <p className='text-lg font-medium mt-2'>
                  {booking?.car?.brand || 'N/A'} {booking?.car?.model || ''}
                </p>
                <p className='text-gray-500'>
                  {booking?.car?.year || 'N/A'} • {booking?.car?.category || 'N/A'} • {booking?.car?.location || 'N/A'}
                </p>
              </div>

              {/* Booking Details */}
              <div className='md:col-span-2'>
                <div className='flex items-center gap-2'>
                  <p className='px-3 py-1.5 bg-light rounded'>
                    Booking #{index + 1}
                  </p>

                  <p className={`px-3 py-1 rounded-full ${
                    booking?.status === 'confirmed'
                      ? 'bg-green-400/15 text-green-600'
                      : 'bg-red-400/15 text-red-600'
                  }`}>
                    {booking?.status || 'pending'}
                  </p>
                </div>

                {/* Rental Period */}
                <div className='flex items-start gap-3 mt-3'>
                  <img src={assets.calendar_icon_colored} alt="" className='w-4 h-4 mt-1'/>
                  <div>
                    <p className='text-gray-500'>Rental Period</p>
                    <p>
                      {booking?.pickupDate?.split?.('T')?.[0] || 'N/A'} to {booking?.returnDate?.split?.('T')?.[0] || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className='flex items-start gap-3 mt-3'>
                  <img src={assets.location_icon_colored} alt="" className='w-4 h-4 mt-1'/>
                  <div>
                    <p className='text-gray-500'>Pick-up Location</p>
                    <p>{booking?.car?.location || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className='md:col-span-1 flex flex-col justify-between gap-6'>
                <div>
                  <p>Total Price</p>
                  <h1 className='text-2xl font-semibold text-blue-600'>
                    {currency}{booking?.price || 0}
                  </h1>
                  <p>
                    Booked on {booking?.createdAt?.split?.('T')?.[0] || 'N/A'}
                  </p>
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </motion.div>
  )
}

export default MyBookings