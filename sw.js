const V='tg8',A=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','favicon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(A.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
/* bản đã lưu trước, tải bản mới ngầm: mở nhanh kể cả khi sóng yếu, lần mở sau có bản mới; dữ liệu người dùng nằm ở localStorage nên không bao giờ qua đây */
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
e.respondWith(caches.open(V).then(async c=>{
const hit=await c.match(r,{ignoreSearch:true});
const net=fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res}).catch(()=>null);
if(hit){e.waitUntil(net);return hit}
return (await net)||(r.mode==='navigate'?c.match('index.html'):Response.error())}))});
