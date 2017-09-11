const remote = require('electron').remote
const main = remote.require('./index.js')

var button = document.createElement('button')
button.textContent = 'Open Window'
button.addEventListener('click', () => {
  main.openWindow('mainpage')
}, false)
document.body.appendChild(button)
