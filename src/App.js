import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import CustomerProfile from './components/CustomerProfile';
import UpdateCustomer from './components/UpdateCustomer';

import './App.css'

class App extends Component {
  handleFormSubmit = (customerData) => {
    fetch('https://customer-management-server-1.onrender.com/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData),
    })
      .then((res) => res.json())
      .then((data) => console.log('Customer created:', data))
      .catch((error) => console.error('Error:', error));
  };

  render() {
    return (
      <Router>
        <div className='bg-container'>
          <Routes>
            <Route path="/" element={<CustomerList />} />
            <Route
              path="/create"
              element={<CustomerForm onSubmit={this.handleFormSubmit} />}
            />
            <Route path="/profile/:id" element={<CustomerProfile />} />
            <Route path="/update/:id" element={<UpdateCustomer />} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;
