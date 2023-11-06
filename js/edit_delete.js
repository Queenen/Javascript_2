import { request } from "../js/HTTP_request_base.js"; // Import the request function
import { createPost, clearModalContent } from "./create.js";

const editPostModal = new bootstrap.Modal(
  document.getElementById("createPostModal")
);

const modalFooter = document.querySelector(".modal-footer");

let currentEditingPostId = null;

////////// EDIT POST
async function editPost(data, postId) {
  const url = `https://api.noroff.dev/api/v1/social/posts/${postId}`;
  try {
    const result = await request(
      url,
      "PUT",
      data,
      localStorage.getItem("token")
    );
    if (!result) {
      throw new Error("Failed to edit post!");
    }
    return result;
  } catch (error) {
    const existingError = modalFooter.querySelector(".error-message");
    if (existingError) {
      // If an error message already exists, remove it
      existingError.remove();
    }

    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message col-12 text-center";
    errorDiv.innerHTML = `<p class="text-danger">Error: Failed to edit post! ${error.message}</p>`;
    modalFooter.prepend(errorDiv);
    throw error; // Re-throw the error to propagate it to the caller
  }
}

////////// DELETE POST
async function deletePost(postId) {
  const url = `https://api.noroff.dev/api/v1/social/posts/${postId}`;
  try {
    const result = await request(
      url,
      "DELETE",
      null,
      localStorage.getItem("token")
    );
    if (!result) {
      throw new Error("Failed to delete post!");
    }
    return result;
  } catch (error) {
    const existingError = modalFooter.querySelector(".error-message");
    if (existingError) {
      // If an error message already exists, remove it
      existingError.remove();
    }

    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message col-12 text-center";
    errorDiv.innerHTML = `<p class="text-danger">Error: Failed to delete post! ${error.message}</p>`;
    modalFooter.prepend(errorDiv);

    throw error; // Re-throw the error to propagate it to the caller
  }
}

function initEditFunctionality() {
  document.addEventListener("click", async (event) => {
    if (event.target.closest("#edit_post")) {
      const postElement = event.target.closest(".post");
      currentEditingPostId = postElement.id;

      const title = postElement.querySelector("h1").textContent;
      const content = postElement.querySelector("p").textContent;

      document.getElementById("create_title").value = title;
      document.getElementById("postContent").value = content;

      document.querySelector(".btn-danger").classList.remove("disabled");
      document.getElementById("editBtn").classList.remove("d-none");
      document.querySelector(".btn-primary").classList.add("d-none");

      editPostModal.show();
    }
  });

  document.getElementById("editBtn").addEventListener("click", async () => {
    if (currentEditingPostId) {
      const title = document.getElementById("create_title").value;
      const content = document.getElementById("postContent").value;

      if (title && content) {
        const data = {
          title,
          body: content,
        };

        try {
          await editPost(data, currentEditingPostId);
          alert("Your changes have been saved successfully");
          editPostModal.hide();
          document.getElementById("editBtn").classList.add("d-none");
          document.querySelector(".btn-primary").classList.remove("d-none");
        } catch (error) {
          alert("Failed to edit post. Please try again later.");
        }
      } else {
        alert("Please enter both title and content!");
      }
    }
  });

  document.querySelector(".btn-danger").addEventListener("click", async () => {
    if (currentEditingPostId) {
      try {
        await deletePost(currentEditingPostId);
        const postElement = document.getElementById(currentEditingPostId);
        postElement.remove();
        alert("Your post has been successfully deleted");

        clearModalContent(); // Clear the modal content after post deletion

        editPostModal.hide();
      } catch (error) {
        alert(`Failed to delete post. Please try again later.`);
      }
    }
  });
}

export { initEditFunctionality };
