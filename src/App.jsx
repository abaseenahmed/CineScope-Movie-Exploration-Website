// App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import { MovieProvider } from './context/MovieContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <MovieProvider>
          <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-500 dark:bg-zinc-950 dark:text-zinc-100">
            <Navbar />
            <main className="pt-16">
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </MovieProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
