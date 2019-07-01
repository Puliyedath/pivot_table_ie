const React = require('react');
const { push, stringifyQueryParams } = require('../history');
const Emitter = require('wildemitter');
const rows = require('../../traffic_bytes.js');
const { SRC_IP_DIMENSION, DEST_IP_DIMENSION, PIVOT_DIMENSIONS } = require('../../constants');
const { getActiveDimensions, getSolo, bus } = require('../../utils');


const persisted = {
  solo: getSolo(),
  activeDimensions: getActiveDimensions(),
};

function IPPivotTableContainer(WrappedComponent, elementId) {

  return class extends React.Component {
    
    componentDidMount() {
      const props = this.props;

      const dimensions = [
        {
          title: SRC_IP_DIMENSION,
          value: function(row) { return row.result['All_Traffic.src'] },
          template: function(value) {
            return `<span>${value}</span>`;
          },
        },
        {
          title: DEST_IP_DIMENSION,
          value: function(row) { return row.result['All_Traffic.dest'] },
          template: function(value) {
            return `<span>${value}</span>`;
          },
        }
      ];
      
      const reduce = function(row, memo) {
        memo.count = (memo.count || 0) + 1 ;
        memo.totalBytes = (memo.totalBytes || 0) + parseInt(row.result.sum_bytes) ;
        return memo;
      }
      
      const calculations = [{
        title: 'Total Bytes from Source',
        value: memo => memo.totalBytes,
      }];

      ReactPivot(document.getElementById(elementId), {
        rows,
        dimensions,
        reduce,
        calculations,
        nPaginateRows: 10,
        compact: true,
        activeDimensions:persisted.activeDimensions,
        solo: persisted.solo,
        eventBus: bus,
      })

      bus.on('solo', function(solo) {
        persisted.solo = {...solo} ;
        push(persisted);
      });

      bus.on('activeDimensions', function(activeDimensions) {
        persisted.activeDimensions = [...activeDimensions];
        push(persisted);
      });
    }

    render() {
      return (<WrappedComponent {...this.props} />);
    }
  }
}

module.exports = IPPivotTableContainer;
