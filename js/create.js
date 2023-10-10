const url = "https://api.noroff.dev/api/v1/social/posts";
const token = localStorage.getItem("token");

////////// CREATE POST
async function createPost(data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to create post:", error);
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
        data.media = mediaUrl; // Assigning the media URL to the correct "media" property
      }

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
    } else {
      alert("Please enter both title and content!");
    }
  });

export { createPost, clearModalContent }; // Added clearModalContent to the exports
