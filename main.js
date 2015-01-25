var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 65;
camera.position.y = 15;
camera.position.x = -10;
camera.lookAt(new THREE.Vector3(0,0,0));

//styra?
// controls = new THREE.OrbitControls( camera );
// controls.damping = 0.2;
// controls.addEventListener( 'change', render );

var alight = new THREE.AmbientLight( 0x404040 );
//scene.add( alight );

var pointLight = new THREE.DirectionalLight(0xffffff);
pointLight.position.set(0, 50, 100).normalize();
scene.add(pointLight);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight ); //$("inHere").attr("width")
renderer.setClearColor(0x999999,1);
//skapar canvasen vi ska jobba i
$("#inHere").append( renderer.domElement );

var start = Date.now();

groundUniforms = {
	    time: { type: "f", value: 1.0 }//,
	    //resolution: { type: "v2", value: new THREE.Vector2 }
	};

SHADER_LOADER.load(
    function (data)
	{
    	g_vshader = data.ground.vertex;
    	g_fshader = data.ground.fragment;

    	w_vshader = data.water.vertex;
    	w_fshader = data.water.fragment;
    	
	  	initialize();
	  	render();
	}
	
);


function setUnis(){
	
}


//item = new THREE.Mesh(new THREE.CubeGeometry(100, 10, 10), itemMaterial);
// var cube;
function initialize(){

	

	groundMaterial = new THREE.ShaderMaterial({
    uniforms: groundUniforms,
    vertexShader: g_vshader,
    fragmentShader: g_fshader,
    transparent: true,
    // lights: true
	});
	waterMaterial = new THREE.ShaderMaterial({
    uniforms: groundUniforms,
    vertexShader: w_vshader,
    fragmentShader: w_fshader,
    transparent: true,
    // lights: true
	});

	var plane = new THREE.PlaneGeometry( 100, 100, 100, 100 );
	var material = new THREE.MeshPhongMaterial( { color: 0x33CC33
	, transparent: true, opacity: 1.0} );
	var plane = new THREE.Mesh( plane, groundMaterial );
	plane.rotation.x = Math.PI * -90 / 180;
	plane.rotation.z = Math.PI * 50 /180;
	scene.add( plane );

	var plane2 = new THREE.PlaneGeometry( 100, 100, 100, 100 );
	var material = new THREE.MeshPhongMaterial( { color: 0x99CCFF
	, transparent: true, opacity: 0.4} );
	var plane2 = new THREE.Mesh( plane2, waterMaterial );
	plane2.rotation.x = Math.PI * -90 / 180;
	plane2.position.y += 4.;
	//plane2.rotation.y = Math.PI * -45 / 180;
	plane2.rotation.z = plane.rotation.z;
	scene.add( plane2 );

	var geometry = new THREE.BoxGeometry( 10, 10, 10 );
	var material = new THREE.MeshPhongMaterial( { color: 0xF08080, transparent: true, opacity: 1.0} );
	var cube = new THREE.Mesh( geometry, material );
	cube.position.y+=18;
	cube.position.z+=2;
	cube.rotation.x += 0.5;
	cube.rotation.y += 0.5;
	// scene.add( cube );

}



// var skyboxGeometry = new THREE.BoxGeometry(100, 100, 1);
// var skyboxMaterial = new THREE.MeshPhongMaterial({ color: 0x404040, side: THREE.BackSide });
// var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
// skybox.position.z = -50;
// skybox.rotation.y = 0.6;
// scene.add(skybox);



function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

				render();

			}


var render = function () {
	//ropa rekursivt på render när datorn är redo
	
	groundUniforms.time.value += 1./100.;

	renderer.render(scene, camera);

	requestAnimationFrame( render );
}
 
 // render();






// //set dimensions for renderer, use window size
// var renderDim = {width:  window.innerWidth, height:  window.innerHeight};
// //create a THREE renderer
// var renderer = new THREE.WebGLRenderer({ antialias: true });
// //set the dims and make it appear in the body of the page.
// renderer.setSize(renderDim.width, renderDim.height);
// $('body').append(renderer.domElement);

// //create THREE scene
// var scene = new THREE.Scene();
// //THREE geometry, cube
// var cubeGeometry = new THREE.BoxGeometry(100, 100, 100);
// //THREE mesh material object
// var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x1ec876 });
// //THREE mesh object - this is what we draw in the scene. it needs meshmaterials(looks) and the geometry(shape)
// var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// //rotera 45 gr uttryckt i radianer
// cube.rotation.y = Math.PI * 45 / 180;
// //lägg till cuben i scenen
// scene.add(cube);
// //THREE perspective camera
// var camera = new THREE.PerspectiveCamera(45, renderDim.width/renderDim.height, 0.1, 10000);
// //movthe camera a bit
// camera.position.y = 160;
// camera.position.z = 400;
// camera.lookAt(cube.position);
// scene.add(camera);
 
// //RENDER (recursive loop)
// function render() {
//     renderer.render(scene, camera);
     
//     requestAnimationFrame(render);
// }
// render();

// var skyboxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
// var skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
// var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
 
// scene.add(skybox);

// var pointLight = new THREE.PointLight(0xffffff);
// pointLight.position.set(0, 300, 200);
 
// scene.add(pointLight);


