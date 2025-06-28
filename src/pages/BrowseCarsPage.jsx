import React, { useEffect, useState, useMemo } from 'react';
import BookingModal from '../components/BookingModel';
import toast from 'react-hot-toast';

const API_BASE = 'https://car-rental-backend-amber.vercel.app/api';
const PAGE_SIZE = 9;

function BrowseCarsPage() {
  const [allCars, setAllCars] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const [filters, setFilters] = useState({
    type: '',
    fuelType: '',
    transmission: '',
    rating: '',
    maxPrice: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const carsResponse = await fetch(`${API_BASE}/cars`);
        if (!carsResponse.ok) throw new Error('Failed to load cars');

        const carsData = await carsResponse.json();

        const wishlistResponse = await fetch(`${API_BASE}/wishlist`);

        if (!wishlistResponse.ok) throw new Error('Failed to load wishlist');

        const wishlistData = await wishlistResponse.json();
        console.log(wishlistData)
        setAllCars(carsData);
        setWishlist(wishlistData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCars = useMemo(() => {
    return allCars.filter((car) => {
      const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filters.type || car.type === filters.type;
      const matchesFuel = !filters.fuelType || car.fuelType === filters.fuelType;
      const matchesTransmission = !filters.transmission || car.transmission === filters.transmission;
      const matchesRating = !filters.rating || car.rating >= Number(filters.rating);
      const matchesPrice = !filters.maxPrice || car.pricePerDay <= Number(filters.maxPrice);

      return (
        matchesSearch &&
        matchesType &&
        matchesFuel &&
        matchesTransmission &&
        matchesRating &&
        matchesPrice
      );
    });
  }, [allCars, searchTerm, filters]);

  const totalPages = Math.ceil(filteredCars.length / PAGE_SIZE);
  const paginatedCars = filteredCars.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const isInWishlist = (carId) => {
    return wishlist.some(item => item.carId?._id === carId);
  };

  const handleWishlist = async (carId) => {
    try {
      setWishlistLoading(true);
      setError(null);

      if (isInWishlist(carId)) {
        const response = await fetch(`${API_BASE}/wishlist/${carId}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to remove from wishlist');
        toast.success('Removed from wishlist');

        setWishlist(wishlist.filter(item =>
          item.carId?._id !== carId && item._id !== carId
        ));
      } else {
        const response = await fetch(`${API_BASE}/wishlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ carId })
        });
        if (!response.ok) throw new Error('Failed to add to wishlist');
        toast.success('Added to wishlist');

        const newItem = await response.json();

        const carDetails = allCars.find(car => car._id === carId);

        setWishlist([...wishlist, {
          ...newItem,
          carId: carDetails
        }]);
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      fuelType: '',
      transmission: '',
      rating: '',
      maxPrice: '',
    });
    setSearchTerm('');
    setCurrentPage(1);
    toast.success('Filters cleared');
  };
  const getBrandImage = (brand) => {
    const brandMap = {
      maruti: 'maruti.avif',
      hyundai: 'hyuandai.avif',
      mahindra: 'mahindra.avif',
      tata: 'tata.avif',
      renault: 'renault.avif',
      ford: 'ford.avif',
      honda: 'honda.avif',
      kia: 'kia.avif',
      skoda: 'skoda.avif',
      nissan: 'nissen.avif',
      datsun: 'datsun.avif',
      tesla: 'tesla.avif',
      toyota: 'toyota.avif',
    };

    return `/brand/${brandMap[brand.toLowerCase()] || 'placeholder.png'}`;
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-light text-gray-800 mb-2">Premium Car Collection</h1>
              <p className="text-gray-500 text-lg">Discover luxury vehicles for your journey</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-50 rounded-full p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-all duration-200 ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full transition-all duration-200 ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for your perfect car..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Types</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
              </select>

              <select
                name="fuelType"
                value={filters.fuelType}
                onChange={handleFilterChange}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Fuel Types</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
              </select>

              <select
                name="transmission"
                value={filters.transmission}
                onChange={handleFilterChange}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Transmissions</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>

              <select
                name="rating"
                value={filters.rating}
                onChange={handleFilterChange}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Any Rating</option>
                <option value="5">5 stars</option>
                <option value="4">4 stars & up</option>
                <option value="3">3 stars & up</option>
              </select>

              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price/hour"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                min="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">


        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading premium vehicles...</p>
            </div>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl p-12 shadow-sm max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Cars Found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          </div>
        ) : (
          <>
            {/* Results Info */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-800">{((currentPage - 1) * PAGE_SIZE) + 1}-{Math.min(currentPage * PAGE_SIZE, filteredCars.length)}</span> of <span className="font-semibold text-gray-800">{filteredCars.length}</span> vehicles
              </p>
            </div>

            {/* Car Grid/List */}
            <div className={viewMode === 'grid'
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
              : "space-y-6"
            }>
              {paginatedCars.map((car) => (
                <div
                  key={car._id}
                  className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group ${viewMode === 'list' ? 'flex' : ''
                    }`}
                >
                  <div className={`bg-white flex items-center justify-center ${viewMode === 'list' ? 'w-48 h-32' : 'h-48'}`}>
                    <img
                      src={getBrandImage(car.brand)}
                      alt={car.brand}
                      className="object-contain max-h-full max-w-full"
                    />
                  </div>


                  <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{car.name}</h3>
                        <p className="text-gray-500 font-medium">{car.brand}</p>
                      </div>
                      <button
                        onClick={() => handleWishlist(car._id)}
                        disabled={wishlistLoading}
                        className={`p-2 rounded-full transition-all duration-200 ${isInWishlist(car._id)
                          ? 'text-red-500 bg-red-50 hover:bg-red-100'
                          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                          }`}
                        aria-label={isInWishlist(car._id) ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <svg className="w-6 h-6" fill={isInWishlist(car._id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>

                    <div className={`grid ${viewMode === 'list' ? 'grid-cols-6' : 'grid-cols-2'} gap-4 mb-6`}>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">{car.type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">{car.fuelType}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">{car.transmission}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-semibold text-gray-700">{car.rating}</span>
                      </div>
                    </div>

                    <div className={`flex items-center ${viewMode === 'list' ? 'justify-between' : 'justify-between'}`}>
                      <div>
                        <p className="text-2xl font-bold text-gray-800">₹{car.pricePerDay}</p>
                        <p className="text-sm text-gray-500">per hour</p>
                      </div>
                      <button
                        onClick={() => setSelectedCar(car)}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  First
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Previous
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-xl transition-all duration-200 ${currentPage === pageNum
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Last
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedCar && (
        <BookingModal
          userId="1234"
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
        />
      )}
    </div>
  );
}

export default BrowseCarsPage;