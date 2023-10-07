import { timeAgo } from "../js/date.js";

export function findContent() {
  const url = "https://api.noroff.dev/api/v1/social/posts?_author=true";
  const token = localStorage.getItem("token");

  ////////// Creates faster search results by storing info
  let allPosts = [];

  ////////// Fetches all posts if authorization is accepted
  async function fetchAllPosts() {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    allPosts = await response.json();
  }
  ////////// Creates post HTML from the results
  function createPostHTML(postData) {
    const post = document.createElement("div");
    const mediaSrc = postData.media ? postData.media : ""; // Check if media exists and assign

    post.innerHTML = `
    <form id="${
      postData.id
    }" class="post border border-2 rounded bg-warning p-5 mx-auto my-5 col-sm-10 col-lg-8">
    <div class="d-flex">
        <a href="#">
            <img src="/resources/icons/profile.png" alt="user profile" class="icon me-4" />
        </a>
        <div class="d-flex flex-column">
            <b class="text-light">${postData.author.name}</b>
            <i class="text-success">${timeAgo(postData.created)}</i>
        </div>
    </div>
    <h1 class="fs-4 my-3 text-light">${postData.title}</h1>
    <img src="${mediaSrc}" class="img-fluid w-100" id="media_container" alt="${
      postData.title
    }"/>
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

  function handleInput(event) {
    const searchTerm = event.target.value.toLowerCase();
    postContainer.innerHTML = ""; // clear previous results

    let postCount = 0;
    for (const postData of allPosts) {
      if (postCount >= 10) break; // limit to 10 posts

      const { id, title, body, author } = postData;

      if (!body) continue; // skip empty bodies

      ////////// Checks all options for matching results
      if (
        title.toLowerCase().includes(searchTerm) ||
        body.toLowerCase().includes(searchTerm) ||
        author.name.toLowerCase().includes(searchTerm) ||
        id.toString().includes(searchTerm)
      ) {
        postContainer.appendChild(createPostHTML(postData));
        postCount++;
      }
    }
  }
  ////////// Awaits search until user is done typing
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

  // Fetch and store all posts once when the script runs
  fetchAllPosts().catch((error) =>
    console.error("Failed to fetch data:", error)
  );
}
