import axios from 'axios';

const baseURL = 'http://localhost:3333';
const makeRequest = (token, url, method, data) =>
  axios({
    url: baseURL+url,
    method,
    data,
    headers: {
      Authorization: 'Bearer ' + token
    }
  });

export const signIn = (email, password) =>
  axios({
    url: baseURL + '/login',
    method: 'POST',
    data: {email, password}
  });

export const fetchGameOptions = (token) =>
  makeRequest(token, '/game-options');

export const createGame = (token, gameConfig) =>
  makeRequest(token, '/games', 'POST', gameConfig);