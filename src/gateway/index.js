const fetch = require('node-fetch')
const { Agent } = require('https')

const DISCOVERY_APP_URL = 'https://prod-s0-webapp-proxy.nubank.com.br/api/app/discovery'
const agent = { minVersion: "TLSv1.2", maxVersion: "TLSv1.2" }

module.exports = {
    discovery: async () => {
        return fetch(DISCOVERY_APP_URL, {
            method: 'get',
            headers: { 'Content-Type': 'application/json' }
        }).then(async res => {
            const json = await res.json()
            return { headers: res.headers, status: res.status, json }
        })
    },

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

    getRefreshToken: async (tokenUrl, cert, payload) => {
        return fetch(tokenUrl, {
            agent: new Agent({ ...cert, ...agent }), // mTLS
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(async res => {
            const json = await res.json()
            return { status: res.status, json }
        })
    },

    query: async (queryUrl, refreshToken, cert, payload) => {
        return fetch(queryUrl, {
            agent: new Agent({ ...cert, ...agent }), // mTLS
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshToken}`
            },
            body: JSON.stringify(payload)
        }).then(async res => {
            const json = await res.json()
            return { status: res.status, json }
        })
    },

    bills: async (billsUrl, refreshToken, cert) => {
        return fetch(billsUrl, {
            agent: new Agent({ ...cert, ...agent }), // mTLS
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshToken}`
            }
        }).then(async res => {
            const json = await res.json()
            return { status: res.status, json }
        })
    }
}