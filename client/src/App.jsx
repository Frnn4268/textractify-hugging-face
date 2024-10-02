import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import ImageCapture from './components/ImageCapture';
import SavedImages from './components/SavedImages';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/images">Saved Images</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<ImageCapture />} />
          <Route path="/images" element={<SavedImages />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;