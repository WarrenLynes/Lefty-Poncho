import axios from 'axios';

const baseURL = 'http://127.0.0.1:3333';
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

export const createGame = (token, gameInfo) =>
  makeRequest(token, '/games', 'POST', gameInfo);

export const fetchGameOptions = (token) =>
  makeRequest(token, '/game-options');

export const fetchActiveGame = (token) =>
  makeRequest(token, '/games/active');

export const fetchGame = (token, gameId) =>
  makeRequest(token, '/games/' + gameId);

export const submitScore = (token, payload) =>
  makeRequest(token, `/games/${payload.id}/scores`, 'POST', payload);