const remote = require('electron').remote
const main = remote.require('./index.js')

var button = document.createElement('button')
button.textContent = 'Open Window'
button.addEventListener('click', () => {
  main.openWindow('mainpage')
}, false)
document.body.appendChild(button)

var button2 = document.getElementById('signInBtn')
button2.addEventListener('click', async function () {
  var license = document.getElementById('key').value;
  console.log(license);
  const validation = await fetch("https://api.keygen.sh/v1/accounts/5e1b90aa-3ddd-426b-bfcc-17b3b83ade92/licenses/actions/validate-key", {
    method: "POST",
    headers: {
      "Content-Type": "application/vnd.api+json",
      "Accept": "application/vnd.api+json"
    },
    body: JSON.stringify({
      "meta": {
        "key": license
      }
    })
  })

  const { meta, errors } = await validation.json()
  console.log(meta)
  if (meta.valid) {
    console.log("Hurra!")
    main.openWindow('mainpage')
  } else {
    console.log("You suck!")
  }

}, false)
