// ScreenDirector Reference
import { Screenplay as _Screenplay, SceneAsset3D, SceneTransformation } from '../bin/ScreenDirector.js';
// Support Library Reference
import * as THREE from 'three';
import { GLTFLoader } from '../lib/GLTFLoader.js';
import { DRACOLoader } from '../lib/DRACOLoader.js';
import { ImprovedNoise } from '../lib/ImprovedNoise.js';
import { RectAreaLightHelper } from '../lib/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from '../lib/RectAreaLightUniformsLib.js';

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
  fov: 110,
  aspect: window.innerWidth / window.innerHeight,
  near: 0.1,
  far: 100000000000000,
  major_dim: Math.max( window.innerWidth, window.innerHeight ),
  minor_dim: Math.min( window.innerWidth, window.innerHeight )
};

// Screenplay Implementation
class Screenplay extends _Screenplay{
  actors = {

    // Neptune
    get Neptune(){
      let _map = new THREE.TextureLoader().load('resources/neptunemap.jpg');
      let _mesh = new THREE.Mesh(
        new THREE.SphereGeometry( 24622000, 128, 128 ),
        new THREE.MeshPhongMaterial( { map: _map, shininess: 100 } )
      );
      _mesh.castShadow = true;
			_mesh.receiveShadow = true;
      //_mesh.position.set( -4498410000000, 0, 11 );
      _mesh.position.set( 4498410000000, 0, 0 );
      _mesh.name = 'Neptune';
      let neptune = new SceneAsset3D( _mesh );
      neptune.directions.set( 'revolve', function(){
        neptune.rotation.y += .00036135;
      });
      neptune.surface_distance = 24622000;
      neptune.orbital_distance = 3 * 34820000;
      neptune.orbital_vector = neptune.position.clone().add( {x:158232000, y:34700831, z:-35700831} );
      neptune.orbital_quaternion = new THREE.Quaternion( 0.000011816426533634118, -0.7071185976130878, 0.000011816821474275852, 0.7070949643650667 );
      neptune.destinations = [
        {
          vector: neptune.position.clone().add( {x:158232000, y:34700831, z:-35700831} ),
          quaternion: new THREE.Quaternion( 0.000011816426533634118, -0.7071185976130878, 0.000011816821474275852, 0.7070949643650667 )
        }
      ];

      delete this.Neptune;
      return this.Neptune = neptune;
    },

    // Uranus
    get Uranus(){
      let _map = new THREE.TextureLoader().load('resources/uranusmap.jpg');
      let _mesh = new THREE.Mesh(
        new THREE.SphereGeometry( 25362000, 128, 128 ),
        new THREE.MeshPhongMaterial( { map: _map, shininess: 100 } )
      );
      _mesh.castShadow = true;
			_mesh.receiveShadow = true;
      _mesh.name = 'Uranus';
      _mesh.position.set( -2870933609000, 0, -870933609000 );
      //_mesh.position.set( 2870933609000, 0, 0 );
      let uranus = new SceneAsset3D( _mesh );
      uranus.directions.set( 'revolve', function(){
        uranus.rotation.y -= .00033824;
      });
      uranus.surface_distance = 25362000;
      uranus.orbital_distance = 3 * 35867000;
      uranus.orbital_vector = uranus.position.clone().add( {x:158232000, y:34700831, z:-35700831} );
      uranus.orbital_quaternion = new THREE.Quaternion( 0.000011816426533634118, -0.7071185976130878, 0.000011816821474275852, 0.7070949643650667 );
      uranus.destinations = [
        {
          vector: uranus.position.clone().add( {x:158232000, y:34700831, z:-35700831} ),
          quaternion: new THREE.Quaternion( 0.000011816426533634118, -0.7071185976130878, 0.000011816821474275852, 0.7070949643650667 )
        }
      ]

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
      const _ring_material = new THREE.MeshPhysicalMaterial({
        map: _ring_texture,
        side: THREE.DoubleSide,
        color: 0xffffff,
				transmission: 1,
				opacity: .8,
				metalness: 0,
				roughness: 0,
				ior: 1.5,
				thickness: 0.01,
				attenuationColor: 0xffffff,
				attenuationDistance: 1,
				specularIntensity: 1,
				specularColor: 0xffffff,
				envMapIntensity: 1
      });
      const _rings_mesh = new THREE.Mesh( _ring_geometry, _ring_material );
      _rings_mesh.castShadow = true;
			_rings_mesh.receiveShadow = true;
      _rings_mesh.name = 'Saturnal Rings';

      let _map = new THREE.TextureLoader().load( 'resources/saturnmap.jpg' );
      let _mesh = new THREE.Mesh(
        new THREE.SphereGeometry( 58232000, 128, 128 ),
        new THREE.MeshPhongMaterial( { map: _map, side: THREE.DoubleSide, shininess: 1 } )
      );
      _mesh.castShadow = true;
			_mesh.receiveShadow = true;
      _mesh.name = 'Saturn';
      _mesh.position.set( 1433537000000, 0, 1433537000000 );
      //_mesh.position.set( 1433537000000, 0, 0 );
      _mesh.add( _rings_mesh );
      let saturn = new SceneAsset3D( _mesh );
      saturn.directions.set( 'revolve', function(){
        saturn.rotation.y += .0005437;
      });
      saturn.surface_distance = 58232000;
      saturn.orbital_distance = 3 * 82352000;
      //saturn.orbital_vector = new THREE.Vector3( 82352000, 82352000, 82352000 );
      saturn.orbital_vector = saturn.position.clone().add( {x:158232000, y:34700831, z:-35700831} );
      saturn.orbital_quaternion = new THREE.Quaternion( 0.000011816426533634118, -0.7071185976130878, 0.000011816821474275852, 0.7070949643650667 );
      saturn.destinations = [
        {
          vector: saturn.position.clone().add( {x:158232000, y:34700831, z:-35700831} ),
          quaternion: new THREE.Quaternion( 0.000011816426533634118, -0.7071185976130878, 0.000011816821474275852, 0.7070949643650667 )
        }
      ];
      delete this.Saturn;
      return this.Saturn = saturn;
    },

    // Jupiter
    get Jupiter(){
      let _map = new THREE.TextureLoader().load('resources/jupitermap.jpg');
      let _mesh = new THREE.Mesh(
        new THREE.SphereGeometry( 69911000, 128, 128 ),
        new THREE.MeshPhongMaterial( { map: _map, shininess: 100 } )
      );
      _mesh.castShadow = true;
			_mesh.receiveShadow = true;
      _mesh.name = 'Jupiter';
      _mesh.position.set( 778477400000, 0, -778477400000 );
      //_mesh.position.set( 778477400000, 0, 0 );
      let jupiter = new SceneAsset3D( _mesh );
      jupiter.directions.set( 'revolve', function(){
        jupiter.rotation.y += .00058765;
      });
      jupiter.surface_distance = 69911000;
      jupiter.orbital_distance = 3 * 98869000;

      jupiter.orbital_vector = jupiter.position.clone().add( {x:158232000, y:34700831, z:-35700831} );
      jupiter.orbital_quaternion = new THREE.Quaternion( 0.000011816426533634118, -0.7071185976130878, 0.000011816821474275852, 0.7070949643650667 );
      jupiter.destinations = [
        {
          vector: jupiter.position.clone().add( {x:158232000, y:34700831, z:-35700831} ),
          quaternion: new THREE.Quaternion( 0.000011816426533634118, -0.7071185976130878, 0.000011816821474275852, 0.7070949643650667 )
        }
      ];

      delete this.Jupiter;
      return this.Jupiter = jupiter;
    },

    // Mars
    get Mars(){
      let _map = new THREE.TextureLoader().load('resources/mars_1k_color.jpg');
      let _topo = new THREE.TextureLoader().load('resources/mars_1k_topo.jpg');
      let _mesh = new THREE.Mesh(
        new THREE.SphereGeometry( 3389000, 128, 128 ),
        new THREE.MeshPhongMaterial( { map: _map, displacementMap: _topo, shininess: 100 } )
      );
      _mesh.castShadow = true;
			_mesh.receiveShadow = true;
      _mesh.name = 'Mars';
      _mesh.position.set( 227939366000, 0, 227939366000 );
      //_mesh.position.set( 227939366000, 0, 0 );
      let mars = new SceneAsset3D( _mesh );
      mars.directions.set( 'revolve', function(){
        mars.rotation.y += .00023649;
      });
      mars.surface_distance = 3389000;
      mars.orbital_distance = 3 * 4792000;

      mars.orbital_vector = mars.position.clone().add( {x:158232000, y:34700831, z:-35700831} );
      mars.orbital_quaternion = new THREE.Quaternion( 0.000011816426533634118, -0.7071185976130878, 0.000011816821474275852, 0.7070949643650667 );
      mars.destinations = [
        {
          vector: mars.position.clone().add( {x:158232000, y:34700831, z:-35700831} ),
          quaternion: new THREE.Quaternion( 0.000011816426533634118, -0.7071185976130878, 0.000011816821474275852, 0.7070949643650667 )
        }
      ];

      delete this.Mars;
      return this.Mars = mars;
    },

    // Earth
    get OldEarth(){
      let _map = new THREE.TextureLoader().load('resources/earthmap1k.jpg');
      let _spec = new THREE.TextureLoader().load('resources/earthspec1k.jpg');
      let _bump = new THREE.TextureLoader().load('resources/earthbump1k.jpg');
      let _cloud = new THREE.TextureLoader().load('resources/earthcloudmap.jpg');
      let _cloud_trans = new THREE.TextureLoader().load('resources/earthcloudmaptrans.jpg');
      let _lights = new THREE.TextureLoader().load('resources/earthlights1k.jpg');
      let _emissive = new THREE.TextureLoader().load('resources/earthlights1k_dark.jpg');
      let _lights_negative = new THREE.TextureLoader().load('resources/earthlights1k_negative.jpg');
      let _mesh = new THREE.Mesh(
        new THREE.SphereGeometry( 6371000, 128, 128 ),
        new THREE.MeshPhongMaterial( { map: _map, emissive: 0xffffff, emissiveMap: _emissive, shininess: 100 } )
      );
      _mesh.castShadow = true;
			_mesh.receiveShadow = true;
      _mesh.position.set( 149598023000, 0, 0 );
      let earth = new SceneAsset3D( _mesh );
      earth.name = 'OldEarth';
      earth.directions.set( 'revolve', function(){
        earth.rotation.y += .0002424;
      });
      earth.surface_distance = 6371000;
      earth.orbital_distance = 3 * 9009000;
      earth.orbital_vector = new THREE.Vector3( 9009000, 3000000, 9009000 );

      delete this.Earth;
      return this.Earth = earth;
    },

    get Earth(){

      let loading = new Promise( ( resolve, reject )=>{
        const loader = new GLTFLoader();
        // Optional: Provide a DRACOLoader instance to decode compressed mesh data
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/' );
        loader.setDRACOLoader( dracoLoader );
        loader.load( 'models/Earth.glb',
          async ( gltf )=>{

            let _earth = gltf.scene;
            let earth = new SceneAsset3D( _earth );
            earth.scale.set( 12756, 12756, 12712 );
            earth.position.set( 149598023000, 0, 0 );
            earth.name = 'Earth';
            earth.directions.set( 'revolve', function(){
              earth.rotation.y += .0002424;
            });
            earth.surface_distance = 6371000;
            earth.orbital_distance = 1 * 9009000;
            earth.orbital_vector = earth.position.clone().add( {x:1977000, y:5000000, z:5000000} );
            earth.orbital_quaternion = new THREE.Quaternion( 0.000011816426533634118, -0.7071185976130878, 0.000011816821474275852, 0.7070949643650667 );
            earth.destinations = [
              {
                vector: earth.position.clone().add( {x:1977000, y:5000000, z:5000000} ),
                quaternion: new THREE.Quaternion( 0.000011816426533634118, -0.7071185976130878, 0.000011816821474275852, 0.7070949643650667 )
              }
            ];
            resolve( earth );
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
          return await loading.then(( earth )=>{

            delete this.Earth;
            return this.Earth = earth;

          })
        } catch(e) {
          return 0; // fallback value;
        }
      })();
    },

    // Moon
    get Moon(){
      let _map = new THREE.TextureLoader().load('resources/moonmap1k.jpg');
      let _bump = new THREE.TextureLoader().load('resources/moonbump1k.jpg');
      let _mesh = new THREE.Mesh(
        new THREE.SphereGeometry( 1735500, 128, 128 ),
        new THREE.MeshPhongMaterial( { map: _map, bumpMap: _bump, shininess: 100 })
      );
      _mesh.castShadow = true;
			_mesh.receiveShadow = true;
      _mesh.position.set( 149982422000, 0, 149598023000 );
      //_mesh.position.set( 149982422000, 0, 0 );
      let moon = new SceneAsset3D( _mesh );
      moon.name = 'Moon';
      moon.directions.set( 'revolve', function(){
        moon.rotation.y += .0000088726;
      });
      moon.surface_distance = 1735500;
      moon.orbital_distance = 3 * 2454000;
      moon.orbital_vector = moon.position.clone().add( {x:1977000, y:5000000, z:5000000} );
      moon.orbital_quaternion = new THREE.Quaternion( 0.000011816426533634118, -0.7071185976130878, 0.000011816821474275852, 0.7070949643650667 );
      moon.destinations = [
        {
          vector: moon.position.clone().add( {x:1977000, y:5000000, z:5000000} ),
          quaternion: new THREE.Quaternion( 0.000011816426533634118, -0.7071185976130878, 0.000011816821474275852, 0.7070949643650667 )
        }
      ];

      delete this.Moon;
      return this.Moon = moon;
    },

    // Venus
    get Venus(){
      let _map = new THREE.TextureLoader().load('resources/venusmap.jpg');
      let _bump = new THREE.TextureLoader().load('resources/venusbump.jpg');
      let _mesh = new THREE.Mesh(
        new THREE.SphereGeometry( 6052000, 128, 128 ),
        new THREE.MeshPhongMaterial( { map: _map, bumpMap: _bump, shininess: 100 } )
      );
      _mesh.castShadow = true;
			_mesh.receiveShadow = true;
      _mesh.position.set( 108200000000, 0, -108200000000 );
      //_mesh.position.set( 108200000000, 0, 0 );
      let venus = new SceneAsset3D( _mesh );
      venus.name = 'Venus';
      venus.directions.set( 'revolve', function(){
        venus.rotation.y -= .000000997;
      });
      venus.surface_distance = 6052000;
      venus.orbital_distance = 3 * 8558820;
      venus.orbital_vector = venus.position.clone().add( {x:158232000, y:34700831, z:-35700831} );
      venus.orbital_quaternion = new THREE.Quaternion( 0.000011816426533634118, -0.7071185976130878, 0.000011816821474275852, 0.7070949643650667 );
      venus.destinations = [
        {
          vector: venus.position.clone().add( {x:158232000, y:34700831, z:-35700831} ),
          quaternion: new THREE.Quaternion( 0.000011816426533634118, -0.7071185976130878, 0.000011816821474275852, 0.7070949643650667 )
        }
      ];

      delete this.Venus;
      return this.Venus = venus;
    },

    // Mercury
    get Mercury(){
      let _map = new THREE.TextureLoader().load('resources/mercurymap.jpg');
      let _bump = new THREE.TextureLoader().load('resources/mercurybump.jpg');
      let _mesh = new THREE.Mesh(
        new THREE.SphereGeometry( 2439500, 128, 128 ),
        new THREE.MeshPhongMaterial( { map: _map, bumpMap: _bump, shininess: 100 } )
      );
      _mesh.castShadow = true;
			_mesh.receiveShadow = true;
      _mesh.position.set( 57900000000, 0, 7900000000 );
      //_mesh.position.set( 57900000000, 0, 0 );
      let mercury = new SceneAsset3D( _mesh );
      mercury.name = 'Mercury';
      mercury.directions.set( 'revolve', function(){
        mercury.rotation.y += .000004133;
      });
      mercury.surface_distance = 2439500;
      mercury.orbital_distance = 3 * 3449973;
      mercury.orbital_vector = mercury.position.clone().add( {x:158232000, y:34700831, z:-35700831} );
      mercury.orbital_quaternion = new THREE.Quaternion( 0.000011816426533634118, -0.7071185976130878, 0.000011816821474275852, 0.7070949643650667 );
      mercury.destinations = [
        {
          vector: mercury.position.clone().add( {x:158232000, y:34700831, z:-35700831} ),
          quaternion: new THREE.Quaternion( 0.000011816426533634118, -0.7071185976130878, 0.000011816821474275852, 0.7070949643650667 )
        }
      ];
      delete this.Mercury;
      return this.Mercury = mercury;
    },

    // Sun
    get Sun(){
      let _map = new THREE.TextureLoader().load('resources/solarmap.jpg');
      let _spec = new THREE.TextureLoader().load('resources/sunmap.jpg');
      let _mesh = new THREE.Mesh(
        new THREE.SphereGeometry( 695508000, 128, 128 ),
        new THREE.MeshPhongMaterial( { map: _map, side: THREE.DoubleSide, wireframe: true } )
      );
      _mesh.castShadow = false;
			_mesh.receiveShadow = false;
      _mesh.name = 'Sun';
      _mesh.position.set( 0, 0, 0 );
      let sun = new SceneAsset3D( _mesh );
      sun.directions.set( 'revolve', function(){
        sun.rotation.y += .00008978;
      });
      sun.surface_distance = 695508000;
      sun.orbital_distance = 20000000000;
      sun.orbital_vector = sun.position.clone().add( {x:158232000, y:34700831, z:-35700831} );
      sun.orbital_quaternion = new THREE.Quaternion( 0.000011816426533634118, -0.7071185976130878, 0.000011816821474275852, 0.7070949643650667 );
      sun.destinations = [
        {
          vector: sun.position.clone().add( {x:158232000, y:34700831, z:-35700831} ),
          quaternion: new THREE.Quaternion( 0.000011816426533634118, -0.7071185976130878, 0.000011816821474275852, 0.7070949643650667 )
        }
      ];
      sun.material.depthTest = false;
      sun.light = new THREE.DirectionalLight( 0xffffff, 1 );
      sun.add( sun.light );
      sun.visible = false;
      delete this.Sun;
      return this.Sun = sun;
    },

    // Starship
    get Starship(){

      let loading = new Promise( ( resolve, reject )=>{
        const loader = new GLTFLoader();
        // Optional: Provide a DRACOLoader instance to decode compressed mesh data
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/' );
        loader.setDRACOLoader( dracoLoader );
        loader.load( 'models/Starship.glb',
          async ( gltf )=>{

            let starship = gltf.scene;
            starship.traverse( function( obj3D ) {
              if( obj3D.isMesh ) obj3D.castShadow = true;
            });

            starship.name = 'Starship You';

            starship.mixer = new THREE.AnimationMixer( starship );
            starship.animations = {
              warp_tunnel: await new SceneTransformation({
                init: async function(){
                  this.cache.mixer = starship.mixer;
                  this.cache.clip = this.cache.mixer.clipAction( gltf.animations[ 0 ] );
                  this.cache.clip.enabled = true;
                  this.cache.clip.play();
                },
                cache: {
                  mixer: null, animations: null
                },
                update: function( delta ){
                  this.cache.mixer.update( delta );
                },
                post: function(){
                  this.cache.clip.enabled = false;
                  this.cache.clip.stop();
                }
              })
            }

            starship.cameras = new Map();
            gltf.cameras.forEach( (camera)=>{
              camera.fov=110;
              starship.cameras.set( camera.name, camera );
            });

            let starship_texture = new THREE.TextureLoader().load('textures/StarShipTexture.jpg' );
            starship_texture.wrapS = THREE.MirroredRepeatWrapping;
            starship_texture.wrapT = THREE.MirroredRepeatWrapping;
            starship_texture.repeat.set( 24, 24 );
            let starship_material = new THREE.MeshPhongMaterial({map: starship_texture, color: 0x000111, emissive: 0x000000, specular: 0x111111, shininess: 100, combine: THREE.MultiplyOperation, side:THREE.DoubleSide, combine: THREE.MixOperation, flatShading: true});
            starship.Hull = starship.getObjectByName( 'Hull' );
            let _hull = starship.Hull.getObjectByName( 'Hull001' );
            _hull.traverse( function( obj3D ) {
              if( obj3D.isMesh ) obj3D.material = starship_material;
            });
            starship.Warp_Tunnel = starship.getObjectByName( 'Warp_Tunnel' );
            starship.Warp_Tunnel.visible = false;
            starship.Light = starship.getObjectByName( 'Light' );
            starship.Light.intensity = 10;

            starship.Conference__Table = starship.getObjectByName( 'Conference__Table' );
            starship.Aft_Wall = starship.getObjectByName( 'Aft_Wall' );
            starship.SecurityStation = starship.getObjectByName( 'SecurityStation' );
            starship.Viewscreen = starship.getObjectByName( 'Viewscreen' );
            starship.Viewscreen.visible = false;
            starship.Bulkhead = starship.getObjectByName( 'Bulkhead' );
            starship.Bulkhead.material = starship_material;
            starship.Bulkhead.receiveShadow = true;
            starship.OpsStation = gltf.scene.getObjectByName( 'OpsStation' );

            // Define Key Navigation Data
            let navdot_forward = new THREE.Mesh(
              new THREE.SphereGeometry( 0.01, 3, 2 ),
              new THREE.MeshPhongMaterial( { color: 0x0000ff } )
            );
            navdot_forward.position.copy( {x:0, y:0, z:50} );

            let navdot_aftward = new THREE.Mesh(
              new THREE.SphereGeometry( 0.01, 3, 2 ),
              new THREE.MeshPhongMaterial( { color: 0xff0000 } )
            );
            navdot_aftward.position.copy( {x:0, y:0, z:-50} );

            let helms_point = new THREE.Mesh(
              new THREE.SphereGeometry( 0.01, 3, 2 ),
              new THREE.MeshPhongMaterial( { color: 0x0000ff } )
            );

            // A-Line is a standard 100 unit line running directly through the center of the ship.
            // This is used for course calculation and ship orientation during flight.
            let a_line = new THREE.Line3( navdot_aftward.position, navdot_forward.position );
            let hecto_meter = a_line.distance();
            let at_mega_meter = 1000000 / hecto_meter;
            let at_decakilo_meter = 10000 / hecto_meter;
            let _helms_point = a_line.at( at_decakilo_meter, new THREE.Vector3() );
            helms_point.position.copy( _helms_point );

            let _sl = new THREE.QuadraticBezierCurve3( new THREE.Vector3( 0,-1,0 ), navdot_forward.position, new THREE.Vector3( 0,3,0 ) );
            let  _sl_points = _sl.getPoints( 50 );
            let  _sl_geometry = new THREE.BufferGeometry().setFromPoints( _sl_points );
            let  _sl_material = new THREE.LineBasicMaterial( { color: 0xffffff } );
            let  sight_line = new THREE.Line( _sl_geometry, _sl_material );
            sight_line.visible = false;

            let _st_v = new THREE.Vector3();
            _sl.getPointAt( 0.55, _st_v);
            let sight_target = new THREE.Mesh(
              new THREE.TorusKnotGeometry( 1, 1, 3, 3, 3, 3 ),
              new THREE.MeshPhongMaterial( { color: 0xffffff } )
            );
            sight_target.position.copy( _st_v );

            let nav_dots = {
              forward: navdot_forward,
              aftward: navdot_aftward,
              sight_target: sight_target,
              helms_point: helms_point
            }
            let nav_lines = {
              a_line: a_line,
              sight_line: sight_line
            };
            starship.NavDots = nav_dots;
            starship.NavLines = nav_lines;
            starship.add( navdot_forward ); // As a child, the position will update.
            starship.add( navdot_aftward );
            starship.add( sight_target );
            starship.add( helms_point );

            let starship_asset = new SceneAsset3D( starship );
            resolve( starship_asset );
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
          return await loading.then(( starship )=>{

            delete this.Starship;
            return this.Starship = starship;

          })
        } catch(e) {
          return 0; // fallback value;
        }
      })();
    }

  };
  lights = {
    get point_light(){
      let point_light = new THREE.PointLight( 0xffffff, 2.5, 0, 2 );
      return point_light;
    },
    get ambient_light(){
      return new THREE.AmbientLight( LIGHT.day ) ;
    }
  };
  cameras;
  actions = {
    impulse_to: async ( arrival_coords, arrival_emitter = false ) =>{
      let ship = this.actors.Starship;
      ship.position.copy( arrival_coords );
      ship.updateMatrixWorld( true );
    },
    land_at: async ( landing_coords, arrival_emitter = false ) =>{
      let ship = this.actors.Starship;
      ship.position.set( landing_coords );
      ship.updateMatrixWorld( true );
    },
    warp_to_old: async ( planetary_body, equidistant_orbit = false, arrival_emitter = false ) =>{
      // Find yourself.
      let pov_posi = new THREE.Vector3().copy( this.actors.Starship.position );
      // Set the arrival coordinates.
      let orbit_distance = planetary_body.orbital_distance;
      let surface_distance = planetary_body.surface_distance;
      let target_posi = planetary_body.position.clone();
      // Determine the travel path to the destination.
      if(pov_posi.distanceTo( target_posi ) == 0) target_posi = this.actors.Starship.NavDots.forward.position;
      let travel_path = new THREE.Line3( pov_posi, target_posi );
      let travel_distance = Math.floor( travel_path.distance() );
      let _target_distance = ( equidistant_orbit ) ? travel_distance - surface_distance - 10000000 : travel_distance - ( 2 * surface_distance );
      let _path_diff_ratio = _target_distance / travel_distance;
      travel_path.at( _path_diff_ratio, target_posi );
      travel_path = new THREE.Line3( pov_posi, target_posi );
      travel_distance = Math.floor( travel_path.distance() );
      var iniQ = new THREE.Quaternion().copy( this.actors.Starship.quaternion ).normalize();
      this.actors.Starship.lookAt( ...target_posi );
      this.actors.Starship.updateMatrixWorld( true );
      var rotationMatrix = new THREE.Matrix4().extractRotation( this.actors.Starship.matrixWorld );
      var endQ = new THREE.Quaternion().copy( this.actors.Starship.quaternion ).normalize();
      this.actors.Starship.quaternion.copy( iniQ );
      this.actors.Starship.updateMatrixWorld( true );
      let _quat_diff = iniQ.angleTo( endQ );
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
            // 1 Turn toward the destination.
            if( !cache.locked_on && cache.frame <= cache.turn_duration ){

              // Turn the ship toward the target.
              let _tprog = cache.frame / cache.turn_duration;
              let turn_progress = _tprog ** (10-(10.05*_tprog));

              let curQ = new THREE.Quaternion().slerpQuaternions( cache.iniQ, cache.endQ, turn_progress ).normalize();
              this.actors.Starship.quaternion.copy( curQ );
              this.actors.Starship.updateMatrixWorld( true );

              let rotationMatrix = new THREE.Matrix4().extractRotation( this.actors.Starship.matrixWorld );
              let up_now = new THREE.Vector3( 0, 1, 0 ).applyMatrix4( rotationMatrix ).normalize();

              this.actors.Starship.up.lerpVectors( cache.up_now, up_now, _tprog );

              //this.actors.Starship.warp_tunnel.quaternion.copy( curQ );

              let sight_target = new THREE.Vector3();

              let cam_pos = new THREE.Vector3();
              cam_name = this.active_cam.name;
              switch( cam_name ){
                case 'Center':

                  break;

                case 'CaptainCam':
                case 'OpsCam':
                case 'ConnCam':
                case '3rdPersonCam':
                case '3rdShipCam':
                    this.actors.Starship.NavDots.sight_target.getWorldPosition( sight_target );
                    this.active_cam.up.lerpVectors( cache.up_now, up_now, _tprog );
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
                    //this.actors.Starship.conn_station.getWorldPosition( sight_target );
                    break;
                  case '3rdPerson':

                    ship.getWorldPosition( cam_pos );
                    cam_pos.add( new THREE.Vector3( 100, 100, 100 ) );
                    ship.getWorldPosition( sight_target );
                    this.active_cam.position.copy( cam_pos );
                    this.active_cam.lookAt( sight_target );
                    break;
                  case 'CaptainCam':
                    this.actors.Starship.NavDots.sight_target.getWorldPosition( sight_target );
                    this.cameras.get( cam_name ).getWorldPosition( cam_pos );
                    this.active_cam.position.copy( cam_pos );
                    this.active_cam.up.lerpVectors( this.scene.updates.cache.up_now, up_now, turn_progress );
                    this.active_cam.lookAt( sight_target );
                    break;
                }

  */
            }

            // 2 Target Locked Captain
            else if( !cache.locked_on && ! cache.locking_on ) {

              cache.locking_on = true;
              setTimeout( ()=>{
                cache.locked_on = true;
                cache.warping = true;
                cache.frame = 0;
              }, 1000);

            }

            // 3 Engage!
            else if( cache.locked_on ) {

              // 4 Distort First-Person Space-Time
              if( cache.warping && cache.frame <= cache.warp_duration ){

                let _wprog = cache.frame / cache.warp_duration;
                let warp_progress = _wprog ** (10-(10.05*_wprog));
                let warp_zoom = THREE.MathUtils.lerp( 0.1, 1, warp_progress );
                cam_name = this.active_cam.name;

                switch( cam_name ){
                  case 'Center':

                    break;
                  case 'CaptainCam':
                  case 'OpsCam':
                  case 'ConnCam':
                  case '3rdPersonCam':
                  case '3rdShipCam':
                    this.active_cam.zoom = warp_zoom;
                    break;
                }
                this.active_cam.updateProjectionMatrix();

                if( cache.frame >= cache.warp_duration ) {
                  cache.warping = false;
                  cache.frame = 0;
                }

              }

              //  9 Stop the ship!
              else if( cache.warped && cache.frame <= cache.warp_duration ){

                let _wprog = cache.frame / cache.warp_duration;
                let warp_progress = _wprog ** (1.5-_wprog);
                let warp_zoom = THREE.MathUtils.lerp( 1.5, 1, warp_progress );
                cam_name = this.active_cam.name;
                switch( cam_name ){
                  case 'Center':

                    break;
                  case 'CaptainCam':
                  case 'OpsCam':
                  case 'ConnCam':
                  case '3rdPersonCam':
                  case '3rdShipCam':
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

              // 5 Begin travelling within a warp tunnel
              else {

                // 6  The warp tunnel appears gradually along the process of travelling.
                if( !cache.at_destination && cache.frame <= cache.travel_duration ){

                  let tunnel_progress = ( cache.frame<= cache.warp_tunnel_buildup ) ? cache.frame / cache.warp_tunnel_buildup :  1;
                  /*
                  if( !this.actors.Starship.warp_tunnel.children[0].visible && tunnel_progress > 0.01 ) this.actors.Starship.warp_tunnel.children[0].visible = true;
                  if( !this.actors.Starship.warp_tunnel.children[1].visible && tunnel_progress > 0.02 ) this.actors.Starship.warp_tunnel.children[1].visible = true;
                  if( !this.actors.Starship.warp_tunnel.children[2].visible && tunnel_progress > 0.03 ) this.actors.Starship.warp_tunnel.children[2].visible = true;
                  if( !this.actors.Starship.warp_tunnel.children[3].visible && tunnel_progress > 0.04 ) this.actors.Starship.warp_tunnel.children[3].visible = true;
                  if( !this.actors.Starship.warp_tunnel.children[4].visible && tunnel_progress > 0.05 ) this.actors.Starship.warp_tunnel.children[4].visible = true;
                  if( !this.actors.Starship.warp_tunnel.children[5].visible && tunnel_progress > 0.06 ) this.actors.Starship.warp_tunnel.children[5].visible = true;
                  if( !this.actors.Starship.warp_tunnel.children[6].visible && tunnel_progress > 0.07 ) this.actors.Starship.warp_tunnel.children[6].visible = true;
                  if( !this.actors.Starship.warp_tunnel.children[7].visible && tunnel_progress > 0.08 ) this.actors.Starship.warp_tunnel.children[7].visible = true;
                  if( !this.actors.Starship.warp_tunnel.children[8].visible && tunnel_progress > 0.09 ) this.actors.Starship.warp_tunnel.children[8].visible = true;
                  if( !this.actors.Starship.warp_tunnel.children[9].visible && tunnel_progress > 0.10 ) this.actors.Starship.warp_tunnel.children[9].visible = true;
                  if( !this.actors.Starship.warp_tunnel.children[10].visible && tunnel_progress > 0.10 ) this.actors.Starship.warp_tunnel.children[10].visible = true;
                  if( !this.actors.Starship.warp_tunnel.children[11].visible && tunnel_progress > 0.10 ) this.actors.Starship.warp_tunnel.children[11].visible = true;
                  if( !this.actors.Starship.warp_tunnel.children[12].visible && tunnel_progress > 0.10 ) this.actors.Starship.warp_tunnel.children[12].visible = true;
                  if( !this.actors.Starship.warp_tunnel.children[13].visible && tunnel_progress > 0.10 ) this.actors.Starship.warp_tunnel.children[13].visible = true;
                  if( !this.actors.Starship.warp_tunnel.children[14].visible && tunnel_progress > 0.20 ) this.actors.Starship.warp_tunnel.children[14].visible = true;
                  if( !this.actors.Starship.warp_tunnel.children[15].visible && tunnel_progress > 0.20 ) this.actors.Starship.warp_tunnel.children[15].visible = true;
                  if( !this.actors.Starship.warp_tunnel.children[16].visible && tunnel_progress > 0.30 ) this.actors.Starship.warp_tunnel.children[16].visible = true;
                  if( !this.actors.Starship.warp_tunnel.children[17].visible && tunnel_progress > 0.30 ) this.actors.Starship.warp_tunnel.children[17].visible = true;
                  if( !this.actors.Starship.warp_tunnel.children[18].visible && tunnel_progress > 0.40 ) this.actors.Starship.warp_tunnel.children[18].visible = true;
                  if( !this.actors.Starship.warp_tunnel.children[19].visible && tunnel_progress > 0.40 ) this.actors.Starship.warp_tunnel.children[19].visible = true;
                  if( !this.actors.Starship.warp_tunnel.children[20].visible && tunnel_progress > 0.50 ) this.actors.Starship.warp_tunnel.children[20].visible = true;

                  // Increase the opacity of the tunnel as a whole during the ramp-up cycle (<=100 Frames) of the travel process.
                  if( tunnel_progress <= 1){
                    this.actors.Starship.warp_tunnel.children.forEach( ( cone )=>{
                      cone.material.opaciy = tunnel_progress / 2;
                    });
                  }
                  // TODO: Implement a color cycling algorithm for the warp tunnel.
                  for( let wc_ndx = 1; wc_ndx<this.actors.Starship.warp_tunnel.children.length; wc_ndx+=3){
                    //let color = (16777215 / 500 * this.scene.updates.cache.frame).toString(16);
                    //this.actors.Starship.warp_tunnel.children[wc_ndx].material.color = color;
                  }
                  */
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

                  let camship_pos_diff = new THREE.Vector3().subVectors( this.actors.Starship.position, this.active_cam.position );

                  let sight_target = new THREE.Vector3();
                  this.actors.Starship.position.copy( next_pos );
                  this.actors.Starship.updateMatrixWorld( true );
                  //this.actors.Starship.warp_tunnel.position.copy( next_pos );
                  // TODO: REPLACE WITH CAMERA-INDEPENDANT TRAVEL
                  /*
                  cam_name = this.active_cam.name;

                  switch( cam_name ){
                    case 'Center':

                      break;
                    case '3rdPerson':
                      this.active_cam.position.subVectors( next_pos, camship_pos_diff );

                      this.actors.Starship.getWorldPosition( sight_target );
                      this.active_cam.lookAt( sight_target );
                      break;

                    case 'CaptainCam':
                      this.active_cam.position.subVectors( next_pos, camship_pos_diff );

                      this.actors.Starship.NavDots.sight_target.getWorldPosition( sight_target );
                      this.active_cam.lookAt( sight_target );
                      break;
                  }

                  if( this.controls.orbit_controls ) this.controls.orbit_controls.target.copy( sight_target );
                  this.active_cam.updateProjectionMatrix();
                  */
  /*

                  if( !user_control ){
                    this.active_cam.position.subVectors( next_pos, camship_pos_diff );
                  } else {
                    this.active_cam.position.subVectors( next_pos, camship_pos_diff );
                    this.actors.Starship.NavDots.sight_target.getWorldPosition( this.controls.orbit_controls.target );
                    //this.active_cam.updateProjectionMatrix();
                  }
  */}

                // 7  Arrival and tunnel dissipation
                else if( !cache.at_destination ) {

                  // Arrival at destination
                  cache.at_destination = true;
                  cache.frame = 0;
                  cache.warped = true;

                  // ... warp tunnel dissipates.
                  /*
                  let _wd = 35;
                  this.actors.Starship.warp_tunnel.children.forEach( ( cone )=>{
                    setTimeout( ()=>{
                      cone.visible = false;
                    }, _wd+=35);
                  })
                  */
                  //alert( ' We have arrived Captain. ' );

                }
                // 8 Set final angle for this destination.
                else if ( cache.at_destination ) {

                  let ship = this.actors.Starship;
                  ship.updateMatrixWorld( true );
                  var rotationMatrix = new THREE.Matrix4().extractRotation( ship.matrixWorld );
                  var up_now = new THREE.Vector3( 0, 1, 0 ).applyMatrix4( rotationMatrix ).normalize();
                  let camship_pos_diff = new THREE.Vector3().subVectors( ship.position, this.active_cam.position  );
                  let sight_target = new THREE.Vector3();
                  cam_name = this.active_cam.name;
                  /*
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
*/
                  cache.completed = true;
                  //alert( `Arrived at corrdinates: [ X:${this.actors.Starship.position.x}, Y:${this.actors.Starship.position.y}, Z:${this.actors.Starship.position.z} ]` );

                }
              }
            }
            cache.frame++;
          }
        },
        cache: {
          iniQ: iniQ,
          endQ: endQ,
          path: travel_path,
          up_now: this.actors.Starship.up.clone(),
          turn_duration: 2 * Math.max( 100, Math.ceil( _quat_diff * ( 250 / Math.PI ) ) ),
          travel_duration: 2 * Math.ceil( 100 + ( travel_distance / 15000000000 ) ),
          warp_duration: 2 * 15,
          duration: this.turn_duration + this.travel_duration,  // TODO: Vary this by the travel_distance to target
          frame: 0,
          locking_on: false,
          locked_on: false,
          warping: false,
          warp_speed: 0,
          warp_tunnel_buildup: 2 * 250,
          at_destination: false,
          warped: false,
          completed: false,
          cleanup_phase: false,
          arrival_emitter: arrival_emitter
        }
      }
      this.updatables.set('warp_to', plotted_course );
    },
    warp_to: async ( planetary_body, destination = 0, arrival_emitter = false ) =>{
      let ship = this.actors.Starship;

      let start_position = new THREE.Vector3()
      ship.getWorldPosition( start_position );

      let helms_point = new THREE.Vector3();
      ship.NavDots.helms_point.getWorldPosition( helms_point );

      let end_position = planetary_body.destinations[destination].vector.clone();

      let a_line = new THREE.Line3( planetary_body.position, end_position );
      let a_distance = a_line.distance();
      let at_approach_distance = ( a_distance + 10000 ) / a_distance;
      let approach_anchor = a_line.at( at_approach_distance, new THREE.Vector3() );

      let crow_line = new THREE.Line3( start_position, approach_anchor );
      let crow_line_distance = crow_line.distance();
      let at_departure_distance = 10000 / crow_line_distance;
      let departure_anchor = crow_line.at( at_departure_distance, new THREE.Vector3() );

      let departure_course = new THREE.QuadraticBezierCurve3( start_position, helms_point, departure_anchor );
      let warp_anchor = departure_course.getPoint( 1.1 );
      let warp_course = new THREE.QuadraticBezierCurve3( departure_anchor, warp_anchor, approach_anchor );  // All warp courses are drawn toward the Sun.

      let approach_line = new THREE.Line3( warp_course.getPoint( 0.999 ), warp_course.getPoint( 1 ) );
      let al_distance = approach_line.distance();
      let at_docking_distance = ( al_distance + 10000 ) / al_distance;
      let docking_anchor = approach_line.at( at_docking_distance, new THREE.Vector3() );

      let docking_course = new THREE.QuadraticBezierCurve3( approach_anchor, docking_anchor, end_position );
      let docking_quat = planetary_body.destinations[destination].quaternion;

      const course = new THREE.CurvePath();
      course.curves.push( departure_course );
      course.curves.push( warp_course );
      course.curves.push( docking_course );
      let course_length = course.getLength();

      let pilot = new THREE.Object3D();
      pilot.position.copy( start_position );

      let plotted_course = {
        compile: async ( )=>{

          let cache = plotted_course.cache;
          let pilot = cache.pilot;
          let starship = cache.starship;

          let course = cache.course;

          switch( cache.stage ){
            case 0:
              if( cache.stage_frame >= cache.durations[0] ) {
                cache.stage = 1;
                cache.stage_frame = -1;
              }
              else{
                let _prog = cache.stage_frame / cache.durations[0];
                let turn_progress = _prog * Math.min( 1, _prog ** (2-(2*_prog)) );
                let next_pos = course.curves[0].getPointAt( turn_progress );
                console.log( starship.position.distanceTo( pilot.position.clone() ));
                starship.position.copy( pilot.position.clone() );
                cache.compilation.starship.positions.push( pilot.position.clone() );
                pilot.position.copy( next_pos );
                if( cache.stage_frame > 15 ){
                  let _now = starship.quaternion.clone();
                  starship.lookAt( pilot.position );
                  let _rot = starship.quaternion.clone();
                  let turning_speed = 3.14159 / cache.durations[0];
                  _now.rotateTowards( _rot, turning_speed );
                  starship.quaternion.copy( _now );
                  cache.compilation.starship.quaternions.push( _now.clone() );
                } else {
                  cache.compilation.starship.quaternions.push( starship.quaternion.clone() );
                }
              }
              break;
            case 1:
            if( cache.stage_frame >= cache.durations[1] ) {
              cache.stage = 2;
              cache.stage_frame = -1;
            } else {
              let _prog = cache.stage_frame / cache.durations[1];
              let _rem = ( cache.durations[2] - cache.stage_frame ) / cache.durations[2];
              let warp_progress = _prog * Math.min( 1, _prog ** (2-(2*_rem)) );
              let next_pos = course.curves[1].getPointAt( warp_progress );

              starship.position.copy( pilot.position.clone() );
              cache.compilation.starship.positions.push( pilot.position.clone() );
              pilot.position.copy( next_pos );
              let _now = starship.quaternion.clone();
              starship.lookAt( pilot.position );
              let _rot = starship.quaternion.clone();
              let turning_speed = .0314159 / cache.durations[1];
              _now.rotateTowards( _rot, turning_speed );
              starship.quaternion.copy( _now );
              cache.compilation.starship.quaternions.push( _now.clone() );
            }
              break;
            case 2:
              if( cache.stage_frame >= ( cache.durations[2] - 5 ) ) {
                cache.stage = 3;
                cache.stage_frame = -1;
                cache.docking_prog = ( cache.durations[2] - 5 ) / cache.durations[2];
              }
              else{
                let _prog = cache.stage_frame / cache.durations[2];
                let _rem = ( cache.durations[2] - cache.stage_frame ) / cache.durations[2];
                let arrival_progress = _prog * Math.min( 1, _prog ** (2-(2*_rem)) );
                let next_pos = course.curves[2].getPointAt( arrival_progress );
                starship.position.copy( pilot.position.clone() );
                cache.compilation.starship.positions.push( pilot.position.clone() );
                pilot.position.copy( next_pos );
                if( cache.stage_frame > 0 ){
                  let _now = starship.quaternion.clone();
                  starship.lookAt( pilot.position );
                  let _rot = starship.quaternion.clone();
                  let turning_speed = 3.14159 / cache.durations[2];
                  _now.rotateTowards( _rot, turning_speed );
                  starship.quaternion.copy( _now );
                  cache.compilation.starship.quaternions.push( _now.clone() );
                } else {
                  cache.compilation.starship.quaternions.push( starship.quaternion.clone() );
                }
              }
              break;
            case 3:
              if( cache.stage_frame >= cache.durations[3] || cache.compiled ) {
                starship.position.copy( course.curves[2].getPointAt( 1 ) );
                cache.compilation.starship.positions.push( course.curves[2].getPointAt( 1 ) );
                starship.quaternion.copy( cache.docking_quat );
                cache.compilation.starship.quaternions.push( cache.docking_quat );
                cache.compiled = true;
              }
              else{
                let _rem_prog = 1 - cache.docking_prog;
                let _prog = cache.docking_prog + ( _rem_prog * ( cache.stage_frame / cache.durations[3] ) );
                let _rem = 1 - _prog;
                let docking_progress = _prog * Math.min( 1, _prog ** (2-(2*_rem)) );
                let next_pos = course.curves[2].getPointAt( docking_progress );
                starship.position.copy( pilot.position.clone() );
                cache.compilation.starship.positions.push( pilot.position.clone() );
                pilot.position.copy( next_pos );
                let turning_speed = 3.14159 / 120 / 3;
                if( cache.stage_frame < cache.durations[3] - 120 ){
                  let _now = starship.quaternion.clone();
                  starship.lookAt( pilot.position );
                  let _rot = starship.quaternion.clone();
                  _now.rotateTowards( _rot, turning_speed );
                  starship.quaternion.copy( _now );
                  cache.compilation.starship.quaternions.push( _now.clone() );
                }
                else {
                  starship.quaternion.rotateTowards( cache.docking_quat, turning_speed );
                  cache.compilation.starship.quaternions.push( starship.quaternion.clone() );
                }
              }
              break;
          }
          cache.stage_frame++;
          return;
        },
        update: ()=>{
          let cache = plotted_course.cache;
          if( cache.completed ){
            this.updatables.delete( 'warp_to' );
            let a = cache.arrival_emitter;
            if ( a && a instanceof Function ) {
              a();
            } else if( a && a.dictum_name && a.ndx ) {
              a.director.emit( `${a.dictum_name}_progress`, a.dictum_name, a.ndx );
            }
          } else {
            if( cache.frame < cache.compilation.starship.positions.length || cache.frame < cache.compilation.starship.quaternions.length){
              cache.starship.position.copy( cache.compilation.starship.positions[cache.frame] );
              cache.starship.quaternion.copy( cache.compilation.starship.quaternions[cache.frame] );
            } else {
              cache.completed = true;
            }
          }
          cache.frame++;
        },
        cache: {
          compiled: false,
          completed: false,
          frame: 0,
          stage_frame: 0,
          arrival_emitter: arrival_emitter,
          course: course,
          stage: 0,
          durations:[ 180, 360, 120, 1200 ],
          starship: this.actors.Starship,
          destination: planetary_body,
          docking_quat: docking_quat,
          pilot: pilot,
          compilation: {
            starship: {
              positions: [],
              quaternions: []
            }
          }
        }
      }
      const arrSum = arr => arr.reduce((a,b) => a + b, 0)
      let duration = arrSum( plotted_course.cache.durations ) + plotted_course.cache.durations.length;
      for( let ndx = 0; ndx < duration; ndx++ ){
        plotted_course.compile();
      }
      this.updatables.set('warp_to', plotted_course );
    },
    change_cam_original: async ( cam_name ) =>{
      let ship = this.actors.Starship;
      let new_position = new THREE.Vector3();
      let new_target_position = new THREE.Vector3();

      switch( cam_name ){
        case 'Center':
          new_position.setY( this.major_dim );
          new_position.setZ( this.major_dim );
          new_target_position = new THREE.Vector3();
          this.active_cam.up = new THREE.Vector3( 0, 1, 0 );

          break;
        case 'CaptainCam':
        case 'OpsCam':
        case 'ConnCam':
        case '3rdPersonCam':
        case '3rdShipCam':
          ship.getWorldPosition( new_position );
          ship.NavDots.sight_target.getWorldPosition( new_target_position );
          break;
      }
      this.position.copy( new_position );
      this.target.copy( new_target_position );
      this.active_cam.position.copy( this.position );
      this.active_cam.lookAt( this.target );
      if( this.controls.orbit_controls ) this.controls.orbit_controls.target.copy( new_target_position );
      this.active_cam.updateProjectionMatrix();
      this.active_cam.name = cam_name;

    },
    change_cam_old: async ( cam_name ) =>{
      // REPLACE WITH MOVING TRANSITION... NO MORE JUMP CUTS!!!
      let travel_duration = 30; // calculate paths for any distance.
      let a = new THREE.Vector3();
      this.active_cam.getWorldPosition( a );
      let b = new THREE.Vector3();
      let cam = this.cameras.get( cam_name );
      cam.getWorldPosition( b );
      let distance = a.distanceTo( b );
      let travel_type = ( distance > 5000 ) ? ( distance > 10000000 ) ? "FAST" : "TRANSPORT" : "LOCAL";
      console.log( `Distance: ${distance} | Type: ${travel_type}` );
      let camera_change = new SceneTransformation({
        update: ()=>{
          let cache = camera_change.cache;

          // Queue up the frame / sequence or => post()
          if(++cache.frame > cache.durations[cache.seq]){
            cache.frame = 1;
            if( ++cache.seq >= cache.durations.length ) camera_change.post();
            else{
              let progress = cache.frame / cache.durations[cache.seq];
              switch( cache.type ){
                case "FAST":
                    switch(cache.seq){
                      case 0:
                        // This is for turning toward the destination

                        break;
                      case 1:
                        // If fast-travelling, zoom the camera to augment the warp tunnel visuals

                        break;
                      case 2:
                        // if fast-travelling, this is for gracefully landing at the destination.

                        break;
                      default:
                        // Should not actually get here. :)
                        break;
                    }
                  break;
                case "TRANSPORT":
                    switch(cache.seq){
                      case 0:
                        // if transporting, this is for the beaming sequence

                        break;
                      case 1:
                        /* If transporting:
                            zoom out to encompass both locations,
                            overlay labels and icons as a virtual map display,
                            show the travel path for the journey as an arcing arrow from start to finish
                            zoom in to the destination, bringing the label become the title when rematerializing.
                        */

                        break;
                      case 2:
                        // if transporting, this is for the beaming sequence

                        break;
                      default:
                        // Should not actually get here. :)
                        break;
                    }
                  break;

                case "LOCAL":
                    switch(cache.seq){
                      case 0:

                        break;
                      case 1:

                        break;
                      case 2:

                        break;
                      default:
                        // Should not actually get here. :)
                        break;
                    }
                  break;
                default:
                  // Should not actually get here. :)
                  break;
              }

            }
          }
        },
        cache: {
          frame: 0,
          seq: 0,
          durations: [15,travel_duration,15],
          a: a,
          b: b,
          distance: distance,
          type: travel_type
        },
        post: ()=>{
          /*
          let cam_pos = new THREE.Vector3();
          this.cameras.get( cam_name ).getWorldPosition( cam_pos );
          let cam_quat = new THREE.Quaternion();
          this.cameras.get( cam_name ).getWorldQuaternion( cam_quat );
          this.active_cam.position.copy( cam_pos );
          this.active_cam.quaternion.copy( cam_quat );
          this.active_cam.name = cam_name;
          this.active_cam.updateProjectionMatrix();
          */

          let ship = this.actors.Starship;
          let new_position = new THREE.Vector3();
          let new_target_position = new THREE.Vector3();
          let major_dim = Math.max( window.innerHeight, window.innerWidth );
          let minor_dim = Math.min( window.innerHeight, window.innerWidth );

          this.active_cam = this.cameras.get( cam_name );
/*
          switch( cam_name ){
            case 'Center':
              //new_position.setY( major_dim );
              //new_position.setZ( major_dim );
              new_target_position = new THREE.Vector3();
              this.active_cam.up = new THREE.Vector3( 0, 1, 0 );

              break;
            case '3rdPerson':
              //this.cameras.get( cam_name )
              //ship.getWorldPosition( new_position );
              //new_position.add( new THREE.Vector3( 0, 10, -50 ) );
              //ship.getWorldPosition( new_target_position );
              ship.position.copy( new_target_position );
              break;
            case 'CaptainCam':
              //ship.getWorldPosition( new_position );
              ship.NavDots.sight_target.getWorldPosition( new_target_position );
              break;
          }

          //this.active_cam.position.copy( new_position );
          this.active_cam.lookAt( new_target_position );
          if( this.controls.orbit_controls ) this.controls.orbit_controls.target.copy( new_target_position );
          */
          this.active_cam.updateProjectionMatrix();
          this.active_cam.name = cam_name;

        }
      });
      this.updatables.set( 'change_cam', camera_change );
    },
    change_cam: async ( cam_name ) => {
      if( cam_name !== this.active_cam.name ){
        function StringBuilder(){
          var _string = arguments[0] || '';

          for (var i=1; i < arguments.length; i++) {
            var symbol = '%' + i;
            var replacement = arguments[i] || 0;
            _string = _string.replace(symbol, replacement);
          }
          return _string;
        }

        function StringCombiner(){
          var _string = arguments[0] || '';

          for (var i=1; i < arguments.length; i++) {
            _string += ' ' + arguments[i];
          }
          return _string;
        }


        document.title = StringCombiner( 'Dollying to ', cam_name ,' | Wethe.Network' );
        let start_position = this.active_cam.getWorldPosition( new THREE.Vector3() );
        let dolly_cam = this.active_cam.clone();
        dolly_cam.position.copy( start_position );
        this.sys_ve_scene.add( dolly_cam );
        this.active_cam = dolly_cam;
        let destination_camera = this.cameras.get( cam_name );
        let finish_position = destination_camera.getWorldPosition( new THREE.Vector3() );
        let distance_between = start_position.distanceTo( finish_position );
        let ahead = new THREE.Vector3(0, 0, -1).transformDirection( dolly_cam.matrixWorld.clone() );
        let ray_forward = new THREE.Ray( start_position, ahead );
        let a_tenth_ahead = ray_forward.at( distance_between / 10, new THREE.Vector3() );

        let dolly_path = new THREE.QuadraticBezierCurve3( start_position, a_tenth_ahead, finish_position );
        let pilot = new THREE.Object3D();
        pilot.position.copy( start_position );
        let transition_course = {
          compile: ( )=>{

            let cache = transition_course.cache;
            let dolly_cam = cache.dolly_cam;
            let course = cache.course;
            let pilot = cache.pilot;

            for( ;cache.iteration < cache.duration; cache.iteration++ ){
              let _prog = cache.iteration / cache.duration;
              let dolly_progress = _prog * Math.min( 1, _prog ** (2-(2*_prog)) );
              let next_pos = course.getPointAt( dolly_progress );

              dolly_cam.position.copy( pilot.position.clone() );
              cache.compilation.dolly_cam.positions.push( dolly_cam.position.clone() );
              pilot.position.copy( next_pos );
              dolly_cam.lookAt( pilot.position );
              cache.compilation.dolly_cam.quaternions.push( dolly_cam.quaternion.clone() );
            }
            cache.compilation.dolly_cam.positions.push( course.getPointAt( 1 ) );
            cache.compilation.dolly_cam.quaternions.push( cache.destination.quaternion );
            return cache.compiled = true;
          },
          update: ()=>{
            let cache = transition_course.cache;
            let dolly_cam = cache.dolly_cam;
            if( cache.completed ){
              this.updatables.delete( 'dolly_to' );
              this.sys_ve_scene.remove( dolly_cam );
              this.active_cam = cache.destination;
              document.title = StringCombiner( cam_name,' | Wethe.Network' );

            } else {
              if( cache.frame < cache.compilation.dolly_cam.positions.length || cache.frame < cache.compilation.dolly_cam.quaternions.length){
                dolly_cam.position.copy( cache.compilation.dolly_cam.positions[cache.frame] );
                dolly_cam.quaternion.copy( cache.compilation.dolly_cam.quaternions[cache.frame] );

                dolly_cam.updateProjectionMatrix();
              } else {
                cache.completed = true;
              }
            }
            cache.frame++;
          },
          cache: {
            compiled: false,
            completed: false,
            frame: 0,
            iteration: 0,
            course: dolly_path,
            duration: 180,
            destination: destination_camera,
            dolly_cam: dolly_cam,
            pilot: pilot,
            compilation: {
              dolly_cam: {
                positions: [],
                quaternions: []
              }
            }
          }
        }
        transition_course.compile();
        this.updatables.set('dolly_to', transition_course );
      }
    },
    transform: async ( objects, targets, duration, arrival_emitter = false )=>{
      // Remove actively competing animations by resetting this engine.
      this.updatables.delete('ui_transform');
      delete this.sys_ui_scene.updates;
      this.sys_ui_scene.updates = {
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

            let objects = this.sys_ui_scene.updates.cache.objects;
            let targets = this.sys_ui_scene.updates.cache.targets;
            let paths = this.sys_ui_scene.updates.cache.paths;
            let _tprog = this.sys_ui_scene.updates.cache.frame / this.sys_ui_scene.updates.cache.duration;
            let transform_progress = _tprog ** (10-(10.05*_tprog));

            for ( let ndx = 0; ndx < objects.length; ndx++ ) {

              let new_pos = new THREE.Vector3();
              if ( this.sys_ui_scene.updates.cache.frame === this.sys_ui_scene.updates.cache.duration ) {
                new_pos = targets[ ndx ].position;
              } else {
                paths[ ndx ].at( transform_progress, new_pos );
              }
              let object = objects[ ndx ];
              object.position.copy( new_pos );
              object.lookAt( this.active_cam.position );
            }

          }
          if( ++this.sys_ui_scene.updates.cache.frame >= this.sys_ui_scene.updates.cache.duration ) this.sys_ui_scene.updates.cache.completed = true;
        },
        cache: ui_transform_cache
      }
      this.updateables.set( 'ui_transform', ui_transform );
    },
    addLabel: async ( name, location )=>{

			const textGeo = new TextGeometry( name, {
				font: font,
				size: 20,
				height: 1,
				curveSegments: 1
			} );

			const textMaterial = new THREE.MeshBasicMaterial();
			const textMesh = new THREE.Mesh( textGeo, textMaterial );
			textMesh.position.copy( location );
			this.sys_ve_scene.add( textMesh );

		}
  };
  SetSceneBackground = async ( )=>{

    const loader = new THREE.CubeTextureLoader();
				loader.setPath( 'textures/environment/' );
				let textureCube = await loader.load( [ 'corona_lf.png', 'corona_rt.png', 'corona_up_2.png', 'corona_dn_2.png', 'corona_ft.png', 'corona_bk.png'   ] );
				this.sys_ve_scene.background = textureCube;
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
    get Model(){

      let loading = new Promise( ( resolve, reject )=>{
        const loader = new GLTFLoader();
        // Optional: Provide a DRACOLoader instance to decode compressed mesh data
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/' );
        loader.setDRACOLoader( dracoLoader );
        loader.load( 'models/scene.glb',
          async ( gltf )=>{
            resolve( gltf );
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
          return await loading.then(( model )=>{
            delete this.Model;
            return this.Model = model;

          })
        } catch(e) {
          return 0; // fallback value;
        }
      })();
    },
    get Avatar(){

      let loading = new Promise( ( resolve, reject )=>{
        const loader = new GLTFLoader();
        // Optional: Provide a DRACOLoader instance to decode compressed mesh data
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/' );
        loader.setDRACOLoader( dracoLoader );
        loader.load( 'models/Avatar.glb',
          async ( gltf )=>{
            resolve( gltf );
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
          return await loading.then(( avatar )=>{
            delete this.Avatar;
            return this.Avatar = avatar.scene.children[0];

          })
        } catch(e) {
          return 0; // fallback value;
        }
      })();
    },
    get SpaceStation(){

      let loading = new Promise( ( resolve, reject )=>{
        const loader = new GLTFLoader();
        // Optional: Provide a DRACOLoader instance to decode compressed mesh data
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/' );
        loader.setDRACOLoader( dracoLoader );
        loader.load( 'models/Earth.glb',
          async ( gltf )=>{

            let _earth = gltf.scene;
            let earth = new SceneAsset3D( _earth );
            earth.scale.set( 13000, 13000, 13000 );
            earth.position.set( 149598023000, 0, 0 );
            earth.name = 'Earth';
            earth.directions.set( 'revolve', function(){
              earth.rotation.y += .0002424;
            });
            earth.surface_distance = 6371000;
            earth.orbital_distance = 1 * 9009000;
            earth.orbital_vector = new THREE.Vector3( 9009000, 3000000, 9009000 );

            resolve( earth );
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
          return await loading.then(( earth )=>{

            delete this.Earth;
            return this.Earth = earth;

          })
        } catch(e) {
          return 0; // fallback value;
        }
      })();
    },
    get HomeDome(){

      let loading = new Promise( ( resolve, reject )=>{
        const loader = new GLTFLoader();
        // Optional: Provide a DRACOLoader instance to decode compressed mesh data
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/' );
        loader.setDRACOLoader( dracoLoader );
        loader.load( 'models/space_station.glb',
          async ( gltf )=>{

            let _model = gltf.scene;
            let home_dome = new SceneAsset3D( _model );
            home_dome.scale.set( 1, 1, 1 );
            home_dome.position.set( 149600000105, 5000040, 4999769 );
            home_dome.name = 'HomeDome';
            home_dome.orbital_vector = home_dome.position.clone().add( {x:1, y:4, z:98} );
            home_dome.orbital_quaternion = new THREE.Quaternion( 0, 1, 0, 0.0000013267948966775328 );
            home_dome.destinations = [
              {
                vector: home_dome.position.clone().add( {x:1, y:4, z:98} ),
                quaternion: new THREE.Quaternion( 0, 1, 0, 0.0000013267948966775328 )
              }
            ];


            resolve( home_dome );
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
          return await loading.then(( home_dome )=>{

            delete this.HomeDome;
            return this.HomeDome = home_dome;

          })
        } catch(e) {
          return 0; // fallback value;
        }
      })();
    },
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
  //VIEW;
  cache = {};

  constructor( ){
    super( );

    
    this.VIEW = VIEW;

    // Camera & Controls Setup
    let center_cam = new THREE.PerspectiveCamera( VIEW.fov, VIEW.aspect, VIEW.near, VIEW.far );
    center_cam.position.set( 0, 0, 0 );
    center_cam.lookAt( new THREE.Vector3() );
    center_cam.updateProjectionMatrix();
    this.cameras.set('Center',  center_cam);
    this.active_cam = this.cameras.get( 'Center' );

    this.ui_cam = new THREE.PerspectiveCamera( VIEW.fov, VIEW.aspect, VIEW.near, VIEW.far );
    //this.ui_cam.position.set( 0, 0, VIEW.major_dim );
    this.ui_cam.position.set( 0, 0, 9 );
    this.ui_cam.setRotationFromEuler( new THREE.Euler( center_cam.rotation.x,center_cam.rotation.y,center_cam.rotation.z, 'XYZ' ) );


  }
}

export { Screenplay }
