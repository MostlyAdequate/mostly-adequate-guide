const
  CDN    = s => `https://cdnjs.cloudflare.com/ajax/libs/${s}`,
  ramda  = CDN('ramda/0.21.0/ramda.min'),
  jquery = CDN('jquery/3.0.0-rc1/jquery.min');

requirejs.config({paths:{ramda,jquery}});
require(['jquery','ramda'], ($,{compose,curry,map,prop}) => {
  //-- Utils ----------------------------------------------------------
  const
    trace  = curry((tag, x) => { console.log(tag, x); return x; }),
    Impure = {
      getJSON: curry((callback,url) => $.getJSON(url, callback)),
      setHtml: curry((sel,html)     => $(sel).html(html))
    };

  //-- Pure -----------------------------------------------------------
  const
    host  = 'api.flickr.com',
    path  = '/services/feeds/photos_public.gne',
    query = t => `?tags=${t}&format=json&jsoncallback=?`,
    url   = t => `https://${host+path+query(t)}`;

  const
    img       = url => $('<img />', {src: url}),
    mediaUrl  = compose(prop('m'), prop('media')),
    mediaUrls = compose(map(mediaUrl), prop('items')),
    images    = compose(map(img), mediaUrls);

  //-- Impure ---------------------------------------------------------
  const
    render = compose(Impure.setHtml("#js-main"), images),
    app    = compose(Impure.getJSON(render), url);

  app("cats");
});
