const express = require("express")
const api = express()
require("dotenv").config()

const routes = require("./src/app")

const porta = process.env.PORT ||  process.env.PORTA_SERVER
api.listen(porta, function(){

    console.log(`http://localhost:${porta}/api/fig`)
})

api.get("/api/fig", function(req, res){

    res.send({
        message: "Olá, bem vindo à API do FIG"
    })
})

api.use("/api/fig", routes)