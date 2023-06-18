const express = require("express")
const app = express()
const cors = require("cors")
const server = require("./src/socketController")

const PORT =3001


app.use(cors())
app.get("/",(req,res)=>{
    res.send("Hello")
})

server.listen(PORT,()=>{
    console.log("listening in port ",PORT);
})

