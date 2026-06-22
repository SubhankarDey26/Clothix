import {createBrowserRouter} from "react-router"
import Register from "../features/auth/pages/Register"
import Login from "../features/auth/pages/Login"
import Landing from "../features/home/pages/Landing"
import SellerDashboard from "../features/products/pages/SellerDashboard"
import ProtectedRoute from "./ProtectedRoute"
import ShowAllProduct from "../features/products/pages/ShowAllProduct"
import ProductDetail from "../features/products/pages/ProductDetail"
import SellerProductDetails from "../features/products/pages/SellerProductDetails"
import Cart from "../features/cart/pages/Cart"

export const routes=createBrowserRouter([
    {
        path:"/",
        element:<Landing/>
    },
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/buyer",
        element:<ShowAllProduct/>
    },
    {
        path:"/seller",
        element:(
            <ProtectedRoute requireSeller>
                <SellerDashboard/>
            </ProtectedRoute>
        )
    },
    {
        path:"/product/:productId",
        element:<ProductDetail/>
    },
    {
        path:"/seller/product/:productId",
        element:(
            <ProtectedRoute>
                <SellerProductDetails/>
            </ProtectedRoute>
        )
    },
    {
        path:"/cart",
        element:(
            <ProtectedRoute>
                <Cart/>
            </ProtectedRoute>
        )
    }
])