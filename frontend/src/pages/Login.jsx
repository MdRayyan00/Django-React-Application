import React, { useState } from "react";
import { TextField, Button, Typography, Box, Alert, Paper } from "@mui/material";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

export default function Login({setIsLoggedIn}) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      const res = await api.post("/api/token/", form);
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem("username", form.username);
      if(setIsLoggedIn) setIsLoggedIn(true);
      navigate("/notes");
    } catch (err) {
      setError("Invalid username or password.");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: "auto", mt: 6 }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          fullWidth
          margin="normal"
          autoFocus
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </Box>
    </Paper>
  );
}