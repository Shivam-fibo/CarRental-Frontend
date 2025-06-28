import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import BrowseCarsPage from './pages/BrowseCarsPage';
import CarDetailsPage from './pages/CarDetailsPage';
import BookingFlowPage from './pages/BookingFlowPage';
import MyBookingsPage from './pages/MyBookingsPage';

function App() {
  return (
    <Router>
      <Toaster/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowseCarsPage />} />
        <Route path="/cars/:id" element={<CarDetailsPage />} />
        <Route path="/booking" element={<BookingFlowPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
