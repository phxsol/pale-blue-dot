import React from 'react';
import ReactDOM from 'react-dom/client';
// Screen Director Reference
import { Workflow as _Workflow, SceneAsset3D, CSS3DAsset, SceneTransformation } from '../bin/ScreenDirector.js';
// Support Library Reference
import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from '../lib/OrbitControls.js';
import { FirstPersonControls } from '../lib/FirstPersonControls.js';
import { FlyControls } from '../lib/FlyControls.js';
import { TrackballControls } from '../lib/TrackballControls.js';

// React Component Error Boundary Class
// Refer to --> # https://reactjs.org/docs/error-boundaries.html #
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  // Update state so the next render will show the fallback UI.
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  // You can also log the error to an error reporting service
  componentDidCatch(error, errorInfo) {
    console.error( error, errorInfo );
  }

  render() {
    // You can render any custom fallback UI
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

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
  react_app;

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

    class VerifyCapabilitiesModal extends React.Component {
      test; result_display;

      displayTestResults(){
        let test_results = this.result_display.cache.test_results = this.state.test_results;

        console.log( test_results );

        screenplay.updatables.set( 'test_results', this.result_display );
      }

      constructor( props ){
        super( props );
        this.state = {
          test_results: false,
          results_display: {
            score: 0,
            speed: 0
          }
        };

        /* -= User Performance Statistics Test =-
        ** This is where the user's device is tested for a baseline of rendering ability.
        ** Initial tests may fail due to loading delays... testing again upon failure ensures that
        ** elibigle users are filtered properly.
        ** Upon Failure: Display workflow without immersive rendering. */
        this.test = new SceneTransformation({
            update: ( delta )=>{
              if( this.test.cache.duration-- >= 0 ){
                this.test.cache.stamps.push( delta );
              } else {
                screenplay.updatables.delete( 'ups_test' );
                this.test.post( );  // This calls for the cleanup of the object from the scene and the values from itself.
              }
            },
            cache: {
              duration: 60,
              stamps: [],
              test_results: []
            },
            reset: ()=>{

              this.test.cache.duration = 60;
              this.test.cache.stamps = [];

              screenplay.updatables.set( 'ups_test', this.test );
            },
            post: ( )=>{
              // Build the Test Results from the captured test data
              let test_results = {};
              test_results.stamps = this.test.cache.stamps;
              let pop_cnt = test_results.stamps.length;
              // Calculate the actual test duration based upon stamp values.
              test_results.time = this.test.cache.stamps.reduce( (a,b) => a + b, 0 );
              // Calculate Population Mean & Standard Deviation
              let pop_mean = test_results.mean = test_results.time / pop_cnt;
              let xi_less_u_2 = this.test.cache.stamps.map( (num)=> { return ( num - pop_mean ) ** 2 } );
              let sum_xi_less_u_2 = xi_less_u_2.reduce( (a,b) => a + b, 0 );
              let mean_of_deviation = sum_xi_less_u_2 / pop_cnt;
              test_results.std_dev = Math.sqrt( mean_of_deviation );
              // Determine the largest and smallest tick durations, or stamp values.
              test_results.max = Math.max( ...this.test.cache.stamps );
              test_results.min = Math.min( ...this.test.cache.stamps );
              // ...then calculate the highest and lowest FPS from them.
              test_results.max_fps = 1/test_results.min;
              test_results.min_fps = 1/test_results.max;
              // Grade the User Performance Statistics
              let std_fps = 1 / ( pop_mean + test_results.std_dev );

              test_results.score = Math.floor( std_fps );
              // ... then post the results to the test_results stack
              this.test.cache.test_results.push( test_results );
              // Should another test be run?  The max is 3 runs before failure is determined.
              let runs_so_far = this.test.cache.test_results.length;
              if ( test_results.score < 15 && runs_so_far < 3 || test_results.max_fps < 20 && runs_so_far < 3 ) {
                this.test.reset();  // Rack 'em up and knock 'em down again!
              } else {
                // Now that has completed, compile the tests ( 1 - 3 ), for scoring.
                let compiled_test_results = {
                  stamps: [],
                  time: 0,
                  max: -10000,
                  min: 10000
                };  // Default values to ensure proper evaluation.

                for( let results_ndx = 0; results_ndx < this.test.cache.test_results.length; results_ndx++ ){
                  let test_results = this.test.cache.test_results[results_ndx];
                  compiled_test_results.stamps.push( ...test_results.stamps );
                  // Calculate the actual test duration based upon stamp values.
                  compiled_test_results.time += test_results.stamps.reduce( (a,b) => a + b, 0 );
                  // Determine the largest and smallest tick durations, or stamp values.
                  let max = Math.max( ...test_results.stamps, compiled_test_results.max );
                  compiled_test_results.max = max;
                  let min = Math.min( ...test_results.stamps, compiled_test_results.min );
                  compiled_test_results.min = min;
                }
                // Calculate Population Mean & Standard Deviation
                let comp_pop_cnt = test_results.stamps.length;
                let comp_pop_mean = compiled_test_results.mean = compiled_test_results.time / comp_pop_cnt;
                let comp_xi_less_u_2 = compiled_test_results.stamps.map( (num)=> { return (num - comp_pop_mean) ** 2 } );
                let comp_sum_xi_less_u_2 = comp_xi_less_u_2.reduce( (a,b) => a + b, 0 );
                let comp_mean_of_deviation = comp_sum_xi_less_u_2 / comp_pop_cnt;
                compiled_test_results.std_dev = Math.sqrt( comp_mean_of_deviation );
                // ...then calculate the highest and lowest FPS from them.
                compiled_test_results.max_fps = 1/compiled_test_results.min;
                compiled_test_results.min_fps = 1/compiled_test_results.max;
                // Grade the User Performance Statistics
                let comp_std_fps = 1/( comp_pop_mean + compiled_test_results.std_dev );
                compiled_test_results.score = Math.floor( comp_std_fps );
                // ... then post the results to the console and the test_results stack
                console.log( compiled_test_results );

                this.setState( { test_results: compiled_test_results, test_complete: true });
                this.displayTestResults();
              }

            }
          });
        screenplay.updatables.set( 'ups_test', this.test );
      }

      componentDidMount(){
        document.getElementById( 'root' ).classList.add( 'pip_gui' );
        // Give the results to the next SceneTransformation for display
        this.result_display = new SceneTransformation({
          update: ( delta )=>{
            if( this.state.test_results ){
              if( this.result_display.cache.duration-- > 0 ){
                let tick = this.result_display.cache.frames - this.result_display.cache.duration;
                let prog = tick / this.result_display.cache.frames;
                let results = this.state.test_results;
                let score = (prog * results.score);
                let stamp_ndx = Math.floor( tick * ( results.stamps.length - 1 ) / this.result_display.cache.frames );
                let speed = Math.ceil( 1 / results.stamps[ stamp_ndx ] );
                this.setState({
                  results_display: {
                    score: score.toFixed( 2 ),
                    speed: speed.toFixed( 1 )
                  }
                });

              } else {
                this.result_display.update = false;
                screenplay.updatables.delete( 'test_results' );
                this.result_display.post( this.state.test_results );
              }
            }
          },
          cache: {
           duration: 200,
           frames: 200,
           test_results: {
             stamps: [],
             time: 0,
             max: Number.MIN_SAFE_INTEGER,
             min: Number.MAX_SAFE_INTEGER,
             max_fps: false,
             min_fps: false,
             score: false
           }
          },

          post: ( test_results )=>{

            // Performance Filter //
            /* The score derived from the above UPS test may be used here to lead poorly
                performing devices into a workflow without immersive rendering. */
            if ( test_results.score > 20 || test_results.max_fps > 30 ) {
              document.querySelector( '#verify_capabilities .success').classList.remove( 'hidden' );
              setTimeout( ( dictum_name, ndx )=>{
                director.emit( `${dictum_name}_progress`, dictum_name, ndx );
              }, 3000, dictum_name, ndx );


            } else {
              setTimeout( ( dictum_name, ndx )=>{
                document.querySelector( '#verify_capabilities .failure').classList.remove( 'hidden' );
                director.emit( `${dictum_name}_failure`, dictum_name, ndx );
              }, 3000, dictum_name, ndx );
            }
          }
        });

      }

      componentWillUnmount(){
        document.getElementById( 'root' ).classList.remove( 'pip_gui' );
      }

      render(){
        return (
          <>
            <div id="verify_capabilities" className="pip_gui pip_splash">
              <h1 className="title">Verifying Performance Requirements</h1>
              <span className="description">For a more pleasant experience, a brief performance test must be run.</span>
              <p className="fps_display">
                Active&nbsp;FPS:&nbsp;<span className="speed">{this.state.results_display.speed}</span>
                <br />-<br />
                Standardized:&nbsp;FPS:&nbsp;<span className="score">{this.state.results_display.score}</span>
              </p>
              <h3 className="success hidden">Test Successful!</h3>
              <h3 className="failure hidden">Low-FPS Mode Required</h3>
            </div>
          </>
        );
      }
    }

    this.react_app.render( <ErrorBoundary><VerifyCapabilitiesModal /></ErrorBoundary> );
    document.title = 'Workflow.verify_capabilities | The Pale Blue Dot | Phox.Solutions';

  };
  init_controls = async ( screenplay, dictum_name, director, ndx ) => {
    console.log( 'Workflow.init_controls' );

    class InitControlsModal extends React.Component {
      componentDidMount(){
        document.getElementById( 'root' ).classList.add( 'pip_gui' );
      }

      componentWillUnmount(){
        document.getElementById( 'root' ).classList.remove( 'pip_gui' );
      }

      render(){
        return (
          <>
            <div id="init_controls" className="pip_gui pip_post">
              <h1>init_controls</h1>
            </div>
          </>
        );
      }
    }

    this.react_app.render( <ErrorBoundary><InitControlsModal /></ErrorBoundary> );

    document.title = 'Workflow.init_controls | The Pale Blue Dot | Phox.Solutions';

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

      const gui = screenplay.lil_gui = new GUI( { title: 'Architect Interface' });
      gui.open( false );
      let camera_controls_folder = gui.addFolder( 'Camera Controls' );
      const camera_controls = {
        'CaptainCam': ()=>{
          screenplay.actions.change_cam( 'CaptainCam' );
          this.DeactivateOrbitControls( screenplay );
        },
        '3rdPerson': ()=>{
          screenplay.actions.change_cam( '3rdPerson' );
          this.ActivateOrbitControls( screenplay );
        },
        'Center': ()=>{
          screenplay.actions.change_cam( 'Center' );
          this.ActivateOrbitControls( screenplay );
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
      ship_settings_folder.add( screenplay.actors.Ship.viewscreen, 'visible' ).name( 'Show Viewscreen?');
      ship_settings_folder.add( screenplay.actors.Ship.viewscreen.material, 'opacity', 0, 1 ).name( 'Viewscreen Opacity');
      ship_settings_folder.add( screenplay.actors.Ship.viewscreen.material, 'roughness', 0, 1 ).name( 'Viewscreen Roughness');
      ship_settings_folder.add( screenplay.actors.Ship.viewscreen.material, 'metalness', 0, 1 ).name( 'Viewscreen Metalness');
      ship_settings_folder.add( screenplay.actors.Ship.light, 'intensity', 0, 100, 0.1 ).name( 'Light Intensity');
      ship_settings_folder.add( screenplay.actors.Ship.light, 'distance', 0, 100000, 1 ).name( 'Light Distance');
      ship_settings_folder.add( screenplay.actors.Ship.light, 'decay', 0, 2, 1 ).name( 'Light Decay [0,1,2]');
      ship_settings_folder.add ( screenplay.actors.Ship.bulkhead_open, 'visible', false ).onChange(()=>{ screenplay.actors.Ship.bulkhead.visible = !screenplay.actors.Ship.bulkhead_open.visible }).name( 'Show Top?');
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
      sunlight_folder.open( false );

      let sun_model_folder = sun_folder.addFolder( 'Sun Model ');
      let sun = screenplay.actors.Sun;
      sun_model_folder.add ( sun.material, 'wireframe' ).name( 'Wireframe Only?');
      sun_model_folder.open( false );

      director.emit( `${dictum_name}_progress`, dictum_name, ndx );

    } catch( e ) {

      director.emit( `${dictum_name}_failure`, dictum_name, ndx );

    }
  };
  user_instruction = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.user_introduction');

    class UserInstructionModal extends React.Component {
      componentDidMount(){
        document.getElementById( 'root' ).classList.add( 'pip_gui' );
      }

      componentWillUnmount(){
        document.getElementById( 'root' ).classList.remove( 'pip_gui' );
      }

      handleAckClick( e ){
        director.emit( `${dictum_name}_progress`, dictum_name, ndx );
      }

      render(){
        return (
          <>
            <div id="user_instruction" className="pip_gui pip_post" >
              <h1>Wither-to's and Why-for's</h1>
              <span className="introduction">
                Thank you for being here!<br/>
                Watch your head, so to speak, as this is a work in-progress.<br/><br/>
                You are welcome to investigate 'under the hood', though the code in your browser is compiled and difficult to traverse.<br/>
                The full codebase upon which this app is running may be <a href="https://github.com/phxsol/pale-blue-dot" target="_blank">found here on GitHub</a>.<br/>
              </span>
            </div>
            <button name="ack_user_instruction" className="pip_ack" type="button" onClick={this.handleAckClick}>OK</button>
          </>
        );
      }
    }

    this.react_app.render( <ErrorBoundary><UserInstructionModal /></ErrorBoundary> );

    document.title = 'Workflow.user_introduction | The Pale Blue Dot | Phox.Solutions';
  };
  introduction = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.introduction');


    let u_name = screenplay.captain_name;

    let submit = ()=>{
      screenplay.captain_name = ( !u_name || u_name === '') ? false : u_name;
      this.react_app.render();
      this.ActivateOrbitControls( screenplay );
      //alert( `Thank you Captain${(!screenplay.captain_name)?'':' '+screenplay.captain_name}.`)
      director.emit( `${dictum_name}_progress`, dictum_name, ndx );
    }

    class SubmitButton extends React.Component {

      constructor( props ) {
        super( props );
      }

      handleSubmitClick( e ) {
        submit();
      }

      handleDefaultClick( e ){
        u_name = false;
        submit();
      }

      render() {
        const captainName = this.props.captainName;

        return (
          <div
              className="user_side"
              style={{ gridRow: 5, display: 'flex' }}>
            <button
              name="submit"
              className="pip_button"
              style={{ marginLeft: '1rem' }}
              type="button"
              onClick={this.handleSubmitClick}>Submit</button>
            <button
              name="default"
              className="pip_button"
              style={{ marginLeft: '1rem' }}
              type="button"
              onClick={this.handleDefaultClick}>Captain will&nbsp;do.</button>
          </div>
        );
      }
    }

    class CaptainNameField extends React.Component {
      constructor(props) {
        super(props);
        this.handleCaptainNameChange = this.handleCaptainNameChange.bind( this );
      }

      handleCaptainNameChange( e ) {
        this.props.onCaptainNameChange( e.target.value );
      }

      handleCaptainNameFocus( e ) {
        e.target.placeholder = '';
      }

      handleCaptainNameBlur( e ) {
        e.target.placeholder = "Your name Captain?";
      }

      render() {
        return (
          <input
            id="captain_name_field"
            className="pip_reply user_side"
            style={{ gridRow: 4 }}
            type="text"
            placeholder="..."
            value={this.props.captainName}
            onChange={this.handleCaptainNameChange}
            onFocus={this.handleCaptainNameFocus}
            onBlur={this.handleCaptainNameBlur}
          />
        );
      }
    }

    class IntroductionForm extends React.Component {
      constructor( props ) {
        super( props );
        this.state = {
          captainName: ""
        };

        this.handleCaptainNameChange = this.handleCaptainNameChange.bind( this );
      }

      handleCaptainNameChange( captainName ) {
        this.setState({
          captainName: captainName
        });
        u_name = captainName;
      }

      componentDidMount(){
        document.getElementById( 'root' ).classList.add( 'pip_gui' );
      }

      componentWillUnmount(){
        document.getElementById( 'root' ).classList.remove( 'pip_gui' );
      }

      render() {
        return (
          <div id="introduction" className="pip_gui pip_chat">
            <span className="ui_side pip_text" style={{ gridRow: 2 }}>
              Greetings Captain.
            </span>
            <span className="ui_side pip_text" style={{ gridRow: 3 }}>How do you prefer to be addressed?</span>
            <CaptainNameField
              filterText={this.state.captainName}
              onCaptainNameChange={this.handleCaptainNameChange}
            />
            <SubmitButton
              captainName={this.state.captainName}
              />
          </div>
        );
      }
    }

    this.react_app.render( <ErrorBoundary><IntroductionForm /></ErrorBoundary> );

    document.title = 'Workflow.introduction | The Pale Blue Dot | Phox.Solutions';
  };
  tour_or_skip = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.tour_or_skip');

    let engage = ()=>{
      this.react_app.render();
      this.ActivateOrbitControls( screenplay );

      director.emit( `${dictum_name}_progress`, dictum_name, ndx );
    }

    class EngageButton extends React.Component {

      constructor( props ) {
        super( props );
      }

      handleEngageClick( e ) {
        engage();
      }

      componentDidMount(){
        document.getElementById( 'root' ).classList.add( 'pip_gui' );
      }

      componentWillUnmount(){
        document.getElementById( 'root' ).classList.remove( 'pip_gui' );
      }

      render() {
        const captainName = this.props.captainName;

        return (
          <>
            <button
              name="engage"
              className="pip_button user_side"
              type="button"
              onClick={this.handleEngageClick}>
              ENGAGE
            </button>
          </>
        );
      }
    }

    class CaptainsOrders extends React.Component {

      constructor( props ) {
        super( props );
        this.state = {
          captainName: props.captainName
        };
        this.handleShowTourChange = this.handleShowTourChange.bind( this );
      }

      handleShowTourChange( e ) {
        this.props.onShowTourChange( e.target.checked );
      }

      render() {
        const captainName = this.props.captainName;
        const showTour = this.props.showTour;

        return (
          < div
              className="user_side"
              style={{ gridRow: 4, display: 'flex' }}>
            <label
              className="pip_text user_side"
              htmlFor="show_tour"
              style={{ marginLeft: '1rem' }}
              >Take the Tour?</label>
            <input
              id="show_tour_checkbox"
              className="pip_toggle user_side"
              style={{ marginLeft: '1rem' }}
              type="checkbox"
              checked={this.props.showTour}
              onChange={this.handleShowTourChange}
            />
            <EngageButton />
          </div>
        );
      }
    }

    class TourOrSkipForm extends React.Component {
      constructor( props ) {
        super( props );
        this.state = {
          showTour: false,
          captainName: screenplay.captain_name
        };
        this.handleShowTourChange = this.handleShowTourChange.bind( this );
      }

      handleShowTourChange( showTour ) {
        this.setState({
          showTour: showTour
        });
        screenplay.take_the_tour = showTour;
      }

      componentDidMount(){
        document.getElementById( 'root' ).classList.add( 'pip_gui' );
      }

      componentWillUnmount(){
        document.getElementById( 'root' ).classList.remove( 'pip_gui' );
      }

      render( ) {
        return (
          <div id="tour_or_skip" className="pip_gui pip_chat">
            <span className="ui_side pip_text" style={{ gridRow: 2 }}>
              Captain{(!this.state.captainName)?'':' '+this.state.captainName}.
            </span>
            <span className="ui_side pip_text" style={{ gridRow: 3 }}>A tour of the local system is available.<br />Shall I begin, or would you rather continue on to meet the Architect?</span>
            <CaptainsOrders
              showTour={this.state.showTour}
              onShowTourChange={this.handleShowTourChange}
            />
          </div>
        );
      }
    }

    this.react_app.render( <ErrorBoundary><TourOrSkipForm /></ErrorBoundary> );

    document.title = 'Workflow.tour_or_skip | The Pale Blue Dot | Phox.Solutions';

  };
  visit_sun = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_sun');

    let onArrival = ()=>{

      class VisitSunModal extends React.Component {
        constructor( props ){
          super( props );
        }

        componentDidMount(){
          // TODO: Place this component as if on the viewscreen.
          /*
          const visit_sun_modal = document.getElementById( "visit_sun_modal" );
          const cssObject = new CSS3DAsset( visit_sun_modal );

          let _pos = new THREE.Vector3();
          screenplay.actors.Ship.NavDots.sight_target.getWorldPosition( _pos );
          cssObject.up = screenplay.actors.Ship.up;
          cssObject.position.copy( _pos );
          cssObject.scale.copy( new THREE.Vector3( 0.1, 0.1, 0.1 ) );
          cssObject.directions.set( 'lookAt', ()=>{
            cssObject.lookAt( screenplay.actors.Ship.position );
          });
          screenplay.actives.push( cssObject );
          screenplay.ui_scene.add( cssObject );

          let tour_info_settings_folder = gui.addFolder( 'Tour Info Settings' );
          tour_info_settings_folder.add( cssObject.position, 'x' ).name( 'Pos X');
          tour_info_settings_folder.add( cssObject.position, 'y' ).name( 'Pos Y');
          tour_info_settings_folder.add( cssObject.position, 'z' ).name( 'Pos Z');
          tour_info_settings_folder.add( cssObject.scale, 'x' ).name( 'Scale X');
          tour_info_settings_folder.add( cssObject.scale, 'y' ).name( 'Scale Y');
          tour_info_settings_folder.add( cssObject.scale, 'z' ).name( 'Scale Z');

          tour_info_settings_folder.open( true );
          */
          // 4NOW: Display as a fullscreen pip_gui.
          const visit_sun_modal = document.getElementById( "visit_sun_modal" );
          document.getElementById( 'root' ).classList.add( 'pip_gui' );
        }

        componentWillUnmount(){
          document.getElementById( 'root' ).classList.remove( 'pip_gui' );
        }

        handleAckClick( e ){
          onAcknowledge();
        }

        render(){
          return (
            <>
              <div id="visit_sun_modal" className="pip_gui pip_import">
                <h2 className='iframe_title'>Data found @ Wikipedia.org</h2>
                <iframe src="https://en.wikipedia.org/wiki/Sun#Structure_and_fusion" title="Sun - Wikipedia" ></iframe>
              </div>
              <button name="ack_user_instruction" className="pip_ack" type="button" onClick={this.handleAckClick}>OK</button>
            </>
          );
        }
      }
      this.react_app.render( <ErrorBoundary><VisitSunModal /></ErrorBoundary>);

      document.title = 'Workflow.visit_sun | The Pale Blue Dot | Phox.Solutions';
    }

    let onAcknowledge = ()=>{
      this.react_app.render();
      director.emit( `${dictum_name}_progress`, dictum_name, ndx );
    }

    screenplay.actions.warp_to( screenplay.actors.Sun, false, onArrival );

    document.title = 'Warping... | The Pale Blue Dot | Phox.Solutions';

  };
  visit_mercury = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_mercury');

    let onArrival = ()=>{

      class VisitMercuryModal extends React.Component {
        constructor( props ){
          super( props );
        }

        componentDidMount(){

          // 4NOW: Display as a fullscreen pip_gui.
          const visit_mercury_modal = document.getElementById( "visit_mercury_modal" );
          document.getElementById( 'root' ).classList.add( 'pip_gui' );
        }

        componentWillUnmount(){
          document.getElementById( 'root' ).classList.remove( 'pip_gui' );
        }

        handleAckClick( e ){
          onAcknowledge();
        }

        render(){
          return (
            <>
              <div id="visit_mercury_modal" className="pip_gui pip_import">
                <h2 className='iframe_title'>Data found @ Wikipedia.org</h2>
                <iframe src="https://en.wikipedia.org/wiki/Mercury_(planet)#Orbit.2C_rotation.2C_and_longitude" title="Mercury - Wikipedia" width={window.innerWidth} height={window.innerHeight}></iframe>
              </div>
              <button name="ack_user_instruction" className="pip_ack" type="button" onClick={this.handleAckClick}>OK</button>
            </>
          );
        }
      }
      this.react_app.render( <ErrorBoundary><VisitMercuryModal /></ErrorBoundary>);

      document.title = 'Workflow.visit_mercury | The Pale Blue Dot | Phox.Solutions';
    }

    let onAcknowledge = ()=>{
      this.react_app.render();
      director.emit( `${dictum_name}_progress`, dictum_name, ndx );
    }

    screenplay.actions.warp_to( screenplay.actors.Mercury, false, onArrival );

    document.title = 'Warping... | The Pale Blue Dot | Phox.Solutions';

  };
  visit_venus = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_venus');

    let onArrival = ()=>{

      class VisitVenusModal extends React.Component {
        constructor( props ){
          super( props );
        }

        componentDidMount(){

          // 4NOW: Display as a fullscreen pip_gui.
          const visit_venus_modal = document.getElementById( "visit_venus_modal" );
          document.getElementById( 'root' ).classList.add( 'pip_gui' );
        }

        componentWillUnmount(){
          document.getElementById( 'root' ).classList.remove( 'pip_gui' );
        }

        handleAckClick( e ){
          onAcknowledge();
        }

        render(){
          return (
            <>
              <div id="visit_venus_modal" className="pip_gui pip_import">
                <h2 className='iframe_title'>Data found @ Wikipedia.org</h2>
                <iframe src="https://en.wikipedia.org/wiki/Venus" title="Venus - Wikipedia" width={window.innerWidth} height={window.innerHeight}></iframe>
              </div>
              <button name="ack_user_instruction" className="pip_ack" type="button" onClick={this.handleAckClick}>OK</button>
            </>
          );
        }
      }
      this.react_app.render( <ErrorBoundary><VisitVenusModal /></ErrorBoundary>);

      document.title = 'Workflow.visit_venus | The Pale Blue Dot | Phox.Solutions';
    }

    let onAcknowledge = ()=>{
      this.react_app.render();
      director.emit( `${dictum_name}_progress`, dictum_name, ndx );
    }

    screenplay.actions.warp_to( screenplay.actors.Venus, false, onArrival );

    document.title = 'Warping... | The Pale Blue Dot | Phox.Solutions';

  };
  visit_earth = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_earth');

    let onArrival = ()=>{

      class VisitEarthModal extends React.Component {
        constructor( props ){
          super( props );
        }

        componentDidMount(){

          // 4NOW: Display as a fullscreen pip_gui.
          const visit_earth_modal = document.getElementById( "visit_earth_modal" );
          document.getElementById( 'root' ).classList.add( 'pip_gui' );
        }

        componentWillUnmount(){
          document.getElementById( 'root' ).classList.remove( 'pip_gui' );
        }

        handleAckClick( e ){
          onAcknowledge();
        }

        render(){
          return (
            <>
              <div id="visit_earth_modal" className="pip_gui pip_import">
                <h2 className='iframe_title'>Data found @ Wikipedia.org</h2>
                <iframe src="https://en.wikipedia.org/wiki/Earth" title="Earth - Wikipedia" width={window.innerWidth} height={window.innerHeight}></iframe>
              </div>
              <button name="ack_user_instruction" className="pip_ack" type="button" onClick={this.handleAckClick}>OK</button>
            </>
          );
        }
      }
      this.react_app.render( <ErrorBoundary><VisitEarthModal /></ErrorBoundary>);

      document.title = 'Workflow.visit_earth | The Pale Blue Dot | Phox.Solutions';
    }

    let onAcknowledge = ()=>{
      this.react_app.render();
      director.emit( `${dictum_name}_progress`, dictum_name, ndx );
    }

    screenplay.actions.warp_to( screenplay.actors.Earth, false, onArrival );

    document.title = 'Warping... | The Pale Blue Dot | Phox.Solutions';

  };
  visit_moon = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_moon');

    let onArrival = ()=>{

      class VisitMoonModal extends React.Component {
        constructor( props ){
          super( props );
        }

        componentDidMount(){

          // 4NOW: Display as a fullscreen pip_gui.
          const visit_moon_modal = document.getElementById( "visit_moon_modal" );
          document.getElementById( 'root' ).classList.add( 'pip_gui' );
        }

        componentWillUnmount(){
          document.getElementById( 'root' ).classList.remove( 'pip_gui' );
        }

        handleAckClick( e ){
          onAcknowledge();
        }

        render(){
          return (
            <>
              <div id="visit_moon_modal" className="pip_gui pip_import">
                <h2 className='iframe_title'>Data found @ Wikipedia.org</h2>
                <iframe src="https://en.wikipedia.org/wiki/Moon#Physical_characteristics" title="Moon - Wikipedia" width={window.innerWidth} height={window.innerHeight}></iframe>
              </div>
              <button name="ack_user_instruction" className="pip_ack" type="button" onClick={this.handleAckClick}>OK</button>
            </>
          );
        }
      }
      this.react_app.render( <ErrorBoundary><VisitMoonModal /></ErrorBoundary>);

      document.title = 'Workflow.visit_moon | The Pale Blue Dot | Phox.Solutions';
    }

    let onAcknowledge = ()=>{
      this.react_app.render();
      director.emit( `${dictum_name}_progress`, dictum_name, ndx );
    }

    screenplay.actions.warp_to( screenplay.actors.Moon, false, onArrival );

    document.title = 'Warping... | The Pale Blue Dot | Phox.Solutions';

  };
  visit_mars = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_mars');

    let onArrival = ()=>{

      class VisitMarsModal extends React.Component {
        constructor( props ){
          super( props );
        }

        componentDidMount(){

          // 4NOW: Display as a fullscreen pip_gui.
          const visit_mars_modal = document.getElementById( "visit_mars_modal" );
          document.getElementById( 'root' ).classList.add( 'pip_gui' );
        }

        componentWillUnmount(){
          document.getElementById( 'root' ).classList.remove( 'pip_gui' );
        }

        handleAckClick( e ){
          onAcknowledge();
        }

        render(){
          return (
            <>
              <div id="visit_mars_modal" className="pip_gui pip_import">
                <iframe src="https://en.wikipedia.org/wiki/Mars" title="Mars - Wikipedia" width={window.innerWidth} height={window.innerHeight}></iframe>
              </div>
              <button name="ack_user_instruction" className="pip_ack" type="button" onClick={this.handleAckClick}>OK</button>
            </>
          );
        }
      }
      this.react_app.render( <ErrorBoundary><VisitMarsModal /></ErrorBoundary>);

      document.title = 'Workflow.visit_mars | The Pale Blue Dot | Phox.Solutions';
    }

    let onAcknowledge = ()=>{
      this.react_app.render();
      director.emit( `${dictum_name}_progress`, dictum_name, ndx );
    }

    screenplay.actions.warp_to( screenplay.actors.Mars, false, onArrival );

    document.title = 'Warping... | The Pale Blue Dot | Phox.Solutions';

  };
  visit_jupiter = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_jupiter');

    let onArrival = ()=>{

      class VisitJupiterModal extends React.Component {
        constructor( props ){
          super( props );
        }

        componentDidMount(){

          // 4NOW: Display as a fullscreen pip_gui.
          const visit_jupiter_modal = document.getElementById( "visit_jupiter_modal" );
          document.getElementById( 'root' ).classList.add( 'pip_gui' );
        }

        componentWillUnmount(){
          document.getElementById( 'root' ).classList.remove( 'pip_gui' );
        }

        handleAckClick( e ){
          onAcknowledge();
        }

        render(){
          return (
            <>
              <div id="visit_jupiter_modal" className="pip_gui pip_import">
                <h2 className='iframe_title'>Data found @ Wikipedia.org</h2>
                <iframe src="https://en.wikipedia.org/wiki/Jupiter" title="Jupiter - Wikipedia" width={window.innerWidth} height={window.innerHeight}></iframe>
              </div>
              <button name="ack_user_instruction" className="pip_ack" type="button" onClick={this.handleAckClick}>OK</button>
            </>
          );
        }
      }
      this.react_app.render( <ErrorBoundary><VisitJupiterModal /></ErrorBoundary>);

      document.title = 'Workflow.visit_jupiter | The Pale Blue Dot | Phox.Solutions';
    }

    let onAcknowledge = ()=>{
      this.react_app.render();
      director.emit( `${dictum_name}_progress`, dictum_name, ndx );
    }

    screenplay.actions.warp_to( screenplay.actors.Jupiter, false, onArrival );

    document.title = 'Warping... | The Pale Blue Dot | Phox.Solutions';

  };
  visit_saturn = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_saturn');

    let onArrival = ()=>{

      class VisitSaturnModal extends React.Component {
        constructor( props ){
          super( props );
        }

        componentDidMount(){

          // 4NOW: Display as a fullscreen pip_gui.
          const visit_saturn_modal = document.getElementById( "visit_saturn_modal" );
          document.getElementById( 'root' ).classList.add( 'pip_gui' );
        }

        componentWillUnmount(){
          document.getElementById( 'root' ).classList.remove( 'pip_gui' );
        }

        handleAckClick( e ){
          onAcknowledge();
        }

        render(){
          return (
            <>
              <div id="visit_saturn_modal" className="pip_gui pip_import">
                <h2 className='iframe_title'>Data found @ Wikipedia.org</h2>
                <iframe src="https://en.wikipedia.org/wiki/Saturn" title="Saturn - Wikipedia" width={window.innerWidth} height={window.innerHeight}></iframe>
              </div>
              <button name="ack_user_instruction" className="pip_ack" type="button" onClick={this.handleAckClick}>OK</button>
            </>
          );
        }
      }
      this.react_app.render( <ErrorBoundary><VisitSaturnModal /></ErrorBoundary>);

      document.title = 'Workflow.visit_saturn | The Pale Blue Dot | Phox.Solutions';
    }

    let onAcknowledge = ()=>{
      this.react_app.render();
      director.emit( `${dictum_name}_progress`, dictum_name, ndx );
    }

    screenplay.actions.warp_to( screenplay.actors.Saturn, false, onArrival );

    document.title = 'Warping... | The Pale Blue Dot | Phox.Solutions';

  };
  visit_uranus = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_uranus');

    let onArrival = ()=>{

      class VisitUranusModal extends React.Component {
        constructor( props ){
          super( props );
        }

        componentDidMount(){

          // 4NOW: Display as a fullscreen pip_gui.
          const visit_uranus_modal = document.getElementById( "visit_uranus_modal" );
          document.getElementById( 'root' ).classList.add( 'pip_gui' );
        }

        componentWillUnmount(){
          document.getElementById( 'root' ).classList.remove( 'pip_gui' );
        }

        handleAckClick( e ){
          onAcknowledge();
        }

        render(){
          return (
            <>
              <div id="visit_uranus_modal" className="pip_gui pip_import">
                <h2 className='iframe_title'>Data found @ Wikipedia.org</h2>
                <iframe src="https://en.wikipedia.org/wiki/Uranus" title="Uranus - Wikipedia" width={window.innerWidth} height={window.innerHeight}></iframe>
              </div>
              <button name="ack_user_instruction" className="pip_ack" type="button" onClick={this.handleAckClick}>OK</button>
            </>
          );
        }
      }
      this.react_app.render( <ErrorBoundary><VisitUranusModal /></ErrorBoundary>);

      document.title = 'Workflow.visit_uranus | The Pale Blue Dot | Phox.Solutions';
    }

    let onAcknowledge = ()=>{
      this.react_app.render();
      director.emit( `${dictum_name}_progress`, dictum_name, ndx );
    }

    screenplay.actions.warp_to( screenplay.actors.Uranus, false, onArrival );

    document.title = 'Warping... | The Pale Blue Dot | Phox.Solutions';

  };
  visit_neptune = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.visit_neptune');

    let onArrival = ()=>{

      class VisitNeptuneModal extends React.Component {
        constructor( props ){
          super( props );
        }

        componentDidMount(){

          // 4NOW: Display as a fullscreen pip_gui.
          const visit_neptune_modal = document.getElementById( "visit_neptune_modal" );
          document.getElementById( 'root' ).classList.add( 'pip_gui' );
        }

        componentWillUnmount(){
          document.getElementById( 'root' ).classList.remove( 'pip_gui' );
        }

        handleAckClick( e ){
          onAcknowledge();
        }

        render(){
          return (
            <>
              <div id="visit_neptune_modal" className="pip_gui pip_import">
                <h2 className='iframe_title'>Data found @ Wikipedia.org</h2>
                <iframe src="https://en.wikipedia.org/wiki/Neptune" title="Neptune - Wikipedia" width={window.innerWidth} height={window.innerHeight}></iframe>
              </div>
              <button name="ack_user_instruction" className="pip_ack" type="button" onClick={this.handleAckClick}>OK</button>
            </>
          );
        }
      }
      this.react_app.render( <ErrorBoundary><VisitNeptuneModal /></ErrorBoundary>);

      document.title = 'Workflow.visit_neptune | The Pale Blue Dot | Phox.Solutions';
    }

    let onAcknowledge = ()=>{
      this.react_app.render();
      director.emit( `${dictum_name}_progress`, dictum_name, ndx );
    }

    screenplay.actions.warp_to( screenplay.actors.Neptune, false, onArrival );

    document.title = 'Warping... | The Pale Blue Dot | Phox.Solutions';

  };
  introduce_phox = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.introduce_phox');
    screenplay.actions.change_cam( 'Center' );
    this.ActivateOrbitControls( screenplay );

    window.alert(' The Architect Connection is under contruction.  For now you may explore the Solar System with the Architect Interface.  Enjoy!');
    const gui = screenplay.lil_gui;
    gui.open( true );
    // TODO: Convert to React Component, load from resume.html for content
/*
    let resume_objects = screenplay.resume.objects;
    let targets = screenplay.resume.targets;
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

      station.addEventListener( 'click', ( e )=>{
        e.preventDefault();
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

      const cssObject = new CSS3DAsset( station );
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
    let last_start = 0;
    for ( let ndx = 0, len = resume_objects.length; ndx < len; ndx++ ){
      last_start = ( ndx > 0 ) ? Number.parseInt( resume_objects[ndx - 1].element.dataset.start ) : 0;
      let start = Number.parseInt( resume_objects[ndx].element.dataset.start );
      let end = Number.parseInt( resume_objects[ndx].element.dataset.end );

      let prog = (ndx + 1)/len;
      let element_height = resume_objects[ ndx ].element.clientHeight;
      let element_width = resume_objects[ ndx ].element.clientWidth;

      // Time-Line Display
      const timeline_object = new THREE.Object3D();
      let _at = ( start-606 ) / timelength;
      let _last_at = ( last_start-606 ) / timelength;
      let pos_at = new THREE.Vector3();
      if( true ) {
        timeline.getPointAt( _at, pos_at );
        timeline_object.position.copy( pos_at );
      } else {
        // TODO: Implement this offset, but this needs an overhaul from above.
        timeline.getPointAt( _last_at, pos_at );
        let stack_offset = new THREE.Vector3( 0, element_height, 0 );
        timeline_object.position.addVectors( pos_at, stack_offset );
      }
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

    const gui = screenplay.lil_gui;
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

    document_controls.Grid_Display();*/
    this.ActivateOrbitControls( screenplay );

    document.title = 'Workflow.introduce_phox | The Pale Blue Dot | Phox.Solutions';

    //director.emit( `${dictum_name}_progress`, dictum_name, ndx );
  };
  confirm_privileges = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.confirm_privileges');

    document.title = 'Workflow.confirm_privileges | The Pale Blue Dot | Phox.Solutions';


    director.emit( `${dictum_name}_progress`, dictum_name, ndx );
  };
  connect = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.connect');

    document.title = 'Workflow.connect | The Pale Blue Dot | Phox.Solutions';

    director.emit( `${dictum_name}_progress`, dictum_name, ndx );
  };

  constructor( react_app ){
    super();
    this.react_app = react_app;
  }
}

export { Workflow }
