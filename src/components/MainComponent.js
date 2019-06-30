import React from 'react';
const IPPivotTable = require('./presentation/IPPivotTable');

const MainComponent = (props) => {
  return (
    <React.Fragment>
      <h3 className="text-center">IP Pivot Table</h3>
      <IPPivotTable />
    </React.Fragment>
  )
};

export default MainComponent;
