# Interactive Supabase Course React Application

Welcome to the Interactive Supabase Course! This application is designed to provide a hands-on learning experience with Supabase, a powerful open-source Firebase alternative. You'll explore key Supabase features including Authentication, Database (CRUD operations), and File Storage, all integrated into a functional React application built with Vite.

**Live Demo Note:** This application requires you to set up your own Supabase project and populate the credentials in `src/supabaseClient.js`.

## Table of Contents

1.  [About Supabase](#about-supabase)
2.  [Project Setup](#project-setup)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
    *   [Supabase Configuration](#supabase-configuration)
3.  [Running the Application](#running-the-application)
4.  [Course Modules (Application Features)](#course-modules-application-features)
    *   [Module 1: Supabase Client Initialization](#module-1-supabase-client-initialization)
    *   [Module 2: Authentication](#module-2-authentication)
        *   [Sign Up](#sign-up)
        *   [Login](#login)
        *   [Logout](#logout)
        *   [Session Management](#session-management)
    *   [Module 3: Database (CRUD Operations)](#module-3-database-crud-operations)
        *   [Table Setup (`notes`)](#table-setup-notes)
        *   [Row Level Security (RLS)](#row-level-security-rls)
        *   [Create (Insert)](#create-insert)
        *   [Read (Select)](#read-select)
        *   [Update](#update)
        *   [Delete](#delete)
    *   [Module 4: File Storage](#module-4-file-storage)
        *   [Bucket Setup (`user_files`)](#bucket-setup-user_files)
        *   [Storage Policies](#storage-policies)
        *   [Upload Files](#upload-files)
        *   [List Files](#list-files)
        *   [Download Files](#download-files)
        *   [Delete Files](#delete-files)
5.  [Key Supabase Concepts Used](#key-supabase-concepts-used)
6.  [Further Learning](#further-learning)

## 1. About Supabase

Supabase is an open-source Firebase alternative that provides developers with a suite of tools to build applications quickly. It offers:
*   **PostgreSQL Database:** A full-fledged, powerful SQL database.
*   **Authentication:** Easy-to-implement user sign-up, login, and management.
*   **Storage:** Store and serve large files like images and videos.
*   **Realtime:** Listen to database changes in real-time.
*   **Auto-generated APIs:** Instant APIs for your database.
*   **Edge Functions:** Serverless functions to run custom logic.

This course focuses on Authentication, Database operations, and File Storage.

## 2. Project Setup

### Prerequisites

*   Node.js (v16 or higher recommended)
*   npm or yarn
*   A Supabase account (free tier available at [supabase.com](https://supabase.com/))

### Installation

1.  **Clone the repository (or download the files):**
    ```bash
    # If this were a git repo, you'd clone it.
    # For this project, ensure you have all the generated files.
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd supabase-course-app
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

### Supabase Configuration

This is the most crucial step to make the application work.

1.  **Create a Supabase Project:**
    *   Go to [app.supabase.com](https://app.supabase.com/) and create a new project.
    *   Choose a name, database password, and region.
2.  **Get your API Credentials:**
    *   In your Supabase project dashboard, navigate to **Project Settings** (the gear icon).
    *   Click on **API**.
    *   You will find your **Project URL** and **Project API keys** (use the `anon` public key).
3.  **Update `supabaseClient.js`:**
    *   Open the file `supabase-course-app/src/supabaseClient.js`.
    *   Replace the placeholder values with your actual Supabase Project URL and anon key:
        ```javascript
        // src/supabaseClient.js
        import { createClient } from '@supabase/supabase-js'

        // Replace with your Supabase project URL and anon key
        const supabaseUrl = 'YOUR_SUPABASE_URL';         // e.g., 'https://xyz.supabase.co'
        const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'; // e.g., 'eyJHbG...'

        export const supabase = createClient(supabaseUrl, supabaseAnonKey)
        ```

## 3. Running the Application

Once the project is set up and configured:

1.  **Start the development server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
2.  Open your browser and navigate to `http://localhost:5173` (or the port specified in your terminal).

## 4. Course Modules (Application Features)

This application demonstrates the following Supabase features, which you can explore in their respective sections of the app.

### Module 1: Supabase Client Initialization

*   **File:** `src/supabaseClient.js`
*   **Concept:** The Supabase client is the entry point for interacting with your Supabase backend. It's initialized with your project's unique URL and an anonymous key.
    ```javascript
    import { createClient } from '@supabase/supabase-js';
    // ... (URL and Key as shown above)
    export const supabase = createClient(supabaseUrl, supabaseAnonKey);
    ```
*   This `supabase` object is then imported into components that need to communicate with Supabase.

### Module 2: Authentication

*   **Component:** `src/components/AuthSection.jsx`
*   **Supabase Feature:** Supabase Auth provides a complete solution for user management.
*   **Setup:**
    *   By default, Supabase Auth is enabled. You might want to configure email templates or third-party providers in your Supabase dashboard under **Authentication**.
    *   For email confirmation to work (after sign-up), ensure "Enable email confirmations" is checked in **Authentication > Providers > Email**.

#### Sign Up

*   **Method:** `supabase.auth.signUp({ email, password })`
*   **Functionality:** Creates a new user in the `auth.users` table. Supabase can be configured to send a confirmation email.
    ```javascript
    // In AuthSection.jsx
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    // User receives a confirmation email (if enabled)
    ```

#### Login

*   **Method:** `supabase.auth.signInWithPassword({ email, password })`
*   **Functionality:** Authenticates an existing user and returns a session (including an access token).
    ```javascript
    // In AuthSection.jsx
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // Session is established
    ```

#### Logout

*   **Method:** `supabase.auth.signOut()`
*   **Functionality:** Invalidates the user's current session.
    ```javascript
    // In AuthSection.jsx
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    // Session is terminated
    ```

#### Session Management

*   **Methods:**
    *   `supabase.auth.getSession()`: Retrieves the current session, if one exists.
    *   `supabase.auth.onAuthStateChange((event, session) => { ... })`: Listens for changes in the authentication state (e.g., login, logout).
*   **Functionality:** The application uses these methods to track the user's authentication status and update the UI accordingly.
    ```javascript
    // In AuthSection.jsx (and other components needing auth state)
    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });

      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
        }
      );
      // Ensure to unsubscribe. The exact syntax might vary slightly based on Supabase JS client version.
      // For v1.x.x: return () => authListener.unsubscribe();
      // For v2.x.x: return () => { listener?.unsubscribe(); }; (if 'listener' is the name of the returned object)
      // The code in the component uses:
      // if (authListener && authListener.subscription) { authListener.subscription.unsubscribe(); }
      return () => {
        if (authListener && authListener.subscription) {
            authListener.subscription.unsubscribe();
        }
      };
    }, []);
    ```

### Module 3: Database (CRUD Operations)

*   **Component:** `src/components/DatabaseSection.jsx`
*   **Supabase Feature:** Supabase provides a PostgreSQL database with an easy-to-use JavaScript client library for performing database operations.

#### Table Setup (`notes`)

Before using the Database section, you need to create a table in your Supabase SQL Editor (under **Table Editor** or **SQL Editor** in your project dashboard).

1.  **Create the `notes` table:**
    ```sql
    CREATE TABLE public.notes (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- Links to the logged-in user
      title TEXT,
      content TEXT,
      created_at TIMESTAMPTZ DEFAULT now() NOT NULL
    );

    -- Optional: Enable Row Level Security (RLS) on the table
    ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
    ```
    *   The `user_id` column is crucial for associating notes with users and for Row Level Security.
    *   `ON DELETE CASCADE` for `user_id` means if a user is deleted from `auth.users`, their notes will also be deleted.

#### Row Level Security (RLS)

RLS is essential for securing your data so users can only access their own information. If you didn't enable it with `ALTER TABLE` above, do it now.

1.  **Enable RLS for the `notes` table (if not done via SQL):**
    *   Go to **Authentication > Policies** (or **Database > Policies** depending on Supabase UI version) in your Supabase dashboard.
    *   Select the `notes` table.
    *   Click "Enable RLS".
2.  **Create Policies:** (You can do this via the UI or SQL in the SQL Editor)

    *   **Allow users to insert their own notes:**
        ```sql
        CREATE POLICY "Users can insert their own notes"
        ON public.notes FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = user_id);
        ```
    *   **Allow users to select (read) their own notes:**
        ```sql
        CREATE POLICY "Users can select their own notes"
        ON public.notes FOR SELECT
        TO authenticated
        USING (auth.uid() = user_id);
        ```
    *   **Allow users to update their own notes:**
        ```sql
        CREATE POLICY "Users can update their own notes"
        ON public.notes FOR UPDATE
        TO authenticated
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
        ```
    *   **Allow users to delete their own notes:**
        ```sql
        CREATE POLICY "Users can delete their own notes"
        ON public.notes FOR DELETE
        TO authenticated
        USING (auth.uid() = user_id);
        ```

#### Create (Insert)

*   **Method:** `supabase.from('notes').insert([{ title, content, user_id }]).select()`
*   **Functionality:** Adds a new row to the `notes` table. The `user_id` is automatically set to the ID of the currently logged-in user.
    ```javascript
    // In DatabaseSection.jsx
    const { data, error } = await supabase
      .from('notes')
      .insert([{ title, content, user_id: session.user.id }])
      .select(); // .select() returns the inserted row(s)
    ```

#### Read (Select)

*   **Method:** `supabase.from('notes').select('*').eq('user_id', userId).order('created_at', { ascending: false })`
*   **Functionality:** Retrieves rows from the `notes` table. The `.eq('user_id', userId)` clause, combined with RLS, ensures users only see their own notes.
    ```javascript
    // In DatabaseSection.jsx
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId) // Filters for the current user's notes
      .order('created_at', { ascending: false });
    ```

#### Update

*   **Method:** `supabase.from('notes').update({ title, content }).eq('id', noteId).eq('user_id', session.user.id).select()`
*   **Functionality:** Modifies an existing row in the `notes` table. The `eq('id', noteId)` specifies which note to update, and `eq('user_id', ...)` ensures users can only update their own notes (enforced by RLS too).
    ```javascript
    // In DatabaseSection.jsx
    const { data, error } = await supabase
      .from('notes')
      .update({ title, content })
      .eq('id', editingNote.id)
      .eq('user_id', session.user.id) // Security check
      .select();
    ```

#### Delete

*   **Method:** `supabase.from('notes').delete().eq('id', noteId).eq('user_id', session.user.id)`
*   **Functionality:** Removes a row from the `notes` table.
    ```javascript
    // In DatabaseSection.jsx
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', session.user.id); // Security check
    ```

### Module 4: File Storage

*   **Component:** `src/components/StorageSection.jsx`
*   **Supabase Feature:** Supabase Storage allows you to manage large files like images, videos, and documents.

#### Bucket Setup (`user_files`)

1.  **Create a Bucket:**
    *   In your Supabase dashboard, go to **Storage**.
    *   Click "New bucket".
    *   Enter the bucket name: `user_files` (this is the name used in `StorageSection.jsx`).
    *   You can choose to make the bucket Public or Private. For this demo, policies will be added to manage access, which is more secure for user-specific files.

#### Storage Policies

Storage policies control who can access and modify files in your buckets. They are similar to RLS for databases. It's highly recommended to set up policies for user-specific file access, especially for private buckets.

*   **Example Path Structure:** The application uploads files to a folder structure like `USER_ID/filename.ext` (e.g., `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/myphoto.jpg`) within the `user_files` bucket. This structure is key for defining effective policies.

*   **Creating Policies (via Supabase Dashboard > Storage > Click on your bucket > Policies tab):**
    *   Select your `user_files` bucket and go to its "Policies" section.
    *   Create new policies. Here are common policies you'd want:

    *   **Policy Name:** `Allow authenticated users to list their own folder`
        *   Allowed operation: `SELECT`
        *   Target roles: `authenticated`
        *   Policy definition (USING expression):
            ```sql
            (bucket_id = 'user_files' AND (storage.foldername(name))[1] = auth.uid()::text)
            ```
            *(This checks if the first folder in the path matches the authenticated user's ID.)*

    *   **Policy Name:** `Allow authenticated users to upload to their own folder`
        *   Allowed operation: `INSERT`
        *   Target roles: `authenticated`
        *   Policy definition (WITH CHECK expression):
            ```sql
            (bucket_id = 'user_files' AND (storage.foldername(name))[1] = auth.uid()::text)
            ```

    *   **Policy Name:** `Allow authenticated users to update files in their own folder` (Optional, if you allow overwrites/updates)
        *   Allowed operation: `UPDATE`
        *   Target roles: `authenticated`
        *   Policy definition (USING and WITH CHECK expression):
            ```sql
            (bucket_id = 'user_files' AND (storage.foldername(name))[1] = auth.uid()::text)
            ```

    *   **Policy Name:** `Allow authenticated users to delete files from their own folder`
        *   Allowed operation: `DELETE`
        *   Target roles: `authenticated`
        *   Policy definition (USING expression):
            ```sql
            (bucket_id = 'user_files' AND (storage.foldername(name))[1] = auth.uid()::text)
            ```

    *Always test your policies thoroughly! Refer to the official Supabase documentation for the most current syntax and best practices for Storage policies.*

#### Upload Files

*   **Method:** `supabase.storage.from(BUCKET_NAME).upload(filePath, file, { upsert, contentType, cacheControl })`
*   **Functionality:** Uploads a file to the specified path within the bucket. The `filePath` includes the user's ID to ensure it goes into their designated folder.
    ```javascript
    // In StorageSection.jsx
    // const BUCKET_NAME = 'user_files';
    const filePath = `${session.user.id}/${selectedFile.name}`; // e.g., 'user-uuid/image.png'
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, selectedFile, {
        cacheControl: '3600', // How long to cache the file (seconds)
        upsert: true // true: Overwrite if file exists. false: Error if file exists.
      });
    ```

#### List Files

*   **Method:** `supabase.storage.from(BUCKET_NAME).list(folderPath, { limit, offset, sortBy })`
*   **Functionality:** Lists files within a specific path (the user's folder, which is `session.user.id`) in the bucket.
    ```javascript
    // In StorageSection.jsx
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(session.user.id, { // List files in the folder named after the user's ID
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });
    ```

#### Download Files

*   **Method:** `supabase.storage.from(BUCKET_NAME).download(filePath)`
*   **Functionality:** Downloads a file. The application then creates a temporary URL from the returned Blob to trigger the browser's download action.
    ```javascript
    // In StorageSection.jsx
    const filePath = `${session.user.id}/${fileName}`;
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .download(filePath);
    // 'data' is a Blob. Create a URL.revokeObjectURL and trigger download.
    ```
*   **Signed URLs (for private files):** If your bucket is private and you want to provide a temporary link (e.g., for an `<img>` tag or sharing), you would use `createSignedUrl()`:
    ```javascript
    // const { data, error } = await supabase.storage
    //   .from(BUCKET_NAME)
    //   .createSignedUrl(filePath, 60); // URL expires in 60 seconds
    // if (data) { const signedUrl = data.signedUrl; /* use this URL */ }
    ```
    This application uses direct download for simplicity.

#### Delete Files

*   **Method:** `supabase.storage.from(BUCKET_NAME).remove([filePath1, filePath2, ...])`
*   **Functionality:** Deletes one or more files from the bucket. Takes an array of file paths.
    ```javascript
    // In StorageSection.jsx
    const filePath = `${session.user.id}/${fileName}`;
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);
    ```

## 5. Key Supabase Concepts Used

*   **Client Library (`@supabase/supabase-js`):** The primary way to interact with Supabase services from JavaScript.
*   **Authentication (`supabase.auth`):** Manages user identity and sessions.
*   **Database (`supabase.from().select/insert/update/delete`):** Interacts with your PostgreSQL database.
*   **Row Level Security (RLS):** Fine-grained access control for your database tables, ensuring users only access their own data.
*   **Storage (`supabase.storage.from().upload/list/download/remove`):** Manages file uploads, downloads, and listings.
*   **Storage Policies:** Access control for files and folders within storage buckets, crucial for security.
*   **User ID (`auth.uid()` or `session.user.id`):** A unique identifier for each authenticated user, used to associate data and files with specific users. This is fundamental for implementing RLS and Storage policies correctly.

## 6. Further Learning

*   **Official Supabase Documentation:** [supabase.com/docs](https://supabase.com/docs)
    *   [JS Client Library](https://supabase.com/docs/reference/javascript/initializing)
    *   [Auth](https://supabase.com/docs/guides/auth)
    *   [Database & RLS](https://supabase.com/docs/guides/database/row-level-security)
    *   [Storage & Policies](https://supabase.com/docs/guides/storage/access-control)
*   **Supabase GitHub:** [github.com/supabase/supabase](https://github.com/supabase/supabase)
*   **Supabase YouTube Channel:** [youtube.com/c/Supabase](https://youtube.com/c/Supabase)
*   **React Documentation:** [react.dev](https://react.dev/)
*   **Vite Documentation:** [vitejs.dev](https://vitejs.dev/)

---

This application provides a starting point. Feel free to expand upon it, add more features (like Realtime subscriptions or Edge Functions), or improve the UI/UX. Happy coding!
