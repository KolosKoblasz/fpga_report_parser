let myImage = document.querySelector('img');

myImage.onclick = function() {
    let mySrc = myImage.getAttribute('src');
    if(mySrc === 'images/fpga.jpeg') {
      myImage.setAttribute('src','images/eye.jpeg');
    } else {
      myImage.setAttribute('src','images/fpga.jpeg');
    }
}

let myButton = document.querySelector('button');
let myHeading = document.querySelector('h1');

function setUserName() {
  let myName = prompt('Please enter your name.');
  localStorage.setItem('name', myName);
  myHeading.textContent = 'FPGA parsing is cool, ' + myName;
}

if(!localStorage.getItem('name')) {
  setUserName();
} else {
  let storedName = localStorage.getItem('name');
  myHeading.textContent = 'FPGA parsing is cool, ' + storedName;
}

myButton.onclick = function() {
  setUserName();
}