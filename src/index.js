require('./styles/main.scss');
const React = require('react');
const { render } = require('react-dom');

const MainComponent = require('./components/MainComponent');

render(
    <MainComponent />,
    document.getElementById('root')
);
