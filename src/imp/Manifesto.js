import * as THREE from 'three';
import { Manifesto as _Manifesto, Dictum } from '../bin/ScreenDirector.js';

class Manifesto extends _Manifesto{
  constructor( scene_directions, workflow ){
    super( scene_directions, workflow );  // Though it doesn't do anything... it is necessary to make 'this' available.


  this.Ready = new Dictum( [ workflow.test_client, workflow.tutorial, workflow.load_wethe, workflow.resume_user, workflow.init_controls ],
    {
      on_enter: scene_directions.enter_ready,
      on_idle: scene_directions.idle_on_ready,
      on_progress: scene_directions.progress_ready,
      on_failure: scene_directions.ready_failure,
      on_end: scene_directions.ready_for_anything
    }, true );

  let HomeDome = new Dictum( [ workflow.go_home ],
    {
      on_enter: scene_directions.goto_dome,
      on_idle: scene_directions.enter_dome,
      on_progress: scene_directions.progress_dome,
      on_failure: scene_directions.dome_failure,
      on_end: scene_directions.dome_loaded
    }, true );

  let TradeStation = new Dictum( [ workflow.load_station ],
    {
      on_enter: scene_directions.goto_station,
      on_idle: scene_directions.enter_station,
      on_progress: scene_directions.progress_station,
      on_failure: scene_directions.station_failure,
      on_end: scene_directions.station_loaded
    }, true );
  }
}

export { Manifesto }
