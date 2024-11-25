
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, ListGroup, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import api, { endpoints } from '../services/api';
import './Cart.css';
import { addToCart, removeFromCart, clearCart } from '../slices/orderSlice';

const Cart = () => {
  const [defaultAddress, setDefaultAddress] = useState(null); // Default delivery address
  const [restaurantNames, setRestaurantNames] = useState(new Map()); // Restaurant names mapped to their IDs

  const cart = useSelector((state) => state.order.cart); // Access Redux cart state
  const dispatch = useDispatch();

  // Fetch cart items and default address when the component mounts
  useEffect(() => {
    fetchCartItems();
    fetchDefaultAddress();
  }, []);

  // Fetch cart items from the API and sync with Redux state
  const fetchCartItems = async () => {
    try {
      const response = await api.get(endpoints.cartItems);
      console.log('Fetched Cart Items:', response.data);

      const namesMap = new Map();

      // Sync items with Redux state and fetch restaurant names
      response.data.forEach((item) => {
        // Add to Redux state
        dispatch(
          addToCart({
            id: item.id,
            name: item?.dish?.name || 'Unknown Dish',
            price: parseFloat(item?.dish?.price || 0),
            quantity: item.quantity,
            restaurant: item.restaurant || item.restaurant_id,
          })
        );

        // Fetch restaurant name if not already in the map
        if (!namesMap.has(item.restaurant)) {
          fetchRestaurantName(item.restaurant, namesMap);
        }
      });

      setRestaurantNames(namesMap);
      console.log(namesMap) // Update restaurant names state
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  // Fetch a restaurant name and add it to the map
  // const fetchRestaurantName = async (rest_id, namesMap) => {
  //   try {
  //     // const restaurantUrl = `${endpoints.restaurants}${rest_id}/`.replace(/\/+/g, '/'); // Fix double slashes
  //     const restaurantUrl = `${endpoints.restaurants}${rest_id}/`; // Ensure the URL structure is valid
  //     const restaurantResponse = await api.get(restaurantUrl);
  //     namesMap.set(rest_id, restaurantResponse.data.name);
  //   } catch (error) {
  //     console.error(`Error fetching name for restaurant ${rest_id}:`, error);
  //   }
  // };

// Fetch a restaurant name and add it to the map
// Fetch a restaurant name and add it to the map
  const fetchRestaurantName = async (rest_id, namesMap) => {
    try {
      const restaurantUrl = `${endpoints.restaurants}${rest_id}/`;
      const restaurantResponse = await api.get(restaurantUrl);
      const restaurantName = restaurantResponse.data.name;

      // Add the restaurant name to the map
      namesMap.set(rest_id, restaurantName);

      // Update state with the new map
      setRestaurantNames(new Map(namesMap));
    } catch (error) {
      console.error(`Error fetching name for restaurant ${rest_id}:`, error);
    }
  };



  // Fetch the default delivery address
  const fetchDefaultAddress = async () => {
    try {
      const response = await api.get(endpoints.deliveryAddresses);
      if (response.data.length > 0) {
        setDefaultAddress(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching default address:', error);
    }
  };

  // Update item quantity in the cart
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent negative quantities
    try {
      await api.patch(`${endpoints.cartItems}${itemId}/`, { quantity: newQuantity });
      dispatch(addToCart({ id: itemId, quantity: newQuantity })); // Update Redux state
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
    }
  };

  // Remove an item from the cart
  const handleRemoveItem = async (itemId) => {
    try {
      await api.delete(`${endpoints.cartItems}${itemId}/`);
      dispatch(removeFromCart({ id: itemId })); // Update Redux state
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  // Clear the cart
  const handleClearCart = () => {
    dispatch(clearCart());
  };

  // Calculate the total price of items in the cart
  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <ListGroup>
            {/* Group items by restaurant */}
            {Array.from(
              cart.reduce((map, item) => {
                if (!map.has(item.restaurant)) {
                  map.set(item.restaurant, []);
                }
                map.get(item.restaurant).push(item);
                return map;
              }, new Map())
            ).map(([rest_id, items]) => (
              <div key={rest_id}>
                {/* <h6 className="restaurant-name">{restaurantNames.get(rest_id) || `Restaurant: ${rest_id}`}</h6> */}
                <h6 className="restaurant-name">
                  {restaurantNames.has(rest_id)
                    ? restaurantNames.get(rest_id): `Fetching name for Restaurant: ${rest_id}`}</h6>
                <ListGroup className="cart-list">
                  {items.map((item) => (
                    <ListGroup.Item key={item.id} className="cart-item">
                      <Row>
                        <Col xs={6}>
                          <h5 className="dish-name">{item.name}</h5>
                          <p className="dish-price">Price: ${item.price}</p>
                        </Col>
                        <Col xs={3} className="quantity-controls">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="quantity-btn"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="quantity">{item.quantity}</span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="quantity-btn"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </Col>
                        <Col xs={3} className="remove-controls">
                          <Button
                            variant="danger"
                            size="sm"
                            className="remove-btn"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            Remove
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Card className="mt-3">
                  <Card.Body>
                    <h3>Total: ${items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</h3>
                    {defaultAddress && (
                      <div>
                        <h4>Default Delivery Address:</h4>
                        <p>
                          {defaultAddress.address_line1}, {defaultAddress.city}, {defaultAddress.state}
                        </p>
                      </div>
                    )}
                    <div className="checkout-container">
                    <Link to="/order-placement" state={{ rest_id, rest_cart: cart.filter(item => item.restaurant === rest_id) }}>
                    <Button className="checkout-button">Proceed to Checkout</Button>
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </ListGroup>
          <Button className="clear-cart-button" onClick={handleClearCart}>
            Clear Cart
          </Button>
        </>
      )}
    </div>
  );
};

export default Cart;



