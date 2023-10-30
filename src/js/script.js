import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"

let model3d;
let hovered = null;
let contents = {
    "Empty001": {
        year: "1978",
        title: "Jolibee Food Corporation is born",
        description: (
            `<strong>Jolibee Foods Corporation</strong> (also known as Jolibee Group) is born with a single brand:<br />Jolibee. The first-ever Jolibee store was located in Quezon, Cubao.`
        )
    },
    "Empty002": {
        year: "1979",
        title: "Jolibee Food Corporation is born",
        description: (
            `<strong>Jolibee Foods Corporation</strong> (also known as Jolibee Group) is born with a single brand:<br />Jolibee. The first-ever Jolibee store was located in Quezon, Cubao.`
        )
    },
    "Empty004": {
        year: "1982",
        title: "Jolibee Food Corporation is born",
        description: (
            `<strong>Jolibee Foods Corporation</strong> (also known as Jolibee Group) is born with a single brand:<br />Jolibee. The first-ever Jolibee store was located in Quezon, Cubao.`
        )
    },
    "Empty005": {
        year: "1990",
        title: "Jolibee Food Corporation is born",
        description: (
            `<strong>Jolibee Foods Corporation</strong> (also known as Jolibee Group) is born with a single brand:<br />Jolibee. The first-ever Jolibee store was located in Quezon, Cubao.`
        )
    }
};

const glbmodel = new URL("../assets/world_war_one.glb", import.meta.url);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x57D7FC)

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const assetLoader  = new GLTFLoader();
const scene        = new THREE.Scene();
const pointer      = new THREE.Vector2();
const raycaster    = new THREE.Raycaster();
const axesHelper   = new THREE.AxesHelper(5);
const orbit        = new OrbitControls(camera, renderer.domElement);
const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(axesHelper);
scene.add(ambientLight);
camera.position.set(0, 2, 10);
orbit.update();

const onPointerMove = ( event ) => {
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

const onHover = () => {
    if( model3d ) {
        raycaster.setFromCamera( pointer, camera );
        
        const objects = raycaster.intersectObjects(model3d.children, true);
        const raycasted = Object.keys(contents);
        
        const setTransition = (object) => {
            if( hovered === null ) {
                let step = .3;
                let speed = 0.1;

                step += speed

                hovered = object.name;
            
                const tl = new TimelineMax().delay(.1);
                const scale = object.scale;
                const position = object.position;
                // tl.to(scale, 0.2, {x: 2, y: 2, ease: Expo.easeOut})
                // .to(scale, 1, {x: scale.x, y: scale.y, ease: Expo.easeOut, delay: 0.2});

                tl.to(position, 0.2, {y: 10 * Math.abs(Math.sin(step)), ease: Expo.easeOut})
                .to(position, 1, {y: position.y, ease: Expo.easeOut, delay: 0.2});

                setTimeout(() => {
                    hovered = null;
                }, 1200)
            }
        };

        for ( let i = 0; i < objects.length; i ++ ) {
            if( raycasted.indexOf(objects[i].object.name) > -1 ) {
                setTransition(objects[i].object);
            } else if( objects[i].object.parent && raycasted.indexOf(objects[i].object.parent.name) > -1 ) {
                setTransition(objects[i].object.parent);
            } else if( objects[i].object.parent.parent && raycasted.indexOf(objects[i].object.parent.parent.name) > -1 ) {
                setTransition(objects[i].object.parent.parent);
            } else if( objects[i].object.parent.parent.parent && raycasted.indexOf(objects[i].object.parent.parent.parent.name) > -1 ) {
                setTransition(objects[i].object.parent.parent.parent);
            }
        }
    }
} 

assetLoader.load(glbmodel.href, function(gltf) {
    model3d = gltf.scene;
    scene.add(model3d);
    window.requestAnimationFrame(animate);
}, undefined, function(error) {
    console.log(error)
})

const animate = () => {
    onHover();
    orbit.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);   
}

document.body.appendChild( renderer.domElement );
document.addEventListener( 'pointermove', onPointerMove );
document.addEventListener("click", () => {
    if( hovered ) {
        alert(`Year: ${ contents[hovered].year }, Title: ${ contents[hovered].title }, Description: ${ contents[hovered].description }, `);
    }
});