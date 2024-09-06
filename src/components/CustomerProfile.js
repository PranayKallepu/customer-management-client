import React, { Component } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {  CircleLoader } from 'react-spinners';

class CustomerProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customer: null,
      errorMessage: '',
      viewAddAddress: false,
      viewUpdateAddressIndex: null,
      loading: true,
      newAddress: {
        street: '',
        city: '',
        state: '',
        pinCode: '',
        isPrimary: false,
      },
    };
  }

  componentDidMount() {
    const { id } = this.props;
    console.log("Fetching customer with ID:", id);
    this.fetchCustomer(id);
  }

  fetchCustomer = (id) => {
    if (!id) {
      this.setState({ errorMessage: 'Customer ID is missing' });
      return;
    }
    fetch(`https://customer-management-server-1.onrender.com/customers/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch customer');
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched customer data:", data);
        this.setState({ customer: data, loading:false });
      })
      .catch((error) => {
        console.error('Error fetching customer:', error);
        this.setState({ errorMessage: 'Error fetching customer data' , loading:false});
      });
  };



  handleRemoveAddress = (index) => {
    const { customer } = this.state;
    if (!customer) {
      this.setState({ errorMessage: 'Customer data is not loaded' });
      return;
    }
    const customerId = customer.id || customer._id;

    if (!customerId) {
      this.setState({ errorMessage: 'Customer ID is missing in customer data' });
      return;
    }

    // Filter out the address to be removed
    const updatedAddresses = customer.addresses.filter((_, i) => i !== index);

    // Update the backend with the new set of addresses
    fetch(`https://customer-management-server-1.onrender.com/customers/${customerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...customer,
        addresses: updatedAddresses,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update customer');
        }
        return res.json();
      })
      .then((data) => {
        this.setState({
          customer: { ...customer, addresses: updatedAddresses },
          errorMessage: '',
        });
        alert('Address removed successfully!');
      })
      .catch((error) => {
        console.error('Error updating customer:', error);
        this.setState({ errorMessage: 'Error removing address' });
      });
  };

  toggleAddAddress = () => {
    this.setState((prevState) => ({ viewAddAddress: !prevState.viewAddAddress }));
  };

  handleAddressChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      newAddress: {
        ...prevState.newAddress,
        [name]: value,
      },
    }));
  };

  handleAddAddress = (e) => {
    e.preventDefault();

    const { newAddress, customer } = this.state;

    if (!customer) {
      this.setState({ errorMessage: 'Customer data is not loaded' });
      return;
    }

    // Determine the correct ID field
    const customerId = customer.id || customer._id;

    if (!customerId) {
      this.setState({ errorMessage: 'Customer ID is missing in customer data' });
      return;
    }

    // Validate input fields
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.pinCode) {
      this.setState({ errorMessage: 'Please fill in all address fields' });
      return;
    }

    // Update customer addresses locally
    const updatedAddresses = [...customer.addresses, newAddress];

    // Update the backend with the new address
    fetch(`https://customer-management-server-1.onrender.com/customers/${customerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...customer,
        addresses: updatedAddresses,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update customer');
        }
        return res.json();
      })
      .then((data) => {
        this.setState({
          customer: { ...customer, addresses: updatedAddresses },
          newAddress: { street: '', city: '', state: '', pinCode: '', isPrimary: false },
          errorMessage: '',
          viewAddAddress: false,
        });
        alert('Address added successfully!');
      })
      .catch((error) => {
        console.error('Error updating customer:', error);
        this.setState({ errorMessage: 'Error updating customer' });
      });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    if (!this.validateInput()) {
      return;
    }

    const { id } = this.props;
    this.setState({ loading: true });

    fetch(`https://customer-management-server-1.onrender.com/customers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state.customer),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update customer');
        }
        return res.json();
      })
      .then((data) => {
        this.setState({ loading: false, errorMessage: '' });
        alert('Customer information updated successfully');
        this.props.navigate(`/profile/${id}`);
      })
      .catch((error) => {
        console.error('Error updating customer:', error);
        this.setState({ loading: false, errorMessage: 'Error updating customer' });
      });
  };

  handleDeleteCustomer = () => {
    const { id } = this.props;
    if (window.confirm('Are you sure you want to delete this customer?')) {
      fetch(`https://customer-management-server-1.onrender.com/customers/${id}`, { method: 'DELETE' })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to delete customer');
          }
          alert('Customer deleted successfully');
          this.props.navigate('/');
        })
        .catch((error) => console.error('Error deleting customer:', error));
    }
  };

  handleUpdateAddress = (index) => {
    const { customer } = this.state;
    const selectedAddress = customer.addresses[index];

    this.setState({
      viewUpdateAddressIndex: index,
      newAddress: { ...selectedAddress }, // Populate form with selected address
    });
  };

  handleSaveUpdatedAddress = (e) => {
    e.preventDefault();
    const { customer, newAddress, viewUpdateAddressIndex } = this.state;

    if (!customer) {
      this.setState({ errorMessage: 'Customer data is not loaded' });
      return;
    }

    const customerId = customer.id || customer._id;

    if (!customerId) {
      this.setState({ errorMessage: 'Customer ID is missing in customer data' });
      return;
    }

    // Update the selected address locally
    const updatedAddresses = [...customer.addresses];
    updatedAddresses[viewUpdateAddressIndex] = newAddress;

    // Update the backend with the updated address
    fetch(`https://customer-management-server-1.onrender.com/customers/${customerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...customer,
        addresses: updatedAddresses,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update customer');
        }
        return res.json();
      })
      .then((data) => {
        this.setState({
          customer: { ...customer, addresses: updatedAddresses },
          viewUpdateAddressIndex: null, // Reset the update view
          newAddress: { street: '', city: '', state: '', pinCode: '', isPrimary: false }, // Clear the form
        });
        alert('Address updated successfully!');
      })
      .catch((error) => {
        this.setState({ errorMessage: 'Error updating customer' });
      });
  };

  render() {
    const { customer, viewUpdateAddressIndex, viewAddAddress, loading, newAddress, errorMessage } = this.state;
    const { navigate } = this.props
    const stateOptions = [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
      'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
      'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
      'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
      'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
      'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    ];

    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <CircleLoader color="white" height={40} width={100} loading={true} />
          <h4> Loading...</h4>
        </div>
      );
    }

    return (
      <>
        <h2 className=" text-center mb-4">Customer Profile</h2>
        <div className="profile-container p-3 rounded">
          <div className=' cards'>
            <div className=" bg-card border p-3 mb-4">
              <h4 className='mt-4'>
                <strong>Name:</strong> {customer.firstName} {customer.lastName}
              </h4>
              <h5><strong>Phone:</strong> {customer.phoneNumber}</h5>
              <h5><strong>Email:</strong> {customer.emailAddress}</h5>

              <button
                className="btn btn-dark my-2 mt-3"
                onClick={() => this.props.navigate(`/update/${this.props.id}`)}>
                Edit Customer
              </button>
            </div>

            {customer.addresses && customer.addresses.length > 0 ? (
              <ul className="bg-card border mb-3">
                {customer.addresses.map((address, index) => (
                  <li key={index} className="list-card pt-2 pb-2">
                    <h4>Address {index + 1}:</h4>
                    <p><strong>Street:</strong> {address.street}</p>
                    <p><strong>City:</strong> {address.city}</p>
                    <p><strong>State:</strong> {address.state}</p>
                    <p><strong>Pin Code:</strong> {address.pinCode}</p>
                    <button className='btn btn-dark mb-2' type='button' onClick={() => this.handleUpdateAddress(index)}>
                      Update Address
                    </button>
                    <button
                      className="btn btn-danger mb-2"
                      type="button"
                      onClick={() => this.handleRemoveAddress(index)}>
                      Remove Address
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No addresses available.</p>
            )}



            {viewUpdateAddressIndex !== null && (
              <div className="card p-3 mt-3 mb-3">
                <h4 style={{ color: "white" }}>Update Address {viewUpdateAddressIndex + 1}:</h4>
                <form onSubmit={this.handleSaveUpdatedAddress}>
                  <div className="mb-3">
                    <label className="form-label">Street:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="street"
                      value={newAddress.street}
                      onChange={this.handleAddressChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">City:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={newAddress.city}
                      onChange={this.handleAddressChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">State:</label>
                    <select
                      className="form-select"
                      name="state"
                      value={newAddress.state}
                      onChange={this.handleAddressChange}
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
                      type="text"
                      className="form-control"
                      name="pinCode"
                      value={newAddress.pinCode}
                      onChange={this.handleAddressChange}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-success">
                    Save Address
                  </button>
                </form>
              </div>
            )}



            {viewAddAddress && (
              <div className=" p-3 mt-3 mb-3">
                <form className='card border p-3' onSubmit={this.handleAddAddress}>
                  <h4 style={{ color: 'white' }} >Add New Address:</h4>
                  <div className="mb-3">
                    <label className="form-label">Street:</label>
                    <input
                      placeholder='123 st colony'
                      type="text"
                      className="form-control"
                      name="street"
                      value={newAddress.street}
                      onChange={this.handleAddressChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">City:</label>
                    <input
                      placeholder='Hanamkonda..'
                      type="text"
                      className="form-control"
                      name="city"
                      value={newAddress.city}
                      onChange={this.handleAddressChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">State:</label>
                    <select
                      className="form-control"
                      name="state"
                      value={newAddress.state}
                      onChange={this.handleAddressChange}
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
                      placeholder='506001'
                      type="text"
                      className="form-control"
                      name="pinCode"
                      value={newAddress.pinCode}
                      onChange={this.handleAddressChange}
                      required
                    />
                  </div>

                  <button type="submit" className=" btn btn-success">Submit</button>
                </form>
              </div>
            )}

          </div>

          <div className='d-flex flex-row justify-content-center mt-4'>
            <button
              className="btn btn-primary mb-3"
              type="button"
              onClick={this.toggleAddAddress}>
              {viewAddAddress ? 'Cancel' : 'Add Address'}
            </button>

            <button
              className="btn btn-danger mb-3"
              onClick={this.handleDeleteCustomer}>
              Delete Customer
            </button>

            {errorMessage && <p className="text-danger">{errorMessage}</p>}

            <button
              className="btn btn-secondary mb-3"
              onClick={() => navigate('/')}>
              Home
            </button>
          </div>

        </div>
      </>
    );
  }
}

const CustomerProfileWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return <CustomerProfile id={id} navigate={navigate} />;
};

export default CustomerProfileWrapper;
