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

const getFilePath = (url) => {
  let filePath = path.relative('/', url);
  if (url == '/') {
    filePath = './index.html'
  }
  return filePath
}

const parseStatic = (url) => {
  const filePath = getFilePath(url)
  return fs.readFileSync(filePath)
}

const md5 = (data) => {
  let hash = crypto.createHash('md5');
  return hash.update(data).digest('base64');
}

app.use(async (ctx) => {
  const url = ctx.request.url;
  ctx.set('Content-Type', parseMime(url))
  
  // 为资源设置30s的缓存时间
  ctx.set('Cache-Control', 'max-age=60')

  // 计算设置etag，并进行对比验证
  const buffer = parseStatic(url)
  const fileMd5 = md5(buffer); // 生成文件的md5值
  const noneMatch = ctx.request.headers['if-none-match']
  
  if (noneMatch === fileMd5) {
    ctx.status = 304;
    return;
  }
  
  console.log('Etag 缓存失效')
  
  ctx.set('Etag', fileMd5)
  ctx.body = buffer
});

app.listen(3000, () => {
  console.log('starting at port 3000');
});