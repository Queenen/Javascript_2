import { request } from "./HTTP_request_base.js"; // Adjust the import path if needed

////////// VIEW REGISTER FORM

function viewRegisterForm() {
  document.querySelector("#register").addEventListener("click", function () {
    const replaceContent = document.querySelector(".button_field");
    replaceContent.innerHTML = `
          <div class="col-12 col-md-12 offset-md-12">
              <form id="registerForm">
              <input type="text" class="form-control mt-1" id="name" name="username" required placeholder="Username" aria-label="username">
                  <input type="email" class="form-control mt-3" id="email" name="email" required placeholder="Email address" aria-label="Email address">  
                  <input type="password" class="form-control mt-3" id="password" name="password" required minlength="8" placeholder="Password" aria-label="Password">
                  <button type="submit" class="btn btn-primary mt-4 text-light col-12">REGISTER</button>
                  <p class="text-end mt-2">Already registered? <a href="" class="ms-2">Return here</a></p>
              </form>
          </div>
          `;

    attemptRegister();
  });
}

////////// ATTEMPT REGISTER | Checks if the user's registration data is valid
function attemptRegister() {
  document
    .getElementById("registerForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const registerUrl = "https://api.noroff.dev/api/v1/social/auth/register";

      // Validations
      const emailPattern = /(.*)(@stud\.noroff\.no|@noroff\.no)$/;
      if (!emailPattern.test(email)) {
        alert("Please use a valid Noroff email address.");
        return;
      }
      if (password.length < 8) {
        alert("Password must have at least 8 characters.");
        return;
      }
      if (/[^a-zA-Z0-9_]/.test(name)) {
        alert(
          "Name must not contain punctuation symbols apart from underscore (_)."
        );
        return;
      }

      try {
        const data = await request(registerUrl, "POST", {
          name,
          email,
          password,
        });

        if (data.name) {
          // Store the user's input name to local storage
          localStorage.setItem("userID", email);

          // Clear the input fields
          document.getElementById("name").value = "";
          document.getElementById("email").value = "";
          document.getElementById("password").value = "";
          alert("Successfully registered! Please proceed to login.");
        } else {
          alert(data.message || "Registration failed. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
}

export { viewRegisterForm, attemptRegister };
