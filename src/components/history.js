const { createBrowserHistory }  = require('history');

let history = createBrowserHistory();

const push = (item) => {
  history.push(item);
};

module.exports = {
  history,
  push,
};
