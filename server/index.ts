// server index to set up port listen
import app from './app'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`)
})
