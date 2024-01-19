const LOAD_CART = 'carts/loadCart';
const LOAD_CART_PRODUCTS = 'carts/loadCartProducts'

export const loadCart = (cart) => {
    return {
        type: LOAD_CART,
        cart
    }
}

export const loadCartProducts = (cart) => {
    return {
        type: LOAD_CART_PRODUCTS,
        cart
    }
}

export const thunkLoadCart = () => async (dispatch) => {
    console.log('Thunk starting...');
    try {
        const response = await fetch('api/carts/', {
            headers: {
                'Accept': 'application/json',
            },
        });
        if (!response.ok) {
            console.error('Non-OK response:', response);
            // Handle non-OK response here
            return;
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const cart = await response.json();
            console.log('Parsed cart:', cart);
            dispatch(loadCart(cart));
            return cart;
        } else {
            console.error('Invalid content type:', contentType);
            // Handle invalid content type here
        }
    } catch (error) {
        console.error('Error in thunkLoadCart:', error);
    }
    // const response = await fetch('api/carts/')
    // const cart = await response.json();
    // if (response.ok) {
    //     dispatch(loadCart(cart));
    //     return cart
    // } else {
    //     return cart
    // }
}

export const thunkLoadCartProducts = () => async (dispatch) => {
    const response = await fetch('api/carts/cart_products')
    const cart = await response.json();
    console.log("thunk cart", cart)
    if (response.ok) {
        dispatch(loadCartProducts(cart));
        return cart
    } else {
        return cart
    }
}

export const thunkAddToCart = (productId) => async (dispatch) => {
    const response = await fetch(`api/carts/products/${productId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await response.json()
    return data
}

export const thunkDeleteCartProduct = (productId) => async (dispatch) => {
    const response = await fetch(`api/carts/products/${productId}`, {
        method: "DELETE"
    })
    const data = await response.json()
    return data
}

const initialState = { singleCart: {}, cart_products: [] };

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_CART: {
            const singleCart = {}
            singleCart[action.cart.id] = action.cart
            return { ...state, singleCart }
        }
        case LOAD_CART_PRODUCTS: {
            const cart_products = action.cart
            return { ...state, cart_products }
        }
        default:
            return state;
    }
}

export default cartReducer
