import { timeAgo } from "./date.js";

function createPostHTML(postData) {
  const post = document.createElement("div");

  // Retrieve the current user's username from local storage
  const currentID = localStorage.getItem("userID");

  // Check for media and apply necessary changes
  const mediaClass = postData.media ? "" : "d-none";
  const mediaSrc = postData.media || "";

  post.innerHTML = `
        <form id="${
          postData.id
        }" class="post border border-2 rounded bg-warning p-5 mx-auto my-5 col-sm-10 col-lg-8">
            <div class="d-flex justify-content-between">
                <a href="#"><img src="/resources/icons/profile.png" alt="user profile" class="icon me-4" /></a>
                <div class="d-flex flex-column me-auto">
                    <b class="text-light">${postData.author.name}</b>
                    <i class="text-success">${timeAgo(postData.created)}</i>
                </div>
                ${
                  postData.author.email === currentID
                    ? `<button type="button" class="btn border-0" id="edit_post"><img src="../resources/icons/edit.png" class="small_icon"/></button>`
                    : ""
                }
            </div>
            <h1 class="fs-4 my-3 text-light">${postData.title}</h1>
            <img src="${mediaSrc}" class="img-fluid w-100 ${mediaClass}" id="media_container" alt=""/>
            <p class="text-light mt-3 mb-4">${postData.body}</p>
            <div class="bg-primary p-2 rounded col-12 d-flex justify-content-around">
                <button class="btn border-0 d-flex flex-column flex-sm-row align-items-center">
                    <img src="/resources/icons/comment.png" class="small_icon m-2" alt="comment post" />
                    <b class="text-light d-none d-sm-block">COMMENT</b>
                </button>
                <button class="btn border-0 d-flex flex-column flex-sm-row align-items-center">
                    <img src="/resources/icons/like.png" class="small_icon m-2" alt="like post" />
                    <b class="text-light d-none d-sm-block">LIKE POST</b>
                </button>
            </div>
        </form>`;
  return post;
}

export { createPostHTML };
