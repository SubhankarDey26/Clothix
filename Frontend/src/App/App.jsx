import "./App.css"
import { RouterProvider } from "react-router"
import { routes } from "./app.routes"
import { useAuth } from "../features/auth/hook/useAuth"
import { useEffect } from "react"

const App = () => {

  const {HandleGetMe}=useAuth()

  useEffect(()=>{
    HandleGetMe()
  },[])

  return (
    <>
    <RouterProvider router={routes}/>
    </>
  )
}

export default App