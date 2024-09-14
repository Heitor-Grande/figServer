const dbconnection = require("../../../../database/dbconnection")
const controllerControleCaixa = require("express").Router()
const { verificaJWTLogin } = require("../../../../functions/JWTS")
//cria movimento
controllerControleCaixa.post("/criar/novo/movimento", verificaJWTLogin, async function (req, res) {
    try {
        const inputsMovimento = req.body.inputsMovimento
        const id_usuario = req.body.id_usuario
        const SqlInsertMovimento = `
        INSERT INTO public.movimentos
        (titulo, valor, datamovimento, tipo, id_usuario)
        VALUES('${inputsMovimento.titulo}', 
        ${inputsMovimento.valor.replaceAll(".", "").replace(",", ".")}, 
        '${inputsMovimento.data}',
        '${inputsMovimento.tipo}',
        ${id_usuario})
        `
        await dbconnection.query(SqlInsertMovimento)
        return res.status(200).send({
            message: "Movimento criado com sucesso."
        })
    } catch (error) {
        return res.status(500).send({
            message: "Erro ao criar movimento: " + error.message
        })
    }
})
//carrega movimentos do usuario
controllerControleCaixa.get("/carregar/movimentos/caixa/:id_usuario", verificaJWTLogin, async function (req, res) {
    try {
        const SqlSelectMovimento = `
        SELECT 
        titulo, 
        id_movimento as id,
        valor,
        to_char(datamovimento, 'DD/MM/YYYY') as datamovimento,
        tipo,
        id_usuario
        FROM public.movimentos
        WHERE
        id_usuario = ${req.params.id_usuario}
        `
        const movimentos = (await dbconnection.query(SqlSelectMovimento)).rows
        return res.status(200).send({
            message: "Sucesso ao carregar movimentos",
            movimentos: movimentos
        })
    } catch (error) {
        return res.status(500).send({
            message: "Erro ao carregar movimentos: " + error.message || error
        })
    }
})
module.exports = controllerControleCaixa