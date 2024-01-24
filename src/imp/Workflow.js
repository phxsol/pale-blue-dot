// Screen Director Reference
import { Workflow as _Workflow, SceneAsset3D, CSS3DAsset, SceneTransformation } from '../bin/ScreenDirector.js';
// Component Library Reference
import { ErrorBoundary, GlyphScanner, RoomOfARequiredNature, PostClassified, PostServices, PostCatalog, PostCalendar, PostContacts, WeTheMenu, WeTheHeader, ViewScreenDisplay } from '../components/wethe_core.js';
// React Module Reference
import { createRef, useState, useEffect, useRef, Component } from 'react';
import ReactDOM from 'react-dom/client';
// Node Module Reference
import GUI from 'lil-gui';
import { Peer } from "peerjs";

import * as THREE from 'three';
// Support Library Reference
import { OrbitControls } from '../lib/OrbitControls.js';
import { FirstPersonControls } from '../lib/FirstPersonControls.js';
import { FlyControls } from '../lib/FlyControls.js';
import { TrackballControls } from '../lib/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from '../lib/CSS3DRenderer.js';
import { GLTFLoader } from '../lib/GLTFLoader.js';
import { GLTFExporter } from '../lib/GLTFExporter.js';

class VerifyCapabilitiesModal extends Component {
  test; result_display;
  screenplay;

  displayTestResults(){
    let test_results = this.result_display.cache.test_results = this.state.test_results;
    console.log( test_results );
    this.screenplay.updatables.set( 'test_results', this.result_display );
  }

  constructor( props ){
    super( props );
    this.director = props.director;
    this.screenplay = props.screenplay;
    this.dictum_name = props.dictum_name;
    this.ndx = props.ndx;
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
            this.screenplay.updatables.delete( 'ups_test' );
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
          this.screenplay.updatables.set( 'ups_test', this.test );
        },
        post: ( )=>{
          // Build the Test Results from the captured test data
          let test_results = {};
          test_results.stamps = this.test.cache.stamps;
          let pop_cnt = test_results.stamps.length;
          // Calculate the actual test duration based upon stamp values.
          test_results.time_total = this.test.cache.stamps.reduce( (a,b) => a + b, 0 );
          // Calculate Population Mean & Standard Deviation
          let pop_mean = test_results.time_total / pop_cnt;
          let xi_less_u_2 = this.test.cache.stamps.map( (num)=> { return ( num - pop_mean ) ** 2 } );
          let sum_xi_less_u_2 = xi_less_u_2.reduce( (a,b) => a + b, 0 );
          let mean_of_deviation = sum_xi_less_u_2 / pop_cnt;
          test_results.std_dev = Math.sqrt( mean_of_deviation );
          let test_frames = test_results.test_frames = this.test.cache.stamps.filter( (num)=> { return Math.abs( num - pop_mean ) < Math.abs( mean_of_deviation - pop_mean ) } );
          // Determine the largest and smallest tick durations, or stamp values.
          let test_pop_cnt = test_frames.length;
          test_results.time = test_frames.reduce( (a,b) => a + b, 0 );
          test_results.max = Math.max( ...test_frames );
          test_results.mean = test_results.time /test_pop_cnt;
          test_results.min = Math.min( ...test_frames );
          // ...then calculate the highest and lowest FPS from them.
          test_results.max_fps = 1/test_results.min;
          test_results.mean_fps = 1/test_results.mean;
          test_results.min_fps = 1/test_results.max;
          let qt = test_results.time / test_results.time_total;
          test_results.score = Math.floor( test_results.mean_fps * qt );

          // ... then post the results to the test_results stack
          this.test.cache.test_results.push( test_results );
          // Should another test be run?  The max is 3 runs before failure is determined.
          let runs_so_far = this.test.cache.test_results.length;
          if ( test_results.score < 15 && runs_so_far < 3 || test_results.max_fps < 20 && runs_so_far < 3 ) {
            this.test.reset();  // Rack 'em up and knock 'em down again!
          } else {
            // Now that has completed, compile the tests ( up to 3 ), for scoring.
            // Default values
            let compiled_test_results = {
              stamps: [],
              time: 0,
              time_total: 0,
              max: -10000,
              mean: 0,
              min: 10000
            };
            // Knit the accumulated test results into a unified source.
            for( let results_ndx = 0; results_ndx < this.test.cache.test_results.length; results_ndx++ ){
              let test_results = this.test.cache.test_results[results_ndx];
              compiled_test_results.stamps.push( ...test_results.test_frames );
              // Calculate the actual test duration based upon stamp values.
              compiled_test_results.time += test_results.test_frames.reduce( (a,b) => a + b, 0 );
              compiled_test_results.time_total += test_results.stamps.reduce( (a,b) => a + b, 0 );
            }
            // Determine the largest and smallest tick durations, or stamp values.
            compiled_test_results.max = Math.max( ...test_results.test_frames );
            compiled_test_results.mean = compiled_test_results.time / test_results.test_frames.length;
            compiled_test_results.min = Math.min( ...test_results.test_frames );

            // ...then calculate the highest and lowest FPS from them.
            compiled_test_results.max_fps = 1/compiled_test_results.min;
            compiled_test_results.mean_fps = 1/compiled_test_results.mean;
            compiled_test_results.min_fps = 1/compiled_test_results.max;
            // Grade the User Performance Statistics
            let cqt = compiled_test_results.time / compiled_test_results.time_total;
            compiled_test_results.score = Math.floor( test_results.mean_fps * cqt );
            // ... then post the results to the console and the test_results stack
            this.setState( { test_results: compiled_test_results, test_complete: true });
            if ( this.screenplay.CAN_SAVE ) localStorage.setItem( "ups_test", JSON.stringify(compiled_test_results) );
            this.displayTestResults();
          }
        }
      });
    this.screenplay.updatables.set( 'ups_test', this.test );
  }
  componentDidMount(){
    document.getElementById( 'root' ).classList.add( 'no_gui' );
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
            this.screenplay.updatables.delete( 'test_results' );
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
            this.director.emit( `${dictum_name}_progress`, dictum_name, ndx );
          }, 3000, this.dictum_name, this.ndx );
        } else {
          setTimeout( ( dictum_name, ndx )=>{
            document.querySelector( '#verify_capabilities .failure').classList.remove( 'hidden' );
            this.director.emit( `${dictum_name}_failure`, dictum_name, ndx );
          }, 3000, this.dictum_name, this.ndx );
        }
      }
    });
  }
  componentWillUnmount(){
    document.getElementById( 'root' ).classList.remove( 'no_gui' );
  }
  render(){
    return (
      <>
        <style>{`
          #verify_capabilities{
            grid-template-rows: auto auto 2fr 1fr;
          }
          #verify_capabilities .pip_title{
            grid-row: 1;
            grid-column: 1 / -1;
          }
          #verify_capabilities .description{
            text-align: center;
            grid-row: 2;
            grid-column: 1 / -1;
          }
          #verify_capabilities .fps_display{
            font-size: 2em;
            grid-row: 3;
            color: var(--b2);
            text-align: center;
            place-self: center;
          }
          #verify_capabilities .success{
            font-size: 2em;
            color: var(--g2);
            grid-row: 4;
            grid-column: 1 / -1;
            text-align: center;
          }
          #verify_capabilities .failure{
            font-size: 2em;
            color: var(--r2);
            grid-row: 4;
            grid-column: 1 / -1;
            text-align: center;
          }
          #verify_capabilities .hidden{
            display: none;
          }
          `}</style>
        <div id="verify_capabilities" className="pip_gui pip_splash">
          <h1 className="pip_title">Verifying Performance Requirements</h1>
          <span className="pip_text description">For a more pleasant experience, a brief performance test must be run.</span>
          <p className="fps_display">
            Active&nbsp;FPS:&nbsp;<span className="speed">{this.state.results_display.speed}</span>
            <br />---------------------<br />
            Standardized&nbsp;FPS:&nbsp;<span className="score">{this.state.results_display.score}</span>
          </p>
          <h3 className="success hidden">Test Successful!</h3>
          <h3 className="failure hidden">Low-FPS Mode Required</h3>
        </div>
      </>
    );
  }
}
function LoginForm( { director, screenplay, dictum_name, ndx }) {
  const [uname, setUname] = useState("");
  const [pword, setPword] = useState("");
  const [saveu, setSaveu] = useState(false);
  const [phase, setPhase] = useState(0);
  const [enter, setEnter] = useState(false);
  const [exit, setExit] = useState(false);
  const panel = useRef();
  const submitButton = useRef(null);
  function cleanup(){
    const root = document.getElementById( "root" );
    root.classList.remove( "no_gui" );
  }

  // Initialization --> Singleton
  useEffect(()=>{
    const root = document.getElementById( "root" );
    root.classList.add( "no_gui" );

    const entrance_transition = new SceneTransformation({
      update: ( delta )=>{
        let cache = entrance_transition.cache;
        if( ++cache.frame <= cache.duration ){
          let progress = cache.frame / cache.duration;
          panel.current.style.scale = progress;

        } else {
          entrance_transition.post( );  // This calls for the cleanup of the object from the scene and the values from itself.
        }
      },
      cache: {
        duration: 15, /* do something in 60 frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        entrance_transition.cache.duration = 15;
        entrance_transition.cache.frame = 0;
        screenplay.updatables.set( 'ResumeUserModal_entrance_transition', entrance_transition );
      },
      post: ( )=>{
        let cache = entrance_transition.cache;
        screenplay.updatables.delete( 'ResumeUserModal_entrance_transition' );
        panel.current.style.transform = `scale(1)`;
      }
    });
    setEnter( entrance_transition );
    const exit_transition = new SceneTransformation({
      update: ( delta )=>{
        let cache = exit_transition.cache;
        if( ++cache.frame <= cache.duration ){
          let progress = 1 - cache.frame / cache.duration;
          panel.current.style.scale = progress;

        } else {
          exit_transition.post( );  // This calls for the cleanup of the object from the scene and the values from itself.
        }
      },
      cache: {
        duration: 15, /* do something in this many frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        exit_transition.cache.duration = 15;
        exit_transition.cache.frame = 0;
        screenplay.updatables.set( 'ResumeUserModal_exit_transition', exit_transition );
      },
      post: ( )=>{
        let cache = exit_transition.cache;
        screenplay.updatables.delete( 'ResumeUserModal_exit_transition' );
        panel.current.style.transform = `scale(0)`;
        director.emit( `${dictum_name}_progress`, dictum_name, ndx );
      }
    });
    setExit( exit_transition );
    screenplay.updatables.set( 'ResumeUserModal_entrance_transition', entrance_transition );

    return cleanup;
  },[]);

  const handleSubmitResumeUser = async ( event ) => {
    event.preventDefault();
    submitButton.disabled = true;
    submitButton.autocomplete = 'off'; // --> Fix for Firefox. It persists the dynamic disabled state without this hack.

    await uname;
    await pword;
    await saveu;
    let login = new Request("/tokens",{
      method:"PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username:uname,
        password:pword,
        saveu:saveu})
      });

    fetch( login ).then( async res => {
      submitButton.disabled = false

      if( res.status >= 100 && res.status <= 199 ){
        alert( 'Hrm... not a clue why you are receiving this response... continuing anonymously.  I guess, log in later?!' );
        screenplay.updatables.set( 'ResumeUserModal_exit_transition', exit );
      }
      if( res.status >= 200 && res.status <= 299 ){
        let _uname = res.headers.get("uname");
        if ( screenplay.CAN_SAVE ) localStorage.setItem( "uname", _uname );
        let _token = res.headers.get("token");
        if ( screenplay.CAN_SAVE ) localStorage.setItem( "token", _token );
        ResumeUser( _uname, _token );
        screenplay.updatables.set( 'ResumeUserModal_exit_transition', exit );
      }
      if( res.status >= 300 && res.status <= 399 ){
        alert( 'Danger!  An unauthorized redirection has occurred with your login credentials... continuing anonymously.');
        screenplay.updatables.set( 'ResumeUserModal_exit_transition', exit );
      }
      if( res.status >= 400 && res.status <= 499 ){
        alert( 'Unauthorized.  Verify the credentials used and retry, or create a new user if you are not yet registered!' );
      }
      if( res.status >= 500 && res.status <= 599 ){
        alert( 'You are disconnected from the WeThe Network... system will continue anonymously.');
        screenplay.updatables.set( 'ResumeUserModal_exit_transition', exit );
      }
    });
  }

  const handleSubmitNewUser = async ( event ) => {
    event.preventDefault();
    submitButton.disabled = true;
    submitButton.autocomplete = 'off'; // --> Fix for Firefox. It persists the dynamic disabled state without this hack.

    await uname;
    await pword;
    let register = new Request("/users",{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: await JSON.stringify({
        username:uname,
        password:pword,
        contactPath:{ email:'sjaycgf@gmail.com'}
      })
    });

    fetch( register ).then( res => {
      submitButton.disabled = false

      if( res.status >= 100 && res.status <= 199 ){
        alert( 'Hrm... not a clue why you are receiving this response... continuing anonymously.  I guess, register later?!' );
        screenplay.updatables.set( 'ResumeUserModal_exit_transition', exit );
      }
      if( res.status >= 200 && res.status <= 299 ){
        let _uname = res.headers.get("uname");
        if ( screenplay.CAN_SAVE ) localStorage.setItem( "uname", _uname );
        let _token = res.headers.get("token");
        if ( screenplay.CAN_SAVE ) localStorage.setItem( "token", _token );
        ResumeUser( _uname, _token );
        screenplay.updatables.set( 'ResumeUserModal_exit_transition', exit );
      }
      if( res.status >= 300 && res.status <= 399 ){
        alert( 'Danger!  An unauthorized redirection has occurred with your login credentials... continuing anonymously.');
        screenplay.updatables.set( 'ResumeUserModal_exit_transition', exit );
      }
      if( res.status >= 400 && res.status <= 499 ){
        alert( 'Unauthorized Registration... did you mean to log in instead?' );
      }
      if( res.status >= 500 && res.status <= 599 ){
        alert( 'You are disconnected from the WeThe Network... system will continue anonymously.');
        screenplay.updatables.set( 'ResumeUserModal_exit_transition', exit );
      }
    });
  }

  const handleAnonymousUser = async ( event ) => {

    screenplay.updatables.set( 'ResumeUserModal_exit_transition', exit );
  }

  const changeInputs = async ( event, which_input ) => {
    switch(which_input){
      case 1:
        setUname(event.target.value);
        break;

      case 2:
        setPword(event.target.value);
        break;

      case 3:
        setSaveu(!saveu);
        break;
    }
  }

  switch(phase){
    case 0: // Top-Level Options
      return (
        <div ref={ panel } className="pip_gui pip_chat" >
          <h1 className="pip_title">Captain Assignment</h1>
          <span className="ui_side pip_text" style={{ gridRow: 2 }}>
          Greetings Captain.
          </span>
          <span className="ui_side pip_text" style={{ gridRow: 3 }}>What are your orders?</span>
          <div className="user_side pip_text" style={{ gridRow: 25}}>
            <label htmlFor="login_button">Login:</label>
            <input
              name="login_button"
              className="pip_accept"
              type="button"
              value="login"
              onClick={(e) => setPhase( 1 )}/>
              <br />
              <label htmlFor="new_user_button">New Captain:</label>
              <input
              name="new_user_button"
              className="pip_accept"
              type="button"
              value="New"
              onClick={(e) => setPhase( 2 )} />
              <br />
              <label htmlFor="anonymous_button">Anonymously:</label>
              <input
              name="anonymous_button"
              className="pip_cancel"
              type="button"
              value="Anon"
              onClick={(e) => setPhase( 3 )} />
          </div>

        </div>);
      break;

    case 1: // Login Captain

      return (
        <>

        <div ref={ panel } className="pip_gui pip_chat" >
          <h1 className="pip_title">Authorization Required</h1>
          <span className="ui_side pip_text" style={{ gridRow: 2 }}>
          Greetings Captain.
          </span>
          <span className="ui_side pip_text" style={{ gridRow: 3 }}>How do you prefer to be addressed?</span>
          <form onSubmit={handleSubmitResumeUser} className="user_side pip_text" style={{ gridRow: 25}}>
            <label htmlFor="username">User:</label>
            <input
              name="username"
              type="text"
              autoComplete="username"
              value={uname}
              onChange={(e) => changeInputs(e, 1)}

            /><br />
            <label htmlFor="password">Pass:</label>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              value={pword}
              onChange={(e) => changeInputs(e, 2)}
            />
            <br />
            <label htmlFor="submit">Submit:</label>
            <input name="submit" type="submit" value="Go" className="pip_accept" ref={ submitButton } />
            <br />
            <label htmlFor="back">Return:</label>
            <input
              name="back"
              className="pip_cancel"
              style={{ marginLeft: '1rem' }}
              type="button"
              onClick={(e) => setPhase( 0 )} value="Back"/>
            <br />
            <label htmlFor="keep_logged">Keep me logged in:</label>
              <input
                name="keep_logged"
                type="checkbox"
                value={saveu}
                onChange={(e) => changeInputs(e, 3)}
              />
          </form>
        </div>
      </>);
      break;

    case 2: // Register New Captain
      return (
        <>

        <div ref={ panel } className="pip_gui pip_chat" >
          <h1 className="pip_title">New Captain</h1>
          <span className="ui_side pip_text" style={{ gridRow: 2 }}>
          Greetings Captain.
          </span>
          <span className="ui_side pip_text" style={{ gridRow: 3 }}>How do you prefer to be addressed?</span>
          <form onSubmit={handleSubmitNewUser} className="user_side pip_text" style={{ gridRow: 25}}>

          <label htmlFor="username">User:</label>
          <input
            name="username"
            type="text"
            autoComplete="username"
            value={uname}
            onChange={(e) => changeInputs(e, 1)}

          />
          <br />
          <label htmlFor="password">Pass:</label>
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              value={pword}
              onChange={(e) => changeInputs(e, 2)}
            />
          <br />
          <label htmlFor="submit">Submit:</label>
          <input name="submit" type="submit" value="Go" className="pip_accept" ref={ submitButton } />
          <br />
          <label htmlFor="back">Go Back:</label>
          <input
            name="back"
            className="pip_cancel"
            style={{ marginLeft: '1rem' }}
            type="button"
            onClick={(e) => setPhase( 0 )} value="Back"/>
          <br />
          <label htmlFor="keep_logged">Keep me logged in:</label>
            <input
              name="keep_logged"
              type="checkbox"
              value={saveu}
              onChange={(e) => changeInputs(e, 3)}
            />
          </form>
        </div>
      </>);
      break;

    case 3: // Proceed Anonymously
      return (
        <>

          <div ref={ panel } className="pip_gui pip_chat" >
            <h1 className="pip_title">Anonymous Pilot</h1>
            <span className="ui_side pip_text" style={{ gridRow: 2 }}>As you wish.  Welcome pilot!</span>
            <span className="ui_side pip_text" style={{ gridRow: 3 }}>I must inform you that persistant changes will NOT be available to you until you choose to login to a registered Captain's chair.</span>
            <div className="user_side pip_text" style={{ gridRow: 25}}>
              <label>Acknowledge:<input
                name="ack"
                className="pip_accept"
                style={{ marginLeft: '1rem' }}
                type="button"
                onClick={handleAnonymousUser} value="Ok"/></label>
              <br />
              <label>Reconsider:<input
                name="back"
                className="pip_cancel"
                style={{ marginLeft: '1rem' }}
                type="button"
                onClick={(e) => setPhase( 0 )} value="Back"/></label>
            </div>
          </div>
        </>);
      break;

  }
}

// Workflow Implementation
class Workflow extends _Workflow{
  react_app;

  // Hash a sensitive string into a cryptic one
  HashThis = async (toBeHashed, key)=>{
    let crypto;
    try {
      crypto = window.crypto.subtle;
    } catch (err) {
      console.error('crypto support is disabled!');
    }
    if(typeof(toBeHashed) == 'string' && toBeHashed.length > 0){
      let encoder = new TextEncoder();
      let encoded = encoder.encode( toBeHashed );
      let hash = await crypto.sign("HMAC", key, encoded);
      return hash;
    } else {
      return false;
    }
  };
  // [ On-New || !CAN_SAVE ] Test the user's device performance and adjust the app to match.
  test_client = async ( screenplay, dictum_name, director, ndx ) => {
    console.log( 'Workflow.test_client' );
    document.title = 'Workflow.test_client | MySpace';

    // Performance Test the client if untested.
    let performance_results = ( screenplay.CAN_SAVE ) ? localStorage.getItem("ups_test") : false;
    if( typeof(performance_results) === 'undefined' || !performance_results ){


      this.react_app.render( <VerifyCapabilitiesModal director={director} screenplay={screenplay} dictum_name={dictum_name} ndx={ndx}/> );
    } else {
      // TODO: If low performance, switch to lo-fps mode.
      // TODO: Make a 'lo-fps' mode.
      // FORNOW: Move to next dictum.
      director.emit( `${dictum_name}_progress`, dictum_name, ndx );
    }
  };

  tutorial = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.tutorial');
    document.title = 'Workflow.tutorial | MySpace';

    // Performance Test the client if untested.
    let last_shown_tutorial = ( screenplay.CAN_SAVE ) ? localStorage.getItem("last_shown_tutorial") : false;
    if( typeof(last_shown_tutorial) === 'undefined' || !last_shown_tutorial ){

      class UserInstructionModal extends Component {
        constructor(props){
          super(props);
          this.panel = createRef();
          this.onDisplay = true;
          this.entrance_transition = new SceneTransformation({
              update: ( delta )=>{
                let cache = this.entrance_transition.cache;
                if( ++cache.frame <= cache.duration ){
                  let progress = cache.frame / cache.duration;
                  let panel = cache.panel.current;
                  panel.style.scale = progress;

                } else {
                  this.entrance_transition.post( );  // This calls for the cleanup of the object from the scene and the values from itself.
                }
              },
              cache: {
                duration: 15, /* do something in 60 frames */
                frame: 0,
                panel: this.panel,
                manual_control: false,
                og_transition: false
              },
              reset: ()=>{
                this.entrance_transition.cache.duration = 15;
                this.entrance_transition.cache.frame = 0;
                screenplay.updatables.set( 'UserInstructionModal_entrance_transition', this.entrance_transition );
              },
              post: ( )=>{
                let cache = this.entrance_transition.cache;
                let panel = cache.panel.current;
                screenplay.updatables.delete( 'UserInstructionModal_entrance_transition' );
                panel.style.transform = `scale(1)`;
              }
            });
          this.exit_transition = new SceneTransformation({
            update: ( delta )=>{
              let cache = this.exit_transition.cache;
              if( ++cache.frame <= cache.duration ){
                let progress = 1 - cache.frame / cache.duration;
                let panel = cache.panel.current;
                panel.style.scale = progress;

              } else {
                this.exit_transition.post( );  // This calls for the cleanup of the object from the scene and the values from itself.
              }
            },
            cache: {
              duration: 15, /* do something in 60 frames */
              frame: 0,
              panel: this.panel,
              manual_control: false,
              og_transition: false
            },
            reset: ()=>{
              this.exit_transition.cache.duration = 15;
              this.exit_transition.cache.frame = 0;
              screenplay.updatables.set( 'UserInstructionModal_exit_transition', this.exit_transition );
            },
            post: ( )=>{
              let cache = this.exit_transition.cache;
              let panel = cache.panel.current;
              screenplay.updatables.delete( 'UserInstructionModal_exit_transition' );
              panel.style.transform = `scale(0)`;

              director.emit( `${dictum_name}_progress`, dictum_name, ndx );
            }
          });
        }

        componentDidMount(){
          document.getElementById( 'root' ).classList.add( 'no_gui' );
          screenplay.updatables.set( 'UserInstructionModal_entrance_transition', this.entrance_transition );
        }
        componentWillUnmount(){
          document.getElementById( 'root' ).classList.remove( 'no_gui' );
        }
        handleAckClick = ( e )=>{
          if ( screenplay.CAN_SAVE ) localStorage.setItem( "last_shown_tutorial", JSON.stringify( Date.now() ) );
          screenplay.updatables.set( 'UserInstructionModal_exit_transition', this.exit_transition );
        }
        render(){
          return (
            this.onDisplay ?
            <>
              <div style={{ overflow: 'auto'}} id="user_instruction" ref={ this.panel } className="pip_gui pip_chat" >
                <h1 className="pip_title">Wither-to's and Why-for's</h1>
                <span className="introduction pip_text ui_side">
                  Thank you for being here!<br/>
                  Watch your head, so to speak, as this is a work in-progress.<br/><br/>
                  You are welcome to investigate 'under the hood', though the code in your browser is compiled and difficult to traverse.<br/>
                  The full codebase upon which this app is running may be <a href="https://github.com/phxsol/pale-blue-dot" target="_blank">found here on GitHub</a>.<br/>
                </span>
                <span className="user_side" style={{ gridRow: 25}}>
                  <input name="ack_user_instruction" className="pip_continue" type="button" onClick={this.handleAckClick} value="Ok" />
                </span>

              </div>
            </>
            : null
          );
        }
      }

      this.react_app.render( <ErrorBoundary><UserInstructionModal /></ErrorBoundary> );
    } else {
      director.emit( `${dictum_name}_progress`, dictum_name, ndx );
    }



  };
  // Load the WeThe Node System according to the user's preferences
  load_wethe = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.load_wethe');
    document.title = 'Workflow.load_wethe | MySpace';

    //this.react_app.render( <ErrorBoundary><WeTheHeader viewMode="desktop" screenplay={screenplay} /><WeTheMenu screenplay={screenplay} mode="collapsed" /></ErrorBoundary> );
    director.emit( `${dictum_name}_progress`, dictum_name, ndx );
  };
  // Load and resume the user's experience ( @Time-Space Coordinates + difference )
  resume_user = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.resume_user');
    document.title = 'Workflow.resume_user | MySpace';

    const verifyToken = async ( uname, token ) => {
      if( !uname && !token ) return false;

      let resume = new Request("/tokens",{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
          "username": uname.toString(),
          "token": token.toString()
        }
      });

      return await fetch( resume ).then( async res => {
        let status = res.status;
        if(status==200) return {
          valid: true,
          tokens: res.headers.get('token')
        }
        else return false
      });
    }

    let saving = ( screenplay.CAN_SAVE && screenplay.SHOULD_SAVE );
    let validation = false;
    let uname = '';
    let token = '';
    if( saving ){
      uname = ( typeof(localStorage.getItem("uname")) !== 'undefined' ) ? localStorage.getItem("uname") : false;
      token = ( typeof(localStorage.getItem("token")) !== 'undefined' ) ? localStorage.getItem("token") : false;
      validation = await verifyToken( uname, token );
    }
    await validation;
    let auto_resumed = ( validation ) ? validation.valid: false;
    let tokens = ( validation ) ? validation.tokens: false;

    console.log( 'auto_resumed?: ', auto_resumed );
    function ResumeUser( uname, token ){

      let resume = new Request("/a",{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
          "username": uname,
          "token": token
        },
        body: ""
      });
      fetch( resume ).then( async res => {
        if( res.status == 200 ){
          let resume = await res.json();

          // Space-Time Coordination
          let positions = resume.positions;
          let starship_position = new THREE.Vector3( positions.s.p.x, positions.s.p.y, positions.s.p.z );
          screenplay.actors.Starship.position.copy( starship_position );
          let starship_quaternion = new THREE.Quaternion( positions.s.q.x, positions.s.q.y, positions.s.q.z, positions.s.q.w );
          screenplay.actors.Starship.quaternion.copy( starship_quaternion );

          // Permissions Coordination
          // Do an initial check to see what the notification permission state is
          if (Notification.permission === 'denied' || Notification.permission === 'default') {
            // TODO: Request permission if saved to do so... or NOT saved to not ask again.
            // NOTE: As notifications will be useful to most users, a reminder request should be regularly sent out to users saved to Not Ask

          } else {

          }
        }
      });

    }

    if( !auto_resumed ){

      this.react_app.render( <LoginForm director={director} screenplay={screenplay} dictum_name={dictum_name} ndx={ndx} /> );
    } else {
      ResumeUser( uname, token );
      director.emit( `${dictum_name}_progress`, dictum_name, ndx );
    }
  };

  init_controls = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.init_controls');
    document.title = 'Workflow.init_controls | MySpace';
    function WorkingViewScreenDisplay( props ){
      const screenplay = props.screenplay;
      const panel = useRef();

      function cleanup(){

      }

      useEffect( ()=>{
        viewScreenVideo = document.getElementById( 'viewScreenVideo' );
        const texture = new THREE.VideoTexture( viewScreenVideo );
        //texture.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.BackSide } );
        screenplay.actors.Starship.Viewscreen.material = material;

        if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {

          const constraints = { video: { facingMode: 'user' } };
          navigator.mediaDevices.getUserMedia( constraints ).then( function ( stream ) {

            // apply the stream to the video element used in the texture

            viewScreenVideo.srcObject = stream;
            viewScreenVideo.play();

          } ).catch( function ( error ) {

            console.error( 'Unable to access the camera/webcam.', error );

          } );

        } else {

          console.error( 'MediaDevices interface not available.' );

        }

        return cleanup();
      }, [] );

      return(
        <>
        <style>{`
          #viewScreenRoot{

          }
          #viewScreen{

          }
          `}</style>
          <div id="viewScreen"  ref={ panel } >
            <video id="viewScreenVideo" style={{display:'none'}} autoPlay playsInline></video>
          </div>
        </>
      );
    }

    let selfCamStream = false;
    let videoStreams = [];
    /*if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {
      const constraints = { video: { facingMode: 'user' } };

      await navigator.mediaDevices.getUserMedia( constraints ).then( async function ( stream ) {

        // apply the stream to the video element used in the texture
        selfCamStream = stream;
        videoStreams.push( stream, stream );

      } );
    }*/

    try{

      let sys_ve_scene = screenplay.sys_ve_scene;
      let sys_ui_scene = screenplay.sys_ui_scene;
      let page_ve_scene = screenplay.page_ve_scene;
      let page_ui_scene = screenplay.page_ui_scene;

    } catch( e ) {

      director.emit( `${dictum_name}_failure`, dictum_name, ndx );

    } finally{

      this.react_app.render( <><WeTheHeader viewMode="desktop" screenplay={screenplay} /><WeTheMenu screenplay={screenplay} mode="collapsed" /><ViewScreenDisplay screenplay={screenplay} onDisplay={false} selfCamStream={selfCamStream} videoStreams={videoStreams} /></> );
      director.emit( `${dictum_name}_progress`, dictum_name, ndx );
    }
  };

  //Orphans
  new_room = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.new_room');
    document.title = 'Workflow.new_room | MySpace';

    this.react_app.render( <ErrorBoundary><WeTheHeader viewMode="desktop" screenplay={screenplay} /><WeTheMenu screenplay={screenplay} mode="collapsed" /><PipGUI pipGUI={false} /><ViewScreenDisplay screenplay={screenplay} /></ErrorBoundary> );
    director.emit( `${dictum_name}_progress`, dictum_name, ndx );
  };
  event_model = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.event_model');
    document.title = 'Workflow.event_model | MySpace';

    // Instantiate a exporter
    let sys_ve_scene = screenplay.sys_ve_scene;
    let sys_ui_scene = screenplay.sys_ui_scene;
    let page_ve_scene = screenplay.page_ve_scene;
    let page_ui_scene = screenplay.page_ui_scene;

    page_ve_scene.add( screenplay.lights.ambient_light );
    await screenplay.props.Model;
    let model = screenplay.props.Model.scene;
    let fullsize = new THREE.Vector3( 1, 1, 1 );
    model.scale.multiplyScalar( 0 );
    sys_ve_scene.add( model );
    let event_model_entrance = new SceneTransformation({
      update: ( delta )=>{
        let cache = event_model_entrance.cache;
        if( ++cache.frame <= cache.duration ){
          let progress = cache.frame / cache.duration;
          model.scale.lerp( fullsize, progress );

        } else {
          event_model_entrance.post( );  // This calls for the cleanup of the object from the scene and the values from itself.
        }
      },
      cache: {
        duration: 30, /* do something in 60 frames */
        frame: 0,
      },
      reset: ()=>{
        entrance_transition.cache.duration = 15;
        entrance_transition.cache.frame = 0;
        screenplay.updatables.set( 'event_model_entrance', event_model_entrance );
      },
      post: ( )=>{
        screenplay.updatables.delete( 'event_model_entrance' );
        model.scale.copy( fullsize );
      }
    });
    screenplay.updatables.set( 'event_model_entrance', event_model_entrance );


    const gui = screenplay.lil_gui;

    let scene_sharing_folder = gui.addFolder( 'Scene Controls');

    let wrap = {
      scene: ()=>{
        // Parse the input and generate the glTF output
        let to_remove = [];
        let to_save = sys_ve_scene.clone( true );
        to_save.traverse( function ( object ) {
          if (!object.isLight) return;
          if (!object.isDirectionalLight && !object.isPointLight && !object.isSpotLight) {
            to_remove.push(object);
          }
        } );
        to_remove.forEach( obj => { obj.removeFromParent() });
        const exporter = new GLTFExporter();
        exporter.parse( [to_save],
         // called when the gltf has been generated
         function ( gltf ) {
           //console.log( gltf );
           //  Diverting to Glyphon Research    wrap.downloadObjectAsGLTF( gltf, 'Scene' );
           wrap.generateGlyphon( gltf );
         },
         // called when there is an error in the generation
         function ( error ) {
           console.log( 'An error happened' );

         });
      },
      encodeGlyph: ()=>{
        wrap.generateGlyph();
      },
      downloadObjectAsGLTF: function downloadObjectAsGLTF( exportObj, exportName ){
        let raw_string = encodeURIComponent( JSON.stringify( exportObj ) );
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent( JSON.stringify( exportObj ) );
        var downloadAnchorNode = document.createElement( 'a' );
        downloadAnchorNode.setAttribute( "href",     dataStr );
        downloadAnchorNode.setAttribute( "download", exportName + ".gltf" );
        document.body.appendChild( downloadAnchorNode ); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      },
      generateGlyph: function generateGlyph( dataStr = 'https://wethe.network/AnObscureCodeWhichAintNeccessaryToReadAsThisVeryCodeIsPartOfTheSolution' ){
        QRCode.toDataURL(dataStr)
          .then(url => {
            console.log(url);
            let glyph = document.createElement( 'div' );
            glyph.id = "glyph";
            var glyphImage = document.createElement( 'img' );
            glyphImage.setAttribute( "src", url );
            glyph.appendChild( glyphImage );
            document.body.appendChild( glyph ); // required for firefox
          })
          .catch(err => {
            console.error(err)
          })

      },
      generateGlyphon: function generateGlyphon( exportObj ){
        let raw_string = encodeURIComponent( JSON.stringify( exportObj ) );
        let glyphon = [];
        let page = "data:img/glyphon;page:0;" + encodeURIComponent( JSON.stringify( exportObj ) );

        //let raw_string = encodeURIComponent( JSON.stringify( exportObj ) );
        wrap.generateGlyphon( raw_string );
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent( JSON.stringify( exportObj ) );

        // As before, I'm regularly grabbing blobs of video data
        // The implementation of "nextChunk" could be various things:
        //   - reading from a MediaRecorder
        //   - reading from an XMLHttpRequest
        //   - reading from a local webcam
        //   - generating the files on the fly in JavaScript
        //   - etc
        var arrayOfBlobs = [];
        setInterval(function() {
            arrayOfBlobs.append(nextChunk());
            // NEW: Try to flush our queue of video data to the video element
            appendToSourceBuffer();
        }, 1000);

        // 1. Create a `MediaSource`
        var mediaSource = new MediaSource();

        // 2. Create an object URL from the `MediaSource`
        var url = URL.createObjectURL(mediaSource);

        // 3. Set the video's `src` to the object URL
        var video = document.getElementById("video");
        video.src = url;

        // 4. On the `sourceopen` event, create a `SourceBuffer`
        var sourceBuffer = null;
        mediaSource.addEventListener("sourceopen", function(){
            // NOTE: Browsers are VERY picky about the codec being EXACTLY
            // right here. Make sure you know which codecs you're using!
            sourceBuffer = mediaSource.addSourceBuffer("video/webm; codecs=\"opus,vp8\"");

            // If we requested any video data prior to setting up the SourceBuffer,
            // we want to make sure we only append one blob at a time
            sourceBuffer.addEventListener("updateend", appendToSourceBuffer);
        });

        // 5. Use `SourceBuffer.appendBuffer()` to add all of your chunks to the video
        function appendToSourceBuffer(){
            if ( mediaSource.readyState === "open" && sourceBuffer && sourceBuffer.updating === false ){
                sourceBuffer.appendBuffer( arrayOfBlobs.shift() );
            }

            // Limit the total buffer size to 20 minutes
            // This way we don't run out of RAM
            if ( video.buffered.length && video.buffered.end(0) - video.buffered.start(0) > 1200 ){
                sourceBuffer.remove(0, video.buffered.end(0) - 1200)
            }
        }

        return glyphon;
      }
    }

    scene_sharing_folder.add( wrap, 'scene' ).name( "save scene");
    scene_sharing_folder.add( wrap, 'encodeGlyph' ).name( "Show Glyph");


    gui.open( open );
    let page_ve_folder = gui.addFolder( 'Page VE' );
    page_ve_folder.add ( screenplay.props.Model.scene.position, 'x' ).listen().onChange((value)=>{
      screenplay.props.Model.scene.position.setX( value );
    }).name( 'Stage: pos.X' );
    page_ve_folder.add ( screenplay.props.Model.scene.position, 'y' ).listen().onChange((value)=>{
      screenplay.props.Model.scene.position.setY( value );
    }).name( 'Stage: pos.Y' );
    page_ve_folder.add ( screenplay.props.Model.scene.position, 'z' ).listen().onChange((value)=>{
      screenplay.props.Model.scene.position.setZ( value );
    }).name( 'Stage: pos.Z' );
    page_ve_folder.add ( screenplay.props.Model.scene.rotation, 'x' ).listen().onChange((value)=>{
      screenplay.props.Model.scene.rotateX( value );
    }).name( 'Stage: rot.X' );
    page_ve_folder.add ( screenplay.props.Model.scene.rotation, 'y' ).listen().onChange((value)=>{
      screenplay.props.Model.scene.rotateY( value );
    }).name( 'Stage: rot.Y' );
    page_ve_folder.add ( screenplay.props.Model.scene.rotation, 'z' ).listen().onChange((value)=>{
      screenplay.props.Model.scene.rotateZ( value );
    }).name( 'Stage: rot.Z' );

    this.react_app.render( <ErrorBoundary><WeTheHeader viewMode="desktop" screenplay={screenplay} /><WeTheMenu screenplay={screenplay} mode="collapsed" /><PipGUI pipGUI={false} /><ViewScreenDisplay screenplay={screenplay} /></ErrorBoundary> );

  };
  demo = async ( screenplay, dictum_name, director, ndx ) =>{
    console.log('Workflow.demo');
    document.title = 'Workflow.demo | MySpace';

    let page_ve_scene = screenplay.page_ve_scene;

    this.react_app.render( <ErrorBoundary><WeTheHeader viewMode="desktop" screenplay={screenplay} /><WeTheMenu screenplay={screenplay} mode="collapsed" /><PipGUI pipGUI={false} /><ViewScreenDisplay screenplay={screenplay} /></ErrorBoundary>  );


    let demo_2 = await new SceneTransformation({
      update: function(){
        let cache = this.cache;

        if( cache.initialized ){

  				cache.idleWeight = cache.idleAction.getEffectiveWeight();
  				cache.walkWeight = cache.walkAction.getEffectiveWeight();
  				cache.runWeight = cache.runAction.getEffectiveWeight();

  				// Update the panel values if weights are modified from "outside" (by crossfadings)
  				updateWeightSliders();

  				// Enable/disable crossfade controls according to current weight values
  				updateCrossFadeControls();

  				// Get the time elapsed since the last frame, used for mixer update (if not in single step mode)
  				let mixerUpdateDelta = cache.clock.getDelta();

  				// If in single step mode, make one step and then do nothing (until the user clicks again)
  				if ( cache.singleStepMode ) {
  					cache.mixerUpdateDelta = cache.sizeOfNextStep;
  					cache.sizeOfNextStep = 0;
  				}

  				// Update the animation mixer and render this frame
  				cache.mixer.update( mixerUpdateDelta );
        }
      },
      cache: {
        scene: null, renderer: null, camera: null, model: null, skeleton: null, mixer: null, clock: null,
        crossFadeControls: [],

        idleAction: null, walkAction: null, runAction: null,
        idleWeight: null, walkWeight: null, runWeight: null,
        actions: null, settings: null,

        singleStepMode: false,
        sizeOfNextStep: 0,
        dirLight: null

      },
      post: function(){

      },
      init: async function(){
        let cache = this.cache;

				cache.clock = screenplay.clock;
        cache.renderer = screenplay.page_ve_renderer;

				let scene = page_ve_scene;
				scene.background = new THREE.Color( 0xa0a0a0 );
				scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

				let hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
				hemiLight.position.set( 0, 20, 0 );
				scene.add( hemiLight );

				let dirLight = cache.dirLight = new THREE.DirectionalLight( 0xffffff );
				dirLight.position.set( - 3, 10, - 10 );
				dirLight.castShadow = true;
				dirLight.shadow.camera.top = 2;
				dirLight.shadow.camera.bottom = - 2;
				dirLight.shadow.camera.left = - 2;
				dirLight.shadow.camera.right = 2;
				dirLight.shadow.camera.near = 0.1;
				dirLight.shadow.camera.far = 40;
				scene.add( dirLight );

				// scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );

				// ground

				const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
				mesh.rotation.x = - Math.PI / 2;
				mesh.receiveShadow = true;
				scene.add( mesh );

				const loader = new GLTFLoader();
        let model = cache.model;
        let skeleton = cache.skeleton;
				loader.load( 'models/Soldier.glb', ( gltf ) => {

					model = cache.model = gltf.scene;
					model.traverse( function ( object ) {

						if ( object.isMesh ) object.castShadow = true;

					} );
          scene.add( model );

					//

					skeleton = cache.skeleton = new THREE.SkeletonHelper( model );
					skeleton.visible = false;
					scene.add( skeleton );

					//




					//

					const animations = gltf.animations;

					let mixer = cache.mixer = new THREE.AnimationMixer( model );

					cache.idleAction = mixer.clipAction( animations[ 0 ] );
					cache.walkAction = mixer.clipAction( animations[ 3 ] );
					cache.runAction = mixer.clipAction( animations[ 1 ] );

					cache.actions = [ cache.idleAction, cache.walkAction, cache.runAction ];
          activateAllActions();

          cache.initialized = true;
				} );


			}
    });

    let showModel = function( visibility ) {

      demo_2.cache.model.visible = visibility;

    };

    let showSkeleton = function( visibility ) {

      demo_2.cache.skeleton.visible = visibility;

    };

    let modifyTimeScale = function( speed ) {

      demo_2.cache.mixer.timeScale = speed;

    };

    let deactivateAllActions = function() {

      demo_2.cache.actions.forEach( function ( action ) {

        action.stop();

      } );

    };

    let activateAllActions = function() {

      setWeight( demo_2.cache.idleAction, demo_2.cache.settings[ 'modify idle weight' ] );
      setWeight( demo_2.cache.walkAction, demo_2.cache.settings[ 'modify walk weight' ] );
      setWeight( demo_2.cache.runAction, demo_2.cache.settings[ 'modify run weight' ] );

      demo_2.cache.actions.forEach( function ( action ) {

        action.play();

      } );

    };

    let pauseContinue = function() {

      if ( demo_2.cache.singleStepMode ) {

        demo_2.cache.singleStepMode = false;
        unPauseAllActions();

      } else {

        if ( demo_2.cache.idleAction.paused ) {

          unPauseAllActions();

        } else {

          pauseAllActions();

        }

      }

    };

    let pauseAllActions = function() {

      demo_2.cache.actions.forEach( function ( action ) {

        action.paused = true;

      } );

    };

    let unPauseAllActions = function() {

      demo_2.cache.actions.forEach( function ( action ) {

        action.paused = false;

      } );

    };

    let toSingleStepMode = function() {

      unPauseAllActions();

      demo_2.cache.singleStepMode = true;
      demo_2.cache.sizeOfNextStep = demo_2.cache.settings[ 'modify step size' ];

    };

    let prepareCrossFade = function( startAction, endAction, defaultDuration ) {

      // Switch default / custom crossfade duration (according to the user's choice)

      const duration = setCrossFadeDuration( defaultDuration );

      // Make sure that we don't go on in singleStepMode, and that all actions are unpaused

      demo_2.cache.singleStepMode = false;
      unPauseAllActions();

      // If the current action is 'idle' (duration 4 sec), execute the crossfade immediately;
      // else wait until the current action has finished its current loop

      if ( startAction === cache.idleAction ) {

        executeCrossFade( startAction, endAction, duration );

      } else {

        synchronizeCrossFade( startAction, endAction, duration );

      }

    };

    let setCrossFadeDuration = function( defaultDuration ) {

      // Switch default crossfade duration <-> custom crossfade duration

      if ( demo_2.cache.settings[ 'use default duration' ] ) {

        return defaultDuration;

      } else {

        return demo_2.cache.settings[ 'set custom duration' ];

      }

    };
    let synchronizeCrossFade = function( startAction, endAction, duration ) {

      let mixer = demo_2.cache.mixer;
      mixer.addEventListener( 'loop', onLoopFinished );

      function onLoopFinished( event ) {

        if ( event.action === startAction ) {

          mixer.removeEventListener( 'loop', onLoopFinished );

          executeCrossFade( startAction, endAction, duration );

        }

      }

    };

    let executeCrossFade = function( startAction, endAction, duration ) {

      // Not only the start action, but also the end action must get a weight of 1 before fading
      // (concerning the start action demo_2 is already guaranteed in demo_2 place)

      setWeight( endAction, 1 );
      endAction.time = 0;

      // Crossfade with warping - you can also try without warping by setting the third parameter to false

      startAction.crossFadeTo( endAction, duration, true );

    };

    // demo_2 function is needed, since animationAction.crossFadeTo() disables its start action and sets
    // the start action's timeScale to ((start animation's duration) / (end animation's duration))
    let setWeight = function( action, weight ) {

      action.enabled = true;
      action.setEffectiveTimeScale( 1 );
      action.setEffectiveWeight( weight );

    };

    // Called by the render loop
    let updateWeightSliders = function() {

      demo_2.cache.settings[ 'modify idle weight' ] = demo_2.cache.idleWeight;
      demo_2.cache.settings[ 'modify walk weight' ] = demo_2.cache.walkWeight;
      demo_2.cache.settings[ 'modify run weight' ] = demo_2.cache.runWeight;

    };

    // Called by the render loop
    let updateCrossFadeControls = function() {

      if ( demo_2.cache.idleWeight === 1 && demo_2.cache.walkWeight === 0 && demo_2.cache.runWeight === 0 ) {

        demo_2.cache.crossFadeControls[ 0 ].disable();
        demo_2.cache.crossFadeControls[ 1 ].enable();
        demo_2.cache.crossFadeControls[ 2 ].disable();
        demo_2.cache.crossFadeControls[ 3 ].disable();

      }

      if ( demo_2.cache.idleWeight === 0 && demo_2.cache.walkWeight === 1 && demo_2.cache.runWeight === 0 ) {

        demo_2.cache.crossFadeControls[ 0 ].enable();
        demo_2.cache.crossFadeControls[ 1 ].disable();
        demo_2.cache.crossFadeControls[ 2 ].enable();
        demo_2.cache.crossFadeControls[ 3 ].disable();

      }

      if ( demo_2.cache.idleWeight === 0 && demo_2.cache.walkWeight === 0 && demo_2.cache.runWeight === 1 ) {

        demo_2.cache.crossFadeControls[ 0 ].disable();
        demo_2.cache.crossFadeControls[ 1 ].disable();
        demo_2.cache.crossFadeControls[ 2 ].disable();
        demo_2.cache.crossFadeControls[ 3 ].enable();

      }

    };

    await demo_2.init();

    let cache = demo_2.cache;

    const gui = screenplay.lil_gui;
    const panel = gui.addFolder( 'Orphan: Demo' );

    const folder1 = panel.addFolder( 'Visibility' );
    const folder2 = panel.addFolder( 'Activation/Deactivation' );
    const folder3 = panel.addFolder( 'Pausing/Stepping' );
    const folder4 = panel.addFolder( 'Crossfading' );
    const folder5 = panel.addFolder( 'Blend Weights' );
    const folder6 = panel.addFolder( 'General Speed' );
    const folder7 = panel.addFolder( ' Phox.Stuff' );


    let settings = demo_2.cache.settings = {
      'show model': true,
      'show skeleton': false,
      'deactivate all': deactivateAllActions,
      'activate all': activateAllActions,
      'pause/continue': pauseContinue,
      'make single step': toSingleStepMode,
      'modify step size': 0.05,
      'from walk to idle': ()=>{

        prepareCrossFade( cache.walkAction, cache.idleAction, 1.0 );

      },
      'from idle to walk': ()=>{

        prepareCrossFade( cache.idleAction, cache.walkAction, 0.5 );

      },
      'from walk to run': ()=>{

        prepareCrossFade( cache.walkAction, cache.runAction, 2.5 );

      },
      'from run to walk': ()=>{

        prepareCrossFade( cache.runAction, cache.walkAction, 5.0 );

      },
      'use default duration': true,
      'set custom duration': 3.5,
      'modify idle weight': 0.0,
      'modify walk weight': 1.0,
      'modify run weight': 0.0,
      'modify time scale': 1.0
    };

    folder1.add( settings, 'show model' ).onChange( showModel );
    folder1.add( settings, 'show skeleton' ).onChange( showSkeleton );
    folder2.add( settings, 'deactivate all' );
    folder2.add( settings, 'activate all' );
    folder3.add( settings, 'pause/continue' );
    folder3.add( settings, 'make single step' );
    folder3.add( settings, 'modify step size', 0.01, 0.1, 0.001 );

    cache.crossFadeControls.push( folder4.add( settings, 'from walk to idle' ) );
    cache.crossFadeControls.push( folder4.add( settings, 'from idle to walk' ) );
    cache.crossFadeControls.push( folder4.add( settings, 'from walk to run' ) );
    cache.crossFadeControls.push( folder4.add( settings, 'from run to walk' ) );

    folder4.add( settings, 'use default duration' );
    folder4.add( settings, 'set custom duration', 0, 10, 0.01 );
    folder5.add( settings, 'modify idle weight', 0.0, 1.0, 0.01 ).listen().onChange( function ( weight ) {

      setWeight( cache.idleAction, weight );

    } );
    folder5.add( settings, 'modify walk weight', 0.0, 1.0, 0.01 ).listen().onChange( function ( weight ) {

      setWeight( cache.walkAction, weight );

    } );
    folder5.add( settings, 'modify run weight', 0.0, 1.0, 0.01 ).listen().onChange( function ( weight ) {

      setWeight( cache.runAction, weight );

    } );
    folder6.add( settings, 'modify time scale', 0.0, 1.5, 0.01 ).onChange( modifyTimeScale );
    let dirLight = cache.dirLight;
    folder7.add ( dirLight.position, 'x' ).listen().onChange((value)=>{
      dirLight.position.setX( value );

    }).name( 'dirLight: pos.x' );
    folder7.add ( dirLight.position, 'y' ).listen().onChange((value)=>{
      dirLight.position.setY( value );

    }).name( 'dirLight: pos.y' );
    folder7.add ( dirLight.position, 'z' ).listen().onChange((value)=>{
      dirLight.position.setZ( value );

    }).name( 'dirLight: pos.z' );
    folder7.add ( dirLight.rotation, 'x' ).listen().onChange((value)=>{
      dirLight.rotateX( value );

    }).name( 'dirLight: rot.x' );
    folder7.add ( dirLight.rotation, 'y' ).listen().onChange((value)=>{
      dirLight.rotateY( value );

    }).name( 'dirLight: rot.y' );
    folder7.add ( dirLight.rotation, 'z' ).listen().onChange((value)=>{
      dirLight.rotateZ( value );

    }).name( 'dirLight: rot.z' );

    folder1.open();
    folder2.open();
    folder3.open();
    folder4.open();
    folder5.open();
    folder6.open();


    screenplay.updatables.set( 'demo', demo_2 );
/*
    let demo = {
      scene: false, renderer: false, camera: false, model: false, skeleton: false, mixer: false, clock: false,
			crossFadeControls: [],

			idleAction: false, walkAction: false, runAction: false,
			idleWeight: false, walkWeight: false, runWeight: false,
			actions: false, settings: false,

			singleStepMode: false,
			sizeOfNextStep: 0,
      dirLight: false,


			init: function() {

				demo.clock = screenplay.clock;
        demo.renderer = screenplay.page_ve_renderer;

				let scene = demo.scene = page_ve_scene;
				scene.background = new THREE.Color( 0xa0a0a0 );
				scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

				let hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
				hemiLight.position.set( 0, 20, 0 );
				scene.add( hemiLight );

				let dirLight = demo.dirLight = new THREE.DirectionalLight( 0xffffff );
				dirLight.position.set( - 3, 10, - 10 );
				dirLight.castShadow = true;
				dirLight.shadow.camera.top = 2;
				dirLight.shadow.camera.bottom = - 2;
				dirLight.shadow.camera.left = - 2;
				dirLight.shadow.camera.right = 2;
				dirLight.shadow.camera.near = 0.1;
				dirLight.shadow.camera.far = 40;
				scene.add( dirLight );

				// scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );

				// ground

				const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
				mesh.rotation.x = - Math.PI / 2;
				mesh.receiveShadow = true;
				scene.add( mesh );

				const loader = new GLTFLoader();
        let model = demo.model;
        let skeleton = demo.skeleton;
				loader.load( 'models/Soldier.glb', ( gltf ) => {

					model = gltf.scene;
					model.traverse( function ( object ) {

						if ( object.isMesh ) object.castShadow = true;

					} );
          scene.add( model );

					//

					skeleton = new THREE.SkeletonHelper( model );
					skeleton.visible = false;
					scene.add( skeleton );

					//

					demo.createPanel();


					//

					const animations = gltf.animations;

					let mixer = demo.mixer = new THREE.AnimationMixer( model );

					demo.idleAction = mixer.clipAction( animations[ 0 ] );
					demo.walkAction = mixer.clipAction( animations[ 3 ] );
					demo.runAction = mixer.clipAction( animations[ 1 ] );

					demo.actions = [ demo.idleAction, demo.walkAction, demo.runAction ];

					demo.activateAllActions();

				} );


			},

			createPanel: function() {

        const gui = screenplay.lil_gui;
				const panel = gui.addFolder( 'Orphan: Demo' );

				const folder1 = panel.addFolder( 'Visibility' );
				const folder2 = panel.addFolder( 'Activation/Deactivation' );
				const folder3 = panel.addFolder( 'Pausing/Stepping' );
				const folder4 = panel.addFolder( 'Crossfading' );
				const folder5 = panel.addFolder( 'Blend Weights' );
				const folder6 = panel.addFolder( 'General Speed' );
        const folder7 = panel.addFolder( ' Phox.Stuff' );

				let settings = demo.settings = {
					'show model': true,
					'show skeleton': false,
					'deactivate all': demo.deactivateAllActions,
					'activate all': demo.activateAllActions,
					'pause/continue': demo.pauseContinue,
					'make single step': demo.toSingleStepMode,
					'modify step size': 0.05,
					'from walk to idle': ()=>{

						demo.prepareCrossFade( demo.walkAction, demo.idleAction, 1.0 );

					},
					'from idle to walk': ()=>{

						demo.prepareCrossFade( demo.idleAction, demo.walkAction, 0.5 );

					},
					'from walk to run': ()=>{

						demo.prepareCrossFade( demo.walkAction, demo.runAction, 2.5 );

					},
					'from run to walk': ()=>{

						demo.prepareCrossFade( demo.runAction, demo.walkAction, 5.0 );

					},
					'use default duration': true,
					'set custom duration': 3.5,
					'modify idle weight': 0.0,
					'modify walk weight': 1.0,
					'modify run weight': 0.0,
					'modify time scale': 1.0
				};

				folder1.add( settings, 'show model' ).onChange( demo.showModel );
				folder1.add( settings, 'show skeleton' ).onChange( demo.showSkeleton );
				folder2.add( settings, 'deactivate all' );
				folder2.add( settings, 'activate all' );
				folder3.add( settings, 'pause/continue' );
				folder3.add( settings, 'make single step' );
				folder3.add( settings, 'modify step size', 0.01, 0.1, 0.001 );
				demo.crossFadeControls.push( folder4.add( settings, 'from walk to idle' ) );
				demo.crossFadeControls.push( folder4.add( settings, 'from idle to walk' ) );
				demo.crossFadeControls.push( folder4.add( settings, 'from walk to run' ) );
				demo.crossFadeControls.push( folder4.add( settings, 'from run to walk' ) );
				folder4.add( settings, 'use default duration' );
				folder4.add( settings, 'set custom duration', 0, 10, 0.01 );
				folder5.add( settings, 'modify idle weight', 0.0, 1.0, 0.01 ).listen().onChange( function ( weight ) {

					demo.setWeight( idleAction, weight );

				} );
				folder5.add( settings, 'modify walk weight', 0.0, 1.0, 0.01 ).listen().onChange( function ( weight ) {

					demo.setWeight( walkAction, weight );

				} );
				folder5.add( settings, 'modify run weight', 0.0, 1.0, 0.01 ).listen().onChange( function ( weight ) {

					demo.setWeight( runAction, weight );

				} );
				folder6.add( settings, 'modify time scale', 0.0, 1.5, 0.01 ).onChange( demo.modifyTimeScale );
        let dirLight = demo.dirLight;
        folder7.add ( dirLight.position, 'x' ).listen().onChange((value)=>{
          dirLight.position.setX( value );

        }).name( 'dirLight: pos.x' );
        folder7.add ( dirLight.position, 'y' ).listen().onChange((value)=>{
          dirLight.position.setY( value );

        }).name( 'dirLight: pos.y' );
        folder7.add ( dirLight.position, 'z' ).listen().onChange((value)=>{
          dirLight.position.setZ( value );

        }).name( 'dirLight: pos.z' );
        folder7.add ( dirLight.rotation, 'x' ).listen().onChange((value)=>{
          dirLight.rotateX( value );

        }).name( 'dirLight: rot.x' );
        folder7.add ( dirLight.rotation, 'y' ).listen().onChange((value)=>{
          dirLight.rotateY( value );

        }).name( 'dirLight: rot.y' );
        folder7.add ( dirLight.rotation, 'z' ).listen().onChange((value)=>{
          dirLight.rotateZ( value );

        }).name( 'dirLight: rot.z' );

				folder1.open();
				folder2.open();
				folder3.open();
				folder4.open();
				folder5.open();
				folder6.open();

			},
			showModel: function( visibility ) {

				demo.model.visible = visibility;

			},
			showSkeleton: function( visibility ) {

				demo.skeleton.visible = visibility;

			},
			modifyTimeScale: function( speed ) {

				demo.mixer.timeScale = speed;

			},
			deactivateAllActions: function() {

				demo.actions.forEach( function ( action ) {

					action.stop();

				} );

			},
			activateAllActions: function() {

				demo.setWeight( demo.idleAction, demo.settings[ 'modify idle weight' ] );
				demo.setWeight( demo.walkAction, demo.settings[ 'modify walk weight' ] );
				demo.setWeight( demo.runAction, demo.settings[ 'modify run weight' ] );

				demo.actions.forEach( function ( action ) {

					action.play();

				} );

			},
			pauseContinue: function() {

				if ( demo.singleStepMode ) {

					demo.singleStepMode = false;
					demo.unPauseAllActions();

				} else {

					if ( demo.idleAction.paused ) {

						demo.unPauseAllActions();

					} else {

						demo.pauseAllActions();

					}

				}

			},
			pauseAllActions: function() {

				demo.actions.forEach( function ( action ) {

					action.paused = true;

				} );

			},
			unPauseAllActions: function() {

				demo.actions.forEach( function ( action ) {

					action.paused = false;

				} );

			},
			toSingleStepMode: function() {

				demo.unPauseAllActions();

				demo.singleStepMode = true;
				demo.sizeOfNextStep = demo.settings[ 'modify step size' ];

			},
			prepareCrossFade: function( startAction, endAction, defaultDuration ) {

				// Switch default / custom crossfade duration (according to the user's choice)

				const duration = demo.setCrossFadeDuration( defaultDuration );

				// Make sure that we don't go on in singleStepMode, and that all actions are unpaused

				demo.singleStepMode = false;
				demo.unPauseAllActions();

				// If the current action is 'idle' (duration 4 sec), execute the crossfade immediately;
				// else wait until the current action has finished its current loop

				if ( startAction === demo.idleAction ) {

					demo.executeCrossFade( startAction, endAction, duration );

				} else {

					demo.synchronizeCrossFade( startAction, endAction, duration );

				}

			},
			setCrossFadeDuration: function( defaultDuration ) {

				// Switch default crossfade duration <-> custom crossfade duration

				if ( demo.settings[ 'use default duration' ] ) {

					return defaultDuration;

				} else {

					return demo.settings[ 'set custom duration' ];

				}

			},
			synchronizeCrossFade: function( startAction, endAction, duration ) {

				let mixer = demo.mixer;
        mixer.addEventListener( 'loop', onLoopFinished );

				function onLoopFinished( event ) {

					if ( event.action === startAction ) {

						mixer.removeEventListener( 'loop', onLoopFinished );

						executeCrossFade( startAction, endAction, duration );

					}

				}

			},
			executeCrossFade: function( startAction, endAction, duration ) {

				// Not only the start action, but also the end action must get a weight of 1 before fading
				// (concerning the start action this is already guaranteed in this place)

				demo.setWeight( endAction, 1 );
				endAction.time = 0;

				// Crossfade with warping - you can also try without warping by setting the third parameter to false

				startAction.crossFadeTo( endAction, duration, true );

			},

			// This function is needed, since animationAction.crossFadeTo() disables its start action and sets
			// the start action's timeScale to ((start animation's duration) / (end animation's duration))
			setWeight: function( action, weight ) {

				action.enabled = true;
				action.setEffectiveTimeScale( 1 );
				action.setEffectiveWeight( weight );

			},

      // Called by the render loop
			updateWeightSliders: function() {

				demo.settings[ 'modify idle weight' ] = demo.idleWeight;
				demo.settings[ 'modify walk weight' ] = demo.walkWeight;
				demo.settings[ 'modify run weight' ] = demo.runWeight;

			},

			// Called by the render loop
			updateCrossFadeControls: function() {

				if ( demo.idleWeight === 1 && demo.walkWeight === 0 && demo.runWeight === 0 ) {

					demo.crossFadeControls[ 0 ].disable();
					demo.crossFadeControls[ 1 ].enable();
					demo.crossFadeControls[ 2 ].disable();
					demo.crossFadeControls[ 3 ].disable();

				}

				if ( demo.idleWeight === 0 && demo.walkWeight === 1 && demo.runWeight === 0 ) {

					demo.crossFadeControls[ 0 ].enable();
					demo.crossFadeControls[ 1 ].disable();
					demo.crossFadeControls[ 2 ].enable();
					demo.crossFadeControls[ 3 ].disable();

				}

				if ( demo.idleWeight === 0 && demo.walkWeight === 0 && demo.runWeight === 1 ) {

					demo.crossFadeControls[ 0 ].disable();
					demo.crossFadeControls[ 1 ].disable();
					demo.crossFadeControls[ 2 ].disable();
					demo.crossFadeControls[ 3 ].enable();

				}

			},
			update: function() {

				// Render loop

				this.idleWeight = this.idleAction.getEffectiveWeight();
				this.walkWeight = this.walkAction.getEffectiveWeight();
				this.runWeight = this.runAction.getEffectiveWeight();

				// Update the panel values if weights are modified from "outside" (by crossfadings)

				this.updateWeightSliders();

				// Enable/disable crossfade controls according to current weight values

				this.updateCrossFadeControls();

				// Get the time elapsed since the last frame, used for mixer update (if not in single step mode)

				let mixerUpdateDelta = this.clock.getDelta();

				// If in single step mode, make one step and then do nothing (until the user clicks again)

				if ( this.singleStepMode ) {

					this.mixerUpdateDelta = this.sizeOfNextStep;
					this.sizeOfNextStep = 0;

				}

				// Update the animation mixer and render this frame

				this.mixer.update( mixerUpdateDelta );

			}
    }
*/
  }

  constructor( react_app, screenplay ){
    super();
    this.react_app = react_app;
  }
}

export { Workflow }
