import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthSection = () => {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const currentSession = supabase.auth.getSession();
    setSession(currentSession);


    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      // No explicit unsubscribe needed for getSession,
      // but for onAuthStateChange, the listener itself should be an object with an unsubscribe method if you are using v2
      // For v1 like { data: authListener } = ..., it implies authListener.subscription.unsubscribe() if available
      // However, the common pattern for Supabase v2 is:
      // const { data: { subscription } } = supabase.auth.onAuthStateChange(...)
      // return () => subscription.unsubscribe()
      // Given the current Supabase JS v2 syntax, it's often:
      // const { data: listener } = supabase.auth.onAuthStateChange(...)
      // return () => { listener?.unsubscribe(); };
      // For simplicity and common practice, let's assume the listener object might have an unsubscribe method.
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setMessage('Logged in successfully!');
    } catch (error) {
      setMessage(`Error: ${error.error_description || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      setMessage('Signed up successfully! Please check your email to confirm.');
    } catch (error) {
      setMessage(`Error: ${error.error_description || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setMessage('');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setMessage('Logged out successfully!');
      setEmail('');
      setPassword('');
    } catch (error) {
      setMessage(`Error: ${error.error_description || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (session && session.user) {
    return (
      <div>
        <h2>Authentication Status</h2>
        <p>Logged in as: {session.user.email}</p>
        {message && <p>{message}</p>}
        <button onClick={handleLogout} disabled={loading}>
          {loading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Authentication with Supabase</h2>
      <p>This section covers user sign-up, login, and session management.</p>
      {message && <p style={{ color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}

      <form onSubmit={handleLogin}>
        <h3>Login</h3>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <hr style={{ margin: '20px 0' }} />

      <form onSubmit={handleSignUp}>
        <h3>Sign Up</h3>
         <div>
          <label htmlFor="signup-email">Email:</label>
          <input
            type="email"
            id="signup-email" // Ensure unique ID if both forms are present and email state is shared
            value={email} // Consider using separate state for sign-up email if needed
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="signup-password">Password:</label>
          <input
            type="password"
            id="signup-password" // Ensure unique ID
            value={password} // Consider using separate state for sign-up password
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default AuthSection;
