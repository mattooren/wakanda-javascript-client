import AbstractService from './abstract-service';
import {ICurrentUserDBO} from '../../business/directory-business';
import {DirectoryBaseService} from './base/directory-base-service';

class DirectoryService extends AbstractService {

  public login(username: string, password: string, duration: number): Promise<boolean> {
    return DirectoryBaseService.login({
      httpClient: this.httpClient,
      username,
      password,
      duration
    });
  }

  public logout(): Promise<boolean> {
    return DirectoryBaseService.logout({
      httpClient: this.httpClient
    });
  }

  public currentUser(): Promise<ICurrentUserDBO> {
    return DirectoryBaseService.currentUser({
      httpClient: this.httpClient
    });
  }

  public currentUserBelongsTo(group: string): Promise<boolean> {
    return DirectoryBaseService.currentUserBelongsTo({
      httpClient: this.httpClient,
      group
    });
  }
}

export default DirectoryService;
