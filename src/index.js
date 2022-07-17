// React Initialization
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Development Toolkit
//import reportWebVitals from './reportWebVitals';
//import Stats from './utils/jsm/stats.module';

// ScreenDirector Library Reference
import { Screenplay } from './utils/Screenplay.js';
import { SceneAssets } from './utils/SceneAssets.js';
import { SceneDirections } from './utils/SceneDirections.js';
import { Manifesto } from './utils/Manifesto.js';
import { Workflow } from './utils/Workflow.js';

import { ScreenDirector } from './utils/ScreenDirector.js';

// Initialization
const root = ReactDOM.createRoot(document.getElementById('root'));
const confirm_start = ( yes ) => {
  if(yes || window.confirm('start loading?')){
    scene_director.start();
  } else {
    setTimeout(confirm_start, 5000);
  }
};

// Scene Direction
const scene_assets = new SceneAssets();
const scene_directions = new SceneDirections();
const screen_play = new Screenplay( scene_assets, scene_directions );
const workflow = new Workflow();
const manifesto = new Manifesto( scene_directions, workflow );

const scene_director = new ScreenDirector(screen_play, manifesto, false);

// Main Logic
root.render(<React.StrictMode><App /></React.StrictMode>);
confirm_start( true );

// Development Logic
//reportWebVitals(console.log);
/*  If you want to start measuring performance in your app,
    pass a function to log results (for example: reportWebVitals(console.log))
    or send to an analytics endpoint.

    Learn more: https://bit.ly/CRA-vitals   */
