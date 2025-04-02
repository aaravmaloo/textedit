import { invoke } from '@tauri-apps/api/core';
import { save } from '@tauri-apps/plugin-dialog';
import { useState } from 'react';

function FileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const createNewFile = async () => {
    try {
      // Open save dialog to let user choose location and filename
      const filePath = await save({
        filters: [{
          name: 'Text',
          extensions: ['txt']
        }]
      });

      // If user didn't cancel the dialog
      if (filePath) {
        // Call Rust backend to create the file
        await invoke('create_new_file', { path: filePath });
        setIsOpen(false); // Close menu after file creation
      }
    } catch (error) {
      console.error('Error creating file:', error);
    }
  };

  return (
    <div className="file-menu">
      <button onClick={() => setIsOpen(!isOpen)}>
        File
      </button>

      {isOpen && (
        <div className="menu-dropdown">
          <button onClick={createNewFile}>
            New File
          </button>
        </div>
      )}
    </div>
  );
}

export default FileMenu;
