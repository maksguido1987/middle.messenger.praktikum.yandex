class HTTPClient {
  private static transformDataToQueryString(data: Record<string, any>): string {
    if (!data) return '';

    return Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }

  private static request(
    method: string,
    url: string,
    options: {
      timeout?: number;
      data?: Record<string, any>;
      headers?: Record<string, string>;
    } = {},
  ): Promise<XMLHttpRequest> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const {timeout = 5000, data, headers = {}} = options;

      // Добавляем query параметры для GET запроса
      const queryString =
        method === 'GET' && data ? `?${this.transformDataToQueryString(data)}` : '';
      xhr.open(method, url + queryString, true);

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
          reject(new Error(`HTTP Error: ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network Error'));
      xhr.ontimeout = () => reject(new Error('Request Timeout'));

      // Отправляем запрос
      if (method === 'GET') {
        xhr.send();
      } else {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(data ? JSON.stringify(data) : null);
      }
    });
  }

  public static get(
    url: string,
    options?: {
      timeout?: number;
      data?: Record<string, any>;
      headers?: Record<string, string>;
    },
  ): Promise<XMLHttpRequest> {
    return this.request('GET', url, options);
  }

  public static post(
    url: string,
    options?: {
      timeout?: number;
      data?: Record<string, any>;
      headers?: Record<string, string>;
    },
  ): Promise<XMLHttpRequest> {
    return this.request('POST', url, options);
  }

  public static put(
    url: string,
    options?: {
      timeout?: number;
      data?: Record<string, any>;
      headers?: Record<string, string>;
    },
  ): Promise<XMLHttpRequest> {
    return this.request('PUT', url, options);
  }

  public static delete(
    url: string,
    options?: {
      timeout?: number;
      data?: Record<string, any>;
      headers?: Record<string, string>;
    },
  ): Promise<XMLHttpRequest> {
    return this.request('DELETE', url, options);
  }
}
