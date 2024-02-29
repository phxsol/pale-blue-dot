import * as THREE from 'three';

import { EventEmitter } from 'events';
import { CSS3DRenderer, CSS3DObject } from '../lib/CSS3DRenderer.js';

// The ScreenDirector //
/* ------------------
  Aware of the environment ( Window, Document, User Interface API, SceneAssets ), to the extent necessary to create a seemlessly animated web interface.
  Scenes are complex, orchestrated animations which are driven by the ScreenDirector to create a rich user experience for webapp interactions.
  Use this to prepare the user-interface for interaction, then to drive the interaction through each entry in your site's manifesto.
*/
class ScreenDirector{
  active_dictum = 0;  // State Awareness Variable
  dictum_index = [];  // Track the dictums by name in an array for efficient iteration control.
  director;
  start = function(){

    this.screenplay.animate();  // Kickstart the animation loop
    this.director.emit('first_dictum');  // Begin the Manifesto

  }

  Add_Dictum = function( dictum_name, dictum ){

    // EventHandler <dictum_name>: When fired, executes the designated functions in order, reporting the progress to the <dictum_name>_progress eventhandler.
    this.director.on( `${dictum_name}`, async ()=>{
      this.manifesto[ dictum_name ].directions.on_enter( this.screenplay, dictum_name, `${dictum_name}_entered`, this.director );
    });
    this.director.on( `${dictum_name}_entered`, async ()=>{
      this.manifesto[ dictum_name ].directions.on_idle( this.screenplay, dictum_name, `${dictum_name}_idling`, this.director );
    });

    // Run the dictum logic
    let logic_count = 0;
    if(!dictum.logic) throw new Error('Dictums must be logical.  Declare a void function at least.');   // Feedback for the Dictum writers.
    logic_count = dictum.logic.length;
    this.director.on( `${dictum_name}_idling`, async ()=>{
      dictum.logic[ 0 ]( this.screenplay, dictum_name, this.director, 0 );
    });

    this.director.on( `${dictum_name}_progress`, async ( dictum_name, ndx )=>{

      let dictum = this.manifesto[ dictum_name ];
      dictum.directions.on_progress( this.screenplay, dictum_name, ndx );
      dictum.progress.completed++;
      dictum.progress.passed++;
      if( dictum.progress.completed >= dictum.logic.length ) {
        this.director.emit( `${dictum_name}_end`, dictum_name );
      } else {
        this.director.emit( `next_logic`, dictum_name, ++ndx );
      }

    } );

    this.director.on( `${dictum_name}_failure`, async ( dictum_name, ndx )=>{

      let dictum = this.manifesto[dictum_name];
      dictum.directions.on_failure( this.screenplay, dictum_name, ndx );
      dictum.progress.completed++;
      dictum.progress.failed++;
      if( dictum.progress.completed === dictum.logic.length ) {
        this.director.emit( `${dictum_name}_end`, dictum_name );
      } else {
        this.director.emit( `next_logic`, dictum_name, ++ndx );
      }

    } );

    this.director.on( `${dictum_name}_end`, async ( dictum_name )=>{

      let dictum = this.manifesto[dictum_name];
      let next_emit = (dictum.progress.failed > 0) ? 'fail_dictum' : `confirm_dictum`;
      this.manifesto[ dictum_name ].directions.on_end( this.screenplay, dictum_name, next_emit, this.director ) ;
    } );
  }

  // screenplay: This object contains the lights, cameras, ations... actors, directions, etc... to run the scene.
  // manifesto: The orchestrated performance of an animated THREE.js environment and the workflow of a web app.
  // start_now: Whether to begin immediately once the ScreenDirector has been generated, or to wait for the .start() method call.
  constructor( screenplay, manifesto, start_now ){
    this.director = new EventEmitter();

    this.screenplay = screenplay;
    this.manifesto = manifesto;

    // Iterate through the provided dictums, generating event-handling pathways to progress through the manifesto.
    for (const dictum_name in this.manifesto) {

      this.dictum_index.push(dictum_name);
      let dictum = this.manifesto[dictum_name];

      this.Add_Dictum( dictum_name, dictum );

    }

    /* Static, Internal Event Functions */
    // EventHandler 'first_dictum': When fired, begins the process by setting the ScreenDirector to the first dictum, then emitting that event immediately.
    this.director.on('first_dictum', async ()=>{

      let dictum_name = this.dictum_index[ 0 ];
      this.director.emit( `${dictum_name}`, dictum_name );

    });

    // EventHandler 'next_dictum': When fired, increments the ScreenDirector to the next dictum, or past; emitting either that <dictum_name> event, or the 'manifesto_compete' event respectively.
    this.director.on('next_dictum', async ()=>{

      this.active_dictum++;
      let dictum_name = this.dictum_index[ this.active_dictum ];
      if( this.active_dictum < this.dictum_index.length ){
        this.director.emit( `${dictum_name}`, dictum_name );
      } else {
        this.director.emit( 'manifesto_complete' );
      }

    });

    // EventHandler 'next_dictum': When fired, increments the ScreenDirector to the next dictum, or past; emitting either that <dictum_name> event, or the 'manifesto_compete' event respectively.
    this.director.on('next_logic', async ( dictum_name, ndx )=>{

      let dictum = this.manifesto[ dictum_name ];
      dictum.logic[ ndx ]( this.screenplay, dictum_name, this.director, ndx );

    });

    // EventHandler 'prev_dictum': When fired, decrements the ScreenDirector to the previous dictum, until the first; emitting either that <dictum_name> event, or the 'first_dictum' event respectively.
    this.director.on('prev_dictum', async ()=>{

      this.active_dictum--;
      let dictum_name = this.dictum_index[ this.active_dictum ];
      if(this.active_dictum > 0){
        this.director.emit( `${dictum_name}`, dictum_name );
      } else {
        this.director.emit( 'first_dictum' );
      }

    });

    // EventHandler 'next_dictum': When fired, increments the ScreenDirector to the next dictum, or past; emitting either that <dictum_name> event, or the 'manifesto_compete' event respectively.
    this.director.on('goto_dictum', async ( dictum_name )=>{

      this.active_dictum = this.dictum_index.indexOf( dictum_name );
      dictum_name = this.dictum_index[ this.active_dictum ];
      this.director.emit( `${dictum_name}`, dictum_name );

    });

    // EventHandler 'confirm_dictum': When fired, the ScreenDirector marks this dictum as confirmed, signalling that all dictums succeeded in their task.
    //                                Next, the 'next_dictum' event is fired to continue the production.
    this.director.on('confirm_dictum', async ( dictum_name )=>{

      this.manifesto[ dictum_name ].result.complete = true;
      this.director.emit('next_dictum');

    });

    // EventHandler 'fail_dictum':  When fired, the ScreenDirector marks this dictum as failed, signalling that one or more dictums have not failed in their task.
    //                              Next, the 'next_dictum' event is fired to continue the production.
    this.director.on('fail_dictum', async ( dictum_name )=>{

      if(this.manifesto[dictum_name].result.fok) this.director.emit('next_dictum');
      else this.director.emit(`${dictum_name}`, dictum_name);

    });

    // EventHandler 'manifesto_compete': When fired, the ScreenDirector takes a bow... idles to wait for more... or even closes if so desired.
    this.director.on('manifesto_complete', async function(){

      // TODO: Take a bow | clean up after yourself.

    });

    this.director.on('error', async function(){}); /* Best Practice: Node exits if not declared and an unhandled 'error' event is thrown. */

    // Kick off the first dictum now that initialization has completed.
    if(start_now) this.start();

  }
}

// Screenplay //
/* ----------
  As one might read a screenplay for a production in real-life, the ScreenDirector may learn the Screenplay provided to know how to progress the scene in tandem
  with the user interface's workflow, referred to as the Manifesto.  The Screenplay owns the SceneAssets which it will be referring to during run-time, as well as
  the SceneDirections which tell them what to be doing.
*/
class Screenplay{
  ENTIRE_SCENE = 0;
  CAN_SAVE; SHOULD_SAVE;
  activePipGUID = 0;
  active_cam; ui_cam; user_cam;
  sys_ve_scene; sys_ui_scene;
  page_ve_scene; page_ui_scene;
  sys_ve_renderer; sys_ui_renderer; page_ve_renderer; page_ui_renderer;
  sys_ve_post; sys_ui_post; page_ve_post; page_ui_post;
  sys_ve_composer = false; sys_ui_composer = false; page_ve_composer = false; page_ui_composer = false;
  clock; delta = 0; fps; frame_delta = 0; heartbeat_delta = 0; qm_delta = 0; m_delta = 0; qh_delta = 0; hh_delta = 0; h_delta = 0; qd_delta = 0; hd_delta = 0; d_delta = 0;
  raycaster; mouse;
  stop_me;
  VIEW; aspect; major_dim; minor_dim;height;width;
  beat = ( delta )=>{
    const beat_delta = delta;
    this.heartbeat_delta += beat_delta;
    this.qm_delta += beat_delta;
    this.m_delta += beat_delta;
    this.qh_delta += beat_delta;
    this.hh_delta += beat_delta;
    this.h_delta += beat_delta;
    this.qd_delta += beat_delta;
    this.hd_delta += beat_delta;
    this.d_delta += beat_delta;
    if ( this.heartbeat_delta  >= this.heartbeat_interval ) {
      const next_delta = this.heartbeat_delta % this.heartbeat_interval;
      this.heartbeat( this.heartbeat_delta );
      this.heartbeat_delta = next_delta;
      console.log( 'beat.. next @ ' + next_delta + 'latest delta: ' + delta );
    }
    if ( this.qm_delta  >= this.qm_interval ) {
      const next_delta = this.qm_delta % this.qm_interval;
      this.poller.quarter_minute( this.qm_delta, 2 );
      this.qm_delta = next_delta;
      console.log( 'quarter_minute.. next @ ' + next_delta + 'latest delta: ' + delta );
    }
    if ( this.m_delta  >= this.m_interval ) {
      const next_delta = this.m_delta % this.m_interval;
      this.poller.minute( this.m_delta, 3 );
      this.m_delta = next_delta;
      console.log( 'minute.. next @ ' + next_delta + 'latest delta: ' + delta );
    }
    if ( this.qh_delta  >= this.qh_interval ) {
      const next_delta = this.qh_delta % this.qh_interval;
      this.poller.quarter_hour( this.qh_delta, 4 );
      this.qh_delta = next_delta;
      console.log( 'quarter_hour.. next @ ' + next_delta + 'latest delta: ' + delta );
    }
    if ( this.hh_delta  >= this.hh_interval ) {
      const next_delta = this.hh_delta % this.hh_interval;
      this.poller.half_hour( this.hh_delta, 5 );
      this.hh_delta = next_delta;
      console.log( 'half_hour.. next @ ' + next_delta + 'latest delta: ' + delta );
    }
    if ( this.h_delta  >= this.h_interval ) {
      const next_delta = this.h_delta % this.h_interval;
      this.poller.hour( this.h_delta, 6 );
      this.h_delta = next_delta;
      console.log( 'hour.. next @ ' + next_delta + 'latest delta: ' + delta );
    }
    if ( this.qd_delta  >= this.qd_interval ) {
      const next_delta = this.qd_delta % this.qd_interval;
      this.poller.quarter_day( this.qd_delta, 7 );
      this.qd_delta = next_delta;
      console.log( 'quarter_day.. next @ ' + next_delta + 'latest delta: ' + delta );
    }
    if ( this.hd_delta  >= this.hd_interval ) {
      const next_delta = this.hd_delta % this.hd_interval;
      this.poller.half_day( this.hd_delta, 8 );
      this.hd_delta = next_delta;
      console.log( 'half_day.. next @ ' + next_delta + 'latest delta: ' + delta );
    }
    if ( this.d_delta  >= this.d_interval ) {
      const next_delta = this.d_delta % this.d_interval;
      this.poller.day( this.d_delta, 9 );
      this.d_delta = next_delta;
      console.log( 'day.. next @ ' + next_delta + 'latest delta: ' + delta );
    }
  }
  animate = ()=>{
    requestAnimationFrame( this.animate );
    const delta = this.clock.getDelta();
    this.beat( delta );
    this.delta += delta;
    if ( this.delta  >= this.frame_interval ) {
      let next_delta = this.delta % this.frame_interval;
      this.update( this.delta, 0 );
      this.direct( this.delta );

      this.render_sys_ve();
      this.render_sys_ui();
      this.render_page_ve();
      this.render_page_ui();
      this.delta = next_delta;
    }
  }
  controls = {};

  // Grouping Arrays... Add models here to isolate unrelated items during processing (ie. Click / Tap events)
  updatables_cache;  // Place the parameters for the like-named update routine into this Map for access during each run.
  updatables;   // Place objects which must be updated continuously... must have update()
  heartbeats; // Place objects which must be updated at a heartbeat pace... must have update()
  polling;  // Place objects here which must be updated at longer polling intervals... must have update(), must use integral interval value.

  resizables;   // Place objects here which must readjust when the screen is resized... must have resize()
  actives = [];
  interactives = [];  // Populate this with the rendered objects which the user may interact with... improving the efficiency of the Raycaster.

  actors = {};  // Actors are SceneAsset3D objects which are defined with callable directions, whether cosmetic or complex routines, called by the ScreenDirector during Animate().

  // Standard-Issue Hollywood Magic Makers
  lights = {};  // Any scene needs light to be... seen.
  cameras; // Multiple cameras are able to be defined, thus called upon by the ScreenDirector.
  actions = {}; // Scene-wide actions are defined here... ie. "Camera Shake", "Perspective Morph", "Scene Cut Transitions".

  stage = {}; // This is the placeholder for the stage if created... though a stage is never required.
  backgroundScenery = {};  // This is the placeholder for the background if created... though it is also not required.
  sceneBackground = {}  // Use this to create a Three.CubeCamera as a skybox... be sure to update the skybox camera during the render phase.

  // Rendering & Update Logic
  update = ( delta )=>{
    this.updatables.forEach(( updatable, name )=>{
      if ( updatable.update ) updatable.update( delta, 0 );
    });
  }

  heartbeat = ( delta )=>{
    this.heartbeats.forEach(( heartbeat, name )=>{
      if ( heartbeat.update ) heartbeat.update( delta, 1 );
    });
  }

  poller = {
    quarter_minute: ( delta )=>{
      this.polls.quarter_minute.forEach(( poll, name )=>{
        try { poll.update( delta, 2 ) } catch(e) { console.error( e ) };
      });
    },
    minute: ( delta )=>{
      this.polls.minute.forEach(( poll, name )=>{
        try { poll.update( delta, 3 ) } catch(e) { console.error( e ) };
      });
    },
    quarter_hour: ( delta )=>{
      this.polls.quarter_hour.forEach(( poll, name )=>{
        try { poll.update( delta, 4 ) } catch(e) { console.error( e ) };
      });
    },
    half_hour: ( delta )=>{
      this.polls.half_hour.forEach(( poll, name )=>{
        try { poll.update( delta, 5 ) } catch(e) { console.error( e ) };
      });
    },
    hour: ( delta )=>{
      this.polls.hour.forEach(( poll, name )=>{
        try { poll.update( delta, 6 ) } catch(e) { console.error( e ) };
      });
    },
    quarter_day: ( delta )=>{
      this.polls.quarter_day.forEach(( poll, name )=>{
        try { poll.update( delta, 7 ) } catch(e) { console.error( e ) };
      });
    },
    half_day: ( delta )=>{
      this.polls.half_day.forEach(( poll, name )=>{
        try { poll.update( delta, 8 ) } catch(e) { console.error( e ) };
      });
    },
    day: ( delta )=>{
      this.polls.day.forEach(( poll, name )=>{
        try { poll.update( delta, 9 ) } catch(e) { console.error( e ) };
      });
    }

  }

  direct = ( delta )=>{
    this.actives.forEach( ( active, name )=>{
      active.directions.forEach( ( direction, name )=>{
        direction( delta );
      } );
    } );
  }

  render_sys_ve = ()=>{
    if( this.sys_ve_post && this.sys_ve_composer ){
      this.sys_ve_composer.render();
    } else {
      if( this.user_cam.user_control ){
        this.sys_ve_renderer.render( this.sys_ve_scene, this.user_cam );
      } else {
        this.sys_ve_renderer.render( this.sys_ve_scene, this.active_cam );
      }
  	}
  }

  render_sys_ui = ()=>{
    if(this.sys_ui_post && this.sys_ui_composer){
      this.sys_ui_composer.render();
    } else{
      this.sys_ui_renderer.render( this.sys_ui_scene, this.ui_cam );
  	}
  }

  render_page_ve = ()=>{
  	if( this.page_ve_post && this.page_ve_composer ){
      this.page_ve_composer.render();
    } else {
      if( this.user_cam.user_control ){
        this.page_ve_renderer.render( this.page_ve_scene, this.user_cam );
      } else {
        this.page_ve_renderer.render( this.page_ve_scene, this.active_cam );
      }
  	}
  }

  render_page_ui = ()=>{
    if( this.page_ui_post && this.page_ui_composer ){
      this.page_ui_composer.render();
    } else {
  		this.page_ui_renderer.render( this.page_ui_scene, this.ui_cam );
  	}
  }

  // Handle Viewscreen Changes
  resize = ()=> {
    this.VIEW.aspect = window.innerWidth / window.innerHeight;
    this.VIEW.major_dim = Math.max( this.height, this.width );
    this.VIEW.minor_dim = Math.min( this.height, this.width );
    this.aspect = window.innerWidth / window.innerHeight;
    this.height = window.innerHeight;
    this.width = window.innerWidth;
    this.active_cam.aspect = this.aspect;
    this.ui_cam.aspect = this.aspect;
    this.sys_ve_renderer.setSize( this.width, this.height );
    this.sys_ui_renderer.setSize( this.width, this.height );
    this.page_ve_renderer.setSize( this.width, this.height );
    this.page_ui_renderer.setSize( this.width, this.height );
    this.major_dim = Math.max( this.height, this.width );
    this.minor_dim = Math.min( this.height, this.width );
    this.active_cam.updateProjectionMatrix();
    this.ui_cam.updateProjectionMatrix();

    this.resizables.forEach(( resizable, name )=>{
      if ( resizable.resize ) resizable.resize( this.width, this.height );
    });
  }

  // GUI Interactions
  raycaster; mouse;
  onPointerDown = ( event )=> {

    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    // TODO: Redo this for the new camera setup
    this.raycaster.setFromCamera( this.mouse, this.active_cam );
    const intersects = (this.interactives && this.interactives.length > 0) ? this.raycaster.intersectObjects( this.interactives, false ) : [];
    if ( intersects.length > 0 ) {

      // Capture the first clicked target
      const object = intersects[ 0 ].object;
      let pos = object.position;
      if( object.click ) object.click(); // Fire the object's internal click handler if any.

    }

  }
  constructor( ){

    this.CAN_SAVE = ( typeof(Storage) !== "undefined" && typeof( window.indexedDB ) !== "undefined" ) || false;
    if( this.CAN_SAVE ){
      let should = localStorage.getItem("should_save") || true; // Defaults to true, false must be explicitly saved to take affect.
      this.SHOULD_SAVE = should;
    } else {
      this.SHOULD_SAVE = false;
    }

    this.VIEW = {
      fov: 45,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 100000000000000,
      major_dim: Math.max( window.innerWidth, window.innerHeight ),
      minor_dim: Math.min( window.innerWidth, window.innerHeight )
    };


    // Display Dimensions
    this.major_dim = Math.max( window.innerHeight, window.innerWidth );
    this.minor_dim = Math.min( window.innerHeight, window.innerWidth );
    this.aspect = window.innerWidth / window.innerHeight;
    this.height = window.innerHeight;
    this.width = window.innerWidth;

    // Internal Clock
    // TODO: Set this to a configuration value
    this.clock = new THREE.Clock();
    this.delta = 0;
    let fps = this.fps = 60;
    this.frame_interval = 1 / fps;
    let second = 1;
    this.heartbeat_interval = second;
    this.qm_interval = 15 * second;
    let minute = 60 * second;
    this.m_interval = minute;
    this.qh_interval = 15 * minute;
    this.hh_interval = 30 * minute;
    let hour = 60 * minute;
    this.h_interval = hour;
    this.qd_interval = 6 * hour;
    this.hd_interval = 12 * hour;
    let day = 24 * hour;
    this.d_interval = day;

    // Mouse Interaction Capture
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.updatables_cache = new Map();
    this.updatables = new Map();
    this.heartbeats = new Map();
    this.polls = {
      quarter_minute: new Map(),
      minute: new Map(),
      quarter_hour: new Map(),
      half_hour: new Map(),
      hour: new Map(),
      quarter_day: new Map(),
      half_day: new Map(),
      day: new Map()
    }

    this.cameras = new Map();
    this.resizables = new Map();
    this.active_cam = false;
    this.user_cam = false;

    this.sys_ve_scene = new THREE.Scene();
    this.sys_ve_scene.updates = {
      update: ()=>{},
      cache: {}
    };
    this.updatables.set('sys_ve_scene', this.sys_ve_scene.updates );

    this.sys_ui_scene = new THREE.Scene();
    this.sys_ui_scene.updates = {
      update: ()=>{},
      cache: {}
    };
    this.updatables.set('sys_ui_scene', this.sys_ui_scene.updates );

    this.page_ve_scene = new THREE.Scene();
    this.page_ve_scene.updates = {
      update: ()=>{},
      cache: {}
    };
    this.updatables.set('page_ve_scene', this.page_ve_scene.updates );

    this.page_ui_scene = new THREE.Scene();
    this.page_ui_scene.updates = {
      update: ()=>{},
      cache: {}
    };
    this.updatables.set('page_ui_scene', this.page_ui_scene.updates );


    // System Virtual Environment Renderer
    const svr = this.sys_ve_renderer = new THREE.WebGLRenderer( { antialias: true, logarithmicDepthBuffer: true} );
    svr.shadowMap.enabled = true;
		svr.toneMapping = THREE.ACESFilmicToneMapping;
		svr.toneMappingExposure = 1;

    svr.setSize( window.innerWidth, window.innerHeight );
    svr.setPixelRatio( window.devicePixelRatio ? window.devicePixelRatio : 1 );
    // Turn on VR support
    svr.xr.enabled = true;
    let svc = svr.domElement;
    svc.id = 'sys_ve_canvas';
    document.body.appendChild( svc );

    // System User Interface Renderer
    const sur = this.sys_ui_renderer = new CSS3DRenderer( );
    sur.setSize( window.innerWidth, window.innerHeight );
    let suc = sur.domElement;
    suc.id = 'sys_ui_canvas';
    document.body.appendChild( suc );

    // Page Virtual Environment Renderer
    const pvr = this.page_ve_renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true, outputEncoding: THREE.sRGBEncoding } );
    pvr.setSize( window.innerWidth, window.innerHeight );
    pvr.setPixelRatio( window.devicePixelRatio ? window.devicePixelRatio : 1 );
    pvr.toneMapping = THREE.ACESFilmicToneMapping;
    pvr.toneMappingExposure = 0.5;
    // Turn on VR support
    pvr.xr.enabled = true;
    let pvc = pvr.domElement;
    pvc.id = 'page_ve_canvas';
    document.body.appendChild( pvc );

    // Page User Interface Renderer
    const pur = this.page_ui_renderer = new CSS3DRenderer( );
    pur.setSize( window.innerWidth, window.innerHeight );
    let puc = pur.domElement;
    puc.id = 'page_ui_canvas';
    document.body.appendChild( puc );


    // Listen to environmental changes, adjust accordingly.
    window.addEventListener( 'pointerdown', this.onPointerDown );  // This is the canvas raycast handler
    window.addEventListener( 'resize', this.resize, { capture: true } );
  }
}

// SceneAsset3D //
/* ------------
  In order to optimize the Animate() phase of the ScreenPlay, SceneAsset3D objects own the directions they will be performing... to be called on-demand by the ScreenDirector.
  Analogous to an actor in real-life learning their part of the production... their Director then simply calls upon them to perform it when the time comes.
*/
class SceneAsset3D extends THREE.Object3D{
  directions;  // Override this with a custom set of functions to be called by the ScreenDirector during the Animate() run of the Screenplay.
  click = ()=>{};

  constructor( obj3D = new THREE.Object3D() ){
    obj3D.directions = new Map();
    return obj3D;
  }
}

// CSS3DAsset //
/* ------------
  In order to optimize the Animate() phase of the ScreenPlay, CSS3DAsset objects own the directions they will be performing... to be called on-demand by the ScreenDirector.
  Analogous to an actor in real-life learning their part of the production... their Director then simply calls upon them to perform it when the time comes.
*/
class CSS3DAsset extends CSS3DObject{
  directions;  // Override this with a custom set of functions to be called by the ScreenDirector during the Animate() run of the Screenplay.

  constructor( element ){
    let css3DObj = new CSS3DObject( element )
    css3DObj.directions = new Map();
    return css3DObj;
  }
}

class SceneTransformation{
  update = ()=>{}; // or Function()... depends on what you need the 'this' to refer to.
  cache = {}; // This persists beyond each run of the .update() during render... holding the values.
  post = ()=>{};  // same here
  reset = ()=>{};

  constructor( params ){

		this.update = params.update;
		this.cache = params.cache;
		this.post = params.post;
		this.reset = params.reset;

		// Migrate the engine functions into the base SceneTransformation object, for access to 'this'.
		for (const func in params) {
		  if (Object.hasOwn(params, func)) {
				if (func=="update" || func=="cache" || func=="post" || func=="reset" ){}
				else{
					this[func]=params[func];
				}
		  }
		}
  }
}

// SceneDirections //
/* ---------------
  Directions are declared as child functions of this object upon instantiation... and are defined entirely by the user.
  // NOTE: Without any standardized functionality to declare, and no run-time construction requirements, a commented-out example is necessary to understand the expected syntax.
*/
class SceneDirections{
  //  Example Declaration Template //
  /*  ----------------------------

      enter_splash = async (screenplay)=>{
        --> Reveal Splash Display... make it look nice.
      };
      progress_splash = async (scene)=>{
        --> Show that progress has been made... simple feedback is all.
      };
      idle_on_splash = async (scene)=>{
        --> Do this while waiting for the user to confirm and continue on... should prompt for interaction
      };
      end_splash = async (scene)=>{
        --> Prepare the scene to begin the next step... make the splash disappear.
      };
      ready_for_anything = async (scene)=>{
        --> Lights up, scenery set... ready to do something!  Happy Directing, and 'break a leg'!
      };

  */
}

// Workflow //
/* --------
  This is where the application logic is located, to be called by the ScreenDirector as defined by the Manifesto.
  // NOTE: Without any standardized functionality to declare, and no run-time construction requirements, a commented-out example is necessary to understand the expected syntax.
*/
class Workflow{



  constructor(){
  }
}

// Dictum //
/* ------
  The formal representation for a set of directions to coordinate alongside the logic algorithms of the WorkFlow.
  Tracking the success or failure of the Dictum is included within on construction... defining what to do upon each outcome.
*/
class Dictum{

  // logic: Passed on by the Manifesto from it's own construction
  // directions: JSON with functions to run for:
  //    on_enter, on_idle, on_progress, on_failure, on_end.
  constructor( logic, directions, okay_to_fail ){
    this.logic = logic;
    this.directions = directions;

    this.result = {
      fok: okay_to_fail
    }
    this.progress = {
      completed: 0,
      failed: 0,
      passed: 0
    };

  }
}

// Manifesto //
/* ---------
  Literally a public declaration of intentions, this object is knit together by you ( the developer ), using the instantiated SceneDirections & Workflow objects.
*/
class Manifesto{
  // NOTE: Though this constructor is not implemented, it is relevent to keep this for an explicit understanding of what is expected by the developer employing this solution.
  constructor( scene_directions, workflow ){}
}


export { ScreenDirector, Screenplay, SceneAsset3D, CSS3DAsset, SceneTransformation, SceneDirections, Workflow, Dictum, Manifesto  };
