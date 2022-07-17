import * as THREE from 'three';
import { Manifesto as _Manifesto, Dictum } from './ScreenDirector.js';

class Manifesto extends _Manifesto{
  constructor( scene_directions, workflow ){
    super( scene_directions, workflow );  // Though it doesn't do anything... it is necessary to make 'this' available.
    
    this.Splash = new Dictum( [ workflow.confirm_privileges, workflow.verify_capabilities ],
      {
        on_enter: scene_directions.enter_splash,
        on_idle: scene_directions.idle_on_splash,
        on_progress: scene_directions.progress_splash,
        on_failure: scene_directions.splash_failure,
        on_end: [ scene_directions.end_splash, scene_directions.overlay_icons, scene_directions.ready_for_neptune ]
      }, true, true );
    this.Neptune = new Dictum( workflow.introduction,
      {
        on_enter: scene_directions.bezier_path_to_neptune,
        on_idle: scene_directions.spin_in_place,
        on_progress: scene_directions.progress_neptune,
        on_failure: scene_directions.neptune_failure,
        on_end: scene_directions.ready_for_uranus
      }, true, true );
    this.Uranus = new Dictum( workflow.user_introduction,
      {
        on_enter: scene_directions.bezier_path_to_uranus,
        on_idle: scene_directions.spin_in_place,
        on_progress: scene_directions.progress_uranus,
        on_failure: scene_directions.uranus_failure,
        on_end: scene_directions.ready_for_saturn
      }, true, true );
    this.Saturn = new Dictum( workflow.orbit_controls_demo,
      {
        on_enter: scene_directions.bezier_path_to_saturn,
        on_idle: scene_directions.spin_with_orbit_ctrls,
        on_progress: scene_directions.progress_saturn,
        on_failure: scene_directions.saturn_failure,
        on_end: scene_directions.ready_for_jupiter
      }, true, true );
    this.Jupiter = new Dictum( workflow.wireframe_demo,
      {
        on_enter: scene_directions.bezier_path_to_jupiter,
        on_idle: scene_directions.spin_with_orbit_ctrls,
        on_progress: scene_directions.progress_jupiter,
        on_failure: scene_directions.jupiter_failure,
        on_end: scene_directions.ready_for_mars
      }, true, true );
    this.Mars = new Dictum( [ workflow.projects_showcase, workflow.comms_init ],
      {
        on_enter: scene_directions.bezier_path_to_mars,
        on_idle: scene_directions.spin_in_place,
        on_progress: scene_directions.progress_mars,
        on_failure: scene_directions.mars_failure,
        on_end: scene_directions.ready_for_earth
      }, true, true );
    this.Earth = new Dictum( [ workflow.profile_display, workflow.ping_me, workflow.offer_contact ],
      {
        on_enter: scene_directions.bezier_path_to_earth,
        on_idle: scene_directions.spin_in_place,
        on_progress: scene_directions.progress_earth,
        on_failure: scene_directions.earth_failure,
        on_end: [ scene_directions.back_into_bridge, scene_directions.ready_for_ship ]
      }, true, true );
    this.Ship = new Dictum( workflow.user_interface_demo,
      {
        on_enter: scene_directions.overlay_interface,
        on_idle: scene_directions.bridge_view,
        on_progress: scene_directions.progress_ship,
        on_failure: scene_directions.ship_failure,
        on_end: scene_directions.ready_for_anything
      }, true, true );
  }
}

export { Manifesto }
