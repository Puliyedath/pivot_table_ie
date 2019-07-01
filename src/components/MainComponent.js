const React = require('react');
const { Router, Route } = require('react-router-dom');
const { history } = require('./history');

const IPPivotTable = require('./presentation/IPPivotTable');

const MainComponent = (props) => {
  return (
    <React.Fragment>
      <h3 className="text-center">IP Pivot Table</h3>
      <Router history={history}>
        <Route path="/" component={IPPivotTable} />
      </Router>
    </React.Fragment>
  )
};

module.exports = MainComponent;
