var moment = require('moment');
var format = 'YYYY/MM/DD HH:mm:ss ZZ';
// var time = moment(time, format).tz(zone).format(format);

console.log(moment().utcOffset(1).format('YYYY-MM-DD, HH:mm:ss'))