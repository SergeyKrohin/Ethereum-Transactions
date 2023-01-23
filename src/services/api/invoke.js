import {urls} from '../../vars/urls';

export const invoke = (method, endPoint, params, abort, body = null) => {

    const url = urls.etherscan + endPoint + 
    (params ? '?' + new URLSearchParams(params).toString() : '');

    return new Promise((resolve, reject) => {
        return fetch(url, {signal: abort.signal},
            {
                method: method,
                headers: {'Content-Type': 'application/json'},
                body: body
            }
            ).then(res => {
                res.json().then((result) => {
                    if(result.status !== '0') {
                        resolve(result);
                    } else {
                        reject(result.message);
                    }
                })

            }).catch((err) => {
                reject('Error! ' + err.message);
            });
    });
}