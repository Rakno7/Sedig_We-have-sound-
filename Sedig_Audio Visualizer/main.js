  //Bradley Alex Sedig
  var Timer = 0
  var Timergoal = 0
  var StateNum = 1
  var Backgradient = document.getElementById("BackgroundGradient");
  var Xslider = document.getElementById("XRange");
  var Xoutput = document.getElementById("Xoutput");
  const Startbutton = document.getElementById("StartButton")
  const Stopbutton = document.getElementById("StopButton")
  StopActive = true
  StartActive = false
  var AutoTransition = false 
  Xoutput.innerHTML = Xslider.value; // Display the default slider value
  // Update the current slider value (each time you drag the slider handle)
  Xslider.oninput = function() 
  {
    Xoutput.innerHTML = this.value;
  }

  var Yslider = document.getElementById("YRange");
  var Youtput = document.getElementById("Youtput");
  Youtput.innerHTML = Yslider.value; // Display the default slider value
  // Update the current slider value (each time you drag the slider handle)
  Yslider.oninput = function() 
  {
    Youtput.innerHTML = this.value;
  }

  var Rslider = document.getElementById("RRange");
  var Routput = document.getElementById("Routput");
  Routput.innerHTML = Rslider.value; // Display the default slider value
  // Update the current slider value (each time you drag the slider handle)
  Rslider.oninput = function() 
  {
    Routput.innerHTML = this.value;
  }

  
  var Gslider = document.getElementById("GRange");
  var Goutput = document.getElementById("Goutput");
  Goutput.innerHTML = Gslider.value; // Display the default slider value
  // Update the current slider value (each time you drag the slider handle)
  Gslider.oninput = function() 
  {
    Goutput.innerHTML = this.value;
  }

  var Bslider = document.getElementById("BRange");
  var Boutput = document.getElementById("Boutput");
  Boutput.innerHTML = Bslider.value; // Display the default slider value
  // Update the current slider value (each time you drag the slider handle)
  Bslider.oninput = function() 
  {
    Boutput.innerHTML = this.value;
  }

//Function runs after window is loaded
window.onload = function() 
{
  
  
  var file = document.getElementById("Audiofile");
  var audio = document.getElementById("audio");
  
 //function runs when the audio file is changed
  file.onchange = function() 
  {
    
    var files = this.files;
    //get the name of the file and use it as the src
    audio.src = URL.createObjectURL(files[0]);
   
    //when the audio file is changed, load before playing.
    audio.load();
    audio.play();

    //------Audio Visualiser---------------
    //Creates a new AudioContext object. nodes within the context give access to various data and controls. 
    //Nodes can be connected in different ways. 
    var context = new AudioContext();
    //convert the audio element into a node to use in context
    var src = context.createMediaElementSource(audio);
    //creates an AnalyserNode within this audio context, which can be used to expose audio time and frequency data.
    var analyser = context.createAnalyser();
    //the canvas element is where the visuilisation will be created
    var Visualcanvas = document.getElementById("canvas");
    //Set the canvas to the height and width of the browser window
    Visualcanvas.width = window.innerWidth;
    Visualcanvas.height = window.innerHeight;
    //reference to the CanvasRenderingContext2D object for the canvas
    //which represents its two-dimensional rendering context. 
    //the context will be used to draw shapes onto the canvas.
    var ctx = canvas.getContext("2d");

    //The connect method of the AudioNode interface lets you connect one of the node's outputs to a target.
    //connect the audio data analyser output to the audio source input
    src.connect(analyser);

    //Connect the analyser node to the default output, such as speakers .
    analyser.connect(context.destination);

    //This tells the analyser how large the array of data should be that it gives back to us. 
    //It takes the number you give it and divides it by 2. 
    //You have to give it a value that is a power of 2. Such as 2 ** 11 = 2048. So the array size it gives back is 1024.
    analyser.fftSize = 256;
    var bufferLength = analyser.frequencyBinCount;

    //return bufferlength in console.
    console.log(bufferLength);
  
    //The Uint8Array typed array represents an array of 8-bit unsigned integers. 
    //The contents are initialized to 0. Once established, you can reference elements-
    // in the array using the object's methods.
    // the size of the array is set to the bufferlength. 
    var dataArray = new Uint8Array(bufferLength);
    
    //The visuals specifications
    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;
  
    var barWidth = (WIDTH / bufferLength) * 4.5;
    var barHeight;
    var x = 0;
    var y = 0
    var z = 0
    
   
    
    
    function renderFrame() 
    {
      
      //The window.requestAnimationFrame() method tells the browser that you wish to perform an animation-
      // and requests that the browser calls a specified function to update an animation before the next repaint.
      // The method takes a callback as an argument to be invoked before the repaint.

      //this keeps the animation insync with the program to prevent artifacts getting drawn to the screen.
      requestAnimationFrame(renderFrame);



      //tell the analyser to look at the freqency data of the object within the data array
    analyser.getByteFrequencyData(dataArray);
    
    
    let space = canvas.width / dataArray.length;
    
    
    
    //x is used to effect the position of individual bars
    x = 0;
    y = Yslider.value;
   
  
     //this clears the canvas from the previous frame and sets the backround color before doing anything else
     ctx.fillStyle = "rgb(" + Rslider.value / 5 + "," + Gslider.value / 100  + "," + Bslider.value / 5 + ")"; 
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
    
    //ctx.clearRect(0,0,canvas.width,canvas.height);

    var z = -5

    //Timer is used to set random state between 0 and 3
    //depending on the state do a for each loop through the data array
    if(AutoTransition)
    {
        if(StateNum == 0)
        {
             dataArray.forEach((value,i)=>
            {
              //store values to use for rgb
                var r =  i/bufferLength; 
                var g = 0 - Gslider.value; 
                var b = 100 + Bslider.value * i/bufferLength;
                var a = i / 300
                //tell the visual context to begin drawing a path
            ctx.beginPath();
            //move to a position
            ctx.moveTo(space * z, canvas.height-value * i);
            //draw a line from the current position to a new position.
            ctx.lineTo(space * z, canvas.height*value * i);
            
            //set the width of the line
            ctx.lineWidth = Timer
            //set the color of the line
            ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + "," + a +")"; 
            //make it a stroke
            ctx.stroke();
            
            //increase this by 1 so the next line is in a different position
            z += 1
            
            })
          }
          if(StateNum == 2)
        {
            dataArray.forEach((value,i)=>
           {
               var r =  100 * Rslider.value / z; 
               var g =  -Gslider.value - 200; 
               var b = 50 * Bslider.value * i/bufferLength;
               var a = i / 200
           ctx.beginPath();
           ctx.moveTo(space * -x, canvas.width-value / -i);
           ctx.lineTo(space * z, canvas.width*value / i);
           
           ctx.lineWidth = Timer
           ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + "," + a +")"; 
           ctx.stroke();
           
           z += 5
           
           })
         }
         if(StateNum == 1)
     {
        dataArray.forEach((value,i)=>
        {
            var r =  0 - Rslider.value + x; 
            var g = 75 - Gslider.value / y; 
            var b = 0 + Bslider.value * i/bufferLength;
            var a = i / 200
        ctx.beginPath();
        ctx.moveTo(space * -z, value / -i);
        ctx.lineTo(space * z, canvas.height*value / i);
        
        ctx.lineWidth = Timer * 10
        ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + "," + a +")"; 
        ctx.stroke();
        
        z += 5
        
        })
     }

     if(StateNum == 3)
     {
      for (var i = 0; i < bufferLength; i++) 
      {
        //barheight depends on the position in the array
        barHeight = dataArray[i];
        
        //variables to effect the visualisation when plugged into the rec and fill style
        var r =  Rslider.value * (i/bufferLength); 
        var g = 50 / Gslider.value + (i/bufferLength); 
        var b = barHeight + (Bslider.value * (i/bufferLength) - Xslider.value / Yslider.value );

          ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")"; 
         
            //create a rectangle with these dimensions 
          ctx.fillRect(x /Xslider.value,   HEIGHT - barHeight  * Xslider.value * 4,  x /  y, barWidth /y);
        
                x += barWidth + 1;
                y = Yslider.value / x;
           
      }
     }
       //for loop which spans the length of the frequency wave (bufferLength)
       //and sets the bar and canvas visuals based on the data from the analyser 
      for (var i = 0; i < bufferLength; i++) 
      {
        //barheight depends on the position in the array
        barHeight = dataArray[i];
        
        //variables to effect the visualisation when plugged into the rec and fill style
        var r =  Rslider.value * (i/bufferLength) /50; 
        var g = 0 + (i/bufferLength); 
        var b = barHeight + (Bslider.value * (i/bufferLength) - x /5 );

      
    

      
          ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")"; 
          if(StateNum == 0)
          {
            //create a rectangle with these dimensions 
          ctx.fillRect(x,  HEIGHT - barHeight ,  barWidth * Xslider.value, barHeight *y);
          }
          if(StateNum == 1)
          {
          ctx.fillRect(x,  HEIGHT - barHeight * Xslider.value ,  barWidth * Xslider.value, barHeight *y);
          }
          if(StateNum == 2)
          {
          ctx.fillRect(x,  HEIGHT - barHeight ,  barWidth * Xslider.value, barHeight *y);
          }
          if(StateNum == 3)
          {
            ctx.fillRect(x /Xslider.value,   HEIGHT - barHeight  * Xslider.value * 4,  x /  y, barWidth /y);
        
            
          }
    
            if(StateNum == 0)
            {
                x += barWidth + 5;
                y = Yslider.value;
            }
            if(StateNum == 1)
            {
                x += barHeight / 10;
                y = Yslider.value * i;
            }
            if(StateNum == 2)
            {
                x  +=  barHeight + 2 / 2;
                y = Yslider.value * i;
            }
            if(StateNum == 3)
            {
              x += barWidth + 1;
              y = Yslider.value / x
            }
         }
        }


        if(!AutoTransition)
    {
        
             dataArray.forEach((value,i)=>
            {
              //store values to use for rgb
                var r =  i/bufferLength * Rslider.value; 
                var g = 0 * Gslider.value; 
                var b = 100 + Bslider.value * i/bufferLength;
                var a = i / 300
                //tell the visual context to begin drawing a path
            ctx.beginPath();
            //move to a position
            ctx.moveTo(space * z, canvas.height-value * y * -Xslider.value);
            //draw a line from the current position to a new position.
            ctx.lineTo(space * -z, canvas.height*value /Xslider.value * -Yslider.value);
            
            //set the width of the line
            ctx.lineWidth = 500
            //set the color of the line
            ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + "," + a +")"; 
            //make it a stroke
            ctx.stroke();
            
            //increase this by 1 so the next line is in a different position
            z += 1
            
            })
          
        
       //for loop which spans the length of the frequency wave (bufferLength)
       //and sets the bar and canvas visuals based on the data from the analyser 
      for (var i = 0; i < bufferLength; i++) 
      {
        //barheight depends on the position in the array
        barHeight = dataArray[i];
        
        //variables to effect the visualisation when plugged into the rec and fill style
        var r =  Rslider.value * (i/bufferLength); 
        var g = 50 / Gslider.value + (i/bufferLength); 
        var b = barHeight + (Bslider.value * (i/bufferLength) - Xslider.value / Yslider.value );

          ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")"; 
         
            //create a rectangle with these dimensions 
          ctx.fillRect(x /Xslider.value,   HEIGHT - barHeight  * Xslider.value * 4,  x /  y, barWidth /y);
        
                x += barWidth + 1;
                y = Yslider.value / x;
           
      }
    }
  }

    audio.play();
    //after this frame is done, run the function to render the frame again.
    //this will make the function loop. 
    
    renderFrame();
  };
};

//automate transitions with a timer
function StateTimer()
{
  CheckInput()
 if(AutoTransition)
 {
   
  if(StateNum == 0)
  {
    Yslider.value ++
    Bslider.value --
    Rslider.value ++
    Gslider.value --
    Xslider.value ++
  }
  if(StateNum == 1)
  {
    Rslider.value--
    Bslider.value++
    Xslider.value --
  }
  if(StateNum == 2 || StateNum == 3)
  {
    
    Gslider.value ++
    Yslider.value --
  }
 
  if(Timer == 0)
  {
    
    ResetTimerGoal()
  }
  Timer ++
  if(Timer > Timergoal)
  {
    SetVisualiserState()
    ResetTimerGoal()
  }
}

}
function ResetTimerGoal()
{
  Timergoal = Math.floor(Math.random()* 30)
}

function SetVisualiserState()
{
  StateNum = Math.floor(Math.random()* 4)
  Timer = 0
}

function turnon()
{
  AutoTransition = true
  StopActive = false
  StartActive = true
 
}
function turnoff()
{
  AutoTransition = false
  StopActive = true
  StartActive = false
 
}


  //this function checks for onclick events from active buttons and runs the appropriate function
function CheckInput()
{
       if(StartActive)
   {
   Startbutton.onclick = turnoff
   }
   if(StopActive)
   {
   Stopbutton.onclick = turnon
   
   }
}



setInterval(StateTimer, 100)
