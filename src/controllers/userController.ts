import {Router} from '../core/Router';
import {UserPasswordData, UserProfileData, UserService} from '../services/user';
import {store} from '../store/store';

export class UserController {
  private userService: UserService;
  private router: Router;

  constructor() {
    this.userService = new UserService();
    this.router = new Router();
  }

  async updateProfile(data: UserProfileData): Promise<void> {
    try {
      await this.userService.updateProfile(data).then(() => {
        store.setState('user', data);
        this.router.go('/messenger');
      });
    } catch (error) {
      console.error(error);
    }
  }

  async updateAvatar(data: FormData): Promise<void> {
    try {
      await this.userService.updateAvatar(data).then((data) => {
        store.setState('user', data);
      });
    } catch (error) {
      console.error(error);
    }
  }

  async updatePassword(data: UserPasswordData): Promise<void> {
    try {
      await this.userService.updatePassword(data).then(() => {
        this.router.go('/settings');
      });
    } catch (error) {
      console.error(error);
    }
  }

  async searchUser(login: string): Promise<void> {
    try {
      await this.userService.searchUser({login}).then((users) => {
        console.log(users);
      });
    } catch (error) {
      console.error(error);
    }
  }
}
