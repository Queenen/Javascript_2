import { request } from "../js/HTTP_request_base.js";

const url = "https://api.noroff.dev/api/v1/social/posts";

////////// CREATE POST
async function createPost(data) {
  const modalFooter = document.querySelector(".modal-footer");
  try {
    const result = await request(
      url,
      "POST",
      data,
      localStorage.getItem("token")
    );

    if (!result) {
      throw new Error("Failed to create post");
    }

    return result;
  } catch (error) {
    console.error("Failed to create post:", error);

    const existingError = modalFooter.querySelector(".error-message");
    if (existingError) {
      // If an error message already exists, remove it
      existingError.remove();
    }

    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message col-12 text-center";
    errorDiv.innerHTML = `<p class="text-danger">Error: Failed to create post! ${error.message}</p>`;
    modalFooter.prepend(errorDiv);

    throw error; // Re-throw the error to propagate it to the caller
  }
}

// Clears modal and closes it
function clearModalContent() {
  document.getElementById("create_title").value = "";
  document.getElementById("postContent").value = "";
  document.getElementById("add_media").value = "";
}

document
  .querySelector("#createPostModal .btn-primary:not(#editBtn)")
  .addEventListener("click", async () => {
    const title = document.getElementById("create_title").value;
    const content = document.getElementById("postContent").value;
    const mediaUrl = document.getElementById("add_media").value;

    // Both title and body need to be present
    if (title && content) {
      const data = {
        title,
        body: content,
      };

      if (mediaUrl) {
        data.media = mediaUrl;
      }

      try {
        const result = await createPost(data);
        if (result) {
          alert("Posted successfully!");
          clearModalContent();

          const modalEl = document.getElementById("createPostModal");
          const bsModal = bootstrap.Modal.getInstance(modalEl);
          if (bsModal) {
            bsModal.hide();
          }
        }
      } catch (error) {
        alert("Failed to create post: " + error.message);
      }
    } else {
      alert("Please enter both title and content!");
    }
  });

export { createPost, clearModalContent };
