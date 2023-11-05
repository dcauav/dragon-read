class HttpClient {
    constructor(options = {}) {
        this._baseUrl = options.baseUrl || window.location.origin;
    }

    buildQueryString(query) {
        return query.filter((req) => {
            req.name = `${req.name}`.trim();
            req.value = `${req.value}`.trim();

            return (req.name !== undefined && req.name !== '') && (req.value !== undefined && req.value !== '')
        }).map((ret) => {
            return `${retreq.name}=${ret.value}`;
        }).join('&');

    }

    async get(path = '', query = [{ name: '', value: '' }] || null, headers = [{ name: '', value: '' }]) {
        const baseUrl = this._baseUrl;
        const queryString = this.buildQueryString(query);

        return new Promise(function (resolve, reject) {
            const xmlhttp = new XMLHttpRequest();

            xmlhttp.open('GET', `${baseUrl}${path}${queryString !== '' ? `?${queryString}` : ''}`, true);

            headers.forEach((header) => {
                if (!(header.name.trim() != '' && header.value.trim() != '')) return;

                xmlhttp.setRequestHeader(header.name, header.value);
            })

            xmlhttp.onload = function () {
                if (xmlhttp.readyState == 4) {
                    switch (xmlhttp.status) {
                        case 0:
                            reject({
                                status: xmlhttp.status,
                                statusText: xmlhttp.statusText,
                                reason: "Sem acesso ao servidor, tente novamente mais tarde!"
                            });
                            break;
                        case 200:
                            resolve({
                                status: xmlhttp.status,
                                statusText: xmlhttp.statusText,
                                response: xmlhttp.response,
                                responseText: xmlhttp.responseText
                            });
                            break;
                        default:
                            reject({
                                status: xmlhttp.status,
                                statusText: xmlhttp.statusText,
                                reason: xmlhttp.responseText
                            });
                    }
                }
            }

            xmlhttp.onerror = function () {
                reject({
                    status: xmlhttp.status,
                    statusText: xmlhttp.statusText,
                    reason: xmlhttp.status == 0 ? "Sem acesso ao servidor, tente novamente mais tarde!" : xmlhttp.responseText
                });
            };

            xmlhttp.send();
        });
    }

    async post(path = '', body = {} || null, headers = [{ name: '', value: '' }]) {
        const baseUrl = this._baseUrl;

        return new Promise(function (resolve, reject) {
            const xmlhttp = new XMLHttpRequest();
            xmlhttp.open('POST', `${baseUrl}${path || ''}`, true);

            headers.forEach((header) => {
                if (!(header.name.trim() != '' && header.value.trim() != '')) return;

                xmlhttp.setRequestHeader(header.name, header.value);
            })

            xmlhttp.onload = function () {
                if (xmlhttp.readyState == 4) {
                    switch (xmlhttp.status) {
                        case 0:
                            reject({
                                status: xmlhttp.status,
                                statusText: xmlhttp.statusText,
                                reason: "Sem acesso ao servidor, tente novamente mais tarde!"
                            });
                            break;
                        case 200:
                            resolve({
                                status: xmlhttp.status,
                                statusText: xmlhttp.statusText,
                                response: xmlhttp.response,
                                responseText: xmlhttp.responseText
                            });
                            break;
                        default:
                            reject({
                                status: xmlhttp.status,
                                statusText: xmlhttp.statusText,
                                reason: xmlhttp.responseText
                            });
                    }
                }
            }
            xmlhttp.onerror = function () {
                reject({
                    status: xmlhttp.status,
                    statusText: xmlhttp.statusText,
                    reason: xmlhttp.status == 0 ? "Sem acesso ao servidor, tente novamente mais tarde!" : xmlhttp.responseText
                });
            };

            xmlhttp.send(JSON.stringify(body));
        });
    }

    async put(path = '', body = {} || null, headers = [{ name: '', value: '' }]) {
        const baseUrl = this._baseUrl;

        return new Promise(function (resolve, reject) {
            const xmlhttp = new XMLHttpRequest();
            xmlhttp.open('PUT', `${baseUrl}${path || "/"}`, options.async || true);

            headers.forEach((header) => {
                if (!(header.name.trim() != '' && header.value.trim() != '')) return;

                xmlhttp.setRequestHeader(header.name, header.value);
            })

            xmlhttp.onload = function () {
                if (xmlhttp.readyState == 4) {
                    switch (xmlhttp.status) {
                        case 0:
                            reject({
                                status: xmlhttp.status,
                                statusText: xmlhttp.statusText,
                                reason: "Sem acesso ao servidor, tente novamente mais tarde!"
                            });
                            break;
                        case 200:
                            resolve({
                                status: xmlhttp.status,
                                statusText: xmlhttp.statusText,
                                response: xmlhttp.response,
                                responseText: xmlhttp.responseText
                            });
                            break;
                        default:
                            reject({
                                status: xmlhttp.status,
                                statusText: xmlhttp.statusText,
                                reason: xmlhttp.responseText
                            });
                    }
                }
            }
            xmlhttp.onerror = function () {
                reject({
                    status: xmlhttp.status,
                    statusText: xmlhttp.statusText,
                    reason: xmlhttp.status == 0 ? "Sem acesso ao servidor, tente novamente mais tarde!" : xmlhttp.responseText
                });
            };

            xmlhttp.send(JSON.stringify(body));
        });
    }

    async delete(path = '', query = [{ name: '', value: '' }] || null, headers = [{ name: '', value: '' }]) {
        const baseUrl = this._baseUrl;
        const queryString = this.buildQueryString(query);

        return new Promise(function (resolve, reject) {
            const xmlhttp = new XMLHttpRequest();
            xmlhttp.open('DELETE', `${baseUrl}${path || "/"}${queryString != '' ? `?${queryString}` : ''}`, true);

            headers.forEach((header) => {
                if (!(header.name.trim() != '' && header.value.trim() != '')) return;

                xmlhttp.setRequestHeader(header.name, header.value);
            })

            xmlhttp.onload = function () {
                if (xmlhttp.readyState == 4) {
                    switch (xmlhttp.status) {
                        case 0:
                            reject({
                                status: xmlhttp.status,
                                statusText: xmlhttp.statusText,
                                reason: "Sem acesso ao servidor, tente novamente mais tarde!"
                            });
                            break;
                        case 200:
                            resolve({
                                status: xmlhttp.status,
                                statusText: xmlhttp.statusText,
                                response: xmlhttp.response,
                                responseText: xmlhttp.responseText
                            });
                            break;
                        default:
                            reject({
                                status: xmlhttp.status,
                                statusText: xmlhttp.statusText,
                                reason: xmlhttp.responseText
                            });
                    }
                }
            }
            xmlhttp.onerror = function () {
                reject({
                    status: xmlhttp.status,
                    statusText: xmlhttp.statusText,
                    reason: xmlhttp.status == 0 ? "Sem acesso ao servidor, tente novamente mais tarde!" : xmlhttp.responseText
                });
            };

            xmlhttp.send();
        });
    }
}