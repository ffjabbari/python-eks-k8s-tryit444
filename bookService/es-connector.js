
//################ IMPORTS ################ 

const AWS = require('aws-sdk');


//################ CONSTANTS ################ 

var REGION = 'us-east-2';
var DOMAIN = 'search-book-app-es-hrwefl76tkol2md4pht4papwm4.us-east-2.es.amazonaws.com';
var INDEX = 'books';
var TYPE = '_doc';

AWS.config.update({region: REGION})


//################ FUNCTIONS ################ 

function getBook(id, error, success) { indexDocument('GET', id, null, error, success) }
function putBook(id, json) { indexDocument('PUT', id, json) }
function postBook(id, json) { indexDocument('POST', id, json) }

function indexDocument(method, id, document, errorCallback, successCallback) {
  var endpoint = new AWS.Endpoint(DOMAIN);
  var request = new AWS.HttpRequest(endpoint, REGION);

  if(request.method != "GET"){
    request.body = JSON.stringify(document);
    request.headers['Content-Length'] = Buffer.byteLength(request.body);
  }
  request.method = method;
  request.path += INDEX + '/' + TYPE + '/' + id;
  request.headers['host'] = DOMAIN;
  request.headers['Content-Type'] = 'application/json';

  var credentials = new AWS.EnvironmentCredentials('AWS');
  var signer = new AWS.Signers.V4(request, 'es');
  signer.addAuthorization(credentials, new Date());

  var client = new AWS.HttpClient();
  client.handleRequest(request, null, function(response) {
    var responseBody = '';
    response.on('data', function (chunk) {
      responseBody += chunk;
    });
    response.on('end', function (chunk) {
      console.log('Response body: ' + responseBody);
      if(response.statusCode == 404 || response.statusCode == 400) {
        if(errorCallback) errorCallback()
      } else {
        if(successCallback) {
          var returnedJson = JSON.parse(responseBody)._source
          successCallback(returnedJson)
        }
      }
    });
  }, function(error) {
    console.log('Error: ' + error);
    if(errorCallback) errorCallback()
  });
}

function searchBooks(keyword, errorCallback, successCallback) { 
  var endpoint = new AWS.Endpoint(DOMAIN);
  var request = new AWS.HttpRequest(endpoint, REGION);
  request.method = "GET";
  request.path += INDEX + '/_search' + '?q=' + keyword;
  request.headers['host'] = DOMAIN;
  request.headers['Content-Type'] = 'application/json';
  var credentials = new AWS.EnvironmentCredentials('AWS');
  var signer = new AWS.Signers.V4(request, 'es');
  signer.addAuthorization(credentials, new Date());
  var client = new AWS.HttpClient();
  client.handleRequest(request, null, function(response) {
    var responseBody = '';
    response.on('data', function (chunk) {
      responseBody += chunk;
    });
    response.on('end', function (chunk) {
      console.log(response.statusCode + ' | Response body: ' + responseBody);
      if(response.statusCode == 404 || response.statusCode == 400) {
        if(errorCallback) errorCallback()
      } else {
        if(successCallback) {
          var returnedJson = JSON.parse(responseBody)
          returnedJson = returnedJson.hits.hits.map((esDoc) => {return esDoc._source})
          successCallback(returnedJson)
        }
      }
    });
  }, function(error) {
    console.log('Error: ' + error);
    if(errorCallback) errorCallback()
  });
}

//################ MODULE EXPORT ################

module.exports = { searchBooks, getBook, putBook, postBook }
