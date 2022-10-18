// React Initialization
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './index.portrait.css';
import './index.landscape.css';
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

  // React-App Root
  const react_app = ReactDOM.createRoot(document.getElementById('root'));

  // Scene Director Implementation
  const screen_play = new Screenplay( );
  const scene_directions = new SceneDirections( react_app );
  const workflow = new Workflow( react_app );
  const manifesto = new Manifesto( scene_directions, workflow );

  const scene_director = new ScreenDirector(screen_play, manifesto, false);

  // Main Logic
  react_app.render(<App />);
  scene_director.start();

}

// Execute initialization prior to exportation
app.init();
