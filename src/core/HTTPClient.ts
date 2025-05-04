import {Router} from './Router';

export enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

type HTTPOptions = {
  method: HTTPMethod;
  timeout?: number;
  data?: unknown;
  headers?: Record<string, string>;
  tries?: number;
};

type HTTPMethodType = (
  url: string,
  options?: Omit<HTTPOptions, 'method'>,
) => Promise<XMLHttpRequest>;

export class HTTPClient {
  private static transformDataToQueryString(data: unknown): string {
    if (!data) return '';

    return Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');
  }

  private static request(
    url: string,
    options: HTTPOptions = {method: HTTPMethod.GET},
  ): Promise<XMLHttpRequest> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const {method, data, headers = {}, timeout = 5000} = options;

      // Добавляем query параметры для GET запроса
      const queryString =
        method === HTTPMethod.GET && data ? `?${this.transformDataToQueryString(data)}` : '';
      xhr.open(method, url + queryString, true);
      xhr.withCredentials = true;

      // Устанавливаем таймаут
      xhr.timeout = timeout;

      // Устанавливаем заголовки
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      // Добавляем обработчики событий
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr);
        } else {
          if (xhr.status === 401) {
            const router = new Router();
            router.go('/');
          }
          reject(new Error(`HTTP Error: ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network Error'));
      xhr.ontimeout = () => reject(new Error('Request Timeout'));

      // Отправляем запрос
      if (method === HTTPMethod.GET) {
        xhr.send();
      } else {
        if (!(data instanceof FormData)) {
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send(data ? JSON.stringify(data) : null);
        } else {
          xhr.send(data);
        }
      }
    });
  }

  private static async fetchWithRetry(
    url: string,
    options: HTTPOptions = {method: HTTPMethod.GET},
  ): Promise<XMLHttpRequest> {
    const {tries = 1} = options;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < tries; attempt++) {
      try {
        return await this.request(url, options);
      } catch (error) {
        lastError = error as Error;
        if (attempt === tries - 1) break;
      }
    }

    throw new Error(`Failed after ${tries} attempts. Last error: ${lastError?.message}`);
  }

  private static createMethod(method: HTTPMethod): HTTPMethodType {
    return (url: string, options?: Omit<HTTPOptions, 'method'>) =>
      this.fetchWithRetry(url, {...options, method});
  }

  public static get = this.createMethod(HTTPMethod.GET);
  public static post = this.createMethod(HTTPMethod.POST);
  public static put = this.createMethod(HTTPMethod.PUT);
  public static delete = this.createMethod(HTTPMethod.DELETE);
  public static patch = this.createMethod(HTTPMethod.PATCH);
}
