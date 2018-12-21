import moment from 'moment';

export const formatDate = (rfc3339, displayFormat = 'YYYY-MM-DD') => {
  return moment(rfc3339).format(displayFormat);
};

export let URL_PREFIX = window.location.origin + '/postgrest';

export let DEFAULT_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
};

const REACT_APP_BASIC_AUTH_USERNAME = process.env.REACT_APP_BASIC_AUTH_USERNAME;
const REACT_APP_BASIC_AUTH_PASSWORD = process.env.REACT_APP_BASIC_AUTH_PASSWORD;
if (REACT_APP_BASIC_AUTH_USERNAME && REACT_APP_BASIC_AUTH_PASSWORD) {
  DEFAULT_HEADERS['Authorization'] = 'Basic ' +
    btoa(`${REACT_APP_BASIC_AUTH_USERNAME}:${REACT_APP_BASIC_AUTH_PASSWORD}`);
}

export const postJSON = (pathSuffix, payload, additionalHeaders = {}) => {
  const headers = {
    ...DEFAULT_HEADERS,
    ...additionalHeaders
  };

  return fetch(URL_PREFIX + pathSuffix, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload)
  }).then(resp => {
    return resp.json();
  });
};

export const getJSON = (pathSuffix, additionalHeaders = {}) => {
  const headers = {
    ...DEFAULT_HEADERS,
    ...additionalHeaders
  };

  return fetch(URL_PREFIX + pathSuffix, {
    method: 'GET',
    headers: headers
  }).then(resp => {
    return resp.json();
  });
};

export const patchJSON = (pathSuffix, payload, additionalHeaders = {}) => {
  const headers = {
    ...DEFAULT_HEADERS,
    ...additionalHeaders
  };

  return fetch(URL_PREFIX + pathSuffix, {
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify(payload)
  }).then(resp => {
    return resp.json();
  });
};

export const deleteJSON = (pathSuffix, additionalHeaders = {}) => {
  const headers = {
    ...DEFAULT_HEADERS,
    ...additionalHeaders
  };

  return fetch(URL_PREFIX + pathSuffix, {
    method: 'DELETE',
    headers: headers
  }).then(resp => {
    return resp.json();
  });
};
