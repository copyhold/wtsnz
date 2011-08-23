$shareIcons = null,evals=[];
var filter = {};
$(function(){
  $.ajax({
    data: {"function":"getusersettings"},
    url:"/ajaxget",
    success:function(data){
      data = data;
      if (data.content.run.length) {
        while (runFunction=data.content.run.pop()) {
          evals.push(WTSNZ[runFunction]());
        }
        //console.log(evals);
      }
    },
    type:'post',
    dataType:"json"
  });
  
  if ($.browser.msie) jscorners();
  
//  #! routes
  Path.map('#!/:anything').to(function(){
    console.log(this.params);
  });
  Path.listen();
//  #! routes
//  
  // social
  $social = $('<div id="social"><i>Google +1</i><b>Twitter</b><u>facebook</u></div>');
  $('#content-area > div:eq(0)').prepend($social);
  $shareIcons = $('<B/><I /><U />');
  
  $g1 = $social.children()[0];
  try {
    gapi.plusone.render($g1, {"size": "medium", "count": "false"});
    $social.children('i').attr('style','');
  } catch (e) {}
  
//  breadcrumbs
  $('.breadcrumb>*:gt(0)').each(function(){
    var prevURL = $(this).prev().children().attr('href');
    $(this).append('<A class="back" href="'+prevURL+'"></A>');
  });
//  breadcrumbs

// left advertising
  if ($('body.section-node').length>0) {
    $('<div class="adv"><h3>- advertising -</h3></div>').insertAfter('#block-wtsnz2m-weather');
  }
// left advertising

// countries map
  var areaPos = {
    middleeast:"135px 34px",
    africa: "102px -163px",
    oceania: "209px -1525px",
    asia: "135px -1400px",
    europe: "110px -1192px",
    alaska: "0px -1000px",
    us: "20px -772px",
    centralamerica: "22px -557px",
    southamerica: "47px -338px"
  };
  var $countryselect = $('<div id="countryselect" class="select"><span></span></div>');
  $('.countryfilter').append($countryselect);
  $('#countriesmap area').hover(function(){
    $('.countryfilter img:eq(0)').css({backgroundPosition: areaPos[$(this).attr('id')]});
  },function(){
    $('.countryfilter img:eq(0)').css({backgroundPosition: areaPos[filter.country]});
  }).click(function(evt){
    $('.countryfilter img:eq(1)').css({backgroundPosition: areaPos[$(this).attr('id')]});
    filter.country = $(this).attr('id');
    if (evt.clientX) {
      $('#countryselect i[rel="'+filter.country+'"]').click();
    }
    updateFilter({"country":this.id});
    return false;
  }).each(function(){
    var title = this.getAttribute('title');
    var $i = $('<i></i>').text(title).attr('rel',this.id).click(function(evt){
      $(this).siblings('Span').text($(this).text());
      $('#countriesmap area#'+$(evt.target).attr('rel')).trigger('mouseover').click();
      });
    $countryselect.append($i);
  });
// countries map
  $('#filterbysource i').bind('click',function(){
    $(this).siblings('span').text($(this).text());
  });
  $('#filterbysource cite').bind('click',function(){
    var sources = {};
    $(this).toggleClass('checked');
    if ($('#filterbysource cite:eq(0).checked').length>0) {
      sources.network = true;
    } else {
      sources.network = false;
    }

    if ($('#filterbysource cite:eq(1).checked').length>0) {
      sources.authors = true;
      $('#filterbysource .select').removeClass('disabled');
    } else {
      sources.authors = false;
      $('#filterbysource .select').addClass('disabled');
    }
    updateFilter({sources:sources});
  });
    
});
function updateFilter(param) {
  document.location.href = document.href + '#!/' + param.country;
}
Drupal.behaviors.lastfpnews = function(context){
  $block = $('#block-wtsnz2m-lastfpnews:not(\'.processed\')');
  $block.find('.views-row').each(function(){
    $(this).find('>div:eq(3)').bind('mouseover',function(){
      $(this).append($shareIcons);
    });
  });
  $block.find('a.more').bind('click',function(){
    l = parse_url(this.getAttribute('href'));
    var q = new Array();
    var page = 1;
    var ps = l['query'].split('&');
    for (i=0;i<ps.length;i++) {
      p = ps[i].split('=');
      if (p[0]=='page') {
        page = p[1];
      }
    }
    var datasend = {
      url: l['path'],
      "function":"restonfpblock",
      page: page};
    var pos = $(this).position();
    pos = pos.top + $('html').scrollTop();
    $(this).css('visibility','hidden');
    $.ajax({
      url:'/ajaxget',
      type: 'post',
      data:datasend,
      success: function(data){
        if (data.content && data.content.length>10) {
          var c = $(data.content);
          $block.removeClass('processed').find('>.content').append(c);
          setTimeout(function(){$('html').animate({"scrollTop":pos},2000)},500);
          Drupal.behaviors.lastfpnews();
        } else {
          $('#block-wtsnz2m-lastfpnews a.more').remove();
        }
        return false;
      },
      dataType: 'json'
    });
    return false;
  });
  $block.addClass('processed');
  
}
String.prototype.parse_query = function() {
  var t=new Array();
  for (p in this.split('&')) {
    p = p.split('=');
    t.p[0] = p[1];
  }
  return t;
}
function jscorners() {
  $('<link>').appendTo('head').attr({
  rel: 'stylesheet',
  type: 'text/css',
  href: '/sites/watsnooz.com/themes/wtsnz2/css/corners.css'
  });
  $('#block-views-lastminute-block_1 .views-field-tid-1 a').addClass('corners');
  $('#block-views-lastminute-block_1 .views-field-tid-1 a').addClass('bottomcorners');
  $('.corners,#navigation .active-trail a').each(function() {
    left = $(this).css('paddingLeft').replace('px','');
    border = Math.abs($(this)[0].offsetHeight-$(this)[0].clientHeight) / 2;
    right = this.offsetWidth - left - 2 ;
    top = this.offsetHeight;
    c1 = $(this).css('c1');
    c2 = $(this).css('c2');
    c3 = $(this).css('c3');
    var cTL = $('<b class="c tl"><b class="b1"></b><b class="b2"></b><b class="b3"></b></b>');
    cTL.css({marginLeft: - left - border + "px", marginTop: - border + 'px'});
    var cTR = $('<b class="c tr"><b class="b1"></b><b class="b2"></b><b class="b3"></b></b>');
    cTR.css({marginLeft: right - border + "px", marginTop: - border + 'px'});
    $(this).prepend(cTL,cTR);

    if ($(this).hasClass('bottomcorners')) {
      var cBL = $('<b class="c bl"><b class="b1"></b><b class="b2"></b><b class="b3"></b></b>');
      cBL.css({marginLeft: - left - border + "px", marginTop: top - 2 - border  + "px"});
      var cBR = $('<b class="c br"><b class="b1"></b><b class="b2"></b><b class="b3"></b></b>');
      cBR.css({marginLeft: right + "px", marginTop: top - 2 - border + "px"});
      $(this).prepend(cBL,cBR);
    }
  });
}


WTSNZ = {
"commentsform":function(){
  var $button = $('<button>Comment</button>').click(function(){
    var comment = $('#comment textarea').val();
    if (comment.length<3) {
      return;
    }
    $.ajax({
      type:'post',
      data:{"function":'postcomment',"comment":comment},
      dataType:'json',
      url:'/ajaxget',
      success:function(data) {
        $('#comment').after(data.content.comment);
      }
    });
  });
  var $form = $('<div id="comment"><textarea></textarea></div>').append($button);
  $('#comments h3').after($form);
  return true;
},
}
function parse_url(str,component){var key=['source','scheme','authority','userInfo','user','pass','host','port','relative','path','directory','file','query','fragment'],ini=(this.php_js&&this.php_js.ini)||{},mode=(ini['phpjs.parse_url.mode']&&ini['phpjs.parse_url.mode'].local_value)||'php',parser={php:/^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/};var m=parser[mode].exec(str),uri={},i=14;while(i--){if(m[i]){uri[key[i]]=m[i];}}
if(component){return uri[component.replace('PHP_URL_','').toLowerCase()];}
if(mode!=='php'){var name=(ini['phpjs.parse_url.queryKey']&&ini['phpjs.parse_url.queryKey'].local_value)||'queryKey';parser=/(?:^|&)([^&=]*)=?([^&]*)/g;uri[name]={};uri[key[12]].replace(parser,function($0,$1,$2){if($1){uri[name][$1]=$2;}});}
delete uri.source;return uri;}

// data jquery selector
(function($){var checkUndefined=function(a){return typeof a==='undefined';}
$.expr[':'].data=function(elem,counter,params){if(checkUndefined(elem)||checkUndefined(params))return false;var query=params[3];if(!query)return false;var querySplitted=query.split('=');var selectType=querySplitted[0].charAt(querySplitted[0].length-1);if(selectType=='^'||selectType=='$'||selectType=='!'||selectType=='*'||selectType=='~'){querySplitted[0]=querySplitted[0].substring(0,querySplitted[0].length-1);}
else selectType='=';var dataName=querySplitted[0];var dataNameSplitted=dataName.split('.');var data=$(elem).data(dataNameSplitted[0]);if(checkUndefined(data))return false;if(dataNameSplitted[1]){for(i=1,x=dataNameSplitted.length;i<x;i++){data=data[dataNameSplitted[i]];if(checkUndefined(data))return false;}}
if(querySplitted[1]){var checkAgainst=(data+'');switch(selectType){case'=':return checkAgainst==querySplitted[1];break;case'!':return checkAgainst!=querySplitted[1];break;case'^':return checkAgainst.indexOf(querySplitted[1])===0;break;case'$':return checkAgainst.substr(checkAgainst.length-querySplitted[1].length)===querySplitted[1];break;case'*':return checkAgainst.indexOf(querySplitted[1])!==-1;break;case'~':exp=querySplitted[1].substr(1,querySplitted[1].lastIndexOf('/')-1);modif=querySplitted[1].substr(querySplitted[1].lastIndexOf('/')+1);re=new RegExp(exp,modif);return re.test(checkAgainst);break;default:return false;break;}}
else{return true;}}})(jQuery);

      
var Path={version:"0.8",map:function(a){if(Path.routes.defined.hasOwnProperty(a)){return Path.routes.defined[a]}else{return new Path.core.route(a)}},root:function(a){Path.routes.root=a},rescue:function(a){Path.routes.rescue=a},history:{pushState:function(a,b,c){if(Path.history.supported){if(Path.dispatch(c)){history.pushState(a,b,c)}}else{if(Path.history.fallback){window.location.hash="#"+c}}},popState:function(a){Path.dispatch(document.location.pathname)},listen:function(a){Path.history.supported=!!(window.history&&window.history.pushState);Path.history.fallback=a;if(Path.history.supported){window.onpopstate=Path.history.popState}else{if(Path.history.fallback){for(route in Path.routes.defined){if(route.charAt(0)!="#"){Path.routes.defined["#"+route]=Path.routes.defined[route];Path.routes.defined["#"+route].path="#"+route}}Path.listen()}}}},match:function(a,b){var c={},d=null,e,f,g,h,i;for(d in Path.routes.defined){if(d!==null&&d!==undefined){d=Path.routes.defined[d];e=d.partition();for(h=0;h<e.length;h++){f=e[h];i=a;if(f.search(/:/)>0){for(g=0;g<f.split("/").length;g++){if(g<i.split("/").length&&f.split("/")[g].charAt(0)===":"){c[f.split("/")[g].replace(/:/,"")]=i.split("/")[g];i=i.replace(i.split("/")[g],f.split("/")[g])}}}if(f===i){if(b){d.params=c}return d}}}}return null},dispatch:function(a){var b,c;if(Path.routes.current!==a){Path.routes.previous=Path.routes.current;Path.routes.current=a;c=Path.match(a,true);if(Path.routes.previous){b=Path.match(Path.routes.previous);if(b!==null&&b.do_exit!==null){b.do_exit()}}if(c!==null){c.run();return true}else{if(Path.routes.rescue!==null){Path.routes.rescue()}}}},listen:function(){var a=function(){Path.dispatch(location.hash)};if(location.hash===""){if(Path.routes.root!==null){location.hash=Path.routes.root}}else{Path.dispatch(location.hash)}if("onhashchange"in window){window.onhashchange=a}else{setInterval(a,50)}},core:{route:function(a){this.path=a;this.action=null;this.do_enter=[];this.do_exit=null;this.params={};Path.routes.defined[a]=this}},routes:{current:null,root:null,rescue:null,previous:null,defined:{}}};Path.core.route.prototype={to:function(a){this.action=a;return this},enter:function(a){if(a instanceof Array){this.do_enter=this.do_enter.concat(a)}else{this.do_enter.push(a)}return this},exit:function(a){this.do_exit=a;return this},partition:function(){var a=[],b=[],c=/\(([^}]+?)\)/g,d,e;while(d=c.exec(this.path)){a.push(d[1])}b.push(this.path.split("(")[0]);for(e=0;e<a.length;e++){b.push(b[b.length-1]+a[e])}return b},run:function(){var a=false,b,c,d;if(Path.routes.defined[this.path].hasOwnProperty("do_enter")){if(Path.routes.defined[this.path].do_enter.length>0){for(b=0;b<Path.routes.defined[this.path].do_enter.length;b++){c=Path.routes.defined[this.path].do_enter[b]();if(c===false){a=true;break}}}}if(!a){Path.routes.defined[this.path].action()}}};