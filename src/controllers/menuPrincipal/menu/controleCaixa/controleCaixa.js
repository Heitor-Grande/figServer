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
        order by id_movimento DESC
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
//carrega informações de um determinado movimento
controllerControleCaixa.get("/carregar/detalhes/movimento/:id_usuario/:id_movimento", verificaJWTLogin, async function (req, res) {
    try {
        const { id_usuario, id_movimento } = req.params
        const SqlSelectMovimento = `
        SELECT 
        titulo, 
        id_movimento as id,
        valor,
        datamovimento,
        tipo,
        id_usuario
        FROM public.movimentos
        WHERE
        id_usuario = ${id_usuario} AND
        id_movimento = ${id_movimento}
        `
        const movimento = (await dbconnection.query(SqlSelectMovimento)).rows[0]
        return res.status(200).send({
            movimento: movimento
        })
    } catch (error) {
        return res.status(500).send({
            message: "Erro ao carregar: " + error.message || error
        })
    }
})
//atualiza movimento
controllerControleCaixa.put("/atualizar/movimento/:id_usuario/:id_movimento", verificaJWTLogin, async function (req, res) {
    try {
        const inputsMovimento = req.body.inputsMovimento
        const id_usuario = req.body.id_usuario
        const id_movimento = req.params.id_movimento
        const SqlUpdateMovimento = `
        UPDATE public.movimentos
        SET
        titulo = '${inputsMovimento.titulo}',
        tipo = '${inputsMovimento.tipo}',
        valor = ${inputsMovimento.valor.replaceAll(".", "").replace(",", ".")}, 
        datamovimento = '${inputsMovimento.data}'
        WHERE
        id_usuario = ${id_usuario} AND id_movimento = ${id_movimento}
        `
        await dbconnection.query(SqlUpdateMovimento)
        return res.status(200).send({
            message: "Movimento atualizado"
        })
    } catch (error) {
        return res.status(500).send({
            message: "Erro ao atualizar: " + error.message || error
        })
    }
})
//deleta movimento
controllerControleCaixa.delete("/excluir/movimento/:id_usuario/:id_movimento", verificaJWTLogin, async function (req, res) {
    try {
        const { id_movimento, id_usuario } = req.params
        const SqlDeleteMovimento = `
        DELETE FROM public.movimentos
        where id_movimento = ${id_movimento} AND id_usuario = ${id_usuario}
        `
        await dbconnection.query(SqlDeleteMovimento)
        return res.status(200).send({
            message: "Movimento excluido com sucesso."
        })
    } catch (error) {
        return res.status(500).send({
            message: "Erro ao excluir: " + error.message || error
        })
    }
})
module.exports = controllerControleCaixa