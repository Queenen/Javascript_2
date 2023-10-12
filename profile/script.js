import { request } from "../js/HTTP_request_base.js";

const token = localStorage.getItem("token");

function showLoader() {
  const loader = document.getElementById("pageLoader");
  loader.style.display = "flex";
}

function hideLoader() {
  const loader = document.getElementById("pageLoader");
  loader.style.display = "none";
}

// Fetches though all the data in order to find current user credentials
async function fetchAllData() {
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
}

async function processProfiles() {
  const allProfiles = await fetchAllData();
  showLoader();

  if (
    allProfiles
      .map((profile) => profile.email)
      .includes(localStorage.getItem("userID"))
  ) {
  }
  // Looks for an email that matches the login email adress
  const currentProfile = allProfiles.find(
    (result) => result.email === localStorage.getItem("userID")
  );
  // Saves the username from the database
  const userName = currentProfile.name;
  localStorage.setItem("userName", userName);
  personalizeHTML();
  hideLoader();
}

// Personalizes the HTML based of the results
function personalizeHTML() {
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

  // Option to change current description, profile banner and user avatar
  editProfileButton.addEventListener("click", () => {
    modal.show();

    // Populate modal fields with saved values
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

    // If any of the inputs contains a value, the changes will be saved in local storage
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
      changesMade = true;
    }

    if (description) {
      profileDesc.textContent = description;
      localStorage.setItem("description", description);
      changesMade = true;
    }

    // Changes to banner/avatar will be saved to the server
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
        alert("Failed to send data to the server:", error);
      }
    } else {
      alert("No changes have been made!");
    }

    modal.hide();
  });
}

processProfiles();
