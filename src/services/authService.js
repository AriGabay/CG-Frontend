import { httpService } from './http.service';
const endPoint = 'auth';
const login = async (user) => {
  const res = await httpService.post(endPoint + '/login', user);
  sessionStorage.setItem('user', res.token);
  return res;
};
const verifyToken = async (token) => {
  const tok = {
    token
  };
  const res = await httpService.valid(endPoint + '/verify', tok);
  return res;
};

export const authService = {
  login,
  verifyToken
};
