import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { AuthProvider } from './context/AuthContext';
import { NotesProvider } from './context/NotesContext';

import { PrimeReactProvider } from 'primereact/api';

function App() {
  return (
    <AuthProvider>
      <NotesProvider>
        <PrimeReactProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </BrowserRouter>
        </PrimeReactProvider>
      </NotesProvider>
    </AuthProvider>
  );
}

export default App;