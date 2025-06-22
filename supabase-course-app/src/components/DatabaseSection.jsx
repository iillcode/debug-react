import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const DatabaseSection = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingNote, setEditingNote] = useState(null); // Stores the note being edited
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        if (session) {
            fetchNotes(session.user.id);
        } else {
            setNotes([]); // Clear notes if not logged in
            setMessage('Please log in to manage your notes.');
        }
    };
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        if (newSession) {
          fetchNotes(newSession.user.id);
          setMessage('');
        } else {
          setNotes([]);
          setMessage('Please log in to manage your notes.');
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const fetchNotes = async (userId) => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId) // Ensure RLS is set up for this to work securely
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      setMessage(`Error fetching notes: ${error.message}`);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!session || !session.user) {
        setMessage("You must be logged in to create a note.");
        return;
    }
    setLoading(true);
    setMessage('');
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([{ title, content, user_id: session.user.id }])
        .select(); // .select() returns the inserted rows

      if (error) throw error;
      setNotes(prevNotes => [data[0], ...prevNotes]); // Add to the beginning of the list
      setTitle('');
      setContent('');
      setMessage('Note created successfully!');
    } catch (error) {
      setMessage(`Error creating note: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    if (!editingNote || !session || !session.user) return;
    setLoading(true);
    setMessage('');
    try {
      const { data, error } = await supabase
        .from('notes')
        .update({ title, content })
        .eq('id', editingNote.id)
        .eq('user_id', session.user.id) // Important for security
        .select();

      if (error) throw error;
      setNotes(notes.map(note => (note.id === editingNote.id ? data[0] : note)));
      setEditingNote(null);
      setTitle('');
      setContent('');
      setMessage('Note updated successfully!');
    } catch (error) {
      setMessage(`Error updating note: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!session || !session.user) return;
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    setLoading(true);
    setMessage('');
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', session.user.id); // Important for security

      if (error) throw error;
      setNotes(notes.filter(note => note.id !== noteId));
      setMessage('Note deleted successfully!');
    } catch (error) {
      setMessage(`Error deleting note: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setMessage(''); // Clear previous messages
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setTitle('');
    setContent('');
    setMessage('');
  };

  if (!session) {
    return (
        <div>
            <h2>Database Operations (CRUD) with Supabase</h2>
            <p>Please log in to view and manage your notes.</p>
            {message && <p style={{ color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}
        </div>
    );
  }

  return (
    <div>
      <h2>Database Operations (CRUD) with Supabase</h2>
      <p>Create, read, update, and delete your personal notes. Ensure you have a 'notes' table set up in your Supabase project with RLS enabled.</p>
      {message && <p style={{ color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}

      <h3>{editingNote ? 'Edit Note' : 'Create New Note'}</h3>
      <form onSubmit={editingNote ? handleUpdateNote : handleCreateNote}>
        <div>
          <label htmlFor="note-title">Title:</label>
          <input
            type="text"
            id="note-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="note-content">Content:</label>
          <textarea
            id="note-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? (editingNote ? 'Updating...' : 'Creating...') : (editingNote ? 'Update Note' : 'Create Note')}
        </button>
        {editingNote && (
          <button type="button" onClick={cancelEdit} disabled={loading} style={{ marginLeft: '10px' }}>
            Cancel Edit
          </button>
        )}
      </form>

      <hr style={{ margin: '20px 0' }} />

      <h3>Your Notes</h3>
      {loading && notes.length === 0 && <p>Loading notes...</p>}
      {!loading && notes.length === 0 && session && <p>No notes found. Create one!</p>}
      {notes.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {notes.map(note => (
            <li key={note.id} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
              <h4>{note.title}</h4>
              <p>{note.content}</p>
              <small>Created: {new Date(note.created_at).toLocaleString()}</small>
              <div style={{ marginTop: '10px' }}>
                <button onClick={() => startEdit(note)} disabled={loading} style={{ marginRight: '5px' }}>Edit</button>
                <button onClick={() => handleDeleteNote(note.id)} disabled={loading}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DatabaseSection;
