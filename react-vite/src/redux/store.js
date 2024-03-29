import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import museumReducer from "./museums";
import productReducer from "./products";
import cartReducer from "./carts";
import wishlistReducer from "./wishlists";
import mapsReducer from "./maps";

const rootReducer = combineReducers({
  session: sessionReducer,
  museums: museumReducer,
  products: productReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  maps: mapsReducer
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
