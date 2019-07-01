const React = require('react');
const IPPivotTableContainer = require('../container/IPPivotTableContainer');

const IPPivotTable = () => {
  return (
    <div className="row justify-content-center">
      <div className="col-8" id="ip-pivot-table" >
      </div>
    </div>
  );
}

module.exports = IPPivotTableContainer(IPPivotTable, 'ip-pivot-table');
