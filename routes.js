const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter Message</title></head>");
    res.write(
      "<body><form action='/message' method='POST'> <input type='text' name='message' /> <button type='submit'>Submit</button> </form></body>"
    );
    res.write("</html>");
    return res.end();
  }

  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });

    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];

      // writeFileSync: block further code
      //   fs.writeFileSync("message.txt", message);

      return fs.writeFile("message.txt", message, (error) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
  res.setHeader("Content-Header", "text/html");
  res.write("<html>");
  res.write("<head><title>My First Page!</title></head>");
  res.write("<body><h1>Hello From Node Js!!!</h1></body>");
  res.write("</html>");
  res.end();
};

// module.exports = requestHandler;

// module.exports = {
//   requestHandler,
// };

// module.exports.requestHandler = requestHandler;

exports.requestHandler = requestHandler;
