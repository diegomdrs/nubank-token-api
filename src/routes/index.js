const { requestCode, exchangeKey, getRefreshToken, query } = require('../api')

/**
 * Ordem:
 * 
 * 1. /requestCode
 * 2. /exchangeKey
 * 3. /getRefreshToken
 * 
 * @param {*} app 
 */
module.exports = function (app) {
    app.post('/requestCode',
        /*    
        #swagger.tags = ['Token']
        #swagger.description = 'Requisita o código de segurança a ser enviado para o email cadastrado no Nubank'
        #swagger.parameters['obj'] = {
            in: 'body',
            required: true,
            schema: { $ref: '#/definitions/RequestCodeDTO' }
        }
        #swagger.responses[200] = {
            schema: { $ref: '#/definitions/ResponseRequestCodeDTO' }
        }
        */
        requestCode)

    app.post('/exchangeKey',
        /*    
        #swagger.tags = ['Token']
        #swagger.description = 'Obtém o certificado (base64) do dispositivo habilitado a obter um token'
        #swagger.parameters['obj'] = {
            in: 'body',
            required: true,            
            schema: { $ref: '#/definitions/RequestExchangeKeyDTO' }
        }
        #swagger.responses[200] = {
            schema: { $ref: '#/definitions/ResponseExchangeKeyDTO' }
        }
        */
        exchangeKey)

    app.post('/getRefreshToken',
        /*    
        #swagger.tags = ['Token']
        #swagger.description = 'Obtém o token de acesso'
        #swagger.parameters['obj'] = {
            in: 'body',
            required: true,            
            schema: { $ref: '#/definitions/RequestGetRefreshTokenDTO' }
        }
        #swagger.responses[200] = {
            schema: { $ref: '#/definitions/ResponseGetRefreshTokenDTO' }
        }
        */
    getRefreshToken)

    app.post('/query',
        /*    
        #swagger.tags = ['Token']
        #swagger.description = 'Obtém o token de acesso'
        #swagger.parameters['obj'] = {
            in: 'body',
            required: true,            
            schema: { $ref: '#/definitions/RequestGetRefreshTokenDTO' }
        }
        #swagger.responses[200] = {
            schema: { $ref: '#/definitions/ResponseGetRefreshTokenDTO' }
        }
        */
    query)    
}