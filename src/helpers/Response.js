class Response {
  constructor(statusCode, httpStatus, message, data) {
    this.timeStamp = new Date().toLocaleString();
    this.statusCode = statusCode;
    this.httpStatus = httpStatus;
    this.message = message;
    this.data = data;
  }
}

const HttpStatus = {
  OK: { code: 200, status: "OK" },
  CREATED: { code: 201, status: "CREATED" },
  NO_CONETNT: { code: 204, status: "NO CONTENT" },
  BAD_REQUEST: { code: 400, status: "BAD REQUEST" },
  ALREADY_EXISTS: { code: 417, status: "ALREADY EXISTS" },
  MISSING_REQUEST: { code: 422, status: "MISSING" },
  NOT_FOUND: { code: 404, status: "NOT FOUND" },
  INTERNAL_SERVER_ERROR: { code: 500, status: "INTERNAL SERVER ERROR" },
};

export { Response, HttpStatus };

// examples
//  res
//    .status(HttpStatus.OK.code)
//    .send(
//      new Response(HttpStatus.OK.code, HttpStatus.OK.status, "No patients found")
//    );
