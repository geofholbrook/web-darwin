
var ac = new AudioContext();
var loaded = false;
var pitches = [];
var timeouts = [];
var bpm = 144;
count=0;



Soundfont.instrument(ac, 'acoustic_grand_piano').then(function (player){
	voice = player;
	loaded=true;
})


schedule = function(pitches_){
	count=0;
	pitches = pitches_;
    if(loaded){
      timeouts = [];
      //voice.play(pitches[0], ac.currentTime, {gain:1}).stop(ac.currentTime + bpm);
      for(var i=0; i<pitches.length; i++){
            var when = i*bpm;
            this.timeouts.push(setTimeout(function(){
                var pitch = pitches[count];
                voice.play(pitch, ac.currentTime, {gain:1, duration:60000/bpm/4});//.stop(ac.currentTime + bpm);
                count++;
            }, when));
        }
    }
  }
  
clearSchedule = function(){
      for (var i=0; i<timeouts.length; i++) {
        clearTimeout(timeouts[i]);
        }
  }


