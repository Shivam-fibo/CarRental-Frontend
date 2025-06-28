import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const API_BASE = 'http://localhost:5000/api';

const BookingModal = ({ car, onClose, userId }) => {
  const [form, setForm] = useState({
    pickupDate: new Date(),
    pickupTime: '09:00',
    pickupLocation: '',
    contactInfo: '',
    hours: 1,
    userId: userId 
  });

  const [price, setPrice] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    calculatePrice();
  }, [form.hours, car.pricePerDay]); // Using pricePerDay as if it were pricePerHour

  const calculatePrice = () => {
    // Treat pricePerDay as the hourly rate
    const calculatedPrice = car.pricePerDay * form.hours;
    setPrice(calculatedPrice);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDateChange = (date) => {
    setForm((prev) => ({ ...prev, pickupDate: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!form.pickupDate || !form.pickupTime || !form.pickupLocation || !form.contactInfo) {
      setError('Please complete all fields');
      return;
    }

    try {
      setLoading(true);
      
      // Combine date and time
      const pickupDateTime = new Date(form.pickupDate);
      const [hours, minutes] = form.pickupTime.split(':');
      pickupDateTime.setHours(parseInt(hours), parseInt(minutes));

      const bookingData = {
        carId: car._id,
        userId: form.userId,
        pickupDateTime: pickupDateTime.toISOString(),
        pickupLocation: form.pickupLocation,
        contactInfo: form.contactInfo,
        hours: parseInt(form.hours),
        totalPrice: price
      };

      console.log("Submitting booking:", bookingData); // Debug log

      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Booking failed');

      setMessage('✅ Booking successful!');
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      console.error("Booking error:", err); // Debug log
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 min-h-screen">
  <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all duration-300">
    {/* Modal Header */}
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 relative">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors duration-200"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 className="text-2xl font-bold text-white">Book: {car.name}</h2>
      <p className="text-blue-100 mt-1">₹{car.pricePerDay} per hour</p>
    </div>

    {/* Modal Body */}
    <div className="p-6">
      <form className="space-y-1" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
          <DatePicker
            selected={form.pickupDate}
            onChange={handleDateChange}
            minDate={new Date()}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time</label>
          <input
            type="time"
            name="pickupTime"
            value={form.pickupTime}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            min="08:00"
            max="20:00"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
          <input
            type="text"
            name="pickupLocation"
            placeholder="Enter pickup address"
            value={form.pickupLocation}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
          <input
            type="email"
            name="contactInfo"
            placeholder="Your email"
            value={form.contactInfo}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hours to Book</label>
          <select
            name="hours"
            value={form.hours}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((hour) => (
              <option key={hour} value={hour}>
                {hour} hour{hour !== 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-lg font-bold text-blue-800 text-center">
            Total Price: ₹{price.toFixed(2)}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        
        {message && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
            <p className="text-green-700 text-sm">{message}</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Booking...
            </span>
          ) : 'Confirm Booking'}
        </button>
      </form>
    </div>
  </div>
</div>

  );
};

export default BookingModal;