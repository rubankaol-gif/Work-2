//HELLO WORLD
console.log("HELLO WORLD");

//BABY STEPS
let sum = 0;

for (let i = 2; i < process.argv.length; i++) {
  sum += Number(process.argv[i]);
}

console.log(sum);


//MY FIRST I/O!
const fs = require('fs');

const content = fs.readFileSync(process.argv[2]);
const lines = content.toString().split('\n').length - 1;

console.log(lines);


//MY FIRST ASYNC I/O!
const fs = require('fs');

fs.readFile(process.argv[2], 'utf8', function (err, data) {
  if (err) return console.error(err);

  const lines = data.split('\n').length - 1;
  console.log(lines);
});


//FILTERED LS
const fs = require('fs');
const path = require('path');

const folder = process.argv[2];
const extension = '.' + process.argv[3];

fs.readdir(folder, function (err, list) {
  if (err) return console.error(err);

  list.forEach(function (file) {
    if (path.extname(file) === extension) {
      console.log(file);
    }
  });
});



//MAKE IT MODULAR
const mymodule = require('./mymodule');

const dir = process.argv[2];
const ext = process.argv[3];

mymodule(dir, ext, function (err, list) {
  if (err) return console.error(err);

  list.forEach(function (file) {
    console.log(file);
  });
});



//MODULE (mymodule.js)
const fs = require('fs');
const path = require('path');

module.exports = function (dir, ext, callback) {
  fs.readdir(dir, function (err, list) {
    if (err) return callback(err);

    const filtered = list.filter(function (file) {
      return path.extname(file) === '.' + ext;
    });

    callback(null, filtered);
  });
};


//HTTP CLIENT
const http = require('http');

http.get(process.argv[2], function (response) {
  response.setEncoding('utf8');
  response.on('data', console.log);
  response.on('error', console.error);
}).on('error', console.error);


//HTTP COLLECT
const http = require('http');

http.get(process.argv[2], function (response) {
  response.setEncoding('utf8');

  let body = '';

  response.on('data', function (chunk) {
    body += chunk;
  });

  response.on('end', function () {
    console.log(body.length);
    console.log(body);
  });

  response.on('error', console.error);
});


//JUGGLING ASYNC
const http = require('http');

const results = [];
let completed = 0;

function fetch(index) {
  http.get(process.argv[2 + index], function (response) {
    response.setEncoding('utf8');

    let data = '';

    response.on('data', chunk => data += chunk);

    response.on('end', function () {
      results[index] = data;
      completed++;

      if (completed === 3) {
        console.log(results[0]);
        console.log(results[1]);
        console.log(results[2]);
      }
    });
  });
}

fetch(0);
fetch(1);
fetch(2);


//TIME SERVER
const net = require('net');

function pad(n) {
  return String(n).padStart(2, '0');
}

function now() {
  const d = new Date();

  return (
    d.getFullYear() + '-' +
    pad(d.getMonth() + 1) + '-' +
    pad(d.getDate()) + ' ' +
    pad(d.getHours()) + ':' +
    pad(d.getMinutes())
  );
}

const server = net.createServer(socket => {
  socket.end(now() + '\n');
});

server.listen(Number(process.argv[2]));



//HTTP FILE SERVER
const http = require('http');
const fs = require('fs');

const port = Number(process.argv[2]);
const file = process.argv[3];

http.createServer((req, res) => {
  fs.createReadStream(file).pipe(res);
}).listen(port);



//HTTP UPPERCASERER
const http = require('http');
const map = require('through2-map');

http.createServer((req, res) => {
  if (req.method === 'POST') {
    req.pipe(map(chunk => chunk.toString().toUpperCase())).pipe(res);
  }
}).listen(Number(process.argv[2]));



//HTTP JSON API SERVER
const http = require('http');

http.createServer((req, res) => {
  const u = new URL(req.url, 'http://localhost');

  const iso = u.searchParams.get('iso');
  const date = new Date(iso);

  let result;

  if (u.pathname === '/api/parsetime') {
    result = {
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds()
    };
  } 
  else if (u.pathname === '/api/unixtime') {
    result = {
      unixtime: date.getTime()
    };
  }

  if (result) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  } else {
    res.writeHead(404);
    res.end();
  }
}).listen(Number(process.argv[2]));
