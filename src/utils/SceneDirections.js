import * as THREE from 'three';
import { SceneDirections as _SceneDirections } from './ScreenDirector.js';
import { CSS3DObject } from './jsm/renderers/CSS3DRenderer.js';

class SceneDirections extends _SceneDirections {
  enter_splash = async ( scene_assets )=>{
    console.log('SceneDirections.enter_splash');
    let scene = scene_assets.scene;
    let ui_scene = scene_assets.ui_scene;
    scene_assets.SetSceneBackground( );

    scene_assets.lights.point_light.position.set( 0, 0, 0 );
    scene.add( scene_assets.lights.point_light );
    scene.add( scene_assets.lights.ambient_light );

    let ship = await scene_assets.actors.Ship;
    scene_assets.cameras = ship.cameras;
    ship.position.addVectors( scene_assets.actors.Earth.position, scene_assets.actors.Earth.orbital_vector );
    ship.lookAt( scene_assets.actors.Earth.position );

    scene.add( ship );

    scene.add( ship.warp_tunnel );
    ship.warp_tunnel.children.forEach( ( warp_shell_cone )=>{
      warp_shell_cone.visible = false;
      scene_assets.actives.push( warp_shell_cone );
    });
    ship.updateMatrixWorld( true );
    var rotationMatrix = new THREE.Matrix4().extractRotation( ship.matrixWorld );
    var up_now = new THREE.Vector3( 0, 1, 0 ).applyMatrix4( rotationMatrix ).normalize();
    ship.up = up_now;
    scene_assets.active_cam.up = up_now;
    scene_assets.active_cam.position.addVectors( ship.position, new THREE.Vector3( 0,0,0 ) );
    let sight_target = new THREE.Vector3();
    ship.NavDots.sight_target.getWorldPosition( sight_target );
    scene_assets.active_cam.lookAt( sight_target );
    scene_assets.active_cam.updateProjectionMatrix();

    let distance_scale = 0.1 / ( scene_assets.actors.Neptune.surface_distance ) / 30000;
    let model_scale = 0.01 / ( scene_assets.actors.Neptune.surface_distance );

    let holo_neptune = scene_assets.actors.Neptune.clone( );
    let neptune_scale = 0.02 / ( scene_assets.actors.Neptune.surface_distance );
    holo_neptune.scale.multiplyScalar( neptune_scale );
    holo_neptune.position.multiplyScalar( distance_scale * 0.7).add( new THREE.Vector3( 0, 0.07, 0) );
    holo_neptune.position.setZ( holo_neptune.position.z / 2 );
    holo_neptune.click = ()=>{ scene_assets.actions.warp_to( scene_assets.actors.Neptune ) };
    scene_assets.interactives.push( holo_neptune );
    ship.ops_station.add( holo_neptune );

    let holo_uranus = scene_assets.actors.Uranus.clone( );
    let uranus_scale = 0.02 / ( scene_assets.actors.Uranus.surface_distance );
    holo_uranus.scale.multiplyScalar( uranus_scale );
    holo_uranus.position.multiplyScalar( distance_scale * 0.95 ).add( new THREE.Vector3( 0, 0.07, 0) );
    holo_uranus.position.setZ( holo_uranus.position.z / 2 );
    holo_uranus.click = ()=>{ scene_assets.actions.warp_to( scene_assets.actors.Uranus ) };
    scene_assets.interactives.push( holo_uranus );
    ship.ops_station.add( holo_uranus );

    let holo_saturn = scene_assets.actors.Saturn.clone( );
    let saturn_scale = 0.02 / ( scene_assets.actors.Saturn.surface_distance );
    holo_saturn.scale.multiplyScalar( saturn_scale );
    holo_saturn.position.multiplyScalar( distance_scale * 1.5 ).add( new THREE.Vector3( 0, 0.07, 0) );
    holo_saturn.position.setZ( holo_saturn.position.z / 2 );
    holo_saturn.click = ()=>{ scene_assets.actions.warp_to( scene_assets.actors.Saturn ) };
    scene_assets.interactives.push( holo_saturn );
    ship.ops_station.add( holo_saturn );

    let holo_jupiter = scene_assets.actors.Jupiter.clone( );
    let jupiter_scale = 0.03 / ( scene_assets.actors.Jupiter.surface_distance );
    holo_jupiter.scale.multiplyScalar( jupiter_scale );
    holo_jupiter.position.multiplyScalar( distance_scale * 1.9 ).add( new THREE.Vector3( 0, 0.07, 0) );
    holo_jupiter.position.setZ( holo_jupiter.position.z / 2 );
    holo_jupiter.click = ()=>{ scene_assets.actions.warp_to( scene_assets.actors.Jupiter ) };
    scene_assets.interactives.push( holo_jupiter );
    ship.ops_station.add( holo_jupiter );

    let holo_mars = scene_assets.actors.Mars.clone( );
    let mars_scale = 0.008 / ( scene_assets.actors.Mars.surface_distance );
    holo_mars.scale.multiplyScalar( mars_scale );
    holo_mars.position.multiplyScalar( distance_scale * 4.5 ).add( new THREE.Vector3( 0, 0.1, 0) );
    holo_mars.click = ()=>{ scene_assets.actions.warp_to( scene_assets.actors.Mars ) };
    scene_assets.interactives.push( holo_mars );
    ship.ops_station.add( holo_mars );

    let holo_earth = scene_assets.actors.Earth.clone( );
    let earth_scale = 0.01 / ( scene_assets.actors.Earth.surface_distance );
    holo_earth.scale.multiplyScalar( earth_scale );
    holo_earth.position.multiplyScalar( distance_scale * 5 ).add( new THREE.Vector3( 0, 0.1, 0) );
    holo_earth.click = ()=>{ scene_assets.actions.warp_to( scene_assets.actors.Earth ) };
    scene_assets.interactives.push( holo_earth );
    ship.ops_station.add( holo_earth );

    let holo_moon = scene_assets.actors.Moon.clone( );
    let moon_scale = 0.004 / ( scene_assets.actors.Moon.surface_distance );
    holo_moon.scale.multiplyScalar( moon_scale );
    holo_moon.position.multiplyScalar( distance_scale * 5.75 ).add( new THREE.Vector3( 0, 0.1, 0) );
    holo_moon.click = ()=>{ scene_assets.actions.warp_to( scene_assets.actors.Moon ) };
    scene_assets.interactives.push( holo_moon );
    ship.ops_station.add( holo_moon );

    let holo_venus = scene_assets.actors.Venus.clone( );
    let venus_scale = 0.01 / ( scene_assets.actors.Venus.surface_distance );
    holo_venus.scale.multiplyScalar( venus_scale );
    holo_venus.position.multiplyScalar( distance_scale * 5 ).add( new THREE.Vector3( 0, 0.1, 0) );
    holo_venus.click = ()=>{ scene_assets.actions.warp_to( scene_assets.actors.Venus ) };
    scene_assets.interactives.push( holo_venus );
    ship.ops_station.add( holo_venus );

    let holo_mercury = scene_assets.actors.Mercury.clone( );
    let mercury_scale = 0.008 / ( scene_assets.actors.Mercury.surface_distance );
    holo_mercury.scale.multiplyScalar( mercury_scale );
    holo_mercury.position.multiplyScalar( distance_scale * 6 ).add( new THREE.Vector3( 0, 0.1, 0) );
    holo_mercury.click = ()=>{ scene_assets.actions.warp_to( scene_assets.actors.Mercury ) };
    scene_assets.interactives.push( holo_mercury );
    ship.ops_station.add( holo_mercury );

    let holo_sun = scene_assets.actors.Sun.clone( );
    let sun_scale = 0.04 / ( scene_assets.actors.Sun.surface_distance );
    holo_sun.scale.multiplyScalar( sun_scale );
    holo_sun.position.multiplyScalar( distance_scale ).add( new THREE.Vector3( 0, 0.03, 0) );
    holo_sun.click = ()=>{ scene_assets.actions.warp_to( scene_assets.actors.Sun ) };
    scene_assets.interactives.push( holo_sun );
    ship.ops_station.add( holo_sun );

    // TODO: Add Planet holograms as navigation controls inside ship.
    //scene_assets.actors.Neptune.click = ()=>{ scene_assets.actions.warp_to( scene_assets.actors.Neptune ) };
    //scene_assets.actors.Uranus.click = ()=>{ scene_assets.actions.warp_to( scene_assets.actors.Uranus ) };
    //scene_assets.actors.Saturn.click = ()=>{ scene_assets.actions.warp_to( scene_assets.actors.Saturn ) };
    //scene_assets.actors.Jupiter.click = ()=>{ scene_assets.actions.warp_to( scene_assets.actors.Jupiter ) };
    //scene_assets.actors.Mars.click = ()=>{ scene_assets.actions.warp_to( scene_assets.actors.Mars ) };
    //scene_assets.actors.Earth.click = ()=>{ scene_assets.actions.warp_to( scene_assets.actors.Earth ) };
    //scene_assets.actors.Moon.click = ()=>{ scene_assets.actions.warp_to( scene_assets.actors.Moon ) };
    //scene_assets.actors.Sun.click = ()=>{ scene_assets.actions.warp_to( scene_assets.actors.Sun ) };

    scene.add( scene_assets.actors.Neptune );
    scene_assets.interactives.push( scene_assets.actors.Neptune );
    scene_assets.actives.push( scene_assets.actors.Neptune );

    scene.add( scene_assets.actors.Uranus );
    scene_assets.interactives.push( scene_assets.actors.Uranus );
    scene_assets.actives.push( scene_assets.actors.Uranus );

    //scene.add( scene_assets.actors.rings );
    scene.add( scene_assets.actors.Saturn );
    scene_assets.interactives.push( scene_assets.actors.Saturn );
    scene_assets.actives.push( scene_assets.actors.Saturn );

    scene.add( scene_assets.actors.Jupiter );
    scene_assets.interactives.push( scene_assets.actors.Jupiter );
    scene_assets.actives.push( scene_assets.actors.Jupiter );

    scene.add( scene_assets.actors.Mars );
    scene_assets.interactives.push( scene_assets.actors.Mars );
    scene_assets.actives.push( scene_assets.actors.Mars );

    scene.add( scene_assets.actors.Earth );
    scene_assets.interactives.push( scene_assets.actors.Earth );
    scene_assets.actives.push( scene_assets.actors.Earth );

    scene.add( scene_assets.actors.Moon );
    scene_assets.interactives.push( scene_assets.actors.Moon );
    scene_assets.actives.push( scene_assets.actors.Moon );

    scene.add( scene_assets.actors.Venus );
    scene_assets.interactives.push( scene_assets.actors.Venus );
    scene_assets.actives.push( scene_assets.actors.Venus );

    scene.add( scene_assets.actors.Mercury );
    scene_assets.interactives.push( scene_assets.actors.Mercury );
    scene_assets.actives.push( scene_assets.actors.Mercury );

    scene.add( scene_assets.actors.Sun );
    scene_assets.interactives.push( scene_assets.actors.Sun );
    scene_assets.actives.push( scene_assets.actors.Sun );

    const gridHelper = new THREE.GridHelper( 9000000000000, 10 );
    scene.add( gridHelper );
    gridHelper.visible = false;

  };
  idle_on_splash = async ( scene_assets )=>{
   console.log('SceneDirections.idle_on_splash');
  };
  progress_splash = async ( scene_assets )=>{
  console.log('SceneDirections.progress_splash');
  };
  splash_failure = async ( scene_assets )=>{
   console.log('SceneDirections.splash_failure');
  };
  end_splash = async ( scene_assets )=>{
   console.log('SceneDirections.end_splash');
  };
  overlay_icons = async ( scene_assets )=>{
   console.log('SceneDirections.overlay_icons');
  };
  ready_for_neptune = async ( scene_assets )=>{
   console.log('SceneDirections.ready_for_neptune');
  };
  bezier_path_to_neptune = async ( scene_assets )=>{
   console.log('SceneDirections.bezier_path_to_neptune');
  };
  neptune_failure = async ( scene_assets )=>{
   console.log('SceneDirections.neptune_failure');
  };
  progress_neptune = async ( scene_assets )=>{
   console.log('SceneDirections.progress_neptune');
  };
  ready_for_uranus = async ( scene_assets )=>{
   console.log('SceneDirections.ready_for_uranus');
  };
  bezier_path_to_uranus = async ( scene_assets )=>{
   console.log('SceneDirections.bezier_path_to_uranus');
  };
  spin_in_place = async ( scene_assets )=>{
   console.log('SceneDirections.spin_in_place');
  };
  uranus_failure = async ( scene_assets )=>{
   console.log('SceneDirections.uranus_failure');
  };
  progress_uranus = async ( scene_assets )=>{
   console.log('SceneDirections.progress_uranus');
  };
  ready_for_saturn = async ( scene_assets )=>{
   console.log('SceneDirections.ready_for_saturn');
  };
  bezier_path_to_saturn = async ( scene_assets )=>{
   console.log('SceneDirections.bezier_path_to_saturn');
  };
  spin_with_orbit_ctrls = async ( scene_assets )=>{
   console.log('SceneDirections.spin_with_orbit_ctrls');
  };
  saturn_failure = async ( scene_assets )=>{
   console.log('SceneDirections.saturn_failure');
  };
  progress_saturn = async ( scene_assets )=>{
   console.log('SceneDirections.progress_saturn');
  };
  ready_for_jupiter = async ( scene_assets )=>{
   console.log('SceneDirections.ready_for_jupiter');
  };
  bezier_path_to_jupiter = async ( scene_assets )=>{
   console.log('SceneDirections.bezier_path_to_jupiter');
  };
  spin_with_orbit_ctrls = async ( scene_assets )=>{
   console.log('SceneDirections.spin_with_orbit_ctrls');
  };
  jupiter_failure = async ( scene_assets )=>{
   console.log('SceneDirections.jupiter_failure');
  };
  progress_jupiter = async ( scene_assets )=>{
  console.log('SceneDirections.progress_jupiter');
  };
  ready_for_mars = async ( scene_assets )=>{
   console.log('SceneDirections.ready_for_mars');
  };
  bezier_path_to_mars = async ( scene_assets )=>{
   console.log('SceneDirections.bezier_path_to_mars');
  };
  mars_failure = async ( scene_assets )=>{
   console.log('SceneDirections.mars_failure');
  };
  progress_mars = async ( scene_assets )=>{
   console.log('SceneDirections.progress_mars');
  };
  ready_for_earth = async ( scene_assets )=>{
   console.log('SceneDirections.ready_for_earth');
  };
  bezier_path_to_earth = async ( scene_assets )=>{
   console.log('SceneDirections.bezier_path_to_earth');
  };
  earth_failure = async ( scene_assets )=>{
   console.log('SceneDirections.earth_failure');
  };
  progress_earth = async ( scene_assets )=>{
   console.log('SceneDirections.progress_earth');
  };
  back_into_bridge = async ( scene_assets )=>{
   console.log('SceneDirections.back_into_bridge');
  };
  ready_for_ship = async ( scene_assets )=>{
   console.log('SceneDirections.ready_for_ship');
  };
  overlay_interface = async ( scene_assets )=>{
   console.log('SceneDirections.overlay_interface');
  };
  bridge_view = async ( scene_assets )=>{
   console.log('SceneDirections.bridge_view');
  };
  progress_ship = async ( scene_assets )=>{
   console.log('SceneDirections.progress_ship');
  };
  ship_failure = async ( scene_assets )=>{
   console.log('SceneDirections.ship_failure');
  };
  ready_for_anything = async ( scene_assets )=>{
   console.log('SceneDirections.ready_for_anything');
  }
}

export { SceneDirections }
