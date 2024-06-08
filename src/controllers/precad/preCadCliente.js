const express = require("express")
const dbconnection = require("../../database/dbconnection")
const { verificaJWT } = require("../../functions/JWTS")
const { criptografar } = require("../../functions/crypto")
const route = express.Router()

//insert na tabela usuario
route.post("/criar/novo/precad", verificaJWT, function (req, res) {

    try {

        const {
            nome,
            senha,
            email
        } = req.body


        const ConsultaUsuarioExistente = `
        select email from public.usuario where email = '${email}'
        `
        dbconnection.query(ConsultaUsuarioExistente).then(function (consulta) {

            if (consulta.rows.length == 0) {
                //criptografa a senha para fazer a criação da conta
                criptografar(senha).then(function (senhaCriptografado) {

                    //criação da conta
                    const insertUsuario = `
                    INSERT INTO public.usuario
                    (nome, senha, email)
                    VALUES('${nome}', '${senhaCriptografado}', '${email}');
`
                    dbconnection.query(insertUsuario).then(function () {

                        res.status(200).send("Cadastro realizado com sucesso")
                    }).catch(function (erro) {

                        res.status(500).send(erro.message)
                    })
                }).catch(function (erro) {

                    res.status(500).send("Erro ao criptografar informação 1: " + + erro.message)
                })
            }
            else{

                res.status(400).send("E-mail já cadastrado.")
            }
        }).catch(function (erro) {

            res.status(500).send("Erro: " + erro.message)
        })
    } catch (error) {

        res.status(500).send("Erro ao carregar campos: " + error.message || error)
    }
})

module.exports = route