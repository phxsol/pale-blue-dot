// ScreenDirector Reference
import { Screenplay as _Screenplay, SceneAsset3D } from '../bin/ScreenDirector.js';
// Support Library Reference
import * as THREE from 'three';
import { GLTFLoader } from '../lib/GLTFLoader.js';

// Constant Definitions
const LIGHT = {
  night: 0x050505,
  evening: 0x526079,
  theater: 0x555555,
  indoor: 0x999999,
  day: 0xffffff,
  off: 0x000000,
  green: 0x00ff00,
  red: 0xff0000,
  blue: 0x0000ff
};
const VIEW = {
  fov: 45,
  aspect: window.innerWidth / window.innerHeight,
  near: 0.1,
  far: 100000000000000
};

// Screenplay Implementation
class Screenplay extends _Screenplay{
  actors = {

    // Neptune
    get Neptune(){
      let _map = new THREE.TextureLoader().load('resources/neptunemap.jpg');
      let _mesh = new THREE.Mesh(
        new THREE.SphereGeometry( 24622000, 64, 32 ),
        new THREE.MeshStandardMaterial( { map: _map, metalness: 1 } )
      );
      _mesh.castShadow = true;
			_mesh.receiveShadow = true;
      //_mesh.position.set( -4498410000000, 0, 11 );
      _mesh.position.set( 4498410000000, 0, 0 );
      _mesh.name = 'Neptune';
      let neptune = new SceneAsset3D( _mesh );
      neptune.directions.set( 'revolve', function(){
        neptune.rotation.y += .0000036135;
      });
      neptune.surface_distance = 24622000;
      neptune.orbital_distance = 3 * 34820000;
      neptune.orbital_vector = new THREE.Vector3( 34820000, 34820000, 34820000 );

      delete this.Neptune;
      return this.Neptune = neptune;
    },

    // Uranus
    get Uranus(){
      let _map = new THREE.TextureLoader().load('resources/uranusmap.jpg');
      let _mesh = new THREE.Mesh(
        new THREE.SphereGeometry( 25362000, 64, 32 ),
        new THREE.MeshStandardMaterial( { map: _map, metalness: 1 } )
      );
      _mesh.castShadow = true;
			_mesh.receiveShadow = true;
      _mesh.name = 'Uranus';
      _mesh.position.set( -2870933609000, 0, -870933609000 );
      //_mesh.position.set( 2870933609000, 0, 0 );
      let uranus = new SceneAsset3D( _mesh );
      uranus.directions.set( 'revolve', function(){
        uranus.rotation.y -= .0000033824;
      });
      uranus.surface_distance = 25362000;
      uranus.orbital_distance = 3 * 35867000;
      uranus.orbital_vector = new THREE.Vector3( 35867000, 35867000, 35867000 );
      delete this.Uranus;
      return this.Uranus = uranus;
    },

    // Saturn
    get Saturn(){
      const _ring_texture = new THREE.TextureLoader().load( 'resources/saturnringcolor.jpg' );
      const _ring_geometry = new THREE.RingBufferGeometry( 65232000, 138232000, 64 );
      var pos = _ring_geometry.attributes.position;
      var v3 = new THREE.Vector3();

      for (let i = 0; i < pos.count; i++){
        v3.fromBufferAttribute( pos, i );
        _ring_geometry.attributes.uv.setXY( i, v3.length() < 101732000 ? 0 : 1, 1 );
      }
      const _ring_material = new THREE.MeshStandardMaterial({
        map: _ring_texture,
        color: 0x777777,
        side: THREE.DoubleSide,
        roughness: 1,
        metalness: 0
      });
      const _rings_mesh = new THREE.Mesh( _ring_geometry, _ring_material );
      _rings_mesh.castShadow = true;
			_rings_mesh.receiveShadow = true;
      _rings_mesh.name = 'Saturnal Rings';

      let _map = new THREE.TextureLoader().load( 'resources/saturnmap.jpg' );
      let _mesh = new THREE.Mesh(
        new THREE.SphereGeometry( 58232000, 64, 32 ),
        new THREE.MeshStandardMaterial( { map: _map, metalness: 1 } )
      );
      _mesh.castShadow = true;
			_mesh.receiveShadow = true;
      _mesh.name = 'Saturn';
      _mesh.position.set( 1433537000000, 0, 1433537000000 );
      //_mesh.position.set( 1433537000000, 0, 0 );
      _mesh.add( _rings_mesh );
      let saturn = new SceneAsset3D( _mesh );
      saturn.directions.set( 'revolve', function(){
        saturn.rotation.y += .000005437;
      });
      saturn.surface_distance = 58232000;
      saturn.orbital_distance = 3 * 82352000;
      saturn.orbital_vector = new THREE.Vector3( 82352000, 82352000, 82352000 );
      delete this.Saturn;
      return this.Saturn = saturn;
    },

    // Jupiter
    get Jupiter(){
      let _map = new THREE.TextureLoader().load('resources/jupitermap.jpg');
      let _mesh = new THREE.Mesh(
        new THREE.SphereGeometry( 69911000, 64, 32 ),
        new THREE.MeshStandardMaterial( { map: _map, metalness: 1 } )
      );
      _mesh.castShadow = true;
			_mesh.receiveShadow = true;
      _mesh.name = 'Jupiter';
      _mesh.position.set( 778477400000, 0, -778477400000 );
      //_mesh.position.set( 778477400000, 0, 0 );
      let jupiter = new SceneAsset3D( _mesh );
      jupiter.directions.set( 'revolve', function(){
        jupiter.rotation.y += .0000058765;
      });
      jupiter.surface_distance = 69911000;
      jupiter.orbital_distance = 3 * 98869000;
      jupiter.orbital_vector = new THREE.Vector3( 98869000, 98869000, 98869000 );
      delete this.Jupiter;
      return this.Jupiter = jupiter;
    },

    // Mars
    get Mars(){
      let _map = new THREE.TextureLoader().load('resources/mars_1k_color.jpg');
      let _topo = new THREE.TextureLoader().load('resources/mars_1k_topo.jpg');
      let _mesh = new THREE.Mesh(
        new THREE.SphereGeometry( 3389000, 64, 32 ),
        new THREE.MeshStandardMaterial( { map: _map, displacementMap: _topo, metalness: 1 } )
      );
      _mesh.castShadow = true;
			_mesh.receiveShadow = true;
      _mesh.name = 'Mars';
      _mesh.position.set( 227939366000, 0, 227939366000 );
      //_mesh.position.set( 227939366000, 0, 0 );
      let mars = new SceneAsset3D( _mesh );
      mars.directions.set( 'revolve', function(){
        mars.rotation.y += .0000023649;
      });
      mars.surface_distance = 3389000;
      mars.orbital_distance = 3 * 4792000;
      mars.orbital_vector = new THREE.Vector3( 4792000, 4792000, 4792000 );
      delete this.Mars;
      return this.Mars = mars;
    },

    // Earth
    get Earth(){
      let _map = new THREE.TextureLoader().load('resources/earthmap1k.jpg');
      let _spec = new THREE.TextureLoader().load('resources/earthspec1k.jpg');
      let _bump = new THREE.TextureLoader().load('resources/earthbump1k.jpg');
      let _cloud = new THREE.TextureLoader().load('resources/earthcloudmap.jpg');
      let _cloud_trans = new THREE.TextureLoader().load('resources/earthcloudmaptrans.jpg');
      let _lights = new THREE.TextureLoader().load('resources/earthlights1k.jpg');
      let _emissive = new THREE.TextureLoader().load('resources/earthlights1k_dark.jpg');
      let _lights_negative = new THREE.TextureLoader().load('resources/earthlights1k_negative.jpg');
      let _mesh = new THREE.Mesh(
        new THREE.SphereGeometry( 6371000, 64, 32 ),
        new THREE.MeshStandardMaterial( { map: _map, emissive: 0xffffff, emissiveMap: _emissive, metalness: 1 } )
      );
      _mesh.castShadow = true;
			_mesh.receiveShadow = true;
      _mesh.position.set( 149598023000, 0, 149598023000 );
      //_mesh.position.set( 149598023000, 0, 0 );
      let earth = new SceneAsset3D( _mesh );
      earth.name = 'Earth';
      earth.directions.set( 'revolve', function(){
        earth.rotation.y += .000002424;
      });
      earth.surface_distance = 6371000;
      earth.orbital_distance = 3 * 9009000;
      earth.orbital_vector = new THREE.Vector3( 9009000, 9009000, 9009000 );
      delete this.Earth;
      return this.Earth = earth;
    },

    get Moon(){
      let _map = new THREE.TextureLoader().load('resources/moonmap1k.jpg');
      let _bump = new THREE.TextureLoader().load('resources/moonbump1k.jpg');
      let _mesh = new THREE.Mesh(
        new THREE.SphereGeometry( 1735500, 64, 32 ),
        new THREE.MeshStandardMaterial( { map: _map, bumpMap: _bump, metalness: 1 })
      );
      _mesh.castShadow = true;
			_mesh.receiveShadow = true;
      _mesh.position.set( 149982422000, 0, 149598023000 );
      //_mesh.position.set( 149982422000, 0, 0 );
      let moon = new SceneAsset3D( _mesh );
      moon.name = 'Moon';
      moon.directions.set( 'revolve', function(){
        moon.rotation.y += .000000088726;
      });
      moon.surface_distance = 1735500;
      moon.orbital_distance = 3 * 2454000;
      moon.orbital_vector = new THREE.Vector3( 2454000, 2454000, 2454000 );
      delete this.Moon;
      return this.Moon = moon;
    },

    // Earth
    get Venus(){
      let _map = new THREE.TextureLoader().load('resources/venusmap.jpg');
      let _bump = new THREE.TextureLoader().load('resources/venusbump.jpg');
      let _mesh = new THREE.Mesh(
        new THREE.SphereGeometry( 6052000, 64, 32 ),
        new THREE.MeshStandardMaterial( { map: _map, bumpMap: _bump, metalness: 1 } )
      );
      _mesh.castShadow = true;
			_mesh.receiveShadow = true;
      _mesh.position.set( 108200000000, 0, -108200000000 );
      //_mesh.position.set( 108200000000, 0, 0 );
      let venus = new SceneAsset3D( _mesh );
      venus.name = 'Venus';
      venus.directions.set( 'revolve', function(){
        venus.rotation.y -= .00000000997;
      });
      venus.surface_distance = 6052000;
      venus.orbital_distance = 3 * 8558820;
      venus.orbital_vector = new THREE.Vector3( 8558820, 8558820, 8558820 );
      delete this.Venus;
      return this.Venus = venus;
    },

    // Earth
    get Mercury(){
      let _map = new THREE.TextureLoader().load('resources/mercurymap.jpg');
      let _bump = new THREE.TextureLoader().load('resources/mercurybump.jpg');
      let _mesh = new THREE.Mesh(
        new THREE.SphereGeometry( 2439500, 64, 32 ),
        new THREE.MeshStandardMaterial( { map: _map, bumpMap: _bump, metalness: 1 } )
      );
      _mesh.castShadow = true;
			_mesh.receiveShadow = true;
      _mesh.position.set( 57900000000, 0, 7900000000 );
      //_mesh.position.set( 57900000000, 0, 0 );
      let mercury = new SceneAsset3D( _mesh );
      mercury.name = 'Mercury';
      mercury.directions.set( 'revolve', function(){
        mercury.rotation.y += .00000004133;
      });
      mercury.surface_distance = 2439500;
      mercury.orbital_distance = 3 * 3449973;
      mercury.orbital_vector = new THREE.Vector3( 3449973, 3449973, 3449973 );
      delete this.Mercury;
      return this.Mercury = mercury;
    },

    // Sun
    get Sun(){
      let _map = new THREE.TextureLoader().load('resources/solarmap.jpg');
      let _spec = new THREE.TextureLoader().load('resources/sunmap.jpg');
      let _mesh = new THREE.Mesh(
        new THREE.SphereGeometry( 695508000, 64, 32 ),
        new THREE.MeshBasicMaterial( { map: _map, side: THREE.DoubleSide, wireframe: true } )
      );
      _mesh.castShadow = false;
			_mesh.receiveShadow = false;
      _mesh.name = 'Sun';
      _mesh.position.set( 0, 0, 0 );
      let sun = new SceneAsset3D( _mesh );
      sun.directions.set( 'revolve', function(){
        sun.rotation.y += .00000008978;
      });
      sun.surface_distance = 695508000;
      sun.orbital_distance = 3 * 983596000;
      sun.orbital_vector = new THREE.Vector3( 983596000, 983596000, 983596000);
      delete this.Sun;
      return this.Sun = sun;
    },

    // Ship
    get Ship(){

      let loading = new Promise( ( resolve, reject )=>{
        const loader = new GLTFLoader();
        loader.load( 'models/bridge.glb',
          async ( gltf )=>{

            let ship = new THREE.Group();
            ship = gltf.scene;
            let _bulkhead_mat = new THREE.MeshStandardMaterial( { color: 0x777777, roughness: 1, metalness: 1, side: THREE.DoubleSide } );
            let _bulkhead = ship.getObjectByName( 'Bulkhead' );
            _bulkhead.castShadow = true;
            _bulkhead.receiveShadow = true;
            _bulkhead.material = _bulkhead_mat;
            ship.bulkhead = _bulkhead;
            ship.bulkhead.visible = false;

            let _bulkhead_open = ship.getObjectByName( 'BulkheadOpen' );
            _bulkhead_open.castShadow = true;
            _bulkhead_open.receiveShadow = true;
            _bulkhead_open.material = _bulkhead_mat;
            ship.bulkhead_open = _bulkhead_open;
            ship.bulkhead_open.visible = true;

            let _aft_wall = ship.getObjectByName( 'Aft_Wall' );
            _aft_wall.castShadow = true;
            _aft_wall.receiveShadow = true;
            _aft_wall.material = _bulkhead_mat;
            ship.aft_wall = _aft_wall;

            let _light = ship.getObjectByName( 'Light' ).children[ 0 ];
            _light.intensity = 1;
            _light.distance = 100;
            _light.decay = 1;
            //_light.position.add( new THREE.Vector3( 0, -2, 0) );
            ship.light = _light;

            let _station_mats = new THREE.MeshStandardMaterial( { color: 0x222222, roughness: 1, metalness: 0.5 } );
            let _ops_station = ship.getObjectByName( 'OpsStation' );
            _ops_station.castShadow = true;
            _ops_station.receiveShadow = true;
            _ops_station.material = _station_mats;
            ship.ops_station = _ops_station;
            //let _conn_station = ship.getObjectByName( 'ConnStation' );
            //_conn_station.castShadow = true;
            //_conn_station.receiveShadow = true;
            //_conn_station.material = _station_mats;
            //ship.conn_station = _conn_station;
            let _sec_station = ship.getObjectByName( 'SecurityStation' );
            _sec_station.castShadow = true;
            _sec_station.receiveShadow = true;
            _sec_station.material = _station_mats;
            ship.sec_station = _sec_station;
            let _conference_table = ship.getObjectByName( 'Conference__Table' );
            _conference_table.castShadow = true;
            _conference_table.receiveShadow = true;
            _conference_table.material = _station_mats;
            ship.conference_table = _conference_table;

            // Generate the Warp Tunnel Structure and Effects
            let cloud_boiling_texture = new THREE.TextureLoader().load( 'textures/effects/cloud_boiling.jpg' );
            let clouds_clouds_clouds_texture = new THREE.TextureLoader().load( 'textures/effects/clouds_clouds_clouds.jpg' );
            let cloud_patches_texture = new THREE.TextureLoader().load( 'textures/effects/cloud_patches.jpg' );
            let cloud_ribbons_texture = new THREE.TextureLoader().load( 'textures/effects/cloud_ribbons.jpg' );
            let clouds_noclouds_texture = new THREE.TextureLoader().load( 'textures/effects/clouds_noclouds.jpg' );

            let _warp_tunnel = []
            _warp_tunnel.push( ship.getObjectByName( 'Warp_Cone000' ) );
            _warp_tunnel.push( ship.getObjectByName( 'Warp_Cone001' ) );
            _warp_tunnel.push( ship.getObjectByName( 'Warp_Cone002' ) );
            _warp_tunnel.push( ship.getObjectByName( 'Warp_Cone003' ) );
            _warp_tunnel.push( ship.getObjectByName( 'Warp_Cone004' ) );
            _warp_tunnel.push( ship.getObjectByName( 'Warp_Cone005' ) );
            _warp_tunnel.push( ship.getObjectByName( 'Warp_Cone006' ) );

            let warp_tunnel = new THREE.Group();
            for( let cone_ndx=0; cone_ndx<_warp_tunnel.length; cone_ndx++ ){

              let primary_shell = new SceneAsset3D( _warp_tunnel[ cone_ndx ] );
              let secondary_shell = new SceneAsset3D( _warp_tunnel[ cone_ndx ].clone( false ) );
              let tertiary_shell = new SceneAsset3D( _warp_tunnel[ cone_ndx ].clone( false ) );

              primary_shell.material = new THREE.MeshStandardMaterial( { color: 0x000000, emissive: 0x040bff, wireframe: true, roughness: 0, side: THREE.DoubleSide, alphaMap: cloud_boiling_texture, alphaTest: 0.5, transparent: true, opacity: 0.9 } );
              secondary_shell.material = new THREE.MeshStandardMaterial( { color: 0x000000, emissive: 0x0000ff,   roughness: 0, side: THREE.DoubleSide, alphaMap: clouds_clouds_clouds_texture, alphaTest: 0.7, transparent: true, opacity: 0.8});
              tertiary_shell.material = new THREE.MeshStandardMaterial( { color: 0x000000, emissive: 0xffffff, wireframe: true, roughness: 0, side: THREE.DoubleSide, alphaMap: cloud_ribbons_texture, alphaTest: 0.7, transparent: true, opacity: 0.9 });

              primary_shell.directions.set( 'revolve', function( delta, warp_speed ){
                if( warp_speed > 0 ) primary_shell.rotation.y += 1.5 * warp_speed;
              });
              secondary_shell.directions.set( 'revolve', function( delta, warp_speed ){
                if( warp_speed > 0 ) secondary_shell.rotation.y -= 1 * warp_speed;
              });
              tertiary_shell.directions.set( 'revolve', function( delta, warp_speed ){
                if( warp_speed > 0 ) tertiary_shell.rotation.y += 0.5 * warp_speed;
              });

              warp_tunnel.add( primary_shell );
              warp_tunnel.add( secondary_shell );
              warp_tunnel.add( tertiary_shell );
            }
            ship.warp_tunnel = warp_tunnel;


            // Define Key Navigation Data
            let _fwd = ship.getObjectByName( 'NavdotForward' );
            let navdot_forward = new THREE.Mesh(
              new THREE.SphereGeometry( 0.01, 64, 32 ),
              new THREE.MeshBasicMaterial( { color: 0x0000ff } )
            );
            navdot_forward.position.copy( _fwd.position );

            let _awd = ship.getObjectByName( 'NavdotAftward' );
            let navdot_aftward = new THREE.Mesh(
              new THREE.SphereGeometry( 0.01, 64, 32 ),
              new THREE.MeshBasicMaterial( { color: 0xff0000 } )
            );
            navdot_aftward.position.copy( _awd.position );

            let _al = new THREE.Line3( _awd.position, _fwd.position );
            let _al_geometry = new THREE.BufferGeometry().setFromPoints( [ _al.start, _al.end ] );
            let _al_material = new THREE.LineBasicMaterial( { color: 0xff00ff } );
            let a_line = new THREE.Line( _al_geometry, _al_material );
            a_line.visible = false;

            let _sl_ctrl = new THREE.Vector3();
            _al.at( 1, _sl_ctrl );
            _sl_ctrl.add( new THREE.Vector3( 0, 0, 0 ));
            let _sl = new THREE.QuadraticBezierCurve3( new THREE.Vector3( 0,-1,0 ), _fwd.position, new THREE.Vector3( 0,3,0 ) );
            let  _sl_points = _sl.getPoints( 50 );
            let  _sl_geometry = new THREE.BufferGeometry().setFromPoints( _sl_points );
            let  _sl_material = new THREE.LineBasicMaterial( { color: 0xffffff } );
            let  sight_line = new THREE.Line( _sl_geometry, _sl_material );
            sight_line.visible = false;

            let _st_v = new THREE.Vector3();
            _sl.getPointAt( 0.55, _st_v);
            let sight_target = new THREE.Mesh(
              new THREE.TorusKnotGeometry( 1, 1, 3, 3, 3, 3 ),
              new THREE.MeshBasicMaterial( { color: 0xffffff } )
            );
            sight_target.position.copy( _st_v );

            let nav_dots = {
              forward: navdot_forward,
              aftward: navdot_aftward,
              sight_target: sight_target
            }
            let nav_lines = {
              a_line: a_line,
              sight_line: sight_line
            };
            ship.NavDots = nav_dots;
            ship.NavLines = nav_lines;
            ship.add( sight_target ); // As a child, the position will update.
            ship.add( sight_line );

            ship.cameras = new Map();
            gltf.cameras.forEach( (camera)=>{
              ship.cameras.set( camera.parent.name, camera );
            });
            let _cap_cam = ship.cameras.get( 'CaptainCam');

            ship.viewscreen = ship.getObjectByName( 'Viewscreen' );
            ship.viewscreen.material.transparent = true;
            ship.viewscreen.material.opacity = 0.17;
            ship.viewscreen.visible = true;

            ship.name = "Ship";
            let ship_asset = new SceneAsset3D( ship );
            resolve( ship_asset );
          },
          async function ( xhr ) {
            // TODO: Add Repair progress functionality... if needed.
            //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
          },
          async ( err )=>{
            console.error( err );
            reject( err );
          }
        );
      });


      return (async () => {
        try {
          return await loading.then(( ship )=>{

            delete this.Ship;
            return this.Ship = ship;

          })
        } catch(e) {
          return 0; // fallback value;
        }
      })();
    }

  };
  lights = {
    get point_light(){
      delete this.point_light;
      this.point_light = new THREE.PointLight( 0xffffff, 2.5, 0, 2 );
      this.point_light.castShadow = true;
      this.point_light.shadow.bias = - 0.005; // reduces self-shadowing on double-sided objects
      this.point_light.shadow.camera.near = VIEW.near;
      this.point_light.shadow.camera.far = VIEW.far;

      return this.point_light;
    },
    get ambient_light(){
      delete this.ambient_light;
      return this.ambient_light = new THREE.AmbientLight( LIGHT.evening ) ;
    }
  };
  cameras;
  actions = {
    warp_to: async ( planetary_body, equidistant_orbit = false, arrival_emitter = false ) =>{
      // Find yourself.
      let pov_posi = new THREE.Vector3().copy( this.actors.Ship.position );
      // Set the arrival coordinates.
      let orbit_distance = planetary_body.orbital_distance;
      let surface_distance = planetary_body.surface_distance;
      let target_posi = planetary_body.position.clone();
      // Determine the travel path to the destination.
      if(pov_posi.distanceTo( target_posi ) == 0) target_posi = this.actors.Ship.NavDots.forward.position;
      let travel_path = new THREE.Line3( pov_posi, target_posi );
      let travel_distance = Math.floor( travel_path.distance() );
      if( travel_distance > orbit_distance ) {
        let _target_distance = ( equidistant_orbit ) ? travel_distance - surface_distance - 1000000 : travel_distance - orbit_distance;
        let _path_diff_ratio = _target_distance / travel_distance;
        travel_path.at( _path_diff_ratio, target_posi );
        travel_path = new THREE.Line3( pov_posi, target_posi );
        travel_distance = Math.floor( travel_path.distance() );

      } else {
        let _target_distance = ( equidistant_orbit ) ? travel_distance - surface_distance - 1000000 : travel_distance - orbit_distance;
        let _path_diff_ratio = _target_distance / travel_distance;
        travel_path.at( _path_diff_ratio, target_posi );
        travel_path = new THREE.Line3( pov_posi, target_posi );
        travel_distance = Math.floor( travel_path.distance() );
      }
      var iniQ = new THREE.Quaternion().copy( this.actors.Ship.quaternion ).normalize();
      this.actors.Ship.lookAt( ...target_posi );
      this.actors.Ship.updateMatrixWorld( true );
      //var rotationMatrix = new THREE.Matrix4().extractRotation( this.actors.Ship.matrixWorld );
      var endQ = new THREE.Quaternion().copy( this.actors.Ship.quaternion ).normalize();
      this.actors.Ship.quaternion.copy( iniQ );
      this.actors.Ship.updateMatrixWorld( true );
      let _quat_diff = iniQ.angleTo( endQ );

      let plotted_course_cache = {
        iniQ: iniQ,
        endQ: endQ,
        path: travel_path,
        up_now: this.actors.Ship.up.clone(),
        turn_duration: Math.max( 100, Math.ceil( _quat_diff * ( 250 / Math.PI ) ) ),
        travel_duration: Math.ceil( 100 + ( travel_distance / 15000000000 ) ),
        warp_duration: 15,
        duration: this.turn_duration + this.travel_duration,  // TODO: Vary this by the travel_distance to target
        frame: 0,
        locking_on: false,
        locked_on: false,
        warping: false,
        warp_speed: 0,
        warp_tunnel_buildup: 250,
        warped: false,
        at_destination: false,
        completed: false,
        cleanup_phase: false,
        arrival_emitter: arrival_emitter
      }
      let plotted_course = {
        update: ( )=>{

          let cache = plotted_course.cache;
          let user_control = this.active_cam.user_control;
          let cam_name = this.active_cam.name;

          // Call this last to clear the function
          if( cache.completed ){

            this.updatables.delete( 'warp_to' );
            let a = cache.arrival_emitter;
            if ( a && a instanceof Function ) {
              a();
            } else if( a && a.dictum_name && a.ndx ) {
              a.director.emit( `${a.dictum_name}_progress`, a.dictum_name, a.ndx );
            }
          } else {
            // Turn toward the destination.
            if( !cache.locked_on && cache.frame <= cache.turn_duration ){

              // Turn the ship toward the target.
              let _tprog = cache.frame / cache.turn_duration;
              let turn_progress = _tprog ** (10-(10.05*_tprog));

              let curQ = new THREE.Quaternion().slerpQuaternions( iniQ, endQ, turn_progress ).normalize();
              this.actors.Ship.quaternion.copy( curQ );

              this.actors.Ship.updateMatrixWorld( true );
              var rotationMatrix = new THREE.Matrix4().extractRotation( this.actors.Ship.matrixWorld );
              var up_now = new THREE.Vector3( 0, 1, 0 ).applyMatrix4( rotationMatrix ).normalize();

              this.actors.Ship.up.lerpVectors( cache.up_now, up_now, _tprog );

              this.actors.Ship.warp_tunnel.quaternion.copy( curQ );

              let sight_target = new THREE.Vector3();

              let cam_pos = new THREE.Vector3();
              cam_name = this.active_cam.name;
              switch( cam_name ){
                case 'Center':

                  break;
                case '3rdPerson':
                    this.actors.Ship.getWorldPosition( sight_target );
                    this.active_cam.lookAt( sight_target );
                  break;

                case 'CaptainCam':
                    this.actors.Ship.NavDots.sight_target.getWorldPosition( sight_target );
                    this.active_cam.up.lerpVectors( cache.up_now, up_now, turn_progress );
                    this.active_cam.lookAt( sight_target );
                  break;
              }
              if( this.controls.orbit_controls ) this.controls.orbit_controls.target.copy( sight_target );
              this.active_cam.updateProjectionMatrix();
  /*
                let sight_target = new THREE.Vector3();
                let cam_name = this.active_cam.name;
                let cam_pos = new THREE.Vector3();
                switch( cam_name ){
                  case 'Center':
                    //this.actors.Ship.conn_station.getWorldPosition( sight_target );
                    break;
                  case '3rdPerson':

                    ship.getWorldPosition( cam_pos );
                    cam_pos.add( new THREE.Vector3( 100, 100, 100 ) );
                    ship.getWorldPosition( sight_target );
                    this.active_cam.position.copy( cam_pos );
                    this.active_cam.lookAt( sight_target );
                    break;
                  case 'CaptainCam':
                    this.actors.Ship.NavDots.sight_target.getWorldPosition( sight_target );
                    this.cameras.get( cam_name ).getWorldPosition( cam_pos );
                    this.active_cam.position.copy( cam_pos );
                    this.active_cam.up.lerpVectors( this.scene.updates.cache.up_now, up_now, turn_progress );
                    this.active_cam.lookAt( sight_target );
                    break;
                }

  */
            }

            // Target Locked Captain
            else if( !cache.locked_on && ! cache.locking_on ) {

              cache.locking_on = true;
              setTimeout( ()=>{
                cache.locked_on = true;
                cache.warping = true;
                cache.frame = 0;
              }, 1000);

            }

            // Engage!
            else if( cache.locked_on ) {

              // Distort First-Person Space-Time
              if( cache.warping && cache.frame <= cache.warp_duration ){

                let _wprog = cache.frame / cache.warp_duration;
                let warp_progress = _wprog ** (10-(10.05*_wprog));
                let warp_zoom = THREE.MathUtils.lerp( 0.1, 1, warp_progress );
                cam_name = this.active_cam.name;
                switch( cam_name ){
                  case 'Center':

                    break;
                  case '3rdPerson':
                    this.active_cam.zoom = warp_zoom;
                    break;

                  case 'CaptainCam':
                    this.active_cam.zoom = warp_zoom;
                    break;
                }
                this.active_cam.updateProjectionMatrix();

                if( cache.frame >= cache.warp_duration ) {
                  cache.warping = false;
                  cache.frame = 0;
                }

              }

              // Stop the ship!
              else if( cache.warped && cache.frame <= cache.warp_duration ){

                let _wprog = cache.frame / cache.warp_duration;
                let warp_progress = _wprog ** (1.5-_wprog);
                let warp_zoom = THREE.MathUtils.lerp( 1.5, 1, warp_progress );
                cam_name = this.active_cam.name;
                switch( cam_name ){
                  case 'Center':

                    break;
                  case '3rdPerson':
                    this.active_cam.zoom = warp_zoom;
                    break;

                  case 'CaptainCam':
                    this.active_cam.zoom = warp_zoom;
                    break;
                }

                this.active_cam.updateProjectionMatrix();
                // Stopped stopping.
                if( cache.frame >= cache.warp_duration ) {
                  cache.warped = false;
                  cache.frame = 0;
                }

              }

              // Begin travelling within a warp tunnel
              else {

                if( !cache.at_destination && cache.frame <= cache.travel_duration ){

                  // The warp tunnel appears gradually along the process of travelling.
                  let tunnel_progress = ( cache.frame<= cache.warp_tunnel_buildup ) ? cache.frame / cache.warp_tunnel_buildup :  1;
                  if( !this.actors.Ship.warp_tunnel.children[0].visible && tunnel_progress > 0.01 ) this.actors.Ship.warp_tunnel.children[0].visible = true;
                  if( !this.actors.Ship.warp_tunnel.children[1].visible && tunnel_progress > 0.02 ) this.actors.Ship.warp_tunnel.children[1].visible = true;
                  if( !this.actors.Ship.warp_tunnel.children[2].visible && tunnel_progress > 0.03 ) this.actors.Ship.warp_tunnel.children[2].visible = true;
                  if( !this.actors.Ship.warp_tunnel.children[3].visible && tunnel_progress > 0.04 ) this.actors.Ship.warp_tunnel.children[3].visible = true;
                  if( !this.actors.Ship.warp_tunnel.children[4].visible && tunnel_progress > 0.05 ) this.actors.Ship.warp_tunnel.children[4].visible = true;
                  if( !this.actors.Ship.warp_tunnel.children[5].visible && tunnel_progress > 0.06 ) this.actors.Ship.warp_tunnel.children[5].visible = true;
                  if( !this.actors.Ship.warp_tunnel.children[6].visible && tunnel_progress > 0.07 ) this.actors.Ship.warp_tunnel.children[6].visible = true;
                  if( !this.actors.Ship.warp_tunnel.children[7].visible && tunnel_progress > 0.08 ) this.actors.Ship.warp_tunnel.children[7].visible = true;
                  if( !this.actors.Ship.warp_tunnel.children[8].visible && tunnel_progress > 0.09 ) this.actors.Ship.warp_tunnel.children[8].visible = true;
                  if( !this.actors.Ship.warp_tunnel.children[9].visible && tunnel_progress > 0.10 ) this.actors.Ship.warp_tunnel.children[9].visible = true;
                  if( !this.actors.Ship.warp_tunnel.children[10].visible && tunnel_progress > 0.10 ) this.actors.Ship.warp_tunnel.children[10].visible = true;
                  if( !this.actors.Ship.warp_tunnel.children[11].visible && tunnel_progress > 0.10 ) this.actors.Ship.warp_tunnel.children[11].visible = true;
                  if( !this.actors.Ship.warp_tunnel.children[12].visible && tunnel_progress > 0.10 ) this.actors.Ship.warp_tunnel.children[12].visible = true;
                  if( !this.actors.Ship.warp_tunnel.children[13].visible && tunnel_progress > 0.10 ) this.actors.Ship.warp_tunnel.children[13].visible = true;
                  if( !this.actors.Ship.warp_tunnel.children[14].visible && tunnel_progress > 0.20 ) this.actors.Ship.warp_tunnel.children[14].visible = true;
                  if( !this.actors.Ship.warp_tunnel.children[15].visible && tunnel_progress > 0.20 ) this.actors.Ship.warp_tunnel.children[15].visible = true;
                  if( !this.actors.Ship.warp_tunnel.children[16].visible && tunnel_progress > 0.30 ) this.actors.Ship.warp_tunnel.children[16].visible = true;
                  if( !this.actors.Ship.warp_tunnel.children[17].visible && tunnel_progress > 0.30 ) this.actors.Ship.warp_tunnel.children[17].visible = true;
                  if( !this.actors.Ship.warp_tunnel.children[18].visible && tunnel_progress > 0.40 ) this.actors.Ship.warp_tunnel.children[18].visible = true;
                  if( !this.actors.Ship.warp_tunnel.children[19].visible && tunnel_progress > 0.40 ) this.actors.Ship.warp_tunnel.children[19].visible = true;
                  if( !this.actors.Ship.warp_tunnel.children[20].visible && tunnel_progress > 0.50 ) this.actors.Ship.warp_tunnel.children[20].visible = true;

                  // Increase the opacity of the tunnel as a whole during the ramp-up cycle (<=100 Frames) of the travel process.
                  if( tunnel_progress <= 1){
                    this.actors.Ship.warp_tunnel.children.forEach( ( cone )=>{
                      cone.material.opaciy = tunnel_progress / 2;
                    });
                  }
                  // TODO: Implement a color cycling algorithm for the warp tunnel.
                  for( let wc_ndx = 1; wc_ndx<this.actors.Ship.warp_tunnel.children.length; wc_ndx+=3){
                    //let color = (16777215 / 500 * this.scene.updates.cache.frame).toString(16);
                    //this.actors.Ship.warp_tunnel.children[wc_ndx].material.color = color;
                  }
                  // Define progress linearly, and organically.
                  let _dprog = cache.frame / cache.travel_duration;
                  let travel_progress = _dprog ** ( 1.5-_dprog );

                  // Establish the next position to render
                  let next_pos = ( travel_progress < 1 ) ? new THREE.Vector3() : cache.path.end;
                  // ... don't over do it.
                  if( travel_progress < 1 ) cache.path.at( travel_progress, next_pos );

                  let _distance = new THREE.Line3( this.active_cam.position, next_pos ).distance();
                  // Define what Warp Speed is for this trip... FYI: Not analalogous to contemporary warp travel mathematics.
                  this.cache.warp_speed = cache.warp_speed = _distance /  1500000000;

                  let camship_pos_diff = new THREE.Vector3().subVectors( this.actors.Ship.position, this.active_cam.position );

                  let sight_target = new THREE.Vector3();
                  this.actors.Ship.position.copy( next_pos );
                  this.actors.Ship.updateMatrixWorld( true );
                  this.actors.Ship.warp_tunnel.position.copy( next_pos );
                  // TODO: REPLACE WITH CAMERA-INDEPENDANT TRAVEL
                  cam_name = this.active_cam.name;
                  switch( cam_name ){
                    case 'Center':

                      break;
                    case '3rdPerson':
                      this.active_cam.position.subVectors( next_pos, camship_pos_diff );

                      this.actors.Ship.getWorldPosition( sight_target );
                      this.active_cam.lookAt( sight_target );
                      break;

                    case 'CaptainCam':
                      this.active_cam.position.subVectors( next_pos, camship_pos_diff );

                      this.actors.Ship.NavDots.sight_target.getWorldPosition( sight_target );
                      this.active_cam.lookAt( sight_target );
                      break;
                  }

                  if( this.controls.orbit_controls ) this.controls.orbit_controls.target.copy( sight_target );
                  this.active_cam.updateProjectionMatrix();
  /*

                  if( !user_control ){
                    this.active_cam.position.subVectors( next_pos, camship_pos_diff );
                  } else {
                    this.active_cam.position.subVectors( next_pos, camship_pos_diff );
                    this.actors.Ship.NavDots.sight_target.getWorldPosition( this.controls.orbit_controls.target );
                    //this.active_cam.updateProjectionMatrix();
                  }
  */
                } else if( !cache.at_destination ) {

                  cache.at_destination = true;
                  cache.frame = 0;
                  cache.warped = true;

                  let _wd = 35;
                  this.actors.Ship.warp_tunnel.children.forEach( ( cone )=>{
                    setTimeout( ()=>{
                      cone.visible = false;
                    }, _wd+=35);
                  })
                  //alert( ' We have arrived Captain. @ Frame: ' + this.scene.updates.cache.frame.toString() );

                } else if ( cache.at_destination ) {

                  let ship = this.actors.Ship;
                  ship.updateMatrixWorld( true );
                  var rotationMatrix = new THREE.Matrix4().extractRotation( ship.matrixWorld );
                  var up_now = new THREE.Vector3( 0, 1, 0 ).applyMatrix4( rotationMatrix ).normalize();
                  let camship_pos_diff = new THREE.Vector3().subVectors( ship.position, this.active_cam.position  );
                  let sight_target = new THREE.Vector3();
                  cam_name = this.active_cam.name;
                  switch( cam_name ){
                    case 'Center':

                      break;
                    case '3rdPerson':
                      this.active_cam.position.subVectors( ship.position, camship_pos_diff );
                      ship.getWorldPosition( sight_target );
                      this.active_cam.updateProjectionMatrix();
                      break;

                    case 'CaptainCam':
                      this.active_cam.up = up_now;
                      this.active_cam.position.subVectors( ship.position, camship_pos_diff );
                      ship.NavDots.sight_target.getWorldPosition( sight_target );
                      this.active_cam.lookAt( sight_target );
                      this.active_cam.updateProjectionMatrix();

                      break;
                  }

                  cache.completed = true;
                  //alert( `Arrived at corrdinates: [ X:${this.actors.Ship.position.x}, Y:${this.actors.Ship.position.y}, Z:${this.actors.Ship.position.z} ]` );

                }
              }
            }
            cache.frame++;
          }
        },
        cache: plotted_course_cache
      }
      this.updatables.set('warp_to', plotted_course );
    },
    change_cam: async ( cam_name ) =>{
      let ship = this.actors.Ship;
      let new_position = new THREE.Vector3();
      let new_target_position = new THREE.Vector3();
      let major_dim = Math.max( window.innerHeight, window.innerWidth );
      let minor_dim = Math.min( window.innerHeight, window.innerWidth );

      switch( cam_name ){
        case 'Center':
          new_position.setY( 2 );
          new_position.setZ( major_dim );
          new_target_position = new THREE.Vector3();
          this.active_cam.up = new THREE.Vector3( 0, 1, 0 );
          break;
        case '3rdPerson':
          ship.getWorldPosition( new_position );
          new_position.add( new THREE.Vector3( 100, 200, 100 ) );
          ship.getWorldPosition( new_target_position );
          break;
        case 'CaptainCam':
          ship.getWorldPosition( new_position );
          ship.NavDots.sight_target.getWorldPosition( new_target_position );
          break;
      }
      this.active_cam.position.copy( new_position );
      this.active_cam.lookAt( new_target_position );
      if( this.controls.orbit_controls ) this.controls.orbit_controls.target.copy( new_target_position );
      this.active_cam.updateProjectionMatrix();
      this.active_cam.name = cam_name;

    },
    transform: async ( objects, targets, duration, arrival_emitter = false )=>{
      // Remove actively competing animations by resetting this engine.
      this.updatables.delete('ui_transform');
      delete this.ui_scene.updates;
      this.ui_scene.updates = {
        update: ()=>{},
        cache: {}
      };

      // Set the travel path to their target for each object.
      let paths = [];
      for ( let ndx = 0; ndx < objects.length; ndx++ ) {
        const object = objects[ ndx ];
        const target = targets[ ndx ];
        const path = new THREE.Line3( object.position, target.position );
        paths[ndx] = path;
      }

      let ui_transform_cache = {
        objects: objects,
        targets: targets,
        paths: paths,
        duration: duration,
        frame: 0,
        completed: false,
        arrival_emitter: arrival_emitter
      }
      let ui_transform = {
        update: ()=>{
          let cache = plotted_course.cache;

          // Call this last to clear the function
          if( cache.completed ){

            this.updatables.delete( 'ui_transform' );
            let a = cache.arrival_emitter;
            if ( a && a instanceof Function ) {
              a();
            } else if( a && a.dictum_name && a.ndx ) {
              a.director.emit( `${a.dictum_name}_progress`, a.dictum_name, a.ndx );
            }
          } else {

            let objects = this.ui_scene.updates.cache.objects;
            let targets = this.ui_scene.updates.cache.targets;
            let paths = this.ui_scene.updates.cache.paths;
            let _tprog = this.ui_scene.updates.cache.frame / this.ui_scene.updates.cache.duration;
            let transform_progress = _tprog ** (10-(10.05*_tprog));

            for ( let ndx = 0; ndx < objects.length; ndx++ ) {

              let new_pos = new THREE.Vector3();
              if ( this.ui_scene.updates.cache.frame === this.ui_scene.updates.cache.duration ) {
                new_pos = targets[ ndx ].position;
              } else {
                paths[ ndx ].at( transform_progress, new_pos );
              }
              let object = objects[ ndx ];
              object.position.copy( new_pos );
              object.lookAt( this.active_cam.position );
            }

          }
          if( ++this.ui_scene.updates.cache.frame >= this.ui_scene.updates.cache.duration ) this.ui_scene.updates.cache.completed = true;
        },
        cache: ui_transform_cache
      }
      this.updateables.set( 'ui_transform', ui_transform );
    }

  };
  SetSceneBackground = async ( )=>{

    const loader = new THREE.CubeTextureLoader();
				loader.setPath( 'textures/environment/' );
				let textureCube = await loader.load( [ 'corona_lf.png', 'corona_rt.png', 'corona_up_2.png', 'corona_dn_2.png', 'corona_ft.png', 'corona_bk.png'   ] );
				this.scene.background = textureCube;
  };
  props = {
    get SplashScreen(){
      let splash_screen = new THREE.Mesh(
        new THREE.PlaneGeometry( window.innerWidth, window.innerHeight ),
        new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} )
      );
      delete this.SplashScreen;
      return this.SplashScreen = splash_screen;
    },
    get HomeDome(){
      let major_dim = Math.max( window.innerWidth, window.innerHeight );
      let minor_dim = Math.min( window.innerWidth, window.innerHeight );
      let texture = new THREE.TextureLoader().load( 'resources/stone_floor.png' );
      // TODO: Tesselate a floor at your earliest convenience... currently only makes a single tile.
      let StageBuilder = ( size )=>{
        let stage = new THREE.Group();
        const stage_geometry = new THREE.CircleGeometry( 3 * major_dim, 6 );
        const stage_material = new THREE.MeshStandardMaterial( { color: 0x442222, side: THREE.DoubleSide, metalness: 1, roughness: 0.9 } );
        stage.add( new THREE.Mesh( stage_geometry, stage_material ) );
        stage.rotateX( - Math.PI / 2 );
        return stage;
      };
      let home_stage = StageBuilder( 42 ); // Currently disregards the parameter.
      home_stage.position.setY( -100 );
      let _dome = new THREE.Mesh(
        new THREE.SphereGeometry( major_dim * Math.PI, 64, 32, 0, 2*Math.PI, Math.PI/2, Math.PI ),
        new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.DoubleSide } )
      )
      _dome.position.setY( major_dim - 100 );
      let home_dome = new THREE.Group();
      home_dome.add( home_stage );
      home_dome.add( _dome );

      delete this.HomeDome;
      return this.HomeDome = home_dome;
    }
  }
  direct = ( delta )=>{
    let warp_speed = this.cache.warp_speed;
    warp_speed = ( !warp_speed ) ? 0 : warp_speed;
    this.actives.forEach( ( active, name )=>{
      active.directions.forEach( ( direction, name )=>{
        direction( delta, warp_speed );
      } );
    } );
  }

  /* Rendering Loop parameter values */
  cache = {};
  u_name = "";
  ups_test = {
    ticks: 0,
    duration: 0,
    stamps: [],
    max: -1,
    min: -1,
    score: 0
  };
  resume = {
    objects: [],
    targets: {
      timeline: [],
      table: [],
      sphere: [],
      helix: [],
      grid: []
    }
  };
  lil_gui: {}

  constructor( ){
    super( );

    let major_dim = Math.max( window.innerHeight, window.innerWidth );
    let minor_dim = Math.min( window.innerHeight, window.innerWidth );

    // Camera & Controls Setup
    let active_cam = new THREE.PerspectiveCamera( VIEW.fov, VIEW.aspect, VIEW.near, VIEW.far );
    this.active_cam = active_cam;
    this.actions.change_cam( 'Center' );

  }
}

export { Screenplay }
