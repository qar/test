interface FetcherConfig {
  baseUrl?: URL | string;
  timeout?: number;
}

type Interceptor<T = unknown> = (config: T) => Promise<T> | T;

interface Interceptors<T = unknown> {
  onFulfilled: Interceptor<T>;
  onRejected?: (error: unknown) => unknown;
}

interface FetcherResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  config: RequestInit;
  request: string | URL;
}

export default class Fetcher {
  private readonly baseUrl: URL;
  private readonly timeout?: number;
  private readonly interceptors: {
    request: Interceptors<RequestInit>[];
    response: Interceptors<FetcherResponse>[];
  };
  private readonly abortController = new AbortController();

  constructor({ baseUrl = '', timeout }: FetcherConfig) {
    this.baseUrl = typeof baseUrl === 'string' ? new URL(baseUrl) : baseUrl;
    this.timeout = timeout;
    this.interceptors = {
      request: [],
      response: [],
    };
  }

  interceptRequest(onFulfilled: Interceptor<RequestInit>, onRejected?: (error: unknown) => unknown) {
    this.interceptors.request.push({ onFulfilled, onRejected });
  }

  interceptResponse(onFulfilled: Interceptor<FetcherResponse>, onRejected?: (error: unknown) => unknown) {
    this.interceptors.response.push({ onFulfilled, onRejected });
  }

  async request<T>(url: URL | string, options: RequestInit = {}, params?: Record<string, string>): Promise<FetcherResponse<T>> {
    const requestOptions = Object.assign({}, options);
    const { request: requestInterceptors } = this.interceptors;

    await Promise.all(
      requestInterceptors.map(async (interceptor) => {
        const { onFulfilled } = interceptor;
        const interceptorOptions = await onFulfilled(requestOptions);
        requestOptions.headers = interceptorOptions.headers;
      })
    );

    const requestUrl = new URL(this.baseUrl);
    if (typeof url === 'string') {
      requestUrl.pathname = `${requestUrl.pathname}${url[0] === '/' ? url : `/${url}`}`;
    } else {
      requestUrl.pathname = `${requestUrl.pathname}${url.pathname}`;
    }

    if (params) {
      Object.keys(params).forEach((key) => {
        requestUrl.searchParams.append(key, params[key]);
      });
    }

    const request = fetch(requestUrl, {
      ...options,
      headers: requestOptions.headers,
      signal: this.abortController.signal
    });
    const { timeout } = this;

    if (timeout) {
      // try {
      //   const response = await Promise.race([request, wait(timeout)]) as Response
      //   return {
      //     data: this.parseJSON(response) as T,
      //     status: response.status,
      //     statusText: response.statusText,
      //     headers: response.headers,
      //     config: options,
      //     request: requestUrl,
      //   }
      // } catch (error) {
      //   return Promise.reject(error);
      // }

      setTimeout(() => {
        this.abortController.abort();
      }, timeout);
    }

    const response = await request as unknown as Response;

    const responseData: FetcherResponse<T> = {
      data: this.parseJSON(response) as T,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: options,
      request: requestUrl,
    };

    await Promise.all(
      this.interceptors.response.map(async (interceptor) => {
        const { onFulfilled } = interceptor;
        await onFulfilled(responseData);
      })
    );

    return responseData;
  }

  get<T>(url: string, { headers, params }: { headers?: HeadersInit, params?: Record<string, string> } = {}) {
    return this.request<T>(url, {
      method: 'GET',
      headers: {
        ...headers,
      },
    }, params);
  }

  post<T>(url: string, headers?: HeadersInit, body?: BodyInit | null) {
    return this.request<T>(url, {
      method: 'POST',
      headers: {
        ...headers,
      },
      body,
    });
  }

  delete<T>(url: string, headers?: HeadersInit) {
    return this.request<T>(url, {
      method: 'DELETE',
      headers: {
        ...headers,
      },
    });
  }

  put<T>(url: string, headers?: HeadersInit, body?: BodyInit | null) {
    return this.request<T>(url, {
      method: 'PUT',
      headers: {
        ...headers,
      },
      body,
    });
  }

  private parseJSON<T>(response: Response) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json') && (response.status === 200 || response.status === 201)) {
      return response.json() as T;
    }
    return {};
  }

  private async wait(timeout: number) {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timeout'));
      }, timeout);
    });
  }
}
