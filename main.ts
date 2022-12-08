import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

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

// Hello World!
app.use((ctx, next) => {
  ctx.response.body = "Hello World!";
  next()
});

const router = new Router();
router
  .get("/", (ctx) => {
    ctx.response.body = `<!DOCTYPE html>
    <html>
      <head><title>Hello oak!</title><head>
      <body>
        <a href='/'>Home</a><a href='/about'>About</a>
        <h1>Home</h1>
      </body>
    </html>
  `;
  })
  .get("/about", (ctx) => {
    ctx.response.body = `<!DOCTYPE html>
    <html>
      <head><title>Hello oak!</title><head>
      <body>
        <a href='/'>Home</a><a href='/about'>About</a>
        <h1>About</h1>
      </body>
    </html>`;
  })
  

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = 8000
console.log(`Server listening on http://localhost:${PORT}`)
await app.listen({ port: PORT });