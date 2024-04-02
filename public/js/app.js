
function generateRandom(length = 8) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
};


function showAlert(message, type) {
  const alertDiv = document.createElement("div");
  alertDiv.className = "alert alert-warning";
  alertDiv.style.width = '100%';
  alertDiv.textContent = message;

  document.getElementById("alertPlaceholder").appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
}


function generatePassword(){
  const passwordInput = document.getElementById('password');
  var length = prompt("Enter length: ");
  length = length != '' ? length : 8;
  const generatedPassword = generateRandom(length);
  passwordInput.value = generatedPassword;
}

function toggleVisibility() {  
  var getPasword = document.getElementById("password");  
  const button = document.getElementById("eyePass");  

  if (getPasword.type === "password") {  
    getPasword.type = "text";  
    button.classList.remove('glyphicon-eye-open');
    button.classList.add('glyphicon-eye-close');
  } else {  
    getPasword.type = "password";  
    button.classList.remove('glyphicon-eye-close');
    button.classList.add('glyphicon-eye-open');
  }  
}  

function gotoDelete(site_name) {
  if (confirm('Do you want to delete this password?')) {
      window.location.href = `/delete?site_name=${site_name}`;
      console.log("Ok"); // Log even if user cancels deletion
  }
}