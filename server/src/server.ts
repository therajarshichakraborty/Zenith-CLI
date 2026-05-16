import {createServer} from "node:http"
import { createApp } from "./app"

 async function main():Promise<void>{
    const app = await createApp();
    const server = createServer(app)

    server.listen(3000,()=>{
        console.log(`server is listning to the port http://localhost:${3000}`);
    })
}

main()


