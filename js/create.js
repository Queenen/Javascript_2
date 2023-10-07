const url = "https://api.noroff.dev/api/v1/social/posts";
const token = localStorage.getItem("token");

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

// Initialize the modal using Bootstrap's Modal JavaScript API
const createPostModal = new bootstrap.Modal(
  document.getElementById("createPostModal")
);

// Event listener for the POST button
document.querySelector(".btn-primary").addEventListener("click", async () => {
  const title = document.getElementById("create_title").value;
  const content = document.getElementById("postContent").value;

  // Only if both title and content are present (can add more validations)
  if (title && content) {
    const data = {
      title,
      body: content, // assuming the API expects a key named "body" for the content
      // Add more data if needed
    };

    const result = await createPost(data);
    if (result) {
      // Handle successful post creation
      createPostModal.hide(); // Close the modal
      alert("Posted successfully!"); // Inform the user
      // Optionally: Refresh the feed or update the UI accordingly
    }
  } else {
    alert("Please enter both title and content!");
  }
});

export { createPost };
