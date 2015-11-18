var https = require('https')
var Promise = require('bluebird')

module.exports = (function () {

    var Trello = function (args) {
        this.applicationKey = args.applicationKey
        this.token = args.token
        this.baseURL = (typeof args.baseURL !== 'undefined')? baseURL : "api.trello.com"
        this.APIVersion = (typeof args.APIVersion !== 'undefined')? APIVersion : "1"
    }

    Trello.prototype.rest = function (method, path, params) {
        var self = this

        if (params === null || typeof params === 'undefined') {
            params = {}
        }

        return new Promise(function (resolve, reject) {
            var body = JSON.stringify(params)
            var options = {
                hostname : self.baseURL,
                port : 443,
                path : "/" + self.APIVersion + path + "?key=" + self.applicationKey + "&token=" + self.token,
                method : method,
                headers : {
                    'Content-Type' : 'application/json',
                    'Content-Length' : Buffer.byteLength(body),
                    'Accept' : 'application/json'
                }
            }
            var responseBody = ""
            var request = https.request(options, function(res) {
                var statusCodeString = res.statusCode.toString()

                if (statusCodeString.substring(0, 1) === "2") {
                    res.setEncoding('utf8')
                    res.on('data', function (chunk) {
                        responseBody += chunk
                    })
                    res.on('end', function () {
                        resolve(JSON.parse(responseBody))
                    })
                } else {
                    reject(new Error('Server responded with status code ' + statusCodeString))
                }
            })

            request.on('error', function (error) {
                reject(error)
            })

            request.write(body)
            request.end()
        })
    },

    Trello.prototype.get = function (path, params) {
        return this.rest('GET', path, params)
    },

    Trello.prototype.post = function (path, params) {
        return this.rest('POST', path, params)
    },

    Trello.prototype.put = function (path, params) {
        return this.rest('PUT', path, params)
    },

    Trello.prototype.delete = function (path, params) {
        return this.rest('DELETE', path, params)
    }

    return Trello
})()
