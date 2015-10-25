var Sprite = require('./sprite-preconfigured')
  , delegate = require('../delegate-with-transform')
  , StringSprite = require('./renderable-string')

module.exports = Previewer

function Previewer(sprites) {
  this.__sprites = sprites
}


Previewer.prototype = {

  __index: 0
, x: -50
, y: -50
, get active() {
    return this.filteredSprites[this.__index % this.filteredSprites.length]
  }
, get filteredSprites() {
    return this.sprites
  }
, next: function() {
    this.__index = this.__index + 1 % this.sprites.length
  }
, previous: function() {
    this.__index = this.__index + this.sprites.length - 1 % this.sprites.length
  }
, filter: ""
, popFilterLetter: function() {
    this.filter = this.filter.slice(0, this.filter.length-1)
  }
, get sprites() {
    return this.__sprites
  }
, get sprite() {
    return this.active
  }
, update: function() {

  }
, get currentStringSprite() {
    if(this.__cachedStringSprite && this.__cachedStringSprite.string == this.active.name)
      return this.__cachedStringSprite
    else {
      this.__cachedStringSprite = new StringSprite(this.active.name)
      follow.call(this.__cachedStringSprite, this, this.currentSpriteWidth(), 0)
    }
    return this.__cachedStringSprite
  }
, currentSpriteWidth: function() {
    return this.active.getFrame().data[3] // [x,y,w,h]
  }
, draw: function(ctx) {
    this.currentStringSprite.draw(ctx)
    console.log(this.active.name)
    Sprite.draw.call(this, ctx)
  }
, follow: follow
}

function follow(target, offsetX, offsetY) {
  delegate(this, target, 'x', function(x) { return x + offsetX })
  delegate(this, target, 'y', function(y) { return y + offsetY })
}