require('dotenv').config()
const cloudinary = require('cloudinary').v2

const url = cloudinary.url('cld-sample-2', {
  sign_url: true,
  transformation: [
    {
      custom_function: {
        function_type: 'remote',
        source: 'https://shiny-cld-remote.netlify.app/.netlify/functions/remote-overlay'
      }
    },
    { border: '15px_solid_coral' }
  ]
})
console.log(url)
