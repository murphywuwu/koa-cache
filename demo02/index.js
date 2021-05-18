const Koa = require('koa');
const app = new Koa();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 定义资源类型列表
const mimes = {
  css: 'text/css',
  less: 'text/less',
  html: 'text/html',
  txt: 'text/plain',
  xml: 'text/html',
  gif: 'image/gif',
  ico: 'image/x-icon',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  tiff: 'image/tiff',
  json: 'application/json',
  pdf: 'application/pdf',
  swf: 'application/x-shockwave-flash',
  wav: 'audio/x-wav',
  wma: 'audio/x-ms-wma',
  wmv: 'video/x-ms-wmv'
}

const parseMime = (url) => {
  let extName = path.extname(url);
  extName = url == '/' ? 'html' :  extName.slice(1)
  return mimes[extName] 
}

const parseStatic = (url) => {
  let filePath = path.relative('/', url);
  if (url == '/') {
    filePath = './index.html'
  }
  return fs.readFileSync(filePath)
}

app.use(async (ctx) => {
  const url = ctx.request.url;
  ctx.set('Content-Type', parseMime(url))
  
  // 设置过期时间为30秒后
  ctx.set('Cache-Control', 'max-age=30')

  ctx.body = parseStatic(url)
});

app.listen(3000, () => {
  console.log('starting at port 3000');
});