
# IMPORTS 

from flask import Flask, request, json
import requests
app = Flask(__name__)


# CONSTANTS 

SERVER_HOST = '0.0.0.0'
SERVER_PORT = 80

CUSTOMER_SERVICE_HOST = 'http://172.31.92.239:3001/customers'
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

@app.route('/customers', methods=['POST'])
def addCustomer():
  response = responseIfInvalidRequest(request)
  if response: 
    return response

  serviceRes = requests.post(CUSTOMER_SERVICE_HOST, data=request.get_json())

  return getResponseFor(serviceRes)


@app.route('/customers/<id>', methods=['GET'])
def getCustomer(id=None):
  response = responseIfInvalidRequest(request)
  if response: 
    return response

  path = '/{}'.format(id)
  serviceRes = requests.get(CUSTOMER_SERVICE_HOST+path)

  returnedCode = serviceRes.status_code
  returnedBody = serviceRes.json()

  if 'address' in returnedBody:
      returnedBody.pop('address')
  if 'address2' in returnedBody:
      returnedBody.pop('address2')
  if 'city' in returnedBody:
    returnedBody.pop('city')
  if 'state' in returnedBody:
    returnedBody.pop('state')
  if 'zipcode' in returnedBody:
    returnedBody.pop('zipcode')

  response = app.response_class(
    response=json.dumps(returnedBody),
    status=returnedCode,
    mimetype='application/json'
  )
  return response


@app.route('/customers', methods=['GET'])
def getCustomerByQueryParam():
  response = responseIfInvalidRequest(request)
  if response: 
    return response

  user = request.args.get('userId', '')

  path = '?userId={}'.format(user)
  print(CUSTOMER_SERVICE_HOST+path)
  serviceRes = requests.get(CUSTOMER_SERVICE_HOST+path)

  returnedCode = serviceRes.status_code
  returnedBody = serviceRes.json()

  if 'address' in returnedBody:
      returnedBody.pop('address')
  if 'address2' in returnedBody:
      returnedBody.pop('address2')
  if 'city' in returnedBody:
    returnedBody.pop('city')
  if 'state' in returnedBody:
    returnedBody.pop('state')
  if 'zipcode' in returnedBody:
    returnedBody.pop('zipcode')

  response = app.response_class(
    response=json.dumps(returnedBody),
    status=returnedCode,
    mimetype='application/json'
  )
  return response



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
  print('customerBFF listening @ {}:{}'.format(SERVER_HOST, SERVER_PORT))
  app.run(host=SERVER_HOST, port=SERVER_PORT)