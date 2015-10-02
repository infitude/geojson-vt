'use strict';

var geojsonvt = require('../src/index');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

module.exports = genTiles;

// using;
// node gen-cache fixtures/roads.geojson 7 200
// creates tile directory under tiles/

if (require.main === module) { // if called directly

    var fs = require('fs');

    var result = genTiles(JSON.parse(fs.readFileSync(process.argv[2])), process.argv[3], process.argv[4]);

    console.log(JSON.stringify(result));
}

function genTiles(data, maxZoom, maxPoints) {
    var index = geojsonvt(data, {
        indexMaxZoom: maxZoom || 0,
        indexMaxPoints: maxPoints || 10000
    });

    var output = {};

    for (var id in index.tiles) {
        var tile = index.tiles[id];
        var z = Math.log(tile.z2) / Math.LN2;
        //output['z' + z + '-' + tile.x + '-' + tile.y] = index.getTile(z, tile.x, tile.y).features;
    	//console.log('z' + z + '-' + tile.x + '-' + tile.y);
        var filePath = ['tiles/', z, '/', tile.x ].join('')
        mkdirp.sync(filePath);
        var tileJSON = index.getTile(z, tile.x, tile.y); 

        var swapY = (1 << z) - 1 - tile.y;

        console.log(['writing ',filePath,'/',swapY].join(''));

        var wstream = fs.createWriteStream([filePath, '/', swapY, '.json'].join(''));
        //var wstream = fs.createWriteStream([filePath, '/', tile.y, '.json'].join(''));
        //var features = index.getTile(z, tile.x, tile.y).features; 
        //wstream.write(JSON.stringify(features));
        wstream.write(JSON.stringify(tileJSON));
        wstream.end();
    }
    return 'done';
}
