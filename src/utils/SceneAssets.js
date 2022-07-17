import * as THREE from 'three';
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { FirstPersonControls } from './jsm/controls/FirstPersonControls.js';
import { RectAreaLightUniformsLib } from './jsm/lights/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper } from './jsm/helpers/RectAreaLightHelper.js';
import { SceneAssets as _SceneAssets, SceneAsset3D } from './ScreenDirector.js';
import TWEEN from '@tweenjs/tween.js';
import GUI from 'lil-gui';

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


class SceneAssets extends _SceneAssets{


  backgroundSceneryGenerator = ( star_count )=>{

    // Background Stars
    let _stars = new THREE.Group();
    function addStar(){
      const star_geometry = new THREE.SphereGeometry( THREE.MathUtils.randFloatSpread( 15 ), 6, 2 );
      const star_material = new THREE.MeshBasicMaterial( { color: 0xf0f0f0 } );
      const star = new THREE.Mesh( star_geometry, star_material );

      //const [x, y, z] = Array(3).fill().map( () => (Math.random() < 0.33) ? (Math.random() < 0.5) ? THREE.MathUtils.randFloat( -5000, -4000 ) : THREE.MathUtils.randFloat( 4000, 5000 ) : THREE.MathUtils.randFloatSpread( 10000 ));

      let _choice = ( Math.random() < 0.33 ) ? 1 : ( Math.random() < 0.5 ) ? 2 : 3;
      let x = ( _choice == 1 ) ? ( Math.random() < 0.5 ) ? THREE.MathUtils.randFloat( -5000000000000, -4000000000000 ) : THREE.MathUtils.randFloat( 5000000000000, 4000000000000 ) : THREE.MathUtils.randFloatSpread( 5000000000000 );
      let y = ( _choice == 2 ) ? ( Math.random() < 0.5 ) ? THREE.MathUtils.randFloat( -5000000000000, -4000000000000 ) : THREE.MathUtils.randFloat( 5000000000000, 4000000000000 ) : THREE.MathUtils.randFloatSpread( 5000000000000 );
      let z = ( _choice == 3 ) ? ( Math.random() < 0.5 ) ? THREE.MathUtils.randFloat( -5000000000000, -4000000000000 ) : THREE.MathUtils.randFloat( 5000000000000, 4000000000000 ) : THREE.MathUtils.randFloatSpread( 5000000000000 );

      star.position.set( x, y, z );
      _stars.add( star );
    }

    Array( star_count ).fill().forEach( addStar );
    return _stars;
  };


  actors = {

    // Jumping Cube
    get jumping_cube(){
      let loading = new Promise((resolve, reject)=>{
        const loader = new GLTFLoader().setPath( 'models/' );
        loader.load( 'jumping_cube.glb',
          async ( gltf )=>{

            let _jumping_cube = gltf.scene.children[0];
            _jumping_cube.material = new THREE.MeshStandardMaterial( { color: LIGHT.green } );
            _jumping_cube.animations = gltf.animations;
            _jumping_cube.name = "Jumping Cube";
            let jumping_cube = new SceneAsset3D( _jumping_cube );
            jumping_cube.directions.set( 'revolve', function(){
              jumping_cube.rotation.y += .01;
            });
            jumping_cube.mixer = new THREE.AnimationMixer( jumping_cube );
            var keyAnimationClip = THREE.AnimationClip.findByName( jumping_cube.animations, 'CubeAction.Jump' );
            var action = jumping_cube.mixer.clipAction( keyAnimationClip );
        		action.play();
            resolve( jumping_cube );
          },
          async function ( xhr ) {
            // TODO: Repair progress functionality
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
        return await loading.then(( _jumping_cube )=>{
          delete this.jumping_cube;
          return this.jumping_cube = _jumping_cube;
        })
      } catch(e) {
        return 0; // fallback value;
      }
    })();
    },

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
      neptune.orbital_vector = new THREE.Vector3( 0, 34820000, 34820000 );

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
      uranus.orbital_vector = new THREE.Vector3( 0, 35867000, 35867000 );
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
      saturn.orbital_vector = new THREE.Vector3( 0, 82352000, 82352000 );
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
      jupiter.orbital_vector = new THREE.Vector3( 0, 98869000, 98869000 );
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
      mars.orbital_vector = new THREE.Vector3( 0, 4792000, 4792000 );
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
      earth.orbital_vector = new THREE.Vector3( 0, 9009000, 9009000 );
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
      moon.orbital_vector = new THREE.Vector3( 0, 2454000, 2454000 );
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
      venus.orbital_vector = new THREE.Vector3( 0, 8558820, 8558820 );
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
      mercury.orbital_vector = new THREE.Vector3( 0, 3449973, 3449973 );
      delete this.Mercury;
      return this.Mercury = mercury;
    },

    // Sun
    get Sun(){
      let _map = new THREE.TextureLoader().load('resources/solarmap.jpg');
      let _spec = new THREE.TextureLoader().load('resources/sunmap.jpg');
      let _mesh = new THREE.Mesh(
        new THREE.SphereGeometry( 695508000, 64, 32 ),
        new THREE.MeshBasicMaterial( { map: _map } )
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
      sun.orbital_vector = new THREE.Vector3( 0, 983596000, 983596000);
      delete this.Sun;
      return this.Sun = sun;
    },

    // Ship
    get Ship(){

      let loading = new Promise( ( resolve, reject )=>{
        const loader = new GLTFLoader();
        loader.load( 'models/bridge.glb',
          async ( gltf )=>{

            let _ship = new THREE.Group();
            _ship = gltf.scene;
            let _bulkhead_mat = new THREE.MeshStandardMaterial( { color: 0x777777, roughness: 1, metalness: 1, side: THREE.DoubleSide } );
            let _bulkhead = _ship.getObjectByName( 'Bulkhead' );
            _bulkhead.castShadow = true;
            _bulkhead.receiveShadow = true;
            _bulkhead.material = _bulkhead_mat;
            _ship.bulkhead = _bulkhead;
            _ship.bulkhead.visible = true;

            let _bulkhead_open = _ship.getObjectByName( 'BulkheadOpen' );
            _bulkhead_open.castShadow = true;
            _bulkhead_open.receiveShadow = true;
            _bulkhead_open.material = _bulkhead_mat;
            _ship.bulkhead_open = _bulkhead_open;
            _ship.bulkhead_open.visible = false;

            let _aft_wall = _ship.getObjectByName( 'Aft_Wall' );
            _aft_wall.castShadow = true;
            _aft_wall.receiveShadow = true;
            _aft_wall.material = _bulkhead_mat;
            _ship.aft_wall = _aft_wall;

            let _light = _ship.getObjectByName( 'Light' ).children[ 0 ];
            _light.intensity = 1;
            _light.distance = 100;
            _light.decay = 1;
            //_light.position.add( new THREE.Vector3( 0, -2, 0) );
            _ship.light = _light;

            let _station_mats = new THREE.MeshStandardMaterial( { color: 0x444444, roughness: 1, metalness: 0.5 } );
            let _ops_station = _ship.getObjectByName( 'OpsStation' );
            _ops_station.castShadow = true;
            _ops_station.receiveShadow = true;
            _ops_station.material = _station_mats;
            _ship.ops_station = _ops_station;
            let _conn_station = _ship.getObjectByName( 'ConnStation' );
            _conn_station.castShadow = true;
            _conn_station.receiveShadow = true;
            _conn_station.material = _station_mats;
            _ship.conn_station = _conn_station;
            let _sec_station = _ship.getObjectByName( 'SecurityStation' );
            _sec_station.castShadow = true;
            _sec_station.receiveShadow = true;
            _sec_station.material = _station_mats;
            _ship.sec_station = _sec_station;
            let _conference_table = _ship.getObjectByName( 'Conference__Table' );
            _conference_table.castShadow = true;
            _conference_table.receiveShadow = true;
            _conference_table.material = _station_mats;
            _ship.conference_table = _conference_table;

            // Generate the Warp Tunnel Structure and Effects
            let cloud_boiling_texture = new THREE.TextureLoader().load( 'textures/effects/cloud_boiling.jpg' );
            let clouds_clouds_clouds_texture = new THREE.TextureLoader().load( 'textures/effects/clouds_clouds_clouds.jpg' );
            let cloud_patches_texture = new THREE.TextureLoader().load( 'textures/effects/cloud_patches.jpg' );
            let cloud_ribbons_texture = new THREE.TextureLoader().load( 'textures/effects/cloud_ribbons.jpg' );
            let clouds_noclouds_texture = new THREE.TextureLoader().load( 'textures/effects/clouds_noclouds.jpg' );

            let _warp_tunnel = []
            _warp_tunnel.push( _ship.getObjectByName( 'Warp_Cone000' ) );
            _warp_tunnel.push( _ship.getObjectByName( 'Warp_Cone001' ) );
            _warp_tunnel.push( _ship.getObjectByName( 'Warp_Cone002' ) );
            _warp_tunnel.push( _ship.getObjectByName( 'Warp_Cone003' ) );
            _warp_tunnel.push( _ship.getObjectByName( 'Warp_Cone004' ) );
            _warp_tunnel.push( _ship.getObjectByName( 'Warp_Cone005' ) );
            _warp_tunnel.push( _ship.getObjectByName( 'Warp_Cone006' ) );

            let warp_tunnel = new THREE.Group();
            for( let cone_ndx=0; cone_ndx<_warp_tunnel.length; cone_ndx++ ){

              let primary_shell = new SceneAsset3D( _warp_tunnel[ cone_ndx ] );
              let secondary_shell = new SceneAsset3D( _warp_tunnel[ cone_ndx ].clone( false ) );
              let tertiary_shell = new SceneAsset3D( _warp_tunnel[ cone_ndx ].clone( false ) );

              primary_shell.material = new THREE.MeshStandardMaterial( { color: 0x000000, emissive: 0x040bff, wireframe: true, roughness: 0, side: THREE.DoubleSide, alphaMap: cloud_boiling_texture, alphaTest: 0.5, transparent: true, opacity: 0.9 } );
              secondary_shell.material = new THREE.MeshStandardMaterial( { color: 0x000000, emissive: 0x0000ff,   roughness: 0, side: THREE.DoubleSide, alphaMap: clouds_clouds_clouds_texture, alphaTest: 0.7, transparent: true, opacity: 0.8});
              tertiary_shell.material = new THREE.MeshStandardMaterial( { color: 0x000000, emissive: 0xffffff, wireframe: true, roughness: 0, side: THREE.DoubleSide, alphaMap: cloud_ribbons_texture, alphaTest: 0.7, transparent: true, opacity: 0.9 });

              primary_shell.directions.set( 'revolve', function(){
                let warp_speed = arguments[1];
                if( warp_speed > 0 ) primary_shell.rotation.y += 3 / warp_speed;

              });
              secondary_shell.directions.set( 'revolve', function(){
                let warp_speed = arguments[1];
                if( warp_speed > 0 ) secondary_shell.rotation.y -= 1 / warp_speed;
              });
              tertiary_shell.directions.set( 'revolve', function(){
                let warp_speed = arguments[1];
                if( warp_speed > 0 ) tertiary_shell.rotation.y += 0.5 / warp_speed;
              });

              warp_tunnel.add( primary_shell );
              warp_tunnel.add( secondary_shell );
              warp_tunnel.add( tertiary_shell );
            }
            _ship.warp_tunnel = warp_tunnel;


            // Define Key Navigation Data
            let _fwd = _ship.getObjectByName( 'NavdotForward' );
            let navdot_forward = new THREE.Mesh(
              new THREE.SphereGeometry( 0.01, 64, 32 ),
              new THREE.MeshBasicMaterial( { color: 0x0000ff } )
            );
            navdot_forward.position.copy( _fwd.position );

            let _awd = _ship.getObjectByName( 'NavdotAftward' );
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
            _ship.NavDots = nav_dots;
            _ship.NavLines = nav_lines;
            _ship.add( sight_target ); // As a child, the position will update.
            _ship.add( sight_line );

            _ship.cameras = new Map();
            gltf.cameras.forEach( (camera)=>{
              _ship.cameras.set( camera.parent.name, camera );
            });
            let _cap_cam = _ship.cameras.get( 'CaptainCam');

            _ship.viewscreen = _ship.getObjectByName( 'Viewscreen' );
            _ship.viewscreen.visible = false;

            _ship.name = "Ship";
            let ship = new SceneAsset3D( _ship );
            resolve( ship );
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

  }



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
    warp_to: async ( planetary_body, equidistant_orbit = true ) =>{
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

      //if ( _quat_diff < 0.01 ) {
        //debugger;
        //_quat_diff = iniQ.angleTo( endQ.conjugate() );
      //}

      this.scene.updates.cache.iniQ = iniQ;
      this.scene.updates.cache.endQ = endQ;
      this.scene.updates.cache.path = travel_path;
      this.scene.updates.cache.up_now = this.actors.Ship.up.clone();
      this.scene.updates.cache.turn_duration = Math.ceil( _quat_diff * ( 250 / Math.PI ) );
      this.scene.updates.cache.travel_duration = Math.ceil( 100 + ( travel_distance / 15000000000 ) );
      this.scene.updates.cache.warp_duration = 25;
      this.scene.updates.cache.duration = this.scene.updates.cache.turn_duration + this.scene.updates.cache.travel_duration;  // TODO: Vary this by the travel_distance to target
      this.scene.updates.cache.frame = 0;
      this.scene.updates.cache.locking_on = false;
      this.scene.updates.cache.locked_on = false;
      this.scene.updates.cache.warping = false;
      this.scene.updates.cache.warp_speed = 0;
      this.scene.updates.cache.warp_tunnel_buildup = 250;
      this.scene.updates.cache.warped = false;
      this.scene.updates.cache.at_destination = false;
      this.scene.updates.cache.completed = false;
      this.scene.updates.update = ()=>{
        let user_control = this.active_cam.user_control;
        // Call this last to clear the function
        if( this.scene.updates.cache.completed ){

          this.updatables.delete('scene');
          delete this.scene.updates;
          this.scene.updates = {
            update: ()=>{},
            cache: {}
          };
        } else {
          // Turn toward the destination.
          if( !this.scene.updates.cache.locked_on && this.scene.updates.cache.frame <= this.scene.updates.cache.turn_duration ){

            // Turn the ship toward the target.
            let _tprog = this.scene.updates.cache.frame / this.scene.updates.cache.turn_duration;
            let turn_progress = _tprog ** (10-(10.05*_tprog));

            let curQ = new THREE.Quaternion().slerpQuaternions( iniQ, endQ, turn_progress ).normalize();
            this.actors.Ship.quaternion.copy( curQ );

            this.actors.Ship.updateMatrixWorld( true );
            var rotationMatrix = new THREE.Matrix4().extractRotation( this.actors.Ship.matrixWorld );
            var up_now = new THREE.Vector3( 0, 1, 0 ).applyMatrix4( rotationMatrix ).normalize();

            this.actors.Ship.up.lerpVectors( this.scene.updates.cache.up_now, up_now, _tprog );

            this.actors.Ship.warp_tunnel.quaternion.copy( curQ );


            if( !user_control ){
              let sight_target = new THREE.Vector3();
              let cam_name = this.active_cam.name;
              switch( cam_name ){
                case 'ConnCam':
                  this.actors.Ship.conn_station.getWorldPosition( sight_target );
                  break;
                case 'OpsCam':
                  this.actors.Ship.ops_station.getWorldPosition( sight_target );
                  break;
                case 'CaptainCam':
                  this.actors.Ship.NavDots.sight_target.getWorldPosition( sight_target );
                  break;
              }
              let cam_pos = new THREE.Vector3();
              this.actors.Ship.cameras.get( cam_name ).getWorldPosition( cam_pos );
              this.active_cam.position.copy( cam_pos );
              this.active_cam.up.lerpVectors( this.scene.updates.cache.up_now, up_now, turn_progress );
              this.active_cam.lookAt( sight_target );
            }

          }

          // Target Locked Captain
          else if( !this.scene.updates.cache.locked_on && ! this.scene.updates.cache.locking_on ) {

            this.scene.updates.cache.locking_on = true;

            setTimeout( ()=>{
              this.scene.updates.cache.locked_on = true;
              this.scene.updates.cache.warping = true;
              this.scene.updates.cache.frame = -1;
            }, 1000);

          }

          // Engage!
          else if( this.scene.updates.cache.locked_on ) {

            // Distort First-Person Space-Time
            if( this.scene.updates.cache.warping && this.scene.updates.cache.frame <= this.scene.updates.cache.warp_duration ){

              let _wprog = this.scene.updates.cache.frame / this.scene.updates.cache.warp_duration;
              let warp_progress = _wprog ** (10-(10.05*_wprog));
              let warp_zoom = THREE.MathUtils.lerp( 0.1, 1, warp_progress );
              if( !user_control ) {
                this.active_cam.zoom = warp_zoom;
                this.active_cam.updateProjectionMatrix();
              }
              if( this.scene.updates.cache.frame >= this.scene.updates.cache.warp_duration ) {
                this.scene.updates.cache.warping = false;
                this.scene.updates.cache.frame = -1;
              }

            }

            // Stop the ship!
            else if( this.scene.updates.cache.warped && this.scene.updates.cache.frame <= this.scene.updates.cache.warp_duration ){

              let _wprog = this.scene.updates.cache.frame / this.scene.updates.cache.warp_duration;
              let warp_progress = _wprog ** (1.5-_wprog);
              let warp_zoom = THREE.MathUtils.lerp( 1.5, 1, warp_progress );
              // If the camera is in First-Person mode... aka, fully zoomed back in.
              if( !user_control ){
                this.active_cam.zoom = warp_zoom;
                this.active_cam.updateProjectionMatrix();
              }
              // Stopped stopping.
              if( this.scene.updates.cache.frame >= this.scene.updates.cache.warp_duration ) {
                this.scene.updates.cache.warped = false;
                this.scene.updates.cache.frame = -1;
              }

            }

            // Begin travelling within a warp tunnel
            else {

              if( !this.scene.updates.cache.at_destination && this.scene.updates.cache.frame <= this.scene.updates.cache.travel_duration ){

                // The warp tunnel appears gradually along the process of travelling.
                let tunnel_progress = ( this.scene.updates.cache.frame<= this.scene.updates.cache.warp_tunnel_buildup ) ? this.scene.updates.cache.frame / this.scene.updates.cache.warp_tunnel_buildup :  1;
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
                let _dprog = this.scene.updates.cache.frame / this.scene.updates.cache.travel_duration;
                let travel_progress = _dprog ** ( 1.5-_dprog );

                // Establish the next position to render
                let next_pos = ( travel_progress < 1 ) ? new THREE.Vector3() : this.scene.updates.cache.path.end;
                // ... don't over do it.
                if( travel_progress < 1 ) this.scene.updates.cache.path.at( travel_progress, next_pos );

                let _distance = new THREE.Line3( this.active_cam.position, next_pos ).distance();
                // Define what Warp Speed is for this trip... FYI: Not analalogous to contemporary warp travel mathematics.
                this.scene.updates.cache.warp_speed = _distance /  1500000000;

                // Calculate this
                let cam_ship_pos_diff = new THREE.Vector3().subVectors( this.actors.Ship.position, this.active_cam.position );

                this.actors.Ship.position.copy( next_pos );
                this.actors.Ship.updateMatrixWorld( true );
                this.actors.Ship.warp_tunnel.position.copy( next_pos );
                if( !user_control ){
                  this.active_cam.position.subVectors( next_pos, cam_ship_pos_diff );
                  this.active_cam.updateProjectionMatrix();
                } else {
                  this.active_cam.position.subVectors( next_pos, cam_ship_pos_diff );
                  this.actors.Ship.NavDots.sight_target.getWorldPosition( this.controls.orbit_controls.target );
                  //this.active_cam.updateProjectionMatrix();
                }

              } else if( !this.scene.updates.cache.at_destination ) {

                this.scene.updates.cache.at_destination = true;
                this.scene.updates.cache.frame = -1;
                this.scene.updates.cache.warped = true;

                let _wd = 35;
                this.actors.Ship.warp_tunnel.children.forEach( ( cone )=>{
                  setTimeout( ()=>{
                    cone.visible = false;
                  }, _wd+=35);
                })
                //alert( ' We have arrived Captain. @ Frame: ' + this.scene.updates.cache.frame.toString() );

              } else if ( this.scene.updates.cache.at_destination ) {

                let ship = this.actors.Ship;
                ship.updateMatrixWorld( true );
                var rotationMatrix = new THREE.Matrix4().extractRotation( ship.matrixWorld );
                var up_now = new THREE.Vector3( 0, 1, 0 ).applyMatrix4( rotationMatrix ).normalize();
                let cam_ship_pos_diff = new THREE.Vector3().subVectors( ship.position, this.active_cam.position  );
                if( !user_control ){
                  this.active_cam.up = up_now;
                  this.active_cam.position.subVectors( ship.position, cam_ship_pos_diff );
                } else {
                  this.active_cam.position.subVectors( ship.position, cam_ship_pos_diff );
                }
                let sight_target = new THREE.Vector3();
                ship.NavDots.sight_target.getWorldPosition( sight_target );
                if( !user_control ){
                  this.active_cam.lookAt( sight_target );
                  this.active_cam.updateProjectionMatrix();
                } else {
                  this.controls.orbit_controls.target = sight_target;

                  this.active_cam.updateProjectionMatrix();
                }

                this.scene.updates.cache.completed = true;
                //alert( `Arrived at corrdinates: [ X:${this.actors.Ship.position.x}, Y:${this.actors.Ship.position.y}, Z:${this.actors.Ship.position.z} ]` );

              }
            }
          }
          this.scene.updates.cache.frame++;
        }

      }
      this.updatables.set('scene', this.scene.updates );
    },
    change_cam: async ( cam_name ) =>{
      let _ship = this.actors.Ship;
      let _cam = _ship.cameras.get( cam_name );
      let _cam_pos = new THREE.Vector3();
      _cam.getWorldPosition( _cam_pos );
      this.active_cam.position.copy( _cam_pos );
      let _target_pos = new THREE.Vector3();
      switch( cam_name ){
        case 'ConnCam':
          _ship.conn_station.getWorldPosition( _target_pos );
          break;
        case 'OpsCam':
          _ship.ops_station.getWorldPosition( _target_pos );
          break;
        case 'CaptainCam':
          _ship.NavDots.sight_target.getWorldPosition( _target_pos );
          break;
      }
      this.active_cam.lookAt( _target_pos );
      this.active_cam.updateProjectionMatrix();
      this.active_cam.name = cam_name;
    }
  };

  backgroundScenery = ()=>{ return this.backgroundSceneryGenerator() };
  SetSceneBackground = ( )=>{

    const loader = new THREE.CubeTextureLoader();
				loader.setPath( 'textures/environment/' );
				let textureCube = loader.load( [ 'corona_lf.png', 'corona_rt.png', 'corona_up_2.png', 'corona_dn_2.png', 'corona_ft.png', 'corona_bk.png'   ] );
				this.scene.background = textureCube;
  };

  direct = ( delta )=>{

    let warp_speed = this.scene.updates.cache.warp_speed;
    warp_speed = ( !warp_speed ) ? 0 : warp_speed;
    this.actives.forEach( ( active, name )=>{
      active.directions.forEach( ( direction, name )=>{
        direction( delta, warp_speed );
      } );
    } );
  }

  constructor(){
    super();

    this.updatables.set('tweens', TWEEN );

    // Camera & Controls Setup
    this.active_cam = new THREE.PerspectiveCamera( VIEW.fov, VIEW.aspect, VIEW.near, VIEW.far );
    this.active_cam.name = 'CaptainCam';



  }
}

export { SceneAssets }
