import CatalogBusiness from './business/catalog-business';
import DirectoryBusiness from './business/directory-business';
import Entity from './presentation/entity';
import Collection from './presentation/collection';
import HttpClient from './data-access/http/http-client';
import Catalog from './presentation/catalog';
import BrowserHttpClient from './data-access/http/browser-http-client';
import NodeHttpClient from './data-access/http/node-http-client';

const packageOptions: any = require('../package.json');

export interface IDirectory {
  login(username: string, password: string, duration?: number): Promise<boolean>;
  logout(): Promise<boolean>;
  currentUser(): Promise<any>;
  currentUserBelongsTo(groupName: string): Promise<boolean>;
}

export interface IHelper {
  isEntity(object: any): boolean;
  isCollection(object: any): boolean;
}

class WakandaClient {

  public static HttpClient: typeof BrowserHttpClient|typeof NodeHttpClient;

  public _httpClient: HttpClient;
  public directory: IDirectory;
  public helper: IHelper;
  public catalog: string;

  constructor(params: {host?: string, catalog?: string}|any) {
    let host = typeof(params) === 'object' ? params.host : undefined;
    let catalog = typeof(params) === 'object' ? params.catalog : undefined;

    this._httpClient = new WakandaClient.HttpClient({
      apiPrefix: (host || '')
    });

    this.catalog = catalog;

    let directoryBusiness = new DirectoryBusiness({
      wakJSC: this
    });

    this.directory = {
      login: (username, password, duration) => {
        return directoryBusiness.login(username, password, duration);
      },
      logout: () => {
        return directoryBusiness.logout();
      },
      currentUser: () => {
        return directoryBusiness.currentUser();
      },
      currentUserBelongsTo: (group) => {
        return directoryBusiness.currentUserBelongsTo(group);
      }
    };

    this.helper = {
      isEntity: object => {
        return object instanceof Entity;
      },
      isCollection: object => {
        return object instanceof Collection;
      }
    };
  }

  public getCatalog(dataClasses?: string[]): Promise<Catalog> {
    let catalogBusiness = new CatalogBusiness({
      wakJSC: this
    });

    return catalogBusiness.get(dataClasses);
  }

  public version(): string {
    return packageOptions.version;
  }
}

export default WakandaClient;
