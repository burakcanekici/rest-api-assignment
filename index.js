// npm run test:watch
// node index.js

const express = require('express');
const bodyParser = require('body-parser');
const querystring = require('querystring');

/* The cloud host such Heroku, the use the PORT variable to tell which port our server should listen for the
 * routing to work properly.
 * Also the process.env means that if any value set during starting up the our server, take this value instead of we specified. */
const PORT = process.env.PORT || 3000;

/* The bodyParser was used to catch the data that send by the user through POST request. The urlencoded method provides us to use
 * the Body-Parser on encoded url, and the json method provides us to use the data that send in JSON format.*/
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let dbConn = null;

const { DBHandler } = require('./handler/DBHandler')
const { handleError, ErrorHandler, ErrorType, InputParameterError, DatabaseError, DatabaseConnectionError } = require('./handler/ErrorHandler')

app.post('/getByParam', async function (req, res, next) {
	
	/* Get all parameters in the body of the POST request. */
	const _startDate = req.body.startDate;
	const _startDateIns = new Date(_startDate);
	const _endDate = req.body.endDate;
	const _endDateIns = new Date(_endDate);
	const _minCount = req.body.minCount;
	const _maxCount = req.body.maxCount;
	
	/* Check the start and end date parameters are in the valid date format. If not, a InputParameterError will be thrown. */
	try{
		if((_startDate != undefined && _startDate != '' && isNaN(_startDateIns)) || (_endDate != undefined && _endDate != '' && isNaN(_endDateIns))){
			throw new ErrorHandler(new InputParameterError());
		}
	} catch(err){ next(err); return; }
	
	/* The parameter that just only have startDate and endDate information are prepared. If any one is set a value, it puts into parameter. */
	let paramCA = {};
	if((_startDateIns instanceof Date) && !isNaN(_startDateIns)) paramCA['$gt'] = _startDateIns;
	if((_endDateIns instanceof Date) && !isNaN(_endDateIns)) paramCA['$lt'] = _endDateIns;
	const param = (Object.keys(paramCA).length > 0) ? {createdAt : paramCA} : {};
	
	/* The records are taken from MongoDB URI by the parameters we set (i.e. startDate and endDate). If any error happened during the connection
	 * to database or getting records from database, the err value refer whatever error was happened and then it will be thrown. */
	let records = await dbConn.getListByParameters(param);
	try{ if(records.err){  throw new ErrorHandler(records.err); } } catch(err){ next(err); return; }
	
	/* After getting the records according to date informations, they are also filtered according to min or max count informations (if it send as a parameter)
	 * and then their JSON keys will be updated by the format desired in assignment paper. */
	records = records.filter(function(record){
		const totalCount = record.counts.reduce((a,b) => a + b, 0 );
		modifyCountsArray(record, 'counts', 'totalCount', totalCount); // The "counts" key are updated to "totalCount" and their value are set to totalCount of array
		pickKeys(record, ['key', 'createdAt', 'totalCount']);  // Only "key", "createdAt", and "totalCount" keys are kept because only those are desired.
		return !(_minCount != undefined && _minCount != '' && totalCount <= _minCount) & !(_maxCount != undefined && _maxCount != '' && totalCount >= _maxCount);
	});
	
	/* Since the records filter by the parameters we take, they return in the desired format. */  
	const responseObj = {code: '0', msg: 'Success', records: records};
	res.status(200).send(responseObj);
})

/* It is implemented to modify what we take from database by summing the items in the count array and set their total into object with the new key we specifizied. */
function modifyCountsArray (obj, oldKey, newKey, value){
	renameKey (obj, oldKey, newKey);
	obj[newKey] = value;
}

/* It is implemented to change the key with another key we desired. */
function renameKey (obj, oldKey, newKey) {
	obj[newKey] = obj[oldKey];
	delete obj[oldKey];
}

/* Since there are more key than we want, the desired key are kept and the others are deleted before it returned to client. */
function pickKeys (obj, keys) {
	Object.keys(obj).forEach(key => {
		if(keys.indexOf(key) < 0){
			delete obj[key];
		}
	})
}

/* It was declared to handle the error we customize. */ 
app.use((err, req, res, next) => {
  handleError(err, res);
});

/* The app start on the PORT specified and the dbConn object are created. */
app.listen(PORT, async function() {
  console.log('listened PORT: ' + PORT);
  dbConn = new DBHandler();
})

/* The app exports to use testing with Jest. */
module.exports = app;
