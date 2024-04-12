import React from 'react';
import ReactDOM from 'react-dom/client';
// ScreenDirector Reference
import { SceneDirections as _SceneDirections, CSS3DAsset, SceneTransformation } from '../bin/ScreenDirector.js';
// Support Library Reference
import GUI from 'lil-gui';
import * as THREE from 'three';
import { CSS3DObject } from '../lib/CSS3DRenderer.js';
import { Lensflare, LensflareElement } from '../lib/Lensflare.js';

import { ErrorBoundary, GlyphScanner, RoomOfARequiredNature, PostClassified, PostServices, PostCatalog, PostCalendar, PostContacts, WeTheMenu, WeTheHeader, PipGUI, ViewScreenDisplay } from '../components/wethe_core.js';

// ScreenDirections Implementation
/*
    This is where the THREE.js code is run.
    New characters need to render to the stage?  Do that here.
    When using lazy Getters for those models, they wont load prematurely.
    Note: Be sure to override the lazy Getter with the initialized model ( See Screenplay.js for an example ).
*/
class SceneDirections extends _SceneDirections {
  react_app;

  // Ready //
  enter_ready = async ( screenplay, dictum_name, next_emit, director )=>{

   let sys_ve_scene = screenplay.sys_ve_scene;
   let sys_ui_scene = screenplay.sys_ui_scene;
   let page_ve_scene = screenplay.page_ve_scene;
   let page_ui_scene = screenplay.page_ui_scene;

   await screenplay.SetSceneBackground( );
   let starship = await screenplay.actors.Starship;

   sys_ve_scene.add( screenplay.actors.Neptune );
   sys_ve_scene.add( screenplay.actors.Uranus );
   sys_ve_scene.add( screenplay.actors.Saturn );
   sys_ve_scene.add( screenplay.actors.Jupiter );
   sys_ve_scene.add( screenplay.actors.Mars );
   sys_ve_scene.add( await screenplay.actors.Earth );
   sys_ve_scene.add( screenplay.actors.Moon );
   sys_ve_scene.add( screenplay.actors.Venus );
   sys_ve_scene.add( screenplay.actors.Mercury );
   screenplay.actors.Sun.visible = false;
   sys_ve_scene.add( screenplay.actors.Sun );

   director.emit( next_emit, dictum_name );
  };
  idle_on_ready = async ( screenplay, dictum_name, next_emit, director )=>{

   director.emit( next_emit, dictum_name );
  };
  progress_ready = async ( screenplay, dictum_name, ndx )=>{
  };
  ready_failure = async ( screenplay, dictum_name, ndx  )=>{

  };
  ready_for_anything = async ( screenplay, dictum_name, next_emit, director )=>{

   const gui = screenplay.lil_gui;
   let sys_ve_scene = screenplay.sys_ve_scene;
   let sys_ui_scene = screenplay.sys_ui_scene;
   let page_ve_scene = screenplay.page_ve_scene;
   let page_ui_scene = screenplay.page_ui_scene;


   let home_dome = await screenplay.props.HomeDome;
   sys_ve_scene.add( home_dome );

   let starship = await screenplay.actors.Starship;
   let opsStation = starship.getObjectByName( 'OpsStation' );
   let ops_pos = opsStation.position;
   //starship.position.copy( screenplay.actors.Earth.orbital_vector );
   //starship.quaternion.copy( screenplay.actors.Earth.orbital_quaternion );
   starship.position.copy( screenplay.actors.Moon.orbital_vector );
   starship.quaternion.copy( screenplay.actors.Moon.orbital_quaternion );
   starship.updateMatrixWorld( true );
   screenplay.actions.warp_to( screenplay.actors.Earth );

   //debugger;
   //await starship.animations.warp_tunnel.init();
   //screenplay.updatables.set( 'Warp_Tunnel', starship.animations.warp_tunnel );

   // Create the Navigation Hologram Interface, to represent the system as it currently is.
   let distance_scale = 0.1 / ( screenplay.actors.Neptune.surface_distance ) / 30000;

   // Neptune
   let neptune = await screenplay.actors.Neptune;
   sys_ve_scene.add( neptune );
   screenplay.actives.push( neptune );
   let holo_neptune = neptune.clone( );
   let neptune_scale = 0.02 / ( neptune.surface_distance );
   holo_neptune.scale.multiplyScalar( neptune_scale );
   holo_neptune.position.multiplyScalar( distance_scale * 0.7).add( new THREE.Vector3( 0, 0.07, 0) );
   holo_neptune.position.setZ( holo_neptune.position.z / 2 );
   holo_neptune.click = ()=>{ screenplay.actions.warp_to( neptune ) };
   screenplay.interactives.push( holo_neptune );
   starship.OpsStation.add( holo_neptune );

   // Uranus
   let uranus = await screenplay.actors.Uranus;
   sys_ve_scene.add( uranus );
   screenplay.interactives.push( uranus );
   screenplay.actives.push( uranus );
   let holo_uranus = uranus.clone( );
   let uranus_scale = 0.02 / ( uranus.surface_distance );
   holo_uranus.scale.multiplyScalar( uranus_scale );
   holo_uranus.position.multiplyScalar( distance_scale * 0.95 ).add( new THREE.Vector3( 0, 0.07, 0) );
   holo_uranus.position.setZ( holo_uranus.position.z / 2 );
   holo_uranus.click = ()=>{ screenplay.actions.warp_to( uranus ) };
   screenplay.interactives.push( holo_uranus );
   starship.OpsStation.add( holo_uranus );

   // Saturn
   let saturn = await screenplay.actors.Saturn;
   sys_ve_scene.add( saturn );
   screenplay.interactives.push( saturn );
   screenplay.actives.push( saturn );
   let holo_saturn = saturn.clone( );
   let saturn_scale = 0.02 / ( saturn.surface_distance );
   holo_saturn.scale.multiplyScalar( saturn_scale );
   holo_saturn.position.multiplyScalar( distance_scale * 1.5 ).add( new THREE.Vector3( 0, 0.07, 0) );
   holo_saturn.position.setZ( holo_saturn.position.z / 2 );
   holo_saturn.click = ()=>{ screenplay.actions.warp_to( saturn ) };
   screenplay.interactives.push( holo_saturn );
   starship.OpsStation.add( holo_saturn );

   // Jupiter
   let jupiter = await screenplay.actors.Jupiter;
   sys_ve_scene.add( jupiter );
   screenplay.interactives.push( jupiter );
   screenplay.actives.push( jupiter );
   let holo_jupiter = jupiter.clone( );
   let jupiter_scale = 0.02 / ( jupiter.surface_distance );
   holo_jupiter.scale.multiplyScalar( jupiter_scale );
   holo_jupiter.position.multiplyScalar( distance_scale * 1.9 ).add( new THREE.Vector3( 0, 0.07, 0) );
   holo_jupiter.position.setZ( holo_jupiter.position.z / 2 );
   holo_jupiter.click = ()=>{ screenplay.actions.warp_to( jupiter ) };
   screenplay.interactives.push( holo_jupiter );
   starship.OpsStation.add( holo_jupiter );

   // Mars
   let mars = await screenplay.actors.Mars;
   sys_ve_scene.add( mars );
   screenplay.interactives.push( mars );
   screenplay.actives.push( mars );
   let holo_mars = mars.clone( );
   let mars_scale = 0.02 / ( mars.surface_distance );
   holo_mars.scale.multiplyScalar( mars_scale );
   holo_mars.position.multiplyScalar( distance_scale * 4.5 ).add( new THREE.Vector3( 0, 0.1, 0) );
   holo_mars.click = ()=>{ screenplay.actions.warp_to( mars ) };
   screenplay.interactives.push( holo_mars );
   starship.OpsStation.add( holo_mars );

   // Earth
   let earth = await screenplay.actors.Earth;
   sys_ve_scene.add( earth );
   screenplay.interactives.push( earth );
   screenplay.actives.push( earth );
   let holo_earth = earth.clone( );
   let earth_scale = 0.02 / ( earth.surface_distance );
   holo_earth.scale.multiplyScalar( earth_scale );
   holo_earth.position.multiplyScalar( distance_scale * 5 ).add( new THREE.Vector3( 0, 0.1, 0) );
   holo_earth.click = ()=>{ screenplay.actions.warp_to( earth ) };
   screenplay.interactives.push( holo_earth );
   starship.OpsStation.add( holo_earth );

   // Moon
   let moon = await screenplay.actors.Moon;
   sys_ve_scene.add( moon );
   screenplay.interactives.push( moon );
   screenplay.actives.push( moon );
   let holo_moon = moon.clone( );
   let moon_scale = 0.02 / ( moon.surface_distance );
   holo_moon.scale.multiplyScalar( moon_scale );
   holo_moon.position.multiplyScalar( distance_scale * 5.75 ).add( new THREE.Vector3( 0, 0.1, 0) );
   holo_moon.click = ()=>{ screenplay.actions.warp_to( moon ) };
   screenplay.interactives.push( holo_moon );
   starship.OpsStation.add( holo_moon );

   // Venus
   let venus = await screenplay.actors.Venus;
   sys_ve_scene.add( venus );
   screenplay.interactives.push( venus );
   screenplay.actives.push( venus );
   let holo_venus = venus.clone( );
   let venus_scale = 0.02 / ( venus.surface_distance );
   holo_venus.scale.multiplyScalar( venus_scale );
   holo_venus.position.multiplyScalar( distance_scale * 5 ).add( new THREE.Vector3( 0, 0.1, 0) );
   holo_venus.click = ()=>{ screenplay.actions.warp_to( venus ) };
   screenplay.interactives.push( holo_venus );
   starship.OpsStation.add( holo_venus );

   // Mercury
   let mercury = await screenplay.actors.Mercury;
   sys_ve_scene.add( screenplay.actors.Mercury );
   screenplay.interactives.push( screenplay.actors.Mercury );
   screenplay.actives.push( screenplay.actors.Mercury );
   let holo_mercury = screenplay.actors.Mercury.clone( );
   let mercury_scale = 0.02 / ( screenplay.actors.Mercury.surface_distance );
   holo_mercury.scale.multiplyScalar( mercury_scale );
   holo_mercury.position.multiplyScalar( distance_scale * 6 ).add( new THREE.Vector3( 0, 0.1, 0) );
   holo_mercury.click = ()=>{ screenplay.actions.warp_to( screenplay.actors.Mercury ) };
   screenplay.interactives.push( holo_mercury );
   starship.OpsStation.add( holo_mercury );

   // Sun
   let sun = screenplay.actors.Sun;
   sun.light.target = starship;

   sys_ve_scene.add( sun );
   screenplay.actives.push( sun );
   let holo_sun = sun.clone( );
   let sun_scale = 0.04 / ( sun.surface_distance );
   holo_sun.scale.multiplyScalar( sun_scale );
   holo_sun.position.multiplyScalar( distance_scale ).add( new THREE.Vector3( 0, 0.03, 0) );
   holo_sun.click = ()=>{ screenplay.actions.warp_to( sun ) };
   screenplay.interactives.push( holo_sun );
   starship.OpsStation.add( holo_sun );

   sys_ve_scene.add( starship );
   let posi = new THREE.Vector3();
   starship.OpsStation.children[0].getWorldPosition( posi );
   starship.cameras.forEach( function ( cam, ndx ){
     this.set( ndx, cam );
   }, screenplay.cameras );



   // lensflares
   const textureLoader = new THREE.TextureLoader();

   const textureFlare0 = textureLoader.load( 'textures/lensflare/lensflare0.png' );
   const textureFlare3 = textureLoader.load( 'textures/lensflare/lensflare3.png' );

   const lensflare = new Lensflare();
   lensflare.position.copy( sun.light.position );
   lensflare.addElement( new LensflareElement( textureFlare0, 700, 0, sun.light.color ) );
   lensflare.addElement( new LensflareElement( textureFlare3, 60, 0.6 ) );
   lensflare.addElement( new LensflareElement( textureFlare3, 70, 0.7 ) );
   lensflare.addElement( new LensflareElement( textureFlare3, 120, 0.9 ) );
   lensflare.addElement( new LensflareElement( textureFlare3, 70, 1 ) );
   sun.light.lensflare = lensflare;
   sun.light.add( lensflare );
   sys_ve_scene.add( sun.light );
   //screenplay.actors.Sun.visible = true;

   screenplay.active_cam = screenplay.cameras.get( '3rdShipCam' );
   document.title = 'Outside Ship | Wethe.Network';
   director.emit( next_emit, dictum_name );
  };

  // HomeDome //
  goto_dome = async ( screenplay, dictum_name, next_emit, director )=>{}
  enter_dome = async ( screenplay, dictum_name, next_emit, director )=>{}
  progress_dome = async ( screenplay, dictum_name, ndx  )=>{}
  dome_failure = async ( screenplay, dictum_name, ndx  )=>{}
  dome_loaded = async ( screenplay, dictum_name, next_emit, director )=>{}

  // TradeStation //
  goto_station = async ( screenplay, dictum_name, next_emit, director )=>{}
  enter_station = async ( screenplay, dictum_name, next_emit, director )=>{}
  progress_station = async ( screenplay, dictum_name, ndx  )=>{}
  station_failure = async ( screenplay, dictum_name, ndx  )=>{}
  station_loaded = async ( screenplay, dictum_name, next_emit, director )=>{}

  constructor( react_app ){
    super();
    this.react_app = react_app;
  }
}

export { SceneDirections }
