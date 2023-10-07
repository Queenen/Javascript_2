//////////////////////////////// VIEW LOGIN FORM

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

    // Attach the event listener after the form is added to the DOM
    attemptLogin();
  });
}

//////////////////////////////// LOGIN / Check if user is already registered

function attemptLogin() {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const loginUrl = "https://api.noroff.dev/api/v1/social/auth/login";

      // Make a POST request with the user's credentials
      fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Check if the response contains the accessToken
          if (data.accessToken) {
            // Save the token and user's email in local storage
            localStorage.setItem("token", data.accessToken);
            localStorage.setItem("userEmail", email); // Storing the user's email

            window.location.href = "../profile/index.html";
          } else {
            alert("Invalid login credentials. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  }
}

export { viewLoginForm, attemptLogin };
