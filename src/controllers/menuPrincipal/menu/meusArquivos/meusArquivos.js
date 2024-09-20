const controllerMeusArquivos = require("express").Router()
const dbconnecion = require("../../../../database/dbconnection")
const { criptografar } = require("../../../../functions/crypto")
const { verificaJWTLogin } = require("../../../../functions/JWTS")
//faz o insert de novos arquivos
controllerMeusArquivos.post("/novo/upload/arquivos/:id_usuario", verificaJWTLogin, function (req, res) {
    try {
        const { arquivosImportados } = req.body
        const id_usuario = req.params.id_usuario
        for (let i = 0; i < arquivosImportados.length; i = i + 1) {
            const SqlInsertarquivosusuario = `
            INSERT INTO public.arquivosusuario
            (id_usuario, filebase64, "name", "type", "size", criacao)
            VALUES(${id_usuario}, '', '', '', 0, now());
            `
        }
    } catch (error) {
        return res.status(500).send({
            message: "Erro ao importar arquivo: " + error.message
        })
    }
})

module.exports = controllerMeusArquivos