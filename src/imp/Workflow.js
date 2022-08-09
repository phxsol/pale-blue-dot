// Screen Director Reference
import { Workflow as _Workflow, SceneAsset3D } from '../bin/ScreenDirector.js';
// Support Library Reference
import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from '../lib/OrbitControls.js';
import { FirstPersonControls } from '../lib/FirstPersonControls.js';
import { FlyControls } from '../lib/FlyControls.js';
import { TrackballControls } from '../lib/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from '../lib/CSS3DRenderer.js';

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
    },
    "resume": {
      "objects": [],
      "targets": {
        "timeline": [],
        "table": [],
        "sphere": [],
        "helix": [],
        "grid": []
      }
    },
    "lil_gui": {}
  }

  ActivateOrbitControls = async ( screenplay )=>{
    if( !screenplay.controls.orbit_controls ) {
      screenplay.controls.orbit_controls = new OrbitControls( screenplay.active_cam, screenplay.ui_renderer.domElement );
      screenplay.controls.orbit_controls.zoomSpeed = 4;
      screenplay.controls.orbit_controls.enableDamping = true;
      screenplay.controls.orbit_controls.saveState();
    }
    let ship = screenplay.actors.Ship;
    switch( screenplay.active_cam.name ){
      case 'Center':
        screenplay.controls.orbit_controls.target = new THREE.Vector3();
        break;
      case '3rdPerson':
        ship.getWorldPosition( screenplay.controls.orbit_controls.target );
        break;
      case 'CaptainCam':
        ship.NavDots.sight_target.getWorldPosition( screenplay.controls.orbit_controls.target );
        break;
    }
    screenplay.controls.orbit_controls.release_distance = 1 + screenplay.controls.orbit_controls.getDistance();
    screenplay.updatables.set( 'controls', screenplay.controls.orbit_controls );
    screenplay.active_cam.user_control = true;
    screenplay.active_cam.updateProjectionMatrix();
    screenplay.controls.orbit_controls.enabled = true;

  }
  DeactivateOrbitControls = async ( screenplay )=>{
    if( !screenplay.controls.orbit_controls ) {
      screenplay.controls.orbit_controls = new OrbitControls( screenplay.active_cam, screenplay.ui_renderer.domElement );
    }
    screenplay.controls.orbit_controls.reset();
    screenplay.actions.change_cam( screenplay.active_cam.name );
    screenplay.controls.orbit_controls.enabled = false;
    screenplay.updatables.delete( 'controls' );
    screenplay.active_cam.user_control = false;
  }

  ActivateFirstPersonControls = async ( screenplay )=>{
    if( !screenplay.controls.first_person_controls ) {
      screenplay.controls.first_person_controls = new FirstPersonControls( screenplay.active_cam, screenplay.ui_renderer.domElement );
    }
    screenplay.controls.first_person_controls.movementSpeed = 1000;
    screenplay.controls.first_person_controls.lookSpeed = 10 * 0.005;
    let ship = screenplay.actors.Ship;
    switch( screenplay.active_cam.name ){
      case 'Center':
        //screenplay.controls.first_person_controls.target.copy( screenplay.props.SplashScreen.position );
        break;
      case '3rdPerson':
        //ship.getWorldPosition( screenplay.controls.first_person_controls.target );
        break;
      case 'CaptainCam':
        //ship.NavDots.sight_target.getWorldPosition( screenplay.controls.first_person_controls.target );
        break;
    }
    //screenplay.controls.first_person_controls.release_distance = 1 + screenplay.first_person_controls.orbit_controls.getDistance();
    screenplay.updatables.set( 'controls', screenplay.controls.first_person_controls );
    screenplay.active_cam.user_control = true;
    screenplay.active_cam.updateProjectionMatrix();
    screenplay.controls.first_person_controls.enabled = true;
  }
  DeactivateFirstPersonControls = async ( screenplay )=>{
    if( !screenplay.controls.first_person_controls ) {
      screenplay.controls.first_person_controls = new FirstPersonControls( screenplay.active_cam, screenplay.ui_renderer.domElement );
    }
    screenplay.actions.change_cam( screenplay.active_cam.name );
    screenplay.controls.first_person_controls.enabled = false;
    screenplay.updatables.delete( 'controls' );
    screenplay.active_cam.user_control = false;
  }

  ActivateFlyControls = async ( screenplay )=>{
    if( !screenplay.controls.fly_controls ) {
      screenplay.controls.fly_controls = new FlyControls( screenplay.active_cam, screenplay.ui_renderer.domElement );
    }
    screenplay.controls.fly_controls.movementSpeed = 1000;
    screenplay.controls.fly_controls.rollSpeed = 10 * 0.005;
    screenplay.controls.fly_controls.dragToLook = true;
    let ship = screenplay.actors.Ship;
    switch( screenplay.active_cam.name ){
      case 'Center':
        //screenplay.controls.first_person_controls.target.copy( screenplay.props.SplashScreen.position );
        break;
      case '3rdPerson':
        //ship.getWorldPosition( screenplay.controls.first_person_controls.target );
        break;
      case 'CaptainCam':
        //ship.NavDots.sight_target.getWorldPosition( screenplay.controls.first_person_controls.target );
        break;
    }
    //screenplay.controls.first_person_controls.release_distance = 1 + screenplay.first_person_controls.orbit_controls.getDistance();
    screenplay.updatables.set( 'controls', screenplay.controls.fly_controls );
    screenplay.active_cam.user_control = true;
    screenplay.active_cam.updateProjectionMatrix();
    screenplay.controls.fly_controls.enabled = true;
  }
  DeactivateFlyControls = async ( screenplay )=>{
    if( !screenplay.controls.fly_controls ) {
      screenplay.controls.fly_controls = new FlyControls( screenplay.active_cam, screenplay.ui_renderer.domElement );
    }
    screenplay.actions.change_cam( screenplay.active_cam.name );
    screenplay.controls.first_person_controls.enabled = false;
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
      screenplay.ui_renderer.domElement.addEventListener( 'wheel', (event)=>{

          if( !screenplay.active_cam.user_control && event.deltaY > 0 ){
            this.ActivateOrbitControls( screenplay );
          } else if( screenplay.active_cam.user_control && event.deltaY < 0 ){
            if( screenplay.controls.orbit_controls.getDistance() < screenplay.controls.orbit_controls.release_distance ){
              this.DeactivateOrbitControls( screenplay );
            }
          }
      }, { capture: true } );

      const gui = this.elevated_vars.lil_gui = new GUI( { title: 'User Interface' });
      gui.open( false );
      let camera_controls_folder = gui.addFolder( 'Camera Controls' );
      const camera_controls = {
        'CaptainCam': ()=>{
          screenplay.actions.change_cam( 'CaptainCam' );
        },
        '3rdPerson': ()=>{
          screenplay.actions.change_cam( '3rdPerson' );
        },
        'Center': ()=>{
          screenplay.actions.change_cam( 'Center' );
        }
      }
      camera_controls_folder.add( camera_controls, 'CaptainCam' ).name( 'Captain\'s Chair' );
      camera_controls_folder.add( camera_controls, '3rdPerson' ).name( '3rd Person' );
      camera_controls_folder.add( camera_controls, 'Center' ).name( 'Center' );
      camera_controls_folder.add( screenplay.active_cam, 'zoom' ).onChange(()=>{
        screenplay.active_cam.updateProjectionMatrix();
      });
      camera_controls_folder.add( screenplay.gridHelper, 'visible' ).name('Grid Overlay?');
      camera_controls_folder.add( screenplay, 'fps' ).name('Frames / Second').onChange(()=>{
        screenplay.interval = 1 / screenplay.fps;
      });
      camera_controls_folder.open( false );

      let ship_settings_folder = gui.addFolder( 'Ship Settings' );
      ship_settings_folder.add( screenplay.actors.Ship.light, 'intensity' ).name( 'Light Intensity');
      ship_settings_folder.add( screenplay.actors.Ship.light, 'distance' ).name( 'Light Distance');
      ship_settings_folder.add( screenplay.actors.Ship.light, 'decay' ).name( 'Light Decay');
      ship_settings_folder.add ( screenplay.actors.Ship.bulkhead_open, 'visible' ).onChange(()=>{ screenplay.actors.Ship.bulkhead.visible = !screenplay.actors.Ship.bulkhead_open.visible }).name( 'Show Top?');
      ship_settings_folder.add ( screenplay.actors.Ship.bulkhead_open.material, 'roughness', 0, 1 ).onChange(()=>{ screenplay.actors.Ship.bulkhead.material.rougness = screenplay.actors.Ship.bulkhead_open.material.rougness }).name( 'Material Roughness');
      ship_settings_folder.add ( screenplay.actors.Ship.bulkhead_open.material, 'metalness', 0, 1 ).onChange(()=>{ screenplay.actors.Ship.bulkhead.material.metalness = screenplay.actors.Ship.bulkhead_open.material.metalness }).name( 'Material Metalness');
      ship_settings_folder.add ( screenplay.actors.Ship.bulkhead_open.material, 'wireframe' ).onChange(()=>{ screenplay.actors.Ship.bulkhead.material.wireframe = screenplay.actors.Ship.bulkhead_open.material.wireframe }).name( 'Wireframe Only?');
      ship_settings_folder.open( false );

      let ship_nav_folder = gui.addFolder( 'Ship Navigation' );
      const ship_navigation = {

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
      ship_nav_folder.add( ship_navigation, 'Neptune' ).name('... to Neptune');
      ship_nav_folder.add( ship_navigation, 'Uranus' ).name('...to Uranus');
      ship_nav_folder.add( ship_navigation, 'Saturn' ).name('...to Saturn');
      ship_nav_folder.add( ship_navigation, 'Jupiter' ).name('...to Jupiter');
      ship_nav_folder.add( ship_navigation, 'Mars' ).name('...to Mars');
      ship_nav_folder.add( ship_navigation, 'Earth' ).name('...to Earth');
      ship_nav_folder.add( ship_navigation, 'Moon' ).name('...to Moon');
      ship_nav_folder.add( ship_navigation, 'Venus' ).name('...to Venus');
      ship_nav_folder.add( ship_navigation, 'Mercury' ).name('...to Mercury');
      ship_nav_folder.add( ship_navigation, 'Sun' ).name('...to Sun');
      ship_nav_folder.open( false );

      let neptune_folder = gui.addFolder( 'Neptune');
      let neptune = screenplay.actors.Neptune;
      neptune_folder.add ( neptune.material, 'roughness', 0, 1 );
      neptune_folder.add ( neptune.material, 'metalness', 0, 1 );
      neptune_folder.add ( neptune.material, 'wireframe' ).name( 'Wireframe Only?');
      neptune_folder.open( false );

      let uranus_folder = gui.addFolder( 'Uranus');
      let uranus = screenplay.actors.Uranus;
      uranus_folder.add ( uranus.material, 'roughness', 0, 1 );
      uranus_folder.add ( uranus.material, 'metalness', 0, 1 );
      uranus_folder.add ( uranus.material, 'wireframe' ).name( 'Wireframe Only?');
      uranus_folder.open( false );

      let saturn_folder = gui.addFolder( 'Saturn');
      let saturn = screenplay.actors.Saturn;
      saturn_folder.add ( saturn.material, 'roughness', 0, 1 );
      saturn_folder.add ( saturn.material, 'metalness', 0, 1 );
      saturn_folder.add ( saturn.material, 'wireframe' ).name( 'Wireframe Only?');
      saturn_folder.add ( saturn.children[0].material, 'roughness', 0, 1 ).name( 'rings roughness');
      saturn_folder.add ( saturn.children[0].material, 'metalness', 0, 1 ).name( 'rings metalness');
      saturn_folder.add ( saturn.children[0].material, 'wireframe' ).name( 'Rings Wireframe Only?');
      saturn_folder.open( false );

      let jupiter_folder = gui.addFolder( 'Jupiter');
      let jupiter = screenplay.actors.Jupiter;
      jupiter_folder.add ( jupiter.material, 'roughness', 0, 1 );
      jupiter_folder.add ( jupiter.material, 'metalness', 0, 1 );
      jupiter_folder.add ( jupiter.material, 'wireframe' ).name( 'Wireframe Only?');
      jupiter_folder.open( false );

      let mars_folder = gui.addFolder( 'Mars');
      let mars = screenplay.actors.Mars;
      mars_folder.add ( mars.material, 'roughness', 0, 1 );
      mars_folder.add ( mars.material, 'metalness', 0, 1 );
      mars_folder.add ( mars.material, 'wireframe' ).name( 'Wireframe Only?');
      mars_folder.open( false );

      let earth_folder = gui.addFolder( 'Earth');
      let earth = screenplay.actors.Earth;
      earth_folder.add ( earth.material, 'roughness', 0, 1 );
      earth_folder.add ( earth.material, 'metalness', 0, 1 );
      earth_folder.add ( earth.material, 'emissiveIntensity', 0, 1 );
      earth_folder.add ( earth.material, 'wireframe' ).name( 'Wireframe Only?');
      earth_folder.open( false );

      let moon_folder = gui.addFolder( 'Moon');
      let moon = screenplay.actors.Moon;
      moon_folder.add ( moon.material, 'roughness', 0, 1 );
      moon_folder.add ( moon.material, 'metalness', 0, 1 );
      moon_folder.add ( moon.material, 'wireframe' ).name( 'Wireframe Only?');
      moon_folder.open( false );

      let venus_folder = gui.addFolder( 'Venus');
      let venus = screenplay.actors.Venus;
      venus_folder.add ( venus.material, 'roughness', 0, 1 );
      venus_folder.add ( venus.material, 'metalness', 0, 1 );
      venus_folder.add ( venus.material, 'wireframe' ).name( 'Wireframe Only?');
      venus_folder.open( false );

      let mercury_folder = gui.addFolder( 'Mercury');
      let mercury = screenplay.actors.Mercury;
      mercury_folder.add ( mercury.material, 'roughness', 0, 1 );
      mercury_folder.add ( mercury.material, 'metalness', 0, 1 );
      mercury_folder.add ( mercury.material, 'wireframe' ).name( 'Wireframe Only?');
      mercury_folder.open( false );

      let sun_folder = gui.addFolder('Sun');
      let sunlight_folder = sun_folder.addFolder( 'Light');
      let sunlight = screenplay.lights.point_light;
      sunlight_folder.add ( sunlight, 'decay', 0, 2, 1 );
      sunlight_folder.add ( sunlight, 'distance', 0, 4500000000 );
      sunlight_folder.add ( sunlight, 'intensity', 0, 10 ).listen();
      sunlight_folder.add ( sunlight, 'power' ).listen();
      sunlight_folder.open( true );

      let sun_model_folder = sun_folder.addFolder( 'Sun Model ');
      let sun = screenplay.actors.Sun;
      sun_model_folder.add ( sun.material, 'wireframe' ).name( 'Wireframe Only?');
      sun_model_folder.open( true );

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
    this.ActivateOrbitControls( screenplay );

    const gui = this.elevated_vars.lil_gui;
    gui.open( true );
    gui.folders.forEach( (folder)=>{
      folder.open( false );
    });

    director.emit( `${dictum_name}_progress`, dictum_name, ndx );
  };
  visit_sun = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_sun');

    screenplay.actions.warp_to( screenplay.actors.Sun, false, {
      director: director,
      dictum_name: dictum_name,
      ndx: ndx
    } );

    const gui = this.elevated_vars.lil_gui;
    gui.open( true );
    gui.folders.forEach( (folder)=>{
      let show = ( folder._title === 'Ship Navigation' || folder._title === 'Sun');
      folder.open( show );
    });

  };
  visit_mercury = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_mercury');

    screenplay.actions.warp_to( screenplay.actors.Mercury, false, {
      director: director,
      dictum_name: dictum_name,
      ndx: ndx
    } );

    const gui = this.elevated_vars.lil_gui;
    gui.open( true );
    gui.folders.forEach( (folder)=>{
      let show = ( folder._title === 'Ship Navigation' || folder._title === 'Mercury');
      folder.open( show );
    });
  };
  visit_venus = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_venus');

    screenplay.actions.warp_to( screenplay.actors.Venus, false, {
      director: director,
      dictum_name: dictum_name,
      ndx: ndx
    } );

    const gui = this.elevated_vars.lil_gui;
    gui.open( true );
    gui.folders.forEach( (folder)=>{
      let show = ( folder._title === 'Ship Navigation' || folder._title === 'Venus');
      folder.open( show );
    });
  };
  visit_earth = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_earth');

    screenplay.actions.warp_to( screenplay.actors.Earth, false, {
      director: director,
      dictum_name: dictum_name,
      ndx: ndx
    } );

    const gui = this.elevated_vars.lil_gui;
    gui.open( true );
    gui.folders.forEach( (folder)=>{
      let show = ( folder._title === 'Ship Navigation' || folder._title === 'Earth');
      folder.open( show );
    });
  };
  visit_moon = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_moon');

    screenplay.actions.warp_to( screenplay.actors.Moon, false, {
      director: director,
      dictum_name: dictum_name,
      ndx: ndx
    } );

    const gui = this.elevated_vars.lil_gui;
    gui.open( true );
    gui.folders.forEach( (folder)=>{
      let show = ( folder._title === 'Ship Navigation' || folder._title === 'Moon');
      folder.open( show );
    });
  };
  visit_mars = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_mars');

    screenplay.actions.warp_to( screenplay.actors.Mars, false, {
      director: director,
      dictum_name: dictum_name,
      ndx: ndx
    } );

    const gui = this.elevated_vars.lil_gui;
    gui.open( true );
    gui.folders.forEach( (folder)=>{
      let show = ( folder._title === 'Ship Navigation' || folder._title === 'Mars');
      folder.open( show );
    });
  };
  visit_jupiter = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_jupiter');

    screenplay.actions.warp_to( screenplay.actors.Jupiter, false, {
      director: director,
      dictum_name: dictum_name,
      ndx: ndx
    } );

    const gui = this.elevated_vars.lil_gui;
    gui.open( true );
    gui.folders.forEach( (folder)=>{
      let show = ( folder._title === 'Ship Navigation' || folder._title === 'Jupiter');
      folder.open( show );
    });
  };
  visit_saturn = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_saturn');

    screenplay.actions.warp_to( screenplay.actors.Saturn, false, {
      director: director,
      dictum_name: dictum_name,
      ndx: ndx
    } );

    const gui = this.elevated_vars.lil_gui;
    gui.open( true );
    gui.folders.forEach( (folder)=>{
      let show = ( folder._title === 'Ship Navigation' || folder._title === 'Saturn');
      folder.open( show );
    });
  };
  visit_uranus = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_uranus');

    screenplay.actions.warp_to( screenplay.actors.Uranus, false, {
      director: director,
      dictum_name: dictum_name,
      ndx: ndx
    } );

    const gui = this.elevated_vars.lil_gui;
    gui.open( true );
    gui.folders.forEach( (folder)=>{
      let show = ( folder._title === 'Ship Navigation' || folder._title === 'Uranus');
      folder.open( show );
    });
  };
  visit_neptune = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_neptune');

    screenplay.actions.warp_to( screenplay.actors.Neptune, false, {
      director: director,
      dictum_name: dictum_name,
      ndx: ndx
    } );

    const gui = this.elevated_vars.lil_gui;
    gui.open( true );
    gui.folders.forEach( (folder)=>{
      let show = ( folder._title === 'Ship Navigation' || folder._title === 'Neptune');
      folder.open( show );
    });
  };
  introduce_phox = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.introduce_phox');
    screenplay.actions.change_cam( 'Center' );

    let resume_objects = this.elevated_vars.resume.objects;
    let targets = this.elevated_vars.resume.targets;
    let minor_dim = Math.min( window.innerWidth, window.innerHeight );
    let major_dim = Math.max( window.innerWidth, window.innerHeight );
    let width = window.innerWidth;
    let height = window.innerHeight;
    let x_offset = -window.innerWidth / 2;
    let y_offset = -window.innerHeight / 2;

    // Resume 3DObjectification
    const resume_station = document.querySelectorAll("#resume > .station");
    let resume_group = new THREE.Group();
    resume_station.forEach( function( station ) {
      station.addEventListener( 'click', ()=>{
        if( cssObject.showcase ) cssObject.showcase = false; else cssObject.showcase = true; // Toggle to track whether on display or not.
        if (cssObject.showcase ) {
          let distance = cssObject.element.clientWidth;
          cssObject.position.addVectors( screenplay.active_cam.position, new THREE.Vector3( 0, 0, -distance ) );
          cssObject.directions.set( 'lookAt', ()=>{
            cssObject.lookAt( screenplay.active_cam.position );
          });
        } else {
          switch ( cssObject.arrangement ) {
            case 'timeline':
              cssObject.position.copy( targets.timeline[ cssObject.ndx ].position );
              break;

            case 'table':
              cssObject.position.copy( targets.table[ cssObject.ndx ].position );
              break;

            case 'sphere':
              cssObject.position.copy( targets.sphere[ cssObject.ndx ].position );
              break;

            case 'helix':
              cssObject.position.copy( targets.helix[ cssObject.ndx ].position );
              break;

            case 'grid':
              cssObject.position.copy( targets.grid[ cssObject.ndx ].position );
              break;
          }
        }
      }, { capture: true } );

      const cssObject = new CSS3DObject( station );
      cssObject.directions = new Map();
      cssObject.directions.set( 'lookAt', ()=>{
        cssObject.lookAt( screenplay.active_cam.position );
      });
      cssObject.ndx = resume_objects.length;
      screenplay.actives.push( cssObject );
      resume_group.add( cssObject );
      resume_objects.push( cssObject );
    });
    screenplay.ui_scene.add( resume_group );

    const vector = new THREE.Vector3();
    let _offset = new THREE.Vector3( (-width / 2),  -(height / 4), (-width) );
    let time_start = new THREE.Vector3().addVectors( screenplay.active_cam.position, _offset );
    let time_bend = new THREE.Vector3().addVectors( time_start, new THREE.Vector3( 0, 0, -3 * major_dim ) );
    let time_end = new THREE.Vector3( (width * 4),  height * 4, -3 * major_dim );
    const timeline = new THREE.QuadraticBezierCurve3( time_start, time_bend, time_end );

    // Set the Targets for each display orientation
    let timelength = 2208 - 606;
    for ( let ndx = 0, len = resume_objects.length; ndx < len; ndx++ ){
      let start = Number.parseInt( resume_objects[ndx].element.dataset.start );
      let end = Number.parseInt( resume_objects[ndx].element.dataset.end );

      let prog = (ndx + 1)/len;
      let element_height = resume_objects[ ndx ].element.clientHeight;
      let element_width = resume_objects[ ndx ].element.clientWidth;

      // Time-Line Display
      const timeline_object = new THREE.Object3D();
      let _at = ( start-606 ) / timelength;
      let pos_at = new THREE.Vector3();
      timeline.getPointAt( _at, pos_at );
      timeline_object.position.copy( pos_at );
      targets.timeline.push( timeline_object );

      // Table Display
      const table_object = new THREE.Object3D();
      let _col = ( ndx % 3 );
      let _row = ( Math.floor( ndx / 3 ) );
      let _col_width = ( window.innerWidth / 2 );     // TODO: Add Perspective scalar to fit view frustum.
      let _row_height = ( window.innerHeight / 2 );   // TODO: Add Perspective scalar to fit view frustum.
      table_object.position.x = ( _col * _col_width ) + x_offset;  // TODO: Add Perspective scalar to fit view frustum.
      table_object.position.y = ( _row * _row_height ) + y_offset;  // TODO: Add Perspective scalar to fit view frustum.
      targets.table.push( table_object );

      // Sphere Display
      const phi = Math.acos( - 1 + ( 2 * ndx ) / len );
      const sphere_theta = Math.sqrt( len * Math.PI ) * phi;
      const sphere_object = new THREE.Object3D();
      sphere_object.position.setFromSphericalCoords( minor_dim, phi, sphere_theta );
      targets.sphere.push( sphere_object );

      // Helix Display
      const helix_theta = (ndx / ( len - 1)) * 2 * Math.PI;

      const y = -( 2 * minor_dim * prog ) + minor_dim;
      const helix_object = new THREE.Object3D();
      helix_object.position.setFromCylindricalCoords( major_dim / 2, helix_theta, y );

      targets.helix.push( helix_object );


      // Grid Display
      let ratio = major_dim / minor_dim;
      const grid_object = new THREE.Object3D();
      switch( ndx ){
        case 4:
          grid_object.position.x = ( 0 * _col_width ) + x_offset;
          grid_object.position.y = ( 0 * _row_height ) + y_offset;
          break;
        case 8:
          grid_object.position.x = ( 1 * _col_width ) + x_offset;
          grid_object.position.y = ( 0 * _row_height ) + y_offset;
          break;
        case 2:
          grid_object.position.x = ( 2 * _col_width ) + x_offset;
          grid_object.position.y = ( 0 * _row_height ) + y_offset;
          break;
        case 3:
          grid_object.position.x = ( 0 * _col_width ) + x_offset;
          grid_object.position.y = ( 1 * _row_height ) + y_offset;
          break;
        case 0:
          grid_object.position.x = ( 1 * _col_width ) + x_offset;
          grid_object.position.y = ( 1 * _row_height ) + y_offset;
          break;
        case 6:
          grid_object.position.x = ( 2 * _col_width ) + x_offset;
          grid_object.position.y = ( 1 * _row_height ) + y_offset;
          break;
        case 7:
          grid_object.position.x = ( 0 * _col_width ) + x_offset;
          grid_object.position.y = ( 2 * _row_height ) + y_offset;
          break;
        case 5:
          grid_object.position.x = ( 1 * _col_width ) + x_offset;
          grid_object.position.y = ( 2 * _row_height ) + y_offset;
          break;
        case 1:
          grid_object.position.x = ( 2 * _col_width ) + x_offset;
          grid_object.position.y = ( 2 * _row_height ) + y_offset;
          break;
      }
      grid_object.position.z = 0;

      targets.grid.push( grid_object );

    }

    const gui = this.elevated_vars.lil_gui;
    let document_controls_folder = gui.addFolder( 'Document Controls' );
    const document_controls = {
      'Timeline_Display': ( ) => {

        resume_objects.forEach( (obj)=>{
          obj.arrangement = 'timeline';
        });
        screenplay.actions.transform( resume_objects, targets.timeline, 100 );
        resume_group.directions = new Map();
        resume_group.up = new THREE.Vector3( 0,1,0 );
        resume_group.rotation.y = 0;
        resume_group.rotation.x = 0;

      },
      'Table_Display': ( ) => {

        resume_objects.forEach( (obj)=>{
          obj.arrangement = 'table';
        });
        screenplay.actions.transform( resume_objects, targets.table, 100 );
        resume_group.directions = new Map();
        resume_group.up = new THREE.Vector3( 0,1,0 );
        resume_group.rotation.y = 0;
        resume_group.rotation.x = 0;

      },
      'Sphere_Display': ( ) => {

        resume_objects.forEach( (obj)=>{
          obj.arrangement = 'sphere';
        });
        screenplay.actions.transform( resume_objects, targets.sphere, 100 );
        resume_group.directions = new Map();
        resume_group.directions.set( 'sphere', ()=>{
          resume_group.rotation.y += .00420;
        });
        screenplay.actives.push( resume_group );

      },
      'Helix_Display': ( ) => {

        resume_objects.forEach( (obj)=>{
          obj.arrangement = 'helix';
        });
        screenplay.actions.transform( resume_objects, targets.helix, 100 );
        resume_group.directions = new Map();
        resume_group.directions.set( 'helix', ()=>{
          resume_group.rotation.y -= .00420;
        });
        screenplay.actives.push( resume_group );

      },
      'Grid_Display': ( ) => {

        resume_objects.forEach( (obj)=>{
          obj.arrangement = 'grid';
        });
        screenplay.actions.transform( resume_objects, targets.grid, 100 );
        resume_group.directions = new Map();
        resume_group.up = new THREE.Vector3( 0,1,0 );
        resume_group.rotation.y = 0;
        resume_group.rotation.x = 0;


      }
    }
    document_controls_folder.add( document_controls, 'Timeline_Display' ).name( 'Timeline Display' );
    document_controls_folder.add( document_controls, 'Table_Display' ).name( 'Table Display' );
    document_controls_folder.add( document_controls, 'Sphere_Display' ).name( 'Sphere Display' );
    document_controls_folder.add( document_controls, 'Helix_Display' ).name( 'Helix Display' );
    document_controls_folder.add( document_controls, 'Grid_Display' ).name( 'Grid Display' );

    gui.open( true );
    gui.folders.forEach( (folder)=>{
      folder.open( false );
    });
    document_controls_folder.open( true );

    document_controls.Grid_Display();
    this.ActivateOrbitControls( screenplay );

    //director.emit( `${dictum_name}_progress`, dictum_name, ndx );
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
