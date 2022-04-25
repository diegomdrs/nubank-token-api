const swaggerUi = require('swagger-ui-express')
const swaggerAutogen = require('swagger-autogen')()

module.exports = app => {
    const doc = require('./swagger-config')
    const outputFile = './swagger_output.json'
    const endpointsFiles = ['./src/routes/index.js']

    swaggerAutogen(outputFile, endpointsFiles, doc).then(result => {
        if (result.success) {
            const swaggerFile = require('../../swagger_output.json')
            app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
        }
    });
}