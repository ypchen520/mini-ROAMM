
//ENTRY POINT OF THE APPLICATION
$(document).ready(function() {
	console.log("[ChenBai] ROAMM project  ------------------------ started.");
	
    console.log("[ChenBai] Local DB is being created.");
    tizen.power.request("CPU", "CPU_AWAKE");
    
    try {
    		createDBUsingWrapper();
    }catch(e) {
    		console.log(e);
    }
    console.log('[ChenBai] Request accel sensor to start.');
    window.setTimeout(function() {
    		startAccel();
    		console.log('[ChenBai] Accel Sensor started.');
    		/*window.setTimeout(function() {
    			printAllData();
    			console.log('[ChenBai] Output all the data');
    		}, 100*1000);*/
    		window.setInterval(function() {
    			dataTransmission_saveLocally();
    		}, 1000*60*1.5); // save data every 4 mins.
    }, 10*1000);
});