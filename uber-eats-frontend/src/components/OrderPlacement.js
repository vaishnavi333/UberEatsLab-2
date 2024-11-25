import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import api, { endpoints } from '../services/api';
import './OrderPlacement.css';

const OrderPlacement = () => {
  const [cartItems, setCartItems] = useState([]); // Items in the cart
  const [restId, setRestId] = useState(null); // Restaurant ID
  const [addresses, setAddresses] = useState([]); // Delivery addresses
  const [selectedAddressId, setSelectedAddressId] = useState(null); // Selected address ID
  const [newAddress, setNewAddress] = useState({
    address_line1: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    is_default: false,
  });
  const [showNewAddressForm, setShowNewAddressForm] = useState(false); // Toggle new address form
  const [error, setError] = useState(''); // Error message
  const navigate = useNavigate(); // Navigation hook
  const location = useLocation(); // Location hook
  const [restaurantName, setRestaurantName] = useState(''); // Restaurant name

  // Fetch cart items and delivery addresses
  useEffect(() => {
    fetchCartItems();
    fetchAddresses();
  }, []);

  // Fetch cart items from state passed via Link
  const fetchCartItems = async () => {
    const cart_data = location.state;
    if (!cart_data || !cart_data.rest_cart) {
      navigate('/cart');
      return;
    }
    setCartItems(cart_data.rest_cart);
    setRestId(cart_data.rest_id);

    try {
      const response = await api.get(`${endpoints.restaurants}${cart_data.rest_id}/`);
      setRestaurantName(response.data.name); // Fetch restaurant name
    } catch (error) {
      console.error('Error fetching restaurant name:', error);
      setError('Failed to load restaurant name. Please try again.');
    }
  };

  // Fetch delivery addresses
  const fetchAddresses = async () => {
    try {
      const response = await api.get(endpoints.deliveryAddresses);
      setAddresses(response.data);
      if (response.data.length > 0) {
        setSelectedAddressId(response.data[0].id); // Set first address as default
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setError('Failed to load delivery addresses. Please try again.');
    }
  };

  // Handle changes to the selected address
  const handleAddressChange = (e) => {
    setSelectedAddressId(parseInt(e.target.value));
  };

  // Handle changes to the new address form fields
  const handleNewAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle adding a new address
  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(endpoints.deliveryAddresses, newAddress);
      setAddresses([...addresses, response.data]);
      setSelectedAddressId(response.data.id);
      setShowNewAddressForm(false);
      setNewAddress({
        address_line1: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        is_default: false,
      });
    } catch (error) {
      console.error('Error adding new address:', error);
      setError(`Failed to add new address: ${error.message}`);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError('Please select a delivery address');
      return;
    }
  
    try {
      const orderItems = cartItems.map((item) => ({
        dish_id: item.id, // Ensure this ID is correct
        quantity: item.quantity, // Ensure quantity is valid
      }));
  
      const orderData = {
        delivery_address_id: selectedAddressId,
        restaurant_id: restId,
        items: orderItems,
      };
  
      console.log('Order Data:', orderData); // Log the payload being sent
  
      const response = await api.post(endpoints.placeOrder, orderData);
      alert('Order placed successfully!');
      navigate('/order-history');
    } catch (error) {
      console.error('Error placing order:', error.response ? error.response.data : error.message);
      setError('Failed to place order. Please try again.');
    }
  };

  // Group cart items by restaurant
  const groupedCartItems = cartItems.reduce((acc, item) => {
    if (!acc[restId]) {
      acc[restId] = { restaurantName, items: [] };
    }
    acc[restId].items.push(item);
    return acc;
  }, {});

  // Calculate total price of cart items
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="order-placement-container">
      <h2 className="text-center mb-4">Order Placement</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Card className="mb-4">
        <Card.Header as="h5">Cart Items</Card.Header>
        <Card.Body>
          {Object.entries(groupedCartItems).map(([restaurantId, restaurantGroup]) => (
            <div key={restaurantId} className="restaurant-group">
              <p className="restaurant-name">{restaurantGroup.restaurantName}</p>
              {restaurantGroup.items.map((item) => (
                <div key={item.id} className="cart-item">
                  <p>
                    {item.name} - Quantity: {item.quantity}
                  </p>
                </div>
              ))}
            </div>
          ))}
          <h5 className="mt-3">Total Price: ${totalPrice.toFixed(2)}</h5>
        </Card.Body>
      </Card>
      <Card className="mb-4">
        <Card.Header as="h5">Select Delivery Address</Card.Header>
        <Card.Body>
          {addresses.map((address) => (
            <Form.Check
              key={address.id}
              type="radio"
              id={`address-${address.id}`}
              name="address"
              value={address.id}
              checked={selectedAddressId === address.id}
              onChange={handleAddressChange}
              label={`${address.address_line1}, ${address.city}, ${address.state}, ${address.postal_code}, ${address.country}`}
            />
          ))}
          <Button variant="link" onClick={() => setShowNewAddressForm(!showNewAddressForm)}>
            {showNewAddressForm ? 'Cancel' : 'Add New Address'}
          </Button>
          {showNewAddressForm && (
            <Form onSubmit={handleAddNewAddress} className="mt-3">
              {/* Address Form Fields */}
              <Form.Group controlId="address_line1">
                <Form.Control
                  type="text"
                  name="address_line1"
                  value={newAddress.address_line1}
                  onChange={handleNewAddressChange}
                  placeholder="Address Line 1"
                  required
                />
              </Form.Group>
              <Form.Group controlId="city">
                <Form.Control
                  type="text"
                  name="city"
                  value={newAddress.city}
                  onChange={handleNewAddressChange}
                  placeholder="City"
                  required
                />
              </Form.Group>
              <Form.Group controlId="state">
                <Form.Control
                  type="text"
                  name="state"
                  value={newAddress.state}
                  onChange={handleNewAddressChange}
                  placeholder="State"
                  required
                />
              </Form.Group>
              <Form.Group controlId="postal_code">
                <Form.Control
                  type="text"
                  name="postal_code"
                  value={newAddress.postal_code}
                  onChange={handleNewAddressChange}
                  placeholder="Postal Code"
                  required
                />
              </Form.Group>
              <Form.Group controlId="country">
                <Form.Control
                  type="text"
                  name="country"
                  value={newAddress.country}
                  onChange={handleNewAddressChange}
                  placeholder="Country"
                  required
                />
              </Form.Group>
              <Form.Group controlId="is_default">
                <Form.Check
                  type="checkbox"
                  name="is_default"
                  checked={newAddress.is_default}
                  onChange={handleNewAddressChange}
                  label="Set as default address"
                />
              </Form.Group>
              <Button type="submit" variant="primary">
                Add Address
              </Button>
            </Form>
          )}
        </Card.Body>
      </Card>
      <Button onClick={handlePlaceOrder} variant="success" className="mt-3">
        Place Order
      </Button>
    </div>
  );
};

export default OrderPlacement;


