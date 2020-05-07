function get_challenge_callback(challenge) {

  var maxTime = challenge['Time'];
  var locations = challenge['Challenge_Locations'];

  // Config
  var game = {
    round: {
      id: 0,
      score: {
        final: 0,
        rewarded: 0
      }
    },
    totalScore: 0,
    timedOut: false,
    distance: 0
  };

  var round = game.round.id;
  var points = game.round.score.rewarded;
  var roundScore = game.round.score.final;
  var totalScore = game.totalScore;
  var distance = game.distance;
  window.loc = locations[game.round.id];

  // Init maps
  svinitialize();
  mminitialize();

  // Scoreboard & Guess button event
  // Init Timer
  resetTimer();

  // Timer
  function timer() {
    count = count - 1;
    if (count <= 0) {
      console.log('finished');
      game.timedOut = true;
      endRound();
      clearInterval(counter);
    }
    $("#timer").text(count);
  };

  // Guess Button
  $('#guessButton').click(function() {
    endRound();
  });

  // End of round continue button click
  $('#roundEnd').on('click', '.closeBtn', function() {
    window.guessLatLng = '';
    game.timedOut = false;
    round++;
    $('#roundEnd').fadeOut(500);
    if(round >= locations.length){
      return endGame();
    }
    window.loc = locations[round];
    // Reload maps to refresh coords
    svinitialize();
    mminitialize();

    // Reset Timer
    resetTimer();
  });
  $('#roundEnd').on('click', '.refreshBtn', renderOtherGuesses);

  // End of game 'play again' button click
  $('#endGame').on('click', '.playAgain', function() {
    window.location.reload();
  });

  // Functions
  // Reset Timer
  function resetTimer() {
    count = maxTime;
    counter = setInterval(timer, 1000);
  }

  // Calculate distance between points function
  function calcDistance(fromLat, fromLng, toLat, toLng) {
    return google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(fromLat, fromLng), new google.maps.LatLng(toLat, toLng));
  }

  function doGuess() {
    if (!game.timedOut) {

      // Stop Counter
      clearInterval(counter);

      // Calculate distance between points, and convert to kilometers
      distance = Math.ceil(calcDistance(window.loc['Lat'], window.loc['Long'], window.guessLatLng.lat(), window.guessLatLng.lng()) / 1000);
      window.guessArray = [window.guessLatLng.lat(), window.guessLatLng.lng()];

      // Calculate points awarded via guess proximity
      function inRange(x, min, max) {
        return (min <= x && x <= max);
      }

      // Real basic point thresholds depending on kilometer distances
      if (inRange(distance, 1, 2)) {
        points = 10000;
      } else if (inRange(distance, 3, 10)) {
        points = 7000;
      } else if (inRange(distance, 11, 50)) {
        points = 4000;
      } else if (inRange(distance, 51, 200)) {
        points = 3000;
      } else if (inRange(distance, 201, 500)) {
        points = 2000;
      } else if (inRange(distance, 501, 800)) {
        points = 1000;
      } else if (inRange(distance, 801, 1300)) {
        points = 500;
      } else if (inRange(distance, 1301, 1600)) {
        points = 400;
      } else if (inRange(distance, 1601, 2300)) {
        points = 300;
      } else if (inRange(distance, 2301, 2800)) {
        points = 200;
      } else if (inRange(distance, 2801, 3200)) {
        points = 100;
      } else if (inRange(distance, 3200, 4500)) {
        points = 50;
      } else if (inRange(distance, 4501, 6000)) {
        points = 25;
      } else {
        points = 0;
      }
    } else {
      //timed out
      window.guessArray = [0, 0];
      points = 0;
      distance = -1;
    }
    
  }

  function endRound() {
    doGuess();
    $.ajax({
      url: "http://" + window.location.host + "/guess",
      method: "POST",
      headers: {"X-CSRFToken": Cookies.get('csrftoken')},
      contentType: 'application/json',
      data: JSON.stringify({
        "Challenge_Location_ID": window.loc['Challenge_Location_ID'],
        "Lat": window.guessArray[0],
        "Long": window.guessArray[1],
        "Score": points,
        "Distance": distance
      }),
      error: function (result) {
        console.log(result);
      }
    });
    roundScore = points;
    totalScore = totalScore + points;

    $('.round').html('Current Round: <b>' + round + '/' + locations.length + '</b>');
    $('.roundScore').html('Last Round Score: <b>' + roundScore + '</b>');
    $('.totalScore').html('Total Score: <b>' + totalScore + '</b>');

    // If distance is undefined, that means they ran out of time and didn't click the guess button
    $('#roundEnd').html('<p>Your guess was<br/><strong><h1>' + distance + '</strong>km</h1> away from the actual location.<br/><div id="roundMap"></div><br/> You have scored<br/><h1>' + roundScore + ' points</h1> this round!<br/><br/><button class="btn btn-primary closeBtn" type="button">Continue</button><button class="btn btn-secondary refreshBtn" type="button">Refresh Map</button></p></p>');
    $('#roundEnd').fadeIn();

    // Reset Params
    rminitialize();
  }

  function endGame() {
    $('#miniMap, #pano, #guessButton, #scoreBoard').hide();
    $('#endGame').html('<h1>Congrats!</h1><h2>Your final score was:</h2><h1>' + totalScore + '!</h1><br/>Share this on:<br/><br/><a class="btn" href="http://www.facebook.com/sharer.php?s=100&p[title]=' + encodeURIComponent('Whereami') + '&p[summary]=' + encodeURIComponent('I just scored ' + totalScore + ' playing Whereami!') + '&p[url]=' + encodeURIComponent('https://github.com/webdevbrian/whereami') + '" target="_blank">Facebook</a> <a class="btn" href="https://twitter.com/intent/tweet?text=I+just+scored+' + totalScore + '+playing+whereami+by+@phrozen755,+based+off+of+geoguessr%21&url=https://github.com/webdevbrian/whereami" target="_blank">Twitter</a></p><br/><button class="btn btn-large btn-success playAgain" type="button">Play Again?</button>');
    $('#endGame').fadeIn(500);
    // We're done with the game
    window.finished = true;
  }
}

$(document).ready(function() {
  var challenge_id = new URLSearchParams(location.search).get('Challenge_ID');
  $.ajax({
    url: "http://" + window.location.host + "/challenge",
    data: {
      "Challenge_ID": challenge_id
    },
    success: get_challenge_callback,
    error: function (result) {
      console.log(result);
    }
  });
});
