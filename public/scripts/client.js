/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Only purpose this serves is to stop cross site scripting.
const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// Contains layout originally used for static example element, simply slapped into a function with template literals for variables.
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

// Prepend tweets for reverse-chronological, append for chronological.
const renderTweets = function (tweetsArray) {
  const $tweetsContainer = $(`#tweets-container`);
  tweetsArray.forEach((tweet) => {
    const $tweet = createTweetElement(tweet);
    $tweetsContainer.prepend($tweet);
  });
};

$(document).ready(function () {
  /*
   *
   *
   * Nav bar Compose + Secondary Toggle button handlers
   *
   *
   */

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

  /*
   *
   *
   * END OF Nav bar Compose + Secondary Toggle button handlers
   *
   *
   */

  // Submit handler that also deals with the error messages that pop up if conditions are not met.
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

    $(this).find(".submit-counter").find(".counter").text(140); // If no errors, the form will submit and reset the counter to 140. (Could probably find a better position for this line)

    const formData = $(this).serialize();
    $.post("/tweets", formData)
      .done(function () {
        $("#tweet-form")[0].reset(); // This simply empties the form once you submit a tweet.
        $("#tweets-container").empty(); // This (in combination with the next line) serves to load the tweets again as you submit without refreshing the page.
        loadTweets(); // Alas, the two lines are clunky and the better way to do this is to simply create the element here and prepend it, but the server's code does not allow it, so this execution is the way.
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
