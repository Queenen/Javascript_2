import { timeAgo } from "../js/date.js";

const postContainer = document.querySelector("#feed_posts");

// Large Filter
const filterPosts = document.querySelector("#fp_posts");
const filterImages = document.querySelector("#fp_images");

// Small Filter
const smallFilterPosts = document.querySelector("#f_posts");
const smallFilterImages = document.querySelector("#f_images");

let allPosts = [];

async function fetchContent() {
  try {
    const url = "https://api.noroff.dev/api/v1/social/posts?_author=true";
    const token = localStorage.getItem("token");
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    allPosts = await response.json();
    filteredPosts();
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
}

function filteredPosts() {
  const displayWithoutImages = () => {
    postContainer.innerHTML = "";
    allPosts.forEach((posts) => {
      if (!posts.media) {
        const post = document.createElement("div");
        post.innerHTML = `
        <form id="${
          posts.id
        }" class="post border border-2 rounded bg-warning p-5 mx-auto my-5 col-sm-10 col-lg-8">
          <div class="d-flex">
              <a href="#">
                  <img src="/resources/icons/profile.png" alt="user profile" class="icon me-4" />
              </a>
              <div class="d-flex flex-column">
                  <b class="text-light">${posts.author.name}</b>
                  <i class="text-success">${timeAgo(posts.created)}</i>
              </div>
          </div>
          <h1 class="fs-4 my-3 text-light">${posts.title}</h1>
          <p class="text-light mt-3 mb-4">${posts.body}</p>
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
        postContainer.appendChild(post);
      }
    });
  };

  const displayWithImages = () => {
    postContainer.innerHTML = "";
    allPosts.forEach((posts) => {
      if (posts.media) {
        const post = document.createElement("div");
        post.innerHTML = `
        <form id="${
          posts.id
        }" class="post border border-2 rounded bg-warning p-5 mx-auto my-5 col-sm-10 col-lg-8">
          <div class="d-flex">
              <a href="#">
                  <img src="/resources/icons/profile.png" alt="user profile" class="icon me-4" />
              </a>
              <div class="d-flex flex-column">
                  <b class="text-light">${posts.author.name}</b>
                  <i class="text-success">${timeAgo(posts.created)}</i>
              </div>
          </div>
          <h1 class="fs-4 my-3 text-light">${posts.title}</h1>
          <img src="${
            posts.media
          }" class="img-fluid w-100" id="media_container" alt="${posts.title}"/>
          <p class="text-light mt-3 mb-4">${posts.body}</p>
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
        postContainer.appendChild(post);
      }
    });
  };

  filterPosts.addEventListener("click", displayWithoutImages);
  smallFilterPosts.addEventListener("click", displayWithoutImages);

  filterImages.addEventListener("click", displayWithImages);
  smallFilterImages.addEventListener("click", displayWithImages);
}

export { fetchContent, filteredPosts };
