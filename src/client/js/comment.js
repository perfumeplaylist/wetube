const form = document.querySelector(".comment__form");
const btn = document.querySelectorAll(".comment__delBtn");
const commentContainer = document.querySelector(".comment__list");

const handleDelBtnClick = async (e) => {
  const target = e.target.parentNode;
  const id = target.dataset.commentId;
  const response = await fetch(`/api/video/${id}/comment`, {
    method: "DELETE",
  });
  if (response.status === 201) {
    commentContainer.removeChild(target);
  }
};

const addComment = (text, id) => {
  const li = document.createElement("li");
  li.dataset.commentId = id;
  li.className = "comment__list__item";
  const i = document.createElement("i");
  i.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const delBtn = document.createElement("button");
  delBtn.className = "comment__delBtn";
  delBtn.innerText = `❌`;
  delBtn.addEventListener("click", handleDelBtnClick);
  li.appendChild(i);
  li.appendChild(span);
  li.appendChild(delBtn);
  commentContainer.prepend(li);
};

const handleFormSubmit = async (e) => {
  e.preventDefault();
  const videoContainer = document.querySelector(".videoContainer");
  const textarea = document.querySelector("textarea");
  const { value: text } = textarea;
  const {
    dataset: { id },
  } = videoContainer;
  if (text === "" || text === " ") {
    return;
  }
  const response = await fetch(`/api/video/${id}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

function init() {
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }
  btn.forEach((el) => {
    el.addEventListener("click", handleDelBtnClick);
  });
}

init();
