window.onload = function() {

	function handleFileInput(evt) {
		var files = evt.target.files;
		var output = [];
		var promises = [];
		var f;
		for (var i = 0; i < files.length; i++) {
			f = files[i];
			// Only process image files.
			if (!f.type.match('image.*')) {
				continue;
			}

			promises.push(readFile(f));
		}

		// Call the .then() function after all promises have been fulfilled
		Promise.all(promises).then(function(files) {
			console.log("All promises are fulfilled!");
			return uploadFiles(files);
		}).then(function(serverResponse) {
			console.log(serverResponse);
		});
	}

	/*
	 * readFile(File)
	 * returns a promise for every file
	 */

	function readFile(f) {
		var reader = new FileReader();

		return new Promise(function(resolve, reject) {
			// Closure to capture the file information.
			reader.onloadend = function() {
				var file = {
					'data': f,
					'path': reader.result
				};
				resolve(file);
			};
			// Read in the image file as a data URL.
			reader.readAsDataURL(f);
		});
	}

	/*
	 * uploadFiles(Files Array)
	 * 
	 */

	function uploadFiles(files) {
		var xhr = new XMLHttpRequest();
		var formData = new FormData();
		console.log(files);
		var responsePromise = new Promise(function(resolve, reject) {
			xhr.onload = function() {
				resolve(this.responseText);
			}
		})
		
		xhr.open("POST", "http://localhost:3000/upload", true);
		xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');
		for(var file in files) {
			formData.append("uploads", files[file].data);
		}
		xhr.send(formData);
		return responsePromise;
	}


	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		document.getElementById('files').addEventListener('change', handleFileInput, false);

		// Click button to see that the site is still responding while it reads the files
		document.getElementById('btn').addEventListener('click', function() {
			console.log("clicked");
		}, false);
	}
	else {
		alert('The File APIs are not fully supported in this browser.');
	}

};