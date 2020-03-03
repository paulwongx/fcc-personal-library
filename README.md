**FreeCodeCamp**- Information Security and Quality Assurance
------

Project Personal Library

1) ADD YOUR MongoDB connection string to .env without quotes as db
    `example: DB=mongodb://admin:pass@1234.mlab.com:1234/fccpersonallib`
2) SET NODE_ENV to `test` without quotes
3) You need to create all routes within `routes/api.js`
4) You will add any security features to `server.js`
5) You will create all of the functional tests in `tests/2_functional-tests.js`

----

Learning Notes
1. Two different ways of updating a document - findOneAndUpdate and updateOne then findOne
2. Deleting all documents using deleteMany()
3. Connecting to MongoDB within each GET/POST/DELETE request using async await
4. Using include in chai.js
5. Sending response codes using return res.status(400).send('error');
6. Including Content Security Policies which can easily mess up your code
