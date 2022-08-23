import { timeDifference, getPostIdFromElement, createPostHtml } from './helper.js';

$(document).ready(() => {
    refreshTweets();
    const onlyReplies = $('#onlyReplies').html();
    if (onlyReplies) {
        $('.repliesClass').addClass('active');
    } else {
        $('.postsClass').addClass('active');
    }
});

async function refreshTweets() {
    const profileUserId = $('#userId').html();
    const onlyReplies = $('#onlyReplies').html();

    const posts = await axios.get('/api/post', {
        params: { postedBy: profileUserId },
    });

    //copied from common.js
    for (let post of posts.data) {
        if ((!onlyReplies && !post.replyTo) || (onlyReplies === 'true' && post.replyTo)) {
            const html = createPostHtml(post);
            $(".userPostsContainer").prepend(html);
        }

    }
}

$(document).on('click', '.likeButton', async function (e) {
    const button = $(e.currentTarget);
    console.log(button);
    const postId = getPostIdFromElement(button);
    console.log(postId);

    const postData = await axios.patch(`/api/post/${postId}/like`);
    console.log(postData.data.likes.length);
    button.find("span").text(postData.data.likes.length);
});

// $('.postsClass').on('click', () => {
//     if (!$('.postsClass').hasClass('active')) {
//         $('.postsClass').addClass('active');

//         if ($('.repliesClass').hasClass('active')) {
//             $('.repliesClass').removeClass('active');
//         }
//     }
// })

// $('.repliesClass').on('click', () => {
//     if (!$('.repliesClass').hasClass('active')) {
//         $('.repliesClass').addClass('active');

//         if ($('.postsClass').hasClass('active')) {
//             $('.postsClass').removeClass('active');
//         }
//     }
// })

$("#submitReplyButton").click(async (event) => {
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