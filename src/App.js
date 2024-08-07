import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    customerName: '',
    notes: '',
    billing1: '',
    billing2: '',
    billing3: '',
    co1: false,
    co2: false,
    scheduling: ''
  });

  const [inputs, setInputs] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [savingStatus, setSavingStatus] = useState(null);

  const herokuURI = 'https://ai-app-9173f269729f.herokuapp.com/api/inputs';

  useEffect(() => {
    axios.get(herokuURI)
      .then(response => setInputs(response.data))
      .catch(error => console.error('There was an error fetching the inputs!', error));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditChange = (e, id) => {
    const { name, value, type, checked } = e.target;
    setInputs(prevInputs => prevInputs.map(input =>
      input._id === id ? { ...input, [name]: type === 'checkbox' ? checked : value } : input
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editMode ? `${herokuURI}/${editMode}` : herokuURI;

    if (editMode) {
      axios.put(url, formData)
        .then(response => {
          console.log('Input updated:', response.data);
          setFormData({
            customerName: '',
            notes: '',
            billing1: '',
            billing2: '',
            billing3: '',
            co1: false,
            co2: false,
            scheduling: ''
          });
          setEditMode(null);
          return axios.get(herokuURI);
        })
        .then(response => setInputs(response.data))
        .catch(error => console.error('There was an error!', error));
    } else {
      axios.post(herokuURI, formData)
        .then(response => {
          console.log('Input saved:', response.data);
          setFormData({
            customerName: '',
            notes: '',
            billing1: '',
            billing2: '',
            billing3: '',
            co1: false,
            co2: false,
            scheduling: ''
          });
          return axios.get(herokuURI);
        })
        .then(response => setInputs(response.data))
        .catch(error => console.error('There was an error!', error));
    }
  };

  const handleSave = (id) => {
    const input = inputs.find(input => input._id === id);
    setSavingStatus(id); // Show saving status
    axios.put(`${herokuURI}/${id}`, input)
      .then(response => {
        console.log('Input updated:', response.data);
        setSavingStatus(null); // Hide saving status
      })
      .catch(error => console.error('There was an error!', error));
  };

  const handleDelete = (id) => {
    axios.delete(`${herokuURI}/${id}`)
      .then(() => {
        console.log('Input deleted');
        return axios.get(herokuURI);
      })
      .then(response => setInputs(response.data))
      .catch(error => console.error('There was an error!', error));
  };

  const toggleEditMode = (id) => {
    setEditMode(editMode === id ? null : id);
  };

  return (
    <div className="App">
      <h1>{editMode ? 'Edit Input' : 'Save Input to MongoDB'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          placeholder="Customer Name"
          required
        />
        <input
          type="text"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notes"
        />
        <input
          type="text"
          name="billing1"
          value={formData.billing1}
          onChange={handleChange}
          placeholder="Billing1"
        />
        <input
          type="text"
          name="billing2"
          value={formData.billing2}
          onChange={handleChange}
          placeholder="Billing2"
        />
        <input
          type="text"
          name="billing3"
          value={formData.billing3}
          onChange={handleChange}
          placeholder="Billing3"
        />
        <label>
          CO1
          <input
            type="checkbox"
            name="co1"
            checked={formData.co1}
            onChange={handleChange}
          />
        </label>
        <label>
          CO2
          <input
            type="checkbox"
            name="co2"
            checked={formData.co2}
            onChange={handleChange}
          />
        </label>
        <input
          type="text"
          name="scheduling"
          value={formData.scheduling}
          onChange={handleChange}
          placeholder="Scheduling"
        />
        <button type="submit">{editMode ? 'Update Input' : 'Save Input'}</button>
      </form>

      <h2>List of Inputs</h2>
      <ul>
        {inputs.map(input => (
          <li key={input._id} className={editMode === input._id ? 'editing' : ''}>
            <label>
              <strong>Customer Name:</strong>
              <input
                type="text"
                name="customerName"
                value={input.customerName || ''}
                onChange={(e) => handleEditChange(e, input._id)}
                disabled={editMode !== input._id}
              />
            </label>
            <label>
              <strong>Notes:</strong>
              <input
                type="text"
                name="notes"
                value={input.notes || ''}
                onChange={(e) => handleEditChange(e, input._id)}
                disabled={editMode !== input._id}
              />
            </label>
            <label>
              <strong>Billing1:</strong>
              <input
                type="text"
                name="billing1"
                value={input.billing1 || ''}
                onChange={(e) => handleEditChange(e, input._id)}
                disabled={editMode !== input._id}
              />
            </label>
            <label>
              <strong>Billing2:</strong>
              <input
                type="text"
                name="billing2"
                value={input.billing2 || ''}
                onChange={(e) => handleEditChange(e, input._id)}
                disabled={editMode !== input._id}
              />
            </label>
            <label>
              <strong>Billing3:</strong>
              <input
                type="text"
                name="billing3"
                value={input.billing3 || ''}
                onChange={(e) => handleEditChange(e, input._id)}
                disabled={editMode !== input._id}
              />
            </label>
            <label>
              <strong>CO1:</strong>
              <input
                type="checkbox"
                name="co1"
                checked={input.co1 || false}
                onChange={(e) => handleEditChange(e, input._id)}
                disabled={editMode !== input._id}
              />
            </label>
            <label>
              <strong>CO2:</strong>
              <input
                type="checkbox"
                name="co2"
                checked={input.co2 || false}
                onChange={(e) => handleEditChange(e, input._id)}
                disabled={editMode !== input._id}
              />
            </label>
            <label>
              <strong>Scheduling:</strong>
              <input
                type="text"
                name="scheduling"
                value={input.scheduling || ''}
                onChange={(e) => handleEditChange(e, input._id)}
                disabled={editMode !== input._id}
              />
            </label>
            {editMode === input._id ? (
              <div>
                <button onClick={() => handleSave(input._id)}>Save</button>
                <button onClick={() => toggleEditMode(input._id)}>Cancel</button>
                {savingStatus === input._id && <span className="saving">Saving...</span>}
              </div>
            ) : (
              <button onClick={() => toggleEditMode(input._id)}>Edit</button>
            )}
            <button onClick={() => handleDelete(input._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

