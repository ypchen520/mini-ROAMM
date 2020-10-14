function Item(){
	this.accelX = null;
	this.accelY = null;
	this.accelZ = null;
	this.gyroA = null;
	this.gyroB = null;
	this.gyroC = null;
	this.timestamp = null;
}

function formatLocalDate() {
	var now = new Date(),
	tzo = -now.getTimezoneOffset(),
	dif = tzo >= 0 ? '+' : '-',
			pad = function(num) {
		var norm = Math.abs(Math.floor(num));
		return (norm < 10 ? '0' : '') + norm;
	};
	return now.getFullYear() 
	+ '-' + pad(now.getMonth()+1)
	+ '-' + pad(now.getDate())
	+ 'T' + pad(now.getHours())
	+ ':' + pad(now.getMinutes()) 
	+ ':' + pad(now.getSeconds()) 
	+ '.' + pad(now.getMilliseconds())
	+ dif + pad(tzo / 60) 
	+ ':' + pad(tzo % 60);
}

function startLocalStorageInterval(){
	var rate = SAMPLING_RATE; // 30Hz
	console.log("[Matin] Sampling rate is set to " + rate);
	window.setInterval(function(){
		storeData();
	}, rate);
}

function saveGyro(gyro){
	if ("sessionStorage" in window) {
		sessionStorage.setItem(KEY_A_GYRO, gyro[0]);
		sessionStorage.setItem(KEY_B_GYRO, gyro[1]);
		sessionStorage.setItem(KEY_C_GYRO, gyro[2]);
	}
	else {
		console.log("no sessionStorage in window");
	}
}

function clearGyro(){
	if ("sessionStorage" in window) {
		sessionStorage.removeItem(KEY_A_GYRO);
		sessionStorage.removeItem(KEY_B_GYRO);
		sessionStorage.removeItem(KEY_C_GYRO);
	}
	else {
		console.log("no sessionStorage in window");
	}
}

function saveAccel(accel){
	if ("sessionStorage" in window) {
		sessionStorage.setItem(KEY_X_AXIS, accel[0]);
		sessionStorage.setItem(KEY_Y_AXIS, accel[1]);
		sessionStorage.setItem(KEY_Z_AXIS, accel[2]);
		
		document.getElementById("display").innerHTML = String(accel[0]);
	}
	else {
		console.log("no sessionStorage in window");
	}
}

function clearAccel(){
	if ("sessionStorage" in window) {
		sessionStorage.removeItem(KEY_X_AXIS);
		sessionStorage.removeItem(KEY_Y_AXIS);
		sessionStorage.removeItem(KEY_Z_AXIS);
	}
	else {
		console.log("no sessionStorage in window");
	}
}

//Get the DB instance existing on the watch
//This will only actually create a new one if one doesnt already exist
//Else it will retrieve the existing one
var database;
function createDBUsingWrapper(){
	database = new IDBStore({
		dbVersion: 1,
		storeName: 'data',
		keyPath: 'id',
		autoIncrement: true,
		onStoreReady: function(){
			console.log('Store ready!');
		}
	});
}

function storeData(){
	var item = Object.create(Item.prototype);

	item.accelX = sessionStorage.getItem(KEY_X_AXIS);
	item.accelY = sessionStorage.getItem(KEY_Y_AXIS);
	item.accelZ = sessionStorage.getItem(KEY_Z_AXIS);
	
	item.gyroA = sessionStorage.getItem(KEY_A_GYRO);
	item.gyroB = sessionStorage.getItem(KEY_B_GYRO);
	item.gyroC = sessionStorage.getItem(KEY_C_GYRO);
	
	item.timestamp = formatLocalDate(Date());
	
	// clears data in sessionstorage
//	console.log("Adding the following data [" + item.accelX + ", " + item.accelY + ", " + item.accelZ + "]");
//	clearSessionData();
	addToDB(item);

}

function addToDB(item){
	 
	var onsuccess = function(id){
		//console.log('Data is added: ' + id);
	}
	var onerror = function(error){
		console.log('Error', error);
	}
 
	database.put(item, onsuccess, onerror);
}

//clears all items in the database
//called by export manager after a successful transfer
function clearDB(){
	console.log("Clearing Local Storage");
	
	var onsuccess = function(){
		console.log("Local Store Cleared");
	}
	
	var onerror = function(error){
		console.log(error);
	}
	
	database.clear(onsuccess, onerror);
}

function getDatabase(){
	return database;
}

//used for debugging, dump all local storage to the console
function printAllData(){
	var onsuccess = function(array){
		console.log(array);
		console.log(JSON.stringify(array));
	},
	onerror = function(error){
		console.log(error);
	};
	
	database.getAll(onsuccess,onerror);
}
