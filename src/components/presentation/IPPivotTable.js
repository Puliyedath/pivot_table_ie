const React = require('react');
const rows = require('../../traffic_bytes.js');

const SRC_IP_DIMENSION = 'SRC IP Address';
const DEST_IP_DIMENSION = 'DEST IP Address';

class IPPivotTable extends React.Component {
  componentDidMount() {
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
      activeDimensions:[SRC_IP_DIMENSION, DEST_IP_DIMENSION]
    })
  }

  render() {
    const props = this.props;
    return (
      <div className="row justify-content-center">
        <div className="col-8" id="ip-pivot-table" />
      </div>
    );
  }
}

module.exports = IPPivotTable;
