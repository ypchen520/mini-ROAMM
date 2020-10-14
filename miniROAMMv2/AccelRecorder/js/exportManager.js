var globalData;
var dataToFile;

function dataTransmission_saveLocally(){
	try {
		console.log("[Matin] I GOT HERE! x0");
		var database = getDatabase();
		
		var onsuccess = function(array){
			console.log("[MATIN] saving files locally on the watch.");
			dataToFile = array.slice();
			writeDataLocally();
			printAllData();
		},

		onerror = function(error){
			console.log(error);
		};

		database.getAll(onsuccess, onerror);
	} catch (exception) {
		console.log(exception.message);
	}
}

/**
 * This function is called whenever the data is being sent to the server.<br>
 * It works with the global variable <b>dataToFile</b>. This function creates a "ROAMM" folder inside Documents and creates a .txt file containing current data.
 * @author matinkheirkhahan
 */
function writeDataLocally() {
	console.log("[Matin] writeDataLocally started...");
	var documentsDir;
	tizen.filesystem.resolve("documents", onDocumentResolve, function(error) {
		console.log("Could not resolve documents folder.");
		console.log(error);
	});

	function onDocumentResolve(result) {
		console.log("[Matin] documents folder resolved...");
		newFilePath = "ROAMM";
		documentsDir = result;
		tizen.filesystem.resolve("documents/" + newFilePath, onRoamResolve, function(error){
			console.log("[Matin] ROAMM folder could not be resolved. It should be created...");
			var newDir = documentsDir.createDirectory(newFilePath);
			console.log("[Matin] (" + newFilePath + ") folder is created.");
			d = new Date();
			var newFile = newDir.createFile("sensordata_" + d.toString().replace(/:| /g, "_") +".txt");
			console.log("[Matin] New file is created.");
			writeDataToFile(newFile);
		});
		function onRoamResolve(roamResult) {
			console.log("[Matin] ROAMM folder is resolved. So just create the file!");
			d = new Date();
			var newFile = roamResult.createFile("sensordata_" + d.toString().replace(/:| /g, "_") +".txt");
			console.log("[Matin] New file is created.");
			writeDataToFile(newFile);
		};
	}
}

/**
 * Given the newly created file, it opens it and writes the local storage into it. <br>
 * <i>Whenever this task is done, it <u>clears the DB</u>, because it is now available in the file and should not be kept somewhere else.</i>
 * @author matinkheirkhahan
 * @param newFile
 */
function writeDataToFile(newFile) {
	try {
		console.log("[Matin] writeDataToFile started...");
		if(newFile != null) {
			newFile.openStream("a", onOpenStream, function(error) {
				console.log("[Matin] Could not create the file.");
				console(error);
			}, "UTF-8");

			function onOpenStream(fs) {
				fs.write(JSON.stringify(dataToFile));
				console.log("[Matin] this is the data to be written [dataToFile]>>>\n" + JSON.stringify(dataToFile));
				console.log("[Matin] OR this [globalData]>>>\n" + JSON.stringify(globalData));
				fs.close();
				dataToFile = null;
				newFile = null;
				console.log("[Matin] Data is written into the file, and temporal variables are set to null.");
			};
		} else {
			console.log("[Matin] no file here to write into!...");
		}
		console.log("[Matin] writeDataToFile ended!!!");
		clearDB();
	} catch (exception) {
		console.log("[Matin] [Exception] " + exception.message);
	}
}
