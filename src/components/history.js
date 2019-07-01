const { createBrowserHistory }  = require('history');
const queryString = require('querystring');

let history = createBrowserHistory();

const push = ({solo, activeDimensions}) => {
  stringifyQueryParams(solo,activeDimensions);
};

const stringifyQueryParams = (solo, activeDimensions) => {
  let queryParams = {}
  if (Object.keys(solo).length) {
    queryParams.solo = Object.keys(solo).map(k => {
      return `${k}:${solo[k]}`;
    }).join(',');
  }

  if (Object.keys(activeDimensions).length) {
    queryParams.dimensions = [ ...activeDimensions ].join(',');
  }

  if (queryParams) {
    history.push(`/?${queryString.stringify(queryParams)}`);
  }

};

history.listen((location, action) => {
  if (action === 'POP') {
    window.location.reload();
  }

});

module.exports = {
  history,
  push,
};
