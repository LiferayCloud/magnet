import Magnet from './magnet';
import registratorMultiple from './registrator/multiple';
import Table from 'cli-table';
import path from 'path';

/**
 * @param {Magnet} magnet
 * @return {Array.<Array.<string>>}
 * @private
 */
function getRoutesDefinition_(magnet) {
  let dist = magnet.getServerDistDirectory();
  let files = magnet.getFiles(dist, true);

  let results = [];
  files.forEach((file) => {
    switch (file) {
      case path.join(dist, Magnet.LifecyleFiles.START):
        return;
    }

    let module = require(file);
    let short = file.substring(dist.length);

    if (registratorMultiple.test(file, module, magnet)) {
      results.push(['―', '―', '―', short]);
    } else {
      let route = module.route;
      if (route) {
        let path = route.path;
        let method = route.method || 'get';
        let type = route.type || 'html';
        results.push([method.toUpperCase(), path, type, short]);
      }
    }
  });
  return results;
}

/**
 * @param {Magnet} magnet
 * @return {String}
 */
export function getRoutesTable(magnet) {
  const table = new Table({
    head: ['method', 'path', 'type', 'file'],
    style: {
      border: ['gray'],
      compact: true,
      head: ['gray'],
    },
  });
  table.push(...getRoutesDefinition_(magnet));
  if (table.length) {
    return table.toString();
  }
  return '';
}
