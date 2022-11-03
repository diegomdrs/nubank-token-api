const fetch = require('node-fetch')
const { v4: uuidv4 } = require('uuid')
const { Agent } = require('https')
const { generateKeyPair, convertPrivateKeyPEMToBase64, convertPrivateKeyBase64ToPEM, extractPublicKeyPEMFromPrivateKeyPEM, convertCertificatePEMtoBase64, convertCertificateBase64toPEM } = require('../util/crypto-util')
const { parseAuthenticateHeaders } = require('../util/util')
const { X509Certificate } = require('crypto')
const logger = require('../config/logger')
const { StatusCodes } = require('http-status-codes')

module.exports = {
    requestCode: async (genCertificateUrl, payload) => {
        return fetch(genCertificateUrl, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(async res => {
            const json = await res.json()
            return { headers: res.headers, status: res.status, json }
        })
    },

    exchangeKey: async (genCertificateUrl, payload) => {
        return fetch(genCertificateUrl, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(async res => {
            const json = await res.json()
            return { headers: res.headers, status: res.status, json }
        })
    },

    getRefreshToken: async (request) => {
        const privateKeyPEM = convertPrivateKeyBase64ToPEM(request.privateKey)
        const certificatePEM = convertCertificateBase64toPEM(request.certificate)

        const payload = {
            'grant_type': 'password',
            'client_id': 'legacy_client_id',
            'client_secret': 'legacy_client_secret',
            'login': request.login,
            'password': request.password
        }

        // MTLS
        const cert = {
            cert: certificatePEM,
            key: privateKeyPEM,
            passphrase: '',
        }
        const agent = new Agent({ ...cert, minVersion: "TLSv1.2", maxVersion: "TLSv1.2" })

        return fetch(request.tokenUrl, {
            agent,
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(async res => {
            const json = await res.json()
            return { status: res.status, json }
        }).then(({ status, json }) => {
            logger.info(`status: ${status}`)
            logger.debug(`json: ${JSON.stringify(json)}`)

            if (status != 200)
                throw new Error(`Status code: ${status}`)

            // TODO - Entender access_token vs. access_token
            // const accessToken = json.access_token
            // logger.debug(`accessToken: ${accessToken}`)

            const refreshToken = json.access_token
            logger.debug(`refreshToken: ${refreshToken}`)

            const refreshBefore = json.refresh_before
            logger.debug(`refreshBefore: ${refreshBefore}`)

            const links = json._links
            logger.debug(`links: ${refreshBefore}`)

            return { refreshToken, refreshBefore, links }
        }).catch(err => {
            logger.error(err)
            throw err
        })
    },

    query: async (request) => {
        const privateKeyPEM = convertPrivateKeyBase64ToPEM(request.privateKey)
        const certificatePEM = convertCertificateBase64toPEM(request.certificate)

        // MTLS
        const cert = {
            cert: certificatePEM,
            key: privateKeyPEM,
            passphrase: '',
        }
        const agent = new Agent({ ...cert, minVersion: "TLSv1.2", maxVersion: "TLSv1.2" })

        return fetch(request.queryUrl, {
            agent,
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${request.refreshToken}`
            },
            body: request.query
        }).then(async res => {
            const json = await res.json()
            return { status: res.status, json }
        }).then(({ status, json }) => {
            logger.info(`status: ${status}`)
            logger.debug(`json: ${JSON.stringify(json)}`)

            if (status != 200)
                throw new Error(`Status code: ${status}`)

            const refreshToken = json.data.viewer.savingsAccount.currentSavingsBalance.netAmount
            logger.debug(`refreshToken: ${refreshToken}`)

            return { refreshToken }
        }).catch(err => {
            logger.error(err)
            throw err
        })
    }
}