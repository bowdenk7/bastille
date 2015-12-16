var packer = require('gamefroot-texture-packer');
 
packer('./*.png', {format: 'kiwi'}, function (err) {
  if (err) throw err;
 
  console.log('spritesheet successfully generated');
});
