import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Result from './pages/Result'
import Features from './pages/Features'
import About from './pages/About'
import Header from './components/Header'
import Footer from './components/Footer'


export default function App() {
return (
    <BrowserRouter>
        <Header />

        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/result" element={<Result />} />
            <Route path="/features" element={<Features />} />
            <Route path="/about" element={<About />} />
        </Routes>

        <Footer />
    </BrowserRouter>
    )
}