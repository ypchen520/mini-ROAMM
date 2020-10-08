var SAMPLING_RATE = 1000/30;  // predefined 30Hz

function startAccel() {
	console.log("Getting Accel configuration");
	
	window.addEventListener('devicemotion', function(e){
		// In this case, all the motions would be stored
		// console.log("device motion" + e);
		saveAccel([e.accelerationIncludingGravity.x, e.accelerationIncludingGravity.y, e.accelerationIncludingGravity.z]);
	}, function(error) {
		console.log("[Matin] Error on DEVICE-MOTION: " + error);
	});
	
	startLocalStorageInterval();
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