import HttpClient from '../../http/http-client';
import {QueryOption} from '../../../presentation/query-option';
import {EntityDBO} from '../../../business/entity-business';
import {CollectionDBO} from '../../../business/collection-business';
import Util from '../../util';

export interface IFindParams {
  httpClient: HttpClient;
  key: number|string;
  options: QueryOption;
  dataClassName: string;
}

export interface IQueryParams {
  httpClient: HttpClient;
  options: QueryOption;
  dataClassName: string;
}

export interface ICallMethodParams {
  httpClient: HttpClient;
  methodName: string;
  parameters: any[];
  dataClassName: string;
}

export class DataClassBaseService {
  
  public static find({httpClient, key, options, dataClassName}: IFindParams) {
    
    if (typeof key !== 'string' && typeof key !== 'number') {
      throw new Error('DataClass.find: Invalid id type');
    }

    let optString = Util.handleOptions(options);

    return httpClient.get({
      uri: '/' + dataClassName + '(' + key + ')' + optString
    })
      .then(res => {
        let entity = JSON.parse(res.body);
        delete entity.__entityModel;

        Util.removeRestInfoFromEntity(entity);

        return entity as EntityDBO;
      });
  }
  
  public static query({httpClient, options, dataClassName}: IQueryParams) {
    
    options.method = 'entityset';

    let optString = Util.handleOptions(options);

    return httpClient.get({
      uri: '/' + dataClassName + optString
    }).then(res => {
      let collection = JSON.parse(res.body);
      delete collection.__entityModel;

      for (let entity of collection.__ENTITIES) {
        Util.removeRestInfoFromEntity(entity);
      }

      return collection as CollectionDBO;
    });
  }
  
  public static callMethod({httpClient, methodName, parameters, dataClassName}: ICallMethodParams) {
    
    return httpClient.post({
      uri: '/' + dataClassName + '/' + methodName,
      data: parameters
    }).then(res => {
      let obj = JSON.parse(res.body);
      return obj.result || obj || null;
    });
  }
}