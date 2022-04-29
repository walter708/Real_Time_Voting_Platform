(function() {
    // Linking to the create events page.
    const addEvent = document.getElementById('addEvent');
    addEvent.addEventListener('click', ()=>{
        window.location.replace("../createEvent/createEvent.html");
    })
    
    // Linking to view/close events page.
    const viewEvent = document.getElementById('viewEvent');
    viewEvent.addEventListener('click', () => {
	    window.location.replace("../closeEvent/closeEvent.html");
    });

    // Linking to the view results page.
    const viewResults = document.getElementById('viewResults');
    viewResults.addEventListener('click', () => {
    	window.location.replace("../viewResults/viewResults.html");
    });

    // Delete session storage and stored cookie and return to the sign in/up page.
    const logOut = document.getElementById('logout');
    logOut.addEventListener('click', () => {
        // Clear session storage.
        sessionStorage.clear();

        // Delete residual cookies. // TODO: Fix deletion of cookie.
        // document.cookie.split(";").forEach(function(c) {
        //     document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        // });
        
        deleteCookie('connect.sid', '/', 'localhost'); // TODO

        // Redirect to sign in/up page.
    	window.location.replace("../signInSignUp/signInSignUp.html");
    });
})();


const getCookie = (name) => {
    return document.cookie.split(';').some(c => {
        let cookieName = c.trim().startsWith(name + '=');
        console.log(cookieName);
        return cookieName;
    });
}

const deleteCookie = (name, path, domain) => {
    if (getCookie(name)) {
        document.cookie = name + "=" +
            ((path) ? ";path=" + path : "") +
            ((domain) ? ";domain=" + domain : "") +
            ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
}