const React = require('react');
const rows = require('../../traffic_bytes.js');
const Emitter = require('wildemitter');
const queryString = require('querystring');
const { push } = require('../history');

const SRC_IP_DIMENSION = 'SRC IP Address';
const DEST_IP_DIMENSION = 'DEST IP Address';

const PIVOT_DIMENSIONS = [SRC_IP_DIMENSION, DEST_IP_DIMENSION];

window.persisted = {
  solo: {},
  activeDimensions: []
};

const bus = new Emitter;

const getActiveDimensions = () => {
  const params = new URLSearchParams(window.location.search);
  let dimensions = params.get('dimensions') 
  if (!dimensions) {
    return [SRC_IP_DIMENSION];
  }
  
  dimensions = dimensions.split(',');
  const activeDimensions = []
  if (dimensions[0] && PIVOT_DIMENSIONS.includes(dimensions[0])){
    activeDimensions.unshift(DEST_IP_DIMENSION);
  }
  
  if (dimensions[1] && PIVOT_DIMENSIONS.includes(dimensions[1])){
    activeDimensions.push(SRC_IP_DIMENSION);
  }
  
  console.log('activeDimensions is', activeDimensions);
  return activeDimensions
}

const getSolo = () => {
  const params = new URLSearchParams(window.location.search);
  let solo = params.get('solo') ;

  if(!solo) {
    return {};
  }

  solo = solo.split(',');

  const soloDict = solo.reduce((acc, s) => {
    console.log('s' ,s)
    const solo_entry = s.split(':');
    acc[solo_entry[0]] = solo_entry[1];
    return acc;
  },{})

  return soloDict;
};

window.persisted.activeDimensions = getActiveDimensions();
window.persisted.solo = getSolo();


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
      window.persisted.solo = {...solo} ;
      let queryParams = {}
      if (Object.keys(window.persisted.solo).length) {
        queryParams.solo = Object.keys(window.persisted.solo).map(k => {
          return `${k}:${window.persisted.solo[k]}`;
        }).join(',');
      }

      if (Object.keys(window.persisted.activeDimensions).length) {
        queryParams.dimensions = [ ...window.persisted.activeDimensions ].join(',');
      }

      if (queryParams) {
        push(`/?${queryString.stringify(queryParams)}`);
      }

    });

    bus.on('activeDimensions', function(activeDimensions) {
      window.persisted.activeDimensions = [...activeDimensions];

      let queryParams = {};
      if (Object.keys(window.persisted.solo).length) {
        queryParams.solo = Object.keys(window.persisted.solo).map(k => {
          return `${k}:${window.persisted.solo[k]}`;
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
