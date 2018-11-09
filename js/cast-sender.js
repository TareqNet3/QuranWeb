var applicationID = '1102AD00';
var namespace = 'urn:x-cast:tk.tareq.quran.cast';
var session = null;

/**
 * Call initialization for Cast
 */
if (!chrome.cast || !chrome.cast.isAvailable)
{
	setTimeout(initializeCastApi, 1000);
}

/**
 * initialization
 */
function initializeCastApi()
{
	var sessionRequest = new chrome.cast.SessionRequest(applicationID);
	var apiConfig = new chrome.cast.ApiConfig(sessionRequest, sessionListener, receiverListener);

	chrome.cast.initialize(apiConfig, onInitSuccess, onError);
};

/**
 * initialization success callback
 */
function onInitSuccess()
{
	appendMessage("onInitSuccess");
}

/**
 * initialization error callback
 */
function onError(message)
{
	appendMessage("onError: " + JSON.stringify(message));
}

/**
 * generic success callback
 */
function onSuccess(message)
{
	appendMessage("onSuccess: " + message);
}

/**
 * callback on success for stopping app
 */
function onStopAppSuccess()
{
	appendMessage('onStopAppSuccess');
}

/**
 * session listener during initialization
 */
function sessionListener(e)
{
	appendMessage('New session ID:' + e.sessionId);
	session = e;
	session.addUpdateListener(sessionUpdateListener);	
	session.addMessageListener(namespace, receiverMessage);
}

/**
 * listener for session updates
 */
function sessionUpdateListener(isAlive)
{
	var message = isAlive ? 'Session Updated' : 'Session Removed';
	message += ': ' + session.sessionId;
	appendMessage(message);
	if (!isAlive) {
		session = null;
	}
};

/**
 * utility function to log messages from the receiver
 * @param {string} namespace The namespace of the message
 * @param {string} message A message string
 */
function receiverMessage(namespace, message)
{
	appendMessage("receiverMessage: " + namespace + ", " + message);
};

/**
 * receiver listener during initialization
 */
function receiverListener(e)
{
	if (e === 'available' )
	{
		appendMessage("receiver found");
	}
	else
	{
		appendMessage("receiver list empty");
	}
}

/**
 * stop app/session
 */
function stopApp()
{
	session.stop(onStopAppSuccess, onError);
	session = null;
	Connected = false;
}

/**
 * send a message to the receiver using the custom namespace
 * receiver CastMessageBus message handler will be invoked
 * @param {string} message A message string
 */
function sendMessage(message)
{
	if (session != null)
	{
		session.sendMessage(namespace, message, onSuccess.bind(this, "Message sent: " + message), onError);
	}
	else
	{
		ConnectCast(function(ev)
			{
				session.sendMessage(namespace, message, onSuccess.bind(this, "Message sent: " + message), onError);
				Connected = true;
			}, onError);
	}
}

/**
 * append message to debug message window
 * @param {string} message A message string
 */
function appendMessage(message)
{
	console.log(message);
	//var dw = document.getElementById("debugmessage");
	//dw.innerHTML += '\n' + JSON.stringify(message);
};

function ConnectCast(onSuccessConnect, onErrorConnect)
{
	if (session == null || (session != null && session.status != "connected"))
	{
		chrome.cast.requestSession(function(ev)
			{
				session = ev;
				Connected = true;
				onSuccessConnect(ev);
			}, function(ev) {
				Connected = false;
				onErrorConnect(ev);
			});
	}
}

function CastUpdate(JuzaName, SurahName, QuranPageNumber)
{
	var Message = {};
	Message.JuzaName = JuzaName;
	Message.SurahName = "سورة " + SurahName;
	Message.QuranPageNumber = QuranPageNumber;
	sendMessage(JSON.stringify(Message));
}