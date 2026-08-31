import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CreateBoard from './pages/CreateBoard';
import ReportQueue from './pages/ReportQueue';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-board" element={<CreateBoard />} />
        <Route path="/reports" element={<ReportQueue />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;