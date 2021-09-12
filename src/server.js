"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("./http");
require("./websocket");
http_1.server.listen(3000, function () { return console.log('Server is running'); });
