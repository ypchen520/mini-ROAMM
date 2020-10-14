var SAMPLING_RATE = 1000/30;  // predefined 30Hz

function startSensors() {
	try{
		startAccel();
		console.log("[StartSensors] Accel started!");
		startGyro();
		console.log("[StartSensors] Gyro started!");
		startLocalStorageInterval();
	}catch(e) {
		console.log("[**Error**] Error in start sensors");
		console.log(e);
	}
}

function startAccel() {
	console.log("Getting Accel configuration");
	
	window.addEventListener('devicemotion', function(e){
		// In this case, all the motions would be stored
		// console.log("device motion" + e);
		saveAccel([e.accelerationIncludingGravity.x, e.accelerationIncludingGravity.y, e.accelerationIncludingGravity.z]);
	}, function(error) {
		console.log("[Matin] Error on DEVICE-MOTION: " + error);
	});
}

function startGyro() {
	
	var tempa=0,tempb=0,tempc=0,count=0;
	
	var handleGyroData = function(alpha, beta, gamma){

		count++;
		
		// running averages of gyroscope values
		tempa = ((tempa*(count-1)) + alpha)/count;
		tempb = ((tempb*(count-1)) + beta)/count;
		tempc = ((tempc*(count-1)) + gamma)/count;
		
	};
	
	window.addEventListener('devicemotion', function(e){
		handleGyroData(
				e.rotationRate.alpha,		
				e.rotationRate.beta,
				e.rotationRate.gamma

		);
	});
	
	var rate = SAMPLING_RATE;
	console.log("gyro_rate:"+rate);
	var interval = window.setInterval(function(){
		saveGyro([tempa, tempb, tempc]);
		tempa = 0;
		tempb = 0;
		tempc = 0;
		count = 0;
	}, rate);
}