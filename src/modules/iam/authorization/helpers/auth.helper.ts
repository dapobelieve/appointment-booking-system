import { Request } from 'express';

export const getIpAddress = (request: Request) => {
  return request.headers['x-forwarded-for'] || request.connection.remoteAddress;
};
