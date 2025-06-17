import React, { useEffect, useState } from "react";
import {
  Typography, Card, CardContent, Grid, IconButton, TextField, Button, Box, Chip, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete, Fab, Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AddIcon from "@mui/icons-material/Add";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import { useNavigate } from "react-router-dom";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", content: "", collaborators: [] });
  const [collabDialogOpen, setCollabDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ title: "", content: "", collaborators: [] });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem(ACCESS_TOKEN);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchNotes();
    api.get("/api/users/").then(res => setAllUsers(res.data));
    // eslint-disable-next-line
  }, []);

  const fetchNotes = () => {
    api.get("/api/notes/")
      .then(res => setNotes(res.data))
      .catch(() => setNotes([]));
  };

  // Edit logic
  const handleEdit = (note) => {
    setEditingId(note.id);
    setEditForm({
      title: note.title,
      content: note.content,
      collaborators: note.collaborators_info ? note.collaborators_info.map(u => u.username) : []
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = (id) => {
    api.put(`/api/notes/${id}/`, editForm)
      .then(() => {
        setEditingId(null);
        fetchNotes();
      })
      .catch(() => setError("You are not authorized to edit this note."));
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setError("");
  };

  // Delete logic
  const handleDelete = (id) => {
    api.delete(`/api/notes/${id}/`)
      .then(() => fetchNotes())
      .catch(() => setError("You are not authorized to delete this note."));
  };

  // Collaboration dialog logic
  const openCollabDialog = (note) => {
    setSelectedNote(note);
    setCollaborators(note.collaborators_info ? note.collaborators_info.map(u => u.username) : []);
    setCollabDialogOpen(true);
  };

  const handleCollabSave = () => {
    api.put(`/api/notes/${selectedNote.id}/`, {
      title: selectedNote.title,
      content: selectedNote.content,
      collaborators: collaborators,
    }).then(() => {
      setCollabDialogOpen(false);
      fetchNotes();
    }).catch(() => setError("You are not authorized to update collaborators."));
  };

  // Create Note logic
  const handleCreateOpen = () => {
    setCreateForm({ title: "", content: "", collaborators: [] });
    setCreateDialogOpen(true);
    setError("");
  };

  const handleCreateChange = (e) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  };

  const handleCreateSave = () => {
    api.post("/api/notes/", createForm)
      .then(() => {
        setCreateDialogOpen(false);
        fetchNotes();
      })
      .catch(() => setError("Failed to create note. Please check your input."));
  };

  if (!isLoggedIn) {
    return <Alert severity="info">Please log in to view your notes.</Alert>;
  }

  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>Collaborative Notes</Typography>
        <Fab color="primary" aria-label="add" onClick={handleCreateOpen} size="small">
          <AddIcon />
        </Fab>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={2}>
        {notes.map(note => (
          <Grid item xs={12} md={6} lg={4} key={note.id}>
            <Card>
              <CardContent>
                {editingId === note.id ? (
                  <Box>
                    <TextField
                      label="Title"
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Content"
                      name="content"
                      value={editForm.content}
                      onChange={handleEditChange}
                      fullWidth
                      margin="normal"
                      multiline
                      minRows={3}
                    />
                    <Autocomplete
                      multiple
                      options={allUsers}
                      getOptionLabel={option => option.username}
                      value={allUsers.filter(u => editForm.collaborators.includes(u.username))}
                      onChange={(e, value) => setEditForm({ ...editForm, collaborators: value.map(u => u.username) })}
                      renderInput={params => <TextField {...params} label="Collaborators" />}
                      sx={{ mt: 2 }}
                    />
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={() => handleEditSave(note.id)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<CancelIcon />}
                        onClick={handleEditCancel}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Typography variant="h6">{note.title}</Typography>
                    <Typography>{note.content}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(note.created_at).toLocaleString()}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <IconButton color="primary" onClick={() => handleEdit(note)}>
                <EditIcon />
              </IconButton>
              {/* Only show delete button if current user is the author */}
              {note.author_username === localStorage.getItem("username") && (
                <IconButton color="error" onClick={() => handleDelete(note.id)}>
                  <DeleteIcon />
                </IconButton>
              )}
              <IconButton color="secondary" onClick={() => openCollabDialog(note)}>
                <GroupAddIcon />
              </IconButton>
            </Box>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">Collaborators:</Typography>
                      {note.collaborators_info && note.collaborators_info.length > 0 ? (
                        note.collaborators_info.map(user => (
                          <Chip
                            key={user.id}
                            avatar={<Avatar>{user.username[0].toUpperCase()}</Avatar>}
                            label={user.username}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))
                      ) : (
                        <Typography variant="caption" color="text.secondary">None</Typography>
                      )}
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Create Note Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
        <DialogTitle>New Note</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            value={createForm.title}
            onChange={handleCreateChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Content"
            name="content"
            value={createForm.content}
            onChange={handleCreateChange}
            fullWidth
            margin="normal"
            multiline
            minRows={3}
          />
          <Autocomplete
            multiple
            options={allUsers}
            getOptionLabel={option => option.username}
            value={allUsers.filter(u => createForm.collaborators.includes(u.username))}
            onChange={(e, value) => setCreateForm({ ...createForm, collaborators: value.map(u => u.username) })}
            renderInput={params => <TextField {...params} label="Collaborators" />}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateSave} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
      {/* Collaborators Dialog */}
      <Dialog open={collabDialogOpen} onClose={() => setCollabDialogOpen(false)}>
        <DialogTitle>Edit Collaborators</DialogTitle>
        <DialogContent>
          <Autocomplete
            multiple
            options={allUsers}
            getOptionLabel={option => option.username}
            value={allUsers.filter(u => collaborators.includes(u.username))}
            onChange={(e, value) => setCollaborators(value.map(u => u.username))}
            renderInput={params => <TextField {...params} label="Collaborators" />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCollabDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCollabSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
       </div>
  );
}