import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { API_ROOT_URL } from '../services/utils/fetchAPI';

export const handlers = [
  rest.post(`${API_ROOT_URL}/users`, async (req, res, ctx) => {
    console.log(req);
    return res(
      // Respond with a 200 status code
      ctx.status(200)
    );
  }),
];

export const server = setupServer(...handlers);
