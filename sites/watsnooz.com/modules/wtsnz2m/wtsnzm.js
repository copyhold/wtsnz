$(function(){
  getWeather(null);
  if (document.getElementById('searchcity')) {
    $('#searchcity').autocomplete('/getcityauto', { minChars: 3 });
  }
  
  $('#block-wtsnz2m-categories a.active').parent().addClass('active');
});


function getWeather(city) {
  if (!city) {
    var city = 'current';
  } else { 
    var city = city;
  }
  $.getJSON('/ajaxweather',{'var':Math.random(),'city': city},function(data){
    var str = '<div id="current" style="background-image:url(/'+Drupal.settings.weather.iconspath + '/normal/' + data.data.current_condition[0].weatherIconUrl[0].value + ');"><i>' + data.data.current_condition[0].temp_C+ '&#176;</i><b>'+data.location.city+'<u>'+data.data.current_condition[0].weatherDesc[0].value+'</u></b>';
    $('#weather').html(str);
    for (date in data.data.weather) {
      date = data.data.weather[date];
      out = '<div>';
      dt = new Date(date.date).getDay();
      $('#weather').append('<span><b>' + Drupal.t(daysOfWeek[date.dayofweek]) + '</b><img src="/'+Drupal.settings.weather.iconspath + '/small/' + date.weatherIconUrl[0].value+'" /><u>'+date.tempMaxC+'&#176;</u><i>'+date.tempMinC+'&#176;</i></span>');
//      day = day.getDay();
    }
  });
}
function validEmail(email) {
  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if(reg.test(email) == false) {
    return false;
  } else return true;
}
var daysOfWeek = new Array('Sun','Mon','Tue','Wed','Thu','Fri','Sat');
