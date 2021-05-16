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

// 获取请求资源类型
function parseMime(url) {
  // path.extname获取路径中文件的后缀名
  let extName = path.extname(url);
  extName = extName ? extName.slice(1) : 'unknown'
  return mimes[extName]
}

// 获取请求资源内容
const parseStatic = (dir) => {
  return new Promise((resolve) => {
    resolve(fs.readFileSync(dir), 'binary')
  })
}

const md5 = (data) => {
  let hash = crypto.createHash('md5');
  return hash.update(data).digest('base64');
}

app.use(async (ctx) => {
  const url = ctx.request.url;
  
  if (url === '/') {
    ctx.set('Content-Type', 'text/html')
    ctx.body = await parseStatic('./index.html')
  }
  else {
    const filePath = path.resolve(__dirname, `.${url}`)
    ctx.set('Content-Type', parseMime(url))

    // ctx.set('Cache-Control', 'max-age=0');
    const buffer = fs.readFileSync(filePath);
    const fileMd5 = md5(buffer); // 生成文件的md5值
    const noneMatch = ctx.request.headers['if-none-match'];

    if (noneMatch === fileMd5) {
      ctx.status = 304;
      return;
    }
    // 资源被更新

    console.log('Etag 缓存失效')
    
    ctx.set('Etag', fileMd5)
    ctx.body = await parseStatic(filePath)
  }
});

app.use(async (ctx) => {
  ctx.body = 'hello koa'
});

app.listen(3000, () => {
  console.log('starting at port 3000');
});