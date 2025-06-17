import React, { useState } from "react";
import { TextField, Button, Typography, Box, Alert, Paper } from "@mui/material";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ username: "", password: "", password2: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.username || !form.password || !form.password2) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password !== form.password2) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await api.post("/api/user/register/", {
        username: form.username,
        password: form.password,
      });
      setSuccess("Registration successful! You can now log in.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError("Registration failed. Username may already be taken.");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: "auto", mt: 6 }}>
      <Typography variant="h5" gutterBottom>Register</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
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
        <TextField
          label="Confirm Password"
          name="password2"
          type="password"
          value={form.password2}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Register
        </Button>
      </Box>
    </Paper>
  );
}