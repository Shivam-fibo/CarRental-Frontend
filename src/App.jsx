import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import BrowseCarsPage from './pages/BrowseCarsPage';

import MyBookingsPage from './pages/MyBookingsPage';

function App() {
  return (
    <Router>
      <Toaster/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowseCarsPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
