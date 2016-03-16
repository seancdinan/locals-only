// Check if necessary APIs are present for file selection
if (window.File && window.FileReader && window.FileList && window.Blob){
	// All File APIs are present
} else {
	alert('Browser is missing required APIs for local file access.');
}


// Get the file name and the file path
var fileName, path;
function handleFilesSelect(event){
	var picks = event.target.files;
	fileName = picks[0].name;
	console.log(fileName);}
document.getElementById('files').addEventListener('change',
	handleFilesSelect, false);
document.getElementById('displayButton').addEventListener('click', function(){
	// Note: filepath for this demo should be:
	// /Users/seandinan/Documents/Code/locals-only/assets/img/
	// --> file will be at path+fileName
	path = document.getElementById('filePath').value;

	loader.load(path + fileName + '?callback=parseResponse', function(geometry){
	geometry.computeFaceNormals();
	geometry.center();

	var material = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		vertexColors: THREE.VertexColors,
		shininess: 30,
		side: THREE.DoubleSide
	});

	teeth = new THREE.Mesh(geometry, material);
	teeth.name = 'teeth';

	teeth.scale.set(0.05, 0.05, 0.05);

	teeth.rotation.x = 3 * Math.PI / 2;
	teeth.rotation.z = - Math.PI / 2;

	scene.add(teeth);

})
})

// Create the threejs scene
// -----------------------------------------------------------
// CAMERA SCENE RENDERING LIGHTING
// -----------------------------------------------------------
var modelViewer = document.getElementById('modelViewer');
	modelViewer.height = 500;
	modelViewer.width = 800;

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 75, modelViewer.width / modelViewer.height, 0.1, 1000 );
camera.position.z = 5;

var ambLight = new THREE.AmbientLight(0xffffff);
ambLight.intensity = 1;
scene.add(ambLight);

var renderer = new THREE.WebGLRenderer({canvas: modelViewer, alpha: true, precision: 'lowp'});
renderer.setClearColor(0xeeeeee);
document.body.appendChild(renderer.domElement);

// -----------------------------------------------------------
// MODEL LOADER
// -----------------------------------------------------------
var loader = new THREE.PLYLoader();
var teeth;



// -----------------------------------------------------------
// EVENT CONTROL (MOUSE EVENTS)
// -----------------------------------------------------------
var mouse = new THREE.Vector2();
var intersect, isMouseDown = false, clickCoords = [], teethSelect = false;
var raycaster = new THREE.Raycaster;

// Mouse Control / Rotation
function onDocumentMouseDown(event){
	isMouseDown = true;
	if (event.target.id == 'modelViewer'){
		clickCoords[0] = mouse.x = ((event.clientX - 300) / modelViewer.width) * 2 - 1;
		clickCoords[1] = mouse.y = - ((event.clientY - 200) / modelViewer.height) * 2 + 1;
		raycaster.setFromCamera(mouse, camera);

		intersect = raycaster.intersectObjects(scene.children);

		if(intersect.length > 0){
			if (intersect[0].object.name == 'teeth'){
				teethSelect = true;
			}
		}
	}
}

function onDocumentMouseMove(event){
	if (isMouseDown == true && teethSelect == true){
		var distanceMoved = [];
		distanceMoved[0] = clickCoords[0] - (((event.clientX - 300) / modelViewer.width) * 2 - 1);
		distanceMoved[1] = clickCoords[1] - (- ((event.clientY - 200) / modelViewer.height) * 2 + 1);

		teeth.rotation.z -= 0.1 * distanceMoved[0];
		teeth.rotation.x += 0.1 * distanceMoved[1];
		if (0.1 * distanceMoved[1] > 0.02)
			teeth.rotation.y -= Math.sign(distanceMoved[1]) * 0.05 * distanceMoved[0];
	}
}

// Mouse Control / Zoom
function onDocumentMouseScroll(event){
	if (event.target.id == 'modelViewer'){
		if (event.deltaY > 0){
			// zoom out
			if (camera.position.z < 20)
				camera.position.z += 0.05;
		}
		if (event.deltaY < 0){
			// zoom in
			if (camera.position.z > 1){
				camera.position.z -= 0.05;
			}
		}
	}
}

// Event Listeners
document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('mouseup', function(){
		isMouseDown = false;
		teethSelect = false;
	}, false);
document.addEventListener('wheel', onDocumentMouseScroll, false);


// -----------------------------------------------------------
// POPUPS & INFO MANAGEMENT
// -----------------------------------------------------------



// -----------------------------------------------------------
// INITIATE AND RENDER
// -----------------------------------------------------------

function render(){
	requestAnimationFrame(render);

	renderer.render(scene, camera);
}
render();



