const express = require("express")
const api = express()
require("dotenv").config()

const routes = require("./src/app")

const porta = process.env.PORT ||  process.env.PORTA_SERVER
api.listen(porta, function(){

    console.log(`http://localhost:${porta}/`)
})

api.use(routes)