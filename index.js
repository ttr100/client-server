const express = require('express')

const app = express()
app.use(express.urlencoded({ extended: true }));
const port = 3000

app.get('/', function(req, res){
  let string = req.query.name
  res.send(`
    <html>
      <head>
        <title>Client-Server JS</title>
      </head>
      <body>
        <h1>Hi, ${string}</h1>
        <script>
          // client side javascript
          console.log('Hi, ${string}');
        </script>
      </body>
    </html>
  `)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
