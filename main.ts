import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { recordRoutes } from "./routes/recordRoutes.ts";
import { userRoutes } from "./routes/userRoutes.ts";

const app = new Application(); 
const router = new Router();

// PORT declared here, will be moved to .env later
// polytech's dokku only accepts port 5000 for the backend
const PORT = Number(Deno.env.get("PORT") ?? 5000);

// Routes
router.get("/", (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = { message: "Hello Oak!" };
});
recordRoutes(router);
userRoutes(router);

// Register router
app.use(router.routes());
app.use(router.allowedMethods());

// listen to port
await app.listen({ port: PORT });
console.log(`Server started on port ${PORT}`);

