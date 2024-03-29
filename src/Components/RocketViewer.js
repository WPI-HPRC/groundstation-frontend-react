import React from 'react';
import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import filePath from '../hprc3.gltf';


/*
*  The panel showing the 3D visual of the rocket's orientation
*  hidden behind map by default
*/ 

// locations of the different backgrounds, if you want them.
//'space_2.jpg'; <-- what you get when you google 'cool space background'
//'image.png'; <-- Max
//'Toby_wtf.png'; <-- Toby
//'blank_background.png'; <-- the real one

export default class RocketViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gyroX: props.gyroX,
            gyroY: props.gyroY,
            gyroZ: props.gyroZ,
            time: props.vehicleClock,
            rocketQuaternion: props.rocketQuaternion,
            dark: props.dark,
        }

        this.map = 0;
    }


    static getDerivedStateFromProps(props, current_state) {
        if (current_state.gyroX !== props.gyroX ||
            current_state.gyroY !== props.gyroY ||
            current_state.gyroZ !== props.gyroZ || 
            current_state.time !== props.vehicleClock0 ||
            current_state.rocketQuaternion !== props.rocketQuaternion ||
            current_state.dark !== props.dark) {
            return {
                gyroX: props.gyroX,
                gyroY: props.gyroY,
                gyroZ: props.gyroZ,
                time: props.vehicleClock,
                rocketQuaternion: props.rocketQuaternion,
                dark: props.dark,
            }
        }
        return null
    }

  componentDidMount() {

    const root = this;

    // load the background texture
    const bgLoader = new THREE.TextureLoader();
    const backgroundPicture = bgLoader.load("blank_background.png");
    const backgroundPictureLight = bgLoader.load("blank_background_light.png");


    // load the model
    const loader = new GLTFLoader();
    var model;
    loader.load(
	    "hprc3.gltf",
	    ( gltf ) => { // all info to set up at start
        model = gltf.scene;
        model.name = 'rocket';
		    scene.add( model );
        // model.rotation.z = (3.1415)/2; // this is in radians => 90 degrees

	    },
  	  // called while loading is progressing
	    function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        console.log( xhr.loaded + " " + xhr.total );

	    },
  	  // called when loading has errors
	    function ( error ) {

        console.log( 'An error happened' );
        console.log(error);

	    }
    );
    var canvas = document.getElementById('canvas3D');

    // set up the scene
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, 1, 0.1, 10000 );
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(476, 460, false);
    canvas.appendChild( renderer.domElement );

    var light2 = new THREE.AmbientLight(0xa0a0a0);
    scene.add(light2); // without light the model would be hidden

    // scene.background = backgroundPicture; // attach the background image

    camera.position.z = 5;

    


    var animate = function () {
      requestAnimationFrame( animate );

      if( model ) { // animation

        if(root.state.dark) {
          scene.background = backgroundPicture;
        } else {
          scene.background = backgroundPictureLight;
        }

        model.scale.set(0.1, 0.1, 0.1);
        model.position.set(0, -1, -2);
        model.rotation.set(0, 0, 0);
        let rocketQ = new THREE.Quaternion();
        rocketQ.set(root.state.rocketQuaternion[0], root.state.rocketQuaternion[1], root.state.rocketQuaternion[2], root.state.rocketQuaternion[3]);
        rocketQ.normalize();
        model.applyQuaternion(rocketQ);
        // let xRotation = root.state.gyroX;
        // let yRotation = root.state.gyroY;
        // let zRotation = root.state.gyroZ;
        // model.rotation.x += xRotation;
        // model.rotation.y += yRotation;
        // model.rotation.z += zRotation;

      }



      var canvas = document.getElementById('canvas3D');
      camera.aspect = canvas.clientWidth / camera.clientHeight;

      renderer.render( scene, camera );
    };
    animate();
  }
  render() {
    // return (
    //   // <div ref={ref => (this.mount = ref)} />
    // )

    return(null)
  }
}


