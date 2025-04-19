import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import Auth from './pages/Auth.tsx';
import './App.css';
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
