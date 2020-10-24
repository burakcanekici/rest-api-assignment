# The rest-api assignment

A RESTful API with a single endpoint that fetches the data in the provided MongoDB collection and return the results in the requested format. The application deployed on Heroku that is a cloud application platform. It is a Platform-as-a-Service(PaaS) solution. The application is published on *https://getir-rest-api.herokuapp.com/*.

## Endpoint
Since, according to documentation, the application has a single endpoint, the endpont developed it ***getByParam*** and it accepts only POST request. On the other hand, the following parameters, which should be send to the endpoint, are kept in body during POST request;
- *startDate*; which must be "YYYY-MM-dd" format, otherwise the InputParameterError will be thrown. It is an optional, so it can't be sent in body or it can be sent empty. In this case, the read opearitons is executed without any start date.
- *endDate*; which must be "YYYY-MM-dd" format, otherwise the InputParameterError will be thrown. It is an optional, so it can't be sent in body or it can be sent empty. In this case, the read opearitons is executed without any end date.
- *minCount*; which is an optional, so it can't be sent in body or it can be sent empty. In this case, the read opearitons is executed without any minimum count (like it equals to 0).
- *maxCount*; which is an optional, so it can't be sent in body or it can be sent empty. In this case, the read opearitons is executed without any maximum count.

The following image is the example of how to make POST request to the endpoint described in here as *https://getir-rest-api.herokuapp.com?getByParam*;

## Error Handling

## Unit and/or Integration Tests
