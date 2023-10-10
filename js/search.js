import { request } from "../js/HTTP_request_base.js";
import { resetPostCount, incrementAndCheckPostCount } from "../js/postCount.js";
import { createPostHTML } from "../js/createHTML.js"; // Importing the function

const token = localStorage.getItem("token");
const currentUserId = localStorage.getItem("userEmail"); // Remember to update this to 'username' if that's what you're storing now

export function findContent() {
  const url = "https://api.noroff.dev/api/v1/social/posts?_author=true";
  let allPosts = []; // Creates faster search results by storing the fetched info

  ////////// Retrieves all posts if authorization is granted
  async function fetchAllPosts() {
    try {
      allPosts = await request(url, "GET", null, token);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  }

  function handleInput(event) {
    const searchTerm = event.target.value.toLowerCase();
    postContainer.innerHTML = ""; // clear previous results

    resetPostCount(); // Resets the post count

    fetchAllPosts()
      .then(() => {
        for (const postData of allPosts) {
          if (!incrementAndCheckPostCount(10)) break; // limit to 10 posts

          const { id, title, body, author } = postData;
          if (!body) continue; // skip empty bodies

          if (
            title.toLowerCase().includes(searchTerm) ||
            body.toLowerCase().includes(searchTerm) ||
            author.name.toLowerCase().includes(searchTerm) ||
            id.toString().includes(searchTerm)
          ) {
            postContainer.appendChild(createPostHTML(postData, currentUserId));
          }
        }
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      });
  }

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const smallSearchBar = document.querySelector("#smallSearchBar");
  const bigSearchBar = document.querySelector("#bigSearchBar");
  const postContainer = document.querySelector("#feed_posts");

  smallSearchBar.addEventListener("input", debounce(handleInput, 500));
  bigSearchBar.addEventListener("input", debounce(handleInput, 500));
}
