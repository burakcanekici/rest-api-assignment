# The rest-api assignment

A RESTful API with a single endpoint that fetches the data in the provided MongoDB collection and return the results in the requested format. The application deployed on `Heroku ` that is a cloud application platform. It is a Platform-as-a-Service(PaaS) solution. The application is published on *https://getir-rest-api.herokuapp.com/*.

The `Jest` was preferred to the integration test of API developed. The 6 cases are determined for test and which conditions they are and the result that obtained from itself are shown at the *Unit and/or Integration Tests* section below.

## Endpoint
Since, according to documentation, the application has a single endpoint, the endpont developed it ***getByParam*** and it accepts only POST request. That's means the public endpoint URL of the deployed API is `https://getir-rest-api.herokuapp.com?getByParam`  

On the other hand, the following parameters, which should be send to the endpoint, are kept in body during POST request;

| Parameter | status | format | exception |
| :--- | :---: | :--- | :---:
| `startDate` | *optional*  | `YYYY-MM-dd` | `InputParameterError` |
| `endDate` | *optional*  | `YYYY-MM-dd`| `InputParameterError` |
| `minCount` | *optional*  |  |  |
| `maxCount` | *optional*  |  |  |

The following image ilustrated the example of how to make POST request to the endpoint we have on the Postman;  

<kbd>![alt text](https://github.com/burakcanekici/rest-api-assignment/blob/main/images/Rest.PNG)</kbd>

## Error Handling

The following custom error types consist of the base of error handling mechanism in this application;

| Error Type | Error Code | Error Message | Error Status Code |
| :--- | :---: | :--- | :---: |
| `InputParameterError` | 1  | *"Invalid input parameter(s)"* | 422 |
| `DatabaseError` | 2  | *"Database error"* | 500 |
| `DatabaseConnectionError` | 3  | *"Database connection error"* | 500 |

All these error types, which descrived above, were extended from the `ErrorType` base class below. The parameters that consumed from constructor are different for each error types we defined, but, due to extending error types, we just call the *getErrorMessage* in the `ErrorHandler` class where they are injected. Therefore the new error type easily added through extending the `ErrorType` base class, there is no more operations to need during its implementation.  

```javascript
class ErrorType {
	constructor(errorType, message, statusCode) {
		this.ErrorType = errorType;
		this.Message = message;
		this.StatusCode = statusCode;
	} 
	
	getErrorMessage(){}
}
```

The `ErrorHandler` class in the project is defined to provide the error handling, which is extended from Error base class in JavaScript. Since the same approach is repeat whenever we send a response to the client, this class was developed. Therefore, we can thrown an exception by using its constructor.  

```javascript
class ErrorHandler extends Error {
	constructor(errorType) {
		super();
		/* The error type that extended from ErrorType base class is set. */
		this._errorType = errorType;
	}
}

const handleError = (err, res) => {
  const { _errorType } = err;
  /* The whatever error that is set is returned with the message to private itself. */
  res.status(_errorType.StatusCode).send(_errorType.getErrorMessage());
};
```

The error-handling middleware is a special type of middleware that accepts four arguments as opposed to a regular middleware. The first argument is the error object.
The piece of code below shows an example of an error-handling middleware:  
```javascript
app.use((err, req, res, next) => {
  //...
});
```
The `handleError` method should be called from there through passing the error object and the response object to it. Hence, when the custom exception is thrown, the `handleError` method in the `ErrorHandler` class will be responsed to the client.
```javascript
app.use((err, req, res, next) => {
  handleError(err, res);
});
```

Therefore all we need to thrown an error by the error type that we customized is using the `ErrorHandler` constructor at everywhere that we want to check for error in the application. On the other hand, due to extension feature, after extending new class, it directly use as similar as the previous error types (properly to the SOLID principle).
```javascript
throw new ErrorHandler(new InputParameterError());
```

## Unit and/or Integration Tests

For the test of application, the Jest was preferable. The following 6 cases have been implemented; 

```javascript
describe("Fill all parameters", () => {
    it('it should be success', async () => {
        const response = await request.post('/getByParam').send({
		      "startDate" : "2015-06-02",
			    "endDate" : "2015-06-06",
			    "minCount" : "100",
			    "maxCount" : "500"
		    });
        expect(response.status).toBe(200);
    });
    
    it('the startDate is in invalid format', async () => {
        const response = await request.post('/getByParam').send({
			    "startDate" : "2015-36-02",
			    "endDate" : "2015-06-06",
			    "minCount" : "100",
			    "maxCount" : "500"
		    });
        expect(response.status).toBe(422);
    });
    
    it('the startDate is empty', async () => {
        const response = await request.post('/getByParam').send({
			    "endDate" : "2015-06-06",
			    "minCount" : "100",
			    "maxCount" : "500"
		    });
        expect(response.status).toBe(200);
    });
    
    it('the endDate is in invalid format', async () => {
        const response = await request.post('/getByParam').send({
			    "startDate" : "2015-06-06",
			    "endDate" : "2015-36-06",
			    "minCount" : "100",
			    "maxCount" : "500"
		    });
        expect(response.status).toBe(422);
    });
    
    it('the 6 records should be returned', async () => {
        const response = await request.post('/getByParam').send({
			    "startDate" : "2015-06-02",
			    "endDate" : "2015-06-06",
			    "minCount" : "100",
			    "maxCount" : "500"
		    });
        expect(response.status).toBe(200);
        expect(response.body.records).toHaveLength(6);
    });
    
    it('just the record whose key should be equal to dQsDsrfD', async () => {
        const response = await request.post('/getByParam').send({
			    "startDate" : "2015-06-02",
			    "endDate" : "2015-06-06",
			    "minCount" : "125",
			    "maxCount" : "127"
		    });
        expect(response.status).toBe(200);
        expect(response.body.records).toContainEqual({ "key": "dQsDsrfD", "createdAt": "2015-06-03T22:41:58.896Z", "totalCount": 126 });
    });
});
```

The result of these 6 cases are shown below; 

<kbd>![alt text](https://github.com/burakcanekici/rest-api-assignment/blob/main/images/TestCase.PNG)</kbd>
