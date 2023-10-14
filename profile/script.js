import { request } from "../js/HTTP_request_base.js";
import { timeAgo } from "../js/date.js";

const token = localStorage.getItem("token");
let userName = localStorage.getItem("userName");

async function fetchAllData() {
  try {
    const baseUrl = "https://api.noroff.dev/api/v1/social/profiles/";
    const limit = 100;
    let offset = 0;
    let results = [];

    while (true) {
      const data = await request(
        `${baseUrl}?limit=${limit}&offset=${offset}`,
        "GET",
        null,
        token
      );

      if (!data.length) break;

      results = results.concat(data);
      offset += limit;
    }

    return results;
  } catch (error) {
    console.error("Error in fetchAllData:", error.message);
    throw new Error("Failed to fetch data. Please try again later.");
  }
}

async function processProfiles() {
  try {
    const allProfiles = await fetchAllData();

    const currentProfile = allProfiles.find(
      (result) => result.email === localStorage.getItem("userID")
    );

    if (!currentProfile) {
      throw new Error("User profile not found.");
    }

    userName = currentProfile.name;
    localStorage.setItem("userName", userName);

    const userPosts = await fetchUserPosts();

    const loaderBackground = document.querySelector(".loader-background");
    if (loaderBackground) {
      loaderBackground.style.display = "none";
    }
    personalizeHTML();
  } catch (error) {
    console.error("Error in processProfiles:", error.message);
    alert("Failed to load user profile data. Please try again later.");
  }
}

async function personalizeHTML() {
  try {
    const bannerImage = document.querySelector("#banner_image");
    const userAvatar = document.querySelectorAll(".avatar");
    const profileDesc = document.querySelector("#profile_desc");
    const userName = localStorage.getItem("userName");
    const profileUserName = document.querySelectorAll(".username");

    profileUserName.forEach((profileUser) => {
      profileUser.textContent = userName;
    });

    const bannerUrlStorage = localStorage.getItem("bannerUrl");
    if (bannerUrlStorage) {
      bannerImage.src = bannerUrlStorage;
    }

    const avatarUrlStorage = localStorage.getItem("avatarUrl");
    if (avatarUrlStorage) {
      userAvatar.forEach((avatar) => {
        avatar.src = avatarUrlStorage;
        avatar.classList.add("avatar_round");
      });
    }

    const storedDescription = localStorage.getItem("description");
    if (storedDescription) {
      profileDesc.textContent = storedDescription;
    }

    const editProfileButton = document.querySelector("#edit_profile");
    const modalElement = document.getElementById("profileModal");
    const modal = new bootstrap.Modal(modalElement);

    editProfileButton.addEventListener("click", () => {
      modal.show();
      document.querySelector("#bannerUrlInput").value = bannerUrlStorage || "";
      document.querySelector("#avatarUrlInput").value = avatarUrlStorage || "";
      document.querySelector("#detailsInput").value = storedDescription || "";
    });

    const saveProfileButton = document.querySelector("#save_profile");
    saveProfileButton.addEventListener("click", async () => {
      const bannerUrl = document.querySelector("#bannerUrlInput").value;
      const avatarUrl = document.querySelector("#avatarUrlInput").value;
      const description = document.querySelector("#detailsInput").value;
      let changesMade = false;

      if (bannerUrl) {
        bannerImage.src = bannerUrl;
        localStorage.setItem("bannerUrl", bannerUrl);
        changesMade = true;
      }

      if (avatarUrl) {
        userAvatar.forEach((avatar) => {
          avatar.src = avatarUrl;
          avatar.classList.add("avatar_round");
        });
        localStorage.setItem("avatarUrl", avatarUrl);
        const localAvatar = localStorage.getItem("avatarUrl");
        changesMade = true;
      }

      if (description) {
        profileDesc.textContent = description;
        localStorage.setItem("description", description);
        changesMade = true;
      }

      if (changesMade) {
        try {
          await request(
            `https://api.noroff.dev/api/v1/social/profiles/${userName}/media`,
            "PUT",
            {
              banner: bannerUrl,
              avatar: avatarUrl,
            },
            token
          );
          alert("Your changes have been saved!");
        } catch (error) {
          console.error("Error saving changes:", error.message);
          alert("Failed to send data to the server. Please try again later.");
        }
      } else {
        alert("No changes have been made!");
      }
      modal.hide();
    });

    // If there are no posts in the server, use example HTML
    const userPosts = await fetchUserPosts();
    if (userPosts.length > 0) {
      renderPosts(userPosts);
    }
  } catch (error) {
    console.error("Error in personalizeHTML:", error.message);
    alert("Failed to personalize HTML. Please try again later.");
  }
}

async function fetchUserPosts() {
  try {
    const url = `https://api.noroff.dev/api/v1/social/profiles/${userName}/posts`;
    const response = await request(url, "GET", null, token);
    return response;
  } catch (error) {
    console.error("Error in fetchUserPosts:", error.message);
    return []; // Return an empty array or appropriate default value
  }
}

function renderPosts(posts) {
  try {
    const carouselInner = document.querySelector(
      "#postCarousel .carousel-inner"
    );
    carouselInner.innerHTML = ""; // Clear existing content

    posts.forEach((post, index) => {
      const avatar = localStorage.getItem("avatarUrl"); // Move this inside the loop
      const postItem = document.createElement("div");
      postItem.classList.add("carousel-item");
      postItem.setAttribute("id", `${post.id}`);

      if (index === 0) {
        postItem.classList.add("active"); // Set the first post as active
      }

      const postContent = `
      <div class="container bg-warning">
        <div class="row p-5">
          <div class="d-flex align-items-center">
          <img
          src="${
            avatar ||
            (typeof localAvatar !== "undefined"
              ? localAvatar
              : "/resources/icons/profile.png")
          }" 
          class="me-4 object_cover avatar_round avatar profile_icon"
          alt=""
        />
            <div class="d-flex flex-column">
              <b class="text-light username me-auto">${userName}</b>
              <i class="text-success">${timeAgo(post.created)}</i>
            </div>
          </div>
          <h4 class="text-light mt-5 mb-3">${post.title}</h4>
          ${
            post.media
              ? `<img src="${post.media}" class="img-fluid my-3" alt="Post Image">`
              : ""
          }
          <p class="text-light mb-5 mt-3">${post.body}
          </p>
          <div
            class="bg-primary rounded p-2 d-flex py-3 justify-content-around">
            <button class="btn border-0">
              <img
                src="/resources/icons/comment.png"
                class="small_icon me-2"
                alt="comment post" />
              <b class="text-light">COMMENT</b>
            </button>
            <button class="btn border-0">
              <img
                src="/resources/icons/like.png"
                class="small_icon me-2"
                alt="like post" />
              <b class="text-light">LIKE</b>
            </button>
          </div>
        </div>
      </div>
      `;

      postItem.innerHTML = postContent;
      carouselInner.appendChild(postItem);
    });
  } catch (error) {
    console.error("Error in renderPosts:", error.message);
    alert("Failed to render posts. Please try again later.");
  }
}

processProfiles();
