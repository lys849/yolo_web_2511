// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ImageDetect from "./pages/ImageDetect.jsx";
import VideoDetect from "./pages/VideoDetect.jsx";

export default function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/image" element={<ImageDetect />} />
          <Route path="/video" element={<VideoDetect />} />
        </Routes>
    </BrowserRouter>
  );
}


