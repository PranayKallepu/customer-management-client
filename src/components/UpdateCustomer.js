import React, { Component } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa'; // Import spinner icon
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

class UpdateCustomer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customer: null,
            loading: false,
            errorMessage: '',
        };
    }

    componentDidMount() {
        const { id } = this.props;
        this.fetchCustomer(id);
    }

    fetchCustomer = (id) => {
        fetch(`https://customer-management-server-1.onrender.com/customers/${id}`)
            .then((res) => res.json())
            .then((data) => this.setState({ customer: data }))
            .catch((error) => console.error('Error:', error));
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            customer: {
                ...prevState.customer,
                [name]: value,
            },
        }));
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
            .then(() => {
                this.setState({ loading: false, errorMessage: '' });
                alert('Customer information updated successfully');
                this.props.navigate(`/profile/${id}`);
            })
            .catch((error) => {
                console.error('Error updating customer:', error);
                this.setState({ loading: false, errorMessage: 'Error updating customer' });
            });
    };

    validateInput = () => {
        const { customer } = this.state;
        const phoneRegex = /^\d{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!customer.firstName || !customer.lastName || !customer.phoneNumber || !customer.emailAddress) {
            this.setState({ errorMessage: 'Please fill in all the details' });
            return false;
        }
        if (!phoneRegex.test(customer.phoneNumber)) {
            this.setState({ errorMessage: 'Phone number must be 10 digits' });
            return false;
        }
        if (!emailRegex.test(customer.emailAddress)) {
            this.setState({ errorMessage: 'Please enter a valid email address' });
            return false;
        }

        return true;
    };

    render() {
        const { customer, errorMessage, loading } = this.state;

        if (!customer) {
            return <div>Loading...</div>;
        }

        return (
            <div className="container">
                <h2 className=" text-center mb-4">Update Customer Information</h2>

                <form onSubmit={this.handleSubmit} className="border p-4 rounded shadow-sm">
                    <div className="mb-3">
                        <label className="form-label">First Name:</label>
                        <input
                            type="text"
                            name="firstName"
                            className="form-control"
                            value={customer.firstName}
                            onChange={this.handleInputChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Last Name:</label>
                        <input
                            type="text"
                            name="lastName"
                            className="form-control"
                            value={customer.lastName}
                            onChange={this.handleInputChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Phone Number:</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            className="form-control"
                            value={customer.phoneNumber}
                            onChange={this.handleInputChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email:</label>
                        <input
                            type="email"
                            name="emailAddress"
                            className="form-control"
                            value={customer.emailAddress}
                            onChange={this.handleInputChange}
                        />
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? <FaSpinner className="spinner" /> : 'Update Customer'}
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => this.props.navigate(`/profile/${this.props.id}`)}
                        >
                            Back
                        </button>
                    </div>

                    {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
                </form>
            </div>
        );
    }
}

const UpdateCustomerWrapper = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    return <UpdateCustomer id={id} navigate={navigate} />;
};

export default UpdateCustomerWrapper;
