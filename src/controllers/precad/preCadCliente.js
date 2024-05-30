const express = require("express")
const dbconnection = require("../../database/dbconnection")
const { verificaJWT } = require("../../functions/JWTS")
const route = express.Router()

//inser na tabela usuario

module.exports = route