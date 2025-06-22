import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const BUCKET_NAME = 'user_files'; // Replace if you named your bucket differently

const StorageSection = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [session, setSession] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchSessionAndFiles = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      if (currentSession) {
        listFiles(currentSession.user.id);
      } else {
        setFiles([]);
        setMessage('Please log in to manage your files.');
      }
    };
    fetchSessionAndFiles();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        if (newSession) {
          listFiles(newSession.user.id);
          setMessage('');
        } else {
          setFiles([]);
          setMessage('Please log in to manage your files.');
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const getUserFilePath = (userId, fileName) => {
    // Store files in a folder named by user_id for organization and easier policy management
    // Example: user_id/fileName.jpg
    return `${userId}/${fileName}`;
  };

  const listFiles = async (userId) => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list(userId, { // List files within the user's folder
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      setMessage(`Error listing files: ${error.message}`);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setMessage('');
    setUploadProgress(0);
  };

  const handleUpload = async () => {
    if (!selectedFile || !session || !session.user) {
      setMessage('Please select a file and ensure you are logged in.');
      return;
    }
    setLoading(true);
    setMessage('');
    setUploadProgress(0);

    const filePath = getUserFilePath(session.user.id, selectedFile.name);

    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false, // true to overwrite, false to error if exists
          contentType: selectedFile.type, // Optional: Supabase usually infers this
          // For progress tracking (if your Supabase client version supports it directly in upload options)
          // This is a conceptual placement; actual implementation might vary.
          // Some versions might need a custom XHR request or a library wrapper for detailed progress.
          // The JS library has more direct support for this in recent versions.
        });

      // A more manual way to track progress if not built into the SDK's upload options directly
      // This is a simplified example. Real progress tracking might involve `onUploadProgress` if the SDK supports it
      // or custom XHR. For now, we'll simulate completion.
      // For supabase-js v2, progress is typically handled via `onProgress` in the `upload` method options.
      // However, the `upload` method itself doesn't return progress directly.
      // Let's assume the upload function in the SDK handles progress internally if configured.
      // For simplicity, we will call listFiles after the attempt.

      if (error) throw error;
      setMessage(`File '${selectedFile.name}' uploaded successfully!`);
      setSelectedFile(null); // Reset file input
      document.getElementById('file-input').value = null; // Clear the file input visually
      listFiles(session.user.id); // Refresh file list
    } catch (error) {
      setMessage(`Error uploading file: ${error.message}`);
    } finally {
      setLoading(false);
      setUploadProgress(0); // Reset progress
    }
  };

  // Example of how you might structure upload with progress if using a newer SDK version or custom logic
  const handleUploadWithProgress = async () => {
    if (!selectedFile || !session || !session.user) {
      setMessage('Please select a file and ensure you are logged in.');
      return;
    }
    setLoading(true);
    setMessage('');
    setUploadProgress(0);
    const filePath = getUserFilePath(session.user.id, selectedFile.name);

    try {
        // Note: The `onProgress` callback for supabase-js v2 is typically part of the XHR events
        // when using `fetch` under the hood. The SDK might abstract this.
        // For this example, we will simulate progress update after a successful call.
        // Actual progress events would fire multiple times during the upload.
        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, selectedFile, {
                cacheControl: '3600',
                upsert: true, // Set to true to overwrite, or handle conflicts
                // contentType: selectedFile.type, // Usually inferred
                // Duplex option might be needed for progress with some file types/sizes.
                // duplex: 'half' // or 'full' depending on server/client capabilities for streaming
            }
            // Supabase JS SDK v2 doesn't have a direct onProgress in the .upload() method options like some libraries.
            // Progress tracking often requires a more custom setup or using a library that wraps XHR.
            // For a basic implementation, we won't have granular progress here.
            // We can set progress to 100 at the end for simplicity.
            );

        if (error) throw error;

        setUploadProgress(100); // Simulate completion
        setMessage(`File '${selectedFile.name}' uploaded successfully!`);
        setSelectedFile(null);
        if(document.getElementById('file-input')) document.getElementById('file-input').value = null;
        listFiles(session.user.id);
    } catch (error) {
        setMessage(`Error uploading file: ${error.message}`);
        setUploadProgress(0);
    } finally {
        setLoading(false);
    }
};


  const handleDownload = async (fileName) => {
    if (!session || !session.user) return;
    setLoading(true);
    setMessage('');
    const filePath = getUserFilePath(session.user.id, fileName);
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .download(filePath);

      if (error) throw error;

      const blob = data;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage(`File '${fileName}' downloaded.`);
    } catch (error) {
      setMessage(`Error downloading file: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileName) => {
    if (!session || !session.user) return;
    if (!window.confirm(`Are you sure you want to delete '${fileName}'?`)) return;

    setLoading(true);
    setMessage('');
    const filePath = getUserFilePath(session.user.id, fileName);
    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]); // remove takes an array of file paths

      if (error) throw error;
      setMessage(`File '${fileName}' deleted successfully.`);
      listFiles(session.user.id); // Refresh file list
    } catch (error) {
      setMessage(`Error deleting file: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getPublicUrl = async (fileName) => {
    if (!session || !session.user) return null;
    const filePath = getUserFilePath(session.user.id, fileName);
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    // Note: getPublicUrl doesn't error for non-existent files in public buckets,
    // it just constructs the URL. For private buckets, signed URLs are needed.
    // This example assumes the bucket might be public or policies allow access.
    // For truly private files, you'd generate a signed URL with an expiration.
    if (data && data.publicUrl) {
        // For display purposes, let's log it. In a real app, you might use this URL in an <img> tag or <a> tag.
        console.log(`Public URL for ${fileName}: ${data.publicUrl}`);
        // If your bucket is public, this URL can be opened directly.
        // If private, this URL won't work without a token (signed URL).
        // For simplicity in this example, we're just showing how to get the base public URL.
        // A better approach for private files is to use .createSignedUrl()
        return data.publicUrl;
    }
    return null;
  };


  if (!session) {
    return (
        <div>
            <h2>File Storage with Supabase</h2>
            <p>Please log in to view and manage your files.</p>
            {message && <p style={{ color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}
        </div>
    );
  }

  return (
    <div>
      <h2>File Storage with Supabase</h2>
      <p>Upload, list, download, and delete files. Ensure you have a bucket named '<strong>{BUCKET_NAME}</strong>' in Supabase Storage and appropriate policies for user folders (e.g., <code>user_id/filename.ext</code>).</p>
      {message && <p style={{ color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}

      <div>
        <h3>Upload File</h3>
        <input type="file" id="file-input" onChange={handleFileChange} disabled={loading} />
        <button onClick={handleUploadWithProgress} disabled={!selectedFile || loading}>
          {loading && selectedFile ? `Uploading (${uploadProgress}%)` : 'Upload'}
        </button>
        {loading && selectedFile && uploadProgress > 0 && <progress value={uploadProgress} max="100" style={{ marginLeft: '10px', width: '200px' }}></progress>}
      </div>

      <hr style={{ margin: '20px 0' }} />

      <h3>Your Files</h3>
      {loading && files.length === 0 && <p>Loading files...</p>}
      {!loading && files.length === 0 && session && <p>No files found. Upload one!</p>}
      {files.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {files.map(file => (
            <li key={file.id || file.name} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>
                {file.name} <small>({file.metadata ? (file.metadata.size / 1024).toFixed(2) + ' KB' : 'N/A'})</small>
                {/* Example: Show public URL if available (for public buckets or testing) */}
                {/* <button onClick={async () => { const url = await getPublicUrl(file.name); if(url) window.open(url, '_blank'); else alert('Could not get public URL.'); }} style={{marginLeft: '10px'}}>View</button> */}
              </span>
              <div>
                <button onClick={() => handleDownload(file.name)} disabled={loading} style={{ marginRight: '5px' }}>Download</button>
                <button onClick={() => handleDelete(file.name)} disabled={loading}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StorageSection;
