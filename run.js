'use strict'

function formatThousands(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function makeWaitFun()
{
  let currUrl = null;
  return function() {
    let url = window.location.href;
    if (currUrl != url) {
      getWindowVars();
      currUrl = url;
    }
  }
}

setInterval(makeWaitFun(), 200);

function getUser()
{
  var re = /user\/([^\/]+)\/?/;
  return re.exec(window.location.href)[1];
}


function getWindowVars() {
      var user = getUser();
      var api = `https://ratings.tankionline.com/api/eu/profile/?user=${user}&lang=ru`
      $.get(api, function(data) {
          if (data.responseType == "OK") {
              renderData(data.response);
              clearInterval(intervalId);
          }
      });
}

var windowVars = null;
var $overlay = $('<div id="js-overlay_wrapper" class="overlay_wrapper" style="display:none;"></div>').prependTo('body');

var intervalId;

$overlay.on('init', function () {
  if ($(this).is(':visible')) {
    $overlay.hide();
  } else {
    $overlay.show();
  }
});

function w(row) {
  return "<div>" + row + "</div>";
}

function toHours(time)
{
	return Math.round (time / 1000 / 3600);
}

function addItemTime(map, item)
{
  if (map.has(item.name)) {
    map.set(item.name, map.get(item.name) + item.timePlayed);
  } else {
    map.set(item.name, item.timePlayed);
  } 
}

function renderData(data) {
  $overlay.html('');
  $overlay.append(w(data.name));
    
  var turretTitle = 'Универсал';
  var postfix = 'неопределившийся';
  var topTurret = null;
  var topHull = null;
  var kdTitle = 'мясной'; 
  var hullTitle = 'Смотрящий';
  var modeTitle = 'на Точку';
  
  var score_kills = (data.score / data.kills).toFixed(1) * 1;
  var score_kills_verbal = 'Опыт/киллы: ' + score_kills + ' ';
  if (score_kills < 10) {
    score_kills_verbal += '[олдскул]';
  } else if (score_kills >= 10 && score_kills < 15) {
    score_kills_verbal += '[киллер]';
  } else if (score_kills >= 15 && score_kills < 20) {
    score_kills_verbal += '[флаговоз]';
  } else if (score_kills >= 20 && score_kills < 25) {
    score_kills_verbal += '[изевод/точкодрот]';
  } else {
    score_kills_verbal += '[качер]';
  }
  $overlay.append(w(score_kills_verbal));


  var kills_deaths = (data.deaths > 0 ? (data.kills / data.deaths).toFixed(2) * 1 : 'inf');
  var kills_deaths_verbal = 'Убил/подбит: ';
  if (kills_deaths === 'inf') {
    kills_deaths_verbal += ' &infin; [Godmode_on]';
  } else {
    kills_deaths_verbal += kills_deaths + ' ';
    if (kills_deaths < 0.8) {
      kills_deaths_verbal += '[дно таба]';
      kdTitle = 'Жидкий';
    } else if (kills_deaths >= 0.8 && kills_deaths < 1) {
      kills_deaths_verbal += '[середина таба]';
      kdTitle = 'Мясной';
    } else if (kills_deaths >= 1 && kills_deaths < 2) {
      kills_deaths_verbal += '[трудяга]';
      kdTitle = 'Бойцовый';
    } else if (kills_deaths >= 2 && kills_deaths < 3) {
      kills_deaths_verbal += '[нагибатор]';
      kdTitle = 'Нагибучий';
    } else {
      kills_deaths_verbal += '[убернагибатор]';
      kdTitle = 'Убернагибучий';
    }
  }
  $overlay.append(w(kills_deaths_verbal));

  var cry_score = (data.earnedCrystals / data.score).toFixed(1) * 1;
  var cry_scores_verbal = 'Кристаллы/опыт: ' + cry_score + ' ';
  if (cry_score < 1) {
    cry_scores_verbal += '[грустнявки]';
  } else if (cry_score >= 1 && cry_score < 1.3) {
    cry_scores_verbal += '[пофигист]';
  } else if (cry_score >= 1.3 && cry_score < 1.5) {
    cry_scores_verbal += '[игрок]';
  } else if (cry_score >= 1.5 && cry_score < 1.8) {
    cry_scores_verbal += '[накопитель]';
  } else {
    cry_scores_verbal += '[барыга]';
  }
  $overlay.append(w(cry_scores_verbal));

  var total_time = data.turretsPlayed.reduce((acc, turr) => acc + turr.timePlayed, 0);

  let turret_verbal_pro = new Map([
    ["Огнемёт", "Пироманьяк"],
    ["Молот", "Кузнец"],
    ["Фриз", "Дед Мороз"],
    ["Изида", "Доктор"],
    ["Твинс", "Дискотека"],
    ["Рикошет", "Апельсин"],
    ["Гром", "Громовержец"],
    ["Вулкан", "Катаклизм"],
    ["Смоки", "Дятел"],
    ["Шафт", "Циклоп"],
    ["Рельса", "Лучемёт"],
    ["Страйкер", "Подрывник"],
    ["Магнум", "Терминатор"], // Лучемёт в оригинальном коде был) Копипаст - зло
  ]);

  let turret_verbal_noob = new Map([
    ["Огнемёт", "Жиговод"],
    ["Молот", "Молотобоец"],
    ["Фриз", "Фризовод"],
    ["Изида", "Изидер"],
    ["Твинс", "Твинсовод"],
    ["Рикошет", "Рикошетчик"],
    ["Гром", "Громовод"],
    ["Вулкан", "Вулканолог"],
    ["Смоки", "Смоковод"],
    ["Шафт", "Шафтовод"],
    ["Рельса", "Рельсовод"],
    ["Страйкер", "Ракетомёт"],
    ["Магнум", "Смерть-С-Небес"], 
  ]);

  var lightHulls = ["Васп", "Хорнет"];
  var mediumHulls = ["Викинг", "Хантер", "Диктатор"];
  var heavyHulls = ["Титан", "Мамонт"];

  var lightHullsTimePlayed = 0;
  var mediumHullsTimePlayed = 0;
  var heavyHullsTimePlayed = 0;
  var topHullTimePlayed = 0;
  var topHull = null;
  
  if (total_time > 0) {
    let turrets_time = new Map();
    for (let turret of data.turretsPlayed) {
      if (turret.timePlayed > 0) {
        addItemTime(turrets_time, turret);
      }
    }
    turrets_time = new Map([...turrets_time.entries()].sort((a, b) => b[1] - a[1])); // Sort by time

    $overlay.append(w('<hr>'));
    $overlay.append(w('Игровое время на пушках:'));
    for (let [name, time] of turrets_time) {
      $overlay.append(w(name + ': ' + ((time / total_time) * 100).toFixed(1) + '%'));
      if (time / total_time > 0.8)
      {
        topTurret = name;
        turretTitle = turret_verbal_pro.get(name);
      } else if (time / total_time > 0.5)
      {
        topTurret = name;
        turretTitle = turret_verbal_noob.get(name);
      } 
    }

    let hulls_time = new Map();
    for (let hull of data.hullsPlayed) {
      if (hull.timePlayed > 0) {
        addItemTime(hulls_time, hull);
        if (lightHulls.indexOf(hull.name) != -1) {
          lightHullsTimePlayed += hull.timePlayed;
        } else if (mediumHulls.indexOf(hull.name) != -1) {
          mediumHullsTimePlayed += hull.timePlayed;
        } else if (heavyHulls.indexOf(hull.name) != -1) {
          heavyHullsTimePlayed += hull.timePlayed;
        }
      }
    }
    hulls_time = new Map([...hulls_time.entries()].sort((a, b) => b[1] - a[1])); // Sort by time

    $overlay.append(w('<hr>'));
    $overlay.append(w('Игровое время на корпусах:'));
    for (let [name, time] of hulls_time) {
      $overlay.append(w(name + ': ' + ((time / total_time) * 100).toFixed(1) + '%'));
      if (topHullTimePlayed < time) {
        topHullTimePlayed = time;
        topHull = name;
      }
    }
  }

  $overlay.append(w('<hr>'));

  if (lightHullsTimePlayed > mediumHullsTimePlayed && lightHullsTimePlayed > heavyHullsTimePlayed) {
    hullTitle = 'Летящий';
  } else if (mediumHullsTimePlayed > lightHullsTimePlayed && mediumHullsTimePlayed > heavyHullsTimePlayed) {
    hullTitle = 'Спешащий';
  } else if (heavyHullsTimePlayed > lightHullsTimePlayed && heavyHullsTimePlayed > mediumHullsTimePlayed) {
    hullTitle = 'Ползущий';
  }

  var topModePlayed = null;
  var modeMostPlayedTime = 0;
  var modesPlayed = [];
  for (let mode of data.modesPlayed) {
    modesPlayed[mode.type] = mode.timePlayed;
    if (modeMostPlayedTime < mode.timePlayed) {
      topModePlayed = mode.type;
      modeMostPlayedTime = mode.timePlayed;
    }    
  }

  //var topModePlayed = modesPlayed.indexOf(Math.max.apply(Math, modesPlayed));  

  let modes_verbal = new Map([
    ["CP", "На Точку"],
    ["DM", "За Фрагом"],
    ["CTF", "За Флагом"],
    ["TDM", "От Смерти"],
    ["AS", "К Победе"], // Не, ну а куда может спешить ASL'шник???
    ["RUGBY", "За Мячом"],
    ["JGR", "За боссом"]
  ]);

  modeTitle = modes_verbal.has(topModePlayed) ? modes_verbal.get(topModePlayed) : "Куда-то";

  var dd = 0;
  dd = data.suppliesUsage.filter((suppl) => suppl.id == 10007271)[0].usages; // DD ID

  if (dd > 0) {
    var dd_per_hour = (dd / (total_time / 3600000)).toFixed(1) * 1; //3600000 ms = 1 hour
    var dd_per_hour_verbal = 'ДД в час: ' + dd_per_hour + ' ';
    if (dd_per_hour < 5) {
      dd_per_hour_verbal += '[ББП-шник]';
	    postfix += 'Без Припасов';
    } else if (dd_per_hour >= 5 && dd_per_hour < 10) {
      dd_per_hour_verbal += '[скупердяй]';
	    postfix += 'Без Припасов';
    } else if (dd_per_hour >= 10 && dd_per_hour < 20) {
      dd_per_hour_verbal += '[ответственный]';
	    postfix += 'Ответственный';
    } else if (dd_per_hour >= 20 && dd_per_hour < 40) {
      dd_per_hour_verbal += '[наркобоец]';
	    postfix += 'Наркозависимый';
    } else {
      dd_per_hour_verbal += '[мизантроп]';
	    postfix += 'Ненавидимый Врагами';
    }
    $overlay.append(w(dd_per_hour_verbal));
  }
  
  postfix += ' ';
  if (data.caughtGolds > 0) {
    var time_golds = ((total_time / 3600000) / data.caughtGolds).toFixed(1) * 1; //3600000 ms = 1 hour
    var time_golds_verbal = 'Голд за время, час.: ' + time_golds + ' ';
    if (time_golds < 2) {
      time_golds_verbal += '[матёрый]';
      modeTitle = 'За Голдом';
    } else if (time_golds >= 2 && time_golds < 5) {
      time_golds_verbal += '[голдолов]';
    } else if (time_golds >= 5 && time_golds < 10) {
      time_golds_verbal += '[везунчик]';
    } else if (time_golds >= 10 && time_golds < 20) {
      time_golds_verbal += '[равнодушный]';
    } else {
      time_golds_verbal += '[презирающий]';
    }
    $overlay.append(w(time_golds_verbal));
  }
  
  //Уникалочки
  //Для ХРельщиков
  if (topHull == "hornet" && topHullTimePlayed / total_time > 0.5 && topTurret == "Рельса") {
    turretTitle = 'ХРюн';
    hullTitle = 'Скользящий';
  }
  
  var prefix = kdTitle + ' ' + turretTitle;
  var postfix = hullTitle + ' ' + modeTitle; 
 
  var caption = $("a[class='user-info-panel__link']");
  var name = getUser();
      
  let icon = caption.html().slice(0, -1*name.length);
  prefix = '<span style="color: #dddddd">' + prefix + '</span>' + ' ';
  postfix = ' <span style="color: #dddddd">' + postfix + '</span>';
  caption.html(icon + prefix + name + postfix);
}