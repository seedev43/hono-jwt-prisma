import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { prettyJSON } from 'hono/pretty-json'
import { indexRoutes } from './routes/indexRoutes'
import { userRoutes } from './routes/userRoutes'

const app = new Hono()

app.use(cors())
app.use(prettyJSON())

app.route("/", indexRoutes)
app.route("/user", userRoutes)

export default app
