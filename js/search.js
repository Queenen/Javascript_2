import { request } from "../js/HTTP_request_base.js";
import { resetPostCount, incrementAndCheckPostCount } from "../js/postCount.js";
import { createPostHTML } from "../js/createHTML.js";

const token = localStorage.getItem("token");
const currentUserId = localStorage.getItem("userEmail");

export function findContent() {
  const baseUrl = "https://api.noroff.dev/api/v1/social/posts?_author=true";
  let allPosts = [];

  function showLoader() {
    const loaderBackground = document.createElement("div");
    loaderBackground.className = "loader-background";

    const loader = document.createElement("div");
    loader.className = "loader";

    loaderBackground.appendChild(loader);
    postContainer.appendChild(loaderBackground);
  }

  function hideLoader() {
    const loaderBackground = postContainer.querySelector(".loader-background");
    if (loaderBackground) {
      postContainer.removeChild(loaderBackground);
    }
  }

  async function recursiveFetch(url) {
    const result = await request(url, "GET", null, token);
    allPosts = allPosts.concat(result);

    if (result.length === 100) {
      const nextOffset = allPosts.length;
      await recursiveFetch(`${baseUrl}&limit=100&offset=${nextOffset}`);
    }
  }

  async function fetchAllPosts(searchTerm) {
    showLoader();

    allPosts = [];
    await recursiveFetch(baseUrl + "&limit=100&offset=0");

    postContainer.innerHTML = "";
    resetPostCount();

    let matchedPosts = allPosts.filter((postData) => {
      const { id, title, body, author } = postData;
      if (!body) return false;

      return (
        title.toLowerCase().includes(searchTerm) ||
        body.toLowerCase().includes(searchTerm) ||
        author.name.toLowerCase().includes(searchTerm) ||
        id.toString().includes(searchTerm)
      );
    });

    matchedPosts = matchedPosts.slice(0, 10);
    matchedPosts.forEach((postData) => {
      postContainer.appendChild(createPostHTML(postData, currentUserId));
    });

    hideLoader();
  }

  function handleInput(event) {
    if (event.key !== "Enter") return;
    const searchTerm = event.target.value.toLowerCase();
    fetchAllPosts(searchTerm);
  }

  const smallSearchBar = document.querySelector("#smallSearchBar");
  const bigSearchBar = document.querySelector("#bigSearchBar");
  const postContainer = document.querySelector("#feed_posts");

  smallSearchBar.addEventListener("keydown", handleInput);
  bigSearchBar.addEventListener("keydown", handleInput);
}
