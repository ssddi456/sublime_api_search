var request = require('request');
var cheerio = require('cheerio');
var url = require('url');

var _url = url.parse(process.argv[2]);
_url = _url.protocol +'//' + _url.host + _url.pathname + (_url.search || '');

var res = [];
request(_url,function(err, resp, body ) {
  if(err){
    console.log('err');
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
      _url + href
    ])
  });
  console.log( JSON.stringify(res) );
});