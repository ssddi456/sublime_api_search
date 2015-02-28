var request = require('request');
var cheerio = require('cheerio');
var url = require('url');
var _ = require('underscore');

function normalize_url ( _url ) {
  _url = url.parse(_url);
  return _url.protocol +'//' + _url.host + _url.pathname + (_url.search || '');
}

function grabber( url, done ) {
  var res = [];
  request(url,function(err, resp, body ) {
    if(err){
      done(err);
      return;
    }
    var $ = cheerio.load(body);

    var title = '[' + $('title').text() + '] ';
    var infos = $('a[href^=#]');

    infos.each(function() {
      var $this = $(this);
      var text = $this.text();
      var href = $this.attr('href')
      if( !text || href.match(/^#+$/) ){return;}
      res.push([
        title + text,
        url + href
      ])
    });
    done( null,uniq_apis(res));
  });
}
function uniq_apis( apis ) {
  return _.uniq(apis,function( a ) {
    return a[0];
  });
}

if( module.parent ){
  module.exports = {
    normalize_url : normalize_url,
    grabber   : grabber,
    uniq_apis : uniq_apis
  };
} else {
  throw '';
  grabber(normalize_url(process.argv[2]),
    function(err, res) {
      if(err){
        console.error( err );
      } else{
        console.log(JSON.stringify(res));
      }
    })
}
