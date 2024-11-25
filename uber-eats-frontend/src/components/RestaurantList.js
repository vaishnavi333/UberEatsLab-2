
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRestaurants, selectRestaurant } from '../slices/restaurantSlice';

const RestaurantList = () => {
    const dispatch = useDispatch();
    const restaurants = useSelector((state) => state.restaurant.restaurants);

    useEffect(() => {
        fetch('/api/restaurants')
            .then((response) => response.json())
            .then((data) => {
                dispatch(setRestaurants(data));
            });
    }, [dispatch]);

    const handleSelectRestaurant = (restaurant) => {
        dispatch(selectRestaurant(restaurant));
    };

    return (
        <div>
            <h2>Restaurants</h2>
            {restaurants.map((restaurant) => (
                <div key={restaurant.id} onClick={() => handleSelectRestaurant(restaurant)}>
                    {restaurant.name}
                </div>
            ))}
        </div>
    );
};

export default RestaurantList;
