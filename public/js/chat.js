import {timeDifference, getPostIdFromElement, createPostHtml} from "./helper.js";

const socket = io();

$(document).ready(() => {
    loadMsgs();
})

async function loadMsgs() {
    const allMsgs = await axios.get('/allMessages');
    console.log(allMsgs);

    for (let msg of allMsgs.data) {
        const timeStamp = timeDifference(new Date(), new Date(msg.createdAt));
        $('#all-msg-container').append(
            `<li>
                <span><strong>${msg.user}</strong> ---> </span>
                <span>${timeStamp}<span>
                <p>${msg.content}</p>
            </li>`
        );
    }
}

$('#send-msg-btn').on('click', () => {
    const textMsg = $('#msg-text').val();

    socket.emit("send-msg", {
        user : currentUser,
        msg : textMsg
    });

    $('#msg-text').val("");
});

socket.on('received-msg', (data) => {
    const timeStamp = timeDifference(new Date(), new Date());
    $('#all-msg-container').append(
        `<li>
            <span><strong>${data.user}</strong> ---> </span>
            <span>created at : ${timeStamp}<span>
            <p>${data.msg}</p>
        </li>`
    )
});

