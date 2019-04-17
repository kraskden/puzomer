function formatThousands(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function getWindowVars() {
      var api = 'https://ratings.tankionline.com/api/eu/profile/?user=fizzika&lang=ru';
      $.get(api, function(data) {
          console.log(data);
          if (data.responseType == "OK") {
              renderData(data.response);
              clearInterval(intervalId);
          }
      });
}

function flipArray(trans) {
  var key, tmp_ar = {};
  for (key in trans) {
    if (trans.hasOwnProperty(key)) {
      tmp_ar[trans[key]] = key;
    }
  }
  return tmp_ar;
}

function getItems() {  
  return flipArray(tankiItems);
}

var windowVars = null;
var $overlay = $('<div id="js-overlay_wrapper" class="overlay_wrapper" style="display:none;"></div>').prependTo('body');

var intervalId = setInterval(getWindowVars, 200);
var timeoutId = setTimeout(function() { clearInterval(intervalId) }, 3000 );

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

  var total_time = 0;
  for (var i = 0; i < data.turretsPlayed.length; i++) {
    total_time += data.turretsPlayed[i].timePlayed;
  }

  
  if (total_time > 0) {
    $overlay.append(w('Игровое время на пушках:'));
    for (var i = 0; i < data.turretsPlayed.length; i++) {
      var turret = data.turretsPlayed[i];
      if (turret.timePlayed > 0) {
        $overlay.append(w(turret.name + ': ' + ((turret.timePlayed / total_time) * 100).toFixed(1) + '%'));
        
        if (turret.timePlayed / total_time > 0.8)
        {
          topTurret = turret.name;
          switch (turret.name) {
          case "Огнемёт":
            turretTitle = "Пироманьяк";
            break;
          case "Молот":
            turretTitle = "Кузнец";
            break;
          case "Фриз":
            turretTitle = "Дед Мороз";
            break;
          case "Изида":
            turretTitle = "Доктор";
            break;
          case "Твинс":
            turretTitle = "Дискотека";
            break;
          case "Рикошет": 
            turretTitle = "Апельсин";
            break;
          case "Гром":
            turretTitle = "Громовержец";
            break;
          case "Вулкан":
            turretTitle = "Катаклизм";
            break; 
          case "Смоки":
            turretTitle = "Дятел";
            break;
          case "Шафт":
            turretTitle = "Циклоп";
            break;
          case "Рельса":
            turretTitle = "Лучемёт";
            break;
          case "Страйкер":
            turretTitle = "Подрывник";
            break; 
          case "Магнум":
            turretTitle = "Лучемёт";
            break;           
          }            
        } else if (turret.timePlayed / total_time > 0.5)
        {
          topTurret = turret.name;
          switch (turret.name) {
            case "Огнемёт":
              turretTitle = "Жиговод";
              break;
            case "Молот":
              turretTitle = "Молотобоец";
              break;
            case "Фриз":
              turretTitle = "Фризовод";
              break;
            case "Изида":
              turretTitle = "Изидер";
              break;
            case "Твинс":
              turretTitle = "Твинсовод";
              break;
            case "Рикошет":
              turretTitle = "Рикошетчик";
              break;
            case "Гром":
              turretTitle = "Громовод";
              break;
            case "Вулкан":
              turretTitle = "Вулканолог";
              break; 
            case "Смоки":
              turretTitle = "Смоковод";
              break;
            case "Шафт":
              turretTitle = "Шафтовод";
              break;
            case "Рельса":
              turretTitle = "Рельсовод";
              break;   
            case "Страйкер":
              turretTitle = "Ракетомет";
              break; 
            case "Магнум":
              turretTitle = "Смерть-С-Небес";
              break;              
          }
        }
      }
    }
  }

  var lightHulls = ["wasp", "hornet"];
  var mediumHulls = ["viking", "hunter", "dictator"];
  var heavyHulls = ["titan", "mammoth"];
  
  var lightHullsTimePlayed = 0;
  var mediumHullsTimePlayed = 0;
  var heavyHullsTimePlayed = 0;
  var topHullTimePlayed = 0;
  var topHull = null;
  /*
  var tankiItemsMap = flipArray(retrieveWindowVariables(["tankiItems"]).tankiItems);
  
  if (total_time > 0) {
    $overlay.append(w('Игровое время на корпусах:'));
    for (var i = 0; i < data.hullsPlayed.length; i++) {
      var hull = data.hullsPlayed[i];
      if (hull.timePlayed > 0) {
        $overlay.append(w(hull.name + ': ' + ((hull.timePlayed / total_time) * 100).toFixed(1) + '%'));
        if (topHullTimePlayed < hull.timePlayed) {
          topHullTimePlayed = hull.timePlayed;
          topHull = tankiItemsMap[hull.id].split('_')[0];
        }
        
        if (lightHulls.indexOf(tankiItemsMap[hull.id].split('_')[0]) != -1) {
          lightHullsTimePlayed += hull.timePlayed;
        } else if (mediumHulls.indexOf(tankiItemsMap[hull.id].split('_')[0]) != -1) {
          mediumHullsTimePlayed += hull.timePlayed;
        } else if (heavyHulls.indexOf(tankiItemsMap[hull.id].split('_')[0]) != -1) {
          heavyHullsTimePlayed += hull.timePlayed;
        }
      }
    }
  }
  
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
  for (var i = 0; i < data.modesPlayed.length; i++) {
    modesPlayed[data.modesPlayed[i].type] = data.modesPlayed[i].timePlayed;
    if (modeMostPlayedTime < data.modesPlayed[i].timePlayed) {
      topModePlayed = data.modesPlayed[i].type;
      modeMostPlayedTime = data.modesPlayed[i].timePlayed;
    }    
  }
  
    
  //var topModePlayed = modesPlayed.indexOf(Math.max.apply(Math, modesPlayed));  
  switch (topModePlayed) {
    case "CP":
      modeTitle = 'На Точку';
      break;
    case "DM":
      modeTitle = 'За Фрагом';
      break;
    case "CTF":
      modeTitle = 'За Флагом';
      break;
    case "TDM":
      modeTitle = 'От Смерти';
    default:
      modeTitle = "Куда-то"
      break;
  }
  
  
  var dd = 0;
  for (var i = 0; i < data.suppliesUsage.length; i++) {
    if (data.suppliesUsage[i].id == 10007271) { //DD id
      dd = data.suppliesUsage[i].usages;
    }
  }
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
      //postfix += 'Голдбил';
      modeTitle = 'За Голдом';
    } else if (time_golds >= 2 && time_golds < 5) {
      time_golds_verbal += '[голдолов]';
      //postfix += 'Голдолюб';
      //modeTitle = 'За Голдом';
    } else if (time_golds >= 5 && time_golds < 10) {
      time_golds_verbal += '[везунчик]';
      //postfix += 'Везунчик';
    } else if (time_golds >= 10 && time_golds < 20) {
      time_golds_verbal += '[равнодушный]';
      //postfix += 'Равнодушный';
    } else {
      time_golds_verbal += '[презирающий]';
      //postfix += 'Презирающий';
    }
    $overlay.append(w(time_golds_verbal));
  }
  
  $overlay.append(w('Всего кристаллов: ' + formatThousands(data.earnedCrystals)));
  $overlay.append(w('Всего голдов: ' + formatThousands(data.caughtGolds)));
  $overlay.append(w('Игровое время, час.: ' + formatThousands((total_time / 3600000).toFixed(1) * 1)));
  

  //"Рейтинг Евы"
  var supplyUsage = 0;
  for (var i = 0; i < data.suppliesUsage.length; i++) {
    supplyUsage += data.suppliesUsage[i].usages;
  }
  
  var evaScoreValue = supplyUsage / data.rank + kills_deaths * 1000 + toHours(total_time) + data.earnedCrystals / 10000;
  evaScoreValue = formatThousands(Math.round(evaScoreValue));
  //уникалочки по никам
  switch (data.name) {
	  case "Serene":
	  evaScoreValue = '<span style="color:#c8a2c8">over 9k</span>';
	  break;
  }
  
  var evaScore = '<tr><td data-loc="text_pos_dmt" class="first-column">Рейтинг <a href="http://ru.tankiforum.com/profile/625-eva/">Евы</a></td><td id="dmt_pos">—</td><td id="dmt_value">' + evaScoreValue + '</td><td id="dmt_prev">—</td></tr>';
  $(".ratings_table tr:last").after(evaScore);
  
  */
  $username = $("h1[class='user_name']");
  
  //Уникалочки
  //Для ХРельщиков
  if (topHull == "hornet" && topHullTimePlayed / total_time > 0.5 && topTurret == "Рельса") {
    turretTitle = 'ХРюн';
    hullTitle = 'Скользящий';
  }
  
  var prefix = kdTitle + ' ' + turretTitle;
  var postfix = hullTitle + ' ' + modeTitle; 
  
  
  prefix = '<span style="color: #dddddd">' + prefix + '</span>' + ' ';
  postfix = ' <span style="color: #dddddd">' + postfix + '</span>';
  $username.prepend(prefix).append(postfix);
}