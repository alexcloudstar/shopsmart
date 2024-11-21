export interface IJWT_PAYLOAD {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

export interface IRequestWithUser extends Request {
  user: IJWT_PAYLOAD;
}

export type TRequest = {
  status: number;
  message: string;
};
