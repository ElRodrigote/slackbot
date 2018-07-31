'use strict';

const {RTMClient, WebClient} = require('@slack/client');
let rtm = null;
let nlp = null;

function addAuthenticatedHandler (rtm, handler) {
	rtm.on('authenticated', handler);
};

function handleOnAuthenticated (rtmStartData) {
	console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
}

function handleOnMessage (message) {
	nlp.ask(message.text, (err, res) => {
		if (err) {
			console.log(err);
			return;
		}

		if (!res.intent) {
			return rtm.sendMessage("Sorry, I don't know what you are talking about.", message.channel);
		} else if (res.intent[0].value == 'time' && res.location) {
			return rtm.sendMessage(`I don't yet know the time in ${res.location[0].value}`, message.channel);
		} else {
			return rtm.sendMessage("Sorry, I don't know what you are talking about.", message.channel);
		}
	});

	rtm.sendMessage("Sorry, I didn't understand.", message.channel);
};

module.exports.init = function slackClient(token, logLevel, nlpClient) {
	rtm = new RTMClient(token, {logLevel: logLevel});
	nlp = nlpClient;
	addAuthenticatedHandler(rtm, handleOnAuthenticated);
	rtm.on('message', handleOnMessage);
	return rtm;
};

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;