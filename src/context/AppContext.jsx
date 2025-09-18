import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../../public/images/assets/assets";
import toast from "react-hot-toast";
import axios from 'axios';


axios.defaults.withCredentials = true;        // This will send cookies in api request
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;



console.log("Axios baseURL:", axios.defaults.baseURL)


export const AppContext = createContext();

export const AppContextProvider = ({children})=> {

    const currency = import.meta.env.VITE_CURRENCY; 

    const navigate = useNavigate()

    const [user, setUser] = useState(null) 
    const [isSeller, setIsSeller] = useState(false)
    const [showUserLogin, setShowUserLogin] = useState(false)
    const [products, setProducts] = useState([])

    const [cartItems, setCartItems] = useState({})
    const [searchQuery, setSearchQuery] = useState({})


    // To check/fetch if the seller is authenticated/logged-in or not
    const fetchSeller = async ()=>{
        try {
            const {data} = await axios.get("/api/seller/is-auth")         // The cookies will be sent by-default
            if(data.success){
                setIsSeller(true)
            }else{
                setIsSeller(false)
            }
        } catch (error) {
            setIsSeller(false)
        }
    }


    // To fetch User Auth status, User data and Cart items  

    const fetchUser = async ()=>{
        try {
            const {data} = await axios.get("/api/user/is-auth");
            if(data.success){
                setUser(data.user)
                setCartItems(data.user.cartItems)
            }
        } catch (error) {
            setUser(null)
        }
    }

    // To fetch all products
    const fetchProducts = async ()=> {
        try {
            const {data} = await axios.get("/api/product/list")
            if(data.success){
                setProducts(data.products)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Add products to cart
    const addToCart = (itemId)=>{
        let cartData = structuredClone(cartItems);

        if(cartData[itemId]){
            cartData[itemId] += 1;
        }else{
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success("Product added to cart")
    }


    // Update cart items quantity
    const updateCartItem = (itemId, quantity)=>{
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData)
        toast.success("Cart updated successfully")
    }


    // Remove product/s from cart
    const removeFromCart = (itemId)=>{
        let cartData = structuredClone(cartItems);

        if(cartData[itemId]){
            cartData[itemId] -= 1;

            if(cartData[itemId] === 0){
                delete cartData[itemId];
            }
        }
        toast.success("Product removed from cart")

        setCartItems(cartData)
    }


    // To get cart item count, i.e. how many items are there in the cart
    const getCartCount = ()=>{
        let totalCount = 0;
        for(const item in cartItems){
            totalCount += cartItems[item]
        }
        return totalCount;
    }

    // To get total cart amount
    const getCartAmount = ()=>{
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=> product._id === items);

            if(cartItems[items] > 0){
                totalAmount += itemInfo.offerPrice * cartItems[items]
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    useEffect(()=>{
        fetchUser()
        fetchSeller()
        fetchProducts()
    },[])


    // Update database cart items
    useEffect(()=>{
        const updateCart = async ()=>{
            try {
                const {data} = await axios.post("/api/cart/update", {cartItems})
                if(!data.success){
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error(error.message)       
            }
        }
        // This cartItems will be executed only if the user is available i.e. user is logged in
        if(user){
            updateCart()
        }
    },[cartItems])


    const value = {navigate, user, setUser, isSeller, setIsSeller, showUserLogin, setShowUserLogin,
        products, currency, addToCart, updateCartItem, setCartItems, removeFromCart, cartItems, searchQuery, setSearchQuery,
        getCartAmount, getCartCount, fetchProducts, fetchSeller, axios
    }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = ()=> {
    return useContext(AppContext)
}




// import { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { dummyProducts } from "../../public/images/assets/assets";
// import toast from "react-hot-toast";
// import axios from 'axios';


// axios.defaults.withCredentials = true;        // This will send cookies in api request
// axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;



// console.log("Axios baseURL:", axios.defaults.baseURL)


// export const AppContext = createContext();

// export const AppContextProvider = ({children})=> {

//     const currency = import.meta.env.VITE_CURRENCY; 

//     const navigate = useNavigate()

//     const [user, setUser] = useState(null) 
//     const [isSeller, setIsSeller] = useState(false)
//     const [showUserLogin, setShowUserLogin] = useState(false)
//     const [products, setProducts] = useState([])

//     const [cartItems, setCartItems] = useState({})
//     const [searchQuery, setSearchQuery] = useState({})


//     // To check/fetch if the seller is authenticated/logged-in or not
//     const fetchSeller = async ()=>{
//         try {
//             const {data} = await axios.get("https://smartmart-backend-2dt9.onrender.com/api/seller/is-auth")         // The cookies will be sent by-default
//             if(data.success){
//                 setIsSeller(true)
//             }else{
//                 setIsSeller(false)
//             }
//         } catch (error) {
//             setIsSeller(false)
//         }
//     }


//     // To fetch User Auth status, User data and Cart items  

//     const fetchUser = async ()=>{
//         try {
//             const {data} = await axios.get("https://smartmart-backend-2dt9.onrender.com/api/user/is-auth");
//             if(data.success){
//                 setUser(data.user)
//                 setCartItems(data.user.cartItems)
//             }
//         } catch (error) {
//             setUser(null)
//         }
//     }

//     // To fetch all products
//     const fetchProducts = async ()=> {
//         try {
//             const {data} = await axios.get("/api/product/list")
//             if(data.success){
//                 setProducts(data.products)
//             }else{
//                 toast.error(data.message)
//             }
//         } catch (error) {
//             toast.error(error.message)
//         }
//     }

//     // Add products to cart
//     const addToCart = (itemId)=>{
//         let cartData = structuredClone(cartItems);

//         if(cartData[itemId]){
//             cartData[itemId] += 1;
//         }else{
//             cartData[itemId] = 1;
//         }
//         setCartItems(cartData);
//         toast.success("Product added to cart")
//     }


//     // Update cart items quantity
//     const updateCartItem = (itemId, quantity)=>{
//         let cartData = structuredClone(cartItems);
//         cartData[itemId] = quantity;
//         setCartItems(cartData)
//         toast.success("Cart updated successfully")
//     }


//     // Remove product/s from cart
//     const removeFromCart = (itemId)=>{
//         let cartData = structuredClone(cartItems);

//         if(cartData[itemId]){
//             cartData[itemId] -= 1;

//             if(cartData[itemId] === 0){
//                 delete cartData[itemId];
//             }
//         }
//         toast.success("Product removed from cart")

//         setCartItems(cartData)
//     }


//     // To get cart item count, i.e. how many items are there in the cart
//     const getCartCount = ()=>{
//         let totalCount = 0;
//         for(const item in cartItems){
//             totalCount += cartItems[item]
//         }
//         return totalCount;
//     }

//     // To get total cart amount
//     const getCartAmount = ()=>{
//         let totalAmount = 0;
//         for(const items in cartItems){
//             let itemInfo = products.find((product)=> product._id === items);

//             if(cartItems[items] > 0){
//                 totalAmount += itemInfo.offerPrice * cartItems[items]
//             }
//         }
//         return Math.floor(totalAmount * 100) / 100;
//     }

//     useEffect(()=>{
//         fetchUser()
//         fetchSeller()
//         fetchProducts()
//     },[])


//     // Update database cart items
//     useEffect(()=>{
//         const updateCart = async ()=>{
//             try {
//                 const {data} = await axios.post("https://smartmart-backend-2dt9.onrender.com/api/cart/update", {cartItems})
//                 if(!data.success){
//                     toast.error(data.message)
//                 }
//             } catch (error) {
//                 toast.error(error.message)       
//             }
//         }
//         // This cartItems will be executed only if the user is available i.e. user is logged in
//         if(user){
//             updateCart()
//         }
//     },[cartItems])


//     const value = {navigate, user, setUser, isSeller, setIsSeller, showUserLogin, setShowUserLogin,
//         products, currency, addToCart, updateCartItem, setCartItems, removeFromCart, cartItems, searchQuery, setSearchQuery,
//         getCartAmount, getCartCount, fetchProducts, fetchSeller, axios
//     }

//     return <AppContext.Provider value={value}>
//         {children}
//     </AppContext.Provider>
// }

// export const useAppContext = ()=> {
//     return useContext(AppContext)
// }