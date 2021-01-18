
##########################################################################
# DISCLAIMER: The author, James W. Price, of the material herein has     #
# used his best effort in preparing material. The author makes           #
# no warranty of any kind, expressed or implied, with regard to material #
# or documentation. The author shall not be liable in any event for     #
# incidental or consequential damages in connection with, or arising out #
# of, the furnishing, performance, or use of this material.              #
##########################################################################

'use strict'

const AWS = require('aws-sdk');
const sqs = new AWS.SQS({
    region: process.env.region
});

const CUSTOMER_SERVICE_QUEUE = process.env.customerServiceQueue;

module.exports.notifyCustomerServiceForReview = (orderId, orderReview) => {
    const review = {
        orderId: orderId,
        orderReview: orderReview,
        date: Date.now()
    };

    const params = {
        MessageBody: JSON.stringify(review),
        QueueUrl: CUSTOMER_SERVICE_QUEUE
    };

    return sqs.sendMessage(params).promise();
}