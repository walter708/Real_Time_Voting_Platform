const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');

const signUpForm = document.getElementById('signUpForm');
const signInForm = document.getElementById('signInForm');

const container = document.getElementById('container');

const localhost_addr = 'http://localhost:5000';

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

signUpForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = {};

    for (const child of signUpForm.querySelectorAll('.signUpFields')) {
        sessionStorage.setItem(child.id, child.value)
    }

    window.location.replace("../../registration/registration.html");
});

signInForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const signInEmail = document.getElementById('signInEmail').value;
    const signInPassword = document.getElementById('signInPassword').value;

    const formData = {email: signInEmail, password: signInPassword}

    let resStatus = null;
    fetch(localhost_addr + '/users/signIn', {
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
                resStatus = 200;
            } 
            return response.json()
        })
        .then(data => {
            if (resStatus === 200){
                sessionStorage.setItem("uid", data.uid);
                window.location.replace(data.url);
            }
        })
        .catch((error) => {
            console.error('Error:', error)
        })
});