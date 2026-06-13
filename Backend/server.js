import app from "./src/app.js"
import  ConnectToDb  from "./src/config/database.js"


ConnectToDb()

app.listen(3000,()=>{
    console.log("Server is Running on PORT 3000")
})