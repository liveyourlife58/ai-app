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
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/inputs')
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = `http://localhost:5000/api/inputs/${currentId ? currentId : ''}`;

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
          setEditMode(false);
          setCurrentId(null);
          return axios.get('http://localhost:5000/api/inputs');
        })
        .then(response => setInputs(response.data))
        .catch(error => console.error('There was an error!', error));
    } else {
      axios.post('http://localhost:5000/api/inputs', formData)
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
          return axios.get('http://localhost:5000/api/inputs');
        })
        .then(response => setInputs(response.data))
        .catch(error => console.error('There was an error!', error));
    }
  };

  const handleEdit = (input) => {
    setFormData({
      customerName: input.customerName,
      notes: input.notes,
      billing1: input.billing1,
      billing2: input.billing2,
      billing3: input.billing3,
      co1: input.co1,
      co2: input.co2,
      scheduling: input.scheduling
    });
    setEditMode(true);
    setCurrentId(input._id);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/inputs/${id}`)
      .then(() => {
        console.log('Input deleted');
        return axios.get('http://localhost:5000/api/inputs');
      })
      .then(response => setInputs(response.data))
      .catch(error => console.error('There was an error!', error));
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
          <li key={input._id}>
            <strong>Customer Name:</strong> {input.customerName}<br />
            <strong>Notes:</strong> {input.notes}<br />
            <strong>Billing1:</strong> {input.billing1}<br />
            <strong>Billing2:</strong> {input.billing2}<br />
            <strong>Billing3:</strong> {input.billing3}<br />
            <strong>CO1:</strong> {input.co1 ? 'Yes' : 'No'}<br />
            <strong>CO2:</strong> {input.co2 ? 'Yes' : 'No'}<br />
            <strong>Scheduling:</strong> {input.scheduling}<br />
            <button onClick={() => handleEdit(input)}>Edit</button>
            <button className="delete" onClick={() => handleDelete(input._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

