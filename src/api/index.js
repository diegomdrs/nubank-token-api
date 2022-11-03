const { StatusCodes } = require('http-status-codes')
const { RequestCodeDTO, ResponseRequestCodeDTO, RequestExchangeKeyDTO, ResponseExchangeKeyDTO, RequestGetRefreshTokenDTO, ResponseGetRefreshTokenDTO, RequestQueryDTO } = require('../entities')
const { requestCode, exchangeKey, getRefreshToken, query } = require('../services')

module.exports = {
    requestCode: async (req, resp) => {
        try {
            const request = new RequestCodeDTO(req.body)
            const response = await requestCode(request)

            return resp.json(new ResponseRequestCodeDTO(response));
        } catch (error) {
            resp.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error.message })
        }
    },

    exchangeKey: async (req, resp) => {
        try {
            const request = new RequestExchangeKeyDTO(req.body)
            const response = await exchangeKey(request)

            return resp.json(new ResponseExchangeKeyDTO(response));
        } catch (error) {
            resp.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error.message })
        }
    },

    getRefreshToken: async (req, resp) => {
        try {
            const request = new RequestGetRefreshTokenDTO(req.body)
            const response = await getRefreshToken(request)

            return resp.json(new ResponseGetRefreshTokenDTO(response));
        } catch (error) {
            resp.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error.message })
        }
    },

    query: async (req, resp) => {
        try {
            const request = new RequestQueryDTO(req.body)
            const response = await query(request)

            return resp.json(response);
        } catch (error) {
            resp.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error.message })
        }
    }
}