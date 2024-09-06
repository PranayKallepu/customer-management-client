import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

class CustomerForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      emailAddress: '',
      addresses: [{
        street: '',
        city: '',
        state: '',
        pinCode: ''
      }],
      errorMessage: '',
      loading: false,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleAddressChange = (e, index) => {
    const { name, value } = e.target;
    const addresses = [...this.state.addresses];
    addresses[index][name] = value;
    this.setState({ addresses });
  }

  validateForm = () => {
    const { firstName, lastName, phoneNumber, emailAddress, addresses } = this.state;
    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!firstName || !lastName || !phoneNumber || !emailAddress) {
      this.setState({ errorMessage: 'Please fill in all the details' });
      return false;
    }
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      this.setState({ errorMessage: 'Names should contain only alphabetical characters' });
      return false;
    }
    if (!phoneRegex.test(phoneNumber)) {
      this.setState({ errorMessage: 'Phone number must contain exactly 10 digits' });
      return false;
    }
    if (!emailRegex.test(emailAddress)) {
      this.setState({ errorMessage: 'Please enter a valid email address' });
      return false;
    }

    for (let address of addresses) {
      if (!address.city || !address.state || !address.pinCode) {
        this.setState({ errorMessage: 'Please fill in all address details' });
        return false;
      }
    }
    return true;
  }

  handleSubmit = (e) => {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    this.setState({ loading: true });

    const { firstName, lastName, phoneNumber, emailAddress, addresses } = this.state;

    fetch('http://localhost:5000/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, phoneNumber, emailAddress, addresses }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to create customer');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Customer created successfully:', data);
        this.setState({ loading: false });
        this.props.navigate('/'); 
      })
      .catch((error) => {
        console.error('Error creating customer:', error);
        this.setState({ loading: false, errorMessage: 'Failed to create customer' });
      });
  }

  addAddress = () => {
    this.setState((prevState) => ({
      addresses: [...prevState.addresses, { street: '', city: '', state: '', pinCode: '' }]
    }));
  }

  render() {
    const { firstName, lastName, phoneNumber, emailAddress, addresses, errorMessage, loading } = this.state;
    const stateOptions = [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
      'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
      'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
      'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
      'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
      'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
    ];

    return (
      <div className="container">
        <h2 className="text-center mb-4">Customer Form</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="container-box p-3">
            <div className="card p-3 mb-3">
              <div className="mb-3">
                <label className="form-label">First Name:</label>
                <input
                  placeholder='Pranay...'
                  type="text"
                  name="firstName"
                  className="form-control"
                  value={firstName}
                  onChange={this.handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Last Name:</label>
                <input
                  placeholder='Kallepu...'
                  type="text"
                  name="lastName"
                  className="form-control"
                  value={lastName}
                  onChange={this.handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number:</label>
                <input
                  placeholder='8186******'
                  type="text"
                  name="phoneNumber"
                  className="form-control"
                  value={phoneNumber}
                  onChange={this.handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email:</label>
                <input
                  placeholder='pranay@gmail.com'
                  type="email"
                  name="emailAddress"
                  className="form-control"
                  value={emailAddress}
                  onChange={this.handleChange}
                  required
                />
              </div>
            </div>
            
            {addresses.map((address, index) => (
              <div key={index} className="card border p-3 mb-3 rounded">
                <h6 className='text-center'>Address {index + 1}:</h6>
                <div className="mb-3">
                  <label className="form-label">Street:</label>
                  <input
                    placeholder='123 st colony...'
                    type="text"
                    name="street"
                    className="form-control"
                    value={address.street}
                    onChange={(e) => this.handleAddressChange(e, index)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">City:</label>
                  <input
                    placeholder='Hanamkonda..'
                    type="text"
                    name="city"
                    className="form-control"
                    value={address.city}
                    onChange={(e) => this.handleAddressChange(e, index)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">State:</label>
                  <select
                    name="state"
                    className="form-select"
                    value={address.state}
                    onChange={(e) => this.handleAddressChange(e, index)}
                    required
                  >
                    <option value="">Select State</option>
                    {stateOptions.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Pin Code:</label>
                  <input
                    placeholder='506006'
                    type="text"
                    name="pinCode"
                    className="form-control"
                    value={address.pinCode}
                    onChange={(e) => this.handleAddressChange(e, index)}
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        
          <div className='d-flex flex-row justify-content-center'>
            <button type="button" className="btn btn-primary mt-3 mb-3" onClick={this.addAddress}>Add Address</button>
            <button type="submit" className="btn btn-success mt-3 mb-3" disabled={loading}>
              {loading ? <FaSpinner className="spinner-border" /> : 'Submit'}
            </button>
            <button className="btn btn-secondary mt-3 mb-3" onClick={() => this.props.navigate('/')}>Home</button>
          </div>
        </form>

        {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
      </div>
    );
  }
}

// Functional wrapper to use useNavigate and pass navigate as a prop
const CustomerFormWrapper = () => {
  const navigate = useNavigate();
  return <CustomerForm navigate={navigate} />;
};

export default CustomerFormWrapper;
