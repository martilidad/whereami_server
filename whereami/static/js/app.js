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

  var round = game.round.id + ignored_count;
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
  updateRound();

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
    updateRound();
  });
  $('#roundEnd').on('click', '.refreshBtn', renderOtherGuesses);

  // Functions
  // Reset Timer
  function resetTimer() {
    count = maxTime;
    counter = setInterval(timer, 1000);
  }

  function updateRound() {
    var realRound = round + ignored_count + 1;
    var totalRounds = locations.length + ignored_count;
    $('.round').html('Current Round: <b>' + realRound + '/' + totalRounds + '</b>');
  }

  // Calculate distance between points function
  function calcDistance(fromLat, fromLng, toLat, toLng) {
    return google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(fromLat, fromLng), new google.maps.LatLng(toLat, toLng));
  }

  function doGuess() {
    clearInterval(counter);
    if (!game.timedOut) {
      // Stop Counter
      window.guessArray = [window.guessLatLng.lat(), window.guessLatLng.lng()];
    } else {
      //timed out
      window.guessArray = [0, 0];
    }

    // Calculate distance between points, and convert to kilometers
    distance = Math.floor(calcDistance(window.loc['Lat'], window.loc['Long'], window.guessArray[0], window.guessArray[1]) / 1000);

    // use exponential function for points calculation.
    var maxPoints = 10000;
    var lastPointDistance = 14000;

    points = Math.floor(maxPoints**(1-distance/lastPointDistance));
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
    $('.roundScore').html('Last Round Score: <b>' + roundScore + '</b>');
    $('.totalScore').html('Total Score: <b>' + totalScore + '</b>');

    // If distance is undefined, that means they ran out of time and didn't click the guess button
    $('#roundEnd').html('<p>Your guess was<br/><strong><h1>' + distance + '</strong>km</h1> away from the actual location.<br/><div id="roundMap"></div><br/> You have scored<br/><h1>' + roundScore + ' points</h1> this round!<br/><br/><button class="btn btn-primary closeBtn" type="button">Continue</button><button class="btn btn-secondary refreshBtn mx-2" type="button">Refresh Map</button></p></p>');
    $('#roundEnd').fadeIn();

    // Reset Params
    rminitialize();
  }

  function endGame() {
    $('#miniMap, #pano, #guessButton, #scoreBoard, #timer, #toStartButton').hide();
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
