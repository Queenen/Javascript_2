import { createPost } from "./create.js";

const editPostModal = new bootstrap.Modal(
  document.getElementById("createPostModal")
);

//Tracks which post is being edited
let currentEditingPostId = null;

////////// EDIT POST
async function editPost(data, postId) {
  const url = `https://api.noroff.dev/api/v1/social/posts/${postId}`;
  const token = localStorage.getItem("token");
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  return response.json();
}

////////// DELETE POST
async function deletePost(postId) {
  const url = "https://api.noroff.dev/api/v1/social/posts/";
  const token = localStorage.getItem("token");
  const response = await fetch(`${url}${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  return response.json();
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
          alert("Your changes have been saved successfully"); //Original post is edited
          editPostModal.hide();
          document.getElementById("editBtn").classList.add("d-none");
          document.querySelector(".btn-primary").classList.remove("d-none");
        } catch (error) {
          console.error("Failed to edit post:", error);
          alert("Failed to save changes. Please try again.");
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
        alert("Your post has been successfully deleted"); //Post gets deleted from DOM
        editPostModal.hide();
      } catch (error) {
        console.error("Failed to delete post:", error);
        alert("Failed to delete post. Please try again.");
      }
    }
  });
}

export { initEditFunctionality };
