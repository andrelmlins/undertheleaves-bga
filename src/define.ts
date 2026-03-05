define([
  'dojo',
  'dojo/_base/declare',
  'ebg/core/gamegui',
  'ebg/counter',
  'ebg/zone',
  'ebg/stock',
  g_gamethemeurl + '/modules/js/scrollmapWithZoom.js',
], function (dojo, declare) {
  return declare('bgagame.undertheleaves', ebg.core.gamegui, new UndertheLeavesGame());
});
