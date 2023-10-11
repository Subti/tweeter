$(document).ready(function () {
  // --- our code goes here ---
  console.log("Document is ready for manipulation.");

  $("#tweet-text").on("input", function (event) {
    let maxLength = 140;
    let currentLength = $(this).val().length;
    let remainingChars = maxLength - currentLength;

    let counter = $(this)
      .siblings(".submit-counter")
      .find(".counter")
      .text(remainingChars);

    counter.toggleClass("exceeded-limit", remainingChars < 0);
  });
});
