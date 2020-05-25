let aboutMessage = 'Issue Tracker API V1.0';

function setMessage(_, { message }) {
  return (aboutMessage = message);
}


function getMessage() {
	return aboutMessage;
}

module.exports = { getMessage, setMessage}