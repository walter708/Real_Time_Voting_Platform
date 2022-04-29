const registerButton = document.getElementById('registerButton');
const registerForm = document.getElementById('registerForm');
const container = document.getElementById('container');

const localhost_addr = 'http://localhost:5000';

registerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const rawFormData = new FormData(registerForm);
    const formDataAdditional = Object.fromEntries(rawFormData);

    const formData = {};

    for (const child of registerForm.querySelectorAll('.registerField')) {
        formData[child.id] = child.value;
    }

    let orgName = sessionStorage.getItem("orgName");
    let username = sessionStorage.getItem("username");
    let email = sessionStorage.getItem("email");
    let password = sessionStorage.getItem("password");

    formData.orgName = orgName;
    formData.username = username;
    formData.email = email;
    formData.password = password;

    formData.gender = formDataAdditional.gender;

    let resStatus = null;
    fetch(localhost_addr + '/users/register', {
        method: 'POST',
        headers: {
        	'Accept': 'application/json',
        	'Content-Type': 'application/json'
    	},
        body: JSON.stringify(formData)
    })
        .then(response => {
            if(response.status === 401) {
                resStatus = 401;
                let errMsg = document.getElementById("errorMessageSignIn");
                errMsg.style.display = "block";
            } else if(response.status === 200) {
                resStatus = 200
            } else if(response.status === 403) {
                resStatus = 403
            }
            return response.json()
        })
        .then(data => {
            if(resStatus === 403) {
                let errMsg = document.getElementById('errorMessage');
                errMsg.style.display = "block";
            } else if(resStatus === 200) {
                sessionStorage.setItem("uid", data.uid);
                window.location.replace(data.url);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        })

});