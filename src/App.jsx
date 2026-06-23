import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ListingPage from './pages/ListingPage';
import DetailPage from './pages/DetailPage';

function App() {
  return (
    <Router>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ListingPage />} />
          <Route path="/product/:id" element={<DetailPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
