import { request } from "../js/HTTP_request_base.js";
import { createPostHTML } from "../js/createHTML.js";

const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");

function displayError(container, message) {
  container.innerHTML = `<p class="text-danger">${message}</p>`;
}

async function getPost() {
  const postContainer = document.getElementById("post-container");
  try {
    if (!id) {
      throw new Error("No post ID provided in the query string.");
    }

    const url = `https://api.noroff.dev/api/v1/social/posts/${id}?_author=true`;
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User is not authenticated.");
    }

    const postData = await request(url, "GET", null, token);
    console.log(postData); // Keep the console.log if you still need it for debugging.

    const postHTML = createPostHTML(postData, true);
    postHTML.classList.add("w-100", "mx-auto");
    postContainer.innerHTML = ""; // Clear any existing content
    postContainer.appendChild(postHTML);
  } catch (error) {
    console.error("Failed to fetch post:", error);
    // Check the type of error and display a relevant message to the user
    if (error.message.includes("404")) {
      displayError(postContainer, "The post you're looking for was not found.");
    } else if (error.message.includes("401")) {
      displayError(postContainer, "You are not authorized to view this post.");
    } else {
      displayError(
        postContainer,
        "An unexpected error occurred. Please try again later."
      );
    }
  }
}

getPost();

