/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png",
      "handle": "@SirIsaac",
    },
    "content": {
      "text":
        "If I have seen further it is by standing on the shoulders of giants",
    },
    "created_at": 1461116232227,
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd",
    },
    "content": {
      "text": "Je pense , donc je suis",
    },
    "created_at": 1461113959088,
  },
];

const createTweetElement = function (tweetObject) {
  let $tweet = $(`<article class="tweet">
  <header class="tweet-header">
  <img src=${tweetObject.user.avatars} class="mini-display-image">
  <span class="display-name">${tweetObject.user.name}</span>
  <span class="handle">${tweetObject.user.handle}</span>
  </header>
  <p class="tweet-content">${tweetObject.content.text}</p>
  <hr class="footer-separator">
  <div class="tweet-footer">
  <span class="date">${tweetObject.created_at}</span>
  <div class="tweet-actions">
  <span class="flag">
  <i class="fas fa-flag"></i>
  </span>
  <span class="retweet">
  <i class="fas fa-retweet"></i>
  </span>
  <span class="like">
  <i class="fas fa-heart"></i>
  </span>
  </div>
  </div>
  </article>`);

  return $tweet;
};

const renderTweets = function (tweetsArray) {
  const $tweetsContainer = $(`#tweets-container`);
  tweetsArray.forEach((tweet) => {
    const $tweet = createTweetElement(tweet);
    $tweetsContainer.append($tweet);
  });
};

$("#tweet-form").on("submit", function (event) {
  event.preventDefault();
  const formData = $(this).serialize();
  $.post("/tweets", formData)
    .done(function (data) {
      console.log("Tweet Submitted Successfully!", data);
    })
    .fail(function (error) {
      console.error("Error submitting tweet:", error);
    });
});

$(document).ready(function () {
  $("#tweet-form").on("submit", function (event) {
    event.preventDefault();
    const formData = $(this).serialize();
    $.post("/tweets", formData)
      .done(function () {
        console.log("Tweet Submitted Successfully!");
      })
      .fail(function (error) {
        console.error("Error submitting tweet:", error);
      });
  });

  const loadTweets = function () {
    $.get("/tweets")
      .done(function (data) {
        renderTweets(data);
      })
      .fail(function (error) {
        alert("Error loading tweets:", error);
      });
  };

  loadTweets();
});
