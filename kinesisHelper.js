
##########################################################################
# DISCLAIMER: The author, James W. Price, of the material herein has     #
# used his best effort in preparing material. The author makes           #
# no warranty of any kind, expressed or implied, with regard to material #
# or documentation. The author shall not be liable in any event for     #
# incidental or consequential damages in connection with, or arising out #
# of, the furnishing, performance, or use of this material.              #
##########################################################################

'use strict'

function parsePayload(record) {
    const json = new Buffer(record.kinesis.data, 'base64').toString('utf8');
    return JSON.parse(json)
}

module.exports.getRecords = event => {
    return event.Records.map(parsePayload);
}


