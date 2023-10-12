/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

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
  <p class="tweet-content">${escape(tweetObject.content.text)}</p>
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
    $tweetsContainer.prepend($tweet);
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
  $(".new-tweet").hide();

  $(".new-tweet-nav").on("click", function () {
    $(".new-tweet").slideToggle("slow");
  });

  $("#scroll-to-top").hide();

  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $(".new-tweet-nav").hide();
      $("#scroll-to-top").show();
    } else {
      $(".new-tweet-nav").show();
      $("#scroll-to-top").hide();
    }
  });

  $("#scroll-to-top").on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $(".new-tweet").slideDown("slow");
  });

  $("#tweet-form").on("submit", function (event) {
    event.preventDefault();
    const tweetContent = $("#tweet-text").val();

    if (!tweetContent) {
      $("#tweet-empty").removeClass("hidden");
      return;
    } else {
      $("#tweet-empty").addClass("hidden");
    }

    if (tweetContent.length > 140) {
      $("#tweet-too-long").removeClass("hidden");
      return;
    } else {
      $("#tweet-too-long").addClass("hidden");
    }

    $(this).find(".submit-counter").find(".counter").text(140);

    const formData = $(this).serialize();
    $.post("/tweets", formData)
      .done(function () {
        $("#tweet-form")[0].reset();
        $("#tweets-container").empty();
        loadTweets();
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
