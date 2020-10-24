
const app = require('../index') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

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
		expect(response.body.records).toContainEqual(
			{
				"key": "dQsDsrfD",
				"createdAt": "2015-06-03T22:41:58.896Z",
				"totalCount": 126
			}
		);
    });
});