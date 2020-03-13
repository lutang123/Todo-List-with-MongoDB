module.exports.getDate = function() {
  let today = new Date() // similiar as the code var tom1 = new Audio("sounds/tom-1.mp3");  tom1.play();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }
  let day = today.toLocaleDateString("en-US", options);
  return day
}

// shortcut that we can remove module.
exports.getDay = function () {
  let today = new Date()
  let options = {
    weekday: "long"
  }
  return today.toLocalDateString("en-US", options)
}

console.log(module.exports)

// following is long version, to help understand:

// module.exports.getDate =  getDate;
// var getDate = function () {
//   let today = new Date() // similiar as the code var tom1 = new Audio("sounds/tom-1.mp3");  tom1.play();
//   let options = {
//     weekday: "long",
//     day: "numeric",
//     month: "long",
//     year: "numeric"
//   }
//   let day = today.toLocaleDateString("en-US", options);
//   return day
// }

// module.export.getDay = getDay
//
// function getDay() {
//   let today = new Date()
//   let current_dayofweek = today.getDay()
//   let day = ""
//   switch (current_dayofweek) {
//     case 0: //same as if (current_dayofweek === 0) {}
//       day = "Sunday"
//       break;
//     case 1: //same as if (current_dayofweek === 0) {}
//       day = "Monday"
//       break;
//     case 2: //same as if (current_dayofweek === 0) {}
//       day = "Tuesday"
//       break;
//     case 3: //same as if (current_dayofweek === 0) {}
//       day = "Wednesday"
//       break;
//     case 4: //same as if (current_dayofweek === 0) {}
//       day = "Thursday"
//       break;
//     case 5: //same as if (current_dayofweek === 0) {}
//       day = "Friday"
//       break;
//     case 6: //same as if (current_dayofweek === 0) {}
//       day = "Saturday"
//       break;
//     default:
//       console.log("Error: current day is equal to: " + current_dayofweek) //in most case, our default case in switch statement should never be triggered.
//     return
//   }
// }
