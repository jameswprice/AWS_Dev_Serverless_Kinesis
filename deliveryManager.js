
##########################################################################
# DISCLAIMER: The author, James W. Price, of the material herein has     #
# used his best effort in preparing material. The author makes           #
# no warranty of any kind, expressed or implied, with regard to material #
# or documentation. The author shall not be liable in any event for     #
# incidental or consequential damages in connection with, or arising out #
# of, the furnishing, performance, or use of this material.              #
##########################################################################

'use strict'

const orderManager = require('./orderManager');
const customerServiceManager = require('./customerServiceManager');

const AWS = require('aws-sdk');
const sqs = new AWS.SQS({
    region: process.env.region
});

const DELIVERY_COMPANY_QUEUE = process.env.deliveryCompanyQueue;

module.exports.deliveryOrder = ordersFulfilled => {

    var orderFulfilledPromises = [];

    for (let order of ordersFulfilled) {
        const temp = orderManager.updateOrderForDelivery(order.orderId).then(updatedOrder => {
            orderManager.saveOrder(updatedOrder).then(() => {
                notifyDeliveryCompany(updatedOrder);
            });
        });

        orderFulfilledPromises.push(temp);
    };

    return Promise.all(orderFulfilledPromises);
}

module.exports.orderDelivered = (orderId, deliveryCompanyId, orderReview) => {
    return orderManager.updateOrderAfterDelivery(orderId, deliveryCompanyId).then(updatedOrder => {
        return orderManager.saveOrder(updatedOrder).then(() => {
            return customerServiceManager.notifyCustomerServiceForReview(orderId, orderReview);
        });
    });
}

function notifyDeliveryCompany(order) {
    const params = {
        MessageBody: JSON.stringify(order),
        QueueUrl: DELIVERY_COMPANY_QUEUE
    };

    return sqs.sendMessage(params).promise();
}