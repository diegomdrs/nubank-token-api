const fetch = require('node-fetch')
const { Agent } = require('https')

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

    getRefreshToken: async (tokenUrl, cert, payload) => {
        // mTLS
        const agent = new Agent({ ...cert, minVersion: "TLSv1.2", maxVersion: "TLSv1.2" })

        return fetch(tokenUrl, {
            agent,
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(async res => {
            const json = await res.json()
            return { status: res.status, json }
        })
    },

    query: async (queryUrl, refreshToken, cert, query) => {
        // mTLS        
        const agent = new Agent({ ...cert, minVersion: "TLSv1.2", maxVersion: "TLSv1.2" })

        return fetch(queryUrl, {
            agent,
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshToken}`
            },
            body: query
        }).then(async res => {
            const json = await res.json()
            return { status: res.status, json }
        })
    }
}