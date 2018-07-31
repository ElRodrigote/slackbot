'use strict';

const slackClient = require('../server/slackClient');
const service = require('../server/service');
const http = require('http');
const server = http.createServer(service);

const slackToken = 'xoxb-406667834387-406942732085-o49b1YWLtUqchSKq9GuNCJiH'
const slackLogLevel = 'debug';

const witToken = 'UKW6XQQWZVKO46F3IJ5574N4Q3LP5Q6K';
const witClient = require('../server/witClient')(witToken);

const rtm = slackClient.init(slackToken, slackLogLevel, witClient);
rtm.start();

slackClient.addAuthenticatedHandler(rtm, () => server.listen(3000));

server.on('listening', function () {
	console.log(`SLACKBOT is listening on ${server.address().port} in ${service.get('env')} mode.`);
});
