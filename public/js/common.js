import {timeDifference, getPostIdFromElement, createPostHtml} from './helper.js';

$(document).ready(() => {
    refreshTweets();
});

async function refreshTweets() {
    $('.postsContainer').empty();
    const tweets = await axios.get('/api/post');

    console.log(tweets.data);

    for (let post of tweets.data) {
        const html = createPostHtml(post);
        $('.postsContainer').prepend(html);
    }
}

$("#submitReplyButton").on('click', async (event) => {
    const element = $(event.target);
    const postText = $("#reply-text-container").val();
  
    const replyTo = element.attr("data-id");
  
    const postData = await axios.post("/api/post", {
      content: postText,
      replyTo: replyTo,
    });

    
  
  });
  
  $("#replyModal").on("show.bs.modal", async (event) => {
    const button = $(event.relatedTarget);
    const postId = getPostIdFromElement(button);
  
    $("#submitReplyButton").attr("data-id", postId);
  
    const postData = await axios.get(`/api/posts/${postId}`);
  
    const html = createPostHtml(postData.data);
  
    $("#originalPostContainer").empty();
  
    $("#originalPostContainer").append(html);
  });

$('#submitPostButton').on('click', async function () {
    const postText = $('#post-text').val();
    // console.log(postText);

    const newPost = await axios.post('/api/post', { content: postText });
    console.log(newPost);

    refreshTweets();

    $('#post-text').val("");
});

$(document).on('click', '.likeButton', async function (e) {
    const button = $(e.currentTarget);
    console.log(button);
    const postId = getPostIdFromElement(button);
    console.log(postId);

    const postData = await axios.patch(`/api/post/${postId}/like`);
    console.log(postData.data.likes.length);
    button.find("span").text(postData.data.likes.length);
});