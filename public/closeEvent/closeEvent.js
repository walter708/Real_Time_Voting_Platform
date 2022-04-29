(function(){
  const event_container = document.getElementById('event_container');
  const graphics_containerID = document.getElementById('graphics_containerID')

  const log_out = document.getElementById('log_out')
  const navigation = document.getElementById('navigation')
  
  const localhost_addr = 'http://localhost:5000';
  
  
  function addEvent(eid, eventName, startDate , endDate, mesg_id) {
    const name = document.createElement('div');
    const DateLabelOne = document.createElement('label');
    const DateLabelTwo = document.createElement('label');
    const DateValueOne = document.createElement('span');
    const DateValueTwo = document.createElement('span');
    const DateItemOne = document.createElement('div');
    const DateItemTwo = document.createElement('div');
    const button = document.createElement('button');
    const description = document.createElement('div');
    const endedVote = document.createElement('div');
    const box = document.createElement('div');
    const details = document.createElement('div');
    const card = document.createElement('div');
    const column = document.createElement('div');
    
    
    name.classList.add('card__event-name');
    name.innerHTML = eventName;
    
    description.classList.add('card__event-description');
    
    DateLabelOne.classList.add('card__date-label');
    DateLabelOne.innerHTML = "Start Date";
    
    DateValueOne.classList.add('card__date_value');
    DateValueOne.innerHTML = startDate;
    
    DateItemOne.classList.add('card__date_item');
    DateItemOne.appendChild(DateLabelOne);
    DateItemOne.appendChild(DateValueOne);
    description.appendChild(DateItemOne);
    
    
    DateLabelTwo.classList.add('card__date-label')
    DateLabelTwo.innerHTML = "End Date";
    
    DateValueTwo.classList.add('card__date_value');
    DateValueTwo.innerHTML = endDate;
    
    DateItemTwo.classList.add('card__date_item');
    DateItemTwo.appendChild(DateLabelTwo);
    DateItemTwo.appendChild(DateValueTwo);
    description.appendChild(DateItemTwo);
    
  
    button.classList.add('card__vote_btn');
    button.setAttribute('id' , eid);
    button.setAttribute('type' , 'button');

    button.addEventListener("click", () => {
      
      fetch(localhost_addr + '/votes/closeEvent', {
        method:'POST',
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json'
        },
        body:JSON.stringify({eid})
      })
  
      .then(response => {
        console.log(response); // TODO
        return response.json()
      })
  
      .then(data => {
        console.log(data);
        button.disabled = true;
        const closed_event_message = document.getElementById(mesg_id.toString());
        closed_event_message.innerHTML = 'Closed';
      })
    });
    
    button.innerHTML = "Close";
    
    endedVote.classList.add('card__btn_disabled');
    endedVote.setAttribute('id', `${mesg_id.toString()}`);
    
    box.classList.add('card__event_box');
    box.appendChild(name);
    box.appendChild(description);
    
    details.classList.add('card__event-details');
    details.appendChild(box);
    details.appendChild(button);
    details.appendChild(endedVote);
    
    card.classList.add('card');
    card.appendChild(details);
    
    column.classList.add('col-1-3');
    column.appendChild(card);
    
    return column;
  }


  async function loadEvents() {
    // Get user's ID from session storage.
    const uid = window.sessionStorage.getItem('uid');

    await fetch(localhost_addr + `/votes/loadEventsForUser?uid=${uid}`, {
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
      for (const event of data.eventsForUser){
        let temp = addEvent(event.eid , event.eventName, event.startDate , event.endDate, mesg_id);
        event_container.append(temp);
        mesg_id = mesg_id + 1;
      }

      graphics_containerID.style = 'display:none';
      event_container.style = 'display: flex';
    })
  }
  
  navigation.addEventListener('click' , () =>{
    window.location.replace("../adminDashboard/dashboard_admin.html")
  })
  
  log_out.addEventListener('click' , () =>{
    // Clear session storage.
    sessionStorage.clear();

    // Delete residual cookies. // TODO: Fix deletion of cookie.
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Redirect to sign in/up page.
    window.location.replace("../signInSignUp/signInSignUp.html");
  });
  
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
 

  onMonitor(graphics_containerID, loadEvents)
  
})()

