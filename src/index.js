import "./styles.css";
let comments = [];
const render = (html, selector) => {
  document.querySelector(selector).append(html);
};

const addCommentToList = (commObj) => {
  comments = [...comments, commObj];
};

const commentInput = document.querySelector("#comment-input");

const generalHtml = (comment) => `<div id="${comment.id}" class="comment">
<div class="avatar">
  <img
    src="https://lh3.googleusercontent.com/-JM2xsdjz2Bw/AAAAAAAAAAI/AAAAAAAAAAA/DVECr-jVlk4/photo.jpg"
    alt="avatar"
  />
</div>
<div class="comment-area">
  <div class="comment-title">
    <h2>${comment.user}</h2>
    <span data-timestamp="${comment.commentTime}">Just now</span>
  </div>
  <p class="comment-details">${comment.text}</p>
  <div class="actions">
    <div class="reply">Reply</div>
  </div>
  <div class="reply-area">
    <input
      id="reply-input"
      class="reply-input-display"
      type="text"
      maxlength="200"
      placeholder="reply..."
    />
  </div>
</div>
</div>`;

const createReplyHtml = (text, commentId) => {
  const comment = comments.find((x) => x.id.toString() === commentId);
  let replies = comment.replies;

  const replyId = replies.length + 1;
  const replyTime = Date.now();

  const reply = {
    user: "shubham",
    id: `reply-${replyId}`,
    commentTime: replyTime,
    text
  };
  replies = [...replies, reply];
  comments = comments.map((x) => {
    if (x.id.toString() === commentId) {
      return { ...x, replies };
    } else {
      return x;
    }
  });
  return generalHtml(reply);
};

const createCommentHtml = (text) => {
  const commentId = comments.length + 1;
  const commentTime = Date.now();

  const comment = {
    user: "shubham",
    id: `comment-${commentId}`,
    commentTime,
    text,
    replies: []
  };

  addCommentToList(comment);

  return generalHtml(comment);
};

const addNewComment = (e) => {
  if (e.key !== "Enter") {
    return;
  }
  const parentComment = e.target.closest(".comment");
  if (parentComment) {
    const reply = e.target.value.trim();
    if (reply !== "") {
      const newReply = createReplyHtml(reply, parentComment.id);
      const divElem = document.createElement("div");
      divElem.innerHTML = newReply;
      e.target.closest(".comment-area").append(divElem);
      e.target.classList.toggle("reply-input-toggle");
      e.target.parentElement.classList.toggle("reply-area-toggle");
    }
  } else {
    const comment = commentInput?.value?.trim();
    if (comment !== "") {
      const newComment = createCommentHtml(comment);
      const divElem = document.createElement("div");
      divElem.innerHTML = newComment;
      render(divElem, "#app");
      e.target.value = "";
    }
  }
};

const handleReply = (elem) => {
  const { children } = elem;
  const length = children.length;
  const replyNode = children[length - 1];
  replyNode.children[0].classList.toggle("reply-input-toggle");
  replyNode.classList.toggle("reply-area-toggle");
};

const clickEventHandler = (e) => {
  const { target } = e;
  if (target.classList.value === "reply") {
    const closestParent = target.closest(".comment-area");
    handleReply(closestParent);
  }
};

document.addEventListener("click", clickEventHandler);
document.addEventListener("keypress", addNewComment);
