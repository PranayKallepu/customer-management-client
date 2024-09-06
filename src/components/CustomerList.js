import React, { Component } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

class CustomerList extends Component {
  state = {
    customers: [],
    searchQuery: '',
    error: null,
  };

  componentDidMount() {
    this.fetchCustomers();
  }

  fetchCustomers = () => {
    fetch('https://customer-management-server-1.onrender.com/customers')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ customers: data });
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        this.setState({ error: error.message });
      });
  };

  handleSearch = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  handleDeleteCustomer = (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      fetch(`https://customer-management-server-1.onrender.com/customers/${customerId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to delete customer');
          }
          // Remove customer from state after successful deletion
          this.setState((prevState) => ({
            customers: prevState.customers.filter(
              (customer) => customer._id !== customerId
            ),
          }));
          alert('Customer deleted successfully!');
        })
        .catch((error) => {
          console.error('Delete error:', error);
          this.setState({ error: error.message });
        });
    }
  };

  render() {
    const { customers, searchQuery, error } = this.state;
    const { navigate } = this.props;

    // Filter customers based on the search query
    const filteredCustomers = customers.filter(
      (customer) =>
        customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phoneNumber.includes(searchQuery)
    );

    if (error) {
      return <div className="alert alert-danger">Error: {error}</div>;
    }

    return (
      <div className="container">
        <h2 className="text-center mb-4">Customer List</h2>

        {/* Search input */}
        <div className="row mb-3">
          <div className="search-card col-12">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or phone number"
              value={searchQuery}
              onChange={this.handleSearch}
            />
          </div>
        </div>

        <div className="row border p-5">
          <div className="col-12">
            <ul className="list-group">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer, index) => (
                  <li
                    key={customer._id}
                    className="list-group-item d-flex justify-content-between align-items-center mt-2"
                  >
                    <Link
                      to={`/profile/${customer._id}`}
                      className="list-group-item-action"
                    >
                      <h4>
                        {index + 1}. {customer.firstName} {customer.lastName}
                      </h4>
                      <p>CELL: {customer.phoneNumber}</p>
                    </Link>
                    <button
                      className="btn btn-danger"
                      onClick={() => this.handleDeleteCustomer(customer._id)}
                    >
                      Delete
                    </button>
                  </li>
                ))
              ) : (
                <li className="list-group-item">No customers found</li>
              )}
            </ul>
          </div>
          <div className="d-flex justify-content-center mt-4">
          <button
            className="btn btn-primary"
            onClick={() => navigate('/create')}
          >
            Add New Customer
          </button>
        </div>
        </div>

        
      </div>
    );
  }
}

const CustomerListWrapper = () => {
  const navigate = useNavigate();
  return <CustomerList navigate={navigate} />;
};

export default CustomerListWrapper;
