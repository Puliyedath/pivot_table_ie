const Emitter = require('wildemitter');
const { SRC_IP_DIMENSION, DEST_IP_DIMENSION, PIVOT_DIMENSIONS } = require('../constants');

const getActiveDimensions = () => {
  const params = new URLSearchParams(window.location.search);
  let dimensions = params.get('dimensions') 
  if (!dimensions) {
    return [SRC_IP_DIMENSION];
  }
  
  dimensions = dimensions.split(',');
  const activeDimensions = dimensions.map(d =>{
    if (PIVOT_DIMENSIONS.includes(d)){
      return d
    }
  });
  
  return activeDimensions;
};

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



module.exports = {
  getActiveDimensions,
  getSolo,
  bus: new Emitter,
}
