/* global firebase moment */

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCNfB-wXikmElNeFOduOncccxA5FFjHklQ",
  authDomain: "train-scheduler-e200f.firebaseapp.com",
  databaseURL: "https://train-scheduler-e200f.firebaseio.com",
  projectId: "train-scheduler-e200f",
  storageBucket: "train-scheduler-e200f.appspot.com",
  messagingSenderId: "415583496698"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var empName = $("#train-name-input").val().trim();
  var empRole = $("#destination-input").val().trim();
  var empStart = $("#start-input").val().trim();
  var empRate = $("#rate-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newEmp = {
    name: empName,
    role: empRole,
    start: empStart,
    rate: empRate
  };

  // Uploads train data to the database
  database.ref().push(newEmp);

  // Logs everything to console
  console.log(newEmp.name);
  console.log(newEmp.role);
  console.log(newEmp.start);
  console.log(newEmp.rate);

  // Alert
  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#rate-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var empName = childSnapshot.val().name;
  var empRole = childSnapshot.val().role;
  var empStart = childSnapshot.val().start;       //This value won't show on train table
  var empRate = childSnapshot.val().rate;

  // train Info
  console.log(empName);
  console.log(empRole);
  console.log(empStart);
  console.log(empRate);

  //============================================================================

    // First Time (pushed back 1 year to make sure it comes before current time)
    var empStartConverted = moment(empStart, "hh:mm").subtract(1, "years");
    console.log(empStartConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(empStartConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % empRate;
    console.log(tRemainder);

    // Minute Until Train
    var minAway = empRate - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minAway);

    // Next Train
    var nextTrain = moment().add(minAway, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    var nextArrival = moment(nextTrain).format("hh:mm");

  //============================================================================


  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + empName + "</td><td>" + empRole + "</td><td>" +
  empRate + "</td><td>" + nextArrival + "</td><td>" + minAway + "</td><td>");
});
