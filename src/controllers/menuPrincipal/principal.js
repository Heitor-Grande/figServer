const controllerPrincipal = require("express").Router()
const dbconnection = require("../../database/dbconnection")
const { verificaJWTLogin } = require("../../functions/JWTS")
controllerPrincipal.post("/carregar/dashboard/principal/:id_usuario", verificaJWTLogin, async function (req, res) {
    try {
        const {
            dataInicio,
            dataFim
        } = req.body
        const dadosParaGrafico = {
            movimentoResumido: {
                totalentrada: 0,
                totalsaida: 0
            }
        }
        //Carrega os movimentos, apenas totais
        const SqlSelectTotaisMovimentos = `
        SELECT 
            SUM(CASE WHEN tipo = 'E' THEN valor ELSE 0 END) AS totalentrada,
            SUM(CASE WHEN tipo = 'S' THEN valor ELSE 0 END) AS totalsaida
        FROM 
        public.movimentos
        WHERE id_usuario = ${req.params.id_usuario} 
        and datamovimento >= '${dataInicio}' 
        and datamovimento <= '${dataFim}'
        `
        const movimentosTotalizados = (await dbconnection.query(SqlSelectTotaisMovimentos)).rows[0]
        dadosParaGrafico.movimentoResumido.totalentrada = movimentosTotalizados.totalentrada
        dadosParaGrafico.movimentoResumido.totalsaida = movimentosTotalizados.totalsaida
        return res.status(200).send({
            dados: dadosParaGrafico
        })
    } catch (error) {
        return res.status(500).send({
            message: "Erro ao carregar: " + error.message || error
        })
    }
})
module.exports = controllerPrincipal