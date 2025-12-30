import './App.css';
import { Route, Routes } from 'react-router-dom';
import NavBar from './shared/NavBar';
import About from './pages/About';
import Home from './shared/Home';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import DoctorDetails from './pages/DoctorDetails';
import Footer from './shared/Footer';
import Appointments from './pages/Appointments';
import FAQs from './pages/FAQs.js';
function App() {
  
  return (
   <>
    <NavBar />
    <Routes>
    <Route path="/" element={<Home />} />
  <Route path="/faqs" element={<FAQs />} />

        <Route path="/about" element={<About />} />
        <Route path="/doctor/:id" element={<DoctorDetails />} />
        <Route path="/Auth" element={<Auth />} />
        <Route path="/contact" element={<Contact />} />
         <Route path="/appointments" element={<Appointments />} />
    </Routes>
    <Footer/>
</>
   
  );
}

export default App; 
