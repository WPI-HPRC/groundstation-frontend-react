import React, { Component } from 'react';
import * as THREE from 'three';
import ReactDOM from 'react-dom/client';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Object3D, Vector3 } from 'three';
import filePath from './hprc2.gltf';
import { chart } from './chart.tsx';

export default class RocketViewer extends Component {



  componentDidMount() {

    const loader = new GLTFLoader();
    var model;
    loader.load(
	    filePath,
	    ( gltf ) => { // all info to set up at start
        model = gltf.scene;
        model.name = 'rocket';
		    scene.add( model );
        model.rotation.z = (3.1415)/2; // this is in radians => 90 degrees

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

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000000 );
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    var lineChart = new chart();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    document.body.appendChild( lineChart.domElement );

    var light2 = new THREE.AmbientLight(0xa0a0a0);
    scene.add(light2);

    camera.position.z = 5;

   

    var animate = function () {
      requestAnimationFrame( animate );

      if( model ) {
        model.scale.set(0.1, 0.1, 0.1);
        model.position.set(0, -5, -5);
        model.rotation.x += 0.01;

      }
      renderer.render( scene, camera );
    };
    animate();
  }
  render() {
    return (
      <div ref={ref => (this.mount = ref)} />
    )
  }
}


