module.exports = Core

function Core(window, context) {
  this.window = window
  this.document = this.window.document
  this.lastUpdate = new Date().getTime()
  this.input = new Input(this)
  this.context = context
}

Core.prototype = {
  physicsTimeStep: 1000/60
, entities: []
, draw: function() {
    this.context.clearRect(0, 0, 640, 480)

    for (var i=0; i < this.entities.length; i++) {
      this.entities[i].draw && this.entities[i].draw(this.context)
    }
  }
, get nextUpdate() {
    return this.lastUpdate + this.physicsTimeStep
  }
, step: function() {
    for (var i=0; i < this.entities.length; i++) {
      this.entities[i].update && this.entities[i].update()
    }
    this.lastUpdate += this.physicsTimeStep
  }
, lastUniqueId: function(){
    return 0
  }
, uniqueId: function(){
    var a = this.lastUniqueId()
    this.lastUniqueId = function(){
      return a+1
    }
    return a + 1
  }
, update: function() {
    var currentTime = new Date().getTime()

    // if frames back up 0.5 seconds, eat the lag and move on
    if( currentTime - this.lastUpdate > 500){
      this.lastUpdate = currentTime
    }

    // perform updates for all due frames, up to 0.5 seconds ago
    while(this.lastUpdate < currentTime - this.physicsTimeStep){
      this.step()
    }

    this.draw()
  }
, updateAndRegisterNextUpdate: function() {
    if(this.paused) { return }
    this.update()
    this.window.requestAnimationFrame(this.updateAndRegisterNextUpdate.bind(this))
  }
, paused: true
, pause: function(){ this.paused = true }
, play: function(){ this.paused = false ; this.updateAndRegisterNextUpdate() }
, start: function(){ return this.play() }
, stop: function(){ return this.pause() }
, togglePaused: function(){ this.paused = !this.paused }
}

function Input(core) {
  this.core = core
  this.keyCodesDown = []
  this.keyCodesUp = []

  function keyDown(event){
    // doesn't catch bs refires of the keypres..sssssssss!
    if(this.downAt(event.keyCode) <= this.upAt(event.keyCode))
      this.keyCodesDown[event.keyCode] = event.timeStamp
  }

  function keyUp(event){
    this.keyCodesUp[event.keyCode] = event.timeStamp
  }

  this.keyDown = keyDown.bind(this)
  this.keyUp = keyUp.bind(this)
  core.document.addEventListener('keydown', this.keyDown)
  core.document.addEventListener('keyup', this.keyUp)
}

Input.prototype = {
  downAt: function(keyCode){
    return this.keyCodesDown[keyCode] || 0
  }
, upAt: function(keyCode){
    return this.keyCodesUp[keyCode] || 0
  }
, getKey: function(keyCode){
    // frames are not backed up
    // both keydown and keyup in same frame when backed up
    return ((this.downAt(keyCode) > this.upAt(keyCode)) && this.downAt(keyCode) < this.core.lastUpdate + this.core.physicsTimeStep) || this.getKeyDown(keyCode)
  }
, getKeyDown: function(keyCode){
    return this.core.lastUpdate <= this.downAt(keyCode)
        && this.downAt(keyCode) <  this.core.nextUpdate
  }
, getKeyUp: function(keyCode){
    //frames are not backed up
    return (this.upAt(keyCode) > this.core.lastUpdate && this.upAt(keyCode) < this.core.lastUpdate + this.core.physicsTimeStep)
  }
, downDuration: function(keyCode){
    return Math.max(0, this.core.lastUpdate - this.downAt(keyCode))
  }
}