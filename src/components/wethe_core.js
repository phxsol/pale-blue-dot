import { SceneTransformation } from '../bin/ScreenDirector.js';
import React from 'react';
import { useState, useEffect, useRef, Fragment, Component } from 'react';
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
// WeThe Menu
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
        <input type="image" src=".\elements\both_wethebrand.png" name="OpenWeTheMenu" className="menu_icon" />
      </div>
      <div className="menu_choice" data-position={1} onClick={toggleGlyphScanner} >
        <label htmlFor="OpenGlyphScanner" className="pip_text">Scan a Glyph</label>
        <input type="image" src=".\elements\both_glyphscanner.png" name="OpenGlyphScanner" />
      </div>
      <div className="menu_choice" data-position={2} onClick={toggleShareContact} >
        <input type="image" src=".\elements\contacts.png" name="OpenShareContact" />
        <label htmlFor="OpenShareContact" className="pip_text">Share Contact</label>
      </div>
      <div className="menu_choice" data-position={3} onClick={toggleDropPin} >
        <label htmlFor="OpenDropPin" className="pip_text">Drop-A-Pin</label>
        <input type="image" src=".\elements\pin_location.png" name="OpenDropPin" />
      </div>
      <div className="menu_choice" data-position={4} onClick={toggleSnapPix} >
        <label htmlFor="OpenSnapPix" className="pip_text">Snap Pix</label>
        <input type="image" src=".\elements\snap_pix.png" name="OpenSnapPix"/>
      </div>
      <div className="menu_choice" data-position={5} onClick={toggleRecordNote} >
        <label htmlFor="OpenRecordNote" className="pip_text">Record Audio</label>
        <input type="image" src=".\elements\record_audio.png" name="OpenRecordNote"/>
      </div>
      <div className="menu_choice" data-position={6} onClick={toggleRemindMe} >
        <input type="image" src=".\elements\remind_me.png" name="OpenRemindMe" />
        <label htmlFor="OpenRemindMe" className="pip_text">Remind Me!</label>
      </div>
      <div className="menu_choice" data-position={7} onClick={toggleSearch} >
        <label htmlFor="OpenSearch" className="pip_text">Search</label>
        <input type="image" src=".\elements\both_search.png" name="OpenSearch" />
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
function GlyphScanner( props ){
  const screenplay =  props.screenplay;

  const [phase, setPhase] = useState( 0 );
  const [enter, setEnter] = useState( false );
  const [exit, setExit] = useState( false );
  const glyphScannerDBRequest = useRef( false );
  const db = useRef( false );
  const loc = useRef( false );
  const processing = useRef( false );
  const stop = useRef( false );
  const selectors = useRef();
  const object_urls = useRef( [] );
  const [code_found, setCodeFound] = useState( false );

  const [outputMessage, setOutputMessage] = useState();

  const panel = useRef();
  const videoElement = useRef();
  const videoSelect = useRef();
  const scan_button = useRef();
  const scannedGlyphs = useRef();
  const gs_body = useRef();

  function cleanup(){
    deInitComponent();
    for( const objUrl of object_urls.current ){
      URL.revokeObjectURL( objUrl );
    }
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
        duration: screenplay.slo_mode ? 1 : 15, /* do something in 15 frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        entrance_transition.cache.duration = screenplay.slo_mode ? 1 : 15;
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
        duration: screenplay.slo_mode ? 1 : 15, /* do something in this many frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        exit_transition.cache.duration = screenplay.slo_mode ? 1 : 15;
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
    function onError( event ){ /* TODO: Show the failed attempt to the user */ };
    function onSuccess( event ){
      if( event.type !== "upgradeneeded" ){
        db.current = event.target.result;
        loadScannedGlyphs();
      }
    }
    OpenIndexedDBRequest( 'GlyphScanner', 1, onError, onSuccess );

/*
    glyphScannerDBRequest.current = window.indexedDB.open( 'GlyphScanner', 1 );
    glyphScannerDBRequest.current.onerror = (event) => {};
    glyphScannerDBRequest.current.onsuccess = (event) => {
      // Store the result of opening the database in the db variable. This is used a lot below
      db.current = glyphScannerDBRequest.current.result;
      // Run the loadScannedGlyphs() function to populate the SnapPix display with working pix yet to be saved.
      loadScannedGlyphs();
    };
    glyphScannerDBRequest.current.onupgradeneeded = (event) => {
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
*/
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
    class DisplayGlyph{
      glyph; name = "Scanned Glyph";
      constructor( glyph ){
        if( glyph.results.link ){

        }
        const urlCreator = window.URL || window.webkitURL;
        const scan_url = urlCreator.createObjectURL( glyph.blob );
        object_urls.current.push( scan_url );
        let li = document.createElement( 'li' );
        let img = document.createElement( 'img' );
        img.setAttribute( 'src', scan_url );
        img.setAttribute( 'id', glyph.id );
        img.setAttribute( 'data-time', glyph.stc.t );
        img.setAttribute( 'data-loc', glyph.stc.loc );
        li.appendChild( img );
        li.classList.add( 'glyph' );
        li.addEventListener("click", this, false);
        scannedGlyphs.current.appendChild( li );
        this.glyph = glyph;
        this.scan_url = scan_url;
      }

      handleEvent( event ) {
        console.log(event.type);
        switch (event.type) {
          case "click":
            debugger;
            let resolving = dns.lookup( this.glyph.code.data , ( err, address, family )=>{
              debugger;
            });
            const new_iframe = document.createElement( 'iframe' );
            new_iframe.src = this.glyph.code.data;
            gs_body.current.appendChild( new_iframe );
            // some code here…
            break;
          case "dblclick":
            // some code here…
            break;
        }
      }
    }
    let glyphDisplay = new DisplayGlyph( glyph );
  };
  async function analyzeLink( link ){
    debugger;
  }
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
            switch( type ){
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
          let cleaned_code = {
            binaryData: code.binaryData,
            chunks: code.chunks,
            data: code.data
          }
          let codeImage = await cropCode( photo_context, code.location.topLeftCorner, code.location.topRightCorner, code.location.bottomLeftCorner, code.location.bottomRightCorner );
          let codeResults = await processCode( code );
          let stc = {
            loc: JSON.stringify( loc.current.coords ),
            t: Date.now()
          }

          // Save the scanned glyph
          let glyph = new Glyph( stc.t, stc.loc, cleaned_code, codeImage, codeResults );
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
        scan_button.current.src = ".\elements\\both_stop-gesture.png";
        start();
        break;

      case false:
        scan_button.current.src = ".\elements\\both_glyphscanner.png";
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
            <img src=".\elements\both_camera.png" alt="Select video source" />
            <select ref={videoSelect} name="videoSource"></select>
            <br />
            <label htmlFor="videoSource">Camera</label>
          </li>
          <li id="startScan_button" className="image_button">
            <input ref={scan_button} type="image" name="scan" onClick={toggleScanner} src=".\elements\both_capture-photo.png" alt="Snap Photo" />
            <br />
            <label htmlFor="scan" className="pip_text" >Start Scanner</label>
          </li>
        </ul>
        <div ref={gs_body} className="body">
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
        duration: screenplay.slo_mode ? 1 : 15, /* do something in 60 frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        entrance_transition.cache.duration = screenplay.slo_mode ? 1 : 15;
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
        duration: screenplay.slo_mode ? 1 : 15, /* do something in this many frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        exit_transition.cache.duration = screenplay.slo_mode ? 1 : 15;
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
        <ul className="controls" style={{ padding: 0, margin: 0 }}>
          <li className="image_select">
            <img src=".\elements\both_mic.png" alt="Select from this list" />
            <select name="listName"></select>
            <br />
            <label htmlFor="listName">.image_select</label>
          </li>

          <li className="image_button">
            <input  type="image" name="clickme" src=".\elements\both_capture-photo.png" alt="Do Something" />
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
  const [phase, setPhase] = useState( 0 );
  const panel = useRef();
  const timeline = useRef();
  const reset_button = useRef();
  const object_urls = useRef( [] );

  function cleanup(){
    for( const objUrl of object_urls.current ){
      URL.revokeObjectURL( objUrl );
    }
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
        duration: screenplay.slo_mode ? 1 : 15, /* do something in 60 frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        entrance_transition.cache.duration = screenplay.slo_mode ? 1 : 15;
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
        duration: screenplay.slo_mode ? 1 : 15, /* do something in this many frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        exit_transition.cache.duration = screenplay.slo_mode ? 1 : 15;
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
        <ul className="controls" style={{ padding: 0, margin: 0 }}>
          <li className="image_select">
            <img src=".\elements\both_mic.png" alt="Select from this list" />
            <select name="listName"></select>
            <br />
            <label htmlFor="listName">.image_select</label>
          </li>

          <li className="image_button">
            <input  type="image" name="clickme" src=".\elements\both_capture-photo.png" alt="Do Something" />
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
  const [phase_description, setPhaseDescription] = useState();
  const [phase, setPhase] = useState( 3 );
  const [dId, setDId] = useState( -1 );
  const [camera_type, setCameraType] = useState( 'user' );
  const [file_list, setFileList] = useState( [] );
  const [streaming, setStreaming] = useState( false );

  const snapPixDBRequest = useRef( false );
  const db = useRef( false );
  const mediaRecorder = useRef( false );
  const selectors = useRef();
  const loc = useRef( false );
  const recordedChunks = useRef( [] );
  const object_urls = useRef( [] );

  const panel = useRef();
  const recVid_button = useRef();
  const snappedPhotos = useRef();
  const foot = useRef();
  const videoElement = useRef();
  const audioInputSelect = useRef();
  const audioOutputSelect = useRef();
  const videoSelect = useRef();

  function cleanup(){
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
      .then( mediaStream => {
        const stream = mediaStream;
        const tracks = stream.getTracks();
        for( const track of tracks ){
          track.stop();
        }
      } );
    for( const objUrl of object_urls.current ){
      URL.revokeObjectURL( objUrl );
    }
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
        duration: screenplay.slo_mode ? 1 : 15, /* do something in 60 frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        entrance_transition.cache.duration = screenplay.slo_mode ? 1 : 15;
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
        duration: screenplay.slo_mode ? 1 : 15, /* do something in this many frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        exit_transition.cache.duration = screenplay.slo_mode ? 1 : 15;
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
    function onError( event ){ /* TODO: Show the failed attempt to the user */ };
    function onSuccess( event ){
      if( event.type !== "upgradeneeded" ){
        db.current = event.target.result;
        loadSnappedPix();
      }
    }
    OpenIndexedDBRequest( 'SnapPix', 1, onError, onSuccess );

    /*
    snapPixDBRequest.current = window.indexedDB.open( 'SnapPix', 1 );
    snapPixDBRequest.current.onerror = (event) => {};
    snapPixDBRequest.current.onsuccess = (event) => {
      // Store the result of opening the database in the db variable. This is used a lot below
      db.current = snapPixDBRequest.current.result;
      // Run the loadSnappedPix() function to populate the SnapPix display with working pix yet to be saved.
      loadSnappedPix();
    };
    snapPixDBRequest.current.onupgradeneeded = (event) => {
      db.current = event.target.result;
      db.current.onerror = (event) => {
      };
      // Create an objectStore for this database
      let objectStore = db.current.createObjectStore('SnapPix', { keyPath: 't' });
      // Define what data items the objectStore will contain
      objectStore.createIndex('blob', 'blob', { unique: false });
      objectStore.createIndex('loc', 'loc', { unique: false });
    };
    */

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
    objectStore.openCursor().onsuccess = async ( event )=>{
      const cursor = event.target.result;
      // Check if there are no (more) cursor items to iterate through
      if (!cursor) {
        return;
      }
      // Display the photo
      displaySnap( cursor.value );
      // continue on to the next item in the cursor
      cursor.continue();
    }
  }

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
      let stc = {
        t: Date.now(),
        loc: JSON.stringify( loc.current.coords )
      }
      // Save the scanned glyph
      let snap = new Snap( stc.t, stc.loc, blob );
      // Display the photo
      displaySnap( snap )
      // Store Snap in SnapPix db
      addSnap( snap );

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
    const snapImage = await photo_canvas.convertToBlob( {type:'image/png', quality: 1} );
    let stc = {
      t: Date.now(),
      loc: JSON.stringify( loc.current.coords )
    }
    // Save the scanned glyph
    let snap = new Snap( stc.t, stc.loc, snapImage );

    // Display the photo
    displaySnap( snap );
    // Store Snap in SnapPix db
    addSnap( snap );

  }
  async function recVid( e ){
    switch( mediaRecorder.current.state ){
      case 'recording':
        mediaRecorder.current.stop();
        recVid_button.current.src = ".\elements\\both_rec-vid.png";
        break;

      case 'inactive':
        recordedChunks.current = [];
        mediaRecorder.current.start();
        recVid_button.current.src = ".\elements\\both_stop-gesture.png";
        break;

      case 'paused':
        mediaRecorder.current.start();
        recVid_button.current.src = ".\elements\\both_stop-gesture.png";
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
  async function displaySnap( snap ) {

    const urlCreator = window.URL || window.webkitURL;
    const url = urlCreator.createObjectURL( await snap.blob );
    object_urls.current.push( url );
    let li = document.createElement( 'li' );
    switch( snap.blob.type ){
      case 'image/png':
        let img = document.createElement( 'img' );
        img.setAttribute( 'src', url );
        img.setAttribute( 'id', snap.id );
        li.appendChild( img );
        li.classList.add( 'snap' );
        break;

      case 'video/webm':
        let vid = document.createElement( 'video' );
        vid.setAttribute( 'src', url );
        vid.setAttribute( 'id', snap.id );
        vid.setAttribute( 'controls', true );
        li.appendChild( vid );
        li.classList.add( 'vid' );
        break;
    }
    snappedPhotos.current.appendChild( li );
  };

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
      <ul className="controls" style={{ padding: 0, margin: 0 }}>
        <li className="image_select">
          <img src=".\elements\both_mic.png" alt="Select audio input source" />
          <select ref={audioInputSelect} name="audioSource"></select>
          <br />
          <label htmlFor="audioSource">Audio Input</label>
        </li>

        <li className="image_select">
          <img src=".\elements\both_sound.png" alt="Select audio output source" />
          <select ref={audioOutputSelect} name="audioOutput"></select>
          <br />
          <label htmlFor="audioOutput">Audio Output</label>
        </li>
        <li><hr /></li>
        <li className="image_select">
          <img src=".\elements\both_camera.png" alt="Select video source" />
          <select ref={videoSelect} name="videoSource"></select>
          <br />
          <label htmlFor="videoSource">Camera</label>
        </li>
        <li id="snapPic_button" className="image_button">
          <input  type="image" name="snap" onClick={snapPic} src=".\elements\both_capture-photo.png" onMouseOver={()=>{setDId( 3 )}} alt="Snap Photo" />
          <br />
          <label htmlFor="snap" className="pip_text" >Snap Pix</label>
        </li>
        <li className="image_button">
          <input type="image" name="record" ref={recVid_button} onClick={recVid} src=".\elements\both_rec-vid.png" onMouseOver={()=>{setDId( 3 )}} alt="Record Video" />
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
  const [enter, setEnter] = useState( false );
  const [exit, setExit] = useState( false );
  const [phase_description, setPhaseDescription] = useState();
  const [phase, setPhase] = useState( 3 );
  const [camera_type, setCameraType] = useState( 'user' );
  const [dId, setDId] = useState( -1 );
  const [file_list, setFileList] = useState( [] );
  const [streaming, setStreaming] = useState( false );

  const recordNoteDBRequest = useRef( false );
  const db = useRef( false );
  const mediaRecorder = useRef( false );
  const selectors = useRef();
  const loc = useRef( false );
  const recordedChunks = useRef( [] );
  const object_urls = useRef( [] );

  const panel = useRef();
  const dictate_button = useRef();
  const recordedNotes = useRef();
  const foot = useRef();
  const canvasElement = useRef();
  const audioInputSelect = useRef();
  const audioOutputSelect = useRef();
  const videoSelect = useRef();

  function cleanup(){
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
      .then(mediaStream => {
        const stream = mediaStream;
        const tracks = stream.getTracks();
        for( const track of tracks ){
          track.stop();
        }
      });
    for( const objUrl of object_urls.current ){
      URL.revokeObjectURL( objUrl );
    }
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
        duration: screenplay.slo_mode ? 1 : 15, /* do something in 60 frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        entrance_transition.cache.duration = screenplay.slo_mode ? 1 : 15;
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
        duration: screenplay.slo_mode ? 1 : 15, /* do something in this many frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        exit_transition.cache.duration = screenplay.slo_mode ? 1 : 15;
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
    function onError( event ){ /* TODO: Show the failed attempt to the user */ };
    function onSuccess( event ){
      if( event.type !== "upgradeneeded" ){
        db.current = event.target.result;
        loadRecordedNotes();
      }
    }
    OpenIndexedDBRequest( 'RecordNote', 1, onError, onSuccess );
    /*
    recordNoteDBRequest.current = window.indexedDB.open( 'RecordNote', 1 );
    recordNoteDBRequest.current.onerror = (event) => {};
    recordNoteDBRequest.current.onsuccess = (event) => {
      // Store the result of opening the database in the db variable. This is used a lot below
      db.current = recordNoteDBRequest.current.result;
      // Run the loadRecordedNotes() function to populate the RecordNote display with working pix yet to be saved.
      loadRecordedNotes();
    };
    recordNoteDBRequest.current.onupgradeneeded = (event) => {
      db.current = event.target.result;
      db.current.onerror = (event) => {
      };
      // Create an objectStore for this database
      let objectStore = db.current.createObjectStore('RecordNote', { keyPath: 't' });
      // Define what data items the objectStore will contain
      objectStore.createIndex('blob', 'blob', { unique: false });
      objectStore.createIndex('loc', 'loc', { unique: false });
    };
    */

    // Initialize the user's Camera Interface
    selectors.current = [audioInputSelect.current];
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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( (pos)=>{
        loc.current = pos;
      });
    }
    start();
    return cleanup;
  }
  useEffect( initialize, [] );
  async function loadRecordedNotes(){
    recordedNotes.current.replaceChildren();

    const objectStore = db.current.transaction( 'RecordNote' ).objectStore( 'RecordNote' );
    objectStore.openCursor().onsuccess = ( event )=>{
      const cursor = event.target.result;
      // Check if there are no (more) cursor items to iterate through
      if (!cursor) {
        return;
      }
      const dict = cursor.value;
      displayRecording( dict );


      // continue on to the next item in the cursor
      cursor.continue();
    }
  }
  async function displayRecording( dict ) {
    const urlCreator = window.URL || window.webkitURL;
    const url = urlCreator.createObjectURL( await dict.blob );
    object_urls.current.push( url );
    let li = document.createElement( 'li' );
    let img = document.createElement( 'img' );
    img.setAttribute( 'src', './both_mic.png' );
    img.setAttribute( 'id', dict.stc.t );
    li.appendChild( img );
    let audio_element = document.createElement( 'audio' );
    audio_element.setAttribute( 'controls', true );
    let audio_src = document.createElement( 'source' );
    audio_src.setAttribute( 'src', url );
    audio_src.setAttribute( 'type', dict.blob.type );
    audio_element.appendChild( audio_src );
    li.appendChild( audio_element );
    li.classList.add( 'dict' );
    recordedNotes.current.appendChild( li );

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
    const constraints = {
      audio: {deviceId: audioSource ? {exact: audioSource} : undefined}
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
    canvasElement.current.srcObject = stream;

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
        type: "audio/mpeg",
      } );
      let stc = {
        t: Date.now(),
        loc: JSON.stringify( loc.current.coords )
      }
      // Save the scanned glyph
      let dict = new Dict( stc.t, stc.loc, blob );
      // Display the photo
      displayRecording( dict );
      // Store Snap in RecordNote db
      addDict( dict );

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
  async function recDict( e ){
    switch( mediaRecorder.current.state ){
      case 'recording':
        mediaRecorder.current.stop();
        dictate_button.current.src = ".\\elements\\both_rec-vid.png";
        break;

      case 'inactive':
        recordedChunks.current = [];
        mediaRecorder.current.start();
        dictate_button.current.src = ".\\elements\\both_stop-gesture.png";
        break;

      case 'paused':
        mediaRecorder.current.start();
        dictate_button.current.src = ".\\elements\\both_stop-gesture.png";
        break;
    }
  }
  function addDict( dict ){
    const transaction = db.current.transaction(['RecordNote'], 'readwrite');
    transaction.oncomplete = () => {
      // TODO: Verify that the image is in there?
    };
    transaction.onerror = () => {};
    let objectStore = transaction.objectStore( 'RecordNote' );
    const addDictReq = objectStore.add( dict );
    addDictReq.onsuccess = ( event )=>{}
  }

  return(
    <>
    <style>{`


      #RecordNote .status{
        display: grid;
        grid-auto-rows: 1fr;
        grid-template-columns: repeat(5, 1fr);
        grid-gap: calc( var(--sF) * 1rem );
        background: var(--panelBG);
      }
      #RecordNote .status li{
        height: 7rem;
        cursor: pointer;
      }
      #RecordNote .status img, #RecordNote status video{
        height: 100%;
      }

      #snapPic_button:active{
        background: white;
      }

      #exit_RecordNote{
        grid-column: 1;
      }
      #reset_RecordNote{
        grid-column: 2;
      }

      #RecordNote video{
        margin: auto;
        max-width: 100%;
        max-height: 100%;
      }

      `}</style>
    <div id="RecordNote" ref={panel} className="pip_gui pip_post">
      <div className="head">
        <h1 className="pip_title">Snap Pix</h1>
      </div>
      <ul className="controls" style={{ padding: 0, margin: 0 }}>
        <li className="image_select">
          <img src=".\elements\both_mic.png" alt="Select audio input source" />
          <select ref={audioInputSelect} name="audioSource"></select>
          <br />
          <label htmlFor="audioSource">Audio Input</label>
        </li>
        <li className="image_select">
          <img src=".\elements\both_sound.png" alt="Select audio output source" />
          <select ref={audioOutputSelect} name="audioOutput"></select>
          <br />
          <label htmlFor="audioOutput">Audio Output</label>
        </li>
        <li><hr /></li>
        <li className="image_button">
          <input type="image" name="dictate" ref={dictate_button} onClick={recDict} src=".\elements\both_rec-vid.png" onMouseOver={()=>{setDId( 3 )}} alt="Record Video" />
          <br />
          <label htmlFor="dictate" className="pip_text">Dictate Memo</label>
        </li>
      </ul>
      <div className="body">
        <canvas ref={canvasElement}></canvas>
      </div>
      <ul className="status" ref={recordedNotes}></ul>
      <ul id="RecordNote_Foot" className="foot" ref={foot}>
        <li>
          <button id="exit_RecordNote" name="exit_RecordNote" className="pip_cancel exit_RecordNote" type="button" onClick={props.toggle}>Exit</button>
        </li>
      </ul>
    </div>
    </>
  )
}
function RemindMe( props ) {
  const screenplay =  props.screenplay;
  const [enter, setEnter] = useState( false );
  const [exit, setExit] = useState( false );
  const [phase, setPhase] = useState( 0 );

  const remindMeDBRequest = useRef( false );
  const db = useRef( false );
  const object_urls = useRef( [] );

  // UI Element Reference
  const panel = useRef();
  const reset_button = useRef();
  const taskForm = useRef();
  const title = useRef();
  const hours = useRef();
  const minutes = useRef();
  const day = useRef();
  const month = useRef();
  const year = useRef();
  const submit = useRef();
  const notifications = useRef();
  const notificationBtn = useRef();

  function cleanup(){
    for( const objUrl of object_urls.current ){
      URL.revokeObjectURL( objUrl );
    }
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
        duration: screenplay.slo_mode ? 1 : 15, /* do something in 60 frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        entrance_transition.cache.duration = screenplay.slo_mode ? 1 : 15;
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
        duration: screenplay.slo_mode ? 1 : 15, /* do something in this many frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        exit_transition.cache.duration = screenplay.slo_mode ? 1 : 15;
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

    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    if (Notification.permission === 'denied' || Notification.permission === 'default') {
      notificationBtn.current.classList.remove( 'allowed' );
    } else {
      notificationBtn.current.classList.add( 'allowed' );
    }

    // Load RemindMe Database
    function onError( event ){ /* TODO: Show the failed attempt to the user */ };
    function onSuccess( event ){
      if( event.type !== "upgradeneeded" ){
        db.current = event.target.result;
        displayData();
      }
    }
    OpenIndexedDBRequest( 'RemindMe', 1, onError, onSuccess );
/*
    remindMeDBRequest.current = window.indexedDB.open('RemindMe', 1);
    remindMeDBRequest.current.onerror = (event) => {
    };
    remindMeDBRequest.current.onsuccess = (event) => {
      db.current = remindMeDBRequest.current.result;
      displayData();
    };
    remindMeDBRequest.current.onupgradeneeded = (event) => {
      db.current = event.target.result;
      db.current.onerror = (event) => {
      };
      let objectStore = db.current.createObjectStore('RemindMe', { keyPath: 'taskTitle' });
      objectStore.createIndex('hours', 'hours', { unique: false });
      objectStore.createIndex('minutes', 'minutes', { unique: false });
      objectStore.createIndex('day', 'day', { unique: false });
      objectStore.createIndex('month', 'month', { unique: false });
      objectStore.createIndex('year', 'year', { unique: false });
      objectStore.createIndex('notified', 'notified', { unique: false });
    };
*/

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

  function addData(e) {
    // Prevent default, as we don't want the form to submit in the conventional way
    e.preventDefault();

    // Stop the form submitting if any values are left empty.
    // This should never happen as there is the required attribute
    if (title.current.value === '' || hours.current.value === null || minutes.current.value === null || day.current.value === '' || month.current.value === '' || year.current.value === null) {
      return;
    }

    // Grab the values entered into the form fields and store them in an object ready for being inserted into the IndexedDB
    const newItem = [
      { taskTitle: title.current.value, hours: hours.current.value, minutes: minutes.current.value, day: day.current.value, month: month.current.value, year: year.current.value, notified: 'no' },
    ];

    // Open a read/write DB transaction, ready for adding the data
    const transaction = db.current.transaction(['RemindMe'], 'readwrite');

    // Report on the success of the transaction completing, when everything is done
    transaction.oncomplete = () => {

      // Update the display of data to show the newly added item, by running displayData() again.
      displayData();
    };

    // Handler for any unexpected error
    transaction.onerror = () => {
    };

    // Call an object store that's already been added to the database
    let objectStore = transaction.objectStore('RemindMe');
    console.log(objectStore.indexNames);
    console.log(objectStore.keyPath);
    console.log(objectStore.name);
    console.log(objectStore.transaction);
    console.log(objectStore.autoIncrement);

    // Make a request to add our newItem object to the object store
    const objectStoreRequest = objectStore.add(newItem[0]);
    objectStoreRequest.onsuccess = (event) => {
      // Clear the form, ready for adding the next entry
      title.current.value = 'Remember';
      hours.current.value = 11;
      minutes.current.value = 50;
      day.current.value = 6;
      month.current.value = 'January';
      year.current.value = 2021;
      https: '//en.wikipedia.org/wiki/Timeline_of_the_January_6_United_States_Capitol_attack#cite_ref-House_select_committee_on_the_January_6_attack_585_171-1'
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
        notificationBtn.current.classList.remove( 'allowed' );
      } else {
        notificationBtn.current.classList.add( 'allowed' );
      }
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
      notificationBtn.current.classList.remove( 'allowed' );
    } else {
      notificationBtn.current.classList.add( 'allowed' );
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
    let objectStore = db.current.transaction(['RemindMe'], 'readwrite').objectStore('RemindMe');

    // Open a cursor to iterate through all the data items in the IndexedDB
    objectStore.openCursor().onsuccess = (event) => {
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
    let objectStore = db.current.transaction(['RemindMe'], 'readwrite').objectStore('RemindMe');

    // Get the to-do list object that has this title as its title
    const objectStoreTitleRequest = objectStore.get(new_title);

    objectStoreTitleRequest.onsuccess = () => {
      // Grab the data object returned as the result
      const data = objectStoreTitleRequest.result;

      // Update the notified value in the object to 'yes'
      data.notified = 'yes';

      // Create another request that inserts the item back into the database
      const updateTitleRequest = objectStore.put(data);

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
    const transaction = db.current.transaction(['RemindMe'], 'readwrite');
    transaction.objectStore('RemindMe').delete(dataTask);

    // Report that the data item has been deleted
    transaction.oncomplete = () => {
      // Delete the parent of the button, which is the list item, so it is no longer displayed
      event.target.parentNode.parentNode.removeChild(event.target.parentNode);
    };
  };
  function displayData() {

    // First clear the content of the task list so that you don't get a huge long list of duplicate stuff each time
    // the display is updated.
    while (notifications.current.firstChild) {
      notifications.current.removeChild(notifications.current.lastChild);
    }

    // Open our object store and then get a cursor list of all the different data items in the IDB to iterate through
    let objectStore = db.current.transaction('RemindMe').objectStore('RemindMe');
    objectStore.openCursor().onsuccess = (event) => {
      const cursor = event.target.result;
      // Check if there are no (more) cursor items to iterate through
      if (!cursor) {
        // No more items to iterate through, we quit.
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
      notifications.current.appendChild(listItem);

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

        `}</style>
      <div id="RemindMe" ref={panel} className="pip_gui pip_post">
        <div className="head">
          <h1 className="pip_title">Remind Me!</h1>
        </div>
        <ul className="controls" style={{ padding: 0, margin: 0 }}>
          <li className="image_toggle">
            <img src=".\elements\both_mic.png" alt="Notify Me!" />
            <input id="NotifyMe" type="radio" name="reminder_type" value="NotifyMe" />
            <br />
            <label htmlFor="NotifyMe">Notify Me!</label>
          </li>
          <li className="image_toggle">
            <img src=".\elements\both_mic.png" alt="Prioritize This!" />
            <input id="PrioritizeThis" type="radio" name="reminder_type" value="PrioritizeThis" />
            <br />
            <label htmlFor="PrioritizeThis">Prioritize This!</label>
          </li>
          <li className="image_toggle">
            <img src=".\elements\both_mic.png" alt="Plan This!" />
            <input id="PlanThis" type="radio" name="reminder_type" value="PlanThis" />
            <br />
            <label htmlFor="PlanThis">Plan This!</label>
          </li>
          <li className="image_checkbox">
            <img src=".\elements\both_mic.png" alt="Allow Browser Alerts?" />
            <input ref={notificationBtn} type="checkbox" name="AllowAlerts" value="Allow" />
            <br />
            <label htmlFor="allow_alerts">Allow Browser Alerts?</label>
          </li>
        </ul>
        <div className="body">
          <form id="task-form" ref={taskForm} onSubmit={addData}>
            <div>
              <label htmlFor="title" className="pip_text">Task title:</label>
              <input type="text" id="title" ref={title} required />
            </div>
            <div><label htmlFor="deadline-hours" className="pip_text">Hours (hh):</label><input type="number" id="deadline-hours" ref={hours} required /></div>
            <div><label htmlFor="deadline-minutes" className="pip_text">Mins (mm):</label><input type="number" id="deadline-minutes" ref={minutes} required /></div>
            <div><label htmlFor="deadline-day" className="pip_text">Day:</label>
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

            <div>
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

            <div>
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
        <ul id="notifications" ref={notifications} className="status"></ul>
        <ul className="foot">
          <li>
            <button name="exit" className="pip_cancel" type="button" onClick={props.toggle}>Exit</button>
          </li>
          <li>
            <button ref={reset_button} name="reset" className="pip_continue" type="button" onClick={()=>{setPhase( 0 )}}>Back</button>
          </li>
        </ul>
        <a className="whatgoesaround hubris nemesis" href="https://en.wikipedia.org/wiki/Timeline_of_the_January_6_United_States_Capitol_attack#cite_ref-House_select_committee_on_the_January_6_attack_585_171-1">&Pi;</a>
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
  const object_urls = useRef( [] );

  function cleanup(){
    for( const objUrl of object_urls.current ){
      URL.revokeObjectURL( objUrl );
    }
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
        duration: screenplay.slo_mode ? 1 : 15, /* do something in 60 frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        entrance_transition.cache.duration = screenplay.slo_mode ? 1 : 15;
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
        duration: screenplay.slo_mode ? 1 : 15, /* do something in this many frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        exit_transition.cache.duration = screenplay.slo_mode ? 1 : 15;
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
// WeThe Header
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

      #accounts_panel{
        background-image: url(./backgrounds/accounts.jpeg);
        background-size: cover;
        background-position: center center;
      }
      #contacts_panel{
        background-image: url(./backgrounds/contacts.jpeg);
        background-size: cover;
        background-position: center bottom;
      }
      #collections_panel{}
      #discussions_panel{
        background-image: url(./backgrounds/discussions2.jpeg);
        background-size: cover;
        background-position: center bottom;
      }
      #events_panel{
        background-image: url(./backgrounds/events.jpeg);
        background-size: cover;
        background-position: center bottom;
      }
      #classifieds_panel{
        background-image: url(./backgrounds/classifieds.jpeg);
        background-size: cover;
        background-position: center bottom;
      }
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
          <img src=".\elements\both_vault.png" />
          <span className="account_balance">{account_balance}</span>
          <span className="account_change">{account_change}</span>
        </li>

        <li className="header_menu_item contacts" onClick={toggleContacts}>
          <img src=".\elements\both_groups.png" />
          <span className="online_contacts">{online_contacts}</span>
          <span className="alerts">{contacts_alerts}</span>
        </li>

        <li className="header_menu_item collections" onClick={toggleCollections}>
          <img src=".\elements\collections.png" />
          <span className="active_collections">{active_collections}</span>
          <span className="alerts">{collections_alerts}</span>
        </li>

        <li className="header_menu_item discussions" onClick={toggleDiscussions}>
          <img src=".\elements\both_wethebrand.png" />
          <span className="active_discussions">{active_discussions}</span>
          <span className="alerts">{discussions_alerts}</span>
        </li>

        <li className="header_menu_item events" onClick={toggleEvents}>
          <img src=".\elements\both_planet_alert.png" />
          <span className="active_events">{active_events}</span>
          <span className="alerts">{events_alerts}</span>
        </li>

        <li className="header_menu_item classifieds" onClick={toggleClassifieds}>
          <img src=".\elements\classifieds.png" />
          <span className="active_classifieds">{active_classifieds}</span>
          <span className="alerts">{classifieds_alerts}</span>
        </li>

        <li className="header_menu_item architect" onClick={toggleArchitect}>
          <img src=".\elements\architect.png" />
        </li>

        <li className="header_menu_item information" onClick={toggleInformation}>
          <img src=".\elements\dark_information.png" />
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
function AccountPanel( props ){
  const account_panel = useRef();
  const screenplay =  props.screenplay;
  const body = useRef();

  useEffect(()=>{
    account_panel.current.classList.remove('loading');
  },[]);

    return(<>
      <style>{`




        `}</style>
      <div ref={account_panel} id="accounts_panel" className="pip_gui pip_menu">
        <div className="head">
          <h1 className="pip_title">My Accounts</h1>
        </div>
        <div ref={body} className="body">
        </div>
        <div className="controls">
          <button className="pip_cancel" onClick={props.toggleAccount}>Exit</button>

        </div>
      </div>
    </>);
}
function ContactsPanel( props ){
  const screenplay =  props.screenplay;
  const contacts_panel = useRef();
  const body = useRef();

  return(<>
    <style>{`




      `}</style>
    <div ref={contacts_panel} id="contacts_panel" className="pip_gui pip_menu">
      <div className="head">
        <h1 className="pip_title">Contacts Management</h1>
      </div>
      <div ref={body} className="body">
      </div>
      <div className="controls">
        <button className="pip_cancel" onClick={props.toggleContacts}>Exit</button>

      </div>
    </div>
  </>);
}
function CollectionsPanel_WithCollisions( props ){
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
    const width = collections_panel.current.offsetWidth, height = collections_panel.current.offsetHeight;
    const minorDim = Math.min( width, height );
    const majorDim = Math.max( width, height );
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
      .attr('transform', `translate(${15000 >>1}, ${15000>>1})`);

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
  return(
    <>
    <style>{``}</style>
    <div ref={collections_panel} className="pip_gui pip_menu loading">
      <button className="pip_continue" onClick={props.toggleCollections}>close</button>
    </div>
    </>);
}
function CollectionsPanel( props ){
  const screenplay =  props.screenplay;

  const [phase_description, setPhaseDescription] = useState();
  const [phase, setPhase] = useState( 3 );
  const [dId, setDId] = useState( -1 );
  const [enter, setEnter] = useState( false );
  const [exit, setExit] = useState( false );
  const [ready, setReady] = useState( false );

  const panel = useRef();
  const body = useRef();
  const svg = useRef();

  const dbs = useRef( {} );
  const resizeTimeout = useRef();
  const snaps = useRef( [] );
  const collections = useRef( [] );
  const glyphs = useRef( [] );
  const dicts = useRef( [] );
  const minders = useRef( [] );
  const object_urls = useRef( [] );

  function cleanup(){
    window.removeEventListener( 'resize', resize );
    for( const objUrl of object_urls.current ){
      URL.revokeObjectURL( objUrl );
    }
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
        duration: screenplay.slo_mode ? 1 : 15, /* do something in 60 frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        entrance_transition.cache.duration = screenplay.slo_mode ? 1 : 15;
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
        duration: screenplay.slo_mode ? 1 : 15, /* do something in this many frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        exit_transition.cache.duration = screenplay.slo_mode ? 1 : 15;
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

    // Database Interaction
    function onError( event ){ /* TODO: Show the failed attempt to the user */ };
    // Load GlyphScanner Database
    function onGlyphScannerSuccess( event ){
      if( event.type !== "upgradeneeded" ){
        dbs.current.GlyphScanner = event.target.result;
        let gsOS = dbs.current.GlyphScanner.transaction( 'GlyphScanner' ).objectStore( 'GlyphScanner' );
        gsOS.getAll().onsuccess = async (event) => {
          for( const glyph of event.target.result ){
            glyph.value = glyph.blob.size;
            glyphs.current.push( glyph );
          }
          return true;
        };
      }
    }
    // Load SnapPix Database
    function onSnapPixSuccess( event ){
      if( event.type !== "upgradeneeded" ){
        dbs.current.SnapPix = event.target.result;
        let spOS = dbs.current.SnapPix.transaction( 'SnapPix' ).objectStore( 'SnapPix' );
        spOS.getAll().onsuccess = async (event) => {
          for( const snap of event.target.result ){
            snap.value = snap.blob.size;
            snaps.current.push( snap );
          }
          return true;
        };
      }
    }
    // Load RecordNote Database
    function onRecordNoteSuccess( event ){
      if( event.type !== "upgradeneeded" ){
        dbs.current.RecordNote = event.target.result;
        let rnOS = dbs.current.RecordNote.transaction( 'RecordNote' ).objectStore( 'RecordNote' );
        rnOS.getAll().onsuccess = async (event) => {
          for( const dict of event.target.result ){
            dict.value = dict.blob.size;
            dicts.current.push( dict );
          }
          return true;
        };
      }
    }
    // Load RemindMe Database
    function onRemindMeSuccess( event ){
      if( event.type !== "upgradeneeded" ){
        dbs.current.RemindMe = event.target.result;
        let rmOS = dbs.current.RemindMe.transaction( 'RemindMe' ).objectStore( 'RemindMe' );
        rmOS.getAll().onsuccess = async (event) => {
          for( const minder of event.target.result ){
            minder.value = 50000;
            minders.current.push( minder );
          }
          return true;
        };
      }
    }
    // Load Collections Database
    function onCollectionsSuccess( event ){
      if( event.type !== "upgradeneeded" ){
        dbs.current.Collections = event.target.result;
        let coOS = dbs.current.Collections.transaction( 'Collections' ).objectStore( 'Collections' );
        coOS.getAll().onsuccess = async (event) => {
          collections.current = event.target.result;
          return true;
        };
      }
    }
    const async_f = async ()=>{
      await OpenIndexedDBRequest( 'GlyphScanner', 1, onError, onGlyphScannerSuccess );
      await OpenIndexedDBRequest( 'SnapPix', 1, onError, onSnapPixSuccess );
      await OpenIndexedDBRequest( 'RecordNote', 1, onError, onRecordNoteSuccess );
      await OpenIndexedDBRequest( 'RemindMe', 1, onError, onRemindMeSuccess );
      await OpenIndexedDBRequest( 'Collections', 1, onError, onCollectionsSuccess );
      //displayCirclePacking();
      circlePacking();
    }
    async_f();

    window.addEventListener( 'resize', function(){
      clearTimeout( resizeTimeout.current );
      resizeTimeout.current = setTimeout( resize, 100 );
    } );

    return cleanup;
  }
  useEffect( init , []);

  function circlePacking(){

    // Specify the chart’s dimensions.
    let width = body.current.clientWidth || body.current.offsetWidth;
    let height = body.current.clientHeight || body.current.offsetHeight;
    // Create the color scale.
    const color = d3.scaleLinear().domain([0, 6]).range(["#052776", "#90A0C6"]).interpolate(d3.interpolateHcl);
    // Compute the layout.
    const pack = data => d3.pack()
        .size([width, width])
        .padding(3)
      (d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value));
    const old_data = {
      "children": [
          {
              "children": [
                  {
                      "children": [
                          {
                              "name": "AgglomerativeCluster",
                              "value": 3938
                          },
                          {
                              "name": "CommunityStructure",
                              "value": 3812
                          },
                          {
                              "name": "HierarchicalCluster",
                              "value": 6714
                          },
                          {
                              "name": "MergeEdge",
                              "value": 743
                          }
                      ],
                      "name": "cluster"
                  },
                  {
                      "children": [
                          {
                              "name": "BetweennessCentrality",
                              "value": 3534
                          },
                          {
                              "name": "LinkDistance",
                              "value": 5731
                          },
                          {
                              "name": "MaxFlowMinCut",
                              "value": 7840
                          },
                          {
                              "name": "ShortestPaths",
                              "value": 5914
                          },
                          {
                              "name": "SpanningTree",
                              "value": 3416
                          }
                      ],
                      "name": "graph"
                  },
                  {
                      "children": [
                          {
                              "name": "AspectRatioBanker",
                              "value": 7074
                          }
                      ],
                      "name": "optimization"
                  }
              ],
              "name": "analytics"
          },
          {
              "children": [
                  {
                      "name": "Easing",
                      "value": 17010
                  },
                  {
                      "name": "FunctionSequence",
                      "value": 5842
                  },
                  {
                      "children": [
                          {
                              "name": "ArrayInterpolator",
                              "value": 1983
                          },
                          {
                              "name": "ColorInterpolator",
                              "value": 2047
                          },
                          {
                              "name": "DateInterpolator",
                              "value": 1375
                          },
                          {
                              "name": "Interpolator",
                              "value": 8746
                          },
                          {
                              "name": "MatrixInterpolator",
                              "value": 2202
                          },
                          {
                              "name": "NumberInterpolator",
                              "value": 1382
                          },
                          {
                              "name": "ObjectInterpolator",
                              "value": 1629
                          },
                          {
                              "name": "PointInterpolator",
                              "value": 1675
                          },
                          {
                              "name": "RectangleInterpolator",
                              "value": 2042
                          }
                      ],
                      "name": "interpolate"
                  },
                  {
                      "name": "ISchedulable",
                      "value": 1041
                  },
                  {
                      "name": "Parallel",
                      "value": 5176
                  },
                  {
                      "name": "Pause",
                      "value": 449
                  },
                  {
                      "name": "Scheduler",
                      "value": 5593
                  },
                  {
                      "name": "Sequence",
                      "value": 5534
                  },
                  {
                      "name": "Transition",
                      "value": 9201
                  },
                  {
                      "name": "Transitioner",
                      "value": 19975
                  },
                  {
                      "name": "TransitionEvent",
                      "value": 1116
                  },
                  {
                      "name": "Tween",
                      "value": 6006
                  }
              ],
              "name": "animate"
          },
          {
              "children": [
                  {
                      "children": [
                          {
                              "name": "Converters",
                              "value": 721
                          },
                          {
                              "name": "DelimitedTextConverter",
                              "value": 4294
                          },
                          {
                              "name": "GraphMLConverter",
                              "value": 9800
                          },
                          {
                              "name": "IDataConverter",
                              "value": 1314
                          },
                          {
                              "name": "JSONConverter",
                              "value": 2220
                          }
                      ],
                      "name": "converters"
                  },
                  {
                      "name": "DataField",
                      "value": 1759
                  },
                  {
                      "name": "DataSchema",
                      "value": 2165
                  },
                  {
                      "name": "DataSet",
                      "value": 586
                  },
                  {
                      "name": "DataSource",
                      "value": 3331
                  },
                  {
                      "name": "DataTable",
                      "value": 772
                  },
                  {
                      "name": "DataUtil",
                      "value": 3322
                  }
              ],
              "name": "data"
          },
          {
              "children": [
                  {
                      "name": "DirtySprite",
                      "value": 8833
                  },
                  {
                      "name": "LineSprite",
                      "value": 1732
                  },
                  {
                      "name": "RectSprite",
                      "value": 3623
                  },
                  {
                      "name": "TextSprite",
                      "value": 10066
                  }
              ],
              "name": "display"
          },
          {
              "children": [
                  {
                      "name": "FlareVis",
                      "value": 4116
                  }
              ],
              "name": "flex"
          },
          {
              "children": [
                  {
                      "name": "DragForce",
                      "value": 1082
                  },
                  {
                      "name": "GravityForce",
                      "value": 1336
                  },
                  {
                      "name": "IForce",
                      "value": 319
                  },
                  {
                      "name": "NBodyForce",
                      "value": 10498
                  },
                  {
                      "name": "Particle",
                      "value": 2822
                  },
                  {
                      "name": "Simulation",
                      "value": 9983
                  },
                  {
                      "name": "Spring",
                      "value": 2213
                  },
                  {
                      "name": "SpringForce",
                      "value": 1681
                  }
              ],
              "name": "physics"
          },
          {
              "children": [
                  {
                      "name": "AggregateExpression",
                      "value": 1616
                  },
                  {
                      "name": "And",
                      "value": 1027
                  },
                  {
                      "name": "Arithmetic",
                      "value": 3891
                  },
                  {
                      "name": "Average",
                      "value": 891
                  },
                  {
                      "name": "BinaryExpression",
                      "value": 2893
                  },
                  {
                      "name": "Comparison",
                      "value": 5103
                  },
                  {
                      "name": "CompositeExpression",
                      "value": 3677
                  },
                  {
                      "name": "Count",
                      "value": 781
                  },
                  {
                      "name": "DateUtil",
                      "value": 4141
                  },
                  {
                      "name": "Distinct",
                      "value": 933
                  },
                  {
                      "name": "Expression",
                      "value": 5130
                  },
                  {
                      "name": "ExpressionIterator",
                      "value": 3617
                  },
                  {
                      "name": "Fn",
                      "value": 3240
                  },
                  {
                      "name": "If",
                      "value": 2732
                  },
                  {
                      "name": "IsA",
                      "value": 2039
                  },
                  {
                      "name": "Literal",
                      "value": 1214
                  },
                  {
                      "name": "Match",
                      "value": 3748
                  },
                  {
                      "name": "Maximum",
                      "value": 843
                  },
                  {
                      "children": [
                          {
                              "name": "add",
                              "value": 593
                          },
                          {
                              "name": "and",
                              "value": 330
                          },
                          {
                              "name": "average",
                              "value": 287
                          },
                          {
                              "name": "count",
                              "value": 277
                          },
                          {
                              "name": "distinct",
                              "value": 292
                          },
                          {
                              "name": "div",
                              "value": 595
                          },
                          {
                              "name": "eq",
                              "value": 594
                          },
                          {
                              "name": "fn",
                              "value": 460
                          },
                          {
                              "name": "gt",
                              "value": 603
                          },
                          {
                              "name": "gte",
                              "value": 625
                          },
                          {
                              "name": "iff",
                              "value": 748
                          },
                          {
                              "name": "isa",
                              "value": 461
                          },
                          {
                              "name": "lt",
                              "value": 597
                          },
                          {
                              "name": "lte",
                              "value": 619
                          },
                          {
                              "name": "max",
                              "value": 283
                          },
                          {
                              "name": "min",
                              "value": 283
                          },
                          {
                              "name": "mod",
                              "value": 591
                          },
                          {
                              "name": "mul",
                              "value": 603
                          },
                          {
                              "name": "neq",
                              "value": 599
                          },
                          {
                              "name": "not",
                              "value": 386
                          },
                          {
                              "name": "or",
                              "value": 323
                          },
                          {
                              "name": "orderby",
                              "value": 307
                          },
                          {
                              "name": "range",
                              "value": 772
                          },
                          {
                              "name": "select",
                              "value": 296
                          },
                          {
                              "name": "stddev",
                              "value": 363
                          },
                          {
                              "name": "sub",
                              "value": 600
                          },
                          {
                              "name": "sum",
                              "value": 280
                          },
                          {
                              "name": "update",
                              "value": 307
                          },
                          {
                              "name": "variance",
                              "value": 335
                          },
                          {
                              "name": "where",
                              "value": 299
                          },
                          {
                              "name": "xor",
                              "value": 354
                          },
                          {
                              "name": "_",
                              "value": 264
                          }
                      ],
                      "name": "methods"
                  },
                  {
                      "name": "Minimum",
                      "value": 843
                  },
                  {
                      "name": "Not",
                      "value": 1554
                  },
                  {
                      "name": "Or",
                      "value": 970
                  },
                  {
                      "name": "Query",
                      "value": 13896
                  },
                  {
                      "name": "Range",
                      "value": 1594
                  },
                  {
                      "name": "StringUtil",
                      "value": 4130
                  },
                  {
                      "name": "Sum",
                      "value": 791
                  },
                  {
                      "name": "Variable",
                      "value": 1124
                  },
                  {
                      "name": "Variance",
                      "value": 1876
                  },
                  {
                      "name": "Xor",
                      "value": 1101
                  }
              ],
              "name": "query"
          },
          {
              "children": [
                  {
                      "name": "IScaleMap",
                      "value": 2105
                  },
                  {
                      "name": "LinearScale",
                      "value": 1316
                  },
                  {
                      "name": "LogScale",
                      "value": 3151
                  },
                  {
                      "name": "OrdinalScale",
                      "value": 3770
                  },
                  {
                      "name": "QuantileScale",
                      "value": 2435
                  },
                  {
                      "name": "QuantitativeScale",
                      "value": 4839
                  },
                  {
                      "name": "RootScale",
                      "value": 1756
                  },
                  {
                      "name": "Scale",
                      "value": 4268
                  },
                  {
                      "name": "ScaleType",
                      "value": 1821
                  },
                  {
                      "name": "TimeScale",
                      "value": 5833
                  }
              ],
              "name": "scale"
          },
          {
              "children": [
                  {
                      "name": "Arrays",
                      "value": 8258
                  },
                  {
                      "name": "Colors",
                      "value": 10001
                  },
                  {
                      "name": "Dates",
                      "value": 8217
                  },
                  {
                      "name": "Displays",
                      "value": 12555
                  },
                  {
                      "name": "Filter",
                      "value": 2324
                  },
                  {
                      "name": "Geometry",
                      "value": 10993
                  },
                  {
                      "children": [
                          {
                              "name": "FibonacciHeap",
                              "value": 9354
                          },
                          {
                              "name": "HeapNode",
                              "value": 1233
                          }
                      ],
                      "name": "heap"
                  },
                  {
                      "name": "IEvaluable",
                      "value": 335
                  },
                  {
                      "name": "IPredicate",
                      "value": 383
                  },
                  {
                      "name": "IValueProxy",
                      "value": 874
                  },
                  {
                      "children": [
                          {
                              "name": "DenseMatrix",
                              "value": 3165
                          },
                          {
                              "name": "IMatrix",
                              "value": 2815
                          },
                          {
                              "name": "SparseMatrix",
                              "value": 3366
                          }
                      ],
                      "name": "math"
                  },
                  {
                      "name": "Maths",
                      "value": 17705
                  },
                  {
                      "name": "Orientation",
                      "value": 1486
                  },
                  {
                      "children": [
                          {
                              "name": "ColorPalette",
                              "value": 6367
                          },
                          {
                              "name": "Palette",
                              "value": 1229
                          },
                          {
                              "name": "ShapePalette",
                              "value": 2059
                          },
                          {
                              "name": "SizePalette",
                              "value": 2291
                          }
                      ],
                      "name": "palette"
                  },
                  {
                      "name": "Property",
                      "value": 5559
                  },
                  {
                      "name": "Shapes",
                      "value": 19118
                  },
                  {
                      "name": "Sort",
                      "value": 6887
                  },
                  {
                      "name": "Stats",
                      "value": 6557
                  },
                  {
                      "name": "Strings",
                      "value": 22026
                  }
              ],
              "name": "util"
          },
          {
              "children": [
                  {
                      "children": [
                          {
                              "name": "Axes",
                              "value": 1302
                          },
                          {
                              "name": "Axis",
                              "value": 24593
                          },
                          {
                              "name": "AxisGridLine",
                              "value": 652
                          },
                          {
                              "name": "AxisLabel",
                              "value": 636
                          },
                          {
                              "name": "CartesianAxes",
                              "value": 6703
                          }
                      ],
                      "name": "axis"
                  },
                  {
                      "children": [
                          {
                              "name": "AnchorControl",
                              "value": 2138
                          },
                          {
                              "name": "ClickControl",
                              "value": 3824
                          },
                          {
                              "name": "Control",
                              "value": 1353
                          },
                          {
                              "name": "ControlList",
                              "value": 4665
                          },
                          {
                              "name": "DragControl",
                              "value": 2649
                          },
                          {
                              "name": "ExpandControl",
                              "value": 2832
                          },
                          {
                              "name": "HoverControl",
                              "value": 4896
                          },
                          {
                              "name": "IControl",
                              "value": 763
                          },
                          {
                              "name": "PanZoomControl",
                              "value": 5222
                          },
                          {
                              "name": "SelectionControl",
                              "value": 7862
                          },
                          {
                              "name": "TooltipControl",
                              "value": 8435
                          }
                      ],
                      "name": "controls"
                  },
                  {
                      "children": [
                          {
                              "name": "Data",
                              "value": 20544
                          },
                          {
                              "name": "DataList",
                              "value": 19788
                          },
                          {
                              "name": "DataSprite",
                              "value": 10349
                          },
                          {
                              "name": "EdgeSprite",
                              "value": 3301
                          },
                          {
                              "name": "NodeSprite",
                              "value": 19382
                          },
                          {
                              "children": [
                                  {
                                      "name": "ArrowType",
                                      "value": 698
                                  },
                                  {
                                      "name": "EdgeRenderer",
                                      "value": 5569
                                  },
                                  {
                                      "name": "IRenderer",
                                      "value": 353
                                  },
                                  {
                                      "name": "ShapeRenderer",
                                      "value": 2247
                                  }
                              ],
                              "name": "render"
                          },
                          {
                              "name": "ScaleBinding",
                              "value": 11275
                          },
                          {
                              "name": "Tree",
                              "value": 7147
                          },
                          {
                              "name": "TreeBuilder",
                              "value": 9930
                          }
                      ],
                      "name": "data"
                  },
                  {
                      "children": [
                          {
                              "name": "DataEvent",
                              "value": 2313
                          },
                          {
                              "name": "SelectionEvent",
                              "value": 1880
                          },
                          {
                              "name": "TooltipEvent",
                              "value": 1701
                          },
                          {
                              "name": "VisualizationEvent",
                              "value": 1117
                          }
                      ],
                      "name": "events"
                  },
                  {
                      "children": [
                          {
                              "name": "Legend",
                              "value": 20859
                          },
                          {
                              "name": "LegendItem",
                              "value": 4614
                          },
                          {
                              "name": "LegendRange",
                              "value": 10530
                          }
                      ],
                      "name": "legend"
                  },
                  {
                      "children": [
                          {
                              "children": [
                                  {
                                      "name": "BifocalDistortion",
                                      "value": 4461
                                  },
                                  {
                                      "name": "Distortion",
                                      "value": 6314
                                  },
                                  {
                                      "name": "FisheyeDistortion",
                                      "value": 3444
                                  }
                              ],
                              "name": "distortion"
                          },
                          {
                              "children": [
                                  {
                                      "name": "ColorEncoder",
                                      "value": 3179
                                  },
                                  {
                                      "name": "Encoder",
                                      "value": 4060
                                  },
                                  {
                                      "name": "PropertyEncoder",
                                      "value": 4138
                                  },
                                  {
                                      "name": "ShapeEncoder",
                                      "value": 1690
                                  },
                                  {
                                      "name": "SizeEncoder",
                                      "value": 1830
                                  }
                              ],
                              "name": "encoder"
                          },
                          {
                              "children": [
                                  {
                                      "name": "FisheyeTreeFilter",
                                      "value": 5219
                                  },
                                  {
                                      "name": "GraphDistanceFilter",
                                      "value": 3165
                                  },
                                  {
                                      "name": "VisibilityFilter",
                                      "value": 3509
                                  }
                              ],
                              "name": "filter"
                          },
                          {
                              "name": "IOperator",
                              "value": 1286
                          },
                          {
                              "children": [
                                  {
                                      "name": "Labeler",
                                      "value": 9956
                                  },
                                  {
                                      "name": "RadialLabeler",
                                      "value": 3899
                                  },
                                  {
                                      "name": "StackedAreaLabeler",
                                      "value": 3202
                                  }
                              ],
                              "name": "label"
                          },
                          {
                              "children": [
                                  {
                                      "name": "AxisLayout",
                                      "value": 6725
                                  },
                                  {
                                      "name": "BundledEdgeRouter",
                                      "value": 3727
                                  },
                                  {
                                      "name": "CircleLayout",
                                      "value": 9317
                                  },
                                  {
                                      "name": "CirclePackingLayout",
                                      "value": 12003
                                  },
                                  {
                                      "name": "DendrogramLayout",
                                      "value": 4853
                                  },
                                  {
                                      "name": "ForceDirectedLayout",
                                      "value": 8411
                                  },
                                  {
                                      "name": "IcicleTreeLayout",
                                      "value": 4864
                                  },
                                  {
                                      "name": "IndentedTreeLayout",
                                      "value": 3174
                                  },
                                  {
                                      "name": "Layout",
                                      "value": 7881
                                  },
                                  {
                                      "name": "NodeLinkTreeLayout",
                                      "value": 12870
                                  },
                                  {
                                      "name": "PieLayout",
                                      "value": 2728
                                  },
                                  {
                                      "name": "RadialTreeLayout",
                                      "value": 12348
                                  },
                                  {
                                      "name": "RandomLayout",
                                      "value": 870
                                  },
                                  {
                                      "name": "StackedAreaLayout",
                                      "value": 9121
                                  },
                                  {
                                      "name": "TreeMapLayout",
                                      "value": 9191
                                  }
                              ],
                              "name": "layout"
                          },
                          {
                              "name": "Operator",
                              "value": 2490
                          },
                          {
                              "name": "OperatorList",
                              "value": 5248
                          },
                          {
                              "name": "OperatorSequence",
                              "value": 4190
                          },
                          {
                              "name": "OperatorSwitch",
                              "value": 2581
                          },
                          {
                              "name": "SortOperator",
                              "value": 2023
                          }
                      ],
                      "name": "operator"
                  },
                  {
                      "name": "Visualization",
                      "value": 16540
                  }
              ],
              "name": "vis"
          }
      ],
      "name": "flare"
  };
  debugger;
    const data = {
      children: [ ...glyphs.current, ...snaps.current, ...dicts.current, ...minders.current, collections.current ],
      name: "Collected Things!"
    }
    const root = pack( data );
    // Create the SVG container.
    const urlCreator = window.URL || window.webkitURL;
    const svg = d3.create("svg")
        .attr("viewBox", `-${width} -${height} ${width * 2} ${height * 2}`)
        .attr("width", width)
        .attr("height", height);

        // Append the nodes.
      const nodes = svg.append("g");
      const node = nodes.selectAll("circle")
        .data(root)
        .join("circle")
          .attr("fill", ( d ) => color( d.depth ) )
          .attr("pointer-events", d => !d.children ? null : null)
          .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
          .on("mouseout", function() { d3.select(this).attr("stroke", null); })
          .on("click", (event, d) => focus !== d && (clickZoom(event, d), event.stopPropagation()))
            .append("svg:image")
            .attr("xlink:href", ( d ) => {
              if( d.data.blob && d.data.blob.type ){
                const url = urlCreator.createObjectURL( d.data.blob );
                object_urls.current.push( url );
                return url;
              }});


      // Append the text labels.
      const labels = svg.append("g");
      const label = labels.attr("class", "pip_title")
          .attr("pointer-events", "none")
          .attr("text-anchor", "middle")
        .selectAll("text")
        .data(root.descendants())
        .join("text")
          .style("fill-opacity", d => d.parent === root ? 1 : 0)
          .style("display", d => d.parent === root ? "inline" : "none")
          .text(d => d.data.name);

      // Create the zoom behavior and zoom immediately in to the initial focus node.
      svg.on("click", (event) => clickZoom(event, root));
      body.current.appendChild( svg.node() );

      let focus = root;
      let view;
      let k;
      zoomTo([focus.x, focus.y, focus.r]);

      function zoomTo(v) {
        k = height / v[2];

        view = v;

        label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("r", d => d.r * k);
      }
      function clickZoom(event, d) {
        const focus0 = focus;

        focus = d;

        const transition = svg.transition()
            .duration(event.altKey ? 1500 : 750)
            .tween("zoom", d => {
              const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r]);
              return t => zoomTo(i(t));
            });

        label
          .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
          .transition(transition)
            .style("fill-opacity", d => d.parent === focus ? 1 : 0)
            .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
            .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
      }

      const zoom = d3.zoom()
      .scaleExtent([1, 40])
      .on("zoom", zoomed);
      nodes.call(zoom);
      function zoomed({transform}) {
        nodes.attr("transform", transform);
        labels.attr("transform", transform);
      }
  }

  function resize( event ){

    circlePacking();
  }

  return(<>
    <style>{`


      `}</style>
    <div ref={panel} id="collections_panel" className="pip_gui pip_menu">
      <div className="head">
        <h1 className="pip_title">Collected Things</h1>
      </div>
      <div ref={body} className="body">
      </div>
      <div className="controls">
        <button className="pip_cancel" onClick={props.toggleCollections}>Exit</button>

      </div>
    </div>
  </>);
}
function DiscussionsPanel( props ){
  const screenplay =  props.screenplay;
  const discussions_panel = useRef();
  const body = useRef();

  return(<>
    <style>{`




      `}</style>
    <div ref={discussions_panel} id="discussions_panel" className="pip_gui pip_menu">
      <div className="head">
        <h1 className="pip_title">News & Discussions</h1>
      </div>
      <div ref={body} className="body">
      </div>
      <div className="controls">
        <button className="pip_cancel" onClick={props.toggleDiscussions}>Exit</button>

      </div>
    </div>
  </>);
}
function EventsPanel( props ){
  const screenplay =  props.screenplay;
  const events_panel = useRef();
  const body = useRef();

  return(<>
    <style>{`




      `}</style>
    <div ref={events_panel} id="events_panel" className="pip_gui pip_menu">
      <div className="head">
        <h1 className="pip_title">What's Going On?</h1>
      </div>
      <div ref={body} className="body">
      </div>
      <div className="controls">
        <button className="pip_cancel" onClick={props.toggleEvents}>Exit</button>

      </div>
    </div>
  </>);
}
function ClassifiedsPanel( props ){
  const screenplay =  props.screenplay;
  const classifieds_panel = useRef();
  const body = useRef();

  return(<>
    <style>{`




      `}</style>
    <div ref={classifieds_panel} id="classifieds_panel" className="pip_gui pip_menu">
      <div className="head">
        <h1 className="pip_title">Community Classifieds</h1>
      </div>
      <div ref={body} className="body">
      </div>
      <div className="controls">
        <button className="pip_cancel" onClick={props.toggleClassifieds}>Exit</button>

      </div>
    </div>
  </>);
}
function TickerPanel( props ){
  const screenplay =  props.screenplay;
  const ticker_panel = useRef();
  const body = useRef();

  return(<>
    <style>{`




      `}</style>
    <div ref={ticker_panel} id="ticker_panel" className="pip_gui pip_menu">
      <div className="head">
        <h1 className="pip_title">Heads up Notifications</h1>
      </div>
      <div ref={body} className="body">
      </div>
      <div className="controls">
        <button className="pip_cancel" onClick={props.toggleTicker}>Exit</button>

      </div>
    </div>
  </>);
}
function ArchitectPanel( props ){
  const screenplay =  props.screenplay;
  const architect_panel = useRef();
  const body = useRef();

  function cleanup(){
    screenplay.lil_gui.hide();
  }
  useEffect(()=>{
    if( !screenplay.lil_gui ){
      let screenplay = props.screenplay;
      let sys_ve_scene = screenplay.sys_ve_scene;
      let sys_ui_scene = screenplay.sys_ui_scene;
      let page_ve_scene = screenplay.page_ve_scene;
      let page_ui_scene = screenplay.page_ui_scene;
      let gui = screenplay.lil_gui = new GUI( { title: 'Architect Interface', container: body.current });

      gui.camera_controls = gui.addFolder( 'Camera Controls' );
      gui.camera_controls.add( screenplay, 'fps' ).name('Frames / Second').onChange(()=>{
        screenplay.interval = 1 / screenplay.fps;
      });
      let cameras = screenplay.cameras;
      cameras.forEach( function( cam, name ){
        let ctrl = {};
        ctrl[name] = function(){
          props.toggleArchitect();
          screenplay.actions.change_cam( `${name}` )
        };
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
        cam_settings.open( false );
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
      ui_cam_settings.open( false );

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
          props.toggleArchitect();
          screenplay.actions.warp_to(screenplay.actors.Neptune);
        },
        Uranus: function() {
          props.toggleArchitect();
          screenplay.actions.warp_to(screenplay.actors.Uranus);
        },
        Saturn: function() {
          props.toggleArchitect();
          screenplay.actions.warp_to(screenplay.actors.Saturn);
        },
        Jupiter: function() {
          props.toggleArchitect();
          screenplay.actions.warp_to(screenplay.actors.Jupiter);
        },
        Mars: function() {
          props.toggleArchitect();
          screenplay.actions.warp_to(screenplay.actors.Mars);
        },
        Earth: function() {
          props.toggleArchitect();
          screenplay.actions.warp_to(screenplay.actors.Earth);
        },
        Moon: function() {
          props.toggleArchitect();
          screenplay.actions.warp_to(screenplay.actors.Moon);
        },
        Venus: function() {
          props.toggleArchitect();
          screenplay.actions.warp_to(screenplay.actors.Venus);
        },
        Mercury: function() {
          props.toggleArchitect();
          screenplay.actions.warp_to(screenplay.actors.Mercury);
        },
        Sun: function() {
          props.toggleArchitect();
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
          props.toggleArchitect();
          let earth = screenplay.actors.Earth;
          let landing_coords = new THREE.Vector3().setFromSphericalCoords( earth.surface_distance, 1, 1 ).add( earth.position );
          screenplay.actions.land_at( landing_coords );
        },
        GeoOrbit: function() {
          props.toggleArchitect();
          let earth = screenplay.actors.Earth;
          let arrival_coords = new THREE.Vector3().setFromSphericalCoords( earth.orbital_distance, 1, 1 ).add( earth.position );
          screenplay.actions.impulse_to( arrival_coords );
        },
        SpaceStation: function() {
          props.toggleArchitect();
          screenplay.actions.warp_to(screenplay.props.HomeDome);
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
        folder.open( false );
      }

      let addGroup = async ( folder, group )=>{

        base_props( folder, group );

        for( const child of group.children ){
          switch( child.type ){
            case 'Group':
            case 'Object3D':
              let group_folder = folder.addFolder( child.name );
              group_folder.open( false );
              addGroup( group_folder, child );
              break;

            case 'Mesh':
              let mesh_folder = folder.addFolder( child.name );
              mesh_folder.open( false );
              addMesh( mesh_folder, child );
              break;

            case 'DirectionalLight':
              let dlight_folder = folder.addFolder( 'Directional Light' );
              dlight_folder.open( false );
              addDirectionalLight( dlight_folder, child );
              break;

            case 'AmbientLight':
              let amblight_folder = folder.addFolder( 'Ambient Light' );
              amblight_folder.open( false );
              addAmbientLight( amblight_folder, child );
              break;

            case 'SpotLight':
              let slight_folder = folder.addFolder( 'Spot Light' );
              slight_folder.open( false );
              addSpotLight( slight_folder, child );
              break;

            case 'PointLight':
              let plight_folder = folder.addFolder( 'Point Light' );
              plight_folder.open( false );
              addPointLight( plight_folder, child );
              break;

            default:
              let default_folder = folder.addFolder( child.type );
              default_folder.open( false );
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
        model_folder.open( false );
      }
      modeling_folder.open( false );

      body.current.append( screenplay.lil_gui.domElement );
    }
    if( screenplay.lil_gui ) {
      body.current.append( screenplay.lil_gui.domElement );
      screenplay.lil_gui.show();
    }
    return cleanup;
  }, [])
  return(<>
    <style>{`




      `}</style>
    <div ref={architect_panel} id="architect_panel" className="pip_gui pip_menu">
      <div className="head">
        <h1 className="pip_title">Architect's Panel</h1>
      </div>
      <div ref={body} className="body">
      </div>
      <div className="controls">
        <button className="pip_cancel" onClick={props.toggleArchitect}>Exit</button>

      </div>
    </div>
  </>);
}
function InformationPanel( props ){
  const screenplay =  props.screenplay;
  const showInformation = props.onDisplay
  const [classNames, setClassNames] = useState( 'pip_gui pip_menu hidden' );
  const information_panel = useRef();
  const body = useRef();

  useEffect(()=>{
    showInformation ?
      setClassNames('pip_gui pip_menu') :
      setClassNames('pip_gui pip_menu hidden')

  }, [showInformation]);

  return(<>
    <style>{`

      .body{
        display: grid;
      }

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
      <div className="head">
        <h1 className="pip_title">Info About WeThe</h1>
      </div>
      <div ref={body} className="body">
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
        <a target="_blank" href="https://icons8.com/icon/42355/tick-box">Tick Box</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a><br />
        <a target="_blank" href="https://skfb.ly/oDnoC">"Diner BO2-Zombies inspired" by JoSaCo</a> is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).<br/>
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
      </div>
      <div className="controls">
        <button className="pip_cancel" onClick={props.toggleInformation}>Exit</button>

      </div>
    </div>
  </>);
}
// WeThe Starship
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

// Class Definitions
class Glyph{
  id;
  stc;
  code;
  blob;
  results;

  constructor( t = false, loc = false, code, blob, results ){
    this.id = crypto.randomUUID();
    this.stc = {
      t: ( t ) ? t : Date.now(),
      loc: ( loc ) ? loc : ( navigator.geolocation ) ? navigator.geolocation.getCurrentPosition( pos => this.stc.loc = pos ) : false
    }
    this.code = code;
    this.blob = blob;
    this.results = results;
  }
}
class Snap{
  id;
  stc;
  blob;

  constructor( t = false, loc = false, blob ){
    this.id = crypto.randomUUID();
    this.stc = {
      t: ( t ) ? t : Date.now(),
      loc: ( loc ) ? loc : ( navigator.geolocation ) ? navigator.geolocation.getCurrentPosition( pos => this.stc.loc = pos ) : false
    }
    this.blob = blob;
  }
}
class Dict{
  id;
  stc;
  blob;

  constructor( t = false, loc = false, blob ){
    this.id = crypto.randomUUID();
    this.stc = {
      t: ( t ) ? t : Date.now(),
      loc: ( loc ) ? loc : ( navigator.geolocation ) ? navigator.geolocation.getCurrentPosition( pos => this.stc.loc = pos ) : false
    }
    this.blob = blob;
  }
}
class Minder{
  id;
  stc;
  title;
  icon;
  notified;

  constructor( t = false, loc = false, title, icon ){
    this.id = crypto.randomUUID();
    this.stc = {
      t: ( t ) ? t : Date.now(),
      loc: ( loc ) ? loc : ( navigator.geolocation ) ? navigator.geolocation.getCurrentPosition( pos => this.stc.loc = pos ) : false
    };
    this.title = title;
    this.icon = icon;
    this.notified = false;
  }
}
class Collection{
  id;
  stc;
  icon;
  children;

  constructor( t = false, loc = false, icon ){
    this.id = crypto.randomUUID();
    this.stc = {
      t: ( t ) ? t : Date.now(),
      loc: ( loc ) ? loc : ( navigator.geolocation ) ? navigator.geolocation.getCurrentPosition( pos => this.stc.loc = pos ) : false
    }
    this.icon = icon;
    this.children = [];
    this.links = [];
  }
}

class ContentMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  componentDidMount() {
    // Add event listener for right-click context menu
    document.addEventListener('contextmenu', this.handleContextMenu);
    // Add event listener for touch and hold on touch devices
    document.addEventListener('touchstart', this.handleTouchStart);
    document.addEventListener('touchend', this.handleTouchEnd);
  }

  componentWillUnmount() {
    // Remove event listeners when component unmounts
    document.removeEventListener('contextmenu', this.handleContextMenu);
    document.removeEventListener('touchstart', this.handleTouchStart);
    document.removeEventListener('touchend', this.handleTouchEnd);
  }

  handleContextMenu(event) {
    event.preventDefault();
    // Check if right-clicked on the object
    const { object } = this.props;
    const menuOptions = this.getMenuOptions(object);
    if (menuOptions.length > 0) {
      this.setState({ isOpen: true });
      // Calculate and set position of the menu based on mouse coordinates
      this.setPosition(event.clientX, event.clientY);
    }
  }

  handleTouchStart(event) {
    // Start a timer when touch starts
    this.touchStartTime = new Date().getTime();
  }

  handleTouchEnd(event) {
    // Calculate touch duration
    const touchEndTime = new Date().getTime();
    const touchDuration = touchEndTime - this.touchStartTime;
    // Open menu if touch duration exceeds a certain threshold (e.g., 500ms)
    if (touchDuration > 500) {
      event.preventDefault();
      const { object } = this.props;
      const menuOptions = this.getMenuOptions(object);
      if (menuOptions.length > 0) {
        this.setState({ isOpen: true });
        // Calculate and set position of the menu based on touch coordinates
        const touch = event.changedTouches[0];
        this.setPosition(touch.clientX, touch.clientY);
      }
    }
  }

  getMenuOptions(object) {
    const menuOptions = [];
    // Define all menu options and their corresponding flags
    const options = [
      { flag: 'isUser', label: 'Contact' },
      { flag: 'isOrganization', label: 'Contact' },
      { flag: 'isUser', label: 'View Profile' },
      { flag: 'isOrganization', label: 'View Profile' },
      { flag: 'isUser', label: 'Interact' },
      { flag: 'isOrganization', label: 'Interact' },
      { flag: 'isUser', label: 'Report/Block' },
      { flag: 'isOrganization', label: 'Report/Block' },
      // Add more menu options here as needed
    ];

    // Check flags and add corresponding menu options
    options.forEach(option => {
      if (object[option.flag]) {
        menuOptions.push(option.label);
      }
    });

    return menuOptions;
  }

  setPosition(x, y) {
    // Set position of the menu
    // Here, you would set the state for menu position based on x and y coordinates
    // This could involve CSS styling to position the menu
  }

  closeMenu() {
    // Close the menu
    this.setState({ isOpen: false });
  }

  render() {
    const { isOpen } = this.state;
    const { object } = this.props;
    const menuOptions = this.getMenuOptions(object);

    return isOpen && menuOptions.length > 0 ? (
      <div className="content-menu" onBlur={this.closeMenu}>
        {menuOptions.map((option, index) => (
          <MenuItem key={index}>{option}</MenuItem>
        ))}
      </div>
    ) : null;
  }
}


// SubRoutines
async function OpenIndexedDBRequest( name, version, onError, onSuccess ){
  let dbReq = await window.indexedDB.open( name, version );
  await dbReq;
  let db;
  dbReq.onerror = onError;
  dbReq.onsuccess = onSuccess;
  dbReq.onupgradeneeded = (event) => {
    db = event.target.result;
    db.onerror = onError;
    // Define the schemas here so that there is one location to update.
    switch( name ){
      case "GlyphScanner":
          let gsObjectStore = db.createObjectStore('GlyphScanner', { keyPath: 'id' });
          gsObjectStore.createIndex('stc', 'stc', { unique: false });
          gsObjectStore.createIndex('code', 'code', { unique: false });
          gsObjectStore.createIndex('blob', 'blob', { unique: false });
          gsObjectStore.createIndex('results', 'results', { unique: false });

        break;
      case "SnapPix":
          let spObjectStore = db.createObjectStore('SnapPix', { keyPath: 'id' });
          spObjectStore.createIndex('stc', 'stc', { unique: false });
          spObjectStore.createIndex('blob', 'blob', { unique: false });
        break;
      case "RecordNote":
          let rnObjectStore = db.createObjectStore('RecordNote', { keyPath: 'id' });
          rnObjectStore.createIndex('stc', 'stc', { unique: false });
          rnObjectStore.createIndex('blob', 'blob', { unique: false });
        break;
      case "RemindMe":
          let rmObjectStore = db.createObjectStore('RemindMe', { keyPath: 'id' });
          rmObjectStore.createIndex('stc', 'stc', { unique: false });
          rmObjectStore.createIndex('title', 'title', { unique: false });
          rmObjectStore.createIndex('icon', 'icon', { unique: false });
          rmObjectStore.createIndex('notified', 'notified', { unique: false });
        break;
      case "Collections":
          let coObjectStore = db.createObjectStore('Collections', { keyPath: 'id' });
          coObjectStore.createIndex('stc', 'stc', { unique: false });
          coObjectStore.createIndex('icon', 'icon', { unique: false });
          coObjectStore.createIndex('children', 'children', { unique: false });
        break;
      default:
        alert( "No DB schema setup for the " + name + " db");
    }
    onSuccess( event );
  };

}
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
