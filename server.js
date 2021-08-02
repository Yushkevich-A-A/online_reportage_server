const http = require('http');
const Koa = require('koa');
const { streamEvents } = require('http-event-stream');
const koaBody = require('koa-body');
const app = new Koa();
const Router = require('koa-router');
const json = require('koa-json');
const router = new Router();
const uuid = require('uuid');
const { eventSubscription } = require('./db/db');
const { NewGame } = require('./newGame/newGame');
const game = new NewGame();

app.use( koaBody({
  urlencoded: true,
  multipart: true,
  json: true,
}));

app.use(json());

app.use( async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*' };

  if (ctx.request.method !== 'OPTIONS') {
    console.log('! OPTIONS');
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }
    ctx.response.status = 204;
  }
})

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());

router.get('/sse', async (ctx) => {
  streamEvents(ctx.req, ctx.res, {
    async fetch(lastEventId) {
      console.log(lastEventId);
      return [];
    },
    stream(sse) {
      eventSubscription.listen(( item => {
        sse.sendEvent({
          data: JSON.stringify(item),
          id: uuid.v4()
        });
      }));
      return () => {};
    }
  });
  eventSubscription.getAllData();
  ctx.respond = false;
});

app.use(router.routes()).use(router.allowedMethods());

server.listen(port);