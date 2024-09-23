const controllerMeusArquivos = require("express").Router()
const dbconnecion = require("../../../../database/dbconnection")
const { verificaJWTLogin } = require("../../../../functions/JWTS")
//faz o insert de novos arquivos
controllerMeusArquivos.post("/novo/upload/arquivos/:id_usuario", verificaJWTLogin, async function (req, res) {
    try {
        const { arquivosImportados } = req.body
        const id_usuario = req.params.id_usuario
        for (let i = 0; i < arquivosImportados.length; i = i + 1) {
            const arquivo = arquivosImportados[i]
            const SqlInsertarquivosusuario = `
            INSERT INTO public.arquivosusuario
            (id_usuario, filebase64, "name", "type", "size", criacao)
            VALUES(${id_usuario}, '${arquivo.fileBase64}', '${arquivo.name}', '${arquivo.type}', ${arquivo.size}, now())
            `
            await dbconnecion.query(SqlInsertarquivosusuario)
        }
        return res.status(200).send({
            message: "Arquivo(s) importado(s) com sucesso."
        })
    } catch (error) {
        return res.status(500).send({
            message: "Erro ao importar arquivo: " + error.message
        })
    }
})
//carrega os uploads do usuario
controllerMeusArquivos.get("/carregar/meus/uploads/:id_usuario", verificaJWTLogin, async function (req, res) {
    try {
        const id_usuario = req.params.id_usuario
        const SqlSelectArquivosUsuario = `
        SELECT 
        id_arquivo as id, 
        name,
        filebase64,
        type,
        id_usuario,
        to_char(criacao, 'DD/MM/YYYY') as criacao,
        size
        FROM public.arquivosusuario
        WHERE id_usuario = ${id_usuario}
        `
        const arquivos = (await dbconnecion.query(SqlSelectArquivosUsuario)).rows
        return res.status(200).send({
            arquivos: arquivos
        })
    } catch (error) {
        return res.status(500).send({
            message: "Erro ao carregar arquivos: " + error.message || error
        })
    }
})
//delete de arquivo
controllerMeusArquivos.delete("/deletar/arquivo/usuario/:id_usuario/:id_arquivo", verificaJWTLogin, async function (req, res) {
    try {
        const { id_arquivo, id_usuario } = req.params
        const SqlDeleteArquivosUsuario = `
        DELETE FROM public.arquivosusuario where id_usuario=${id_usuario} and id_arquivo = ${id_arquivo}
        `
        await dbconnecion.query(SqlDeleteArquivosUsuario)
        return res.status(200).send({
            message: "Arquivo excluído com sucesso."
        })
    } catch (error) {
        return res.status(500).send({
            message: "Erro ao deletar arquivo: " + error.message
        })
    }
})
module.exports = controllerMeusArquivos