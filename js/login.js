import { request } from "./HTTP_request_base.js"; // Update this path if it's different

////////// VIEW LOGIN FORM

function viewLoginForm() {
  document.querySelector("#login").addEventListener("click", function () {
    const replaceContent = document.querySelector(".button_field");
    replaceContent.innerHTML = `
        <div class="col-12 col-md-12 offset-md-12">
            <form id="loginForm">
                <input type="email" class="form-control mt-1" id="email" name="email" required placeholder="Email address" aria-label="Email address">  
                <input type="password" class="form-control mt-3" id="password" name="password" required minlength="8" placeholder="Password" aria-label="Password">
                <button type="submit" class="btn btn-primary mt-4 text-light col-12">LOGIN</button>
                <p class="text-end mt-2">Not a user yet? <a href="" class="ms-2">Go back</a></p>
            </form>
        </div>
        `;

    attemptLogin();
  });
}

////////// LOGIN / Checks if the user is already registered

function attemptLogin() {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const loginUrl = "https://api.noroff.dev/api/v1/social/auth/login";

      try {
        // Using the request function for the POST request
        const data = await request(loginUrl, "POST", { email, password });

        if (data.accessToken) {
          localStorage.setItem("token", data.accessToken); // Storing the token credentials
          localStorage.setItem("userID", email);
          window.location.href = "../profile/index.html";
        } else {
          // Handle invalid login credentials more gracefully
          throw new Error("Invalid login credentials. Please try again.");
        }
      } catch (error) {
        // Display a user-friendly error message
        console.error("Error:", error);
        alert("Login failed. Please check your credentials and try again.");
      }
    });
  }
}

export { viewLoginForm, attemptLogin };
