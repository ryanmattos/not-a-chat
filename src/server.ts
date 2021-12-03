import { server } from "./http"
import './websocket'

server.listen(process.env.PORT || 3000, () => console.log('Server is running'))