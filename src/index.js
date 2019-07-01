require('./styles/main.scss');
const React = require('react');
const { createLogger } = require('redux-logger');
const { render } = require('react-dom');
const { Provider } = require('react-redux');
const { createStore, applyMiddleware } = require('redux');
const { rootReducer } = require('./reducers');

const MainComponent = require('./components/MainComponent');

const logger = createLogger();

const store = createStore(
  rootReducer,
  applyMiddleware(
    logger,
  ));

render(
    <Provider store={store}>
      <MainComponent />
    </Provider>,
  document.getElementById('root')
);
