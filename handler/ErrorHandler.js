class ErrorHandler extends Error {
	constructor(errorType) {
		super();
		this._errorType = errorType; /* The error type that extended from ErrorType base class is set. */
	}
}

const handleError = (err, res) => {
  const { _errorType } = err;
  res.status(_errorType.StatusCode).send(_errorType.getErrorMessage()); /* The whatever error that is set is returned with the message to private itself. */
};

/* The ErrorType class is the base class for the errors specified. */
class ErrorType {
	constructor(errorType, message, statusCode) {
		this.ErrorType = errorType;
		this.Message = message;
		this.StatusCode = statusCode;
	} 
	
	getErrorMessage(){}
}

/* It is defined for the errors that cause from the input parameters(422 - Unprocessable Entity). */
class InputParameterError extends ErrorType {
	constructor() {
		super("1", "Invalid input parameter(s)", 422);
	}
	
	getErrorMessage(){
		return { code: this.ErrorType, msg: this.Message, records: []};
	}
}

/* It is defined for the errors that cause from the database(500 - Internal Server Error). */
class DatabaseError extends ErrorType {
	constructor() {
		super("2", "Database error", 500);
	}
	
	getErrorMessage(){
		return { code: this.ErrorType, msg: this.Message, records: []};
	}
}

/* It is defined for the errors that happened during the database connection(500 - Internal Server Error). */
class DatabaseConnectionError extends ErrorType {
	constructor() {
		super("3", "Database connection error", 500);
	}
	getErrorMessage(){
		return { code: this.ErrorType, msg: this.Message, records: []};
	}
}

module.exports = {
  ErrorHandler,
  handleError,
  ErrorType,
  InputParameterError,
  DatabaseError,
  DatabaseConnectionError
}