document.addEventListener("DOMContentLoaded", function() {

  var channelArray = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
  var url = "https://wind-bow.glitch.me/twitch-api/"
  var channels = document.getElementById("container");

  // loop through all default channels in array
  channelArray.forEach(function(item){
    var status = "";
    var iconClass = "";
    var channelName = "";
    var channelUrl = "";
    var currentStream = "";

    // status information request
    var requestStatus = new XMLHttpRequest();

    requestStatus.open('GET', url + 'streams/' + item, true);
    requestStatus.onload = function() {
      if (this.status >= 200 && this.status < 400){
        var dataStatus = JSON.parse(this.response);
        if(dataStatus.stream === null){
          status = "offline";
          iconClass = "fa-times";
          currentStream = "Currently offline"
        } else {
          status = "online";
          iconClass = "fa-check";
          currentStream = dataStatus.stream.channel.status;
        }
        fetchData(item); // call rest of data once status collected.
      } else {
        console.log("ERROR FETCHING DATA");
      }
    };
    requestStatus.onerror = function() {
      console.log("ERROR CONNECTING TO SERVER");
    };
    requestStatus.send();


    // Channel data request
    function fetchData(item){
      var requestChannel = new XMLHttpRequest();
      requestChannel.open('GET', url + 'channels/' + item, true);

      requestChannel.onload = function() {
        if (this.status >= 200 && this.status < 400) {
          var dataChannel = JSON.parse(this.response);
          var row = document.createElement("div");
          var img = document.createElement("img");
          var imgUrl = "http://placehold.it/40x40"

          channels.appendChild(row);
          row.className = "row";
          // channel not found check
          if(dataChannel.display_name) {
            channelName = dataChannel.display_name;
            channelUrl = dataChannel.url;
          } else {
            status = "not-found";
            iconClass = "fa-exclamation";
            channelName = item;
            channelUrl = "#"
            currentStream = "Channel not found"
          }
          // add logo
          if(dataChannel.logo) {
            imgUrl = dataChannel.logo;
          }
          // build the rows with data
          row.innerHTML = '<img src="' + imgUrl + '"><div class="title"><a href="' + channelUrl + '">' + channelName + '</a><br><p>' + currentStream + '</p></div><div class="status"><i class="fa ' + iconClass + '" aria-hidden="true"></i></div>';
          row.className = 'row ' + status;

        } else {
          console.log("ERROR FETCHING DATA");
        }
      };
      requestChannel.onerror = function() {
        console.log("ERROR CONNECTING TO SERVER");
      };
      requestChannel.send();
    }
  });

  // Button event listeners
  document.getElementById("all-button").addEventListener("click", function(){
    removeHandle();
  });
  document.getElementById("online-button").addEventListener("click", function(){
    removeHandle();
    addHandle('.offline');
    addHandle('.not-found');
  });
  document.getElementById("offline-button").addEventListener("click", function(){
    removeHandle();
    addHandle('.online');
    addHandle('.not-found');
  });

  // class manipulation functions
  function removeHandle(){
    var elements = document.querySelectorAll('.row');
    for(var i = 0; i < elements.length; i++){
      elements[i].classList.remove('handle');
    }
  }

  function addHandle(selector){
    var elements = document.querySelectorAll(selector);
    for(var i = 0; i < elements.length; i++){
      elements[i].classList.add('handle');
    }
  }
});