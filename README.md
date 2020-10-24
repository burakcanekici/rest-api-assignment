# The rest-api assignment

A RESTful API with a single endpoint that fetches the data in the provided MongoDB collection and return the results in the requested format. The application deployed on Heroku that is a cloud application platform. It is a Platform-as-a-Service(PaaS) solution. The application is published on *https://getir-rest-api.herokuapp.com/*.

## Endpoint
Since, according to documentation, the application has a single endpoint, the endpont developed it ***getByParam*** and it accepts only POST request. On the other hand, the following parameters, which should be send to the endpoint, are kept in body during POST request;
- *startDate*; which must be "YYYY-MM-dd" format, otherwise the InputParameterError will be thrown. It is an optional, so it can't be sent in body or it can be sent empty. In this case, the read opearitons is executed without any start date.
- *endDate*; which must be "YYYY-MM-dd" format, otherwise the InputParameterError will be thrown. It is an optional, so it can't be sent in body or it can be sent empty. In this case, the read opearitons is executed without any end date.
- *minCount*; which is an optional, so it can't be sent in body or it can be sent empty. In this case, the read opearitons is executed without any minimum count (like it equals to 0).
- *maxCount*; which is an optional, so it can't be sent in body or it can be sent empty. In this case, the read opearitons is executed without any maximum count.

The following image is the example of how to make POST request to the endpoint described in here as *https://getir-rest-api.herokuapp.com?getByParam*;
<kbd>![alt text](https://github.com/burakcanekici/rest-api-assignment/blob/main/images/Rest.PNG)</kbd>
## Error Handling

The following custom error types are defined for this application;

| Error Type | Error Code | Error Message | Error Status Code |
| :--- | :---: | :--- | :---: |
| `InputParameterError` | 1  | *"Invalid input parameter(s)"* | 422 |
| `DatabaseError` | 2  | *"Database error"* | 500 |
| `DatabaseConnectionError` | 3  | *"Database connection error"* | 500 |

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
