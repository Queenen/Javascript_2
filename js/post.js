import { request } from "../js/HTTP_request_base.js";
import { createPostHTML } from "../js/createHTML.js";

const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");

async function getPost() {
  try {
    const url = `https://api.noroff.dev/api/v1/social/posts/${id}?_author=true`; //${id} Use the id variable to dynamically fetch the post
    const token = localStorage.getItem("token");
    const postData = await request(url, "GET", null, token);
    console.log(postData);

    const postHTML = createPostHTML(postData, true); // Assuming you want the full post details
    postHTML.classList.add("w-100", "mx-auto");
    const postContainer = document.getElementById("post-container");
    postContainer.innerHTML = ""; // Clear any existing content
    postContainer.appendChild(postHTML); // Append the new post element to the container
  } catch (error) {
    console.error("Failed to fetch post:", error);
    // Optionally, you can handle the error by displaying a message to the user in the HTML
    const postContainer = document.getElementById("post-container");
    postContainer.innerHTML =
      "<p>Error loading post. Please try again later.</p>";
  }
}

getPost();
