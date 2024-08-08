import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    notes: '',
    billing: false,
    parts: false,
    scheduling: false
  });

  const [inputs, setInputs] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [savingStatus, setSavingStatus] = useState(null);

  const herokuURI = 'https://ai-app-9173f269729f.herokuapp.com/api/inputs';

  useEffect(() => {
    // Fetch data from the backend
    axios.get(herokuURI)
      .then(response => {
        setInputs(response.data);
  
        // Ensure the DOM has updated before resizing the textareas
        setTimeout(() => {
          document.querySelectorAll('textarea').forEach(textarea => {
            autoResizeTextarea({ target: textarea });
          });
        }, 0);
      })
      .catch(error => console.error('There was an error fetching the inputs!', error));
  }, []);
  
  const autoResizeTextarea = (e) => {
    const target = e?.target || e; // If e.target exists, use it; otherwise, use e directly (for useEffect)
  
    if (target) {
      target.style.height = 'auto';
      target.style.height = `${target.scrollHeight}px`;
    }
  };
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
   
    // Auto-resize textarea
    if (e.target.tagName.toLowerCase() === 'textarea') {
      autoResizeTextarea(e);
    }    
  };

  const handleEditChange = (e, id) => {
    const { name, value, type, checked } = e.target;
    setInputs(prevInputs => prevInputs.map(input =>
      input._id === id ? { ...input, [name]: type === 'checkbox' ? checked : value } : input
    ));
    // Auto-resize textarea in edit mode
    if (e.target.tagName.toLowerCase() === 'textarea') {
      autoResizeTextarea(e);
    }
  };

  const handleSave = (id) => {
    const input = inputs.find(input => input._id === id);
    setSavingStatus(id); // Show saving status
    axios.put(`${herokuURI}/${id}`, input)
      .then(response => {
        console.log('Input updated:', response.data);
        setSavingStatus(null); // Hide saving status
        setEditMode(null); // Exit edit mode
      })
      .catch(error => console.error('There was an error!', error));
  };

  const handleDelete = (id) => {
    // Prompt the user for confirmation
    const isConfirmed = window.confirm("Are you sure you want to delete this entry? This action cannot be undone.");
    
    // If confirmed, proceed with the deletion
    if (isConfirmed) {
      axios.delete(`${herokuURI}/${id}`)
        .then(() => {
          console.log('Input deleted');
          setEditMode(null); // Reset or adjust the edit mode as needed
          return axios.get(herokuURI); // Fetch updated list
        })
        .then(response => {
          setInputs(response.data); // Update state with new list
        })
        .catch(error => {
          console.error('Error deleting input:', error);
        });
    } else {
      console.log('Deletion canceled');
    }
  };
  

  const handleAddNew = () => {
    setAddingNew(true);
    setFormData({
    name: '',
    notes: '',
    billing: false,
    parts: false,
    scheduling: false
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(herokuURI, formData)
      .then(response => {
        console.log('Input saved:', response.data);
        
        setInputs(prevInputs => {
          const updatedInputs = [...prevInputs, response.data];
          
          // Delay execution to ensure the new entry is in the DOM
          setTimeout(() => {
            document.querySelectorAll('textarea').forEach(textarea => {
              autoResizeTextarea({ target: textarea });
            });
          }, 0);
  
          return updatedInputs;
        });
  
        setFormData({
          name: '',
          notes: '',
          billing: false,
          parts: false,
          scheduling: false
        });
        setAddingNew(false);
      })
      .catch(error => console.error('There was an error!', error));
  };
  
  

  const toggleEditMode = (id) => {
    setEditMode(editMode === id ? null : id);
  };

  return (
    <div className="App">
      <h1>Audio Integrators Review Manager</h1>
      {!addingNew && !editMode && (
        <button onClick={handleAddNew} className="add-new-button">Add New Entry</button>
      )}
      
      {addingNew && (
        <form onSubmit={handleSubmit} className="new-entry-form">
          <h2>Add New Entry</h2>
          <input
            type="text"
            name="name"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <textarea
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Notes"
          />
          <div className="checkbox-group">
          <label>
            Billing
          <input
            type="checkbox"
            name="billing"
            value={formData.billing}
            onChange={handleChange}
          />
          </label>
          <label>
            Parts
            <input
              type="checkbox"
              name="parts"
              checked={formData.parts}
              onChange={handleChange}
            />
          </label>
          <label>
            Scheduling
            <input
              type="checkbox"
              name="scheduling"
              checked={formData.scheduling}
              onChange={handleChange}
            />
          </label>
          </div>
          <button type="submit">Save New Entry</button>
          <button onClick={() => setAddingNew(false)}>Cancel</button>
        </form>
      )}

      <h2>Project List</h2>
      <ul className="entries-list">
        {inputs.map(input => (
          <li key={input._id} className={editMode === input._id ? 'editing' : ''}>
            <div>
              <strong>Name:</strong>
              <input
                type="text"
                name="name"
                value={input.name || ''}
                onChange={(e) => handleEditChange(e, input._id)}
                disabled={editMode !== input._id}
              />
            </div>
            <div>
              <strong>Notes:</strong>
              <textarea
                type="text"
                name="notes"
                value={input.notes || ''}
                onChange={(e) => handleEditChange(e, input._id)}
                disabled={editMode !== input._id}
              />
            </div>
            <div className="checkbox-group">
            <div>
              <strong>Billing</strong>
              <input
                type="checkbox"
                name="billing"
                checked={input.billing || false}
                onChange={(e) => handleEditChange(e, input._id)}
                disabled={editMode !== input._id}
              />
            </div>
            <div>
              <strong>Parts</strong>
              <input
                type="checkbox"
                name="parts"
                checked={input.parts || false}
                onChange={(e) => handleEditChange(e, input._id)}
                disabled={editMode !== input._id}
              />
            </div>
            <div>
              <strong>Scheduling</strong>
              <input
                type="checkbox"
                name="scheduling"
                checked={input.scheduling || false}
                onChange={(e) => handleEditChange(e, input._id)}
                disabled={editMode !== input._id}
              />
            </div>
            </div>
            {editMode === input._id ? (
              <div>
                <button className="save" onClick={() => handleSave(input._id)}>Save</button>
                <button onClick={() => toggleEditMode(input._id)}>Cancel</button>
                {savingStatus === input._id && <span className="saving">Saving...</span>}
                <div className="delete-container">
                <button className="delete" onClick={() => handleDelete(input._id)}>Delete</button>
              </div>
              </div>
            ) : (
              <button onClick={() => toggleEditMode(input._id)}>Edit</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;



