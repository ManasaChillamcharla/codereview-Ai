import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './router/AppRouter.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <AppRouter />
        <Toaster position="top-right" reverseOrder={false} />
      </Router>
    </ThemeProvider>
  );
};

export default App;
