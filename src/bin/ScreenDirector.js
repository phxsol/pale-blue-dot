import * as THREE from 'three';
import { EventEmitter } from 'events';
import { CSS3DRenderer } from '../lib/CSS3DRenderer.js';

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

  // GUI Interactions
  raycaster; mouse;
  onPointerDown = ( event )=> {

    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    this.raycaster.setFromCamera( this.mouse, this.screenplay.active_cam );
    const intersects = (this.screenplay.interactives && this.screenplay.interactives.length > 0) ? this.raycaster.intersectObjects( this.screenplay.interactives, false ) : [];
    if ( intersects.length > 0 ) {

      // Capture the first clicked target
      const object = intersects[ 0 ].object;
      let pos = object.position;
      object.click(); // Fire the object's internal click handler if any.

    }
  }

  // screenplay: This object contains the lights, cameras, ations... actors, directions, etc... to run the scene.
  // manifesto: The orchestrated performance of an animated THREE.js environment and the workflow of a web app.
  // start_now: Whether to begin immediately once the ScreenDirector has been generated, or to wait for the .start() method call.
  constructor( screenplay, manifesto, start_now ){
    this.director = new EventEmitter();

    // Listen to environmental changes, adjust accordingly.
    window.addEventListener( 'pointerdown', this.onPointerDown );
    window.addEventListener( 'resize', this.resize, { capture: true } );

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.screenplay = screenplay;
    this.manifesto = manifesto;

    // Iterate through the provided dictums, generating event-handing pathways to progress through the manifesto.
    for (const dictum_name in this.manifesto) {

      this.dictum_index.push(dictum_name);
      let dictum = this.manifesto[dictum_name];

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
      for( let ndx=0; ndx<logic_count;ndx++ ){
        this.director.on( `${dictum_name}_idling`, async ()=>{
          dictum.logic[ndx]( this.screenplay, dictum_name, this.director, ndx )
        });
      }

      this.director.on( `${dictum_name}_progress`, async ( dictum_name, ndx )=>{

        let dictum = this.manifesto[ dictum_name ];
        dictum.directions.on_progress( this.screenplay );
        dictum.progress.completed++;
        dictum.progress.passed++;
        if( dictum.progress.completed === dictum.logic.length ) {
          this.director.emit( `${dictum_name}_end`, dictum_name );
        }

      } );

      this.director.on( `${dictum_name}_failure`, async ( dictum_name, ndx )=>{

        let dictum = this.manifesto[dictum_name];
        dictum.directions.on_failure( this.screenplay );
        dictum.progress.completed++;
        dictum.progress.failed++;
        if( dictum.progress.completed === dictum.logic.length ) {
          this.director.emit( `${dictum_name}_end`, dictum_name );
        }

      } );

      this.director.on( `${dictum_name}_end`, async ( dictum_name )=>{

        let dictum = this.manifesto[dictum_name];
        let next_emit = (dictum.progress.failed > 0) ? 'fail_dictum' : `confirm_dictum`;
        this.manifesto[ dictum_name ].directions.on_end( this.screenplay, dictum_name, next_emit, this.director ) ;
      } );

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

    // EventHandler 'confirm_dictum': When fired, the ScreenDirector marks this dictum as confirmed, signalling that all dictums succeeded in their task.
    //                                Next, the 'next_dictum' event is fired to continue the production.
    this.director.on('confirm_dictum', async ( dictum_name )=>{

      this.manifesto[dictum_name].result.complete = true;
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
  active_cam;
  scene; ui_scene; renderer; ui_renderer;
  clock; delta; fps; interval; raycaster; mouse;

  animate = ()=>{
    requestAnimationFrame( this.animate );
    this.delta += this.clock.getDelta();
    if (this.delta  > this.interval) {
      this.update( this.delta );
      this.direct( this.delta );
      this.render();
      this.ui_render();
      this.delta = this.delta % this.interval;
    }
  }
  controls = {};

  // Grouping Arrays... Add models here to isolate unrelated items during processing (ie. Click / Tap events)
  updatables;  // Place objects which must have their '.update()' function run during the render phase.
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
      if ( updatable.update ) updatable.update( delta );
    });
  }

  direct = ( delta )=>{
    this.actives.forEach( ( active, name )=>{
      active.directions.forEach( ( direction, name )=>{
        direction( delta );
      } );
    } );
  }

  render = ()=>{
    this.renderer.render( this.scene, this.active_cam );
  }

  ui_render = ()=>{
    this.ui_renderer.render( this.ui_scene, this.active_cam );
  }

  // Handle Viewscreen Changes
  resize = ()=> {
    let aspect = window.innerWidth / window.innerHeight;
    let active_cam = this.active_cam;
    active_cam.aspect = aspect;
    active_cam.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.ui_renderer.setSize( window.innerWidth, window.innderHeight );
  }

  constructor( ){

    // Internal Clock
    // TODO: Set this to a configuration value
    const clock = new THREE.Clock();
    this.clock = clock;
    let delta = 0;
    this.delta = delta;
    let fps = 30;
    let interval = 1 / fps;
    this.interval = interval;

    // Mouse Interaction Capture
    const raycaster = new THREE.Raycaster();
    this.raycaster = raycaster;
    const mouse = new THREE.Vector2();
    this.mouse = mouse;

    this.updatables = new Map();
    this.cameras = new Map();
    this.active_cam = false;
    this.scene = new THREE.Scene();
    this.ui_scene = new THREE.Scene();
    this.scene.updates = {
      update: ()=>{},
      cache: {}
    };
    this.updatables.set('scene', this.scene.updates );

    // Scene Renderer
    const renderer = new THREE.WebGLRenderer( { antialias: true, physicallyCorrectLights: true } );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio( window.devicePixelRatio ? window.devicePixelRatio : 1 );
    let canvas = renderer.domElement;
    document.body.appendChild( canvas );
    this.renderer = renderer;

    // UI Renderer
    const ui_renderer = new CSS3DRenderer( );
    ui_renderer.setSize( window.innerWidth, window.innerHeight );
    let ui_canvas = ui_renderer.domElement;
    ui_canvas.style['background-color'] = 'transparent';
    ui_canvas.style.position = 'fixed';
    document.body.appendChild( ui_canvas );
    this.ui_renderer = ui_renderer;
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
    obj3D.click = ()=>{};
    return obj3D;
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


export { ScreenDirector, Screenplay, SceneAsset3D, SceneDirections, Workflow, Dictum, Manifesto  };
