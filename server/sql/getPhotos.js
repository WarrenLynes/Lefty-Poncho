var axios = require('axios');

var config = {
  method: 'get',
  url: 'https://api.unsplash.com/search/photos?page=2&query=golfer&per_page=50',
  headers: {
    'Authorization': 'Client-ID gTgF24WveUvfnLblcvGyVL-DbSHibsB-jPXFKYuC9u4'
  }
};

axios(config)
  .then(({data}) => {
    return data.results.map(({urls}) => urls.thumb)
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
