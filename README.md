## 前言
你是否好奇：
1. 服务器接收到请求，是否需要检查缓存？
2. 检查什么字段？
3. 什么样的缓存需要服务器端检查？
4. 强制缓存和协商缓存的顺序？
5. 设置max-age:0跟浏览器缓不缓存有关系吗？
6. s-max-age的作用？
7. 浏览器如何检查比较缓存是否过期？这些字段的优先级是怎么样的？
8. Last-Modified和Etag有什么区别？
9. Etag这个字符串是怎么生成的？
10. 什么是from disk cache和from memory cache？什么时候触发？
11. 什么是启发式缓存？在什么条件下触发？

本文将为你解答一切疑问：[7个nodejs小实战，带你彻底了解http缓存](https://juejin.cn/post/6963250336920240158)