if (window.File && window.FileReader && window.FileList && window.Blob){
	// All File APIs are present
} else {
	alert('Browser is missing required APIs for local file access.');
}

var fileName;
function handleFilesSelect(event){
	var picks = event.target.files;
	fileName = picks[0].name;
	console.log(fileName);
}

document.getElementById('files').addEventListener('change',
	handleFilesSelect, false);

document.getElementById('displayButton').addEventListener('click', function(){
	// Note: filepath for this demo should be:
	// /Users/***/Documents/Code/locals-only/assets/img/
	// --> file will be at path+fileName
	var path = document.getElementById('filePath').value;
	console.log(path + fileName);

	var pic = document.createElement('img');
	pic.src = path + fileName;

	document.body.appendChild(pic);
})
