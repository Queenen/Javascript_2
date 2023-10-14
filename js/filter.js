import { createPostHTML } from "../js/createHTML.js";
import { request } from "../js/HTTP_request_base.js";
import { resetPostCount, incrementAndCheckPostCount } from "../js/postCount.js";

const postContainer = document.querySelector("#feed_posts");

// Large Filter
const filterPosts = document.querySelector("#fp_posts");
const filterImages = document.querySelector("#fp_images");

// Small Filter
const smallFilterPosts = document.querySelector("#f_posts");
const smallFilterImages = document.querySelector("#f_images");

let allPosts = [];

////////// FETCH CONTENT
async function fetchContent() {
  const url = "https://api.noroff.dev/api/v1/social/posts?_author=true";
  const token = localStorage.getItem("token");

  try {
    allPosts = await request(url, "GET", null, token);
    if (!Array.isArray(allPosts)) {
      throw new Error("Failed to fetch posts: Invalid response format");
    }
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw error; // Re-throw the error to propagate it to the caller
  }
}

////////// DISPLAY POSTS WITHOUT IMAGES
function displayWithoutImages() {
  postContainer.innerHTML = "";
  resetPostCount(); // Reset post count

  for (let post of allPosts) {
    if (!post.media) {
      // If post count exceeds the limit, break from loop
      if (!incrementAndCheckPostCount(10)) break;

      const postElement = createPostHTML(post);
      postContainer.appendChild(postElement);
    }
  }
}

////////// DISPLAY POSTS WITH IMAGES
function displayWithImages() {
  postContainer.innerHTML = "";
  resetPostCount(); // Reset post count

  for (let post of allPosts) {
    if (post.media) {
      // If post count exceeds the limit, break from loop
      if (!incrementAndCheckPostCount(10)) break;

      const postElement = createPostHTML(post);
      postContainer.appendChild(postElement);
    }
  }
}

////////// FILTERED POSTS EVENT LISTENERS
filterPosts.addEventListener("click", displayWithoutImages);
smallFilterPosts.addEventListener("click", displayWithoutImages);

filterImages.addEventListener("click", displayWithImages);
smallFilterImages.addEventListener("click", displayWithImages);

export { fetchContent };
