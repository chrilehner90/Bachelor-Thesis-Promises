window.onload = function() {

	function handleFileInput(evt) {
		var files = evt.target.files;
		var output = [];
		var promises = [];
		var f;
		for (var i = 0; i < files.length; i++) {
			f = files[i];
			promises.push(readFile(f));
		}

		// Call the .then() function after all promises have been fulfilled
		Promise.all(promises).then(function onResolve(files) {
			return uploadFiles(files);
		}).then(function onResolve(serverResponse) {
			console.log(serverResponse);
		}).catch(function(err) {
			console.error(err);
		});
	}

	function readFile(f) {
		return new Promise(function(resolve, reject) {
			var reader = new FileReader();
			reader.onload = function() {
				var file = {
					'data': f,
					'path': reader.result
				};
				resolve(file);
			};
			reader.onerror = function(evt) {
				reject(evt.target.error.message);
			};
			// Read in the image file as a data URL.
			reader.readAsDataURL(f);
		});
	}

	function uploadFiles(files) {
		var xhr = new XMLHttpRequest();
		var formData = new FormData();
		var responsePromise = new Promise(function(resolve, reject) {
			xhr.onload = function() {
				if(xhr.status === 200) {
					resolve(this.responseText);
				}
				else {
					reject(xhr.statusText);
				}
			};
			xhr.onerror = function(evt) {
				reject(evt.target.error.message);
			}
		});
		
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