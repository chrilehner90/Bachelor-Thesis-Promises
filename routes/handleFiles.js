var FS = require("fs"),
	Q = require("q");


exports.receiveUpload = function(req, res){
	var files = req.files.uploads;
	var promisedFiles = [];

	if(req.files.uploads.length !== undefined) {
		for(var file in files) {
			promisedFiles.push(fileReader(files[file]));
		}
	}
	else {
		promisedFiles.push(fileReader(files));
	}

	Q.all(promisedFiles).then(
		function(value) {
			res.send("Files uploaded!");
		}, 
		function(reason) {
			res.send(reason);
		}
	);
};


function fileReader(file) {
	var deferred = Q.defer();
	FS.readFile(file.path, function (err, data) {

		var imageName = file.name;

		/// If there's an error
		if(!imageName){

			console.log("There was an error");
			res.redirect("/");
			res.end();

		}
		else {
			var newPath = "public/uploads/" + imageName;

			// write file to uploads folder
			FS.writeFile(newPath, data, function (err) {
				deferred.resolve("done!");

			});
		}
  });
  return deferred.promise;
}