const React = require('react');
const rows = require('../../traffic_bytes.js');
const Emitter = require('wildemitter');
const queryString = require('querystring');
const { getActiveDimensions, getSolo, bus } = require('../../utils');
const { SRC_IP_DIMENSION, DEST_IP_DIMENSION, PIVOT_DIMENSIONS } = require('../../constants');
const { push } = require('../history');

const persisted = {
  solo: getSolo(),
  activeDimensions: getActiveDimensions(),
};

class IPPivotTable extends React.Component {

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
    
    const calculations = [
      {
        title: 'Total Bytes from Source',
        value: memo => memo.totalBytes,
        
      }
    ];

    ReactPivot(document.getElementById('ip-pivot-table'), {
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
      let queryParams = {}
      if (Object.keys(persisted.solo).length) {
        queryParams.solo = Object.keys(persisted.solo).map(k => {
          return `${k}:${persisted.solo[k]}`;
        }).join(',');
      }

      if (Object.keys(persisted.activeDimensions).length) {
        queryParams.dimensions = [ ...persisted.activeDimensions ].join(',');
      }

      if (queryParams) {
        push(`/?${queryString.stringify(queryParams)}`);
      }

    });

    bus.on('activeDimensions', function(activeDimensions) {
      persisted.activeDimensions = [...activeDimensions];

      let queryParams = {};
      if (Object.keys(persisted.solo).length) {
        queryParams.solo = Object.keys(persisted.solo).map(k => {
          return `${k}:${persisted.solo[k]}`;
        }).join(',')
      }

      if (activeDimensions.length) {
        queryParams.dimensions = [ ...activeDimensions ].join(',');
      }

      if (queryParams) {
        push(`/?${queryString.stringify(queryParams)}`);
      }

    });


  }

  render() {
    return (
      <div className="row justify-content-center">
        <div className="col-8" id="ip-pivot-table" />
      </div>
    );
  }
}

module.exports = IPPivotTable;
