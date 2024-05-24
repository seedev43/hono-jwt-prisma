import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { prettyJSON } from 'hono/pretty-json'
import { indexRoutes } from './routes'
import { userRoutes } from './routes/user'

const app = new Hono()

app.use(cors())
app.use(prettyJSON())

app.route("/", indexRoutes)
app.route("/user", userRoutes)

export default app
