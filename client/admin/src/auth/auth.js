import { jwtDecode } from 'jwt-decode';

export function getAccessToken() {
  return localStorage.getItem('accessToken');
}

export function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

export function isTokenExpired(token) {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() / 1000 > exp;
  } catch (e) {
    return true;
  }
}

export function isLoggedIn() {
  const token = getAccessToken();
  return token && !isTokenExpired(token);
}

export function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}



export function getToken() {
  return localStorage.getItem('token');
}
