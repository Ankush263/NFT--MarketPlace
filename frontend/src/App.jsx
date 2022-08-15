import Marketplace from './components/Marketplace';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Marketplace />} />
      </Routes>
    </div>
  );
}

export default App;
