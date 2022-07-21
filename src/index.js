// React Initialization
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// ScreenDirector Reference
import { ScreenDirector } from './bin/ScreenDirector.js' ;

// ScreenDirector Implementation Library
import { Screenplay } from  './imp/Screenplay.js' ;
import { SceneDirections } from  './imp/SceneDirections.js' ;
import { Manifesto } from  './imp/Manifesto.js' ;
import { Workflow } from  './imp/Workflow.js' ;

let app = App;
app.init = ()=>{

  // Scene Director Implementation
  const screen_play = new Screenplay( );
  const scene_directions = new SceneDirections();
  const workflow = new Workflow();
  const manifesto = new Manifesto( scene_directions, workflow );

  const scene_director = new ScreenDirector(screen_play, manifesto, false);

  // Main Logic
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<React.StrictMode><App /></React.StrictMode>);
  scene_director.start();

}

// Execute initialization prior to exportation
app.init();
