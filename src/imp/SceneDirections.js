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
  enter_splash = async ( screenplay )=>{

    console.log('SceneDirections.enter_splash');
    let scene = screenplay.scene;
    let ui_scene = screenplay.ui_scene;
    await screenplay.SetSceneBackground( );

    const gridHelper = new THREE.GridHelper( 9000000000000, 10 );
    scene.add( gridHelper );
    gridHelper.visible = true;

  };
  idle_on_splash = async ( screenplay )=>{
   console.log('SceneDirections.idle_on_splash');
   let scene = screenplay.scene;
   let ui_scene = screenplay.ui_scene;

   let ship = await screenplay.actors.Ship;
   screenplay.cameras = ship.cameras;

   scene.add( ship );
  };
  progress_splash = async ( screenplay )=>{
    console.log('SceneDirections.progress_splash');
  };
  splash_failure = async ( screenplay )=>{
   console.log('SceneDirections.splash_failure');
  };
  end_splash = async ( screenplay )=>{
   console.log('SceneDirections.end_splash');
  };
  enter_ready = async ( screenplay )=>{
   console.log('SceneDirections.enter_ready');
  };
  idle_on_ready = async ( screenplay )=>{
   console.log('SceneDirections.idle_on_ready');

   let scene = screenplay.scene;
   let ui_scene = screenplay.ui_scene;

   screenplay.lights.point_light.position.set( 0, 0, 0 );
   scene.add( screenplay.lights.point_light );
   scene.add( screenplay.lights.ambient_light );

   let ship = screenplay.actors.Ship;
   ship.position.addVectors( screenplay.actors.Earth.position, screenplay.actors.Earth.orbital_vector );
   ship.lookAt( screenplay.actors.Earth.position );

   scene.add( ship.warp_tunnel );
   ship.warp_tunnel.children.forEach( ( warp_shell_cone )=>{
     warp_shell_cone.visible = false;
     screenplay.actives.push( warp_shell_cone );
   });
   ship.updateMatrixWorld( true );
   var rotationMatrix = new THREE.Matrix4().extractRotation( ship.matrixWorld );
   var up_now = new THREE.Vector3( 0, 1, 0 ).applyMatrix4( rotationMatrix ).normalize();
   ship.up = up_now;
   screenplay.active_cam.up = up_now;
   screenplay.active_cam.position.addVectors( ship.position, new THREE.Vector3( 0,0,0 ) );
   let sight_target = new THREE.Vector3();
   ship.NavDots.sight_target.getWorldPosition( sight_target );
   screenplay.active_cam.lookAt( sight_target );
   screenplay.active_cam.updateProjectionMatrix();

   let distance_scale = 0.1 / ( screenplay.actors.Neptune.surface_distance ) / 30000;
   let model_scale = 0.01 / ( screenplay.actors.Neptune.surface_distance );

   let holo_neptune = screenplay.actors.Neptune.clone( );
   let neptune_scale = 0.02 / ( screenplay.actors.Neptune.surface_distance );
   holo_neptune.scale.multiplyScalar( neptune_scale );
   holo_neptune.position.multiplyScalar( distance_scale * 0.7).add( new THREE.Vector3( 0, 0.07, 0) );
   holo_neptune.position.setZ( holo_neptune.position.z / 2 );
   holo_neptune.click = ()=>{ screenplay.actions.warp_to( screenplay.actors.Neptune ) };
   screenplay.interactives.push( holo_neptune );
   ship.ops_station.add( holo_neptune );

   let holo_uranus = screenplay.actors.Uranus.clone( );
   let uranus_scale = 0.02 / ( screenplay.actors.Uranus.surface_distance );
   holo_uranus.scale.multiplyScalar( uranus_scale );
   holo_uranus.position.multiplyScalar( distance_scale * 0.95 ).add( new THREE.Vector3( 0, 0.07, 0) );
   holo_uranus.position.setZ( holo_uranus.position.z / 2 );
   holo_uranus.click = ()=>{ screenplay.actions.warp_to( screenplay.actors.Uranus ) };
   screenplay.interactives.push( holo_uranus );
   ship.ops_station.add( holo_uranus );

   let holo_saturn = screenplay.actors.Saturn.clone( );
   let saturn_scale = 0.02 / ( screenplay.actors.Saturn.surface_distance );
   holo_saturn.scale.multiplyScalar( saturn_scale );
   holo_saturn.position.multiplyScalar( distance_scale * 1.5 ).add( new THREE.Vector3( 0, 0.07, 0) );
   holo_saturn.position.setZ( holo_saturn.position.z / 2 );
   holo_saturn.click = ()=>{ screenplay.actions.warp_to( screenplay.actors.Saturn ) };
   screenplay.interactives.push( holo_saturn );
   ship.ops_station.add( holo_saturn );

   let holo_jupiter = screenplay.actors.Jupiter.clone( );
   let jupiter_scale = 0.03 / ( screenplay.actors.Jupiter.surface_distance );
   holo_jupiter.scale.multiplyScalar( jupiter_scale );
   holo_jupiter.position.multiplyScalar( distance_scale * 1.9 ).add( new THREE.Vector3( 0, 0.07, 0) );
   holo_jupiter.position.setZ( holo_jupiter.position.z / 2 );
   holo_jupiter.click = ()=>{ screenplay.actions.warp_to( screenplay.actors.Jupiter ) };
   screenplay.interactives.push( holo_jupiter );
   ship.ops_station.add( holo_jupiter );

   let holo_mars = screenplay.actors.Mars.clone( );
   let mars_scale = 0.008 / ( screenplay.actors.Mars.surface_distance );
   holo_mars.scale.multiplyScalar( mars_scale );
   holo_mars.position.multiplyScalar( distance_scale * 4.5 ).add( new THREE.Vector3( 0, 0.1, 0) );
   holo_mars.click = ()=>{ screenplay.actions.warp_to( screenplay.actors.Mars ) };
   screenplay.interactives.push( holo_mars );
   ship.ops_station.add( holo_mars );

   let holo_earth = screenplay.actors.Earth.clone( );
   let earth_scale = 0.01 / ( screenplay.actors.Earth.surface_distance );
   holo_earth.scale.multiplyScalar( earth_scale );
   holo_earth.position.multiplyScalar( distance_scale * 5 ).add( new THREE.Vector3( 0, 0.1, 0) );
   holo_earth.click = ()=>{ screenplay.actions.warp_to( screenplay.actors.Earth ) };
   screenplay.interactives.push( holo_earth );
   ship.ops_station.add( holo_earth );

   let holo_moon = screenplay.actors.Moon.clone( );
   let moon_scale = 0.004 / ( screenplay.actors.Moon.surface_distance );
   holo_moon.scale.multiplyScalar( moon_scale );
   holo_moon.position.multiplyScalar( distance_scale * 5.75 ).add( new THREE.Vector3( 0, 0.1, 0) );
   holo_moon.click = ()=>{ screenplay.actions.warp_to( screenplay.actors.Moon ) };
   screenplay.interactives.push( holo_moon );
   ship.ops_station.add( holo_moon );

   let holo_venus = screenplay.actors.Venus.clone( );
   let venus_scale = 0.01 / ( screenplay.actors.Venus.surface_distance );
   holo_venus.scale.multiplyScalar( venus_scale );
   holo_venus.position.multiplyScalar( distance_scale * 5 ).add( new THREE.Vector3( 0, 0.1, 0) );
   holo_venus.click = ()=>{ screenplay.actions.warp_to( screenplay.actors.Venus ) };
   screenplay.interactives.push( holo_venus );
   ship.ops_station.add( holo_venus );

   let holo_mercury = screenplay.actors.Mercury.clone( );
   let mercury_scale = 0.008 / ( screenplay.actors.Mercury.surface_distance );
   holo_mercury.scale.multiplyScalar( mercury_scale );
   holo_mercury.position.multiplyScalar( distance_scale * 6 ).add( new THREE.Vector3( 0, 0.1, 0) );
   holo_mercury.click = ()=>{ screenplay.actions.warp_to( screenplay.actors.Mercury ) };
   screenplay.interactives.push( holo_mercury );
   ship.ops_station.add( holo_mercury );

   let holo_sun = screenplay.actors.Sun.clone( );
   let sun_scale = 0.04 / ( screenplay.actors.Sun.surface_distance );
   holo_sun.scale.multiplyScalar( sun_scale );
   holo_sun.position.multiplyScalar( distance_scale ).add( new THREE.Vector3( 0, 0.03, 0) );
   holo_sun.click = ()=>{ screenplay.actions.warp_to( screenplay.actors.Sun ) };
   screenplay.interactives.push( holo_sun );
   ship.ops_station.add( holo_sun );

   // TODO: Add Planet holograms as navigation controls inside ship.
   //screenplay.actors.Neptune.click = ()=>{ screenplay.actions.warp_to( screenplay.actors.Neptune ) };
   //screenplay.actors.Uranus.click = ()=>{ screenplay.actions.warp_to( screenplay.actors.Uranus ) };
   //screenplay.actors.Saturn.click = ()=>{ screenplay.actions.warp_to( screenplay.actors.Saturn ) };
   //screenplay.actors.Jupiter.click = ()=>{ screenplay.actions.warp_to( screenplay.actors.Jupiter ) };
   //screenplay.actors.Mars.click = ()=>{ screenplay.actions.warp_to( screenplay.actors.Mars ) };
   //screenplay.actors.Earth.click = ()=>{ screenplay.actions.warp_to( screenplay.actors.Earth ) };
   //screenplay.actors.Moon.click = ()=>{ screenplay.actions.warp_to( screenplay.actors.Moon ) };
   //screenplay.actors.Sun.click = ()=>{ screenplay.actions.warp_to( screenplay.actors.Sun ) };

   scene.add( screenplay.actors.Neptune );
   screenplay.interactives.push( screenplay.actors.Neptune );
   screenplay.actives.push( screenplay.actors.Neptune );

   scene.add( screenplay.actors.Uranus );
   screenplay.interactives.push( screenplay.actors.Uranus );
   screenplay.actives.push( screenplay.actors.Uranus );

   //scene.add( screenplay.actors.rings );
   scene.add( screenplay.actors.Saturn );
   screenplay.interactives.push( screenplay.actors.Saturn );
   screenplay.actives.push( screenplay.actors.Saturn );

   scene.add( screenplay.actors.Jupiter );
   screenplay.interactives.push( screenplay.actors.Jupiter );
   screenplay.actives.push( screenplay.actors.Jupiter );

   scene.add( screenplay.actors.Mars );
   screenplay.interactives.push( screenplay.actors.Mars );
   screenplay.actives.push( screenplay.actors.Mars );

   scene.add( screenplay.actors.Earth );
   screenplay.interactives.push( screenplay.actors.Earth );
   screenplay.actives.push( screenplay.actors.Earth );

   scene.add( screenplay.actors.Moon );
   screenplay.interactives.push( screenplay.actors.Moon );
   screenplay.actives.push( screenplay.actors.Moon );

   scene.add( screenplay.actors.Venus );
   screenplay.interactives.push( screenplay.actors.Venus );
   screenplay.actives.push( screenplay.actors.Venus );

   scene.add( screenplay.actors.Mercury );
   screenplay.interactives.push( screenplay.actors.Mercury );
   screenplay.actives.push( screenplay.actors.Mercury );

   scene.add( screenplay.actors.Sun );
   screenplay.interactives.push( screenplay.actors.Sun );
   screenplay.actives.push( screenplay.actors.Sun );
  };
  progress_ready = async ( screenplay )=>{
   console.log('SceneDirections.progress_ready');
  };
  ready_failure = async ( screenplay )=>{
   console.log('SceneDirections.ready_failure');
  };
  ready_for_anything = async ( screenplay )=>{
   console.log('SceneDirections.ready_for_anything');
  };
}

export { SceneDirections }
