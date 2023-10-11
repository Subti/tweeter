/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const createTweetElement = function (tweetObject) {
  const date = new Date(tweetObject.created_at);
  const formattedDate = date.toISOString();
  const timeAgo = timeago.format(formattedDate);
  let $tweet = $(`<article class="tweet">
  <header class="tweet-header">
  <img src=${tweetObject.user.avatars} class="mini-display-image">
  <span class="display-name">${tweetObject.user.name}</span>
  <span class="handle">${tweetObject.user.handle}</span>
  </header>
  <p class="tweet-content">${tweetObject.content.text}</p>
  <hr class="footer-separator">
  <div class="tweet-footer">
  <span class="date">${timeAgo}</span>
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
    const tweetContent = $("#tweet-text").val();

    if (!tweetContent) {
      alert("Error: Tweet is empty!");
      return;
    }

    if (tweetContent.length > 140) {
      alert(
        "Error: Tweet is too long! Maximum length of a tweet can not exceed 140 characters."
      );
      return;
    }

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
