(function (params) {
    const addEvent = document.getElementById('voteNow');
    addEvent.addEventListener('click', ()=>{
        window.location.replace("../vote/vote.html");
    });

    const viewResults = document.getElementById('viewResults');
    viewResults.addEventListener('click', ()=>{
        window.location.replace("../viewResults/viewResults.html");
    });
    
    const logout = document.getElementById('out');
    logout.addEventListener('click', ()=>{
        // Clear session storage.
        sessionStorage.clear();

        // Delete residual cookies. // TODO: Fix deletion of cookie.
        document.cookie.split(";").forEach(function(c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        // Redirect to sign in/up page.
        window.location.replace("../signInSignUp/signInSignUp.html");
    });

})();