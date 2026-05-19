import express,{Request,Response} from "express"
import cors from "cors"

const app = express();
const port = 4000

app.use(
  cors({
    origin: "http://localhost:4000", 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    credentials: true, 
  })
);


app.use(express.json());

app.get("/", async (req:Request, res:Response) => {
    res.json({
        ok:"jvidf"
    })
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});