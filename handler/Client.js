const URI = "mongodb+srv://challengeUser:WUMglwNBaydH8Yvu@challenge-xzwqd.mongodb.net/getir-case-study?retryWrites=true";

const MongoClient = require('mongodb').MongoClient;
let clientInstance = null;

/* The Client object is structed as Singleton and it should be called by getInstance method from any class from outside. */
class Client {
	
	constructor(){}
	
	/* This method is static and it provides that there must be only one instance at the same time. */
	static getInstance(){
		if (!clientInstance) return new Client();
		return clientInstance;
	}
	
	/* The client that makes database connection is opened. */
	async clientOpen(){
		const clientConn = new Promise((resolve, reject) => {
			const mongoClient = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });
			mongoClient.connect(err => {
				if(err) resolve(null);
				//console.log('[mongo] connected');
				resolve(mongoClient);
			});
		});
		return clientConn;
	}

	/* The client that makes dtabase conection is closed. */
	clientClose(){
		if (this.clientInstance && this.clientInstance.isConnected) this.clientInstance.close();
	}
}

module.exports = {
	Client
}