import React, { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:5000/api';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${API_BASE}/bookings`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch bookings');
        }

        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-light text-gray-800 mb-2">My Bookings</h1>
          <p className="text-gray-500">View and manage your upcoming and past car rentals</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading your bookings...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-white rounded-2xl p-12 shadow-sm max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Bookings Found</h3>
            <p className="text-gray-500">You haven't made any bookings yet</p>
            <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200">
              Browse Cars
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {booking.carId?.name || 'N/A'}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {booking.status || 'Confirmed'}
                      </span>
                      <span className="text-gray-500 text-sm">
                        Booking ID: {booking._id.substring(0, 8)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">₹{booking.totalPrice}</p>
                    <p className="text-sm text-gray-500">Total</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Pickup Location</p>
                    <p className="text-gray-700">{booking.pickupLocation}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Contact</p>
                    <p className="text-gray-700">{booking.contactInfo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Booking Date</p>
                    <p className="text-gray-700">
                      {new Date(booking.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Rental Time and date</p>
                      <p className="text-gray-700">
                        {new Date(booking.createdAt).toLocaleString()}
                      </p>

                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Rental Duration</p>
                      <p className="text-gray-700">
                       {booking.hours} {booking.hours === 1 ? 'hour' : 'hours'}
                      </p>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
