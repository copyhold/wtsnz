var filter = {},
    Filter = new Filter();
    $shareIcons = null,
    evals=[];

$(function(){
  $.easing.def = 'easeInQuart';

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
    Filter.set({"country":this.id});
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
    Filter.set({authors:$(this).text()});
  });
  $('#filterbysource cite').bind('click',function(){
    if ($(this).hasClass('checked')) return;
    $(this).addClass('checked').siblings('CITE').removeClass('checked');
    var sources = {};
    if ($('#filterbysource cite:eq(0).checked').length>0) {
      sources.network = true;
    } else {
      sources.network = false;
    }

    if ($('#filterbysource cite.checked[rel="network"]').length>0) {
      sources.authors = false;
      $('#filterbysource .select').addClass('disabled');
      Filter.set({sources:$(this).attr('rel'),authors:null})
    } else {
      sources.authors = true;
      $('#filterbysource .select').removeClass('disabled');
      Filter.set({sources:$(this).attr('rel')});
    }
  });
  $('#block-wtsnz2m-filter .footer strong').bind('click',function(){
    Filter.run();
  })
});
function Filter() {
  var filter = {url:document.location.pathname};
  return {
    set:function(param){
      
      if (param.country)  filter.region  = param.country;
      if (param.sources)  filter.sources = param.sources;
      if (param.authors)  filter.authors = param.authors;
    },
    run:function(){
      filter['function'] = "getfilteredcontent";
      $('#content').addClass('wait');
      var t =  $('#block-views-lastminute-block_1').position();
      $('html').animate({scrollTop:t.top},1300);
      $.ajax({
        dataType:'json',
        type:'post',
        url:'/ajaxget',
        data:filter,
        success:function(data){
          $('#block-views-lastminute-block_1').find('.content').replaceWith($(data.content.lastminute).find('.content'));
          $('#content').removeClass('wait');
        }
      })
    }
  };
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

      

jQuery.easing['jswing']=jQuery.easing['swing'];jQuery.extend(jQuery.easing,{def:'easeOutQuad',swing:function(x,t,b,c,d){return jQuery.easing[jQuery.easing.def](x,t,b,c,d);},easeInQuad:function(x,t,b,c,d){return c*(t/=d)*t+b;},easeOutQuad:function(x,t,b,c,d){return-c*(t/=d)*(t-2)+b;},easeInOutQuad:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t+b;return-c/2*((--t)*(t-2)-1)+b;},easeInCubic:function(x,t,b,c,d){return c*(t/=d)*t*t+b;},easeOutCubic:function(x,t,b,c,d){return c*((t=t/d-1)*t*t+1)+b;},easeInOutCubic:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t+b;return c/2*((t-=2)*t*t+2)+b;},easeInQuart:function(x,t,b,c,d){return c*(t/=d)*t*t*t+b;},easeOutQuart:function(x,t,b,c,d){return-c*((t=t/d-1)*t*t*t-1)+b;},easeInOutQuart:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t+b;return-c/2*((t-=2)*t*t*t-2)+b;},easeInQuint:function(x,t,b,c,d){return c*(t/=d)*t*t*t*t+b;},easeOutQuint:function(x,t,b,c,d){return c*((t=t/d-1)*t*t*t*t+1)+b;},easeInOutQuint:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t*t+b;return c/2*((t-=2)*t*t*t*t+2)+b;},easeInSine:function(x,t,b,c,d){return-c*Math.cos(t/d*(Math.PI/2))+c+b;},easeOutSine:function(x,t,b,c,d){return c*Math.sin(t/d*(Math.PI/2))+b;},easeInOutSine:function(x,t,b,c,d){return-c/2*(Math.cos(Math.PI*t/d)-1)+b;},easeInExpo:function(x,t,b,c,d){return(t==0)?b:c*Math.pow(2,10*(t/d-1))+b;},easeOutExpo:function(x,t,b,c,d){return(t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b;},easeInOutExpo:function(x,t,b,c,d){if(t==0)return b;if(t==d)return b+c;if((t/=d/2)<1)return c/2*Math.pow(2,10*(t-1))+b;return c/2*(-Math.pow(2,-10*--t)+2)+b;},easeInCirc:function(x,t,b,c,d){return-c*(Math.sqrt(1-(t/=d)*t)-1)+b;},easeOutCirc:function(x,t,b,c,d){return c*Math.sqrt(1-(t=t/d-1)*t)+b;},easeInOutCirc:function(x,t,b,c,d){if((t/=d/2)<1)return-c/2*(Math.sqrt(1-t*t)-1)+b;return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b;},easeInElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4;}
else var s=p/(2*Math.PI)*Math.asin(c/a);return-(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;},easeOutElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4;}
else var s=p/(2*Math.PI)*Math.asin(c/a);return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b;},easeInOutElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d/2)==2)return b+c;if(!p)p=d*(.3*1.5);if(a<Math.abs(c)){a=c;var s=p/4;}
else var s=p/(2*Math.PI)*Math.asin(c/a);if(t<1)return-.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b;},easeInBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*(t/=d)*t*((s+1)*t-s)+b;},easeOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b;},easeInOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b;},easeInBounce:function(x,t,b,c,d){return c-jQuery.easing.easeOutBounce(x,d-t,0,c,d)+b;},easeOutBounce:function(x,t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b;}else if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+.75)+b;}else if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b;}else{return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b;}},easeInOutBounce:function(x,t,b,c,d){if(t<d/2)return jQuery.easing.easeInBounce(x,t*2,0,c,d)*.5+b;return jQuery.easing.easeOutBounce(x,t*2-d,0,c,d)*.5+c*.5+b;}});