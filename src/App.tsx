// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeSection from "./pages/home.pages";
import ConnectPage from "./pages/connect.pages";
import Chat from "./pages/message.pages";
import LoginForm from "./pages/login.pages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeSection/>} />
        <Route path="/connect" element={<ConnectPage/>} />
        <Route path="/login" element={<LoginForm/>} />
        <Route path="/chat" element={<Chat/>} />
      </Routes>
    </Router>
  );
}

export default App;