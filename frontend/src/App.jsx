import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Homepage';
// import CharacterDetailsPage from './pages/CharacterDetailsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-inter">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/characters/:id" element={<CharacterDetailsPage />} /> */}
          
          {/* Optional: 404 fallback */}
          {/* <Route path="*" element={<p className="text-center mt-10 text-red-500">Page Not Found</p>} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
