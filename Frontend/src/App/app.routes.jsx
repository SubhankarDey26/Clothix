import {createBrowserRouter} from "react-router"
import Register from "../features/auth/pages/Register"
import Login from "../features/auth/pages/Login"
import Landing from "../features/home/pages/Landing"
import SellerDashboard from "../features/products/pages/SellerDashboard"
import ProtectedRoute from "./ProtectedRoute"

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
        path:"/home",
        element:<h1>This is Home Page</h1>
    },
    {
        path:"/seller",
        element:(
            <ProtectedRoute requireSeller>
                <SellerDashboard/>
            </ProtectedRoute>
        )
    }
])