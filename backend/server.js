const express = require("express")
const cors = require("cors")
const app = express()
app.use(cors())
app.get('/', (req, res) => {
  res.status(200).send("Hello!!")
})

const port = 5000
app.listen(port, () => {
  console.log(`you are listening to the port ${port}`)
})