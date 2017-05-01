import Magnet from './magnet';
import pluginMultiple from 'magnet-plugin-multiple';
import Table from 'cli-table';
import path from 'path';

/**
 * Scans build files collecting routes metadata into an array consumed
 * by `magnet routes` command output table.
 * @param {Magnet} magnet
 * @return {Array.<Array.<string>>}
 * @private
 */
function getRoutesDefinition_(magnet) {
  let dist = magnet.getServerDistDirectory();
  let files = magnet.getFiles({directory: dist, realpath: true});

  let results = [];
  files.forEach(file => {
    switch (file) {
      case path.join(dist, Magnet.LifecyleFiles.START):
      case path.join(dist, Magnet.LifecyleFiles.STOP):
        return;
    }

    let module = require(file);
    let short = file.substring(dist.length);

    if (pluginMultiple.test(module, file, magnet)) {
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
 * Builds routing table based on route definitions. If no routes were found
 * returns empty string, otherwise return as example below:
 * ┌────────┬──────┬──────┬───────────┐
 * │ method │ path │ type │ file      │
 * ├────────┼──────┼──────┼───────────┤
 * │ POST   │ /api │ json │ /api.js   │
 * │ GET    │ /    │ html │ /index.js │
 * └────────┴──────┴──────┴───────────┘
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
