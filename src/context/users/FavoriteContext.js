import React, {createContext, useReducer, useEffect} from 'react';

export const FavoriteContext = createContext();

const favoriteReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_FAVORITE':
      const isFavorite = state.some(fav => fav.id === action.payload.id);
      if (isFavorite) {
        return state.filter(fav => fav.id !== action.payload.id);
      } else {
        return [...state, action.payload];
      }
    default:
      return state;
  }
};

export const FavoriteProvider = ({children}) => {
  const [favorites, dispatch] = useReducer(favoriteReducer, []);

  const toggleFavorite = item => {
    dispatch({type: 'TOGGLE_FAVORITE', payload: item});
  };

  return (
    <FavoriteContext.Provider value={{favorites, toggleFavorite}}>
      {children}
    </FavoriteContext.Provider>
  );
};
