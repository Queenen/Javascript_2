import { request } from "../js/HTTP_request_base.js";
import { resetPostCount, incrementAndCheckPostCount } from "../js/postCount.js";
import { createPostHTML } from "../js/createHTML.js"; // Import the function

const editPostModal = new bootstrap.Modal(
  document.getElementById("createPostModal")
);

async function fetchPosts() {
  const container = document.querySelector("#feed_posts");
  const postsUrl = "https://api.noroff.dev/api/v1/social/posts?_author=true";
  const token = localStorage.getItem("token");
  const currentUser = localStorage.getItem("user");

  function generateButton(iconName, text) {
    return `
            <button class="btn border-0 d-flex flex-column flex-sm-row align-items-center">
                <img src="/resources/icons/${iconName}.png" class="small_icon m-2" alt="${text} post" />
                <b class="text-light d-none d-sm-block">${text.toUpperCase()}</b>
            </button>
        `;
  }

  try {
    const data = await request(postsUrl, "GET", null, token);

    resetPostCount(); // Resetting the post count before starting the loop

    for (let i = 0; i < data.length; i++) {
      const results = data[i];

      // Skip if results.body is not valid
      if (!results.body || !results.body.trim()) continue;

      // If post count exceeds the limit, break the loop
      if (!incrementAndCheckPostCount(10)) break;

      const post = createPostHTML(results, currentUser); // Use the imported function
      container.appendChild(post);
    }
  } catch (error) {
    console.error(
      "There was a problem with the fetch operation:",
      error.message
    );
  }
}

export { fetchPosts };
