const express = require("express")
const route = express.Router()
const { criaJWT } = require("../../functions/JWTS")

route.get("/criar/novo/jwt/public", function (req, res) {

    if (req.headers.authorization == process.env.KEYPUBLIC) {

        criaJWT(0).then(function (token) {


            res.status(200).send(token)
        }).catch(function (erro) {


            res.status(500).send(erro)
        })
    }
    else {

        res.status(403).send("Não foi possível criar o token publico.")
    }
})

module.exports = route