// P2P client code
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// ScreenDirector Reference
import { ScreenDirector } from './bin/ScreenDirector.js' ;

// ScreenDirector Implementation Library
import { Screenplay } from  './imp/Screenplay.js' ;
import { SceneDirections } from  './imp/SceneDirections.js' ;
import { Manifesto } from  './imp/Manifesto.js' ;
import { Workflow } from  './imp/Workflow.js' ;
import { Shard } from './imp/Shard.js';

let app = App;
app.init = async ()=>{



  //const shard = new Shard();
  let shard = false;  // Plug for now till the shard is operational.

  // React-App Root
  const react_app = ReactDOM.createRoot(document.getElementById('root'));

  // Scene Director Implementation
  const screenplay = new Screenplay( );
  const scene_directions = new SceneDirections( react_app );
  const workflow = new Workflow( react_app, screenplay, shard );
  const manifesto = new Manifesto( scene_directions, workflow );

  const screen_director = new ScreenDirector(screenplay, manifesto, false);

  /* Handle PopState events to trigger page navigation in response to History Navigation (Back/Forward buttons)  */
  const doSomeThing = () => {
    alert( 'State Popped! ');
  }
  window.addEventListener("popstate", (event) => {
    setTimeout(doSomeThing, 0); // Running this way ensures last-on the processing stack... ensuring a more predictable page state every time.
  });


  react_app.render(<App />);
  let IAMROOT = document.getElementById('root');
  document.body.appendChild(IAMROOT);
  IAMROOT = null;
  screen_director.start();



}

// Execute initialization prior to exportation
app.init();
