import {Router} from '../core/Router';
import {ResourcesService} from '../services/resources';

export class ResourcesController {
  private resourcesService: ResourcesService;
  private router: Router;

  constructor() {
    this.resourcesService = new ResourcesService();
    this.router = new Router();
  }

  async getResource(path: string): Promise<void> {
    try {
      await this.resourcesService.getResource(path).then((resource) => {
        console.log(resource);
      });
    } catch (error) {
      console.error(error);
    }
  }
}
