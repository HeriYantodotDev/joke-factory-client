import i18n from '../../locale/i18n';

const env = process.env.NODE_ENV;

interface EnvRootMap {
  [key: string]: string;
}

const envRootMap: EnvRootMap = {
  development: 'https://joke-factory-server.fly.dev',
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        'Accept-Language': i18n.default?.language || (i18n as any).language,
        //  The reason for using (i18n as any).language as a fallback is related to Jest testing.
      },
      body: JSON.stringify(body),
    });

    return response;
  }
}
