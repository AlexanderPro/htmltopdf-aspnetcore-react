import 'isomorphic-fetch';

export const post = (url, params, json = true) => {
  let options = {
    method: 'POST',
    body: json ? JSON.stringify(params) : params
  };

  options.headers = {};
  if (json) {
    options.headers = {
      'Content-Type': 'application/json'
    };
  }

  return fetch(url, options);
};

export const saveBlob = (blob, fileName) => {
  if (window.navigator && window.navigator.msSaveBlob) {
    window.navigator.msSaveBlob(blob, fileName);
  } else {
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

export const getFileNameFromResponse = response => {
  return response.headers.get('content-disposition') ?
    decodeURI(response.headers.get('content-disposition').split('UTF-8\'\'')[1]) : '';
};

export const responseIsJson = response => {
  const contentType = response.headers.get('content-type');
  return contentType && contentType.includes('application/json');
};
