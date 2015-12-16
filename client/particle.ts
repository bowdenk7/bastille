var Sprite = require('./sprite')
  , sprites = require('./all-sprites')

module.exports = Particle



class Particle {
    sprite;
    x;
    y;
    dx;
    dy;
    
    constructor(spriteName, options) {
        this.sprite = sprites.get(spriteName);
        this.x = options.x;
        this.y = options.y;
        this.dx = 0;
        this.dy = 0;
    }
    
    update(core):void {
        this.x += this.dx;
        this.y += this.dy;
    }
    draw(): {Sprite.draw}
    spriteX():number { return this.x - this.sprite.width/2 }
    spriteY():number { return this.y - this.sprite.height/2 }
}
