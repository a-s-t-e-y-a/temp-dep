import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './Router'; // Make sure this is the file where you define createBrowserRouter

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
