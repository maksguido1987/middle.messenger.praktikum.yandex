import {Router} from '../core/Router';
import {AuthService, SignUpData, SignInData, UserData} from '../services/auth';
import {store} from '../store/store';

export class AuthController {
  private authService: AuthService;
  private router: Router;

  constructor() {
    this.authService = new AuthService();
    this.router = new Router();
  }

  async signUp(data: SignUpData): Promise<void> {
    try {
      await this.authService.signUp(data).then(() => {
        store.setState('user', data);
        this.router.go('/messenger');
      });
    } catch (error) {
      console.error(error);
    }
  }

  async signIn(data: SignInData): Promise<void> {
    try {
      await this.authService.signIn(data).then(() => {
        this.getUser()
          .then(() => {
            this.router.go('/messenger');
          })
          .catch((error) => {
            console.error(error);
          });
      });
    } catch (error) {
      console.error(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout().then(() => {
        this.router.go('/');
      });
    } catch (error) {
      console.error(error);
    }
  }

  async getUser(): Promise<UserData> {
    try {
      return await this.authService.getUser().then((user) => {
        store.setState('user', user);
        return user;
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('401')) {
        this.router.go('/');
      }
      console.error(error);
      throw error;
    }
  }
}
