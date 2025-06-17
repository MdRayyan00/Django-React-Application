import React, {useEffect,useState} from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import Home from "./pages/Home";
import Notes from "./pages/Notes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { ACCESS_TOKEN } from "./constants";

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem(ACCESS_TOKEN));
  const navigate = useNavigate();

  useEffect(() => {
    const onStorage = () => setIsLoggedIn(!!localStorage.getItem(ACCESS_TOKEN));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    setIsLoggedIn(false);
    navigate("/login");
  };

  
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Notes App
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          {isLoggedIn ? (
            <>
              <Button color="inherit" component={Link} to="/notes">Notes</Button>
              <Button color="inherit" component={Link} to="/profile">Profile</Button>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </>
  );
}


export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}