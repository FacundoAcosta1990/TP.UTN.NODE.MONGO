const http = require("node.http");
const port = process.env.PORT ?? 8000
http.createServer((req, res)=> {
    res.writeHEad(200, {"content-Type": "text/html"});
    res.writeHEad(200, {"content-Type": "text/json"});
 })
 listen(port, "127.0.0.1");
 console.log('server runnin at http://127.0.0.1:${port}');
