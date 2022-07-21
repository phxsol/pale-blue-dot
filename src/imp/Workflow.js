// Screen Director Reference
import { Workflow as _Workflow } from '../bin/ScreenDirector.js';
// Support Library Reference
import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from '../lib/OrbitControls.js';

// Workflow Implementation
class Workflow extends _Workflow{
  elevated_vars = {
    "u_name": ""
  }

  ActivateOrbitControls = async ( screenplay )=>{
    if( !screenplay.controls.orbit_controls ) {
      screenplay.controls.orbit_controls = new OrbitControls( screenplay.active_cam, screenplay.renderer.domElement );
      screenplay.controls.orbit_controls.zoomSpeed = 4;
      screenplay.controls.orbit_controls.enableDamping = true;
      screenplay.controls.orbit_controls.saveState();
    }
    let _ship = screenplay.actors.Ship;
    switch( screenplay.active_cam.name ){
      case 'ConnCam':
        _ship.conn_station.getWorldPosition( screenplay.controls.orbit_controls.target );
        break;
      case 'OpsCam':
        _ship.ops_station.getWorldPosition( screenplay.controls.orbit_controls.target );
        break;
      case 'CaptainCam':
        _ship.ops_station.getWorldPosition( screenplay.controls.orbit_controls.target );
        break;
    }
    screenplay.controls.orbit_controls.release_distance = 1 + screenplay.controls.orbit_controls.getDistance();
    screenplay.updatables.set( 'controls', screenplay.controls.orbit_controls );
    screenplay.active_cam.user_control = true;
    screenplay.active_cam.updateProjectionMatrix();
    screenplay.controls.orbit_controls.enabled = true;

  }

  DeactivateOrbitControls = async ( screenplay )=>{
    screenplay.controls.orbit_controls.reset();
    screenplay.actions.change_cam( screenplay.active_cam.name );
    screenplay.controls.orbit_controls.enabled = false;
    screenplay.updatables.delete( 'controls' );
    screenplay.active_cam.user_control = false;
  }

  confirm_privileges = async ( screenplay ) => {
    console.log('Workflow.confirm_privileges');
    return true;
  };
  verify_capabilities = async ( screenplay ) => {
    console.log( 'Workflow.verify_capabilities' );
    return true;
  };
  introduction = async ( screenplay ) => {
    console.log('Workflow.introduction');
    return true;
  };
  user_introduction = async ( screenplay ) => {
    console.log('Workflow.user_introduction');

    screenplay.renderer.domElement.addEventListener( 'wheel', (event)=>{

        if( !screenplay.active_cam.user_control && event.deltaY > 0 ){
          this.ActivateOrbitControls( screenplay );
        } else if( screenplay.active_cam.user_control && event.deltaY < 0 ){
          if( screenplay.controls.orbit_controls.getDistance() < screenplay.controls.orbit_controls.release_distance ){
            this.DeactivateOrbitControls( screenplay );
          }
        }
    }, { capture: false } );

    const gui = new GUI( { title: 'User Interface' });
    const camera_folder = {
      'Look Up': function() {
        scene_assets.active_cam.rotateOnAxis( new THREE.Vector3( 1, 0, 0), 0.04 );
      },
      'Look Down': function() {
        scene_assets.active_cam.rotateOnAxis( new THREE.Vector3( 1, 0, 0), -0.04 );
      },
      'Look Left': function() {
        scene_assets.active_cam.rotateOnAxis( new THREE.Vector3( 0, 1, 0), 0.04 );
      },
      'Look Right': function() {
        scene_assets.active_cam.rotateOnAxis( new THREE.Vector3( 0, 1, 0), -0.04 );
      },
      'CaptainCam': function() {
        scene_assets.actions.change_cam( 'CaptainCam' );
      },
      'OpsCam': function() {
        scene_assets.actions.change_cam( 'OpsCam' );
      },
      'ConnCam': function() {
        scene_assets.actions.change_cam( 'ConnCam' );
      }
    }
    let camera_gui = gui.addFolder( 'Camera Controls' );
    camera_gui.add( camera_folder, 'CaptainCam' ).name( 'Captain\'s Chair' );
    //camera_gui.add( camera_folder, 'OpsCam' ).name( 'Ops Station' );
    //camera_gui.add( camera_folder, 'ConnCam' ).name( 'Conn Station' );
    //camera_gui.add( camera_folder, 'Look Up' ).name('Look Up');
    //camera_gui.add( camera_folder, 'Look Down' ).name('Turn Down');
    //camera_gui.add( camera_folder, 'Look Left' ).name('Look Left');
    //camera_gui.add( camera_folder, 'Look Right' ).name('Look Right');
    const ship_folder = {
      'X: +1': function() {
        //scene_assets.actors.Ship.position.add( new THREE.Vector3( 1, 0, 0 ));
        scene_assets.active_cam.position.add( new THREE.Vector3( 1, 0, 0 ));
      },
      'X: -1': function() {
        //scene_assets.actors.Ship.position.add( new THREE.Vector3( -1, 0, 0 ));
        scene_assets.active_cam.position.add( new THREE.Vector3( -1, 0, 0 ));
      },
      'Y: +1': function() {
        //scene_assets.actors.Ship.position.add( new THREE.Vector3( 0, 1, 0 ));
        scene_assets.active_cam.position.add( new THREE.Vector3( 0, 1, 0 ));
      },
      'Y: -1': function() {
        //scene_assets.actors.Ship.position.add( new THREE.Vector3( 0, -1, 0 ));
        scene_assets.active_cam.position.add( new THREE.Vector3( 0, -1, 0 ));
      },
      'Z: +1': function() {
        //scene_assets.actors.Ship.position.add( new THREE.Vector3( 0, 0, 1 ));
        scene_assets.active_cam.position.add( new THREE.Vector3( 0, 0, 1 ));
      },
      'Z: -1': function() {
        //scene_assets.actors.Ship.position.add( new THREE.Vector3( 0, 0, -1 ));
        scene_assets.active_cam.position.add( new THREE.Vector3( 0, 0, -1 ));
      },
      'Turn Left': function() {
        let ship = scene_assets.actors.Ship;
        ship.rotation.y -= 0.1;
        ship.updateMatrixWorld( true );
        var rotationMatrix = new THREE.Matrix4().extractRotation( ship.matrixWorld );
        var up_now = new THREE.Vector3( 0, 1, 0 ).applyMatrix4( rotationMatrix ).normalize();
        let sight_target = new THREE.Vector3();
        ship.NavDots.sight_target.getWorldPosition( sight_target );
        scene_assets.active_cam.up = up_now;
        scene_assets.active_cam.lookAt( sight_target );
      },
      'Turn Right': function() {
        let ship = scene_assets.actors.Ship;
        ship.rotation.y += 0.1;
        ship.updateMatrixWorld( true );
        var rotationMatrix = new THREE.Matrix4().extractRotation( ship.matrixWorld );
        var up_now = new THREE.Vector3( 0, 1, 0 ).applyMatrix4( rotationMatrix) .normalize();
        let sight_target = new THREE.Vector3();
        ship.NavDots.sight_target.getWorldPosition( sight_target );
        scene_assets.active_cam.up = up_now;
        scene_assets.active_cam.lookAt( sight_target );
      }
    }
    let ship_gui = gui.addFolder( 'Ship Controls' );
    scene_assets.scene.updates.cache.warp_speed = 0;
    ship_gui.add( scene_assets.scene.updates.cache, 'warp_speed' ).name( 'Warp Speed').listen();
    ship_gui.add( scene_assets.active_cam, 'zoom' ).onChange(()=>{
      scene_assets.active_cam.updateProjectionMatrix();
    });
    ship_gui.add( scene_assets.actors.Ship.light, 'intensity' ).name( 'Light Intensity');
    ship_gui.add( scene_assets.actors.Ship.light, 'distance' ).name( 'Light Distance');
    ship_gui.add( scene_assets.actors.Ship.light, 'decay' ).name( 'Light Decay');

    //ship_gui.add( ship_folder, 'X: +1' ).name(' nudge X by +1');
    //ship_gui.add( ship_folder, 'X: -1' ).name(' nudge X by -1');
    //ship_gui.add( ship_folder, 'Y: +1' ).name(' nudge Y by +1');
    //ship_gui.add( ship_folder, 'Y: -1' ).name(' nudge Y by -1');
    //ship_gui.add( ship_folder, 'Z: +1' ).name(' nudge Z by +1');
    //ship_gui.add( ship_folder, 'Z: -1' ).name(' nudge Z by -1');
    //ship_gui.add( ship_folder, 'Turn Left' );
    //ship_gui.add( ship_folder, 'Turn Right' );
    const shipNav_folder = {

    	Neptune: function() {

        scene_assets.actions.warp_to(scene_assets.actors.Neptune);
      },
     	Uranus: function() {
        scene_assets.actions.warp_to(scene_assets.actors.Uranus);
      },
     	Saturn: function() {
        scene_assets.actions.warp_to(scene_assets.actors.Saturn);
      },
     	Jupiter: function() {
        scene_assets.actions.warp_to(scene_assets.actors.Jupiter);
      },
     	Mars: function() {
        scene_assets.actions.warp_to(scene_assets.actors.Mars);
      },
     	Earth: function() {
        scene_assets.actions.warp_to(scene_assets.actors.Earth);
      },
     	Moon: function() {
        scene_assets.actions.warp_to(scene_assets.actors.Moon);
      },
     	Venus: function() {
        scene_assets.actions.warp_to(scene_assets.actors.Venus);
      },
     	Mercury: function() {
        scene_assets.actions.warp_to(scene_assets.actors.Mercury);
      },
     	Sun: function() {
        scene_assets.actions.warp_to(scene_assets.actors.Sun);
      }
    }
    ship_gui.add( shipNav_folder, 'Neptune' ).name('...to Neptune');
    ship_gui.add( shipNav_folder, 'Uranus' ).name('...to Uranus');
    ship_gui.add( shipNav_folder, 'Saturn' ).name('...to Saturn');
    ship_gui.add( shipNav_folder, 'Jupiter' ).name('...to Jupiter');
    ship_gui.add( shipNav_folder, 'Mars' ).name('...to Mars');
    ship_gui.add( shipNav_folder, 'Earth' ).name('...to Earth');
    ship_gui.add( shipNav_folder, 'Moon' ).name('...to Moon');
    ship_gui.add( shipNav_folder, 'Venus' ).name('...to Venus');
    ship_gui.add( shipNav_folder, 'Mercury' ).name('...to Mercury');
    ship_gui.add( shipNav_folder, 'Sun' ).name('...to Sun');

    let neptune_gui = gui.addFolder( 'Neptune');
    let neptune = scene_assets.actors.Neptune;
    neptune_gui.add ( neptune.material, 'roughness', 0, 1 );
    neptune_gui.add ( neptune.material, 'metalness', 0, 1 );
    neptune_gui.add ( neptune.material, 'wireframe' );

    let uranus_gui = gui.addFolder( 'Uranus');
    let uranus = scene_assets.actors.Uranus;
    uranus_gui.add ( uranus.material, 'roughness', 0, 1 );
    uranus_gui.add ( uranus.material, 'metalness', 0, 1 );
    uranus_gui.add ( uranus.material, 'wireframe' );

    let saturn_gui = gui.addFolder( 'Saturn');
    let saturn = scene_assets.actors.Saturn;
    saturn_gui.add ( saturn.material, 'roughness', 0, 1 );
    saturn_gui.add ( saturn.material, 'metalness', 0, 1 );
    saturn_gui.add ( saturn.material, 'wireframe' );
    saturn_gui.add ( saturn.children[0].material, 'roughness', 0, 1 ).name( 'rings roughness');
    saturn_gui.add ( saturn.children[0].material, 'metalness', 0, 1 ).name( 'rings metalness');
    saturn_gui.add ( saturn.children[0].material, 'wireframe' ).name( 'rings wireframe');


    let jupiter_gui = gui.addFolder( 'Jupiter');
    let jupiter = scene_assets.actors.Jupiter;
    jupiter_gui.add ( jupiter.material, 'roughness', 0, 1 );
    jupiter_gui.add ( jupiter.material, 'metalness', 0, 1 );
    jupiter_gui.add ( jupiter.material, 'wireframe' );

    let mars_gui = gui.addFolder( 'Mars');
    let mars = scene_assets.actors.Mars;
    mars_gui.add ( mars.material, 'roughness', 0, 1 );
    mars_gui.add ( mars.material, 'metalness', 0, 1 );
    mars_gui.add ( mars.material, 'wireframe' );

    let earth_gui = gui.addFolder( 'Earth');
    let earth = scene_assets.actors.Earth;
    earth_gui.add ( earth.material, 'roughness', 0, 1 );
    earth_gui.add ( earth.material, 'metalness', 0, 1 );
    earth_gui.add ( earth.material, 'emissiveIntensity', 0, 1 );
    earth_gui.add ( earth.material, 'wireframe' );

    let moon_gui = gui.addFolder( 'Moon');
    let moon = scene_assets.actors.Moon;
    moon_gui.add ( moon.material, 'roughness', 0, 1 );
    moon_gui.add ( moon.material, 'metalness', 0, 1 );
    moon_gui.add ( moon.material, 'wireframe' );

    let sun_gui = gui.addFolder('Sun');
    let sunlight_gui = sun_gui.addFolder( 'Light');
    let sunlight = scene_assets.lights.point_light;
    sunlight_gui.add ( sunlight, 'decay', 0, 2, 1 );
    sunlight_gui.add ( sunlight, 'distance', 0, 4500000000 );
    sunlight_gui.add ( sunlight, 'intensity', 0, 10 ).listen();
    sunlight_gui.add ( sunlight, 'power' ).listen();

    let sun_model_gui = sun_gui.addFolder( 'Sun Model ');
    let sun = scene_assets.actors.Sun;
    sun_model_gui.add ( sun.material, 'wireframe' );

    return true;
  };
}

export { Workflow }
