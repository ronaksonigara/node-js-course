const http = require("http");

const server = http.createServer((req, res) => {
  res.setHeader("Content-Header", "text/html");
  res.write("<html>");
  res.write("<head><title>My First Page!</title></head>");
  res.write("<body><h1>Hello From Node Js!!!</h1></body>");
  res.write("</html>");
  res.end();
});

server.listen(3000);
