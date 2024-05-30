const express = require("express")
const route = express.Router()
const {criaJWT} = require("../../functions/JWTS")

route.get("/criar/novo/jwt/public", function(req, res){

    criaJWT(0).then(function(token){

        res.status(200).send(token)
    }).catch(function(erro){

        res.status(500).send(erro)
    })
})

module.exports = route