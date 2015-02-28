var fs = require('fs');
var _ = require('underscore');
var grabber = require('./grabber');
var file_path = './show_apis.settings';

fs.readFile(file_path,'utf8',function(err, settings) {
  console.log( 'read done', err);
  settings=JSON.parse(settings);
  settings.visited = _.uniq( (settings.visited || [])
                            .map(grabber.normalize_url)
                            .sort(),
                          true);
  console.log( 'unic visited done', err);
  settings.apis = grabber.uniq_apis(settings.apis || []);
  console.log( 'unic apis done', err);
  fs.writeFile(file_path,JSON.stringify(settings),function(err) {
    console.log( 'write done', err);
  });
});