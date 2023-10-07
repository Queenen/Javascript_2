import { timeAgo } from "../js/date.js";

////////// Fetches the post content from the API
async function fetchPosts() {
  const container = document.querySelector("#feed_posts");
  const postsUrl = "https://api.noroff.dev/api/v1/social/posts?_author=true";
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(postsUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    ////////// Reduces the amount of posts created to 10
    let validPostCount = 0;
    for (let i = 0; i < data.length && validPostCount < 10; i++) {
      const results = data[i];

      ////////// If the body element appears empty it's being skipped
      if (!results.body.trim()) continue;

      const post = document.createElement("div");
      post.className = "post";

      ////////// Creates new post HTML
      post.innerHTML = `
          <form
          id="${
            results.id
          }" class="post border border-2 rounded bg-warning p-5 mx-auto my-5 col-sm-10 col-lg-8">
          <div class="d-flex">
              <a href="#">
                  <img src="/resources/icons/profile.png" alt="user profile" class="icon me-4" />
              </a>
              <div class="d-flex flex-column">
                  <b class="text-light">${results.author.name}</b>
                  <i class="text-success">${timeAgo(results.created)}</i>
              </div>
          </div>
          <h1 class="fs-4 my-3 text-light">${results.title}</h1>
          <img src="" class="img-fluid w-100" id="media_container" alt=""/>
          <p class="text-light mt-3 mb-4">${results.body}</p>
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
      </form>
      `;

      container.appendChild(post);

      ////////// If there are media files, add them to the post
      if (results.media) {
        const mediaContainer = post.querySelector("#media_container");
        if (mediaContainer) {
          mediaContainer.src = results.media;
        } else {
          console.error("Couldn't find #media_container in the DOM.");
        }
      }

      validPostCount++;
    }
  } catch (error) {
    console.error(
      "There was a problem with the fetch operation:",
      error.message
    );
    throw error;
  }
}

export { fetchPosts };
