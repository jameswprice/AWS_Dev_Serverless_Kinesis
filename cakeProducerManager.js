
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
const ses = new AWS.SES({
    region: process.env.region
});

const CAKE_PRODUCER_EMAIL = process.env.cakeProducerEmail;
const ORDERING_SYSTEM_EMAIL = process.env.orderingSystemEmail;

module.exports.handlePlacedOrders = ordersPlaced => {
    var ordersPlacedPromises = [];

    for (let order of ordersPlaced) {
        const temp = notifyCakeProducerByEmail(order);

        ordersPlacedPromises.push(temp);
    }

    return Promise.all(ordersPlacedPromises);
}

function notifyCakeProducerByEmail(order) {
    const params = {
        Destination: {
            ToAddresses: [CAKE_PRODUCER_EMAIL]
        },
        Message: {
            Body: {
                Text: {
                    Data: JSON.stringify(order)
                }
            },
            Subject: {
                Data: 'New cake order'
            }
        },
        Source: ORDERING_SYSTEM_EMAIL
    };

    return ses.sendEmail(params).promise().then((data) => {
        return data;
    });
}