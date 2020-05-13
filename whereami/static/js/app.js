var game;
function get_challenge_callback(challenge) {

  var maxTime = challenge['Time'];
  var locations = challenge['Challenge_Locations'];
  var ignored_count = challenge['Ignored_Count'];
  var challenge_id = challenge["Challenge_ID"];
  if(locations.length === 0) {
    $('#miniMap, #pano, #guessButton, #scoreBoard, #timer').hide();
    $('#endGame').html('<h1>You already beat this Map!</h1><a class="btn btn-large btn-primary" href="/">Main Menu</a><p></p>' +
        `<a class="btn btn-large btn-secondary mx-2" href="/startChallenge?Challenge_ID=${ challenge_id }&ignore_previous_guesses=true">Replay(unranked)</a>` +
        `<a class="btn btn-large btn-success mx-2" href="/challengeOverview?Challenge_ID=${ challenge_id }">Overview</a></p>`);
    $('#endGame').fadeIn(500);
    // We're done with the game
    window.finished = true;
    return;
  }
  game = {
    round: {
      id: 0,
      score: {
        final: 0,
        rewarded: 0
      }
    },
    totalScore: 0,
    timedOut: true,
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
    game.timedOut = true;
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
      window.guessArray = [window.guessLatLng.lat(), window.guessLatLng.lng()];
    } else {
      //timed out
      window.guessArray = [0, 0];
    }

    // Calculate distance between points, and convert to kilometers
    distance = Math.ceil(calcDistance(window.loc['Lat'], window.loc['Long'], window.guessArray[0], window.guessArray[1]) / 1000);
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

  }

  function endRound() {
    doGuess();
    $.ajax({
      url: "/guess",
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
    var realRound = round + ignored_count + 1;

    $('.round').html('Current Round: <b>' + realRound + '/' + locations.length + '</b>');
    $('.roundScore').html('Last Round Score: <b>' + roundScore + '</b>');
    $('.totalScore').html('Total Score: <b>' + totalScore + '</b>');

    // If distance is undefined, that means they ran out of time and didn't click the guess button
    $('#roundEnd').html('<p>Your guess was<br/><strong><h1>' + distance + '</strong>km</h1> away from the actual location.<br/><div id="roundMap"></div><br/> You have scored<br/><h1>' + roundScore + ' points</h1> this round!<br/><br/><button class="btn btn-primary closeBtn" type="button">Continue</button><button class="btn btn-secondary refreshBtn mx-2" type="button">Refresh Map</button></p></p>');
    $('#roundEnd').fadeIn();

    // Reset Params
    rminitialize();
  }

  function endGame() {
    $('#miniMap, #pano, #guessButton, #scoreBoard, #timer').hide();
    $('#endGame').html('<h1>Congrats!</h1><h2>Your final score was:</h2><h1>' + totalScore + '!</h1><a class="btn btn-large btn-primary" href="/">Main Menu</a></p>' +
        `<a class="btn btn-large btn-secondary m-2" href="/startChallenge?Challenge_ID=${ challenge_id }&ignore_previous_guesses=true">Replay(unranked)</a>` +
        `<a class="btn btn-large btn-success m-2" href="/challengeOverview?Challenge_ID=${ challenge_id }">Overview</a></p>`);
    $('#endGame').fadeIn(500);
    // We're done with the game
    window.finished = true;
  }
}

$(document).ready(function() {
  let urlSearchParams = new URLSearchParams(location.search);
  var challenge_id = urlSearchParams.get('Challenge_ID');
  var ignore_previous_guesses = urlSearchParams.get('ignore_previous_guesses');
  //js i hate you because all the reasons
  ignore_previous_guesses = ignore_previous_guesses === true || ignore_previous_guesses === 'true';
  $.ajax({
    url: "/challenge",
    data: {
      "Challenge_ID": challenge_id,
      "ignore_previous_guesses": ignore_previous_guesses
    },
    success: get_challenge_callback,
    error: function (result) {
      console.log(result);
    }
  });
});
