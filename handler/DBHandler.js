
const { Client } = require('./Client')
const { DatabaseError, DatabaseConnectionError } = require('./ErrorHandler')

/* The database operations should be handler in here. The getListByParameters method has already defined to use. */
class DBHandler {
	constructor() {}
	
	async getListByParameters(param){
		/* Before database connection, we need to make sure that the client connection is opened. Since the client class was structered as Singleton, their
		 * instance shoul be taken instead of making a new Instance through constructor. Therefore, getInstance method was used. */
		const clientInstance = Client.getInstance();
		const clientConn = await clientInstance.clientOpen(); /* After getting cleint instance, client connection will be opened. */
		if(clientConn == null) return({err: new DatabaseConnectionError()}); /* If any problem happens, which mean the connection error, the DatabaseConnectionError is returned. */ 
		
		let list = [];
		list = new Promise((resolve, reject) => {
			clientConn.db("getir-case-study").collection('records').find(param).toArray((err, items) => {
				clientInstance.clientClose();
				if(err) resolve({err: new DatabaseError()});
				resolve(items);
			});
		});
		/* The list are returned. */
		return list;
	}
}



module.exports = {
	DBHandler
}