const pg = require("pg")
const { Client } = pg

const dbconnection = new Client({
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.PORT_DB,
    database: process.env.DATABASE,
})

dbconnection.connect().then(function () {

    console.log("Conectado ao DB com sucesso.")
}).catch(function (erro) {

    console.log(erro)
})

module.exports = dbconnection