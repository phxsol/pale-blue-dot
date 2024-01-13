import { AudioEngineWoker } from '../imp/workers/AudioEngine.ts';
import React from 'react';
import { useState, useEffect, useRef } from 'react';
// Support Library Reference
import * as THREE from 'three';
import * as d3 from "d3";
import { WebVoiceProcessor } from '@picovoice/web-voice-processor';
import GUI from 'lil-gui';
import jsQR from "jsqr";
import QRCode from 'qrcode';
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
  const [screenplay, setScreenplay] = useState( props.screenplay );
  const [activePipGUID, setActivePipGUID] = useState( 0 );
  const [mode, setMode] = useState( props.mode );
  const [backto, setBackto] = useState( false );

  function GlyphScanner( props ){
    const panel = useRef();

    const [outputMessage, setOutputMessage] = useState();
    const [initialized, setInitialized] = useState( false );
    const processing = useRef( false );
    const stop = useRef( false );
    const [code_found, setCodeFound] = useState( false );
    const stream = useRef( false );
    const video = useRef();
    const canvas = useRef();
    const context = useRef();
    const output = useRef();
    const outputData = useRef();
    const scanButton = useRef();
    const screenplay = props.screenplay;

    function drawLine(begin, end, color) {
      context.current.beginPath();
      context.current.moveTo(begin.x, begin.y);
      context.current.lineTo(end.x, end.y);
      context.current.lineWidth = 4;
      context.current.strokeStyle = color;
      context.current.stroke();
    }

    // TODO: Force a much lower FPS rate for this update function... ~ 6fps.
    function update() {

      if ( video.current && video.current.readyState === video.current.HAVE_ENOUGH_DATA ) {
        if( !processing.current && !code_found ){
          processing.current = true;
          canvas.current.height = video.current.videoHeight;
          canvas.current.width = video.current.videoWidth;
          context.current.drawImage(video.current, 0, 0, canvas.current.width, canvas.current.height);
          let imageData = context.current.getImageData(0, 0, canvas.current.width, canvas.current.height);

          let code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });
          if (code) {
            drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
            drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
            drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
            drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
            setCodeFound( true );
            setOutputMessage( code.data );
            processCode( code );
          }
          processing.current = false;
        }
      }
      if( !stop.current && !processing.current && !code_found && video.current ) requestAnimationFrame(update);
    }

    function toggleScanner( event ){
      event.stopPropagation();
      code_found || !initialized ? initializeComponent() : deInitComponent();

    }

    function closeScanner( event ){
      deInitComponent();
    }

    async function processCode( code ){

      deInitComponent();
    }

    async function deInitComponent(){
      stop.current = true;
      // Stop the video stream, but keep it spooled up while the component is live.
      if( video.current ) {
        video.current.pause();
        delete video.current.srcObject;
      }
      stream.current.getTracks().forEach(function(track) {
        track.stop();
      });
      stream.current = false;
      setInitialized( false );
    }

    async function initializeComponent(){
      // Use facingMode: environment to attemt to get the front camera on phones
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(_stream) {
        stream.current = _stream;
        video.current.srcObject = stream.current;
        video.current.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
        video.current.play();
        context.current = canvas.current.getContext("2d");
        setCodeFound( false );
        setInitialized( true );
        setOutputMessage( "⌛ Scanning video..." );
        requestAnimationFrame(update);
      });
    }

    useEffect(()=>{
      if(!initialized){
        initializeComponent();
      }

      return cleanup;
    },[]);

    function cleanup(){
      deInitComponent();
    }

    return(
      <>
        <style>{`
        #GlyphScanner {

        }

        h1 {
          font-size: 3rem;
          grid-row: 1;
          grid-column: 1 / -1;
          text-align: right;
          margin-bottom: 0;
        }

        .loadingMessage {
          text-align: center;
          padding: 40px;
          background-color: #eee;
        }

        .video{
          display: none;
        }

        .canvas {
          grid-row: 2 / 5;
          grid-column: 1 / -1;
        }

        .output {
          grid-row: 5;
          background: #33333333;
          padding: 10px;
          padding-bottom: 0;
        }

        .output div {
          padding-bottom: 10px;
          word-wrap: break-word;
        }

        #noQRFound {
          text-align: center;
        }
        `}</style>
        <div id="GlyphScanner" ref={panel} className="pip_gui pip_post" position="0" >
          <h1>Glyph Scanner</h1>
          <video ref={video} className="video"></video>
          <canvas className="canvas" ref={canvas} ></canvas>
          <div className="output">
            {outputMessage}
          </div>
          <button ref={scanButton} name="start_scanner" className="" type="button" onClick={toggleScanner}>{!code_found && initialized ? 'Stop' : 'Scan'}</button>
          <button name="exit_scanner" className="" type="button" onClick={closeScanner}>Exit</button>
        </div>
      </>
    )
    }
  function ShareContact( props ) {
    const panel = useRef();

    useEffect( ()=>{
      return cleanup;
    }, []);

    function handleAckClick( event ){
      event.stopPropagation();
    }

    function cleanup(){

    }

    return(
        <div id="ShareContact" ref={panel} className="pip_gui pip_post">
          <button name="ack_ShareContact" className="pip_accept" type="button" onClick={props.toggle}>OK</button>
        </div>
    )
  }
  function DropPin( props ) {
    const [onDisplay, setOnDisplay] = useState(false);
    const panel = useRef();

    function cleanup(){}
    useEffect( ()=>{

      // Declare the chart dimensions and margins.
      const width = 928;
      const height = 720;
      const marginTop = 20;
      const marginRight = 30;
      const marginBottom = 30;
      const marginLeft = 40;

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

      const svg = d3.create("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [0, 0, width, height])
          .attr("style", "max-width: 100%; height: auto;");

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
            .text("Cost per gallon"));

      svg.append("path")
          .datum(driving)
          .attr("fill", "none")
          .attr("stroke", "black")
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
            .attr("stroke", "white")
            .attr("paint-order", "stroke")
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


      return cleanup();

    }, []);

    function handleAckClick( event ){
      event.stopPropagation();

    }
    return(
      <>
      <div id="DropPin" ref={panel} className="pip_gui pip_post" >

        <div ref={timeline}></div>
        <div ref={map}></div>


        <input name="exit_DropPin" className="pip_cancel" type="button" onClick={props.toggle} value="Exit" />
      </div>
      </>
    )
  }
  function SnapPix( props ) {
    const [onDisplay, setOnDisplay] = useState(false);
    const panel = useRef();

    useEffect( ()=>{
      if( onDisplay ) document.getElementById('root').appendChild( panel.current );
    }, [onDisplay]);

    function handleAckClick( event ){
      event.stopPropagation();
      if( onDisplay ) document.getElementById('WeTheMenu').appendChild( panel.current )
      setOnDisplay(!onDisplay);
    }
    return(
      <>
      <div id="SnapPix" ref={panel} className="pip_gui pip_post">

        <button name="ack_SnapPix" className="pip_accept" type="button" onClick={props.toggle}>OK</button>
      </div>
      </>
    )
  }
  function RecordNote( props ) {
    const [worker, setWorker] = useState(false);
    const [engine, setEngine] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const panel = useRef();

    async function cleanup(){
      await WebVoiceProcessor.unsubscribe([engine, worker]);
    };
    useEffect( ()=>{
      setWorker( new Worker('../lib/workers/AudioEngine.js') );
      setEngine( {
        onmessage: function(e) {
          /// ... handle inputFrame
        }
      });
      setInitialized( true );

      return cleanup();
    }, []);

    useEffect( async ()=>{
      if (initialized){
        await WebVoiceProcessor.subscribe([engine, worker]);
      }
    }, [initialized]);

    function startRecording( event ){
      event.stopPropagation();
    }

    return(
      <>
      <div id="RecordNote" ref={panel} className="pip_gui pip_post">

        <input name="start_recording" className="pip_accept" type="button" onClick={startRecording} value="Start" />
        <input name="exit_RecordNote" className="pip_cancel" type="button" onClick={props.toggle} value="Exit" />
      </div>
      </>
    )
  }
  function RemindMe( props ) {
      const [initialized, setInitialized] = useState( false );
      const db = useRef(false);
      const DBOpenRequest = useRef( false );
      const objectStore = useRef( false );

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
          //it is only implemented in recent browsers
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
        debugger;
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
        debugger;
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
        debugger;
        try {
          Notification.requestPermission().then();
        } catch(e) {
          return false;
        }

        return true;
      };

      function cleanup(){
        alert( 'cleaning up Remind Me!');
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
            debugger;
            displayData();
          };
        };
      };

      function deleteItem(event) {
        debugger;
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
        debugger;
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
        debugger;
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
            font-size: 6rem;
            margin: 0;
            background: #d66;
          }

          #RemindMe h2 {
            font-size: 2.4rem;
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
            font-size: 1.3rem;
            border-radius: 5px;
            border: 1px solid black;
            color: black;
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
            padding: 0.3rem;
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
            padding: 1rem;
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
            padding-right: 1rem;
            font-size: 1.6rem;
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
            padding: 1rem;
            margin: 2rem auto;
            font-size: 1.8rem;
          }

          #RemindMe .task-box ul {
            margin: 0;
            padding: 0;
          }

          #RemindMe .task-box li {
            list-style-type: none;
            padding: 1rem;
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
            font-size: 1.6rem;
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
              padding-left: 1rem;
            }

            #RemindMe form input,
            #RemindMe form select,
            #RemindMe form label {
              line-height: 2.5rem;
              font-size: 2rem;
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
  function QuickComms( props ) {
    const panel = useRef();

    useEffect( ()=>{

      return cleanup;
    }, []);

    function handleAckClick( event ){
      event.stopPropagation();
    }

    function cleanup(){

    }

    return(
      <div id="OpenQuickComms" ref={panel}  className="pip_gui pip_post">
        <button name="ack_OpenQuickComms" className="pip_accept" type="button" onClick={props.toggle}>OK</button>
      </div>
    );
  }

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
  function toggleQuickComms( event ) {
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
        grid-row: 4 / -1;
        grid-column: 1 / 3;
        margin-right: 2rem;
        margin-left: 2rem;
        z-index: 2;
        position: absolute;
      }
      #WeTheMenu::before {
        content: '';
        width: 100%;
        height: 100%;
        filter: blur(1.25em);
        position: absolute;
        background: radial-gradient( #63000077, black, #00003677);
      }
      #WeTheMenu.collapsed{
        background: linear-gradient( 11deg, #63000077, black, #00003677);
        height: 19em;
        width: 19em;
        bottom: 0;
        margin-bottom: -6em;
        transform: rotateX(72deg) rotateY(4deg) rotateZ( 4deg );
        cursor: pointer;
        border-radius: 50%;
        border: outset 3px;
        contain: content;
      }
      #WeTheMenu.open{
        border: none;
        width: 38em;
        height: 38em;
        border-radius: 50%;
        position: absolute;
        bottom: 0;
        left: 0;
      }

      .menu_title{
        height: 100%;
        width: 100%;
        cursor: pointer;
        text-align: center;
        position: absolute;
        display: grid;
        position: relative;
      }
      .collapsed > .menu_title{
        margin: auto;
      }
      .open > .menu_title{
        margin: 0;
      }

      .menu_title .menu_label{
        color: goldenrod;
        font-size: 3rem;
        position: absolute;
        bottom: 100%;
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
        color: #DDD;
        z-index: 7;
      }
      .collapsed > .menu_choice{
        pointer-events: none;
        display: none;
      }
      .open > .menu_choice{

      }
      .menu_choice[data-position="0"]{
        height: 32%; width: 32%;
        border-color: #9400D3;
        left: 34%; top: 34%;
      }
      .menu_choice[data-position="0"]:hover{
        background: linear-gradient( 135deg, #a23745, #9400D3, #552B72);
      }
      .menu_choice[data-position="1"]{
        height: 29%; width: 29%;
        border-color: #552B72;
        left: 2%; top: 22%;
      }
      .menu_choice[data-position="1"]:hover{
        background: linear-gradient( 135deg, #9400D3, #552B72, #313C74);
      }
      .menu_choice[data-position="2"]{
        height: 27.5%; width: 27.5%;
        border-color: #313C74;
        left: 31%; top: 1%;
      }
      .menu_choice[data-position="2"]:hover{
        background: linear-gradient( 180deg, #552B72, #313C74, #265B6A);
      }
      .menu_choice[data-position="3"]{
        height: 24%; width: 24%;
        border-color: #265B6A;
        left: 63%; top: 14%;
      }
      .menu_choice[data-position="3"]:hover{
        background: linear-gradient( 225deg, #313C74, #265B6A, #2E882E);
      }
      .menu_choice[data-position="4"]{
        height: 21%; width: 21%;
        border-color: #2E882E;
        left: 70%; top: 45%;
      }
      .menu_choice[data-position="4"]:hover{
        background: linear-gradient( 305deg, #aaa339, #2E882E, #265B6A);
      }
      .menu_choice[data-position="5"]{
        height: 17%; width: 17%;
        border-color: #aaa339;
        left: 55%; top: 69%;
      }
      .menu_choice[data-position="5"]:hover{
        background: linear-gradient( 325deg, #aa7a39, #aaa339, #2E882E);
      }
      .menu_choice[data-position="6"]{
        height: 14%; width: 14%;
        border-color: #aa7a39;
        left: 34%; top: 75%;
      }
      .menu_choice[data-position="6"]:hover{
        background: linear-gradient( 5deg, #a23745, #aa7a39, #aaa339);
      }
      .menu_choice[data-position="7"]{
        height: 11%; width: 11%;
        border-color: #a23745;
        left: 21%; top: 60%;
      }
      .menu_choice[data-position="7"]:hover{
        background: linear-gradient( 45deg, #9400D3, #a23745, #aa7a39);
      }

      .menu_choice:hover label{
        opacity: 1;
      }
      .menu_choice label{
        font-size: 1.5rem;
        position: absolute;
        opacity: 0;
        bottom: 100%;
        transition: all .2s;
      }

    `}</style>
    <div id="WeTheMenu" ref={panel} className={props.mode} >
      <div className="menu_title" onClick={toggleMenu}>
        <label htmlFor="OpenWeTheMenu" className="menu_label">System Menu</label>
        <input type="image" src=".\both_wethebrand.png" name="OpenWeTheMenu" className="menu_icon" />
      </div>
      <div className="menu_choice" data-position={1} onClick={toggleGlyphScanner} >
        <label htmlFor="OpenGlyphScanner">Scan a Glyph</label>
        <input type="image" src=".\both_glyphscanner.png" name="OpenGlyphScanner" />
      </div>
      <div className="menu_choice" data-position={2} onClick={toggleShareContact} >
        <input type="image" src=".\both_atme_safe.png" name="OpenShareContact" />
        <label htmlFor="OpenShareContact">Share Contact</label>
      </div>
      <div className="menu_choice" data-position={3} onClick={toggleDropPin} >
        <label htmlFor="OpenDropPin">Drop-A-Pin</label>
        <input type="image" src=".\dark_pindrop.png" name="OpenDropPin" />
      </div>
      <div className="menu_choice" data-position={4} onClick={toggleSnapPix} >
        <label htmlFor="OpenSnapPix">Snap Pix</label>
        <input type="image" src=".\both_camera.png" name="OpenSnapPix"/>
      </div>
      <div className="menu_choice" data-position={5} onClick={toggleRecordNote} >
        <label htmlFor="OpenRecordNote">Record Audio</label>
        <input type="image" src=".\both_mic.png" name="OpenRecordNote"/>
      </div>
      <div className="menu_choice" data-position={6} onClick={toggleRemindMe} >
        <input type="image" src=".\both_stickynote.png" name="OpenRemindMe" />
        <label htmlFor="OpenRemindMe">Remind Me!</label>
      </div>
      <div className="menu_choice" data-position={7} onClick={toggleQuickComms} >
        <label htmlFor="OpenQuickComms">Quick Comms</label>
        <input type="image" src=".\both_comms.png" name="OpenQuickComms" />
      </div>
    </div>
    {activePipGUID === 1 ? <GlyphScanner toggle={toggleGlyphScanner} /> : <></>}
    {activePipGUID === 2 ? <ShareContact toggle={toggleShareContact} /> : <></>}
    {activePipGUID === 3 ? <DropPin toggle={toggleDropPin} /> : <></>}
    {activePipGUID === 4 ? <SnapPix toggle={toggleSnapPix} /> : <></>}
    {activePipGUID === 5 ? <RecordNote toggle={toggleRecordNote} /> : <></>}
    {activePipGUID === 6 ? <RemindMe toggle={toggleRemindMe} /> : <></>}
    {activePipGUID === 7 ? <QuickComms toggle={toggleQuickComms} /> : <></>}
  </>);
}
function WeTheHeader( props ){
  const screenplay = useRef( props.screenplay );

  // Dom-Hooks for Header and it's Content
  const panel = useRef();
  const account_panel = useRef();
  const contacts_panel = useRef();
  const collections_panel = useRef();
  const discussions_panel = useRef();
  const events_panel = useRef();
  const classifieds_panel = useRef();
  const ticker_panel = useRef();
  const architect_panel = useRef();
  const information_panel = useRef();

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

  // Content
  function SearchPanel( props ){
    const search_panel = useRef();
    const [search_query, setSearchQuery] = useState('');

    function submitSearch( event ){
      event.preventDefault();
      let uname = ( typeof(localStorage.getItem("uname")) !== 'undefined' ) ? localStorage.getItem("uname") : false;
      let token = ( typeof(localStorage.getItem("token")) !== 'undefined' ) ? localStorage.getItem("token") : false;
      debugger;
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
      <div ref={search_panel} className="header_menu_panel search">
        <form onSubmit={submitSearch}>
          <label htmlFor="search">Search:</label>
          <input type="text" name="search" value={search_query} onChange={e => setSearchQuery(e.target.value)} />
          <input type="submit" value="GO" />
        </form>
      </div>
    );
  }
  function AccountPanel( props ){
    const account_panel = useRef();

    useState(()=>{
      debugger;
      account_panel.current.classList.remove('loading');
    },[]);
    return( <div ref={account_panel} className="pip_gui pip_menu loading" onClick={toggleAccount}></div> );
  }
  function ContactsPanel( props ){
    return( <div ref={contacts_panel} className="pip_gui pip_menu" onClick={toggleContacts}></div> );
  }
  function CollectionsPanel( props ){
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
      debugger;
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
    return( <div ref={collections_panel} className="pip_gui pip_menu loading"></div> );
  }
  function DiscussionsPanel( props ){
    return(<div ref={discussions_panel} className="pip_gui pip_menu" onClick={toggleDiscussions}></div>);
  }
  function EventsPanel( props ){
    return( <div ref={events_panel} className="pip_gui pip_menu" onClick={toggleEvents}></div> );
  }
  function ClassifiedsPanel( props ){
    return( <div ref={classifieds_panel} className="pip_gui pip_menu" onClick={toggleClassifieds}></div> );
  }
  function TickerPanel( props ){
    return( <div ref={ticker_panel} id="ticker_panel" className="pip_gui pip_menu" onClick={toggleTicker}></div> );
  }
  function ArchitectPanel( props ){
    function cleanup(){}
    useEffect(()=>{
      let init = async ()=>{

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

          await base_props( folder, group );

          for( const child of group.children ){
            switch( child.type ){
              case 'Group':
              case 'Object3D':
                let group_folder = folder.addFolder( child.name );
                await addGroup( group_folder, child );
                break;

              case 'Mesh':
                let mesh_folder = folder.addFolder( child.name );
                await addMesh( mesh_folder, child );
                break;

              case 'DirectionalLight':
                let dlight_folder = folder.addFolder( 'Directional Light' );
                await addDirectionalLight( dlight_folder, child );
                break;

              case 'AmbientLight':
                let amblight_folder = folder.addFolder( 'Ambient Light' );
                await addAmbientLight( amblight_folder, child );
                break;

              case 'SpotLight':
                let slight_folder = folder.addFolder( 'Spot Light' );
                await addSpotLight( slight_folder, child );
                break;

              case 'PointLight':
                let plight_folder = folder.addFolder( 'Point Light' );
                await addPointLight( plight_folder, child );
                break;

              default:
                let default_folder = folder.addFolder( child.type );
                await base_props( default_folder, child );
                break;

            }
          }

        }
        let addMesh = async ( folder, mesh )=>{
          await base_props( folder, mesh );

          folder.add ( mesh.material, 'transparent' );
          folder.add ( mesh.material, 'opacity' );
          folder.add ( mesh.material, 'depthTest' );
          folder.add ( mesh.material, 'depthWrite' );
          folder.add ( mesh.material, 'alphaTest' );
          folder.add ( mesh.material, 'visible' );
          folder.add ( mesh.material, 'side', [0,1,2] );
        }
        let addDirectionalLight = async ( folder, light )=>{
          await base_props( folder, light );
          folder.addColor ( light, 'color' ).listen();
          folder.add ( light, 'intensity', 0, 10 ).listen();
        }
        let addAmbientLight = async ( folder, light )=>{
          await base_props( folder, light );
          folder.addColor ( light, 'color' ).listen();
          folder.add ( light, 'intensity', 0, 10 ).listen();
        }
        let addSpotLight = async ( folder, light )=>{
          await base_props( folder, light );
          folder.addColor ( light, 'color' ).listen();
          folder.add ( light, 'intensity', 0, 10 ).listen();
        }
        let addPointLight = async ( folder, light )=>{
          await base_props( folder, light );
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
              await addGroup( model_folder, child );
              break;

            case 'Mesh':
              await addMesh( model_folder, child );
              break;

            case 'DirectionalLight':
              await addDirectionalLight( model_folder, child );
              break;

            case 'AmbientLight':
              await addAmbientLight( model_folder, child );
              break;

            case 'SpotLight':
              await addSpotLight( model_folder, child );
              break;

            case 'PointLight':
              await addPointLight( model_folder, child );
              break;

            default:
              debugger;
              break;

          }
        }
      }
      init();
      return cleanup;
    }, [])
    return( <div ref={architect_panel} id="architect_panel" className="pip_gui pip_menu"></div> );
  }
  function InformationPanel( props ){
    const [classNames, setClassNames] = useState( 'pip_gui pip_menu hidden' );
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
        <div ref={information_panel} id="information_panel" className={classNames} onClick={toggleInformation}>
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
      </>
    )
  }

  // onDisplay Hooks
  function toggleAccount( event ){
    setShowAccount( !showAccount );
  }
  function toggleContacts( event ){
    setShowContacts( !showContacts );
  }
  function toggleCollections( event ){
    setShowCollections( !showCollections );
  }
  function toggleDiscussions( event ){
    setShowDiscussions( !showDiscussions );
  }
  function toggleEvents( event ){
    setShowEvents( !showEvents );
  }
  function toggleClassifieds( event ){
    setShowClassifieds( !showClassifieds );
  }
  function toggleTicker( event ){
    setShowTicker( !showTicker );
  }
  function toggleArchitect( event ){
    setShowArchitect( !showArchitect );
  }
  function toggleInformation( event ){
    setShowInformation( !showInformation );
  }

  // Once-Only Init Hook
  function cleanup(){}
  useEffect(()=>{

    return cleanup;
  },[]);

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
        grid-row: 1;
        grid-column: 1 / -1;
        display: grid;
        grid-auto-rows: 9vh auto;
        background: linear-gradient( 11deg, #000036, black, #630000);
        transition: all .2s;
        z-index: 2;
      }
      #WeTheHeader.handheld{


      }
      #WeTheHeader.desktop{
        height: 9vh;
        width: 100vw;
      }
      #WeTheHeader > ul.menu_items{
        grid-row: 1;
        margin: 0;
        padding: 0;
        display: grid;
        grid-auto-columns: 1fr 1fr 1fr 1fr 1fr 1fr 3fr 1fr 1fr;
      }
      #WeTheHeader li{

      }
      #WeTheHeader .header_menu_item{
        display: grid;
        text-align: center;
        font-size: 2vh;
        color: #339af0;
        align-content: center;
        margin: auto;

        grid-row: 1;
        cursor: pointer;
        padding: 0vh 2vh 0.5vh 2vh;
        transition: all 0.1s;
      }
      #WeTheHeader .header_menu_item:hover{
        background: linear-gradient( 11deg, #000036, black, #630000);
        color: #DDD;
      }
      #WeTheHeader .header_menu_panel{
        display: grid;
        border-radius: 0% 0% 25% 25%
        text-align: center;
        font-size: 2vh;
        color: #339af0;
        align-content: center;
        margin: auto;
        transition: all 0.2s;
        background: linear-gradient( 11deg, #000036, black, #630000);
      }
      #WeTheHeader .header_menu_item img{
        height: 6vh;
        margin: auto;
      }
      .header_menu_item.search{
        position: absolute;
        top: 9vh; left: 0;
        padding: 1rem;
      }
      header_menu_item.account{
      }
      header_menu_item.contacts{
      }
      header_menu_item.galleries{
      }
      header_menu_item.capsules{
      }
      header_menu_item.spacedock{
      }
      header_menu_item.ticker{
      }
      header_menu_item.architect{
      }
      header_menu_item.information{

      }
      #search_panel{}
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

      @media only screen and (orientation: landscape){
      }
      @media only screen and (orientation: portrait){
      }
      `}</style>
    <div id="WeTheHeader" ref={panel} className={props.viewMode}>
      <ul className="menu_items">

        <li className="header_menu_item account" onClick={toggleAccount}>
          <img src=".\both_vault.png" />
          <span className="account_balance">{account_balance}</span><span className="account_change">{account_change}</span>
        </li>

        <li className="header_menu_item contacts" onClick={toggleContacts}>
          <img src=".\both_groups.png" />
          <span className="online_contacts">{online_contacts}</span><span className="contacts_alerts">{contacts_alerts}</span>
        </li>

        <li className="header_menu_item collections" onClick={toggleCollections}>
          <img src=".\both_museum.png" />
          <span className="active_collections">{active_collections}</span><span className="collections_alerts">{collections_alerts}</span>
        </li>

        <li className="header_menu_item discussions" onClick={toggleDiscussions}>
          <img src=".\both_wethebrand.png" />
          <span className="active_discussions">{active_discussions}</span><span className="discussions_alerts">{discussions_alerts}</span>
        </li>

        <li className="header_menu_item events" onClick={toggleEvents}>
          <img src=".\both_planet_alert.png" />
          <span className="active_events">{active_events}</span><span className="events_alerts">{events_alerts}</span>
        </li>

        <li className="header_menu_item classifieds" onClick={toggleClassifieds}>
          <img src=".\both_postboard_alert.png" />
          <span className="active_classifieds">{active_classifieds}</span><span className="classifieds_alerts">{classifieds_alerts}</span>
        </li>

        <li className="header_menu_item ticker" onClick={toggleTicker}>
          <span className="ticker_content">{ticker_content}</span>
        </li>

        <li className="header_menu_item architect" onClick={toggleArchitect}>
          <img src=".\dark_architect.png" />
        </li>

        <li className="header_menu_item information" onClick={toggleInformation}>
          <img src=".\dark_information.png" />
        </li>
      </ul>
    </div>
    <SearchPanel />
    {(showAccount)? <AccountPanel toggleAccount={toggleAccount} onDisplay={showAccount} /> : <></> }
    {(showContacts)? <ContactsPanel toggleContacts={toggleContacts} onDisplay={showContacts} /> : <></> }
    {(showCollections)? <CollectionsPanel toggleCollections={toggleCollections} onDisplay={showCollections} /> : <></> }
    {(showDiscussions)? <DiscussionsPanel toggleDiscussions={toggleDiscussions} onDisplay={showDiscussions} /> : <></> }
    {(showEvents)? <EventsPanel toggleEvents={toggleEvents} onDisplay={showEvents} /> : <></> }
    {(showClassifieds)? <ClassifiedsPanel toggleClassifieds={toggleClassifieds} onDisplay={showClassifieds} /> : <></> }
    {(showTicker)? <TickerPanel toggleTicker={toggleTicker} onDisplay={showTicker} /> : <></> }
    {(showArchitect)? <ArchitectPanel toggleArchitect={toggleArchitect} onDisplay={showArchitect} screenplay={props.screenplay} /> : <></> }
    <InformationPanel />
    </>);
}
function setActivePipGUID( props ){

}
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