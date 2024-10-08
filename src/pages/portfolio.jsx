import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Renderer } from '../components/StartComponents/Renderer';
import { Scene } from '../components/StartComponents/Scene';
import { Camera } from '../components/StartComponents/Camera';
import { Controls } from '../components/StartComponents/Controls';
import { VRResources } from '../components/VRComponents/VRResources';

export function Portfolio({ setGame, setAbout }) {
  useEffect(() => {

    console.log("on portfolio");

    const scene = new Scene().getScene();
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xc7c7c7);
    document.body.appendChild(renderer.domElement);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const camera = new Camera().getCamera();

    // Look at this later -> will change later ? (light so that colors can exist)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);


    // Camera position
    camera.position.set(0, 1.5, 0);
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Movement Control settings
    const controls = new Controls(camera, renderer).getControls();
    controls.target = new THREE.Vector3(0, 1.5, 0);
    controls.minDistance = 0;
    controls.maxDistance = 0.00001;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI + 2.5;

    // Ground materials
    const groundGeo = new THREE.PlaneGeometry(200, 200, 32, 32);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMaterial = new THREE.MeshBasicMaterial({
      color: 0xc7c7c7,
      side: THREE.DoubleSide,
    });

    // Ground Mesh
    const groundMesh = new THREE.Mesh(groundGeo, groundMaterial);
    scene.add(groundMesh);

    // GRIDS -> turn into another component for organization later
    const bigGrid = new THREE.GridHelper(200, 25, 0x898788, 0x000000);
    const smallerGrid = new THREE.GridHelper(200, 200, 0xadadad, 0xadadad);

    bigGrid.position.y = 0.001;


    const ceilingBigGrid = bigGrid.clone();
    const ceilingSmallGrid = smallerGrid.clone();

    scene.add(ceilingBigGrid);
    scene.add(ceilingSmallGrid);
    scene.add(bigGrid);
    scene.add(smallerGrid);

    ceilingBigGrid.position.y = 14.999;
    ceilingSmallGrid.position.y = 15;

    const ceilingMaterial = new THREE.MeshBasicMaterial({
      color: 0xc7c7c7,
      side: THREE.DoubleSide,
    });

    const ceilingMesh = new THREE.Mesh(groundGeo, ceilingMaterial);
    scene.add(ceilingMesh);
    ceilingMesh.position.y = 15;

    // CODE FOR IMPORTING ICONS

    const vrResources = new VRResources(scene);

    // 4 button INTERACTORS (so that when u press on them, different functions are called)
    const button1Interactor = vrResources.getVRButton1Interactor();
    const button2Interactor = vrResources.getVRButton2Interactor();
    const button3Interactor = vrResources.getVRButton3Interactor();
    const button4Interactor = vrResources.getVRButton4Interactor();

    const settingsMenu = vrResources.getsettingsMenu();
    const panel = vrResources.getPanel();

    // const app1 = vrResources.getApp1();
    const app2 = vrResources.getApp2();

    //app1.visible = false;
    app2.visible = false;

    const onMouseClick = (event) => {
      event.preventDefault();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const b1Intersects = raycaster.intersectObjects([button1Interactor]);
      const b2Intersects = raycaster.intersectObjects([button2Interactor]);
      const b3Intersects = raycaster.intersectObjects([button3Interactor]);
      const b4Intersects = raycaster.intersectObjects([button4Interactor]);
      // const app1Intersects = raycaster.intersectObjects([app1]);
      const app2Intersects = raycaster.intersectObjects([app2]);


      if (b1Intersects.length > 0) {
        resetPage();
        console.log('Resetting!');
      }
      if (b2Intersects.length > 0) {
        openPanel();
        console.log('Opening Control Panel');
      }
      if (b3Intersects.length > 0) {
        openSettings();
        console.log('Settings');
      }
      if (b4Intersects.length > 0) {
        moveSite();
        console.log('Moving to other site...');
      }

      // if (app1Intersects.length > 0 && panel.visible == true) {
      //   openPortfolio();
      //   console.log("Opening portfolio...");
      // }
      if (app2Intersects.length > 0 && panel.visible == true) {
        generateGame();
        console.log("Generating Game...");
      }
    };

    const resetPage = () => {
      if (panel.visible == true) {
        panel.visible = false;
        //app1.visible = false;
        app2.visible = false;
      }

      if (settingsMenu.visible == true) {
        settingsMenu.visible = false;
      }
    }

    const openPanel = () => {
      if (panel.visible == false) {
        panel.visible = true;
        //app1.visible = true; // maybe change this to actually exist LATER ON... but for RN just gonna keep it to not exist.        
        app2.visible = true; 
      }
      else {
        panel.visible = false;
        //app1.visible = false;
        app2.visible = false;
      }
      console.log("PANEL IS OPEN");
    }

    const openSettings = () => {
      // create settings menu (or just call it from a diff component is what i mean)
      if (settingsMenu.visible == false) {
        settingsMenu.visible = true;
      }
      else {
        settingsMenu.visible = false;
      }
    }

    const moveSite = () => {
      // move to other site - create the site that this will go to (last thing?)
      window.open("https://github.com/aaronmpark", "_blank")
    }

    const openPortfolio = () => {
      // Open another thing that will just open a website on the page?
      setAbout(true);
      // write here to also reset the other page to save space
    }

    const generateGame = () => {
      setGame(true);
      // write here to also reset the other page to save space
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('click', onMouseClick, false);

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);

    }

    animate();
    return () => {
      window.removeEventListener('click', onMouseClick);
      window.removeEventListener('resize', onWindowResize);
      // Dispose of geometries, materials, and textures
      scene.traverse((object) => {
        if (object.isMesh) {
          object.geometry.dispose();
          if (object.material.isMaterial) {
            cleanMaterial(object.material);
          } else {
            // If it's an array of materials
            for (const material of object.material) cleanMaterial(material);
          }
        }
      });

      // Clean up renderer
      renderer.dispose();

      // Remove renderer's DOM element
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };

    function cleanMaterial(material) {
      material.dispose();

      // Dispose of textures
      for (const key in material) {
        const value = material[key];
        if (value && typeof value === 'object' && 'minFilter' in value) {
          value.dispose();
        }
      }
    }

  }, [setGame, setAbout]);
  return <div />;
}
