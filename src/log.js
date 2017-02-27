import log from 'npmlog';

log.heading = '>';
log.headingStyle = {fg: 'grey', bg: 'black'};

log.addLevel('infoNoPrefix', 2000, {}, '');
log.level = 'infoNoPrefix';

export default log;
