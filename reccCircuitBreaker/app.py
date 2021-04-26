
# IMPORTS 

from flask import Flask, request, json
from datetime import datetime 
import requests
app = Flask(__name__)


# CONSTANTS 

SERVER_HOST = '0.0.0.0'
SERVER_PORT = 80

RECC_ENGINE_HOST = 'http://3.131.68.68:80/recommended-titles/isbn'
REQ_TIMEOUT = 3
BREAKER_LAST_OPENED = None

  
# ROUTES 

@app.route('/books/<isbn>/related-books', methods=['GET'])
def getBookReccomendation(isbn=None):
  global BREAKER_LAST_OPENED
  path = '/{}'.format(isbn)

  if not BREAKER_LAST_OPENED or (datetime.now() - BREAKER_LAST_OPENED).total_seconds() > 60: 

    try:
      reccRes = requests.get(RECC_ENGINE_HOST+path, timeout=REQ_TIMEOUT)

      if reccRes.status_code == 204: # NOT FOUND
        return app.response_class(
          response=json.dumps({}),
          status=204,
          mimetype='application/json'
        )
      else: 
        return app.response_class(
          response=json.dumps(reccRes.json()),
          status=reccRes.status_code,
          mimetype='application/json'
        )

    except requests.exceptions.Timeout:
      BREAKER_LAST_OPENED = datetime.now() # TIMEOUT
      
      return app.response_class(
        response=json.dumps({"message": "Service Timed Out"}),
        status=504,
        mimetype='application/json'
      )

  else:
    return app.response_class( # OPEN CIRCUIT
      response=json.dumps({"message": "Waiting for service"}),
      status=503,
      mimetype='application/json'
    )


# STATUS ROUTE - for liveness check

@app.route('/status', methods=['GET'])
def getStatus():
  return app.response_class(
    response=json.dumps({}),
    status=200,
    mimetype='application/json'
  )

  
# RUN APP

if __name__ == '__main__':
  print('reccCircuitBreaker listening @ {}:{}'.format(SERVER_HOST, SERVER_PORT))
  app.run(host=SERVER_HOST, port=SERVER_PORT)