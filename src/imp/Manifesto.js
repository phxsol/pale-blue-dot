import * as THREE from 'three';
import { Manifesto as _Manifesto, Dictum } from '../bin/ScreenDirector.js';

class Manifesto extends _Manifesto{
  constructor( scene_directions, workflow ){
    super( scene_directions, workflow );  // Though it doesn't do anything... it is necessary to make 'this' available.

    this.Splash = new Dictum( [ workflow.verify_capabilities, workflow.init_controls ],
      {
        on_enter: scene_directions.enter_splash,
        on_idle: scene_directions.idle_on_splash,
        on_progress: scene_directions.progress_splash,
        on_failure: scene_directions.splash_failure,
        on_end: scene_directions.end_splash
      }, true, false );
    this.Prep = new Dictum( [ workflow.introduction, workflow.user_instruction, workflow.tour_or_skip ],
      {
        on_enter: scene_directions.enter_prep,
        on_idle: scene_directions.idle_on_prep,
        on_progress: scene_directions.progress_prep,
        on_failure: scene_directions.prep_failure,
        on_end: scene_directions.prepared
      }, true, false );
    this.Ready = new Dictum( [ workflow.introduce_phox, workflow.confirm_privileges, workflow.connect ],
      {
        on_enter: scene_directions.enter_ready,
        on_idle: scene_directions.idle_on_ready,
        on_progress: scene_directions.progress_ready,
        on_failure: scene_directions.ready_failure,
        on_end: scene_directions.ready_for_anything
      }, true, false );
  }
}

export { Manifesto }
