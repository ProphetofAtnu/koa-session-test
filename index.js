const Koa = require("koa");
const Router = require("koa-router");
const session = require("koa-session");
const bodyParser = require("koa-bodyparser");
const fs = require("fs");

const app = new Koa();
app.keys = ["sekrit"];

app.use(bodyParser());
app.use(session(app));

const r = new Router();

r.get("/", ctx => {
  ctx.type = "html";
  ctx.body = fs.createReadStream("./public/index.html");
});

r.get("/session", ctx => {
  const sess = ctx.session;
  ctx.body = sess;
});

r.post("/session", ctx => {
  const { body } = ctx.request;
  console.log(body);
  if (!body) {
    ctx.body = "ERROR";
  }
  ctx.session = { body };

  ctx.body = "OK";
});

r.get("/static/:file", async ctx => {
  console.log("Hit static");
  const { file } = ctx.params;
  const fr = function() {
    return new Promise(function(resolve, reject) {
      fs.readFile("./public/" + file, (err, buf) => {
        if (err) {
          reject(err);
        }
        resolve(buf);
      });
    });
  };

  try {
    ctx.type = file.split(".")[1];
    ctx.body = await fr();
  } catch {
    ctx.throw(404);
  }
});

app.use(r.routes());

app.listen(3000);
