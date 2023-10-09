import { timeAgo } from "../js/date.js";

const editPostModal = new bootstrap.Modal(
  document.getElementById("createPostModal")
);

////////// FETCH POSTS
async function fetchPosts() {
  const container = document.querySelector("#feed_posts");
  const postsUrl = "https://api.noroff.dev/api/v1/social/posts?_author=true";
  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userEmail");

  function generateButton(iconName, text) {
    return `
            <button class="btn border-0 d-flex flex-column flex-sm-row align-items-center">
                <img src="/resources/icons/${iconName}.png" class="small_icon m-2" alt="${text} post" />
                <b class="text-light d-none d-sm-block">${text.toUpperCase()}</b>
            </button>
        `;
  }

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

    let validPostCount = 0; //Keep track on the amount of posts
    for (let i = 0; i < data.length && validPostCount < 10; i++) {
      const results = data[i];

      // Check if results.body is not null or undefined, then trim.
      if (!results.body || !results.body.trim()) continue;

      // Create HTML from fetched results
      const postHTML = `
                <form id="${
                  results.id
                }" class="post border border-2 rounded bg-warning p-5 mx-auto my-5 col-sm-10 col-lg-8">
                    <div class="d-flex justify-content-between">
                        <a href="#"><img src="/resources/icons/profile.png" alt="user profile" class="icon me-4" /></a>
                        <div class="d-flex flex-column me-auto">
                            <b class="text-light">${results.author.name}</b>
                            <i class="text-success">${timeAgo(
                              results.created
                            )}</i>
                        </div>
                        ${
                          results.author.email === currentUserId
                            ? `<button type="button" class="btn border-0" id="edit_post"><img src="../resources/icons/edit.png" class="small_icon"/></button>`
                            : ""
                        }
                    </div>
                    <h1 class="fs-4 my-3 text-light">${results.title}</h1>
                    <img src="${
                      results.media || ""
                    }" class="img-fluid w-100" alt=""/>
                    <p class="text-light mt-3 mb-4">${results.body}</p>
                    <div class="bg-primary p-2 rounded col-12 d-flex justify-content-around">
                        ${generateButton("comment", "comment")}
                        ${generateButton("like", "like post")}
                    </div>
                </form>
            `;

      const post = document.createElement("div");
      post.className = "post";
      post.innerHTML = postHTML;

      container.appendChild(post);
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
