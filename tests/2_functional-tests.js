/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);


suite('Functional Tests', function() {

  //
  // ----[EXAMPLE TEST]----
  // Each test should completely test the response of the API end-point including response status code!
  
  
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /* ----[END of EXAMPLE TEST]----*/
  

  suite('Routing tests', function() {
  let testId;

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
       chai.request(server)
        .post('/api/books/')
        .send({ title: 'Test Book Title'})
        .end(function(err, res){
         assert.equal(res.status, 200);
         assert.equal(res.body.title, 'Test Book Title');
         assert.property(res.body, 'title');
         assert.property(res.body, 'comments');
         assert.property(res.body, '_id');
         assert.isArray(res.body.comments);
         done();
       });
        
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({ title: ''})
        .end((err,res)=>{
          assert.equal(res.status, 400);
          assert.equal(res.text, 'Missing title.');
          done();
        });
        
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end((err,res)=> {
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], '_id', 'output documents should have an id');
          assert.property(res.body[0], 'title', 'output documents should have a title');
          assert.property(res.body[0], 'commentcount', 'output documents should have a comment count');
          testId = res.body[0]._id;
          //console.log(testId);
          done();
 
      });
        
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/65431351351')
        .end((err,res)=> {
          assert.equal(res.status, 400);
          assert.equal(res.text, 'No book exists.');
          done();
        });   
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
         chai.request(server)
        .get('/api/books/'+testId)
        .end((err,res)=> {
           assert.equal(res.status, 200);
           assert.equal(res.body._id, testId);
           assert.property(res.body, 'title');
           assert.property(res.body, 'comments');
           assert.property(res.body, '_id');
           assert.isArray(res.body.comments);
           done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post('/api/books/'+testId)
        .send({comment: 'test comment'})
        .end((err,res)=> {
           assert.equal(res.status, 200);
           assert.include(res.body.comments, 'test comment');
           assert.property(res.body, 'title');
           assert.property(res.body, 'comments');
           assert.property(res.body, '_id');
           assert.isArray(res.body.comments);
           done();
        });
      });
      
    });

  });

});
