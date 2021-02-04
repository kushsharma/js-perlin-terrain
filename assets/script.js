const scene = new THREE.Scene();

// create 3d camera
const fov = 75;
const aspect = window.innerWidth/window.innerHeight;
const near = 1;
const far = 5000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 500;

// create webgl renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor("#000");
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// helper controls for moving around
const controls = new THREE.OrbitControls( camera, renderer.domElement );
camera.position.set( 0, 20, 100 );
controls.update();

// to check fps
stats = new Stats();
document.body.appendChild( stats.dom );

// lights for cool effects
scene.add( new THREE.HemisphereLight( 0x6c58c4, 0xffff33 ) );
const light = new THREE.DirectionalLight(0x6c58c4, 1.3);
light.position.set(camera.position.x, camera.position.y+100, camera.position.z+100).normalize();
scene.add(light);

// Setup the terrain mesh
let geometry = new THREE.PlaneBufferGeometry( 2000, 2000, 256, 256 );
let material = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    wireframe: true,
});
let terrain = new THREE.Mesh( geometry, material );
terrain.rotation.x = -Math.PI / 2;
scene.add( terrain );

const clock = new THREE.Clock();

const render = function() {
    
    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();
    stats.update();
    
    renderer.render(scene, camera);
    
    // update terrain vertex heights
    const time = clock.getElapsedTime();
    const smoothing = 200;
    let peak = 20;
    let vertices = terrain.geometry.attributes.position.array;
    for (let i = 0, xdel = time, ydel = time; i <= vertices.length; i += 3) {
        vertices[i+2] = peak * noise.simplex2(
            vertices[i]/smoothing, 
            ydel + vertices[i+1]/smoothing
        );
    }
    terrain.geometry.attributes.position.needsUpdate = true;
    terrain.geometry.computeVertexNormals();    

    requestAnimationFrame(render);
};
render();