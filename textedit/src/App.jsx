import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event'; // Import listen
import './App.css'; // Or your preferred styling

function App() {
  const [statusMessage, setStatusMessage] = useState('Ready.');

  // --- Effect to set up the menu event listener ---
  useEffect(() => {
    let unlisten = null; // Variable to hold the unlisten function

    // Asynchronous function to set up the listener
    const setupListener = async () => {
      try {
        // Listen for the 'menu-new-file' event emitted by the menu item
        unlisten = await listen('menu-new-file', (event) => {
          console.log('Menu item clicked:', event.event, event.payload); // Log the event
          setStatusMessage('New File action triggered from menu...');
          handleCreateNewFile(); // Call the function to invoke the backend
        });
        console.log('Menu event listener attached.');
      } catch (error) {
        console.error('Failed to set up menu listener:', error);
        setStatusMessage('Error setting up menu listener.');
      }
    };

    setupListener();

    // Cleanup function: This runs when the component unmounts
    return () => {
      if (unlisten) {
        console.log('Detaching menu event listener.');
        unlisten(); // Call the unlisten function returned by listen()
      }
    };
  }, []); // Empty dependency array means this effect runs only once on mount

  // --- Function to invoke the backend command ---
  const handleCreateNewFile = async () => {
    setStatusMessage('Opening save dialog...');
    try {
      // Invoke the Rust command 'create_new_file'
      const result = await invoke('create_new_file');
      setStatusMessage(`Operation result: ${result}`);
      console.log('Backend command result:', result);
    } catch (error) {
      // Handle errors from the backend command
      setStatusMessage(`Error: ${error}`);
      console.error('Error invoking backend command:', error);
    }
  };

  return (
    <div className="container">
      <h1>Tauri File Menu Example</h1>
      <p>Go to the application menu: File - New File</p>

      {/* You could optionally add a button to trigger the same action */}
      {/*
      <button type="button" onClick={handleCreateNewFile}>
        Create New File (Button)
      </button>
      */}

      <p>Status: {statusMessage}</p>
    </div>
  );
}

export default App;