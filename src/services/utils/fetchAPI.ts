const env = process.env.NODE_ENV;

interface EnvRootMap {
  [key: string]: string;
}

const envRootMap: EnvRootMap = {
  development: 'http://localhost:3000',
  test: 'http://localhost:5173',
  production: 'define-it-later',
};

if (!env) {
  throw new Error('Please set the environment variable');
}

const root = envRootMap[env] || 'define-it-later';

export const API_ROOT_URL = `${root}/api/1.0`;

export class FetchAPI {
  static async post(apiURL: string, body: object) {
    const response = await fetch(API_ROOT_URL + apiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return response;
  }
}
