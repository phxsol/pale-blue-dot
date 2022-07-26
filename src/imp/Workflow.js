// Screen Director Reference
import { Workflow as _Workflow } from '../bin/ScreenDirector.js';
// Support Library Reference
import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from '../lib/OrbitControls.js';

// Workflow Implementation
class Workflow extends _Workflow{
  elevated_vars = {
    "u_name": "",
    "ups_test": {
      "ticks": 0,
      "duration": 0,
      "stamps": [],
      "max": -1,
      "min": -1,
      "score": 0
    }
  }

  ActivateOrbitControls = async ( screenplay )=>{
    if( !screenplay.controls.orbit_controls ) {
      screenplay.controls.orbit_controls = new OrbitControls( screenplay.active_cam, screenplay.renderer.domElement );
      screenplay.controls.orbit_controls.zoomSpeed = 8;
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

  verify_capabilities = async ( screenplay, dictum_name, director, ndx ) => {
    console.log( 'Workflow.verify_capabilities' );

    screenplay.updatables.set( 'ups_test', { update: ( delta )=>{
      this.elevated_vars.ups_test.ticks++;
      this.elevated_vars.ups_test.stamps.push( delta );
    }} );
    setTimeout( ()=>{
      screenplay.updatables.delete( 'ups_test' );
      let test = this.elevated_vars.ups_test;
      // remove the first entry to normalize
      test.ticks--;
      test.stamps.shift();
      test.duration = test.stamps.reduce( (a,b) => a + b, 0 );
      test.max = Math.max( ...test.stamps );
      test.min = Math.min( ...test.stamps );
      test.score = 1/((test.duration - test.max) / ( test.ticks -1 ));

      if ( test.score > 20 ) director.emit( `${dictum_name}_progress`, dictum_name, ndx );
      else director.emit( `${dictum_name}_failure`, dictum_name, ndx );
    }, 3000 );
    //  By now, the scene assets have been loaded.
    //  Run some tests to determine system ability.
    //  Adjust performance values in order to optimize the user experience.

  };
  init_controls = async ( screenplay, dictum_name, director, ndx ) => {
    console.log( 'Workflow.init_controls' );

    try{
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
          screenplay.active_cam.rotateOnAxis( new THREE.Vector3( 1, 0, 0), 0.04 );
        },
        'Look Down': function() {
          screenplay.active_cam.rotateOnAxis( new THREE.Vector3( 1, 0, 0), -0.04 );
        },
        'Look Left': function() {
          screenplay.active_cam.rotateOnAxis( new THREE.Vector3( 0, 1, 0), 0.04 );
        },
        'Look Right': function() {
          screenplay.active_cam.rotateOnAxis( new THREE.Vector3( 0, 1, 0), -0.04 );
        },
        'CaptainCam': function() {
          screenplay.actions.change_cam( 'CaptainCam' );
        },
        'OpsCam': function() {
          screenplay.actions.change_cam( 'OpsCam' );
        },
        'ConnCam': function() {
          screenplay.actions.change_cam( 'ConnCam' );
        }
      }
      let camera_gui = gui.addFolder( 'Camera Controls' );
      camera_gui.add( camera_folder, 'CaptainCam' ).name( 'Captain\'s Chair' );
      const ship_folder = {
        'X: +1': function() {
          //screenplay.actors.Ship.position.add( new THREE.Vector3( 1, 0, 0 ));
          screenplay.active_cam.position.add( new THREE.Vector3( 1, 0, 0 ));
        },
        'X: -1': function() {
          //screenplay.actors.Ship.position.add( new THREE.Vector3( -1, 0, 0 ));
          screenplay.active_cam.position.add( new THREE.Vector3( -1, 0, 0 ));
        },
        'Y: +1': function() {
          //screenplay.actors.Ship.position.add( new THREE.Vector3( 0, 1, 0 ));
          screenplay.active_cam.position.add( new THREE.Vector3( 0, 1, 0 ));
        },
        'Y: -1': function() {
          //screenplay.actors.Ship.position.add( new THREE.Vector3( 0, -1, 0 ));
          screenplay.active_cam.position.add( new THREE.Vector3( 0, -1, 0 ));
        },
        'Z: +1': function() {
          //screenplay.actors.Ship.position.add( new THREE.Vector3( 0, 0, 1 ));
          screenplay.active_cam.position.add( new THREE.Vector3( 0, 0, 1 ));
        },
        'Z: -1': function() {
          //screenplay.actors.Ship.position.add( new THREE.Vector3( 0, 0, -1 ));
          screenplay.active_cam.position.add( new THREE.Vector3( 0, 0, -1 ));
        },
        'Turn Left': function() {
          let ship = screenplay.actors.Ship;
          ship.rotation.y -= 0.1;
          ship.updateMatrixWorld( true );
          var rotationMatrix = new THREE.Matrix4().extractRotation( ship.matrixWorld );
          var up_now = new THREE.Vector3( 0, 1, 0 ).applyMatrix4( rotationMatrix ).normalize();
          let sight_target = new THREE.Vector3();
          ship.NavDots.sight_target.getWorldPosition( sight_target );
          screenplay.active_cam.up = up_now;
          screenplay.active_cam.lookAt( sight_target );
        },
        'Turn Right': function() {
          let ship = screenplay.actors.Ship;
          ship.rotation.y += 0.1;
          ship.updateMatrixWorld( true );
          var rotationMatrix = new THREE.Matrix4().extractRotation( ship.matrixWorld );
          var up_now = new THREE.Vector3( 0, 1, 0 ).applyMatrix4( rotationMatrix) .normalize();
          let sight_target = new THREE.Vector3();
          ship.NavDots.sight_target.getWorldPosition( sight_target );
          screenplay.active_cam.up = up_now;
          screenplay.active_cam.lookAt( sight_target );
        }
      }
      let ship_gui = gui.addFolder( 'Ship Controls' );
      screenplay.scene.updates.cache.warp_speed = 0;
      ship_gui.add( screenplay.scene.updates.cache, 'warp_speed' ).name( 'Warp Speed').listen();
      ship_gui.add( screenplay.active_cam, 'zoom' ).onChange(()=>{
        screenplay.active_cam.updateProjectionMatrix();
      });
      ship_gui.add( screenplay.actors.Ship.light, 'intensity' ).name( 'Light Intensity');
      ship_gui.add( screenplay.actors.Ship.light, 'distance' ).name( 'Light Distance');
      ship_gui.add( screenplay.actors.Ship.light, 'decay' ).name( 'Light Decay');
      const shipNav_folder = {

      	Neptune: function() {

          screenplay.actions.warp_to(screenplay.actors.Neptune);
        },
       	Uranus: function() {
          screenplay.actions.warp_to(screenplay.actors.Uranus);
        },
       	Saturn: function() {
          screenplay.actions.warp_to(screenplay.actors.Saturn);
        },
       	Jupiter: function() {
          screenplay.actions.warp_to(screenplay.actors.Jupiter);
        },
       	Mars: function() {
          screenplay.actions.warp_to(screenplay.actors.Mars);
        },
       	Earth: function() {
          screenplay.actions.warp_to(screenplay.actors.Earth);
        },
       	Moon: function() {
          screenplay.actions.warp_to(screenplay.actors.Moon);
        },
       	Venus: function() {
          screenplay.actions.warp_to(screenplay.actors.Venus);
        },
       	Mercury: function() {
          screenplay.actions.warp_to(screenplay.actors.Mercury);
        },
       	Sun: function() {
          screenplay.actions.warp_to(screenplay.actors.Sun);
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
      ship_gui.add( screenplay.gridHelper, 'visible' ).name('Grid Overlay?');
      ship_gui.add( screenplay, 'fps' ).name('Frames / Second').onChange(()=>{
        screenplay.interval = 1 / screenplay.fps;
      });;

      let neptune_gui = gui.addFolder( 'Neptune');
      let neptune = screenplay.actors.Neptune;
      neptune_gui.add ( neptune.material, 'roughness', 0, 1 );
      neptune_gui.add ( neptune.material, 'metalness', 0, 1 );
      neptune_gui.add ( neptune.material, 'wireframe' );

      let uranus_gui = gui.addFolder( 'Uranus');
      let uranus = screenplay.actors.Uranus;
      uranus_gui.add ( uranus.material, 'roughness', 0, 1 );
      uranus_gui.add ( uranus.material, 'metalness', 0, 1 );
      uranus_gui.add ( uranus.material, 'wireframe' );

      let saturn_gui = gui.addFolder( 'Saturn');
      let saturn = screenplay.actors.Saturn;
      saturn_gui.add ( saturn.material, 'roughness', 0, 1 );
      saturn_gui.add ( saturn.material, 'metalness', 0, 1 );
      saturn_gui.add ( saturn.material, 'wireframe' );
      saturn_gui.add ( saturn.children[0].material, 'roughness', 0, 1 ).name( 'rings roughness');
      saturn_gui.add ( saturn.children[0].material, 'metalness', 0, 1 ).name( 'rings metalness');
      saturn_gui.add ( saturn.children[0].material, 'wireframe' ).name( 'rings wireframe');


      let jupiter_gui = gui.addFolder( 'Jupiter');
      let jupiter = screenplay.actors.Jupiter;
      jupiter_gui.add ( jupiter.material, 'roughness', 0, 1 );
      jupiter_gui.add ( jupiter.material, 'metalness', 0, 1 );
      jupiter_gui.add ( jupiter.material, 'wireframe' );

      let mars_gui = gui.addFolder( 'Mars');
      let mars = screenplay.actors.Mars;
      mars_gui.add ( mars.material, 'roughness', 0, 1 );
      mars_gui.add ( mars.material, 'metalness', 0, 1 );
      mars_gui.add ( mars.material, 'wireframe' );

      let earth_gui = gui.addFolder( 'Earth');
      let earth = screenplay.actors.Earth;
      earth_gui.add ( earth.material, 'roughness', 0, 1 );
      earth_gui.add ( earth.material, 'metalness', 0, 1 );
      earth_gui.add ( earth.material, 'emissiveIntensity', 0, 1 );
      earth_gui.add ( earth.material, 'wireframe' );

      let moon_gui = gui.addFolder( 'Moon');
      let moon = screenplay.actors.Moon;
      moon_gui.add ( moon.material, 'roughness', 0, 1 );
      moon_gui.add ( moon.material, 'metalness', 0, 1 );
      moon_gui.add ( moon.material, 'wireframe' );

      let sun_gui = gui.addFolder('Sun');
      let sunlight_gui = sun_gui.addFolder( 'Light');
      let sunlight = screenplay.lights.point_light;
      sunlight_gui.add ( sunlight, 'decay', 0, 2, 1 );
      sunlight_gui.add ( sunlight, 'distance', 0, 4500000000 );
      sunlight_gui.add ( sunlight, 'intensity', 0, 10 ).listen();
      sunlight_gui.add ( sunlight, 'power' ).listen();

      let sun_model_gui = sun_gui.addFolder( 'Sun Model ');
      let sun = screenplay.actors.Sun;
      sun_model_gui.add ( sun.material, 'wireframe' );

      director.emit( `${dictum_name}_progress`, dictum_name, ndx );

    } catch( e ) {

      director.emit( `${dictum_name}_failure`, dictum_name, ndx );

    }
  };
  introduction = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.introduction');

    director.emit( `${dictum_name}_progress`, dictum_name, ndx );
  };
  user_instruction = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.user_introduction');

    director.emit( `${dictum_name}_progress`, dictum_name, ndx );
  };
  tour_or_skip = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.tour_or_skip');

    screenplay.take_the_tour = window.confirm( 'Take the tour?' );

    director.emit( `${dictum_name}_progress`, dictum_name, ndx );
  };
  visit_sun = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_sun');

    screenplay.actions.warp_to( screenplay.actors.Sun, false, {
      director: director,
      dictum_name: dictum_name,
      ndx: ndx
    } );

  };
  visit_mercury = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_mercury');
    
    screenplay.actions.warp_to( screenplay.actors.Mercury, false, {
      director: director,
      dictum_name: dictum_name,
      ndx: ndx
    } );
  };
  visit_venus = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_venus');

    screenplay.actions.warp_to( screenplay.actors.Venus, false, {
      director: director,
      dictum_name: dictum_name,
      ndx: ndx
    } );
  };
  visit_earth = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_earth');

    screenplay.actions.warp_to( screenplay.actors.Earth, false, {
      director: director,
      dictum_name: dictum_name,
      ndx: ndx
    } );
  };
  visit_moon = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_moon');

    screenplay.actions.warp_to( screenplay.actors.Moon, false, {
      director: director,
      dictum_name: dictum_name,
      ndx: ndx
    } );
  };
  visit_mars = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_mars');

    screenplay.actions.warp_to( screenplay.actors.Mars, false, {
      director: director,
      dictum_name: dictum_name,
      ndx: ndx
    } );
  };
  visit_jupiter = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_jupiter');

    screenplay.actions.warp_to( screenplay.actors.Jupiter, false, {
      director: director,
      dictum_name: dictum_name,
      ndx: ndx
    } );
  };
  visit_saturn = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_saturn');

    screenplay.actions.warp_to( screenplay.actors.Saturn, false, {
      director: director,
      dictum_name: dictum_name,
      ndx: ndx
    } );
  };
  visit_uranus = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_uranus');

    screenplay.actions.warp_to( screenplay.actors.Uranus, false, {
      director: director,
      dictum_name: dictum_name,
      ndx: ndx
    } );
  };
  visit_neptune = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_neptune');

    screenplay.actions.warp_to( screenplay.actors.Neptune, false, {
      director: director,
      dictum_name: dictum_name,
      ndx: ndx
    } );
  };
  introduce_phox = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.introduce_phox');

    director.emit( `${dictum_name}_progress`, dictum_name, ndx );
  };
  confirm_privileges = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.confirm_privileges');

    director.emit( `${dictum_name}_progress`, dictum_name, ndx );
  };
  connect = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.connect');

    director.emit( `${dictum_name}_progress`, dictum_name, ndx );
  };
}

export { Workflow }
