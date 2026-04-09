 import React, { useEffect, useState } from 'react';
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ManageBookings = () => {
  const { currency, axios } = useAppContext();

  const [bookings, setBookings] = useState([]);

  // Fetch owner bookings
  const fetchOwnerBooking = async () => {
    try {
      const { data } = await axios.get('/api/bookings/owner');
      if (data.success) {
        setBookings(data.bookings || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Change booking status
  const changeBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post('/api/bookings/change-status', { bookingId, status });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerBooking();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchOwnerBooking();
  }, []);

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses."
      />

      <div className="w-3/4 rounded-md overflow-hidden border border-borderColor mt-6">
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500">
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Date Range</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium max-md:hidden">Payment</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings?.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking._id} className="border-t border-borderColor text-gray-500">
                  {/* Car Info */}
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={booking.car?.image || '/fallback-image.png'}
                      alt={`${booking.car?.brand || ''} ${booking.car?.model || ''}`}
                      className="h-12 w-12 aspect-square rounded-md object-cover"
                    />
                    <p className="font-medium max-md:hidden">
                      {booking.car?.brand} {booking.car?.model}
                    </p>
                  </td>

                  {/* Date Range */}
                  <td className="p-3 max-md:hidden">
                    {booking.pickupDate ? booking.pickupDate.split('T')[0] : 'N/A'} to{' '}
                    {booking.returnDate ? booking.returnDate.split('T')[0] : 'N/A'}
                  </td>

                  {/* Total Price */}
                  <td className="p-3">
                    {currency} {booking.price || 0}
                  </td>

                  {/* Payment Info */}
                  <td className="p-3 max-md:hidden">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                      {booking.paymentMethod || 'offline'}
                    </span>
                  </td>

                  {/* Status / Actions */}
                  <td className="p-3">
                    {booking.status === 'pending' ? (
                      <select
                        onChange={(e) => changeBookingStatus(booking._id, e.target.value)}
                        value={booking.status}
                        className="px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="confirmed">Confirmed</option>
                      </select>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-500'
                            : 'bg-red-100 text-red-500'
                        }`}
                      >
                        {booking.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-400">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;