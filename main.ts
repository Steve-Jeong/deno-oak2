import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
// import { staticFileMiddleware } from "./components/staticFileMiddleware.ts";
import {
  ejsEngine,
  oakAdapter,
  viewEngine,
} from "https://deno.land/x/view_engine@v10.5.1/mod.ts";

const app = new Application();

// app.use(staticFileMiddleware)

app.use(
  viewEngine(
    oakAdapter,
    ejsEngine,
    {
      viewRoot: "views",
    },
  ),
);

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

// Timing
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

// // Hello World Middleware
// app.use(async (ctx, next) => {
//   ctx.response.body = "Hello World Middleware!";
//   await next()
// });

const router = new Router();
router
.get("/", async (ctx, next) => {
  ctx.render('index.ejs', {name: '정상태'})
})
.get("/about", async (ctx, next) => {
  ctx.render('about.ejs', {name: '관하여'})
})


app.use(router.routes());
app.use(router.allowedMethods());

const PORT = 8000
console.log(`Server listening on http://localhost:${PORT}`)
await app.listen({ port: PORT });


// // app.ts
// import { Application } from "https://deno.land/x/oak@v10.5.1/mod.ts";
// import { viewEngine, etaEngine, oakAdapter } from "https://deno.land/x/view_engine@v10.5.1c/mod.ts"

// const app = new Application();

// app.use(
//   viewEngine(oakAdapter, etaEngine, {
//     viewRoot: "./views",
//   })
// );

// app.use(async (ctx, next) => {
//   ctx.render("index.eta", { name: "John" } );
// });

// await app.listen({ port: 8000 });