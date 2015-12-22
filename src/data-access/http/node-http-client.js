import HttpClient from './http-client';
import HttpResponse from './http-response';

class NodeHttpClient extends HttpClient {

  constructor({apiPrefix}) {
    super({apiPrefix});
    this.request = require('request');
  }

  get({uri, params}) {
    //TODO - response adapter to transform response from node or browser clients
    //to a standardize one (headers, status code, content etc)
    let options = {
      url: this.prefix + uri,
      method: 'GET',
      qs: params
    };

    return this._httpResponseAdaptor({requestOptions: options});
  }

  post({uri, data}) {
    let options = {
      url: this.prefix + uri,
      method: 'POST',
      form: data
    };

    return this._httpResponseAdaptor({requestOptions: options});
  }

  _httpResponseAdaptor({requestOptions}) {
    return new Promise((resolve, reject) => {
      this.request(requestOptions, (error, response, body) => {
        if (error || response.statusCode >= 400) {
          reject(error || response.statusMessage);
        }
        else {
          resolve(new HttpResponse({
            statusCode: response.statusCode,
            headers: [],
            body
          }));
        }
      });
    });
  }
}

export default NodeHttpClient;