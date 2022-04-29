(function(){
  let authLevel = "";

  const event_container = document.getElementById('event_container');
  const graphics_containerID = document.getElementById('graphics_containerID');
  
  const localhost_addr = 'http://localhost:5000';
  
  navigation.addEventListener('click' , () =>{
    if(authLevel === "admin" || authLevel === "superAdmin") {
      window.location.replace("../adminDashboard/dashboard_admin.html");
    } else if(authLevel === "voter") {
      window.location.replace("../voterDashboard/dashboard_voter.html");
    } else {
      window.location.replace("");
    }
  })

  const log_out = document.getElementById('log_out');
  log_out.addEventListener('click' , () =>{
    // Clear session storage.
    sessionStorage.clear();

    // Delete residual cookies. // TODO: Fix deletion of cookie.
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    })

    window.location.replace("../signInSignUp/signInSignUp.html");
  });

  const addResult = (eventName , startDate , endDate , candidateName , candidateVotes) => {
    const name = document.createElement('div');
    const DateLabelOne = document.createElement('label');
    const DateLabelTwo = document.createElement('label');
    const DateValueOne = document.createElement('span');
    const DateValueTwo = document.createElement('span');
    const DateItemOne = document.createElement('div');
    const DateItemTwo = document.createElement('div');
    const winnersBox = document.createElement('div')
    const winnersLabel = document.createElement('h4')
    const winnersName = document.createElement('div')
    const votesLabel = document.createElement('h4')
    const winnersVotes = document.createElement('div')
    const description = document.createElement('div');
    const box = document.createElement('div');
    const details = document.createElement('div');
    const card = document.createElement('div');
    const column = document.createElement('div');
    
    name.classList.add('card__event-name');
    name.innerHTML = eventName;
    
    description.classList.add('card__event-description');
    
    DateLabelOne.classList.add('card__date-label')
    DateLabelOne.innerHTML = "Started On";
    
    DateValueOne.classList.add('card__date_value');
    DateValueOne.innerHTML = startDate;
    
    DateItemOne.classList.add('card__date_item');
    DateItemOne.appendChild(DateLabelOne);
    DateItemOne.appendChild(DateValueOne);
    description.appendChild(DateItemOne);
    
    
    DateLabelTwo.classList.add('card__date-label')
    DateLabelTwo.innerHTML = "Ended On";
    
    DateValueTwo.classList.add('card__date_value');
    DateValueTwo.innerHTML = endDate;
    
    DateItemTwo.classList.add('card__date_item');
    DateItemTwo.appendChild(DateLabelTwo);
    DateItemTwo.appendChild(DateValueTwo);
    description.appendChild(DateItemTwo);
    
    
    winnersBox.classList.add('card__winners-box')
    
    winnersLabel.classList.add('card__winners-label')
    winnersLabel.innerHTML = 'Winner'
    
    winnersName.classList.add('card__winners-name')
    winnersName.innerHTML = candidateName
    
    votesLabel.classList.add('card__winners-votes-label')
    votesLabel.innerHTML = "Votes"
    
    winnersVotes.classList.add('card__winners-votes')
    winnersVotes.innerHTML = candidateVotes
    
    winnersBox.appendChild(winnersLabel)
    winnersBox.appendChild(winnersName)
    winnersBox.appendChild(votesLabel)
    winnersBox.appendChild(winnersVotes)
    
    box.classList.add('card__event_box');
    box.appendChild(name);
    box.appendChild(description);
    
    details.classList.add('card__event-details');
    details.appendChild(box);
    details.appendChild(winnersBox);
    
    card.classList.add('card');
    card.appendChild(details);

    column.classList.add('col-1-3');
    column.appendChild(card);
    
    return column;
  }
  
  async function loadResult() {
    // Get user's ID from session storage.
    const uid = window.sessionStorage.getItem('uid');
    console.log("Loading results for user: " + uid);

    await fetch(localhost_addr + `/votes/loadResultsForUser?uid=${uid}`, {
      method:'GET',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    .then(response => {
      return response.json();
    })

    .then(data => {
      console.log(data);
      let mesg_id = 0;

      for (const event of data.resultsForUser){
        let temp = addResult(event.eventName, event.startDate , event.endDate, event.candidateName , event.candidateVotes, mesg_id);
        event_container.append(temp);
        mesg_id = mesg_id + 1;
      }

      authLevel = data.authLevel;

      graphics_containerID.style = 'display:none';
      event_container.style = 'display: flex';
    })
  }
  

  function onMonitor(element, callback) {
    new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if(entry.intersectionRatio > 0) {
          callback(element);
          observer.disconnect();
        }
      });
    }).observe(element);
  }
 
  onMonitor(graphics_containerID, loadResult)
  
})();