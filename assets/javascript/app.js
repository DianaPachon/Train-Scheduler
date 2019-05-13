
$(document).ready(function(){
    // Initialize Firebase
 // Your web app's Firebase configuration
 var firebaseConfig = {
  apiKey: "AIzaSyBVckOwhX90IBwV2ssMd-ttu2SbX6fLrpM",
  authDomain: "train-schedule-f4417.firebaseapp.com",
  databaseURL: "https://train-schedule-f4417.firebaseio.com",
  projectId: "train-schedule-f4417",
  storageBucket: "train-schedule-f4417.appspot.com",
  messagingSenderId: "711459617681",
  appId: "1:711459617681:web:fe7a616aecf5003c"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
    // Create a variable to reference the database.
    var database = firebase.database();

    

    $("#submit").on("click", function(){
      
  
  
      //Capture user input for each field
      var trainName = $("#train-name").val().trim();
      var destination = $("#destination").val().trim();
      var firstTime = $("#first-train").val().trim();
      var frequency= $("#frequency").val().trim();
  
      // Creates local "temporary" object for holding train data
      var newTrain = {
          name: trainName,
          destination: destination,
          firstTrain: firstTime,
          frequency: frequency
      };
  
      //Uploads train data to the database
      database.ref().push(newTrain);
  
      //Logs to the console
      console.log(newTrain.name);
      console.log(newTrain.destination);
      console.log(newTrain.firstTrain);
      console.log(newTrain.frequency);
  
  
      // Clear all the text boxes
      $("#train-name").val("");
      $("#destination").val("");
      $("#first-train").val("");
      $("#frequency").val("");
  
    });
  
    //Create Firebase event for adding a train to the database and a row in the html when a user adds an entry
    database.ref().on("child_added", function(rowAdded) {
      console.log(rowAdded.val());
  
      // Store everything into a variable.
      var trainName = rowAdded.val().name;
      var destination = rowAdded.val().destination;
      var frequency = rowAdded.val().frequency;
      var firstTime = rowAdded.val().firstTrain;
  
      //Move the time entered one year back so we make sure the current time is after
      var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
      console.log("First Time Converted: " + firstTimeConverted);
  
      //Variable to calculate the nect train based on current time
      var currentTime = moment();
      console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
  
      //Calculate the difference in time between current and the one entered by user
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      console.log("DIFFERENCE IN TIME: " + diffTime);
  
      //Calculate the remaining of difference in time divided by frequency to calculate next train
      var tRemaining = diffTime % frequency;
      console.log("Time remaining: " + tRemaining);
  
      //Calculate minutes to next train
      var minutesToNextTrain = frequency - tRemaining;
      console.log("Minutes till next train: " + minutesToNextTrain);
  
      //Add minutes to next train to current time to display time of next train
      var nextTrain = moment().add(minutesToNextTrain, "minutes");
      var nextTrainDisplay = moment(nextTrain).format("hh:mm a");
      console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm a"));
  
      //Append all this info to the table
      var newRow = $("<tr>").append(
          $("<td>").text(trainName),
          $("<td>").text(destination),
          $("<td>").text(frequency),
          $("<td>").text(nextTrainDisplay),
          $("<td>").text(minutesToNextTrain)
      );
      
      //Prevents filling the table with incomplete form
      if((trainName !== '') || (destination !== '') || (frequency !== '') || (firstTime !== '')) {
        $("#train-data").append(newRow);
      }
    })
  });