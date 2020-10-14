
//ENTRY POINT OF THE APPLICATION
$(document).ready(function() {
	console.log("[ChenBai] ROAMM project  ------------------------ started.");
	
    console.log("[ChenBai] Local DB is being created.");
    tizen.power.request("CPU", "CPU_AWAKE");
    tizen.power.setScreenStateChangeListener(onScreenStateChanged);

    function onScreenStateChanged() {
        if (!tizen.power.isScreenOn()) {
            tizen.power.turnScreenOn();
            tizen.power.request("SCREEN", "SCREEN_NORMAL");
        }
    }
    /*Request permission to write files*/
    
    function onsuccess(dir){
    	console.log(dir);
    }
    
    function onerror(e){
    	console.log("error"+e);
    }
    
//    function onsuccessPermission(){
//    	console.log("Success");
//    	tizen.filesystem.resolve("documents", onsuccess, onerror, "rw");
//    }
//    
//    function onErrorPermission(e){
//    	console.log("error "+ JSON.stringify(e));
//    }
//    
//    function init(){
//    	tizen.ppm.requestPermission("http://tizen.org/privilege/mediastorage", onsuccessPermission, onErrorPermission);
//    }
//    
//    init();
    try {
    		createDBUsingWrapper();
    }catch(e) {
    		console.log(e);
    }
    console.log('[ChenBai] Request accel sensor to start.');
    
    document.getElementById('save_file').addEventListener("click", function() {
    		try {
    			dataTransmission_saveLocally();
    			window.setTimeout(function() {
    				document.getElementById("status").innerHTML = "SAVING...";
    			}, 1000*10)
    		}
    		catch(e) {
    			console.log("[Error saving files by clicking the button]: " + e)
    			document.getElementById("status").innerHTML = "ERROR";
    		}
    			
    });
    
    window.setTimeout(function() {
    		startSensors();
    		console.log('[ChenBai] Accel Sensor started.');
    		/*window.setTimeout(function() {
    			printAllData();
    			console.log('[ChenBai] Output all the data');
    		}, 100*1000);*/
    		window.setInterval(function() {
    			dataTransmission_saveLocally();
    		}, 1000*60*30); // save data every 30 mins.
    }, 10*1000);
});
