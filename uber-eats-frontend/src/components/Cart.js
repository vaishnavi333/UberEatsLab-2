
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, updateOrderStatus, clearCart } from '../slices/orderSlice';

const Cart = () => {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.order.cart);

    const handleAddToCart = (item) => {
        dispatch(addToCart(item));
    };

    const handleRemoveFromCart = (id) => {
        dispatch(removeFromCart({ id }));
    };

    const handleOrder = () => {
        fetch('/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart }),
        })
            .then((response) => response.json())
            .then((data) => {
                dispatch(updateOrderStatus(data.status));
                dispatch(clearCart());
            });
    };

    return (
        <div>
            <h2>Cart</h2>
            {cart.map((item) => (
                <div key={item.id}>
                    {item.name}
                    <button onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
                </div>
            ))}
            <button onClick={handleOrder}>Place Order</button>
        </div>
    );
};

export default Cart;
