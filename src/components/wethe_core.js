import { SceneTransformation } from '../bin/ScreenDirector.js';
import React from 'react';
import { useState, useEffect, useRef, Fragment } from 'react';
// Support Library Reference
import * as THREE from 'three';
import jsQR from 'jsqr';
import * as d3 from 'd3';
import GUI from 'lil-gui';
import QRCode from 'qrcode';
import * as Plot from "@observablehq/plot";
import { OrbitControls } from '../lib/OrbitControls.js';
import { FirstPersonControls } from '../lib/FirstPersonControls.js';
import { FlyControls } from '../lib/FlyControls.js';
import { TrackballControls } from '../lib/TrackballControls.js';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: false };
  }
  // Update state so the next render will show the fallback UI.
  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }
  // You can also log the error to an error reporting service
  componentDidCatch(error, errorInfo) {
    console.error( error, errorInfo );
  }

  render() {
    // You can render any custom fallback UI
    if (this.state.hasError) {
      return (<><h1>Something went wrong.</h1><p>{this.state.error}</p></>);
    }
    return this.props.children;
  }
}
function WeTheMenu( props ){
  const panel = useRef();
  const screenplay = props.screenplay;
  const [activePipGUID, setActivePipGUID] = useState( 0 );
  const [mode, setMode] = useState( props.mode );
  const [backto, setBackto] = useState( false );



  function cleanup() {
    //document.getElementById( 'root' ).classList.remove( 'no_pip' );
  }
  // Menu Display Control
  function toggleMenu( event ) {
    console.log( event );
    switch( mode ){
      case 'collapsed':
        document.getElementById( 'WeTheMenu' ).classList.remove( 'collapsed' );
        setMode('open');
        setBackto('collapsed');
        break;

      case 'open':
        document.getElementById( 'WeTheMenu' ).classList.remove( 'open' );
        setMode(backto);
        break;

      case 'holo':
        document.getElementById( 'WeTheMenu' ).classList.remove( 'holo' );
        setMode('open');
        setBackto('holo');
        break;

    }
  }
  // PipGUI Display Control
  function toggleGlyphScanner( event ) {
    activePipGUID === 1 ? setActivePipGUID( 0 ) : setActivePipGUID( 1 );
    toggleMenu();
  }
  function toggleShareContact( event ) {
    activePipGUID === 2 ? setActivePipGUID( 0 ) : setActivePipGUID( 2 );
    toggleMenu();
  }
  function toggleDropPin( event ) {
    activePipGUID === 3 ? setActivePipGUID( 0 ) : setActivePipGUID( 3 );
    toggleMenu();
  }
  function toggleSnapPix( event ) {
    activePipGUID === 4 ? setActivePipGUID( 0 ) : setActivePipGUID( 4 );
    toggleMenu();
  }
  function toggleRecordNote( event ) {
    activePipGUID === 5 ? setActivePipGUID( 0 ) : setActivePipGUID( 5 );
    toggleMenu();
  }
  function toggleRemindMe( event ) {
    activePipGUID === 6 ? setActivePipGUID( 0 ) : setActivePipGUID( 6 );
    toggleMenu();
  }
  function toggleSearch( event ) {
    activePipGUID === 7 ? setActivePipGUID( 0 ) : setActivePipGUID( 7 );
    toggleMenu();
  }

  useEffect(()=>{

    return cleanup;
  },[]);

  useEffect(()=>{
    if( activePipGUID == 0 ){
      document.getElementById( 'sys_ve_canvas' ).classList.remove( 'blurry' );
    } else{
      document.getElementById( 'sys_ve_canvas' ).classList.add( 'blurry' );
    }
  },[activePipGUID])

  useEffect(()=>{
    document.getElementById( 'WeTheMenu' ).classList.add( mode );
  },[mode])

  return(<>
    <style>{`
      #WeTheMenu {
        transition: all .2s;
        grid-area: menu;
        position: relative;
      }
      @media ( orientation: landscape ){
        #WeTheMenu {
          width: 33vw;
          height: 33vw;
          place-self: end;
        }
        #WeTheMenu.collapsed{
          transform: rotateX(72deg) translateY(33vw) rotateY(4deg) rotateZ( 4deg );
        }
      }
      @media ( orientation: portrait ){
        #WeTheMenu {
          width: 80vw;
          height: 80vw;
          position: absolute;
          left: 10vw;
          bottom: 0;
        }
        #WeTheMenu.collapsed{
          transform: rotateX(72deg) translateY(80vw) rotateY(4deg) rotateZ( 4deg );
        }
      }
      #WeTheMenu::before {
        content: '';
        width: 100%;
        height: 100%;
        filter: blur(1.25em);
        position: absolute;
        background: var( --menuBG );
      }
      #WeTheMenu.collapsed{
        background: var( --menuBG );
        cursor: pointer;
        border-radius: 50%;
        border: outset 3px;
        contain: content;
      }
      #WeTheMenu.open{
        border: none;
        border-radius: 50%;
      }

      .menu_title{
        height: 100%;
        width: 100%;
        cursor: pointer;
        text-align: center;
        position: absolute;
        display: grid;
        position: relative;
        transition: all 0.5s;
      }
      .menu_title::before{
        content: '';
        height: 100%; width: 100%;
        opacity: 0;
        background: radial-gradient(var(--o1),var(--o3), #fff0 70%);
        transition: opacity 0.5s 0.2s;
      }
      .menu_title:hover::before{
        opacity: 1;
      }
      .collapsed > .menu_title{
        margin: auto;
      }
      .open > .menu_title{
        margin: 0;
      }

      .menu_title .menu_label{
        position: absolute;
        bottom: 100%;
        font-size: 2em;
      }
      .menu_title .menu_icon{
        width: 100%;
        place-self: center;
        position: absolute;
      }
      .collapsed > .menu_title .menu_label{
        display: none;
      }
      .open > .menu_title .menu_icon{
        width: 50%;
      }

      .menu_choice {
        cursor: pointer;
        pointer-events: auto;
        transform: rotateX(0deg);
        border-radius: 50%;
        border: outset 0.25em;
        position: absolute;
        display: inline-flex;
        background: linear-gradient( 11deg, #000036, black, #630000);
      }
      .menu_choice:hover{
        z-index: 7;
      }
      .menu_choice::before{
        content: '';
        position: absolute;
        z-index: -1;
        border-radius: 50%;
        height: 100%; width: 100%;
        opacity: 0;
        transition: opacity 0.5s;
      }
      .menu_choice:hover::before{
        opacity: 1;
      }
      .collapsed > .menu_choice{
        pointer-events: none;
        display: none;
      }
      .open > .menu_choice{

      }
      .menu_choice[data-position="0"]{
        height: 32%; width: 32%;
        border-color: var(--r1);
        left: 34%; top: 34%;
      }
      .menu_choice[data-position="0"]:hover::before{
        background: linear-gradient( 135deg, var(--v2), var(--r2), var(--o2));
      }
      .menu_choice[data-position="1"]{
        height: 29%; width: 29%;
        border-color: var(--r1);
        left: 2%; top: 22%;
      }
      .menu_choice[data-position="1"]:hover::before{
        background: linear-gradient( 135deg, var(--v2), var(--r2), var(--o2));
      }
      .menu_choice[data-position="2"]{
        height: 27.5%; width: 27.5%;
        border-color: var(--o1);
        left: 31%; top: 1%;
      }
      .menu_choice[data-position="2"]:hover::before{
        background: linear-gradient( 135deg, var(--r2), var(--o2), var(--y2));
      }
      .menu_choice[data-position="3"]{
        height: 24%; width: 24%;
        border-color: var(--y1);
        left: 63%; top: 14%;
      }
      .menu_choice[data-position="3"]:hover::before{
        background: linear-gradient( 135deg, var(--o2), var(--y2), var(--g2));
      }
      .menu_choice[data-position="4"]{
        height: 21%; width: 21%;
        border-color: var(--g1);
        left: 70%; top: 45%;
      }
      .menu_choice[data-position="4"]:hover::before{
        background: linear-gradient( 135deg, var(--y2), var(--g2), var(--b2));
      }
      .menu_choice[data-position="5"]{
        height: 17%; width: 17%;
        border-color: var(--b1);
        left: 55%; top: 69%;
      }
      .menu_choice[data-position="5"]:hover::before{
        background: linear-gradient( 135deg, var(--g2), var(--b2), var(--i2));
      }
      .menu_choice[data-position="6"]{
        height: 14%; width: 14%;
        border-color: var(--i1);
        left: 34%; top: 75%;
      }
      .menu_choice[data-position="6"]:hover::before{
        background: linear-gradient( 135deg, var(--b2), var(--i2), var(--v2));
      }
      .menu_choice[data-position="7"]{
        height: 11%; width: 11%;
        border-color: var(--v1);
        left: 21%; top: 60%;
      }
      .menu_choice[data-position="7"]:hover::before{
        background: linear-gradient( 135deg, var(--i2), var(--v2), var(--r2));
      }

      .menu_choice:hover label{
        opacity: 1;
        background: linear-gradient( 90deg, var(--i2), #0007 );
      }
      .menu_choice label{
        position: absolute;
        opacity: 0;
        bottom: 100%;
        white-space: nowrap;
        transition: opacity .5s .2s;
      }

    `}</style>
    <div id="WeTheMenu" ref={panel} className={props.mode} >
      <div className="menu_title" onClick={toggleMenu}>
        <label htmlFor="OpenWeTheMenu" className="menu_label pip_title">System Menu</label>
        <input type="image" src=".\both_wethebrand.png" name="OpenWeTheMenu" className="menu_icon" />
      </div>
      <div className="menu_choice" data-position={1} onClick={toggleGlyphScanner} >
        <label htmlFor="OpenGlyphScanner" className="pip_text">Scan a Glyph</label>
        <input type="image" src=".\both_glyphscanner.png" name="OpenGlyphScanner" />
      </div>
      <div className="menu_choice" data-position={2} onClick={toggleShareContact} >
        <input type="image" src=".\both_atme_safe.png" name="OpenShareContact" />
        <label htmlFor="OpenShareContact" className="pip_text">Share Contact</label>
      </div>
      <div className="menu_choice" data-position={3} onClick={toggleDropPin} >
        <label htmlFor="OpenDropPin" className="pip_text">Drop-A-Pin</label>
        <input type="image" src=".\dark_pindrop.png" name="OpenDropPin" />
      </div>
      <div className="menu_choice" data-position={4} onClick={toggleSnapPix} >
        <label htmlFor="OpenSnapPix" className="pip_text">Snap Pix</label>
        <input type="image" src=".\both_camera.png" name="OpenSnapPix"/>
      </div>
      <div className="menu_choice" data-position={5} onClick={toggleRecordNote} >
        <label htmlFor="OpenRecordNote" className="pip_text">Record Audio</label>
        <input type="image" src=".\both_mic.png" name="OpenRecordNote"/>
      </div>
      <div className="menu_choice" data-position={6} onClick={toggleRemindMe} >
        <input type="image" src=".\both_stickynote.png" name="OpenRemindMe" />
        <label htmlFor="OpenRemindMe" className="pip_text">Remind Me!</label>
      </div>
      <div className="menu_choice" data-position={7} onClick={toggleSearch} >
        <label htmlFor="OpenSearch" className="pip_text">Search</label>
        <input type="image" src=".\both_search.png" name="OpenSearch" />
      </div>
    </div>
    {activePipGUID === 1 ? <GlyphScanner toggle={toggleGlyphScanner} screenplay={screenplay} /> : <></>}
    {activePipGUID === 2 ? <ShareContact toggle={toggleShareContact} screenplay={screenplay} /> : <></>}
    {activePipGUID === 3 ? <DropPin toggle={toggleDropPin} screenplay={screenplay} /> : <></>}
    {activePipGUID === 4 ? <SnapPix toggle={toggleSnapPix} screenplay={screenplay} /> : <></>}
    {activePipGUID === 5 ? <RecordNote toggle={toggleRecordNote} screenplay={screenplay} /> : <></>}
    {activePipGUID === 6 ? <RemindMe toggle={toggleRemindMe} screenplay={screenplay} /> : <></>}
    {activePipGUID === 7 ? <Search toggle={toggleSearch} screenplay={screenplay} /> : <></>}
  </>);
}
// Menu Content
function GlyphScanner( props ){
  const screenplay =  props.screenplay;

  const [phase, setPhase] = useState( 0 );
  const [enter, setEnter] = useState( false );
  const [exit, setExit] = useState( false );
  const dbOpenRequest = useRef( false );
  const db = useRef( false );
  const loc = useRef( false );
  const processing = useRef( false );
  const stop = useRef( false );
  const selectors = useRef();
  const [code_found, setCodeFound] = useState( false );

  const [outputMessage, setOutputMessage] = useState();

  const panel = useRef();
  const videoElement = useRef();
  const videoSelect = useRef();
  const scan_button = useRef();
  const scannedGlyphs = useRef();

  function cleanup(){
    deInitComponent();
  }
  function init(){
    const entrance_transition = new SceneTransformation({
      update: ( delta )=>{
        let cache = entrance_transition.cache;
        if( ++cache.frame <= cache.duration ){
          let progress = cache.frame / cache.duration;
          panel.current.style.scale = progress;

        } else {
          entrance_transition.post( );  // This calls for the cleanup of the object from the scene and the values from itself.
        }
      },
      cache: {
        duration: 15, /* do something in 60 frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        entrance_transition.cache.duration = 15;
        entrance_transition.cache.frame = 0;
        screenplay.updatables.set( 'panel_entrance_transition', entrance_transition );
      },
      post: ( )=>{
        let cache = entrance_transition.cache;
        screenplay.updatables.delete( 'panel_entrance_transition' );
        panel.current.style.transform = `scale(1)`;
      }
    });
    setEnter( entrance_transition );
    const exit_transition = new SceneTransformation({
      update: ( delta )=>{
        let cache = exit_transition.cache;
        if( ++cache.frame <= cache.duration ){
          let progress = 1 - cache.frame / cache.duration;
          panel.current.style.scale = progress;

        } else {
          exit_transition.post( );  // This calls for the cleanup of the object from the scene and the values from itself.
        }
      },
      cache: {
        duration: 15, /* do something in this many frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        exit_transition.cache.duration = 15;
        exit_transition.cache.frame = 0;
        screenplay.updatables.set( 'panel_exit_transition', exit_transition );
      },
      post: ( )=>{
        let cache = exit_transition.cache;
        screenplay.updatables.delete( 'panel_exit_transition' );
        panel.current.style.transform = `scale(0)`;
        director.emit( `${dictum_name}_progress`, dictum_name, ndx );
      }
    });
    setExit( exit_transition );
    screenplay.updatables.set( 'panel_entrance_transition', entrance_transition );

    // Load GlyphScanner Database
    dbOpenRequest.current = window.indexedDB.open( 'GlyphScanner', 1 );
    dbOpenRequest.current.onerror = (event) => {};
    dbOpenRequest.current.onsuccess = (event) => {
      // Store the result of opening the database in the db variable. This is used a lot below
      db.current = dbOpenRequest.current.result;
      // Run the loadScannedGlyphs() function to populate the SnapPix display with working pix yet to be saved.
      loadScannedGlyphs();
    };
    dbOpenRequest.current.onupgradeneeded = (event) => {
      db.current = event.target.result;
      db.current.onerror = (event) => {
        //outputMessage.current.appendChild(createListItem('Error loading database.'));
      };
      // Create an objectStore for this database
      let objectStore = db.current.createObjectStore('GlyphScanner', { keyPath: 't' });
      // Define what data items the objectStore will contain
      objectStore.createIndex('code', 'code', { unique: false });
      objectStore.createIndex('crop', 'crop', { unique: false });
      objectStore.createIndex('results', 'results', { unique: false });
      objectStore.createIndex('loc', 'loc', { unique: false });
    };

    // Initialize the user's Camera Interface
    selectors.current = [videoSelect.current];
    function updateDevices(deviceInfos) {
      // Handles being called several times to update labels. Preserve values.
      const values = selectors.current.map(select => select.value);
      selectors.current.forEach(select => {
        while (select.firstChild) {
          select.removeChild(select.firstChild);
        }
      });
      for (let i = 0; i !== deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];
        const option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === 'videoinput') {
          option.text = deviceInfo.label || `camera ${videoSelect.current.length + 1}`;
          videoSelect.current.appendChild(option);
        }
      }
      selectors.current.forEach((select, selectorIndex) => {
        if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
          select.value = values[selectorIndex];
        }
      });
    }
    navigator.mediaDevices.enumerateDevices().then(updateDevices).catch(handleMediaDeviceError);
    videoSelect.current.onchange = start;
    start();

    return cleanup;
  }
  useEffect( init , []);
  async function loadScannedGlyphs(){
    scannedGlyphs.current.replaceChildren();

    const objectStore = db.current.transaction( 'GlyphScanner' ).objectStore( 'GlyphScanner' );
    objectStore.openCursor().onsuccess = ( event )=>{
      const cursor = event.target.result;
      // Check if there are no (more) cursor items to iterate through
      if (!cursor) {
        return;
      }
      const glyph = cursor.value;
      displayGlyph( glyph );

      // continue on to the next item in the cursor
      cursor.continue();
    }
  }
  async function displayGlyph( glyph ) {
    const urlCreator = window.URL || window.webkitURL;
    const url = urlCreator.createObjectURL( await glyph.crop );
    let li = document.createElement( 'li' );
    let img = document.createElement( 'img' );
    img.setAttribute( 'src', url );
    img.setAttribute( 'id', glyph.t );
    li.appendChild( img );
    li.classList.add( 'glyph' );
    scannedGlyphs.current.appendChild( li );

  };
  function updateDevices(deviceInfos) {
    // Handles being called several times to update labels. Preserve values.
    const values = selectors.current.map( select => select.value);
    selectors.current.forEach(select => {
      while (select.firstChild) {
        select.removeChild(select.firstChild);
      }
    });
    for (let i = 0; i !== deviceInfos.length; ++i) {
      const deviceInfo = deviceInfos[i];
      const option = document.createElement('option');
      option.value = deviceInfo.deviceId;
      if (deviceInfo.kind === 'videoinput') {
        option.text = deviceInfo.label || `camera ${videoSelect.current.length + 1}`;
        videoSelect.current.appendChild(option);
      }
    }
    selectors.current.forEach((select, selectorIndex) => {
      if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
        select.value = values[selectorIndex];
      }
    });
  }
  function handleMediaDeviceError(error){
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
  }
  function start() {
    if (window.stream) {
      window.stream.getTracks().forEach(track => {
        track.stop();
      });
    }
    if ( navigator.geolocation ) {
      navigator.geolocation.getCurrentPosition( (pos)=>{
        loc.current = pos;
      });
    }
    const videoSource = videoSelect.current.value;
    const constraints = {
      video: {deviceId: videoSource ? {exact: videoSource} : undefined}
    };
    navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(updateDevices).catch(handleMediaDeviceError);
  }
  function gotStream(stream) {
    window.stream = stream; // make stream available to console
    videoElement.current.srcObject = stream;
    requestAnimationFrame( update );
    // Refresh button list in case labels have become available
    return navigator.mediaDevices.enumerateDevices();
  }
  // TODO: Force a much lower FPS rate for this update function... ~ 6fps.
  // Currently is settles for not scanning while scanning already.
  async function update() {
    if ( videoElement.current && videoElement.current.readyState === videoElement.current.HAVE_ENOUGH_DATA ) {
      if( !processing.current && !code_found ){
        processing.current = true;

        let width = videoElement.current.videoWidth;
        let height = videoElement.current.videoHeight;
        const photo_canvas = new OffscreenCanvas( width, height );
        const photo_context = photo_canvas.getContext( '2d', { alpha: false } );
        photo_context.drawImage( videoElement.current, 0, 0 );
        let imageData = photo_context.getImageData(0, 0, width, height);
        let code = await jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });
        if ( await code ) {
          function drawLine( context, begin, end, color ) {
            context.beginPath();
            context.moveTo(begin.x, begin.y);
            context.lineTo(end.x, end.y);
            context.lineWidth = 4;
            context.strokeStyle = color;
            context.stroke();
          }
          async function cropCode( photo_context, top_left, top_right, bottom_left, bottom_right ){
            drawLine(photo_context, code.location.topLeftCorner, code.location.topRightCorner, "#88CC88");
            drawLine(photo_context, code.location.topRightCorner, code.location.bottomRightCorner, "#88CC88");
            drawLine(photo_context, code.location.bottomRightCorner, code.location.bottomLeftCorner, "#88CC88");
            drawLine(photo_context, code.location.bottomLeftCorner, code.location.topLeftCorner, "#88CC88");
            let x_min = Math.min( code.location.topLeftCorner.x, code.location.bottomLeftCorner.x, code.location.topRightCorner.x, code.location.bottomRightCorner.x );
            let x_max = Math.max( code.location.topLeftCorner.x, code.location.bottomLeftCorner.x, code.location.topRightCorner.x, code.location.bottomRightCorner.x );
            let y_min = Math.min( code.location.topLeftCorner.y, code.location.bottomLeftCorner.y, code.location.topRightCorner.y, code.location.bottomRightCorner.y );
            let y_max = Math.max( code.location.topLeftCorner.y, code.location.bottomLeftCorner.y, code.location.topRightCorner.y, code.location.bottomRightCorner.y );
            let crop_width = x_max-x_min;
            let crop_height = y_max-y_min;
            let cropped_glyph = photo_context.getImageData( x_min, y_min, crop_width, crop_height );
            const glyph_canvas = new OffscreenCanvas( crop_width, crop_height );
            const glyph_context = glyph_canvas.getContext( '2d', {alpha: false } );
            glyph_context.putImageData( cropped_glyph, 0, 0 );
            return await glyph_canvas.convertToBlob( {type:'image/png', quality: 1} );
          }
          async function processCode( code ){
            if( !code.chunks || code.chunks.length == 0 ) return false;
            let results = {};
            let raw_type = code.chunks[0].text;
            let type = raw_type.slice( 0, raw_type.indexOf( ':' ) );
            switch( raw_type ){
              default:
              results.text = true;
              break;
              case 'mailto':
              results.mail = true;
              break;
              case 'tel':
              results.tel = true;
              break;
              case 'MECARD':
              results.contact = true;
              break;
              case 'BIZCARD':
              results.contact = true;
              break;
              case 'BEGIN':
                results.begin = true;
                let begin_what = raw_type.slice( raw_type.indexOf( ':' ), 5 ).toLowerCase();
                switch( begin_what ){
                  case 'veven':
                    results.event = true;
                    break;
                  case 'vcard':
                    results.contact = true;
                    break;
                }
                break;
              case 'sms':
              results.sms = true;
              break;
              case 'facetime':
              results.facetime = true;
              break;
              case 'facetime-audio':
              results.facetime = true;
              break;
              case 'geo':
              results.location = true;
              break;
              case 'WIFI':
              results.wifi = true;
              break;
              case 'market':
              results.applink = true;
              break;
              case 'https':
              results.https = true;
              case 'http':
              results.link = true;
              break;
              case 'ftps':
              results.ftps = true;
              case 'ftp':
              results.link = true;
              break;
            }
            return results;
          }
          setCodeFound( true );
          // Stop the Scanner
          deInitComponent();

          let codeImage = await cropCode( photo_context, code.location.topLeftCorner, code.location.topRightCorner, code.location.bottomLeftCorner, code.location.bottomRightCorner );
          let codeResults = await processCode( code );

          // Save the scanned glyph
          let glyph = {
            code: code,
            crop: codeImage,
            results: codeResults,
            loc: JSON.stringify( loc.current.coords ),
            t: Date.now()
          }
          addScan( glyph );
          displayGlyph( glyph );
        }
        processing.current = false;
      }
    }
    if( !stop.current && !processing.current && !code_found && videoElement.current ) requestAnimationFrame(update);
  }

  function addScan( scan ){
    const transaction = db.current.transaction(['GlyphScanner'], 'readwrite');
    transaction.oncomplete = ( a ) => {
    };
    transaction.onerror = ( e ) => { alert( e )};
    let objectStore = transaction.objectStore( 'GlyphScanner' );
    const addScanReq = objectStore.add( scan );
    addScanReq.onsuccess = ( event )=>{}
  }
  async function deInitComponent(){
    stop.current = true;
    // Stop the video stream, but keep it spooled up while the component is live.
    if( videoElement.current ) {
      videoElement.current.pause();
      delete videoElement.current.srcObject;
    }
    window.stream.getTracks().forEach(function(track) {
      track.stop();
    });
    window.stream = false;
  }
  function toggleScanner( event ){
    event.stopPropagation();
    switch( code_found ){
      case true:
        scan_button.current.src = ".\\both_stop-gesture.png";
        start();
        break;

      case false:
        scan_button.current.src = ".\\both_glyphscanner.png";
        deInitComponent();
        break;
    }
  }
  function closeScanner( event ){
    deInitComponent();
  }

  // Workflow phase controls... set to be available if necessary.
  function onPhaseChange(){
    switch( phase ){
      default:
    }
  }
  useEffect( onPhaseChange, [phase] );

  return(
      <>
      <style>{`
        #GlyphScanner .status{
          display: grid;
          grid-auto-rows: 1fr;
          grid-template-columns: repeat(5, 1fr);
          grid-gap: calc( var(--sF) * 1rem );
          background: var(--panelBG);
        }
        #GlyphScanner .status li{
          height: 7rem;
          cursor: pointer;
        }
        #GlyphScanner .status img, #SnapPix status video{
          height: 100%;
        }

        #startScan_button:active{
          background: white;
        }

        #exit{
          grid-column: 1;
        }

        #GlyphScanner video{
          margin: auto;
          max-width: 100%;
          max-height: 100%;
        }
        `}</style>
      <div id="GlyphScanner" ref={panel} className="pip_gui pip_post">
        <div className="head">
          <h1 className="pip_title">Glyph Scanner</h1>
        </div>
        <ul className="controls ctrl" style={{ padding: 0, margin: 0 }}>
          <li><hr /></li>
          <li className="image_select">
            <img src=".\both_camera.png" alt="Select video source" />
            <select ref={videoSelect} name="videoSource"></select>
            <br />
            <label htmlFor="videoSource">Camera</label>
          </li>
          <li id="startScan_button" className="image_button">
            <input ref={scan_button} type="image" name="scan" onClick={toggleScanner} src=".\both_capture-photo.png" alt="Snap Photo" />
            <br />
            <label htmlFor="scan" className="pip_text" >Start Scanner</label>
          </li>
        </ul>
        <div className="body">
          <video ref={videoElement} className="video" playsInline autoPlay></video>
        </div>
        <ul className="status" ref={scannedGlyphs}></ul>
        <ul className="foot">
          <li>
            <button id="exit" name="exit" className="pip_cancel" type="button" onClick={props.toggle}>Exit</button>
          </li>
        </ul>
      </div>
      </>
  )
}
function ShareContact( props ) {
  const screenplay =  props.screenplay;
  const [enter, setEnter] = useState( false );
  const [exit, setExit] = useState( false );
  const panel = useRef();
  const reset_button = useRef();
  const [phase, setPhase] = useState( 0 );

  function cleanup(){

  }
  function init(){
    const entrance_transition = new SceneTransformation({
      update: ( delta )=>{
        let cache = entrance_transition.cache;
        if( ++cache.frame <= cache.duration ){
          let progress = cache.frame / cache.duration;
          panel.current.style.scale = progress;

        } else {
          entrance_transition.post( );  // This calls for the cleanup of the object from the scene and the values from itself.
        }
      },
      cache: {
        duration: 15, /* do something in 60 frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        entrance_transition.cache.duration = 15;
        entrance_transition.cache.frame = 0;
        screenplay.updatables.set( 'ShareContact_entrance_transition', entrance_transition );
      },
      post: ( )=>{
        let cache = entrance_transition.cache;
        screenplay.updatables.delete( 'ShareContact_entrance_transition' );
        panel.current.style.transform = `scale(1)`;
      }
    });
    setEnter( entrance_transition );
    const exit_transition = new SceneTransformation({
      update: ( delta )=>{
        let cache = exit_transition.cache;
        if( ++cache.frame <= cache.duration ){
          let progress = 1 - cache.frame / cache.duration;
          panel.current.style.scale = progress;

        } else {
          exit_transition.post( );  // This calls for the cleanup of the object from the scene and the values from itself.
        }
      },
      cache: {
        duration: 15, /* do something in this many frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        exit_transition.cache.duration = 15;
        exit_transition.cache.frame = 0;
        screenplay.updatables.set( 'ShareContact_exit_transition', exit_transition );
      },
      post: ( )=>{
        let cache = exit_transition.cache;
        screenplay.updatables.delete( 'ShareContact_exit_transition' );
        panel.current.style.transform = `scale(0)`;
        director.emit( `${dictum_name}_progress`, dictum_name, ndx );
      }
    });
    setExit( exit_transition );
    screenplay.updatables.set( 'ShareContact_entrance_transition', entrance_transition );

    return cleanup;
  }
  useEffect( init , []);

  function onPhaseChange(){
    switch( phase ){
      case 0:
        reset_button.current.disabled = true;
    }
  }
  useEffect( onPhaseChange, [phase] );

  return(
      <>
      <style>{`

        `}</style>
      <div id="ShareContact" ref={panel} className="pip_gui pip_post">
        <div className="head">
          <h1 className="pip_title">Snap Pix</h1>
        </div>
        <ul className="controls ctrl" style={{ padding: 0, margin: 0 }}>
          <li className="image_select">
            <img src=".\both_mic.png" alt="Select from this list" />
            <select name="listName"></select>
            <br />
            <label htmlFor="listName">.image_select</label>
          </li>

          <li className="image_button">
            <input  type="image" name="clickme" src=".\both_capture-photo.png" alt="Do Something" />
            <br />
            <label htmlFor="clickme" className="pip_text" >.image_button</label>
          </li>
        </ul>
        <div className="body">

        </div>
        <ul className="status"></ul>
        <ul className="foot">
          <li>
            <button name="exit" className="pip_cancel" type="button" onClick={props.toggle}>Exit</button>
          </li>
          <li>
            <button ref={reset_button} name="reset" className="pip_continue" type="button" onClick={()=>{setPhase( 0 )}}>Back</button>
          </li>
        </ul>
      </div>
      </>
  )
}
function DropPin( props ) {
  const screenplay =  props.screenplay;
  const [enter, setEnter] = useState( false );
  const [exit, setExit] = useState( false );
  const panel = useRef();
  const timeline = useRef();
  const reset_button = useRef();
  const [phase, setPhase] = useState( 0 );

  function cleanup(){

  }
  function init(){
    const entrance_transition = new SceneTransformation({
      update: ( delta )=>{
        let cache = entrance_transition.cache;
        if( ++cache.frame <= cache.duration ){
          let progress = cache.frame / cache.duration;
          panel.current.style.scale = progress;

        } else {
          entrance_transition.post( );  // This calls for the cleanup of the object from the scene and the values from itself.
        }
      },
      cache: {
        duration: 15, /* do something in 60 frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        entrance_transition.cache.duration = 15;
        entrance_transition.cache.frame = 0;
        screenplay.updatables.set( 'ShareContact_entrance_transition', entrance_transition );
      },
      post: ( )=>{
        let cache = entrance_transition.cache;
        screenplay.updatables.delete( 'ShareContact_entrance_transition' );
        panel.current.style.transform = `scale(1)`;
      }
    });
    setEnter( entrance_transition );
    const exit_transition = new SceneTransformation({
      update: ( delta )=>{
        let cache = exit_transition.cache;
        if( ++cache.frame <= cache.duration ){
          let progress = 1 - cache.frame / cache.duration;
          panel.current.style.scale = progress;

        } else {
          exit_transition.post( );  // This calls for the cleanup of the object from the scene and the values from itself.
        }
      },
      cache: {
        duration: 15, /* do something in this many frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        exit_transition.cache.duration = 15;
        exit_transition.cache.frame = 0;
        screenplay.updatables.set( 'ShareContact_exit_transition', exit_transition );
      },
      post: ( )=>{
        let cache = exit_transition.cache;
        screenplay.updatables.delete( 'ShareContact_exit_transition' );
        panel.current.style.transform = `scale(0)`;
        director.emit( `${dictum_name}_progress`, dictum_name, ndx );
      }
    });
    setExit( exit_transition );
    screenplay.updatables.set( 'ShareContact_entrance_transition', entrance_transition );

    // Declare the chart dimensions and margins.
    const width = 928;
    const height = 720;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;

    const driving = [{"side":"left","year":1956,"miles":3683.6965,"gas":2.3829},{"side":"right","year":1957,"miles":3722.7648,"gas":2.4026},{"side":"bottom","year":1958,"miles":3776.8595,"gas":2.2539},{"side":"top","year":1959,"miles":3912.0962,"gas":2.3079},{"side":"right","year":1960,"miles":3942.1488,"gas":2.2658},{"side":"bottom","year":1961,"miles":3984.2224,"gas":2.2526},{"side":"right","year":1962,"miles":4089.4064,"gas":2.2158},{"side":"bottom","year":1963,"miles":4230.6536,"gas":2.1237},{"side":"bottom","year":1964,"miles":4383.9219,"gas":2.1039},{"side":"bottom","year":1965,"miles":4546.2059,"gas":2.1368},{"side":"top","year":1966,"miles":4681.4425,"gas":2.1421},{"side":"bottom","year":1967,"miles":4837.716,"gas":2.1408},{"side":"right","year":1968,"miles":5048.0841,"gas":2.1263},{"side":"right","year":1969,"miles":5216.3787,"gas":2.0737},{"side":"right","year":1970,"miles":5384.6732,"gas":2.0118},{"side":"bottom","year":1971,"miles":5652.1412,"gas":1.9316},{"side":"bottom","year":1972,"miles":5979.7145,"gas":1.8737},{"side":"right","year":1973,"miles":6160.0301,"gas":1.9026},{"side":"left","year":1974,"miles":5946.6566,"gas":2.3447},{"side":"bottom","year":1975,"miles":6117.9564,"gas":2.3079},{"side":"bottom","year":1976,"miles":6400.4508,"gas":2.3237},{"side":"right","year":1977,"miles":6634.861,"gas":2.3592},{"side":"bottom","year":1978,"miles":6890.308,"gas":2.2288},{"side":"left","year":1979,"miles":6755.0714,"gas":2.6829},{"side":"left","year":1980,"miles":6670.9241,"gas":3.2974},{"side":"right","year":1981,"miles":6743.0503,"gas":3.2961},{"side":"right","year":1982,"miles":6836.2134,"gas":2.9197},{"side":"right","year":1983,"miles":6938.3921,"gas":2.6566},{"side":"right","year":1984,"miles":7127.7235,"gas":2.475},{"side":"right","year":1985,"miles":7326.0706,"gas":2.3618},{"side":"left","year":1986,"miles":7554.4703,"gas":1.7605},{"side":"top","year":1987,"miles":7776.8595,"gas":1.7553},{"side":"bottom","year":1988,"miles":8089.4064,"gas":1.6842},{"side":"left","year":1989,"miles":8395.9428,"gas":1.7473},{"side":"top","year":1990,"miles":8537.1901,"gas":1.8763},{"side":"right","year":1991,"miles":8528.1743,"gas":1.7776},{"side":"right","year":1992,"miles":8675.432,"gas":1.6855},{"side":"left","year":1993,"miles":8843.7265,"gas":1.5974},{"side":"bottom","year":1994,"miles":8906.837,"gas":1.5842},{"side":"bottom","year":1995,"miles":9144.2524,"gas":1.5987},{"side":"top","year":1996,"miles":9183.3208,"gas":1.6737},{"side":"right","year":1997,"miles":9405.71,"gas":1.6461},{"side":"bottom","year":1998,"miles":9577.0098,"gas":1.3881},{"side":"right","year":1999,"miles":9688.2044,"gas":1.4987},{"side":"top","year":2000,"miles":9706.2359,"gas":1.8947},{"side":"left","year":2001,"miles":9685.1991,"gas":1.7658},{"side":"bottom","year":2002,"miles":9802.4042,"gas":1.6381},{"side":"right","year":2003,"miles":9853.4936,"gas":1.8592},{"side":"left","year":2004,"miles":9991.7355,"gas":2.1421},{"side":"left","year":2005,"miles":10054.846,"gas":2.5329},{"side":"right","year":2006,"miles":10030.8039,"gas":2.7934},{"side":"right","year":2007,"miles":10012.7724,"gas":2.9487},{"side":"left","year":2008,"miles":9871.5252,"gas":3.3066},{"side":"bottom","year":2009,"miles":9652.1412,"gas":2.3776},{"side":"left","year":2010,"miles":9592.0361,"gas":2.6066}];

    // Declare the positional encodings.
    const x = d3.scaleLinear()
        .domain(d3.extent(driving, d => d.miles)).nice()
        .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear()
        .domain(d3.extent(driving, d => d.gas)).nice()
        .range([height - marginBottom, marginTop]);

    const line = d3.line()
        .curve(d3.curveCatmullRom)
        .x(d => x(d.miles))
        .y(d => y(d.gas));

    const svg = d3.select("#timeline")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; background: var(--panelBG); color: white;");

    length = (path)=> d3.create("svg:path").attr("d", path).node().getTotalLength();
    const l = length(line(driving));

    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).ticks(width / 80))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("y2", -height)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", width - 4)
            .attr("y", -4)
            .attr("font-weight", "bold")
            .attr("font-size", "2rem")
            .attr("text-anchor", "end")
            .attr("fill", "currentColor")
            .text("Miles per person per year"));

    svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(null, "$.2f"))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          .attr("x2", width)
          .attr("stroke-opacity", 0.1))
      .call(g => g.select(".tick:last-of-type text").clone()
          .attr("x", 4)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .attr("font-size", "2rem")
          .text("Cost per gallon"));

    svg.append("path")
        .datum(driving)
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 2.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-dasharray", `0,${l}`)
        .attr("d", line)
      .transition()
        .duration(5000)
        .ease(d3.easeLinear)
        .attr("stroke-dasharray", `${l},${l}`);

    svg.append("g")
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
      .selectAll("circle")
      .data(driving)
      .join("circle")
        .attr("cx", d => x(d.miles))
        .attr("cy", d => y(d.gas))
        .attr("r", 3);

    const label = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
      .selectAll()
      .data(driving)
      .join("text")
        .attr("transform", d => `translate(${x(d.miles)},${y(d.gas)})`)
        .attr("fill-opacity", 0)
        .text(d => d.year)
          .attr("stroke", "black")
          .attr("paint-order", "stroke")
          .attr("font-size", "1.5rem")
          .attr("fill", "currentColor")
          .each(function(d) {
            const t = d3.select(this);
            switch (d.side) {
              case "top": t.attr("text-anchor", "middle").attr("dy", "-0.7em"); break;
              case "right": t.attr("dx", "0.5em").attr("dy", "0.32em").attr("text-anchor", "start"); break;
              case "bottom": t.attr("text-anchor", "middle").attr("dy", "1.4em"); break;
              case "left": t.attr("dx", "-0.5em").attr("dy", "0.32em").attr("text-anchor", "end"); break;
            }
          });

    label.transition()
        .delay((d, i) => length(line(driving.slice(0, i + 1))) / l * (5000 - 125))
        .attr("fill-opacity", 1);

    return cleanup;
  }
  useEffect( init , []);

  function onPhaseChange(){
    switch( phase ){
      case 0:
        reset_button.current.disabled = true;
    }
  }
  useEffect( onPhaseChange, [phase] );

  return(
      <>
      <style>{`

        `}</style>
      <div id="DropPin" ref={panel} className="pip_gui pip_post">
        <div className="head">
          <h1 className="pip_title">Snap Pix</h1>
        </div>
        <ul className="controls ctrl" style={{ padding: 0, margin: 0 }}>
          <li className="image_select">
            <img src=".\both_mic.png" alt="Select from this list" />
            <select name="listName"></select>
            <br />
            <label htmlFor="listName">.image_select</label>
          </li>

          <li className="image_button">
            <input  type="image" name="clickme" src=".\both_capture-photo.png" alt="Do Something" />
            <br />
            <label htmlFor="clickme" className="pip_text" >.image_button</label>
          </li>
        </ul>
        <div className="body">
          <svg id="timeline" ref={timeline} style={{ background: 'white' }}></svg>
        </div>
        <ul className="status"></ul>
        <ul className="foot">
          <li>
            <button name="exit" className="pip_cancel" type="button" onClick={props.toggle}>Exit</button>
          </li>
          <li>
            <button ref={reset_button} name="reset" className="pip_continue" type="button" onClick={()=>{setPhase( 0 )}}>Back</button>
          </li>
        </ul>
      </div>
      </>
  )
}
function SnapPix( props ) {
  const screenplay =  props.screenplay;
  const [enter, setEnter] = useState( false );
  const [exit, setExit] = useState( false );
  const [initialized, setInitialized] = useState( false );
  const [phase_description, setPhaseDescription] = useState();
  const [phase, setPhase] = useState( 3 );
  const [camera_type, setCameraType] = useState( 'user' );
  const [dId, setDId] = useState( -1 );
  const [file_list, setFileList] = useState( [] );
  const [streaming, setStreaming] = useState( false );

  const dbOpenRequest = useRef( false );
  const db = useRef( false );
  const mediaRecorder = useRef( false );

  const panel = useRef();
  const recVid_button = useRef();
  const snappedPhotos = useRef();
  const foot = useRef();
  const videoElement = useRef();
  const audioInputSelect = useRef();
  const audioOutputSelect = useRef();
  const videoSelect = useRef();
  const selectors = useRef();
  const fileinput = useRef();
  const loc = useRef( false );
  const recordedChunks = useRef( [] );

  function cleanup(){
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
      .then(mediaStream => {
        const stream = mediaStream;
        const tracks = stream.getTracks();
        for( const track of tracks ){
          track.stop();
        }
      });
  }
  function initialize(){
    'use strict';

    const entrance_transition = new SceneTransformation({
      update: ( delta )=>{
        let cache = entrance_transition.cache;
        if( ++cache.frame <= cache.duration ){
          let progress = cache.frame / cache.duration;
          panel.current.style.scale = progress;

        } else {
          entrance_transition.post( );  // This calls for the cleanup of the object from the scene and the values from itself.
        }
      },
      cache: {
        duration: 15, /* do something in 60 frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        entrance_transition.cache.duration = 15;
        entrance_transition.cache.frame = 0;
        screenplay.updatables.set( 'SnapPix_entrance_transition', entrance_transition );
      },
      post: ( )=>{
        let cache = entrance_transition.cache;
        screenplay.updatables.delete( 'SnapPix_entrance_transition' );
        panel.current.style.transform = `scale(1)`;
      }
    });
    setEnter( entrance_transition );
    const exit_transition = new SceneTransformation({
      update: ( delta )=>{
        let cache = exit_transition.cache;
        if( ++cache.frame <= cache.duration ){
          let progress = 1 - cache.frame / cache.duration;
          panel.current.style.scale = progress;

        } else {
          exit_transition.post( );  // This calls for the cleanup of the object from the scene and the values from itself.
        }
      },
      cache: {
        duration: 15, /* do something in this many frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        exit_transition.cache.duration = 15;
        exit_transition.cache.frame = 0;
        screenplay.updatables.set( 'SnapPix_exit_transition', exit_transition );
      },
      post: ( )=>{
        let cache = exit_transition.cache;
        screenplay.updatables.delete( 'SnapPix_exit_transition' );
        panel.current.style.transform = `scale(0)`;
        director.emit( `${dictum_name}_progress`, dictum_name, ndx );
      }
    });
    setExit( exit_transition );
    screenplay.updatables.set( 'SnapPix_entrance_transition', entrance_transition );

    // Load SnapPix Database
    dbOpenRequest.current = window.indexedDB.open( 'SnapPix', 1 );
    dbOpenRequest.current.onerror = (event) => {};
    dbOpenRequest.current.onsuccess = (event) => {
      // Store the result of opening the database in the db variable. This is used a lot below
      db.current = dbOpenRequest.current.result;
      // Run the loadSnappedPix() function to populate the SnapPix display with working pix yet to be saved.
      loadSnappedPix();
    };
    dbOpenRequest.current.onupgradeneeded = (event) => {
      db.current = event.target.result;
      db.current.onerror = (event) => {
        note.current.appendChild(createListItem('Error loading database.'));
      };
      // Create an objectStore for this database
      let objectStore = db.current.createObjectStore('SnapPix', { keyPath: 't' });
      // Define what data items the objectStore will contain
      objectStore.createIndex('blob', 'blob', { unique: false });
      objectStore.createIndex('loc', 'loc', { unique: false });
    };

    // Initialize the user's Camera Interface
    selectors.current = [audioInputSelect.current, audioOutputSelect.current, videoSelect.current];
    audioInputSelect.current.disabled = !('sinkId' in HTMLMediaElement.prototype);
    function gotDevices(deviceInfos) {
      // Handles being called several times to update labels. Preserve values.
      const values = selectors.current.map(select => select.value);
      selectors.current.forEach(select => {
        while (select.firstChild) {
          select.removeChild(select.firstChild);
        }
      });
      for (let i = 0; i !== deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];
        const option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === 'audioinput') {
          option.text = deviceInfo.label || `microphone ${audioInputSelect.current.length + 1}`;
          audioInputSelect.current.appendChild(option);
        } else if (deviceInfo.kind === 'audiooutput') {
          option.text = deviceInfo.label || `speaker ${audioInputSelect.current.length + 1}`;
          audioInputSelect.current.appendChild(option);
        } else if (deviceInfo.kind === 'videoinput') {
          option.text = deviceInfo.label || `camera ${videoSelect.current.length + 1}`;
          videoSelect.current.appendChild(option);
        } else {
          console.log('Some other kind of source/device: ', deviceInfo);
        }
      }
      selectors.current.forEach((select, selectorIndex) => {
        if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
          select.value = values[selectorIndex];
        }
      });
    }
    navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
    audioInputSelect.current.onchange = start;
    audioOutputSelect.current.onchange = changeAudioDestination;
    videoSelect.current.onchange = start;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( (pos)=>{
        loc.current = pos;
      });
    }
    start();
    return cleanup;
  }
  useEffect( initialize, [] );
  async function loadSnappedPix(){
    snappedPhotos.current.replaceChildren();

    const objectStore = db.current.transaction( 'SnapPix' ).objectStore( 'SnapPix' );
    objectStore.openCursor().onsuccess = ( event )=>{
      const cursor = event.target.result;
      // Check if there are no (more) cursor items to iterate through
      if (!cursor) {
        return;
      }
      const { blob, t, loc } = cursor.value;
      displaySnap( blob, t, loc );


      // continue on to the next item in the cursor
      cursor.continue();
    }
  }
  async function displaySnap( blob, t, loc ) {

    const urlCreator = window.URL || window.webkitURL;
    const url = urlCreator.createObjectURL( await blob );
    let li = document.createElement( 'li' );
    switch( blob.type ){
      case 'image/png':
        let img = document.createElement( 'img' );
        img.setAttribute( 'src', url );
        img.setAttribute( 'id', t );
        li.appendChild( img );
        li.classList.add( 'snap' );
        snappedPhotos.current.appendChild( li );
        break;
      case 'video/webm':
        let vid = document.createElement( 'video' );
        vid.setAttribute( 'src', url );
        vid.setAttribute( 'id', t );
        li.appendChild( vid );
        li.classList.add( 'vid' );
        snappedPhotos.current.appendChild( li );
        break;
    }

  };
  // Image Capture Routines
  // Attach audio output device to video element using device/sink ID.
  function start() {
    if (window.stream) {
      window.stream.getTracks().forEach(track => {
        track.stop();
      });
    }
    const audioSource = audioInputSelect.current.value;
    const videoSource = videoSelect.current.value;
    const constraints = {
      audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
      video: {deviceId: videoSource ? {exact: videoSource} : undefined}
    };
    navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError);
  }
  function attachSinkId(element, sinkId) {
    if (typeof element.sinkId !== 'undefined') {
      element.setSinkId(sinkId)
          .then(() => {
            console.log(`Success, audio output device attached: ${sinkId}`);
          })
          .catch(error => {
            let errorMessage = error;
            if (error.name === 'SecurityError') {
              errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
            }
            console.error(errorMessage);
            // Jump back to first output device in the list as it's the default.
            audioInputSelect.current.selectedIndex = 0;
          });
    } else {
      console.warn('Browser does not support output device selection.');
    }
  }
  function changeAudioDestination() {
    const audioDestination = audioInputSelect.current.value;
    attachSinkId(videoElement.current, audioDestination);
  }
  function gotStream(stream) {
    window.stream = stream; // make stream available to console
    videoElement.current.srcObject = stream;

    function handleDataAvailable( event ) {
      console.log( "data-available" );
      if ( event.data.size > 0 ) {
        recordedChunks.current.push( event.data );
        download();
      } else {
        // …
      }
    }
    async function download() {
      const blob = new Blob( recordedChunks.current, {
        type: "video/webm",
      } );
      const timestamp = Date.now();
      // Display the photo
      displaySnap( blob, timestamp, loc.current.coords );
      // Store Snap in SnapPix db
      addSnap( { t: timestamp, blob: await blob, loc: JSON.stringify( loc.current.coords ) } );

    }

    mediaRecorder.current = new MediaRecorder(stream);
    console.log( mediaRecorder.current.mimeType );
    mediaRecorder.current.ondataavailable = handleDataAvailable;

    // Refresh button list in case labels have become available
    return navigator.mediaDevices.enumerateDevices();
  }
  function gotDevices(deviceInfos) {
    // Handles being called several times to update labels. Preserve values.
    const values = selectors.current.map( select => select.value);
    selectors.current.forEach(select => {
      while (select.firstChild) {
        select.removeChild(select.firstChild);
      }
    });
    for (let i = 0; i !== deviceInfos.length; ++i) {
      const deviceInfo = deviceInfos[i];
      const option = document.createElement('option');
      option.value = deviceInfo.deviceId;
      if (deviceInfo.kind === 'audioinput') {
        option.text = deviceInfo.label || `microphone ${audioInputSelect.current.length + 1}`;
        audioInputSelect.current.appendChild(option);
      } else if (deviceInfo.kind === 'audiooutput') {
        option.text = deviceInfo.label || `speaker ${audioOutputSelect.current.length + 1}`;
        audioOutputSelect.current.appendChild(option);
      } else if (deviceInfo.kind === 'videoinput') {
        option.text = deviceInfo.label || `camera ${videoSelect.current.length + 1}`;
        videoSelect.current.appendChild(option);
      } else {
        console.log('Some other kind of source/device: ', deviceInfo);
      }
    }
    selectors.current.forEach((select, selectorIndex) => {
      if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
        select.value = values[selectorIndex];
      }
    });
  }
  function handleError(error) {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
  }
  async function snapPic( e ){
    e.preventDefault();

    const photo_canvas = new OffscreenCanvas( videoElement.current.videoWidth, videoElement.current.videoHeight );
    const photo_context = photo_canvas.getContext( '2d', { alpha: false } );
    photo_context.drawImage( videoElement.current, 0, 0 );
    const timestamp = Date.now();
    const blob = await photo_canvas.convertToBlob( {type:'image/png', quality: 1} );

    // Display the photo
    displaySnap( blob, timestamp, loc.current.coords );
    // Store Snap in SnapPix db
    addSnap( { t: timestamp, blob: await blob, loc: JSON.stringify( loc.current.coords ) } )

  }
  async function recVid( e ){
    switch( mediaRecorder.current.state ){
      case 'recording':
        mediaRecorder.current.stop();
        recVid_button.current.src = ".\\both_rec-vid.png";
        break;

      case 'inactive':
        recordedChunks.current = [];
        mediaRecorder.current.start();
        recVid_button.current.src = ".\\both_stop-gesture.png";
        break;

      case 'paused':
        mediaRecorder.current.start();
        recVid_button.current.src = ".\\both_stop-gesture.png";
        break;
    }
  }
  function addSnap( snap ){
    const transaction = db.current.transaction(['SnapPix'], 'readwrite');
    transaction.oncomplete = () => {
      // TODO: Verify that the image is in there?
    };
    transaction.onerror = () => {};
    let objectStore = transaction.objectStore( 'SnapPix' );
    const addSnapReq = objectStore.add( snap );
    addSnapReq.onsuccess = ( event )=>{}
  }

  return(
    <>
    <style>{`


      #SnapPix .status{
        display: grid;
        grid-auto-rows: 1fr;
        grid-template-columns: repeat(5, 1fr);
        grid-gap: calc( var(--sF) * 1rem );
        background: var(--panelBG);
      }
      #SnapPix .status li{
        height: 7rem;
        cursor: pointer;
      }
      #SnapPix .status img, #SnapPix status video{
        height: 100%;
      }

      #snapPic_button:active{
        background: white;
      }

      #exit_SnapPix{
        grid-column: 1;
      }
      #reset_SnapPix{
        grid-column: 2;
      }

      #SnapPix video{
        margin: auto;
        max-width: 100%;
        max-height: 100%;
      }

      `}</style>
    <div id="SnapPix" ref={panel} className="pip_gui pip_post">
      <div className="head">
        <h1 className="pip_title">Snap Pix</h1>
      </div>
      <ul className="controls ctrl" style={{ padding: 0, margin: 0 }}>
        <li className="image_select">
          <img src=".\both_mic.png" alt="Select audio input source" />
          <select ref={audioInputSelect} name="audioSource"></select>
          <br />
          <label htmlFor="audioSource">Audio Input</label>
        </li>

        <li className="image_select">
          <img src=".\both_sound.png" alt="Select audio output source" />
          <select ref={audioOutputSelect} name="audioOutput"></select>
          <br />
          <label htmlFor="audioOutput">Audio Output</label>
        </li>
        <li><hr /></li>
        <li className="image_select">
          <img src=".\both_camera.png" alt="Select video source" />
          <select ref={videoSelect} name="videoSource"></select>
          <br />
          <label htmlFor="videoSource">Camera</label>
        </li>
        <li id="snapPic_button" className="image_button">
          <input  type="image" name="snap" onClick={snapPic} src=".\both_capture-photo.png" onMouseOver={()=>{setDId( 3 )}} alt="Snap Photo" />
          <br />
          <label htmlFor="snap" className="pip_text" >Snap Pix</label>
        </li>
        <li className="image_button">
          <input type="image" name="record" ref={recVid_button} onClick={recVid} src=".\both_rec-vid.png" onMouseOver={()=>{setDId( 3 )}} alt="Record Video" />
          <br />
          <label htmlFor="record" className="pip_text">Record Vid</label>
        </li>
      </ul>
      <div className="body">
        <video ref={videoElement} playsInline autoPlay></video>
      </div>
      <ul className="status" ref={snappedPhotos}></ul>
      <ul id="SnapPix_Foot" className="foot" ref={foot}>
        <li>
          <button id="exit_SnapPix" name="exit_SnapPix" className="pip_cancel exit_SnapPix" type="button" onClick={props.toggle}>Exit</button>
        </li>
      </ul>
    </div>
    </>
  )
}
function RecordNote( props ) {
  const screenplay =  props.screenplay;
  const [worker, setWorker] = useState(false);
  const [engine, setEngine] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [enter, setEnter] = useState( false );
  const [exit, setExit] = useState( false );
  const [phase_description, setPhaseDescription] = useState();
  const [phase, setPhase] = useState( 0 );
  const [dId, setDId] = useState( -1 );
  const [mic_type, setMicType] = useState( 'user' );
  const [file_list, setFileList] = useState( [] );

  const panel = useRef();
  const reset = useRef();

  function cleanup(){
    let async_f = async ()=>{

    }
    async_f();
  };
  useEffect( ()=>{
    //setWorker( new Worker('../lib/workers/AudioEngine.ts') );
    setEngine( {
      onmessage: function(e) {
        /// ... handle inputFrame
      }
    });
    setInitialized( true );
    const entrance_transition = new SceneTransformation({
      update: ( delta )=>{
        let cache = entrance_transition.cache;
        if( ++cache.frame <= cache.duration ){
          let progress = cache.frame / cache.duration;
          panel.current.style.scale = progress;

        } else {
          entrance_transition.post( );  // This calls for the cleanup of the object from the scene and the values from itself.
        }
      },
      cache: {
        duration: 15, /* do something in 60 frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        entrance_transition.cache.duration = 15;
        entrance_transition.cache.frame = 0;
        screenplay.updatables.set( 'RecordNote_entrance_transition', entrance_transition );
      },
      post: ( )=>{
        let cache = entrance_transition.cache;
        screenplay.updatables.delete( 'RecordNote_entrance_transition' );
        panel.current.style.transform = `scale(1)`;
      }
    });
    setEnter( entrance_transition );
    const exit_transition = new SceneTransformation({
      update: ( delta )=>{
        let cache = exit_transition.cache;
        if( ++cache.frame <= cache.duration ){
          let progress = 1 - cache.frame / cache.duration;
          panel.current.style.scale = progress;

        } else {
          exit_transition.post( );  // This calls for the cleanup of the object from the scene and the values from itself.
        }
      },
      cache: {
        duration: 15, /* do something in this many frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        exit_transition.cache.duration = 15;
        exit_transition.cache.frame = 0;
        screenplay.updatables.set( 'RecordNote_exit_transition', exit_transition );
      },
      post: ( )=>{
        let cache = exit_transition.cache;
        screenplay.updatables.delete( 'RecordNote_exit_transition' );
        panel.current.style.transform = `scale(0)`;
        director.emit( `${dictum_name}_progress`, dictum_name, ndx );
      }
    });
    setExit( exit_transition );

    screenplay.updatables.set( 'RecordNote_entrance_transition', entrance_transition );

    return cleanup;
  }, []);

  useEffect( ()=>{
    if (initialized){
      let async_f = async ()=>{

      }
      async_f();
    }
  }, [initialized]);

  useEffect( ()=>{
    let async_f = async ()=>{
      switch( phase ){
        case 0:
          setPhaseDescription( 'Upload audio files or Record a new one?' );
          reset.current.disabled = true;
          break;

        case 1:
          setPhaseDescription( 'Select one or more audio files to add to your collection.' );
          reset.current.disabled = false;
          break;

        case '2a':
        case '2b':
        case '2c':
        case '2d':
          setPhaseDescription( 'Record an audio note.' );
          reset.current.disabled = false;
          break;
      }
    }
    async_f();
    setDId( -1 );
  },[phase]);

  function startRecording( event ){
    debugger;
    event.preventDefault();
  }

  return(
    <>
    <style>{`
      #RecordNote video, #RecordNote canvas, #RecordNote .phase_description, #RecordNote_Photos{
        grid-area: body;
      }
      #RecordNote .phase_description{
        font-size: 3rem;
        text-align: left;
      }
      #RecordNote .description{
        grid-area: status;
        position: relative;
      }
      #RecordNote .description > label, #RecordNote .description > span{
        position: absolute;
      }
      #RecordNote input[type="image"]{
        width: fit-content;
        height: fit-content;
        place-self: center;
        border-radius: 25%;
        cursor: pointer;
      }
      #RecordNote .upload_audio_button{
        background: radial-gradient( var(--v3), var(--v2));
        grid-area: ctrl;
      }
      #RecordNote .upload_audio_button:hover{
        background: radial-gradient( var(--v2), var(--v2));
      }
      #RecordNote .camera_button{
        grid-area: ctrl;
        background: radial-gradient( var(--g3), var(--g2));
      }
      #RecordNote .camera_button:hover{
        background: radial-gradient( var(--g2), var(--g2));
      }
      #RecordNote .selfie_camera{
        grid-area: ctrl;
        grid-row: 2;
        margin: auto;
        text-align: center;
      }
      #RecordNote .selfie_camera input{
        background: radial-gradient( var(--g3), var(--g2));
      }
      #RecordNote .selfie_camera input:hover{
        background: radial-gradient( var(--g2), var(--g2));
      }
      #RecordNote .environment_camera{
        grid-area: ctrl;
        grid-row: 3;
        margin: auto;
        text-align: center;
      }
      #RecordNote .environment_camera input{
        background: radial-gradient( var(--v3), var(--v2));
      }
      #RecordNote .environment_camera input:hover{
        background: radial-gradient( var(--v2), var(--v2));
      }
      #RecordNote .snap_photo{
        grid-area: ctrl;
        grid-row: 2;
        margin: auto;
        text-align: center;
      }
      #RecordNote .snap_photo input{
        background: radial-gradient( var(--g3), var(--g2));
      }
      #RecordNote .snap_photo input:hover{
        background: radial-gradient( var(--g2), var(--g2));
      }
      #RecordNote .switch_camera{
        grid-area: ctrl;
        grid-row: 3;
        margin: auto;
        text-align: center;
      }
      #RecordNote .switch_camera input{
        background: radial-gradient( var(--v3), var(--v2));
      }
      #RecordNote .switch_camera input:hover{
        background: radial-gradient( var(--v2), var(--v2));
      }
      #RecordNote .pip_cancel, #RecordNote .pip_continue, #RecordNote .pip_accept{

      }
      #RecordNote .exit_RecordNote{
        grid-area: foot;
        grid-column: 5;
      }
      #RecordNote .reset_RecordNote{
        grid-area: foot;
        grid-column: 4;
      }
      `}</style>
    <div id="RecordNote" ref={panel} className="pip_gui pip_post">
      <h1 className="pip_title">Record Audio Notes
      </h1>
      <span className="pip_text phase_description">{phase_description}</span>
      {phase === 0 ? <>
        <input name="upload_audio_button" src=".\both_upload-image.png" type="image" className="upload_audio_button" onMouseOver={()=>{setDId( 0 )}} onClick={()=>{setPhase( 1 )}}></input>
        <br />
        <label htmlFor="upload_audio_button" className="pip_text" >Upload Audio</label>
        <input name="microphone_button" type="image" src=".\both_camera.png" className="camera_button" onMouseOver={()=>{setDId( 1 )}} onClick={()=>{setPhase( '2a' )}}></input>
        <br />
        <label htmlFor="microphone_button" className="pip_text" >Record a Note</label>
        </> : <></>}
      {phase === '2a' || phase === '2b' || phase === '2c' || phase === '2d' ? <>
        <div className="snap_photo">
          <input type="file" name="record" accept="audio/*" capture={mic_type} onMouseOver={()=>{setDId( 1 )}} onClick={startRecording}/>
          <br />
          <label htmlFor="record" className="pip_text" >Start Recording</label>
        </div>
        </> : <></>}
      <span className="description">
        {( dId === 0 ) ? <span className="pip_text">Upload an audio file from local storage, or from a publicly accessible url.</span> : <></> }
        {( dId === 1 ) ? <span className="pip_text">Use your microphone to add a new note to your collection.</span> : <></> }
        {( dId === 2 ) ? <span className="pip_text">Import as many audio files as you like into your collection.</span> : <></> }
        {( dId === 3 ) ? <span className="pip_text">Take a picture of your face<br/>"Don't for get to smile!" - Mona Lisa</span> : <></> }
        {( dId === 4 ) ? <span className="pip_text">Take a picture using back-facing camera<br />"I count to 5... that's when things get real." - Demetri Martin perhaps?</span> : <></> }
        {( dId === 5 ) ? <span className="pip_text">Click to snap a photo.  Hold it down for rapid-fire mode!</span> : <></> }
        {( dId === 6 ) ? <span className="pip_text">Switch to another camera...  How very Bourgeoise!</span> : <></> }
      </span>
      <button name="exit_RecordNote" className="pip_cancel exit_RecordNote" type="button" onClick={props.toggle}>Exit</button>
      <button ref={reset} name="reset_RecordNote" className="pip_continue reset_RecordNote" type="button" onClick={()=>{setPhase( 0 )}}>Back</button>
    </div>
    </>
  )
}
function RemindMe( props ) {
    const [initialized, setInitialized] = useState( false );
    const db = useRef(false);
    const DBOpenRequest = useRef( false );
    const objectStore = useRef( false );
    const screenplay =  props.screenplay;

    // UI Element Reference
    const panel = useRef();
    const taskList = useRef();
    const taskForm = useRef();
    const title = useRef();
    const hours = useRef();
    const minutes = useRef();
    const day = useRef();
    const month = useRef();
    const year = useRef();
    const submit = useRef();
    const note = useRef();
    const notificationBtn = useRef();

    useEffect( ()=>{
      if(!initialized){

        const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        // Create a reference to the notifications list in the bottom of the app; we will write database messages into this list by
        // appending list items as children of this element


        // Do an initial check to see what the notification permission state is
        if (Notification.permission === 'denied' || Notification.permission === 'default') {
          notificationBtn.current.style.display = 'block';
        } else {
          notificationBtn.current.style.display = 'none';
        }

        note.current.appendChild(createListItem('App initialised.'));
        // Let us open our database
        DBOpenRequest.current = window.indexedDB.open('toDoList', 1);

        // Register two event handlers to act on the database being opened successfully, or not
        DBOpenRequest.current.onerror = (event) => {
          note.current.appendChild(createListItem('Error loading database.'));
        };

        DBOpenRequest.current.onsuccess = (event) => {
          note.current.appendChild(createListItem('Database initialised.'));

          // Store the result of opening the database in the db variable. This is used a lot below
          db.current = DBOpenRequest.current.result;

          // Run the displayData() function to populate the task list with all the to-do list data already in the IndexedDB
          displayData();
        };

        // This event handles the event whereby a new version of the database needs to be created
        // Either one has not been created before, or a new version number has been submitted via the
        // window.indexedDB.open line above
        // it is only implemented in recent browsers
        DBOpenRequest.current.onupgradeneeded = (event) => {
          db.current = event.target.result;

          db.current.onerror = (event) => {
            note.current.appendChild(createListItem('Error loading database.'));
          };


          // Create an objectStore for this database
          objectStore.current = db.current.createObjectStore('toDoList', { keyPath: 'taskTitle' });

          // Define what data items the objectStore will contain
          objectStore.current.createIndex('hours', 'hours', { unique: false });
          objectStore.current.createIndex('minutes', 'minutes', { unique: false });
          objectStore.current.createIndex('day', 'day', { unique: false });
          objectStore.current.createIndex('month', 'month', { unique: false });
          objectStore.current.createIndex('year', 'year', { unique: false });

          objectStore.current.createIndex('notified', 'notified', { unique: false });

          note.current.appendChild(createListItem('Object store created.'));
        };
        setInitialized( true );
      }
    }, [initialized]);

    function addData(e) {
      // Prevent default, as we don't want the form to submit in the conventional way
      e.preventDefault();

      // Stop the form submitting if any values are left empty.
      // This should never happen as there is the required attribute
      if (title.current.value === '' || hours.current.value === null || minutes.current.value === null || day.current.value === '' || month.current.value === '' || year.current.value === null) {
        note.current.appendChild(createListItem('Data not submitted — form incomplete.'));
        return;
      }

      // Grab the values entered into the form fields and store them in an object ready for being inserted into the IndexedDB
      const newItem = [
        { taskTitle: title.current.value, hours: hours.current.value, minutes: minutes.current.value, day: day.current.value, month: month.current.value, year: year.current.value, notified: 'no' },
      ];

      // Open a read/write DB transaction, ready for adding the data
      const transaction = db.current.transaction(['toDoList'], 'readwrite');

      // Report on the success of the transaction completing, when everything is done
      transaction.oncomplete = () => {
        note.current.appendChild(createListItem('Transaction completed: database modification finished.'));

        // Update the display of data to show the newly added item, by running displayData() again.
        displayData();
      };

      // Handler for any unexpected error
      transaction.onerror = () => {
        note.current.appendChild(createListItem(`Transaction not opened due to error: ${transaction.error}`));
      };

      // Call an object store that's already been added to the database
      objectStore.current = transaction.objectStore('toDoList');
      console.log(objectStore.current.indexNames);
      console.log(objectStore.current.keyPath);
      console.log(objectStore.current.name);
      console.log(objectStore.current.transaction);
      console.log(objectStore.current.autoIncrement);

      // Make a request to add our newItem object to the object store
      const objectStoreRequest = objectStore.current.add(newItem[0]);
      objectStoreRequest.onsuccess = (event) => {

        // Report the success of our request
        // (to detect whether it has been succesfully
        // added to the database, you'd look at transaction.oncomplete)
        note.current.appendChild(createListItem('Request successful.'));

        // Clear the form, ready for adding the next entry
        title.current.value = '';
        hours.current.value = null;
        minutes.current.value = null;
        day.current.value = 1;
        month.current.value = 'January';
        year.current.value = 2020;
      };
    };

    // Ask for permission when the 'Enable notifications' button is clicked
    function askNotificationPermission() {

      // Function to actually ask the permissions
      function handlePermission(permission) {
        // Whatever the user answers, we make sure Chrome stores the information
        if (!Reflect.has(Notification, 'permission')) {
          Notification.permission = permission;
        }

        // Set the button to shown or hidden, depending on what the user answers
        if (Notification.permission === 'denied' || Notification.permission === 'default') {
          notificationBtn.current.style.display = 'block';
        } else {
          notificationBtn.current.style.display = 'none';
        }
      };

      // Check if the browser supports notifications
      if (!Reflect.has(window, 'Notification')) {
        console.log('This browser does not support notifications.');
      } else {
        if (checkNotificationPromise()) {
          Notification.requestPermission().then(handlePermission);
        } else {
          Notification.requestPermission(handlePermission);
        }
      }
    };

    // Check whether the deadline for each task is up or not, and responds appropriately
    function checkDeadlines() {

      // First of all check whether notifications are enabled or denied
      if (Notification.permission === 'denied' || Notification.permission === 'default') {
        notificationBtn.current.style.display = 'block';
      } else {
        notificationBtn.current.style.display = 'none';
      }

      // Grab the current time and date
      const now = new Date();

      // From the now variable, store the current minutes, hours, day of the month, month, year and seconds
      const minuteCheck = now.getMinutes();
      const hourCheck = now.getHours();
      const dayCheck = now.getDate(); // Do not use getDay() that returns the day of the week, 1 to 7
      const monthCheck = now.getMonth();
      const yearCheck = now.getFullYear(); // Do not use getYear() that is deprecated.

      // Open a new transaction
      objectStore.current = db.current.transaction(['toDoList'], 'readwrite').objectStore('toDoList');

      // Open a cursor to iterate through all the data items in the IndexedDB
      objectStore.current.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if (!cursor) return;
        const { hours, minutes, day, month, year, notified, taskTitle } = cursor.value;

        // convert the month names we have installed in the IDB into a month number that JavaScript will understand.
        // The JavaScript date object creates month values as a number between 0 and 11.
        const monthNumber = MONTHS.indexOf(month);
        if (monthNumber === -1) throw new Error('Incorrect month entered in database.');

        // Check if the current hours, minutes, day, month and year values match the stored values for each task.
        // The parseInt() function transforms the value from a string to a number for comparison
        // (taking care of leading zeros, and removing spaces and underscores from the string).
        let matched = parseInt(hours) === hourCheck;
        matched &&= parseInt(minutes) === minuteCheck;
        matched &&= parseInt(day) === dayCheck;
        matched &&= parseInt(monthNumber) === monthCheck;
        matched &&= parseInt(year) === yearCheck;
        if (matched && notified === 'no') {
          // If the numbers all do match, run the createNotification() function to create a system notification
          // but only if the permission is set
          if (Notification.permission === 'granted') {
            createNotification(taskTitle);
          }
        }

        // Move on to the next cursor item
        cursor.continue();
      };
    };

    // Check whether browser supports the promise version of requestPermission()
    // Safari only supports the old callback-based version
    function checkNotificationPromise() {

      try {
        Notification.requestPermission().then();
      } catch(e) {
        return false;
      }

      return true;
    };

    function cleanup(){

    }

    function createListItem(contents) {
      const listItem = document.createElement('li');
      listItem.classList.add( "pip_text" );
      listItem.textContent = contents;
      return listItem;
    };

    // Create a notification with the given title
    function createNotification(new_title) {
      // Create and show the notification
      const img = '/to-do-notifications/img/icon-128.png';
      const text = `HEY! Your task "${new_title}" is now overdue.`;
      const notification = new Notification('To do list', { body: new_title, icon: img });

      // We need to update the value of notified to 'yes' in this particular data object, so the
      // notification won't be set off on it again

      // First open up a transaction
      objectStore.current = db.current.transaction(['toDoList'], 'readwrite').objectStore('toDoList');

      // Get the to-do list object that has this title as its title
      const objectStoreTitleRequest = objectStore.current.get(new_title);

      objectStoreTitleRequest.onsuccess = () => {
        // Grab the data object returned as the result
        const data = objectStoreTitleRequest.result;

        // Update the notified value in the object to 'yes'
        data.notified = 'yes';

        // Create another request that inserts the item back into the database
        const updateTitleRequest = objectStore.current.put(data);

        // When this new request succeeds, run the displayData() function again to update the display
        updateTitleRequest.onsuccess = () => {

          displayData();
        };
      };
    };

    function deleteItem(event) {

      // Retrieve the name of the task we want to delete
      const dataTask = event.target.getAttribute('data-task');

      // Open a database transaction and delete the task, finding it by the name we retrieved above
      const transaction = db.current.transaction(['toDoList'], 'readwrite');
      transaction.objectStore('toDoList').delete(dataTask);

      // Report that the data item has been deleted
      transaction.oncomplete = () => {
        // Delete the parent of the button, which is the list item, so it is no longer displayed
        event.target.parentNode.parentNode.removeChild(event.target.parentNode);
        note.current.appendChild(createListItem(`Task "${dataTask}" deleted.`));
      };
    };

    function displayData() {

      // First clear the content of the task list so that you don't get a huge long list of duplicate stuff each time
      // the display is updated.
      while (taskList.current.firstChild) {
        taskList.current.removeChild(taskList.current.lastChild);
      }

      // Open our object store and then get a cursor list of all the different data items in the IDB to iterate through
      objectStore.current = db.current.transaction('toDoList').objectStore('toDoList');
      objectStore.current.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        // Check if there are no (more) cursor items to iterate through
        if (!cursor) {
          // No more items to iterate through, we quit.
          note.current.appendChild(createListItem('Entries all displayed.'));
          return;
        }

        // Check which suffix the deadline day of the month needs
        const { hours, minutes, day, month, year, notified, taskTitle } = cursor.value;
        const ordDay = ordinal(day);

        // Build the to-do list entry and put it into the list item.
        const toDoText = `${taskTitle} — ${hours}:${minutes}, ${month} ${ordDay} ${year}.`;
        const listItem = createListItem(toDoText);

        if (notified === 'yes') {
          listItem.style.textDecoration = 'line-through';
          listItem.style.color = 'rgba(255, 0, 0, 0.5)';
        }

        // Put the item item inside the task list
        taskList.current.appendChild(listItem);

        // Create a delete button inside each list item,
        const deleteButton = document.createElement('button');
        listItem.appendChild(deleteButton);
        deleteButton.textContent = 'X';

        // Set a data attribute on our delete button to associate the task it relates to.
        deleteButton.setAttribute('data-task', taskTitle);

        // Associate action (deletion) when clicked
        deleteButton.onclick = (event) => {
          deleteItem(event);
        };

        // continue on to the next item in the cursor
        cursor.continue();
      };
    };

    function exit_RemindMe( event ){
      event.stopPropagation();

    }

    function ordinal(day) {
      const n = day.toString();
      const last = n.slice(-1);
      if (last === '1' && n !== '11') return `${n}st`;
      if (last === '2' && n !== '12') return `${n}nd`;
      if (last === '3' && n !== '13') return `${n}rd`;
      return `${n}th`;
    };

    return(
      <>
      <style>{`
        #RemindMe h1, #RemindMe h2 {
          text-align: center;
          background: #d88;
          font-family: Arial, Helvetica, sans-serif;
        }

        #RemindMe h1 {
          margin: 0;
          background: #d66;
        }

        #RemindMe h2 {
        }

        /* Bottom toolbar styling  */

        #RemindMe #toolbar {
          position: relative;
          height: 6rem;
          width: 100%;
          background: #d66;
          border-top: 2px solid #d33;
          border-bottom: 2px solid #d33;
        }

        #RemindMe #enable,
        #RemindMe input[type="submit"] {
          line-height: 1.8;
          border-radius: 5px;
          border: 1px solid black;
          text-shadow: 1px 1px 1px black;
          border: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: inset 0px 5px 3px rgba(255, 255, 255, 0.2),
            inset 0px -5px 3px rgba(0, 0, 0, 0.2);
        }

        #RemindMe #enable {
          position: absolute;
          bottom: 0.3rem;
          right: 0.3rem;
        }

        #RemindMe #notifications {
          margin: 0;
          position: relative;
          background: #ddd;
          position: absolute;
          top: 0rem;
          left: 0rem;
          height: 5.4rem;
          width: 50%;
          overflow: auto;
          line-height: 1.2;
        }

        #RemindMe #notifications li {
          margin-left: 1.5rem;
        }

        /* New item form styling */

        #RemindMe .form-box {
          background: #d66;
          width: 85%;
          margin: 2rem auto;
          box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
        }

        #RemindMe form div {
          margin-bottom: 1rem;
        }

        #RemindMe form .full-width {
          margin: 1rem auto 2rem;
          width: 100%;
        }

        #RemindMe form .half-width {
          width: 50%;
          float: left;
        }

        #RemindMe form .third-width {
          width: 33%;
          float: left;
        }

        #RemindMe form div label {
          width: 10rem;
          float: left;
          line-height: 1.6;
        }

        #RemindMe form .full-width input {
          width: 30rem;
        }

        #RemindMe form .half-width input {
          width: 8.75rem;
        }

        #RemindMe form .third-width select {
          width: 13.5rem;
        }

        #RemindMe form div input[type="submit"] {
          clear: both;
          width: 20rem;
          display: block;
          height: 3rem;
          margin: 0 auto;
          position: relative;
          top: 0.5rem;
        }

        /* || tasks box */

        #RemindMe .task-box {
          width: 85%;
          margin: 2rem auto;
        }

        #RemindMe .task-box ul {
          margin: 0;
        }

        #RemindMe .task-box li {
          list-style-type: none;
          border-bottom: 2px solid #d33;
        }

        #RemindMe .task-box li:last-child {
          border-bottom: none;
        }

        #RemindMe .task-box li:last-child {
          margin-bottom: 0rem;
        }

        #RemindMe .task-box button {
          margin-left: 2rem;
          border: 1px solid #eee;
          border-radius: 5px;
          box-shadow: inset 0 -2px 5px rgba(0, 0, 0, 0.5) 1px 1px 1px black;
        }

        /* setting cursor for interactive controls */

        #RemindMe button,
        #RemindMe input[type="submit"],
        #RemindMe select {
          cursor: pointer;
        }

        /* media query for small screens */

        @media (max-width: 32rem) {
          #RemindMe body {
            width: 100%;
            border-left: none;
            border-right: none;
          }

          #RemindMe form div {
            clear: both;
          }

          #RemindMe form .full-width {
            margin: 1rem auto;
          }

          #RemindMe form .half-width {
            width: 100%;
            float: none;
          }

          #RemindMe form .third-width {
            width: 100%;
            float: none;
          }

          #RemindMe form div label {
            width: 36%;
          }

          #RemindMe form input,
          #RemindMe form select,
          #RemindMe form label {
            line-height: 2.5rem;
          }

          #RemindMe form .full-width input {
            width: 50%;
          }

          #RemindMe form .half-width input {
            width: 50%;
          }

          #RemindMe form .third-width select {
            width: 50%;
          }

          #RemindMe #enable {
            right: 1rem;
          }
          `}
      </style>
      <div id="RemindMe" ref={panel} className="pip_gui pip_post">
        <h1 className="pip_title">To-do list</h1>

        <div className="task-box" ref={taskList}>
          <ul id="task-list">

          </ul>
        </div>

        <div className="form-box">
          <h2 className="pip_title">Add new to-do item.</h2>

          <form id="task-form" ref={taskForm} onSubmit={addData}>
            <div className="full-width"><label htmlFor="title" className="pip_text">Task title:</label><input type="text" id="title" ref={title} required /></div>
            <div className="half-width"><label htmlFor="deadline-hours" className="pip_text">Hours (hh):</label><input type="number" id="deadline-hours" ref={hours} required /></div>
            <div className="half-width"><label htmlFor="deadline-minutes" className="pip_text">Mins (mm):</label><input type="number" id="deadline-minutes" ref={minutes} required /></div>
            <div className="third-width"><label htmlFor="deadline-day" className="pip_text">Day:</label>
              <select id="deadline-day" ref={day} required>
                <option value="01">01</option>
                <option value="02">02</option>
                <option value="03">03</option>
                <option value="04">04</option>
                <option value="05">05</option>
                <option value="06">06</option>
                <option value="07">07</option>
                <option value="08">08</option>
                <option value="09">09</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="22">22</option>
                <option value="23">23</option>
                <option value="24">24</option>
                <option value="25">25</option>
                <option value="26">26</option>
                <option value="27">27</option>
                <option value="28">28</option>
                <option value="29">29</option>
                <option value="30">30</option>
                <option value="31">31</option>
              </select>
            </div>

            <div className="third-width">
              <label htmlFor="deadline-month" className="pip_text">Month:</label>
              <select id="deadline-month" ref={month} required>
               <option value="January">January</option>
               <option value="February">February</option>
               <option value="March">March</option>
               <option value="April">April</option>
               <option value="May">May</option>
               <option value="June">June</option>
               <option value="July">July</option>
               <option value="August">August</option>
               <option value="September">September</option>
               <option value="October">October</option>
               <option value="November">November</option>
               <option value="December">December</option>
              </select>
           </div>

            <div className="third-width">
              <label htmlFor="deadline-year" className="pip_text">Year:</label>
              <select id="deadline-year" ref={year} required>
               <option value="2025">2025</option>
               <option value="2024">2024</option>
               <option value="2023">2023</option>
               <option value="2022">2022</option>
               <option value="2021">2021</option>
               <option value="2020">2020</option>
               <option value="2019">2019</option>
               <option value="2018">2018</option>
               </select>
           </div>

            <div><input className="pip_accept" type="submit" id="submit" ref={submit} value="Add Task"/></div>
            <div></div>
          </form>
        </div>

        <div id="toolbar">
          <ul id="notifications" ref={note}>

          </ul>

          <button id="enable" ref={notificationBtn} onClick={askNotificationPermission}>
            Enable notifications
          </button>
        </div>

        <input name="exit_RemindMe" className="pip_continue" type="button" onClick={props.toggle} value="Exit"></input>
      </div>
      </>
    )
  }
function Search( props ) {
  const [enter, setEnter] = useState( false );
  const [exit, setExit] = useState( false );
  const [search_query, setSearchQuery] = useState('');
  const panel = useRef();
  const screenplay =  props.screenplay;

  function cleanup(){

  }
  useEffect( ()=>{
    const entrance_transition = new SceneTransformation({
      update: ( delta )=>{
        let cache = entrance_transition.cache;
        if( ++cache.frame <= cache.duration ){
          let progress = cache.frame / cache.duration;
          panel.current.style.scale = progress;

        } else {
          entrance_transition.post( );  // This calls for the cleanup of the object from the scene and the values from itself.
        }
      },
      cache: {
        duration: 15, /* do something in 60 frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        entrance_transition.cache.duration = 15;
        entrance_transition.cache.frame = 0;
        screenplay.updatables.set( 'Search_entrance_transition', entrance_transition );
      },
      post: ( )=>{
        let cache = entrance_transition.cache;
        screenplay.updatables.delete( 'Search_entrance_transition' );
        panel.current.style.transform = `scale(1)`;
      }
    });
    setEnter( entrance_transition );
    const exit_transition = new SceneTransformation({
      update: ( delta )=>{
        let cache = exit_transition.cache;
        if( ++cache.frame <= cache.duration ){
          let progress = 1 - cache.frame / cache.duration;
          panel.current.style.scale = progress;

        } else {
          exit_transition.post( );  // This calls for the cleanup of the object from the scene and the values from itself.
        }
      },
      cache: {
        duration: 15, /* do something in this many frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        exit_transition.cache.duration = 15;
        exit_transition.cache.frame = 0;
        screenplay.updatables.set( 'Search_exit_transition', exit_transition );
      },
      post: ( )=>{
        let cache = exit_transition.cache;
        screenplay.updatables.delete( 'Search_exit_transition' );
        panel.current.style.transform = `scale(0)`;
        director.emit( `${dictum_name}_progress`, dictum_name, ndx );
      }
    });
    setExit( exit_transition );
    screenplay.updatables.set( 'Search_entrance_transition', entrance_transition );
    return cleanup;
  }, []);

  function submitSearch( event ){
    event.preventDefault();
    let uname = ( typeof(localStorage.getItem("uname")) !== 'undefined' ) ? localStorage.getItem("uname") : false;
    let token = ( typeof(localStorage.getItem("token")) !== 'undefined' ) ? localStorage.getItem("token") : false;
    let query_string = JSON.stringify( search_query );
    let search = new Request("/a",{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
        "username": uname.toString(),
        "token": token.toString()
      },
      body: query_string
    });

    let results = fetch( search ).then( async res => {
      let status = res.status;
      if(status==200) return {
        valid: true,
        tokens: res.headers.get('token')
      }
      else return false;
    });

    if( results ){

    } else {

    }

    //let queryParams = new URLSearchParams();
    //queryParams.set("q", search_query);
    //history.pushState(null, null, "a?"+queryParams.toString());  // <-- standalone url is defined here.
    //alert( 'Submitting Search: ' + search_query );
  }


  return(
    <div id="OpenSearch" ref={panel}  className="pip_gui pip_post">
      <form id="search_panel" ref={panel} className="search pip_title" onSubmit={submitSearch}>
        <label htmlFor="search">Search:</label>
        <input className="textbox" type="text" name="search" value={search_query} onChange={e => setSearchQuery(e.target.value)} />
        <input className="pip_accept" type="submit" value="GO" />
      </form>
      <button name="ack_OpenSearch" className="pip_accept" type="button" onClick={props.toggle}>OK</button>
    </div>
  );
}
function WeTheHeader( props ){
  const screenplay = props.screenplay;
  const viewMode = props.viewMode;
  const [activeMenuGUID, setActiveMenuGUID] = useState( 0 );

  // Dom-Hooks for Header and it's Content
  const panel = useRef();

  // onDisplay State Hooks
  const [showAccount, setShowAccount] = useState( false );
  const [showContacts, setShowContacts] = useState( false );
  const [showCollections, setShowCollections] = useState( false );
  const [showDiscussions, setShowDiscussions] = useState( false );
  const [showEvents, setShowEvents] = useState( false );
  const [showClassifieds, setShowClassifieds] = useState( false );
  const [showTicker, setShowTicker] = useState( false );
  const [showArchitect, setShowArchitect] = useState( false );
  const [showInformation, setShowInformation] = useState( false );

  // HUD Values State Hooks
  const [account_balance, setAccountBalance] = useState(1000000);
  const [account_change, setAccountChange] = useState("+25");
  const [online_contacts, setOnlineContacts] = useState(212);
  const [contacts_alerts, setContactsAlerts] = useState(2);
  const [active_collections, setActiveCollections] = useState(7);
  const [collections_alerts, setCollectionsAlerts] = useState(5);
  const [active_discussions, setActiveDiscussions] = useState(7);
  const [discussions_alerts, setDiscussionsAlerts] = useState(5);
  const [active_events, setActiveEvents] = useState(7);
  const [events_alerts, setEventsAlerts] = useState(5);
  const [active_classifieds, setActiveClassifieds] = useState(7);
  const [classifieds_alerts, setClassifiedsAlerts] = useState(5);
  const [ticker_content, setTickerContent] = useState("This is the default content for the scrolling ticker marquee.");



  // onDisplay Hooks
  function toggleAccount( event ){
    activeMenuGUID === 1 ? setActiveMenuGUID( 0 ) : setActiveMenuGUID( 1 );
    setShowAccount( !showAccount );
  }
  function toggleContacts( event ){
    activeMenuGUID === 2 ? setActiveMenuGUID( 0 ) : setActiveMenuGUID( 2 );
    setShowContacts( !showContacts );
  }
  function toggleCollections( event ){
    activeMenuGUID === 3 ? setActiveMenuGUID( 0 ) : setActiveMenuGUID( 3 );
    setShowCollections( !showCollections );
  }
  function toggleDiscussions( event ){
    activeMenuGUID === 4 ? setActiveMenuGUID( 0 ) : setActiveMenuGUID( 4 );
    setShowDiscussions( !showDiscussions );
  }
  function toggleEvents( event ){
    activeMenuGUID === 5 ? setActiveMenuGUID( 0 ) : setActiveMenuGUID( 5 );
    setShowEvents( !showEvents );
  }
  function toggleClassifieds( event ){
    activeMenuGUID === 6 ? setActiveMenuGUID( 0 ) : setActiveMenuGUID( 6 );
    setShowClassifieds( !showClassifieds );
  }
  function toggleTicker( event ){
    activeMenuGUID === 7 ? setActiveMenuGUID( 0 ) : setActiveMenuGUID( 7 );
    setShowTicker( !showTicker );
  }
  function toggleArchitect( event ){
    activeMenuGUID === 8 ? setActiveMenuGUID( 0 ) : setActiveMenuGUID( 8 );
    setShowArchitect( !showArchitect );
  }
  function toggleInformation( event ){
    activeMenuGUID === 9 ? setActiveMenuGUID( 0 ) : setActiveMenuGUID( 9 );
    setShowInformation( !showInformation );
  }

  // Once-Only Init Hook
  function cleanup(){}
  useEffect(()=>{

    return cleanup;
  },[]);

  // Give this to each of the subscribed poller functions, then select the code via polling interval type calling it.
  function update( delta, poll_interval ){
    switch( poll_interval ){
      case 0:

        break;
      case 1:

        break;
      case 2:

        break;
      case 3:

        break;
      case 4:

        break;
      case 5:

        break;
      case 6:

        break;
      case 7:

        break;
      case 8:

        break;
      case 9:

        break;
      case 10:

        break;

    }
  }

  // State Variable Use Hooks
  useEffect(()=>{

  },[account_balance, account_change]);
  useEffect(()=>{

  },[online_contacts, contacts_alerts]);
  useEffect(()=>{

  },[active_collections, collections_alerts]);
  useEffect(()=>{

  },[active_discussions, discussions_alerts]);
  useEffect(()=>{

  },[active_events, events_alerts]);
  useEffect(()=>{

  },[active_classifieds, classifieds_alerts]);
  useEffect(()=>{

  },[ticker_content]);

  // Render
  return( <>
    <style>{`
      #WeTheHeader{
        grid-area: head;
        background: linear-gradient( 11deg, var(--b3), black, var(--r3) );
        transition: all .2s;
        z-index: 2;
      }
      @media ( orientation: portrait ){
        #WeTheHeader{
          border-bottom: var(--b1) solid;
        }
      }
      #WeTheHeader > ul.menu_items{
        grid-row: 1;
        margin: 0;
        padding: 0;
        display: grid;
      }
      @media ( orientation: portrait ){
        #WeTheHeader > ul.menu_items{
          grid-template-columns: repeat(4, 1fr);
        }
      }
      @media ( orientation: landscape ){
        #WeTheHeader > ul.menu_items{
          grid-template-columns: repeat(8, 1fr);
        }
      }
      #WeTheHeader .header_menu_item{
        display: grid;
        text-align: center;
        color: var(--y1);
        align-content: center;
        margin: auto;
        position: relative;
        cursor: pointer;
        transition: all 0.1s;
      }
      @media ( orientation: portrait ){
        #WeTheHeader .header_menu_item:nth-child(2n){
          grid-row: 2;
        }
      }
      #WeTheHeader .header_menu_item:hover{
        background: var( --panelBG );
        color: #DDD;
      }

      #WeTheHeader .header_menu_item img{
        height: 4em;
        margin: auto;
      }
      .header_menu_item > .alerts{
        position: absolute;
        bottom: 0.25em;
        color: var(--g2);
        font-size: 1em;
        font-weight: bold;
        right: 0;
        border-radius: 50%;
        height: 1.5em;
        width: 1.5em;
        background: var(--g3);
      }
      .header_menu_item.account{
      }
      .header_menu_item > .account_change{
        position: absolute;
        bottom: 0.25em;
        color: var(--g2);
        font-size: 1.5em;
        font-weight: bold;
        right: -1em;
      }
      .header_menu_item.ticker{
        overflow: hidden;
        grid-column: 1 / -1;
        width: 100%;
      }
      @media ( orientation: portrait ){
        .header_menu_item.ticker{
          grid-row: 3;
        }
      }
      @media ( orientation: landscape ){
        .header_menu_item.ticker{
          grid-row: 2;
        }
      }
      .ticker .ticker_content{
        white-space: nowrap;
      }

      #search_panel{
        grid-area: search;
        color: var(--y1);
        display: grid;
        transition: all 0.2s;
        background: var( --panelBG );
      }
      #search_panel .textbox{
        grid-row: 3;
        height: fit-content;
        align-self: center;

      }
      #search_panel .pip_accept{
        grid-row: 2;
        place-self: end;
      }

      #account_panel{}
      #contacts_panel{}
      #collections_panel{}
      #discussions_panel{}
      #events_panel{}
      #classifieds_panel{}
      #ticker_panel{}
      #architect_panel{}
      #architect_panel > .lil-gui.root{
        margin: 1rem;
      }
      #information_panel{}

      @media only screen and (orientation: landscape){
      }
      @media only screen and (orientation: portrait){
      }
      `}</style>
    <div id="WeTheHeader" ref={panel} className={viewMode}>
      <ul className="menu_items">

        <li className="header_menu_item account" onClick={toggleAccount}>
          <img src=".\both_vault.png" />
          <span className="account_balance">{account_balance}</span>
          <span className="account_change">{account_change}</span>
        </li>

        <li className="header_menu_item contacts" onClick={toggleContacts}>
          <img src=".\both_groups.png" />
          <span className="online_contacts">{online_contacts}</span>
          <span className="alerts">{contacts_alerts}</span>
        </li>

        <li className="header_menu_item collections" onClick={toggleCollections}>
          <img src=".\both_museum.png" />
          <span className="active_collections">{active_collections}</span>
          <span className="alerts">{collections_alerts}</span>
        </li>

        <li className="header_menu_item discussions" onClick={toggleDiscussions}>
          <img src=".\both_wethebrand.png" />
          <span className="active_discussions">{active_discussions}</span>
          <span className="alerts">{discussions_alerts}</span>
        </li>

        <li className="header_menu_item events" onClick={toggleEvents}>
          <img src=".\both_planet_alert.png" />
          <span className="active_events">{active_events}</span>
          <span className="alerts">{events_alerts}</span>
        </li>

        <li className="header_menu_item classifieds" onClick={toggleClassifieds}>
          <img src=".\both_postboard_alert.png" />
          <span className="active_classifieds">{active_classifieds}</span>
          <span className="alerts">{classifieds_alerts}</span>
        </li>

        <li className="header_menu_item architect" onClick={toggleArchitect}>
          <img src=".\dark_architect.png" />
        </li>

        <li className="header_menu_item information" onClick={toggleInformation}>
          <img src=".\dark_information.png" />
        </li>

        <li className="header_menu_item ticker">
          <hr style={{ width: '100%' }}/>
          <span className="ticker_content pip_text">{ticker_content}</span>
        </li>
      </ul>
    </div>
    {activeMenuGUID === 1 ? <AccountPanel toggleAccount={toggleAccount} screenplay={screenplay} /> : <></> }
    {activeMenuGUID === 2 ? <ContactsPanel toggleContacts={toggleContacts} screenplay={screenplay} /> : <></> }
    {activeMenuGUID === 3 ? <CollectionsPanel toggleCollections={toggleCollections} screenplay={screenplay} /> : <></> }
    {activeMenuGUID === 4 ? <DiscussionsPanel toggleDiscussions={toggleDiscussions} screenplay={screenplay} /> : <></> }
    {activeMenuGUID === 5 ? <EventsPanel toggleEvents={toggleEvents} screenplay={screenplay} /> : <></> }
    {activeMenuGUID === 6 ? <ClassifiedsPanel toggleClassifieds={toggleClassifieds} screenplay={screenplay} /> : <></> }
    {activeMenuGUID === 7 ? <TickerPanel toggleTicker={toggleTicker} content={ticker_content} screenplay={screenplay} /> : <></> }
    {activeMenuGUID === 8 ? <ArchitectPanel toggleArchitect={toggleArchitect} screenplay={screenplay} /> : <></> }
    <InformationPanel onDisplay={showInformation} toggleInformation={toggleInformation} screenplay={screenplay} />
    </>);
}
// Header Content
function AccountPanel( props ){
  const account_panel = useRef();
  const screenplay =  props.screenplay;

  useEffect(()=>{
    account_panel.current.classList.remove('loading');
  },[]);
  return(
    <div ref={account_panel} className="pip_gui pip_menu loading">
      <button className="pip_continue" onClick={props.toggleAccount}>close</button>
    </div> );
}
function ContactsPanel( props ){
  const screenplay =  props.screenplay;
  const contacts_panel = useRef();

  return( <div ref={contacts_panel} className="pip_gui pip_menu">
    <button className="pip_continue" onClick={props.toggleContacts}>close</button>
  </div> );
}
function CollectionsPanel( props ){
  const screenplay =  props.screenplay;
  const collections_panel = useRef();
  function cleanup(){}
  useEffect(()=>{
    // update the position to new x and y
    function ticked() {
      vizImages.attr('x', d => d.x).attr('y', d=> d.y);
    }

    // Rect collision algorithm.
    // https://bl.ocks.org/cmgiven/547658968d365bcc324f3e62e175709b
    function rectCollide() {
      var nodes, sizes, masses
      var size = constant([0, 0])
      var strength = 1
      var iterations = 1

      function force() {
        var node, size, mass, xi, yi
        var i = -1
        while (++i < iterations) { iterate() }

        function iterate() {
          var j = -1
          var tree = d3.quadtree(nodes, xCenter, yCenter).visitAfter(prepare)

          while (++j < nodes.length) {
            node = nodes[j]
            size = sizes[j]
            mass = masses[j]
            xi = xCenter(node)
            yi = yCenter(node)

            tree.visit(apply)
          }
        }

        function apply(quad, x0, y0, x1, y1) {
          var data = quad.data
          var xSize = (size[0] + quad.size[0]) / 2
          var ySize = (size[1] + quad.size[1]) / 2
          if (data) {
            if (data.index <= node.index) { return }

            var x = xi - xCenter(data)
            var y = yi - yCenter(data)
            var xd = Math.abs(x) - xSize
            var yd = Math.abs(y) - ySize

            if (xd < 0 && yd < 0) {
              var l = Math.sqrt(x * x + y * y)
              var m = masses[data.index] / (mass + masses[data.index])

              if (Math.abs(xd) < Math.abs(yd)) {
                node.vx -= (x *= xd / l * strength) * m
                data.vx += x * (1 - m)
              } else {
                node.vy -= (y *= yd / l * strength) * m
                data.vy += y * (1 - m)
              }
            }
          }

          return x0 > xi + xSize || y0 > yi + ySize ||
          x1 < xi - xSize || y1 < yi - ySize
        }

        function prepare(quad) {
          if (quad.data) {
            quad.size = sizes[quad.data.index]
          } else {
            quad.size = [0, 0]
            var i = -1
            while (++i < 4) {
              if (quad[i] && quad[i].size) {
                quad.size[0] = Math.max(quad.size[0], quad[i].size[0])
                quad.size[1] = Math.max(quad.size[1], quad[i].size[1])
              }
            }
          }
        }
      }

      function xCenter(d) { return d.x + d.vx + sizes[d.index][0] / 2 }
      function yCenter(d) { return d.y + d.vy + sizes[d.index][1] / 2 }

      force.initialize = function (_) {
        sizes = (nodes = _).map(size)
        masses = sizes.map(function (d) { return d[0] * d[1] })
      }

      force.size = function (_) {
        return (arguments.length
          ? (size = typeof _ === 'function' ? _ : constant(_), force)
          : size)
      }

      force.strength = function (_) {
        return (arguments.length ? (strength = +_, force) : strength)
      }

      force.iterations = function (_) {
        return (arguments.length ? (iterations = +_, force) : iterations)
      }

      return force
    }
    function constant(_) {
          return function () { return _ }
        }

    collections_panel.current.classList.remove('loading');

    // specify svg width and height;
    const width = collections_panel.current.offsetWidth || 500, height = collections_panel.current.offsetHeight || 500;
    const minorDim = Math.min(width, height);
    // create svg and g DOM elements;
    let panel = d3.select(collections_panel.current)
      .append('svg')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('width', 30000)
      .attr('height', 30000)
      .attr('transform-origin', 'top left')
      .attr('transform', `scale(.05)`)
      .append('g')
      // move 0,0 to the center
      .attr('transform', `translate(${30000 >>1}, ${30000>>1})`);

    var images = [], maxImages = 100, maxWeight = 1920, minWeight = 420, padding=3;
    for(let i = 0; i< maxImages -1; i++){
      const weight = Math.ceil( (Math.random() * (maxWeight - minWeight)) + minWeight );
      images.push({
        url:`https://picsum.photos/${Math.ceil(weight)}`,
        weight
      })
    }
    // make one image with a weight 3 times bigger for visualization testing propouses
    images.push({
      url: `https://picsum.photos/${maxWeight}`,
      weight: maxWeight,
      fx: 0,
      fy: 0
    })
    images.sort((a, b) => b.weight - a.weight);

    // make it so the biggest images is equal to 10% of canvas, and thre smallest one 1%
    let scl = .1;
    let miisp = 1;
    console.log(scl)
    //if (scl <= miisp) scl = scl / maxImages;
    const maxImageSize = minorDim * miisp;
    const minImageSize = minorDim * scl;

    // function to scale the images
    const scaleSize = d3.scaleLinear().domain([minWeight, maxWeight]).range([minImageSize, maxImageSize]).clamp(true);

    // append the rects
    let vizImages = panel.selectAll('.image-cloud-image')
      .data(images)
      .enter()
      .append('svg:image')
      .attr('class', '.image-cloud-image')
      .attr('height', d => d.weight)
      .attr('width', d => d.weight)
      .attr('id', d => d.url)
      .attr('xlink:href', d => d.url);
      vizImages.exit().remove();

    // create the collection of forces
    const simulation = d3.forceSimulation()
      // set the nodes for the simulation to be our images
      .nodes(images)
      // set the function that will update the view on each 'tick'
      .on('tick', ticked)
      .force('center', d3.forceCenter())
      .force('cramp', d3.forceManyBody().strength(minorDim))
      // collition force for rects
      .force('collide', rectCollide().size(d=> {
        const s = d.weight;
        return [s + padding, s + padding];
      }));


    return cleanup;
  },[]);
  return( <div ref={collections_panel} className="pip_gui pip_menu loading">
    <button className="pip_continue" onClick={props.toggleCollections}>close</button>
  </div> );
}
function DiscussionsPanel( props ){
  const screenplay =  props.screenplay;
  const discussions_panel = useRef();

  return(<div ref={discussions_panel} className="pip_gui pip_menu">
    <button className="pip_continue" onClick={props.toggleDiscussions}>close</button>
  </div>);
}
function EventsPanel( props ){
  const screenplay =  props.screenplay;
  const events_panel = useRef();

  return( <div ref={events_panel} className="pip_gui pip_menu">
    <button className="pip_continue" onClick={props.toggleEvents}>close</button>
  </div> );
}
function ClassifiedsPanel( props ){
  const screenplay =  props.screenplay;
  const classifieds_panel = useRef();

  return( <div ref={classifieds_panel} className="pip_gui pip_menu">
    <button className="pip_continue" onClick={props.toggleClassifieds}>close</button>
  </div> );
}
function TickerPanel( props ){
  const screenplay =  props.screenplay;
  const ticker_panel = useRef();

  return( <div ref={ticker_panel} id="ticker_panel" className="pip_gui pip_menu">
    <button className="pip_continue" onClick={props.toggleTicker}>close</button>
  </div> );
}
function ArchitectPanel( props ){
  const screenplay =  props.screenplay;
  const architect_panel = useRef();

  function cleanup(){
    document.getElementById( 'root' ).append( screenplay.lil_gui.domElement );
    screenplay.lil_gui.hide();
  }
  useEffect(()=>{
    if( !screenplay.lil_gui ){
      let screenplay = props.screenplay;
      let sys_ve_scene = screenplay.sys_ve_scene;
      let sys_ui_scene = screenplay.sys_ui_scene;
      let page_ve_scene = screenplay.page_ve_scene;
      let page_ui_scene = screenplay.page_ui_scene;
      let gui = screenplay.lil_gui = new GUI( { title: 'Architect Interface', container: architect_panel.current });

      gui.camera_controls = gui.addFolder( 'Camera Controls' );
      gui.camera_controls.add( screenplay, 'fps' ).name('Frames / Second').onChange(()=>{
        screenplay.interval = 1 / screenplay.fps;
      });
      let cameras = screenplay.cameras;
      cameras.forEach( function( cam, name ){
        let ctrl = {};
        ctrl[name] = function(){screenplay.actions.change_cam( `${name}` )};
        gui.camera_controls.add( ctrl, name );
        let cam_settings = gui.camera_controls.addFolder( name );


        cam_settings.add ( cam.position, 'x' ).listen().onChange((value)=>{
          cam.position.setX( value );
          cam.updateProjectionMatrix();
        }).name( `${name}: pos.x` );
        cam_settings.add ( cam.position, 'y' ).listen().onChange((value)=>{
          cam.position.setY( value );
          cam.updateProjectionMatrix();
        }).name( `${name}: pos.y` );
        cam_settings.add ( cam.position, 'z' ).listen().onChange((value)=>{
          cam.position.setZ( value );
          cam.updateProjectionMatrix();
        }).name( `${name}: pos.z` );
        cam_settings.add ( cam.rotation, 'x' ).listen().onChange((value)=>{
          cam.rotation.set( value, cam.rotation.y, cam.rotation.z );
          cam.updateProjectionMatrix();
        }).name( `${name}: rot.x` );
        cam_settings.add ( cam.rotation, 'y' ).listen().onChange((value)=>{
          cam.rotation.set( cam.rotation.x, value, cam.rotation.z );
          cam.updateProjectionMatrix();
        }).name( `${name}: rot.y` );
        cam_settings.add ( cam.rotation, 'z' ).listen().onChange((value)=>{
          cam.rotation.set( cam.rotation.x, cam.rotation.y, value );
          cam.updateProjectionMatrix();
        }).name( `${name}: rot.z` );
        cam_settings.add( cam, 'zoom' ).onChange(()=>{
          cam.updateProjectionMatrix();
        });

      } );

      let ui_cam_settings = gui.camera_controls.addFolder( 'UI Camera' );
      let ui_cam = screenplay.ui_cam;
      ui_cam_settings.add ( ui_cam.position, 'x' ).listen().onChange((value)=>{
        ui_cam.position.setX( value );
        ui_cam.updateProjectionMatrix();
      }).name( 'ui_cam: pos.x' );
      ui_cam_settings.add ( ui_cam.position, 'y' ).listen().onChange((value)=>{
        ui_cam.position.setY( value );
        ui_cam.updateProjectionMatrix();
      }).name( 'ui_cam: pos.y' );
      ui_cam_settings.add ( ui_cam.position, 'z' ).listen().onChange((value)=>{
        ui_cam.position.setZ( value );
        ui_cam.updateProjectionMatrix();
      }).name( 'ui_cam: pos.z' );
      ui_cam_settings.add ( ui_cam.rotation, 'x' ).listen().onChange((value)=>{
        ui_cam.rotation.set( value, ui_cam.rotation.y, ui_cam.rotation.z );
        ui_cam.updateProjectionMatrix();
      }).name( 'ui_cam: rot.x' );
      ui_cam_settings.add ( ui_cam.rotation, 'y' ).listen().onChange((value)=>{
        ui_cam.rotation.set( ui_cam.rotation.x, value, ui_cam.rotation.z );
        ui_cam.updateProjectionMatrix();
      }).name( 'ui_cam: rot.y' );
      ui_cam_settings.add ( ui_cam.rotation, 'z' ).listen().onChange((value)=>{
        ui_cam.rotation.set( ui_cam.rotation.x, ui_cam.rotation.y, value );
        ui_cam.updateProjectionMatrix();
      }).name( 'ui_cam: rot.z' );
      ui_cam_settings.add( ui_cam, 'zoom' ).onChange(()=>{
        ui_cam.updateProjectionMatrix();
      });

      const camera_controls = {
        Orbiting: ()=>{
          ActivateOrbitControls( screenplay );
        },
        FirstPerson: ()=>{
          ActivateFirstPersonControls( screenplay );
        },
        Pilot: ()=>{
          ActivateFlyControls( screenplay );
        },
        Reset:()=>{
          ResetControls( screenplay );
        },
        Off: ()=>{
          ReturnControl( screenplay );
        },
        lookAt: ()=>{
          let holo_sun = screenplay.actors.Starship.getObjectByName( 'holo_sun' );
          screenplay.active_cam.lookAt( holo_sun.position );
          screenplay.active_cam.updateProjectionMatrix();
        }
      }
      gui.camera_controls.add( camera_controls, 'Orbiting' ).name('Orbiting View');
      gui.camera_controls.add( camera_controls, 'FirstPerson' ).name('Look Around');
      gui.camera_controls.add( camera_controls, 'Pilot' ).name('Fly the Ship');
      gui.camera_controls.add( camera_controls, 'Reset' ).name('Reset View');
      gui.camera_controls.add( camera_controls, 'Off' ).name('Return Control');
      gui.camera_controls.add( camera_controls, 'lookAt' ).name('Look At Holo Sun');

      gui.camera_controls.open( false );

      let ship_settings_folder = gui.addFolder( 'Ship Settings' );
      ship_settings_folder.add( screenplay.actors.Starship.Viewscreen, 'visible', false ).name( 'Show Viewscreen?');
      ship_settings_folder.add( screenplay.actors.Starship.Viewscreen.material, 'opacity', 0, 1 ).name( 'Viewscreen Opacity');

      ship_settings_folder.add( screenplay.actors.Starship.Light, 'intensity', 0, 10, 0.1 ).name( 'Light Intensity');
      ship_settings_folder.add( screenplay.actors.Starship.Light, 'distance', 0, 100000, 1 ).name( 'Light Distance');
      ship_settings_folder.add( screenplay.actors.Starship.Light, 'decay', 0, 2, 1 ).name( 'Light Decay [0,1,2]');
      ship_settings_folder.add( screenplay.actors.Starship.Light.position, 'x' ).listen().onChange((value)=>{
        screenplay.actors.Starship.Light.position.setX( value );
      }).name( 'Light: pos.x' );
      ship_settings_folder.add ( screenplay.actors.Starship.Light.position, 'y' ).listen().onChange((value)=>{
        screenplay.actors.Starship.Light.position.setY( value );
      }).name( 'Light: pos.y' );
      ship_settings_folder.add ( screenplay.actors.Starship.Light.position, 'z' ).listen().onChange((value)=>{
        screenplay.actors.Starship.Light.position.setZ( value );
      }).name( 'Light: pos.z' );

      ship_settings_folder.add ( screenplay.actors.Starship.Bulkhead, 'visible', true ).onChange(()=>{ screenplay.actors.Starship.bulkhead.visible = !screenplay.actors.Starship.Bulkhead.visible }).name( 'Hide Top?');
      ship_settings_folder.add ( screenplay.actors.Starship.Bulkhead.material, 'wireframe' ).onChange(()=>{ screenplay.actors.Starship.bulkhead.material.wireframe = screenplay.actors.Ship.Bulkhead.material.wireframe }).name( 'Wireframe Only?');

      ship_settings_folder.open( false );

      let ship_nav_folder = gui.addFolder( 'Ship Navigation' );
      const ship_navigation = {

        Neptune: function() {

          screenplay.actions.warp_to(screenplay.actors.Neptune);
        },
        Uranus: function() {
          screenplay.actions.warp_to(screenplay.actors.Uranus);
        },
        Saturn: function() {
          screenplay.actions.warp_to(screenplay.actors.Saturn);
        },
        Jupiter: function() {
          screenplay.actions.warp_to(screenplay.actors.Jupiter);
        },
        Mars: function() {
          screenplay.actions.warp_to(screenplay.actors.Mars);
        },
        Earth: function() {
          screenplay.actions.warp_to(screenplay.actors.Earth);
        },
        Moon: function() {
          screenplay.actions.warp_to(screenplay.actors.Moon);
        },
        Venus: function() {
          screenplay.actions.warp_to(screenplay.actors.Venus);
        },
        Mercury: function() {
          screenplay.actions.warp_to(screenplay.actors.Mercury);
        },
        Sun: function() {
          screenplay.actions.warp_to(screenplay.actors.Sun);
        }
      }
      ship_nav_folder.add( ship_navigation, 'Neptune' ).name('... to Neptune');
      ship_nav_folder.add( ship_navigation, 'Uranus' ).name('...to Uranus');
      ship_nav_folder.add( ship_navigation, 'Saturn' ).name('...to Saturn');
      ship_nav_folder.add( ship_navigation, 'Jupiter' ).name('...to Jupiter');
      ship_nav_folder.add( ship_navigation, 'Mars' ).name('...to Mars');
      ship_nav_folder.add( ship_navigation, 'Earth' ).name('...to Earth');
      const earth_navigation = {

        Landing: function() {
          let landing_coords = new THREE.Vector3().setFromSphericalCoords( earth.surface_distance, 1, 1 ).add( earth.position );
          screenplay.actions.land_at( landing_coords );
        },
        GeoOrbit: function() {
          let arrival_coords = new THREE.Vector3().setFromSphericalCoords( earth.orbital_distance, 1, 1 ).add( earth.position );
          screenplay.actions.impulse_to( screenplay.actors.Moon );
        },
        SpaceStation: function() {
          let arrival_coords = new THREE.Vector3().setFromSphericalCoords( earth.surface_distance + 1000000, 1, 1 ).add( earth.position );
          screenplay.actions.impulse_to( arrival_coords );
        }

      }
      ship_nav_folder.add( earth_navigation, 'Landing' ).name('Land');
      ship_nav_folder.add( earth_navigation, 'GeoOrbit' ).name('Geo-Synchronous Orbit');
      ship_nav_folder.add( earth_navigation, 'SpaceStation' ).name('Space Station');
      ship_nav_folder.add( ship_navigation, 'Moon' ).name('...to Moon');
      ship_nav_folder.add( ship_navigation, 'Venus' ).name('...to Venus');
      ship_nav_folder.add( ship_navigation, 'Mercury' ).name('...to Mercury');
      ship_nav_folder.add( ship_navigation, 'Sun' ).name('...to Sun');
      ship_nav_folder.open( false );

      gui.show();

      let base_props = async ( _folder, base )=>{
        let folder = _folder.addFolder( 'Base Properties' );

        folder.add( base, 'castShadow' ).listen().name( `Cast Shadow` );
        folder.add( base, 'frustumCulled' ).listen().name( `Frustum Culled` );
        folder.add( base, 'matrixAutoUpdate' ).listen().name( `Matrix Auto Update` );
        folder.add( base.position, 'x' ).listen().onChange((value)=>{
           base.position.setX(value);
        }).name( `position: X` );
        folder.add( base.position, 'y' ).listen().onChange((value)=>{
           base.position.setY(value);
        }).name( `position: Y` );
        folder.add( base.position, 'z' ).listen().onChange((value)=>{
           base.position.setZ(value);
        }).name( `position: Z` );
        folder.add( base.rotation, 'x' ).listen().onChange((value)=>{
           base.rotation.setX(value);
        }).name( `rotation: X` );
        folder.add( base.rotation, 'y' ).listen().onChange((value)=>{
           base.rotation.setY(value);
        }).name( `rotation: Y` );
        folder.add( base.rotation, 'z' ).listen().onChange((value)=>{
           base.rotation.setZ(value);
        }).name( `rotation: Z` );
        folder.add( base.scale, 'x' ).listen().onChange((value)=>{
           base.scale.setX(value);
        }).name( `scale: X` );
        folder.add( base.scale, 'y' ).listen().onChange((value)=>{
           base.scale.setY(value);
        }).name( `scale: Y` );
        folder.add( base.scale, 'z' ).listen().onChange((value)=>{
           base.scale.setZ(value);
        }).name( `scale: Z` );
        folder.add( base, 'receiveShadow' ).listen().name( `Receive Shadow` );
        folder.add( base, 'renderOrder' ).listen().name( `Render Order` );
        folder.add( base.up, 'x' ).listen().onChange((value)=>{
           base.up.setX(value);
        }).name( `up: X` );
        folder.add( base.up, 'y' ).listen().onChange((value)=>{
           base.up.setY(value);
        }).name( `up: Y` );
        folder.add( base.up, 'z' ).listen().onChange((value)=>{
           base.up.setZ(value);
        }).name( `up: Z` );
        folder.add( base, 'visible' ).listen().name( `Visible` );
      }

      let addGroup = async ( folder, group )=>{

        base_props( folder, group );

        for( const child of group.children ){
          switch( child.type ){
            case 'Group':
            case 'Object3D':
              let group_folder = folder.addFolder( child.name );
              addGroup( group_folder, child );
              break;

            case 'Mesh':
              let mesh_folder = folder.addFolder( child.name );
              addMesh( mesh_folder, child );
              break;

            case 'DirectionalLight':
              let dlight_folder = folder.addFolder( 'Directional Light' );
              addDirectionalLight( dlight_folder, child );
              break;

            case 'AmbientLight':
              let amblight_folder = folder.addFolder( 'Ambient Light' );
              addAmbientLight( amblight_folder, child );
              break;

            case 'SpotLight':
              let slight_folder = folder.addFolder( 'Spot Light' );
              addSpotLight( slight_folder, child );
              break;

            case 'PointLight':
              let plight_folder = folder.addFolder( 'Point Light' );
              addPointLight( plight_folder, child );
              break;

            default:
              let default_folder = folder.addFolder( child.type );
              base_props( default_folder, child );
              break;

          }
        }

      }
      let addMesh = async ( folder, mesh )=>{
        base_props( folder, mesh );

        folder.add ( mesh.material, 'transparent' );
        folder.add ( mesh.material, 'opacity' );
        folder.add ( mesh.material, 'depthTest' );
        folder.add ( mesh.material, 'depthWrite' );
        folder.add ( mesh.material, 'alphaTest' );
        folder.add ( mesh.material, 'visible' );
        folder.add ( mesh.material, 'side', [0,1,2] );
      }
      let addDirectionalLight = async ( folder, light )=>{
        base_props( folder, light );
        folder.addColor ( light, 'color' ).listen();
        folder.add ( light, 'intensity', 0, 10 ).listen();
      }
      let addAmbientLight = async ( folder, light )=>{
        base_props( folder, light );
        folder.addColor ( light, 'color' ).listen();
        folder.add ( light, 'intensity', 0, 10 ).listen();
      }
      let addSpotLight = async ( folder, light )=>{
        base_props( folder, light );
        folder.addColor ( light, 'color' ).listen();
        folder.add ( light, 'intensity', 0, 10 ).listen();
      }
      let addPointLight = async ( folder, light )=>{
        base_props( folder, light );
        folder.addColor ( light, 'color' ).listen();
        folder.add ( light, 'decay', 0, 2, 1 ).listen();
        folder.add ( light, 'distance', 0, 4500000000 ).listen();
        folder.add ( light, 'intensity', 0, 10 ).listen();
      }

      let modeling_folder = gui.addFolder( '3D Models' );
      for( const ndx in sys_ve_scene.children ){
        let child = sys_ve_scene.children[ndx];
        let model_folder = modeling_folder.addFolder( child.name );
        switch(child.type){
          case 'Group':
            addGroup( model_folder, child );
            break;

          case 'Mesh':
            addMesh( model_folder, child );
            break;

          case 'DirectionalLight':
            addDirectionalLight( model_folder, child );
            break;

          case 'AmbientLight':
            addAmbientLight( model_folder, child );
            break;

          case 'SpotLight':
            addSpotLight( model_folder, child );
            break;

          case 'PointLight':
            addPointLight( model_folder, child );
            break;

          default:
            break;

        }
      }
    }
    if( screenplay.lil_gui ) {
      architect_panel.current.append( screenplay.lil_gui.domElement );
      screenplay.lil_gui.show();
    }
    return cleanup;
  }, [])
  return( <>
    <div ref={architect_panel} id="architect_panel" className="pip_gui pip_menu">
    <button className="pip_continue" onClick={props.toggleArchitect}>close</button>
  </div>
  </>);
}
function InformationPanel( props ){
  const screenplay =  props.screenplay;
  const showInformation = props.onDisplay
  const [classNames, setClassNames] = useState( 'pip_gui pip_menu hidden' );
  const information_panel = useRef();

  useEffect(()=>{
    showInformation ?
      setClassNames('pip_gui pip_menu') :
      setClassNames('pip_gui pip_menu hidden')

  }, [showInformation]);

  return(
    <>
      <style>{`
        #information_panel{

        }
        #information_panel.hidden{
          scale: 0;
        }
        .info_card{
          height: 42vh; width: 26vh;
        }
        #attributions{
          grid-row: 1;
          grid-column: 1;
          overflow: auto;
          margin: 1em;
          border: solid 1px var(--b1);
        }
        #color_test{
          grid-row: 1;
          grid-column: 2;
          overflow: auto;
        }
        #color_test > ul{
          display: inline-flex;
        }
        #color_test ul{
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .color_scheme{
          display: inline-flex;
        }
        .color_scheme ul{
          padding: .5em;
        }

        .color_scheme ul > li{
          width: 2em;
          height: 2em;
        }

        .color_box{
          margin: 5px;
        }

      `}</style>
      <div ref={information_panel} id="information_panel" className={classNames}>
        <span id="attributions" className="info_card">
          <a target="_blank" href="https://icons8.com/icon/qDNClnB7Z4Ky/people">People</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/20043/gold-bars">Gold Bars</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/D0dSYOIgHwUE/space-capsule">Space Capsule</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/PxbAzd4lNomR/museum">Museum</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/DrD7UPXiB0Mr/spacedock">Spacedock</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/ZiRwjHmdrgtj/info">Information</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/FXLF16VEeRcy/drawing-compass">architect</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/7911/qr-code">QR</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/bdHWJkPWyxoN/search">Search</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/111525/planet-on-the-dark-side">Planet on the Dark Side</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/UkBYfBtQ3Tjd/boy-on-the-rocket">Boy On The Rocket</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/zfocONnnXhqn/orion-a-prominent-constellation-located-on-the-celestial-equator">Orion a prominent constellation located on the celestial equator</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/3qmQGiklUZlg/postboard">Postboard</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/AorombwGHzLn/bank-safe">Bank Safe</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/94483/business-group">Business Group</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/1UaX1pxFlZtk/at-sign">At sign</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/43162/place-marker">Place Marker</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/43604/compact-camera">Camera</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/4CvT2ue9OxHQ/radio-studio">Radio Studio</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/mlaq6t4z5OhM/sticky-note">Sticky Note</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/w9KJ7U6IR4gR/chat">Communication</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/g2AFxEopLdQC/qr-code">Qr Code</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/SAgnQKmOXIlP/upload-image">Upload Image</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/zPiI0jnS1y6H/selfie">Selfie</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/IeqVzLO7hTAe/take-a-photo">Take A Photo</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/YP2lOU31pp9S/affinity-photo">Affinity Photo</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/46861/switch-camera">Switch Camera</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/108790/sound">Sound</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/RC42DqVAI9ju/record-video">Record Video</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
          <a target="_blank" href="https://icons8.com/icon/KLyXgIpg7AdE/stop-gesture">Stop Gesture</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
        </span>

        <div id="color_test" className="info_card">
          <ul >
            <li className="color_box" style={{ backgroundColor: 'var(--r1)', padding: '1em'}}>
              <ul className="color_scheme" >
                <li>
                  <ul>
                    <li className="color_box" style={{ backgroundColor: 'var(--r1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--o1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--y1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--g1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--b1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--i1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--v1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v3)' }}></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="color_box" style={{ backgroundColor: 'var(--o1)', padding: '1em'}}>
              <ul className="color_scheme" >
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--r1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--o1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--y1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--g1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--b1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--i1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--v1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v3)' }}></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="color_box" style={{ backgroundColor: 'var(--y1)', padding: '1em'}}>
              <ul className="color_scheme" >
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--r1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--o1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--y1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--g1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--b1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--i1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--v1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v3)' }}></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="color_box" style={{ backgroundColor: 'var(--g1)', padding: '1em'}}>
              <ul className="color_scheme" >
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--r1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--o1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--y1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--g1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--b1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--i1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--v1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v3)' }}></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="color_box" style={{ backgroundColor: 'var(--b1)', padding: '1em'}}>
              <ul className="color_scheme" >
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--r1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--o1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--y1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--g1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--b1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--i1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--v1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v3)' }}></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="color_box" style={{ backgroundColor: 'var(--i1)', padding: '1em'}}>
              <ul className="color_scheme" >
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--r1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--o1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--y1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--g1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--b1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--i1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--v1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v3)' }}></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="color_box" style={{ backgroundColor: 'var(--v1)', padding: '1em'}}>
              <ul className="color_scheme" >
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--r1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--o1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--y1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--g1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--b1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--i1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--v1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v3)' }}></li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
          <ul >
            <li className="color_box" style={{ backgroundColor: 'var(--r2)', padding: '1em'}}>
              <ul className="color_scheme" >
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--r1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--o1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--y1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--g1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--b1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--i1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--v1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v3)' }}></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="color_box" style={{ backgroundColor: 'var(--o2)', padding: '1em'}}>
              <ul className="color_scheme" >
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--r1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--o1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--y1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--g1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--b1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--i1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--v1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v3)' }}></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="color_box" style={{ backgroundColor: 'var(--y2)', padding: '1em'}}>
              <ul className="color_scheme" >
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--r1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--o1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--y1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--g1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--b1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--i1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--v1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v3)' }}></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="color_box" style={{ backgroundColor: 'var(--g2)', padding: '1em'}}>
              <ul className="color_scheme" >
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--r1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--o1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--y1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--g1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--b1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--i1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--v1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v3)' }}></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="color_box" style={{ backgroundColor: 'var(--b2)', padding: '1em'}}>
              <ul className="color_scheme" >
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--r1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--o1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--y1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--g1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--b1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--i1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--v1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v3)' }}></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="color_box" style={{ backgroundColor: 'var(--i2)', padding: '1em'}}>
              <ul className="color_scheme" >
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--r1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--o1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--y1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--g1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--b1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--i1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--v1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v3)' }}></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="color_box" style={{ backgroundColor: 'var(--v2)', padding: '1em'}}>
              <ul className="color_scheme" >
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--r1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--o1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--y1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--g1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--b1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--i1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--v1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v3)' }}></li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
          <ul >
            <li className="color_box" style={{ backgroundColor: 'var(--r3)', padding: '1em'}}>
              <ul className="color_scheme" >
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--r1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--o1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--y1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--g1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--b1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--i1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--v1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v3)' }}></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="color_box" style={{ backgroundColor: 'var(--o3)', padding: '1em'}}>
              <ul className="color_scheme" >
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--r1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--o1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--y1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--g1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--b1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--i1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--v1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v3)' }}></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="color_box" style={{ backgroundColor: 'var(--y3)', padding: '1em'}}>
              <ul className="color_scheme" >
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--r1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--o1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--y1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--g1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--b1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--i1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--v1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v3)' }}></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="color_box" style={{ backgroundColor: 'var(--g3)', padding: '1em'}}>
              <ul className="color_scheme" >
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--r1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--o1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--y1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--g1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--b1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--i1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--v1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v3)' }}></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="color_box" style={{ backgroundColor: 'var(--b3)', padding: '1em'}}>
              <ul className="color_scheme" >
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--r1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--o1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--y1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--g1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--b1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--i1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--v1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v3)' }}></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="color_box" style={{ backgroundColor: 'var(--i3)', padding: '1em'}}>
              <ul className="color_scheme" >
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--r1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--o1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--y1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--g1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--b1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--i1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--v1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v3)' }}></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="color_box" style={{ backgroundColor: 'var(--v3)', padding: '1em'}}>
              <ul className="color_scheme" >
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--r1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--r3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--o1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--o3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--y1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--y3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--g1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--g3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--b1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--b3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--i1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--i3)' }}></li>
                  </ul>
                </li>
                <li>
                  <ul >
                    <li className="color_box" style={{ backgroundColor: 'var(--v1)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v2)' }}></li>
                    <li className="color_box" style={{ backgroundColor: 'var(--v3)' }}></li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <button className="pip_continue" onClick={props.toggleInformation}>close</button>

      </div>
    </>
  )
}
// Starship Content
function ViewScreenDisplay( props ){
  const [onDisplay, setOnDisplay] = useState(false);
  const [sources, setSources] = useState(false);
  const screenplay = props.screenplay;
  const panel = useRef();

  function SelfCam( props ){
    const [selfCamStream, setSelfCamStream] = useState( props.selfCamStream );
    const onDisplay = props.onDisplay;
    const panel = useRef();

    useEffect( ()=>{

    }, []);

    useEffect( ()=>{
      // TODO: Fix this...
      /*  Taken out temporarily due to excessive video elements being added to the DOM

      if( onDisplay && selfCamStream ){

        let viewScreenVideo = panel.current;
        viewScreenVideo.srcObject = selfCamStream;
        viewScreenVideo.play();
        const texture = new THREE.VideoTexture( viewScreenVideo );
        //texture.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.BackSide } );
        let selfCamScreen = screenplay.actors.Starship.Viewscreen.clone( false );
        selfCamScreen.scale.set( .3, .3, .3 );
        selfCamScreen.position.setX( 8 );
        selfCamScreen.position.setY( 3 );
        selfCamScreen.material = material;
        selfCamScreen.visible = true;
        screenplay.actors.Starship.Viewscreen.parent.add( selfCamScreen );

      }
      */
    }, [onDisplay] );

    return(
      onDisplay ?
        <>
        <style>{`

          `}</style>
          <div>
            <video ref={ panel } style={{display:'none'}} autoPlay playsInline></video>
          </div>
        </>
        :
        <></>
    )
  }

  function VideoStreams( props ){
    const [videoStreams, setVideoStreams] = useState( props.videoStreams );
    const onDisplay = props.onDisplay;
    const wrapper = useRef();
    const panel = useRef();
    const panel2 = useRef();

    useEffect( ()=>{

    }, []);

    useEffect( ()=>{

      if( onDisplay && videoStreams.length > 0 ){

        let viewScreenVideo = panel.current;
        viewScreenVideo.srcObject = videoStreams[0];
        viewScreenVideo.play();
        const texture = new THREE.VideoTexture( viewScreenVideo );
        //texture.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.BackSide } );
        let videoCamScreen = screenplay.actors.Starship.Viewscreen.clone( false );
        videoCamScreen.scale.set( .5, .5, .5 );
        videoCamScreen.position.setX( 2 );
        videoCamScreen.position.setY( 12 );
        videoCamScreen.material = material;
        videoCamScreen.visible = true;
        screenplay.actors.Starship.Viewscreen.parent.add( videoCamScreen );

        let viewScreenVideo2 = panel2.current;
        viewScreenVideo2.srcObject = videoStreams[1];
        viewScreenVideo2.play();
        const texture2 = new THREE.VideoTexture( viewScreenVideo2 );
        //texture.colorSpace = THREE.SRGBColorSpace;
        const material2 = new THREE.MeshBasicMaterial( { map: texture, side: THREE.BackSide } );
        let videoCamScreen2 = screenplay.actors.Starship.Viewscreen.clone( false );
        videoCamScreen2.scale.set( .4, .4, .4 );
        videoCamScreen2.position.setX( -6 );
        videoCamScreen2.position.setY( 4 );
        videoCamScreen2.material = material2;
        videoCamScreen2.visible = true;
        screenplay.actors.Starship.Viewscreen.parent.add( videoCamScreen2 );

      }

    }, [onDisplay] );

    useEffect( ()=>{

    }, [videoStreams] );

    return(
      onDisplay ?
        <>
        <style>{`

          `}</style>
          <div ref={wrapper}>
            <video ref={ panel } style={{display:'none'}} autoPlay playsInline></video>
            <video ref={ panel2 } style={{display:'none'}} autoPlay playsInline></video>
          </div>
        </>
        :
        <></>
    )
  }

  function cleanup(){

  }

  useEffect( ()=>{

    return cleanup;
  }, [] );

  return(
    <>
      <SelfCam onDisplay={props.onDisplay} selfCamStream={props.selfCamStream} />
      <VideoStreams onDisplay={props.onDisplay} videoStreams={props.videoStreams} />
    </>
  );
}

// Sub-Routines
async function ActivateOrbitControls( screenplay ){

  screenplay.user_cam = screenplay.active_cam.clone( true );
  screenplay.active_cam.parent.add( screenplay.user_cam );
  let root_element = document.getElementById( 'root' );
  screenplay.controls.orbit_controls = new OrbitControls( screenplay.active_cam, root_element );
  screenplay.controls.orbit_controls.zoomSpeed = 1;
  screenplay.controls.orbit_controls.enableDamping = true;
  screenplay.controls.orbit_controls.enableZoom = false;
  screenplay.controls.orbit_controls.enablePan = false;

  screenplay.controls.orbit_controls.saveState();
  screenplay.controls.orbit_controls.release_distance = 1 + screenplay.controls.orbit_controls.getDistance();
  screenplay.updatables.set( 'controls', screenplay.controls.orbit_controls );
  screenplay.user_cam.user_control = true;
  screenplay.user_cam.updateProjectionMatrix();
  screenplay.controls.orbit_controls.enabled = true;

}
async function DeactivateOrbitControls( screenplay ){
  screenplay.controls.orbit_controls.reset();
  screenplay.actions.change_cam( screenplay.active_cam.name );
  screenplay.controls.orbit_controls.enabled = false;
  screenplay.updatables.delete( 'controls' );
  screenplay.user_cam.user_control = false;
}
async function ActivateFirstPersonControls( screenplay ){
  if( !screenplay.controls.first_person_controls ) {
    screenplay.controls.first_person_controls = new FirstPersonControls( screenplay.active_cam, screenplay.ui_renderer.domElement );
  }
  screenplay.controls.first_person_controls.movementSpeed = 1000;
  screenplay.controls.first_person_controls.lookSpeed = 10 * 0.005;
  let starship = screenplay.actors.Starship;
  switch( screenplay.active_cam.name ){
    case 'Center':
      //screenplay.controls.first_person_controls.target.copy( screenplay.props.SplashScreen.position );
      break;
    case '3rdPerson':
      //starship.getWorldPosition( screenplay.controls.first_person_controls.target );
      break;
    case 'CaptainCam':
      //starship.NavDots.sight_target.getWorldPosition( screenplay.controls.first_person_controls.target );
      break;
  }
  //screenplay.controls.first_person_controls.release_distance = 1 + screenplay.first_person_controls.orbit_controls.getDistance();
  screenplay.updatables.set( 'controls', screenplay.controls.first_person_controls );
  screenplay.user_cam.user_control = true;
  screenplay.active_cam.updateProjectionMatrix();
  screenplay.controls.first_person_controls.enabled = true;
}
async function DeactivateFirstPersonControls( screenplay ){
  if( !screenplay.controls.first_person_controls ) {
    screenplay.controls.first_person_controls = new FirstPersonControls( screenplay.active_cam, screenplay.ui_renderer.domElement );
  }
  screenplay.actions.change_cam( screenplay.active_cam.name );
  screenplay.controls.first_person_controls.enabled = false;
  screenplay.updatables.delete( 'controls' );
  screenplay.user_cam.user_control = false;
}
async function ActivateFlyControls( screenplay ){
  if( !screenplay.controls.fly_controls ) {
    screenplay.controls.fly_controls = new FlyControls( screenplay.active_cam, screenplay.ui_renderer.domElement );
  }
  screenplay.controls.fly_controls.movementSpeed = 1000;
  screenplay.controls.fly_controls.rollSpeed = 10 * 0.005;
  screenplay.controls.fly_controls.dragToLook = true;
  let starship = screenplay.actors.Starship;
  switch( screenplay.active_cam.name ){
    case 'Center':
      //screenplay.controls.first_person_controls.target.copy( screenplay.props.SplashScreen.position );
      break;
    case '3rdPerson':
      //starship.getWorldPosition( screenplay.controls.first_person_controls.target );
      break;
    case 'CaptainCam':
      //starship.NavDots.sight_target.getWorldPosition( screenplay.controls.first_person_controls.target );
      break;
  }
  //screenplay.controls.first_person_controls.release_distance = 1 + screenplay.first_person_controls.orbit_controls.getDistance();
  screenplay.updatables.set( 'controls', screenplay.controls.fly_controls );
  screenplay.user_cam.user_control = true;
  screenplay.active_cam.updateProjectionMatrix();
  screenplay.controls.fly_controls.enabled = true;
}
async function DeactivateFlyControls( screenplay ){
  if( !screenplay.controls.fly_controls ) {
    screenplay.controls.fly_controls = new FlyControls( screenplay.active_cam, screenplay.ui_renderer.domElement );
  }
  screenplay.actions.change_cam( screenplay.active_cam.name );
  screenplay.controls.first_person_controls.enabled = false;
  screenplay.updatables.delete( 'controls' );
  screenplay.user_cam.user_control = false;
}
async function ResetControls( screenplay ){
  screenplay.controls.orbit_controls.reset();
}
async function ReturnControl( screenplay ){
  if( !screenplay.controls.fly_controls ) {
    screenplay.controls.fly_controls = new FlyControls( screenplay.active_cam, screenplay.ui_renderer.domElement );
  }
  screenplay.actions.change_cam( screenplay.active_cam.name );
  screenplay.controls.first_person_controls.enabled = false;
  screenplay.updatables.delete( 'controls' );
  screenplay.user_cam.user_control = false;
}

export { ErrorBoundary, WeTheMenu, WeTheHeader, ViewScreenDisplay };
