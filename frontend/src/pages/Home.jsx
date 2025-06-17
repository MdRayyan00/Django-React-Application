import React from "react";
import { Typography, Alert } from "@mui/material";
import { ACCESS_TOKEN } from "../constants";

export default function Home() {
  const isLoggedIn = !!localStorage.getItem(ACCESS_TOKEN);

  return (
    <div>
      <Typography variant="h4" gutterBottom>Welcome to Notes App</Typography>
      <Typography>Organize your notes efficiently and securely.</Typography>
      {!isLoggedIn && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Please log in to view and manage your notes.
        </Alert>
      )}
    </div>
  );
}