
//################ IMPORTS ################ 

const AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1'});
AWS.config.update({
  accessKeyId: 'AKIAWQWWY3WMZBY2YZPJ',
  secretAccessKey: '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',
  region: 'us-east-1'
})


//################ CONSTANTS ################ 

var SQS = new AWS.SQS();
var SQS_QUEUE_URL = "https://sqs.us-east-1.amazonaws.com/448200760729/customers"

function sendNewCustomerMessage(messageJson) {
  var sqsParams = {
    MessageBody: JSON.stringify(messageJson),
    QueueUrl: SQS_QUEUE_URL
  }

  SQS.sendMessage(sqsParams, function(err, data) {
    if(err) {
      console.log(err)
    } else {
      console.log("SQS Ping :: New Customer Created")
      console.log(data)
    }
  })
}


//################ MODULE EXPORT ################

module.exports = { sendNewCustomerMessage }