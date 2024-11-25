
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    restaurants: [],
    selectedRestaurant: null,
};

const restaurantSlice = createSlice({
    name: 'restaurant',
    initialState,
    reducers: {
        setRestaurantsAction(state, action) {
            state.restaurants = action.payload;
        },
        selectRestaurantAction(state, action) {
            state.selectedRestaurant = action.payload;
        },
    },
});

export const { setRestaurantsAction, selectRestaurantAction } = restaurantSlice.actions;
export default restaurantSlice.reducer;
