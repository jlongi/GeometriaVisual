function SoundPlayer(audioContext, filterNode) {
  this.audioCtx = audioContext;
  this.gainNode = this.audioCtx.createGain();
  if(filterNode) {
    // run output through extra filter (already connected to audioContext)
    this.gainNode.connect(filterNode);
  } else {
    this.gainNode.connect(this.audioCtx.destination);
  }
  this.oscillator = null;
}

SoundPlayer.prototype.setFrequency = function(val, when) {
  if(when) {
    this.oscillator.frequency.setValueAtTime(val, this.audioCtx.currentTime + when);
  } else {
    this.oscillator.frequency.setValueAtTime(val, this.audioCtx.currentTime);
  }
  return this;
};

SoundPlayer.prototype.setVolume = function(val, when) {
  if(when) {
    this.gainNode.gain.exponentialRampToValueAtTime(val, this.audioCtx.currentTime + when);
  } else {
    this.gainNode.gain.setValueAtTime(val, this.audioCtx.currentTime);
  }
  return this;
};

SoundPlayer.prototype.setWaveType = function(waveType) {
  this.oscillator.type = waveType;
  return this;
};

SoundPlayer.prototype.play = function(freq, vol, wave, when) {
  this.oscillator = this.audioCtx.createOscillator();
  this.oscillator.connect(this.gainNode);
  this.setFrequency(freq);
  if(wave) {
    this.setWaveType(wave);
  }
  this.setVolume(1/1000);
  if(when) {
    this.setVolume(1/1000, when - 0.02);
    this.oscillator.start(when - 0.02);
    this.setVolume(vol, when);
  } else {
    this.oscillator.start();
    this.setVolume(vol, 0.02);
  }
  return this;
};

SoundPlayer.prototype.stop = function(when) {
  if(when) {
    this.gainNode.gain.setTargetAtTime(1/1000, this.audioCtx.currentTime + when - 0.10, 0.02);
    this.oscillator.stop(this.audioCtx.currentTime + when);
  } else {
    this.gainNode.gain.setTargetAtTime(1/1000, this.audioCtx.currentTime, 0.02);
    this.oscillator.stop(this.audioCtx.currentTime + 0.10);
  }
  return this;
};

window.addEventListener("load", function() {
  descartesJS.Parser.prototype.registerExternalValues = function() {
    let AudioContext;
    let audio;

    this.functions.sound_ini = function() {
      AudioContext = window.AudioContext || window.webkitAudioContext;
      audio = new AudioContext();
    }

    let the_note
    this.functions.sound_play = function(freq, form, vol, wait, time) {
      the_note=new SoundPlayer(audio);
      the_note.play(freq, vol, form, wait);
      the_note.stop(wait+time);
      return the_note;
    }

    this.functions.sound_start = function(freq, form, vol, wait) {
      the_note=new SoundPlayer(audio);
      the_note.play(freq, vol, form, wait);
      return the_note;
    }

    this.functions.sound_stop = function() {
      the_note.stop(1/16);
    }

  };

});

