
# IMPORTS 

from flask import Flask, request, json
import requests
app = Flask(__name__)


# CONSTANTS 

SERVER_HOST = '0.0.0.0'
SERVER_PORT = 80

RECC_CIRCUIT_BREAKER_HOST = 'http://10.100.236.41:83/books'
BOOK_SERVICE_HOST = 'http://10.100.144.244:3002/books'
VALID_AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJLUkFNRVJTIiwibHVscyI6IktSQU1FUlMiLCJjcmVhdGVkIjoxNjE3MjMwNzUxM zIwLCJyb2xlcyI6W10sImlzcyI6InRjdS5nb3YuYnIiLCJlaW8iOiIxMC4xMDAuMTkyLjUxIiwibnVzIjoiSk9BTyBBTkR PTklPUyBTUFlSSURBS0lTIiwibG90IjoiU2VnZWMiLCJhdWQiOiJPUklHRU1fUkVRVUVTVF9CUk9XU0VSIiwidHVzIjoiV ENVIiwiY3VscyI6MjI1LCJjb2QiOjIyNSwiZXhwIjoxNjE3MjczOTUxMzIwLCJudWxzIjoiSk9BTyBBTkRPTklPUyBTUFl SSURBS0lTIn0.qtJ0Sf2Agqd_JmxGKfqiLw8SldOiP9e21OT4pKC8BqdXrJ0plqOWHf0hHbwQWp-foEBZzAUWX0J-QHtLy Q7SRw'


# VALIDATIONS 

def responseIfInvalidRequest(req):
  agentHeader = req.headers.get('User-Agent', None)
  if agentHeader == None:
    response = app.response_class(
      response=json.dumps({'message': 'User-Agent header required.'}),
      status=400,
      mimetype='application/json'
    )
    return response
  
  auth = req.headers.get('Authorization', None)
  if auth == None or auth != VALID_AUTH_TOKEN:
    response = app.response_class(
      response=json.dumps({'message': 'Valid Authorization Token required.'}),
      status=401,
      mimetype='application/json'
    )
    return response
  
  return None

def isMobileAgent(req):
  agentHeader = req.headers.get('User-Agent', None)
  
  if 'Mobile' in agentHeader:
    return True

  return False

  
# ROUTES 

@app.route('/books/<isbn>/related-books', methods=['GET'])
def getBookReccomendation(isbn=None):
  response = responseIfInvalidRequest(request)
  if response: 
    return response

  path = '/{}/related-books'.format(isbn)
  serviceRes = requests.get(RECC_CIRCUIT_BREAKER_HOST+path)

  if serviceRes.status_code == 204:
    return app.response_class(
      response=json.dumps({}),
      status=204,
      mimetype='application/json'
    )

  return getResponseFor(serviceRes)


@app.route('/books', methods=['POST'])
def addBook():
  response = responseIfInvalidRequest(request)
  if response: 
    return response

  serviceRes = requests.post(BOOK_SERVICE_HOST, data=request.get_json())

  return getResponseFor(serviceRes)


@app.route('/books/<isbn>', methods=['PUT'])
def putBook(isbn=None):
  response = responseIfInvalidRequest(request)
  if response: 
    return response

  path = '/{}'.format(isbn)
  serviceRes = requests.put(BOOK_SERVICE_HOST+path, data=request.get_json())
  
  return getResponseFor(serviceRes)


@app.route('/books/isbn/<isbn>', methods=['GET'])
def getBook(isbn=None):
  response = responseIfInvalidRequest(request)
  if response: 
    return response

  path = '/isbn/{}'.format(isbn)
  serviceRes = requests.get(BOOK_SERVICE_HOST+path)
  
  if isMobileAgent(request):
    returnedCode = serviceRes.status_code
    returnedBody = serviceRes.json()

    if 'genre' in returnedBody and 'non-fiction' == returnedBody['genre']:
      returnedBody['genre'] = 3

      response = app.response_class(
        response=json.dumps(returnedBody),
        status=returnedCode,
        mimetype='application/json'
      )
      return response

  return getResponseFor(serviceRes)



# HELPERS 

def getResponseFor(serviceRes):
  returnedCode = serviceRes.status_code
  returnedBody = serviceRes.json()

  response = app.response_class(
    response=json.dumps(returnedBody),
    status=returnedCode,
    mimetype='application/json'
  )

  return response


# RUN APP

if __name__ == '__main__':
  print('bookBFF listening @ {}:{}'.format(SERVER_HOST, SERVER_PORT))
  app.run(host=SERVER_HOST, port=SERVER_PORT)