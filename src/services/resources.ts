import {HTTPClient} from '../core/HTTPClient';

export interface ResourceData {
  id: number;
  user_id: number;
  path: string;
  filename: string;
  content_type: string;
  content_size: number;
  upload_date: string;
}

export class ResourcesService {
  private readonly apiUrl = 'https://ya-praktikum.tech/api/v2';

  async uploadFile(data: FormData): Promise<ResourceData> {
    const response = await HTTPClient.post(`${this.apiUrl}/resources`, {
      data,
    });
    return JSON.parse(response.responseText);
  }

  async getResource(resourceId: string): Promise<ResourceData> {
    const response = await HTTPClient.get(`${this.apiUrl}/resources/${resourceId}`);
    return JSON.parse(response.responseText);
  }
}
