// ScreenDirector Reference
import { SceneDirections as _SceneDirections } from '../bin/ScreenDirector.js';
// Support Library Reference
import * as THREE from 'three';
import { CSS3DObject } from '../lib/CSS3DRenderer.js';

// ScreenDirections Implementation
/*
    This is where the THREE.js code is run.
    New characters need to render to the stage?  Do that here.
    When using lazy Getters for those models, they wont load prematurely.
    Note: Be sure to override the lazy Getter with the initialized model ( See Screenplay.js for an example ).
*/
class SceneDirections extends _SceneDirections {

  enter_splash = async ( screenplay, dictum_name, next_emit, director )=>{

    console.log('SceneDirections.enter_splash');

    await screenplay.SetSceneBackground( );

    let scene = screenplay.scene;

    screenplay.lights.point_light.position.set( 0, 0, 0 );
    scene.add( screenplay.lights.point_light );

    let splash_screen = screenplay.props.SplashScreen;
    splash_screen.visible = false;
    scene.add( splash_screen );

    let home_dome = screenplay.props.HomeDome;
    scene.add( home_dome );

    director.emit( next_emit, dictum_name );
  };
  idle_on_splash = async ( screenplay, dictum_name, next_emit, director )=>{
    console.log('SceneDirections.idle_on_splash');

    let scene = screenplay.scene;
    let ui_scene = screenplay.ui_scene;

    let gridHelper = screenplay.gridHelper = new THREE.GridHelper( 14959787070000, 100 );   // Set the grids to equal to 1AU * 1AU;
    gridHelper.visible = false;
    scene.add( gridHelper );

    let ship = await screenplay.actors.Ship;
    ship.cameras.forEach( ( value, key )=>{
      screenplay.cameras.set( key, value );
    });


    scene.add( screenplay.lights.ambient_light );

    ship.position.addVectors( screenplay.actors.Earth.position, screenplay.actors.Earth.orbital_vector);
    ship.lookAt( screenplay.actors.Earth.position );
    scene.add( ship.warp_tunnel );
    ship.warp_tunnel.children.forEach( ( warp_shell_cone )=>{
      warp_shell_cone.visible = false;
      screenplay.actives.push( warp_shell_cone );
    });

    // Orient the camera view to that of the ship.
    ship.updateMatrixWorld( true );
    await screenplay.actions.change_cam( 'CaptainCam' );

    // Create the Navigation Hologram Interface, to represent the system as it currently is.
    let distance_scale = 0.1 / ( screenplay.actors.Neptune.surface_distance ) / 30000;
    let model_scale = 0.01 / ( screenplay.actors.Neptune.surface_distance );

    // Neptune
    let neptune = await screenplay.actors.Neptune;
    scene.add( neptune );
    screenplay.interactives.push( neptune );
    screenplay.actives.push( neptune );
    let holo_neptune = neptune.clone( );
    let neptune_scale = 0.02 / ( neptune.surface_distance );
    holo_neptune.scale.multiplyScalar( neptune_scale );
    holo_neptune.position.multiplyScalar( distance_scale * 0.7).add( new THREE.Vector3( 0, 0.07, 0) );
    holo_neptune.position.setZ( holo_neptune.position.z / 2 );
    holo_neptune.click = ()=>{ screenplay.actions.warp_to( neptune ) };
    screenplay.interactives.push( holo_neptune );
    ship.ops_station.add( holo_neptune );

    // Uranus
    let uranus = await screenplay.actors.Uranus;
    scene.add( uranus );
    screenplay.interactives.push( uranus );
    screenplay.actives.push( uranus );
    let holo_uranus = uranus.clone( );
    let uranus_scale = 0.02 / ( uranus.surface_distance );
    holo_uranus.scale.multiplyScalar( uranus_scale );
    holo_uranus.position.multiplyScalar( distance_scale * 0.95 ).add( new THREE.Vector3( 0, 0.07, 0) );
    holo_uranus.position.setZ( holo_uranus.position.z / 2 );
    holo_uranus.click = ()=>{ screenplay.actions.warp_to( uranus ) };
    screenplay.interactives.push( holo_uranus );
    ship.ops_station.add( holo_uranus );

    // Saturn
    let saturn = await screenplay.actors.Saturn;
    scene.add( saturn );
    screenplay.interactives.push( saturn );
    screenplay.actives.push( saturn );
    let holo_saturn = saturn.clone( );
    let saturn_scale = 0.02 / ( saturn.surface_distance );
    holo_saturn.scale.multiplyScalar( saturn_scale );
    holo_saturn.position.multiplyScalar( distance_scale * 1.5 ).add( new THREE.Vector3( 0, 0.07, 0) );
    holo_saturn.position.setZ( holo_saturn.position.z / 2 );
    holo_saturn.click = ()=>{ screenplay.actions.warp_to( saturn ) };
    screenplay.interactives.push( holo_saturn );
    ship.ops_station.add( holo_saturn );

    // Jupiter
    let jupiter = await screenplay.actors.Jupiter;
    scene.add( jupiter );
    screenplay.interactives.push( jupiter );
    screenplay.actives.push( jupiter );
    let holo_jupiter = jupiter.clone( );
    let jupiter_scale = 0.03 / ( jupiter.surface_distance );
    holo_jupiter.scale.multiplyScalar( jupiter_scale );
    holo_jupiter.position.multiplyScalar( distance_scale * 1.9 ).add( new THREE.Vector3( 0, 0.07, 0) );
    holo_jupiter.position.setZ( holo_jupiter.position.z / 2 );
    holo_jupiter.click = ()=>{ screenplay.actions.warp_to( jupiter ) };
    screenplay.interactives.push( holo_jupiter );
    ship.ops_station.add( holo_jupiter );

    // Mars
    let mars = await screenplay.actors.Mars;
    scene.add( mars );
    screenplay.interactives.push( mars );
    screenplay.actives.push( mars );
    let holo_mars = mars.clone( );
    let mars_scale = 0.008 / ( mars.surface_distance );
    holo_mars.scale.multiplyScalar( mars_scale );
    holo_mars.position.multiplyScalar( distance_scale * 4.5 ).add( new THREE.Vector3( 0, 0.1, 0) );
    holo_mars.click = ()=>{ screenplay.actions.warp_to( mars ) };
    screenplay.interactives.push( holo_mars );
    ship.ops_station.add( holo_mars );

    // Earth
    let earth = await screenplay.actors.Earth;
    scene.add( earth );
    screenplay.interactives.push( earth );
    screenplay.actives.push( earth );
    let holo_earth = earth.clone( );
    let earth_scale = 0.01 / ( earth.surface_distance );
    holo_earth.scale.multiplyScalar( earth_scale );
    holo_earth.position.multiplyScalar( distance_scale * 5 ).add( new THREE.Vector3( 0, 0.1, 0) );
    holo_earth.click = ()=>{ screenplay.actions.warp_to( earth ) };
    screenplay.interactives.push( holo_earth );
    ship.ops_station.add( holo_earth );

    // Moon
    let moon = await screenplay.actors.Moon;
    scene.add( moon );
    screenplay.interactives.push( moon );
    screenplay.actives.push( moon );
    let holo_moon = moon.clone( );
    let moon_scale = 0.004 / ( moon.surface_distance );
    holo_moon.scale.multiplyScalar( moon_scale );
    holo_moon.position.multiplyScalar( distance_scale * 5.75 ).add( new THREE.Vector3( 0, 0.1, 0) );
    holo_moon.click = ()=>{ screenplay.actions.warp_to( moon ) };
    screenplay.interactives.push( holo_moon );
    ship.ops_station.add( holo_moon );

    // Venus
    let venus = await screenplay.actors.Venus;
    scene.add( venus );
    screenplay.interactives.push( venus );
    screenplay.actives.push( venus );
    let holo_venus = venus.clone( );
    let venus_scale = 0.01 / ( venus.surface_distance );
    holo_venus.scale.multiplyScalar( venus_scale );
    holo_venus.position.multiplyScalar( distance_scale * 5 ).add( new THREE.Vector3( 0, 0.1, 0) );
    holo_venus.click = ()=>{ screenplay.actions.warp_to( venus ) };
    screenplay.interactives.push( holo_venus );
    ship.ops_station.add( holo_venus );

    // Mercury
    let mercury = await screenplay.actors.Mercury;
    scene.add( screenplay.actors.Mercury );
    screenplay.interactives.push( screenplay.actors.Mercury );
    screenplay.actives.push( screenplay.actors.Mercury );
    let holo_mercury = screenplay.actors.Mercury.clone( );
    let mercury_scale = 0.008 / ( screenplay.actors.Mercury.surface_distance );
    holo_mercury.scale.multiplyScalar( mercury_scale );
    holo_mercury.position.multiplyScalar( distance_scale * 6 ).add( new THREE.Vector3( 0, 0.1, 0) );
    holo_mercury.click = ()=>{ screenplay.actions.warp_to( screenplay.actors.Mercury ) };
    screenplay.interactives.push( holo_mercury );
    ship.ops_station.add( holo_mercury );

    // Sun
    let sun = screenplay.actors.Sun;
    scene.add( sun );
    screenplay.interactives.push( sun );
    screenplay.actives.push( sun );
    let holo_sun = sun.clone( );
    let sun_scale = 0.04 / ( sun.surface_distance );
    holo_sun.scale.multiplyScalar( sun_scale );
    holo_sun.position.multiplyScalar( distance_scale ).add( new THREE.Vector3( 0, 0.03, 0) );
    holo_sun.click = ()=>{ screenplay.actions.warp_to( sun ) };
    screenplay.interactives.push( holo_sun );
    ship.ops_station.add( holo_sun );

    // Ship
    scene.add( ship );

    director.emit( next_emit, dictum_name );
  };
  progress_splash = async ( screenplay )=>{
    console.log('SceneDirections.progress_splash');
  };
  splash_failure = async ( screenplay )=>{
   console.log('SceneDirections.splash_failure');
  };
  end_splash = async ( screenplay, dictum_name, next_emit, director )=>{
   console.log('SceneDirections.end_splash');

   director.emit( next_emit, dictum_name );
  };
  enter_prep = async ( screenplay, dictum_name, next_emit, director )=>{
   console.log('SceneDirections.enter_prep');

   director.emit( next_emit, dictum_name );
  };
  idle_on_prep = async ( screenplay, dictum_name, next_emit, director )=>{
   console.log('SceneDirections.idle_on_prep');

   director.emit( next_emit, dictum_name );
  };
  progress_prep = async ( screenplay )=>{
   console.log('SceneDirections.progress_prep');
  };
  prep_failure = async ( screenplay )=>{
   console.log('SceneDirections.prep_failure');
  };
  prepared = async ( screenplay, dictum_name, next_emit, director )=>{
    console.log('SceneDirections.prepared');

    if( screenplay.take_the_tour ){
      director.emit( next_emit, dictum_name );
    } else {
      let from_dictum_name = dictum_name;
      dictum_name = `Ready`;
      director.emit( `goto_dictum`, dictum_name, from_dictum_name );
    }
  };
  enter_tour = async ( screenplay, dictum_name, next_emit, director )=>{
   console.log('SceneDirections.enter_tour');

   director.emit( next_emit, dictum_name );
  };
  idle_on_tour = async ( screenplay, dictum_name, next_emit, director )=>{
   console.log('SceneDirections.idle_on_tour');

   director.emit( next_emit, dictum_name );
  };
  progress_tour = async ( screenplay )=>{
   console.log('SceneDirections.progress_tour');
  };
  tour_failure = async ( screenplay )=>{
   console.log('SceneDirections.tour_failure');
  };
  tour_over = async ( screenplay, dictum_name, next_emit, director )=>{
   console.log('SceneDirections.tour_over');

   director.emit( next_emit, dictum_name );
  };
  enter_ready = async ( screenplay, dictum_name, next_emit, director )=>{
   console.log('SceneDirections.enter_ready');



   director.emit( next_emit, dictum_name );
  };
  idle_on_ready = async ( screenplay, dictum_name, next_emit, director )=>{
   console.log('SceneDirections.idle_on_ready');

   director.emit( next_emit, dictum_name );
  };
  progress_ready = async ( screenplay )=>{
   console.log('SceneDirections.progress_ready');
  };
  ready_failure = async ( screenplay )=>{
   console.log('SceneDirections.ready_failure');
  };
  ready_for_anything = async ( screenplay, dictum_name, next_emit, director )=>{
   console.log('SceneDirections.ready_for_anything');

   director.emit( next_emit, dictum_name );
  };
}

export { SceneDirections }
