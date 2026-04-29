var BOLD_ARGS_VALUE = ['count_beings', 'count_label', 'size_label'];
var BOLD_ARGS_I18N = ['color_name'];
var FormatStrings = /** @class */ (function () {
    function FormatStrings(game, args) {
        this.game = game;
        this.args = args;
    }
    FormatStrings.prototype.format = function () {
        var _this = this;
        Object.keys(this.args).forEach(function (key) {
            if (BOLD_ARGS_VALUE.includes(key) && _this.args[key] !== undefined) {
                _this.args[key] = "<b>".concat(_this.args[key], "</b>");
            }
        });
        Object.keys(this.args).forEach(function (key) {
            if (BOLD_ARGS_I18N.includes(key) && _this.args[key] !== undefined) {
                _this.args[key] = "<b>".concat(_(_this.args[key]), "</b>");
            }
        });
        if (this.args.tile_image) {
            this.args.tile_image = this.game.games.tileManager.formatTile(this.args.tile_image, true);
        }
        if (this.args.being_icon) {
            this.args.being_icon = "<div class=\"undertheleaves-piece notif\" piece=\"".concat(this.args.being_icon, "\"></div>");
        }
    };
    return FormatStrings;
}());
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// @ts-ignore
GameGui = (function () {
    function GameGui() { }
    return GameGui;
})();
var UndertheLeavesGame = /** @class */ (function (_super) {
    __extends(UndertheLeavesGame, _super);
    function UndertheLeavesGame() {
        var _this = _super.call(this) || this;
        _this.games = {
            tileManager: new TileManager(_this),
            cardManager: new CardManager(_this),
            playerManager: new PlayerManager(_this),
            placeTile: new PlaceTile(_this),
            beingsManager: new BeingsManager(_this),
            chooseBeing: new ChooseBeing(_this),
        };
        return _this;
    }
    UndertheLeavesGame.prototype.setup = function (gamedatas) {
        this.animationManager = new AnimationManager(this, {
            duration: 800,
        });
        document.getElementById('game_play_area').insertAdjacentHTML('beforeend', "\n        <div id=\"undertheleaves-box\" class=\"undertheleaves-box\">\n          <div class=\"undertheleaves-header\">\n            <div id=\"undertheleaves-offer\" class=\"undertheleaves-offer\">\n              <div id=\"undertheleaves-bag\" class=\"undertheleaves-bag\">\n                <span id=\"undertheleaves-deck-counter\">0</span>\n              </div>\n            </div>\n            <div id=\"undertheleaves-cards\" class=\"undertheleaves-cards\"></div>\n          </div>\n        </div>\n      ");
        document
            .getElementById('page-title')
            .insertAdjacentHTML('afterbegin', '<div id="undertheleaves-general-void-stock" class="undertheleaves-void-stock"></div>');
        for (var gameName in this.games) {
            this.games[gameName].setup(gamedatas);
        }
        this.setupNotifications();
    };
    UndertheLeavesGame.prototype.bgaFormatText = function (log, args) {
        try {
            if (log && args && !args.processed) {
                var formatStrings = new FormatStrings(this, args);
                formatStrings.format();
                args = formatStrings.args;
                args.processed = true;
            }
        }
        catch (e) {
            console.error(log, args, 'Exception thrown', e.stack);
        }
        return { log: log, args: args };
    };
    UndertheLeavesGame.prototype.onEnteringState = function (stateName, notif) {
        for (var gameName in this.games) {
            this.games[gameName].onEnteringState(stateName, notif);
        }
    };
    UndertheLeavesGame.prototype.onLeavingState = function (stateName) {
        for (var gameName in this.games) {
            this.games[gameName].onLeavingState(stateName);
        }
    };
    UndertheLeavesGame.prototype.onUpdateActionButtons = function (stateName, notif) {
        if (this.bga.players.isCurrentPlayerActive()) {
            for (var gameName in this.games) {
                this.games[gameName].onUpdateActionButtons(stateName, notif);
            }
        }
    };
    UndertheLeavesGame.prototype.setupNotifications = function () {
        for (var gameName in this.games) {
            this.games[gameName].setupNotifications();
        }
    };
    return UndertheLeavesGame;
}(GameGui));
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
var TILE_SIZE = 150;
var TERRAIN_INDEX_MAP = {
    0: {
        0: [
            [0, 1],
            [2, 3],
        ],
        1: [
            [1, 0],
            [3, 2],
        ],
    },
    90: {
        0: [
            [2, 0],
            [3, 1],
        ],
        1: [
            [0, 2],
            [1, 3],
        ],
    },
    180: {
        0: [
            [3, 2],
            [1, 0],
        ],
        1: [
            [2, 3],
            [0, 1],
        ],
    },
    270: {
        0: [
            [1, 3],
            [0, 2],
        ],
        1: [
            [3, 1],
            [2, 0],
        ],
    },
};
var delayTime = function (time) { return new Promise(function (resolve) { return setTimeout(function () { return resolve(); }, time); }); };
var generateId = function () { return "".concat(Math.floor(Math.random() * 100000000)); };
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var BgaLocalAnimation = /** @class */ (function () {
    function BgaLocalAnimation(game) {
        this.game = game;
        this.where = 'beforeend';
        this.rotation = 0;
    }
    BgaLocalAnimation.prototype.setOptions = function (origin, destination, duration) {
        this.origin = origin;
        this.destination = destination;
        this.duration = duration;
    };
    BgaLocalAnimation.prototype.setToOptions = function (element, fromElement, duration) {
        this.element = element;
        this.fromElement = fromElement;
        this.duration = duration;
    };
    BgaLocalAnimation.prototype.setWhere = function (where) {
        this.where = where;
    };
    BgaLocalAnimation.prototype.setRotation = function (rotation) {
        this.rotation = rotation;
    };
    BgaLocalAnimation.prototype.setScale = function (scale) {
        this.scale = scale;
    };
    BgaLocalAnimation.prototype.call = function (handle, handlePreAnim) {
        var _this = this;
        return new Promise(function (resolve, _) { return __awaiter(_this, void 0, void 0, function () {
            var animation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        animation = new BgaSlideAnimation({
                            element: this.origin,
                            duration: this.duration,
                            rotationDelta: this.rotation,
                            scale: this.scale,
                        });
                        return [4 /*yield*/, this.game.animationManager.play(new BgaAttachWithAnimation({
                                animation: animation,
                                where: this.where,
                                attachElement: this.destination,
                                afterAttach: function (element) { return handlePreAnim === null || handlePreAnim === void 0 ? void 0 : handlePreAnim.call(null, element); },
                            }))];
                    case 1:
                        _a.sent();
                        if (handle) {
                            handle(this.origin);
                        }
                        resolve();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    BgaLocalAnimation.prototype.callTo = function (handle) {
        var _this = this;
        return new Promise(function (resolve, _) { return __awaiter(_this, void 0, void 0, function () {
            var animation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        animation = new BgaSlideAnimation({
                            element: this.element,
                            fromElement: this.fromElement,
                            duration: this.duration,
                            rotationDelta: this.rotation,
                            scale: this.scale,
                        });
                        return [4 /*yield*/, this.game.animationManager.play(animation)];
                    case 1:
                        _a.sent();
                        handle(this.element);
                        resolve();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return BgaLocalAnimation;
}());
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var TileManager = /** @class */ (function () {
    function TileManager(game) {
        this.game = game;
        this.gridMap = {};
        this.handlers = [];
        this.mapContainerIds = [];
    }
    TileManager.prototype.setup = function () {
        var _this = this;
        var offerBox = document.getElementById('undertheleaves-offer');
        var box = document.getElementById('undertheleaves-box');
        for (var tileId in this.game.gamedatas.tableTiles) {
            var tile = this.game.gamedatas.tableTiles[tileId];
            offerBox.insertAdjacentHTML('beforeend', this.formatTile(tile));
        }
        this.game.gamedatas.playerorder.forEach(function (playerId) {
            var player = _this.game.gamedatas.players[playerId];
            box.insertAdjacentHTML('beforeend', "\n          <div id=\"undertheleaves-player-".concat(playerId, "\" class=\"undertheleaves-player\">\n            <span style=\"--color: #").concat(player.color, "\">").concat(player.name, "</span>\n            <div id=\"undertheleaves-player-map-container-").concat(playerId, "\">\n              <div id=\"undertheleaves-player-map-scrollable-").concat(playerId, "\"></div>\n              <div id=\"undertheleaves-player-map-surface-").concat(playerId, "\"></div>\n              <div id=\"undertheleaves-player-map-scrollable-oversurface-").concat(playerId, "\"></div>\n            </div>\n          </div>\n        "));
            var container = document.getElementById("undertheleaves-player-map-container-".concat(playerId));
            container.id = "".concat(container.id, "-").concat(Date.now());
            _this.mapContainerIds[playerId] = container.id;
            _this.gridMap[playerId] = new ebg.scrollmapWithZoom();
            _this.gridMap[playerId].bAdaptHeightAuto = false;
            _this.gridMap[playerId].create($(container.id), $("undertheleaves-player-map-scrollable-".concat(playerId)), $("undertheleaves-player-map-surface-".concat(playerId)), $("undertheleaves-player-map-scrollable-oversurface-".concat(playerId)));
            _this.gridMap[playerId].onsurface_div.insertAdjacentHTML('beforeend', "<div id=\"undertheleaves-player-grid-".concat(playerId, "\" class=\"undertheleaves-player-grid\"></div>"));
            _this.gridMap[playerId].onsurface_div.insertAdjacentHTML('beforeend', "<div id=\"undertheleaves-player-beings-".concat(playerId, "\" class=\"undertheleaves-player-beings\"></div>"));
            _this.createGridTiles(_this.game.gamedatas.gridTiles[playerId], Number(playerId));
        });
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                _this.game.gamedatas.playerorder.forEach(function (playerId) {
                    _this.applyZoom(Number(playerId));
                });
            });
        });
        this.deckCounter = new ebg.counter();
        this.deckCounter.create('undertheleaves-deck-counter');
        this.deckCounter.setValue(this.game.gamedatas.countDeckTiles);
    };
    TileManager.prototype.onEnteringState = function (stateName, notif) {
        //
    };
    TileManager.prototype.onLeavingState = function (stateName) {
        //
    };
    TileManager.prototype.onUpdateActionButtons = function (stateName, args) {
        //
    };
    TileManager.prototype.setupNotifications = function () {
        //
    };
    TileManager.prototype.applyZoom = function (playerId, animate) {
        if (animate === void 0) { animate = true; }
        var playerGridBox = this.getGridBoxDiv(Number(playerId));
        var cells = Array.from(playerGridBox.children);
        if (!cells.length)
            return;
        var xs = cells.map(function (c) { return Number(c.dataset.x); });
        var ys = cells.map(function (c) { return Number(c.dataset.y); });
        var minX = Math.min.apply(Math, __spreadArray([], __read(xs), false));
        var maxX = Math.max.apply(Math, __spreadArray([], __read(xs), false));
        var minY = Math.min.apply(Math, __spreadArray([], __read(ys), false));
        var maxY = Math.max.apply(Math, __spreadArray([], __read(ys), false));
        var width = maxX - minX + 1;
        var height = maxY - minY + 1;
        var map = this.gridMap[playerId];
        var container = document.getElementById(this.mapContainerIds[playerId]);
        var padding = TILE_SIZE * 0.5;
        var mapWidth = width * TILE_SIZE + padding * 2;
        var mapHeight = height * TILE_SIZE + padding * 2;
        var containerWidth = container.clientWidth;
        var zoom = containerWidth / mapWidth;
        zoom = Math.min(zoom, 1);
        map.setMapZoom(zoom);
        container.style.height = "".concat(mapHeight * zoom, "px");
        map.scrollToCenter(undefined, animate ? undefined : 0);
    };
    TileManager.prototype.formatTile = function (tile, notif) {
        if (notif === void 0) { notif = false; }
        var tileConfig = this.getTileConfig(tile);
        return "\n      <div ".concat(!notif ? "id=\"undertheleaves-tile-".concat(tile.id, "\"") : '', " class=\"undertheleaves-tile ").concat(notif ? 'notif' : '', "\" line=\"").concat(tileConfig.position.row, "\" column=\"").concat(tileConfig.position.column, "\" type=\"").concat(tile.type, "\">\n        <div class=\"undertheleaves-tile-flipper\">\n          <div class=\"undertheleaves-tile-box\">\n            <div class=\"undertheleaves-tile-inner\">\n              <div class=\"undertheleaves-tile-front\"></div>\n              <div class=\"undertheleaves-tile-back\"></div>\n            </div>\n          </div>\n        </div>\n      </div>\n    ");
    };
    TileManager.prototype.formatGridTile = function (gridTile) {
        var tileConfig = this.getTileConfig(gridTile.tile);
        return "\n      <div id=\"undertheleaves-tile-".concat(gridTile.tile.id, "\" class=\"undertheleaves-tile\" line=\"").concat(tileConfig.position.row, "\" column=\"").concat(tileConfig.position.column, "\" type=\"").concat(gridTile.tile.type, "\" data-x=\"").concat(gridTile.x, "\" data-y=\"").concat(gridTile.y, "\" data-rotation=\"").concat(gridTile.rotation, "\" data-side=\"").concat(gridTile.side, "\">\n        <div class=\"undertheleaves-tile-flipper\" style=\"").concat(gridTile.side == 1 ? 'transform: rotateY(180deg)' : '', "\">\n          <div class=\"undertheleaves-tile-box\" style=\"transform: rotate(").concat(gridTile.rotation, "deg)\">\n            <div class=\"undertheleaves-tile-inner\">\n              <div class=\"undertheleaves-tile-front\"></div>\n              <div class=\"undertheleaves-tile-back\"></div>\n            </div>\n          </div>\n        </div>\n      </div>\n    ");
    };
    TileManager.prototype.formatBeingPositions = function (x, y, terrains, rotation, side) {
        if (rotation === void 0) { rotation = 0; }
        if (side === void 0) { side = 0; }
        var localPositions = [
            { localX: 0, localY: 0 },
            { localX: 1, localY: 0 },
            { localX: 0, localY: -1 },
            { localX: 1, localY: -1 },
        ];
        var positions = localPositions.map(function (pos, index) { return ({
            localX: localPositions[index].localX,
            localY: localPositions[index].localY,
            x: x * 2 + pos.localX,
            y: y * 2 + pos.localY,
        }); });
        return positions
            .map(function (pos) {
            var _a, _b, _c, _d;
            var div = document.createElement('div');
            div.className = 'undertheleaves-terrain';
            div.dataset.localX = String(pos.localX);
            div.dataset.localY = String(pos.localY);
            div.dataset.x = String(pos.x);
            div.dataset.y = String(pos.y);
            var row = pos.localY === 0 ? 0 : 1;
            var col = pos.localX;
            var terrainIndex = (_c = (_b = (_a = TERRAIN_INDEX_MAP[rotation]) === null || _a === void 0 ? void 0 : _a[side]) === null || _b === void 0 ? void 0 : _b[row]) === null || _c === void 0 ? void 0 : _c[col];
            if (terrains && terrainIndex !== undefined && ((_d = terrains[terrainIndex]) === null || _d === void 0 ? void 0 : _d.mushroom)) {
                div.dataset.mushroom = 'true';
            }
            return div.outerHTML;
        })
            .join('');
    };
    TileManager.prototype.createBeingPositionDivs = function (cellElement, x, y, rotation, side) { };
    TileManager.prototype.getTileConfig = function (tile) {
        var _a = __read(tile.type_arg.split('_').map(function (item) { return Number(item); }), 2), row = _a[0], column = _a[1];
        if (tile.type === 'initial') {
            return this.game.gamedatas.initialTileConfigs.find(function (tile) { return tile.position.row === row && tile.position.column === column; });
        }
        return this.game.gamedatas.tileConfigs.find(function (tile) { return tile.position.row === row && tile.position.column === column; });
    };
    TileManager.prototype.getGridBoxDiv = function (playerId) {
        return document.getElementById("undertheleaves-player-grid-".concat(playerId));
    };
    TileManager.prototype.createGridTiles = function (tiles, playerId) {
        var _this = this;
        var playerGridBox = this.getGridBoxDiv(Number(playerId));
        playerGridBox.innerHTML = '';
        var beingsOverlayInit = document.getElementById("undertheleaves-player-beings-".concat(playerId));
        if (beingsOverlayInit)
            beingsOverlayInit.innerHTML = '';
        tiles.forEach(function (gridTile) {
            var cellDiv = document.createElement('div');
            cellDiv.className = 'undertheleaves-player-cell';
            cellDiv.dataset.x = String(gridTile.x);
            cellDiv.dataset.y = String(gridTile.y);
            playerGridBox.appendChild(cellDiv);
            cellDiv.insertAdjacentHTML('beforeend', _this.formatGridTile(gridTile));
            var tileConfig = _this.getTileConfig(gridTile.tile);
            var terrainHTML = _this.formatBeingPositions(gridTile.x, gridTile.y, tileConfig === null || tileConfig === void 0 ? void 0 : tileConfig.terrains, gridTile.rotation, gridTile.side);
            beingsOverlayInit === null || beingsOverlayInit === void 0 ? void 0 : beingsOverlayInit.insertAdjacentHTML('beforeend', terrainHTML);
            _this.createBeingPositionDivs(cellDiv, gridTile.x, gridTile.y, gridTile.rotation, gridTile.side);
        });
        this.recalculateGrid(playerId);
    };
    TileManager.prototype.recalculateGrid = function (playerId) {
        var playerGridBox = this.getGridBoxDiv(Number(playerId));
        Array.from(playerGridBox.children).forEach(function (cell) {
            if (!cell.classList.contains('selectable') && cell.childNodes.length === 0) {
                cell.remove();
            }
        });
        var cells = Array.from(playerGridBox.children).filter(function (cell) { return cell.classList.contains('selectable') || cell.childNodes.length > 0; });
        var coords = cells.map(function (el) { return ({
            x: Number(el.dataset.x),
            y: Number(el.dataset.y),
        }); });
        var xs = coords.map(function (c) { return c.x; });
        var ys = coords.map(function (c) { return c.y; });
        var minX = Math.min.apply(Math, __spreadArray([], __read(xs), false));
        var maxX = Math.max.apply(Math, __spreadArray([], __read(xs), false));
        var minY = Math.min.apply(Math, __spreadArray([], __read(ys), false));
        var maxY = Math.max.apply(Math, __spreadArray([], __read(ys), false));
        var width = maxX - minX + 1;
        var height = maxY - minY + 1;
        for (var y = maxY; y >= minY; y--) {
            for (var x = minX; x <= maxX; x++) {
                if (!playerGridBox.querySelector(".undertheleaves-player-cell[data-x=\"".concat(x, "\"][data-y=\"").concat(y, "\"]"))) {
                    playerGridBox.insertAdjacentHTML('beforeend', "<div class=\"undertheleaves-player-cell\" data-x=\"".concat(x, "\" data-y=\"").concat(y, "\"></div>"));
                }
            }
        }
        playerGridBox.style.gridTemplateColumns = "repeat(".concat(width, ", ").concat(TILE_SIZE, "px)");
        playerGridBox.style.gridTemplateRows = "repeat(".concat(height, ", ").concat(TILE_SIZE, "px)");
        var newCells = Array.from(playerGridBox.children);
        newCells.sort(function (a, b) {
            var ay = Number(a.dataset.y);
            var by = Number(b.dataset.y);
            var ax = Number(a.dataset.x);
            var bx = Number(b.dataset.x);
            if (ay !== by)
                return by - ay;
            return ax - bx;
        });
        var frag = document.createDocumentFragment();
        newCells.forEach(function (el) { return frag.appendChild(el); });
        playerGridBox.appendChild(frag);
        this.updateBeingsOverlayPositions(playerId, minX, maxX, minY, maxY);
    };
    TileManager.prototype.addTileToBeingsOverlay = function (gridTile, playerId) {
        var overlay = document.getElementById("undertheleaves-player-beings-".concat(playerId));
        if (!overlay)
            return;
        var tileConfig = this.getTileConfig(gridTile.tile);
        var terrainHTML = this.formatBeingPositions(gridTile.x, gridTile.y, tileConfig === null || tileConfig === void 0 ? void 0 : tileConfig.terrains, gridTile.rotation, gridTile.side);
        overlay.insertAdjacentHTML('beforeend', terrainHTML);
        this.recalculateGrid(playerId);
    };
    TileManager.prototype.updateBeingsOverlayPositions = function (playerId, minX, maxX, minY, maxY) {
        var overlay = document.getElementById("undertheleaves-player-beings-".concat(playerId));
        if (!overlay)
            return;
        overlay.style.width = "".concat((maxX - minX + 1) * TILE_SIZE, "px");
        overlay.style.height = "".concat((maxY - minY + 1) * TILE_SIZE, "px");
        overlay.querySelectorAll('.undertheleaves-terrain').forEach(function (div) {
            var tx = Number(div.dataset.x);
            var ty = Number(div.dataset.y);
            var cx = Math.floor(tx / 2);
            var cy = ty % 2 === 0 ? ty / 2 : (ty + 1) / 2;
            var left = (cx - minX) * TILE_SIZE + (tx % 2 === 0 ? 0.25 : 0.75) * TILE_SIZE;
            var top = (maxY - cy) * TILE_SIZE + (ty % 2 === 0 ? 0.25 : 0.75) * TILE_SIZE;
            div.style.left = "".concat(left, "px");
            div.style.top = "".concat(top, "px");
        });
    };
    TileManager.prototype.showOfferCardSelectable = function (onChanged) {
        var _this = this;
        var tiles = document.getElementById('undertheleaves-offer').querySelectorAll('.undertheleaves-tile');
        tiles.forEach(function (element) {
            var id = element.id.split('-')[2];
            element.classList.add('selectable');
            _this.handlers.push(dojo.connect(element, 'onclick', function () {
                if (_this.tileSelected) {
                    document.getElementById("undertheleaves-tile-".concat(_this.tileSelected)).classList.remove('selected');
                }
                if (_this.tileSelected == id) {
                    element.classList.remove('selected');
                    _this.tileSelected = null;
                }
                else {
                    element.classList.add('selected');
                    _this.tileSelected = id;
                }
                onChanged(_this.tileSelected);
            }));
        });
    };
    TileManager.prototype.removeOfferCardSelectable = function () {
        var _this = this;
        var tiles = document.getElementById('undertheleaves-offer').querySelectorAll('.undertheleaves-tile');
        tiles.forEach(function (element) {
            element.classList.remove('selectable');
            element.classList.remove('selected');
            _this.handlers.forEach(function (handler) { return dojo.disconnect(handler); });
            _this.handlers = [];
        });
        this.tileSelected = null;
    };
    TileManager.prototype.getTileById = function (id) {
        return document.getElementById("undertheleaves-tile-".concat(id));
    };
    TileManager.prototype.getBoxTileById = function (id) {
        return this.getTileById(id).querySelector('.undertheleaves-tile-box');
    };
    TileManager.prototype.getFlipperTileById = function (id) {
        return this.getTileById(id).querySelector('.undertheleaves-tile-flipper');
    };
    return TileManager;
}());
var CardManager = /** @class */ (function () {
    function CardManager(game) {
        this.game = game;
    }
    CardManager.prototype.setup = function () {
        var cardsBox = document.getElementById('undertheleaves-cards');
        var _a = this.game.gamedatas.cards, leaf = _a.leaf, mushroom = _a.mushroom, puddle = _a.puddle;
        cardsBox.insertAdjacentHTML('beforeend', this.formatCard(leaf));
        cardsBox.insertAdjacentHTML('beforeend', this.formatCard(mushroom));
        cardsBox.insertAdjacentHTML('beforeend', this.formatCard(puddle));
        this.game.addTooltipHtml('undertheleaves-card-leaf', this.formatCardTooltip(leaf));
        this.game.addTooltipHtml('undertheleaves-card-mushroom', this.formatCardTooltip(mushroom));
        this.game.addTooltipHtml('undertheleaves-card-puddle', this.formatCardTooltip(puddle));
    };
    CardManager.prototype.onEnteringState = function (stateName, notif) {
        //
    };
    CardManager.prototype.onLeavingState = function (stateName) {
        //
    };
    CardManager.prototype.onUpdateActionButtons = function (stateName, args) {
        //
    };
    CardManager.prototype.setupNotifications = function () {
        //
    };
    CardManager.prototype.formatCard = function (card) {
        return "<div id=\"undertheleaves-card-".concat(card.type, "\" class=\"undertheleaves-card\" line=\"").concat(card.position.row, "\" column=\"").concat(card.position.column, "\"></div>");
    };
    CardManager.prototype.formatCardTooltip = function (card) {
        var typeName = {
            leaf: _('Leaf Dweller'),
            mushroom: _('Mushroom Dweller'),
            puddle: _('Puddle Dweller'),
        };
        return "\n      <div class=\"undertheleaves-card-tooltip\">\n        <span class=\"undertheleaves-card-tooltip-type\">".concat(typeName[card.type], "</span>\n        <span class=\"undertheleaves-card-tooltip-name\">").concat(_(card.name), "</span>\n        <span class=\"undertheleaves-card-tooltip-description\">").concat(_(card.description), "</span>\n      </div>\n    ");
    };
    return CardManager;
}());
var PlayerManager = /** @class */ (function () {
    function PlayerManager(game) {
        this.game = game;
        this.counters = {};
    }
    PlayerManager.prototype.setup = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        for (var playerId in this.game.gamedatas.players) {
            this.counters[playerId] = {
                leaf: new ebg.counter(),
                puddle: new ebg.counter(),
                mushroom: new ebg.counter(),
                hummingbird: new ebg.counter(),
                bee: new ebg.counter(),
                round: new ebg.counter(),
            };
            var playerBoardHtml = "\n        <div id=\"undertheleaves-player-board-".concat(playerId, "\" class=\"undertheleaves-player-board\">\n          <div id=\"undertheleaves-player-board-round-").concat(playerId, "\" class=\"undertheleaves-player-board-round\">\n            <span>\n              <span class=\"undertheleaves-player-board-round-icon\"></span>\n              <span id=\"undertheleaves-round-count-").concat(playerId, "\">0</span>&nbsp;/ 13\n            </span>\n          </div>\n          <div class=\"undertheleaves-player-board-counters\">\n            <div class=\"undertheleaves-player-board-count\">\n              ").concat(this.game.games.beingsManager.formatPiece('bee'), "\n              <span id=\"undertheleaves-bee-count-").concat(playerId, "\">0</span>\n            </div>\n            <div class=\"undertheleaves-player-board-count\">\n              ").concat(this.game.games.beingsManager.formatPiece('hummingbird'), "\n              <span id=\"undertheleaves-hummingbird-count-").concat(playerId, "\">0</span>\n            </div>\n            <div class=\"undertheleaves-player-board-count\">\n              ").concat(this.game.games.beingsManager.formatPiece('leaf'), "\n              <span id=\"undertheleaves-leaf-count-").concat(playerId, "\">0</span>\n            </div>\n            <div class=\"undertheleaves-player-board-count\">\n              ").concat(this.game.games.beingsManager.formatPiece('mushroom'), "\n              <span id=\"undertheleaves-mushroom-count-").concat(playerId, "\">0</span>\n            </div>\n            <div class=\"undertheleaves-player-board-count\">\n              ").concat(this.game.games.beingsManager.formatPiece('puddle'), "\n              <span id=\"undertheleaves-puddle-count-").concat(playerId, "\">0</span>\n            </div>\n          </div>\n        </div>\n      ");
            this.game.bga.playerPanels.getElement(Number(playerId)).insertAdjacentHTML('beforeend', playerBoardHtml);
            this.counters[playerId].leaf.create("undertheleaves-leaf-count-".concat(playerId));
            this.counters[playerId].puddle.create("undertheleaves-puddle-count-".concat(playerId));
            this.counters[playerId].mushroom.create("undertheleaves-mushroom-count-".concat(playerId));
            this.counters[playerId].hummingbird.create("undertheleaves-hummingbird-count-".concat(playerId));
            this.counters[playerId].bee.create("undertheleaves-bee-count-".concat(playerId));
            this.counters[playerId].round.create("undertheleaves-round-count-".concat(playerId));
            var playerBeings = (_a = this.game.gamedatas.beings[playerId]) !== null && _a !== void 0 ? _a : [];
            var totals = playerBeings.reduce(function (acc, b) {
                var _a;
                acc[b.type] = ((_a = acc[b.type]) !== null && _a !== void 0 ? _a : 0) + b.count;
                return acc;
            }, {});
            this.counters[playerId].bee.setValue((_b = totals['bee']) !== null && _b !== void 0 ? _b : 0);
            this.counters[playerId].hummingbird.setValue((_c = totals['hummingbird']) !== null && _c !== void 0 ? _c : 0);
            this.counters[playerId].leaf.setValue((_d = totals['leaf']) !== null && _d !== void 0 ? _d : 0);
            this.counters[playerId].mushroom.setValue((_e = totals['mushroom']) !== null && _e !== void 0 ? _e : 0);
            this.counters[playerId].puddle.setValue((_f = totals['puddle']) !== null && _f !== void 0 ? _f : 0);
            this.counters[playerId].round.setValue((_h = (_g = this.game.gamedatas.gridTiles[Number(playerId)]) === null || _g === void 0 ? void 0 : _g.length) !== null && _h !== void 0 ? _h : 0);
        }
        document
            .getElementById("undertheleaves-player-board-round-".concat(this.game.gamedatas.firstPlayerId))
            .insertAdjacentHTML('beforeend', '<div id="undertheleaves-first-player" class="undertheleaves-first-player"/>');
        this.game.addTooltip('undertheleaves-first-player', '', _('This is the first player'));
    };
    PlayerManager.prototype.incCounter = function (playerId, type, by) {
        var _a, _b;
        (_b = (_a = this.counters[String(playerId)]) === null || _a === void 0 ? void 0 : _a[type]) === null || _b === void 0 ? void 0 : _b.incValue(by);
    };
    PlayerManager.prototype.onEnteringState = function (stateName, notif) {
        //
    };
    PlayerManager.prototype.onLeavingState = function (stateName) {
        //
    };
    PlayerManager.prototype.onUpdateActionButtons = function (stateName, args) {
        //
    };
    PlayerManager.prototype.setupNotifications = function () {
        var _this = this;
        dojo.subscribe('score', this, function (notif) { return _this.scoreNotif(notif); });
    };
    PlayerManager.prototype.scoreNotif = function (notif) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.game.scoreCtrl[notif.args.playerId].toValue(notif.args.playerScore);
                return [2 /*return*/];
            });
        });
    };
    return PlayerManager;
}());
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var BeingsManager = /** @class */ (function () {
    function BeingsManager(game) {
        this.game = game;
    }
    BeingsManager.prototype.setup = function () {
        var e_1, _a;
        for (var playerId in this.game.gamedatas.beings) {
            var playerBeings = this.game.gamedatas.beings[playerId];
            try {
                for (var playerBeings_1 = (e_1 = void 0, __values(playerBeings)), playerBeings_1_1 = playerBeings_1.next(); !playerBeings_1_1.done; playerBeings_1_1 = playerBeings_1.next()) {
                    var being = playerBeings_1_1.value;
                    if (being.type === 'hummingbird') {
                        this.renderHummingbird(being);
                    }
                    else if (being.type === 'leaf' && (being.subtype === 'thoughtful' || being.subtype === 'flirty')) {
                        var centerDiv = this.getOrCreateCornerDiv(being.playerId, being.cells);
                        for (var i = 0; i < being.count; i++) {
                            centerDiv === null || centerDiv === void 0 ? void 0 : centerDiv.insertAdjacentHTML('beforeend', this.formatPiece('leaf'));
                        }
                    }
                    else {
                        this.renderBeing(being);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (playerBeings_1_1 && !playerBeings_1_1.done && (_a = playerBeings_1.return)) _a.call(playerBeings_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    };
    BeingsManager.prototype.onEnteringState = function (stateName, notif) {
        //
    };
    BeingsManager.prototype.onLeavingState = function (stateName) {
        //
    };
    BeingsManager.prototype.onUpdateActionButtons = function (stateName, args) {
        //
    };
    BeingsManager.prototype.setupNotifications = function () {
        var _this = this;
        dojo.subscribe('arrivalBee', this, function (notif) { return _this.arrivalGenericNotif(notif); });
        dojo.subscribe('mergeBee', this, function (notif) { return _this.mergeBeeNotif(notif); });
        dojo.subscribe('arrivalHummingbird', this, function (notif) { return _this.arrivalHummingbirdNotif(notif); });
        dojo.subscribe('arrivalDiverPuddle', this, function (notif) { return _this.arrivalGenericNotif(notif); });
        dojo.subscribe('arrivalSkipperPuddle', this, function (notif) { return _this.arrivalGenericNotif(notif); });
        dojo.subscribe('arrivalShyPuddle', this, function (notif) { return _this.arrivalGenericNotif(notif); });
        dojo.subscribe('arrivalFriendlyPuddle', this, function (notif) { return _this.arrivalGenericNotif(notif); });
        dojo.subscribe('arrivalHostMushroom', this, function (notif) { return _this.arrivalGenericNotif(notif); });
        dojo.subscribe('arrivalExplorerMushroom', this, function (notif) { return _this.arrivalGenericNotif(notif); });
        dojo.subscribe('arrivalLonerMushroom', this, function (notif) { return _this.arrivalGenericNotif(notif); });
        dojo.subscribe('arrivalCollectorMushroom', this, function (notif) { return _this.arrivalGenericNotif(notif); });
        dojo.subscribe('arrivalThoughtfulLeaf', this, function (notif) { return _this.arrivalLeafDwellerNotif(notif); });
        dojo.subscribe('arrivalFlirtyLeaf', this, function (notif) { return _this.arrivalLeafDwellerNotif(notif); });
        dojo.subscribe('arrivalRestlessLeaf', this, function (notif) { return _this.arrivalGenericNotif(notif); });
        dojo.subscribe('arrivalRunnerLeaf', this, function (notif) { return _this.arrivalGenericNotif(notif); });
        dojo.subscribe('majorityBonus', this, function (notif) { return _this.majorityBonusNotif(notif); });
    };
    BeingsManager.prototype.renderBeing = function (being) {
        for (var i = 0; i < being.count; i++) {
            var cell = being.cells[i % being.cells.length];
            var terrainDiv = this.getTerrainDiv(being.playerId, cell);
            var centerDiv = terrainDiv === null || terrainDiv === void 0 ? void 0 : terrainDiv.querySelector('.undertheleaves-being-center-position');
            if (centerDiv) {
                centerDiv.insertAdjacentHTML('beforebegin', this.formatPiece(being.type));
            }
            else {
                terrainDiv === null || terrainDiv === void 0 ? void 0 : terrainDiv.insertAdjacentHTML('beforeend', this.formatPiece(being.type));
            }
        }
    };
    BeingsManager.prototype.renderHummingbird = function (being) {
        var centerDiv = this.getOrCreateCornerDiv(being.playerId, this.getTileCells(being.x, being.y));
        for (var i = 0; i < being.count; i++) {
            centerDiv === null || centerDiv === void 0 ? void 0 : centerDiv.insertAdjacentHTML('beforeend', this.formatPiece('hummingbird'));
        }
    };
    BeingsManager.prototype.getTileCells = function (x, y) {
        return [
            [x * 2, y * 2],
            [x * 2 + 1, y * 2],
            [x * 2, y * 2 - 1],
            [x * 2 + 1, y * 2 - 1],
        ];
    };
    BeingsManager.prototype.formatPiece = function (piece, id) {
        return "<div ".concat(id ? "id=".concat(id) : '', " class=\"undertheleaves-piece\" piece=\"").concat(piece, "\"></div>");
    };
    BeingsManager.prototype.getTerrainDiv = function (playerId, cell) {
        return document.querySelector("#undertheleaves-player-beings-".concat(playerId, " .undertheleaves-terrain[data-x='").concat(cell[0], "'][data-y='").concat(cell[1], "']"));
    };
    BeingsManager.prototype.countPiecesInSector = function (playerId, cells, pieceType) {
        var _this = this;
        return cells.reduce(function (acc, cell) {
            var _a, _b;
            var items = (_b = (_a = _this.getTerrainDiv(playerId, cell)) === null || _a === void 0 ? void 0 : _a.querySelectorAll(".undertheleaves-piece[piece=\"".concat(pieceType, "\"]"))) !== null && _b !== void 0 ? _b : [];
            return acc + items.length;
        }, 0);
    };
    BeingsManager.prototype.animatePieceFromVoid = function (pieceType, destElement) {
        return __awaiter(this, void 0, void 0, function () {
            var id, beingElement, animation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = generateId();
                        document
                            .getElementById('undertheleaves-general-void-stock')
                            .insertAdjacentHTML('beforeend', this.formatPiece(pieceType, id));
                        beingElement = document.getElementById(id);
                        animation = new BgaLocalAnimation(this.game);
                        animation.setWhere('afterbegin');
                        animation.setOptions(beingElement, destElement, 500);
                        return [4 /*yield*/, animation.call()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BeingsManager.prototype.getOrCreateCornerDiv = function (playerId, cells) {
        var minX = Math.min.apply(Math, __spreadArray([], __read(cells.map(function (c) { return c[0]; })), false));
        var minY = Math.min.apply(Math, __spreadArray([], __read(cells.map(function (c) { return c[1]; })), false));
        var id = "undertheleaves-being-center-".concat(playerId, "-").concat(minX, "-").concat(minY);
        var existing = document.getElementById(id);
        if (existing)
            return existing;
        var maxY = Math.max.apply(Math, __spreadArray([], __read(cells.map(function (c) { return c[1]; })), false));
        var topLeftCell = cells.filter(function (c) { return c[1] === maxY; }).sort(function (a, b) { return a[0] - b[0]; })[0];
        var terrainDiv = this.getTerrainDiv(playerId, topLeftCell);
        if (!terrainDiv)
            return null;
        var centerDiv = document.createElement('div');
        centerDiv.id = id;
        centerDiv.className = 'undertheleaves-being-center-position';
        terrainDiv.appendChild(centerDiv);
        return centerDiv;
    };
    BeingsManager.prototype.mergeBeeNotif = function (notif) {
        return __awaiter(this, void 0, void 0, function () {
            var existingPieces, cells;
            var _this = this;
            return __generator(this, function (_a) {
                existingPieces = [];
                notif.args.oldBeings.forEach(function (being) {
                    being.cells.forEach(function (cell) {
                        var _a;
                        (_a = _this.getTerrainDiv(notif.args.playerId, cell)) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.undertheleaves-piece[piece="bee"]').forEach(function (el) { return existingPieces.push(el); });
                    });
                });
                cells = notif.args.mergedBeing.cells;
                existingPieces.forEach(function (piece, i) {
                    var cell = cells[i % cells.length];
                    var beingPositionElement = _this.getTerrainDiv(notif.args.playerId, cell);
                    var animation = new BgaLocalAnimation(_this.game);
                    animation.setWhere('afterbegin');
                    animation.setOptions(piece, beingPositionElement, 300);
                    animation.call();
                });
                return [2 /*return*/];
            });
        });
    };
    BeingsManager.prototype.arrivalGenericNotif = function (notif) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, sector, countBeings, cellDestination, destElement, e_2_1;
            var e_2, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 5, 6, 7]);
                        _a = __values(notif.args.sectors), _b = _a.next();
                        _d.label = 1;
                    case 1:
                        if (!!_b.done) return [3 /*break*/, 4];
                        sector = _b.value;
                        countBeings = this.countPiecesInSector(notif.args.playerId, sector.cells, notif.args.being);
                        cellDestination = sector.cells[countBeings % sector.cells.length];
                        destElement = this.getTerrainDiv(notif.args.playerId, cellDestination);
                        if (!destElement)
                            return [3 /*break*/, 3];
                        return [4 /*yield*/, this.animatePieceFromVoid(notif.args.being, destElement)];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        _b = _a.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_2_1 = _d.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 7:
                        this.game.games.playerManager.incCounter(notif.args.playerId, notif.args.being, notif.args.sectors.length);
                        return [2 /*return*/];
                }
            });
        });
    };
    BeingsManager.prototype.arrivalLeafDwellerNotif = function (notif) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, sector, centerDiv, e_3_1;
            var e_3, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 5, 6, 7]);
                        _a = __values(notif.args.sectors), _b = _a.next();
                        _d.label = 1;
                    case 1:
                        if (!!_b.done) return [3 /*break*/, 4];
                        sector = _b.value;
                        centerDiv = this.getOrCreateCornerDiv(notif.args.playerId, sector.cells);
                        if (!centerDiv)
                            return [3 /*break*/, 3];
                        return [4 /*yield*/, this.animatePieceFromVoid('leaf', centerDiv)];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        _b = _a.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_3_1 = _d.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_3) throw e_3.error; }
                        return [7 /*endfinally*/];
                    case 7:
                        this.game.games.playerManager.incCounter(notif.args.playerId, 'leaf', notif.args.sectors.length);
                        return [2 /*return*/];
                }
            });
        });
    };
    BeingsManager.prototype.arrivalHummingbirdNotif = function (notif) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, tile, nestBox, i, e_4_1, totalDelta;
            var e_4, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 7, 8, 9]);
                        _a = __values(notif.args.tiles), _b = _a.next();
                        _d.label = 1;
                    case 1:
                        if (!!_b.done) return [3 /*break*/, 6];
                        tile = _b.value;
                        nestBox = this.getOrCreateCornerDiv(notif.args.playerId, this.getTileCells(tile.x, tile.y));
                        i = 0;
                        _d.label = 2;
                    case 2:
                        if (!(i < tile.delta)) return [3 /*break*/, 5];
                        if (!nestBox)
                            return [3 /*break*/, 4];
                        return [4 /*yield*/, this.animatePieceFromVoid('hummingbird', nestBox)];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5:
                        _b = _a.next();
                        return [3 /*break*/, 1];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_4_1 = _d.sent();
                        e_4 = { error: e_4_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_4) throw e_4.error; }
                        return [7 /*endfinally*/];
                    case 9:
                        totalDelta = notif.args.tiles.reduce(function (sum, t) { return sum + t.delta; }, 0);
                        this.game.games.playerManager.incCounter(notif.args.playerId, 'hummingbird', totalDelta);
                        return [2 /*return*/];
                }
            });
        });
    };
    BeingsManager.prototype.majorityBonusNotif = function (notif) {
        return __awaiter(this, void 0, void 0, function () {
            var pieceType, isCornerLeaf, i, centerDiv, cell, destBox;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pieceType = notif.args.type.replace('_dweller', '');
                        isCornerLeaf = notif.args.type === 'leaf' && (notif.args.subtype === 'thoughtful' || notif.args.subtype === 'flirty');
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < notif.args.count)) return [3 /*break*/, 6];
                        if (!isCornerLeaf) return [3 /*break*/, 3];
                        centerDiv = this.getOrCreateCornerDiv(notif.args.playerId, notif.args.cells);
                        if (!centerDiv)
                            return [3 /*break*/, 5];
                        return [4 /*yield*/, this.animatePieceFromVoid(pieceType, centerDiv)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        cell = notif.args.cells[i % notif.args.cells.length];
                        destBox = this.getTerrainDiv(notif.args.playerId, cell);
                        if (!destBox)
                            return [3 /*break*/, 5];
                        return [4 /*yield*/, this.animatePieceFromVoid(pieceType, destBox)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6:
                        this.game.games.playerManager.incCounter(notif.args.playerId, notif.args.type, notif.args.count);
                        return [2 /*return*/];
                }
            });
        });
    };
    return BeingsManager;
}());
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var PlaceTile = /** @class */ (function () {
    function PlaceTile(game) {
        this.game = game;
        this.isAnimating = false;
        this.handlers = [];
    }
    PlaceTile.prototype.setup = function () {
        //
    };
    PlaceTile.prototype.onEnteringState = function (stateName, notif) {
        var _this = this;
        if (stateName === 'PlaceTile' && this.game.bga.players.isCurrentPlayerActive()) {
            this.game.bga.states.setClientState('client_SelectTile', {
                descriptionmyturn: _('${you} must select a garden tile'),
            });
        }
        else if (stateName === 'client_SelectTile') {
            this.game.games.tileManager.showOfferCardSelectable(function (tileId) {
                _this.externalTileSelected = { x: null, y: null, rotation: 0, inverse: false, tileId: tileId };
                _this.game.bga.states.setClientState('client_PlaceTile', {
                    descriptionmyturn: _('${you} must place a garden tile'),
                });
            });
        }
        else if (stateName === 'client_PlaceTile') {
            this.game.games.tileManager.removeOfferCardSelectable();
            var tileElement = this.game.games.tileManager.getTileById(this.externalTileSelected.tileId);
            tileElement.classList.add('selected');
            this.handlers.push(dojo.connect(tileElement, 'onclick', function () { return _this.onClickChangeDirection('right'); }));
            this.showSelectExternals(notif.args.tableTiles);
        }
    };
    PlaceTile.prototype.onUpdateActionButtons = function (stateName, args) {
        var _this = this;
        if (stateName === 'client_MoveTile') {
            this.game.statusBar.addActionButton(_('Place tile'), function () { return _this.onClick(); });
        }
        if (stateName === 'client_PlaceTile' || stateName === 'client_MoveTile') {
            this.game.statusBar.addActionButton('<i class="fa6 fa6-rotate-right"></i>', function () { return _this.onClickChangeDirection('right'); }, { color: 'secondary' });
            this.game.statusBar.addActionButton('<i class="fa6 fa6-rotate-left"></i>', function () { return _this.onClickChangeDirection('left'); }, { color: 'secondary' });
            this.game.statusBar.addActionButton('<i class="fa6 fa6-right-left"></i>', function () { return _this.onClickChangeDirection('inverse'); }, { color: 'secondary' });
            this.game.statusBar.addActionButton(_('Cancel'), function () { return _this.onClickCancel(); }, {
                color: 'alert',
            });
        }
    };
    PlaceTile.prototype.onLeavingState = function (stateName) {
        //
    };
    PlaceTile.prototype.setupNotifications = function () {
        var _this = this;
        dojo.subscribe('revealTile', this, function (notif) { return _this.revealTileNotif(notif); });
        dojo.subscribe('placeTile', this, function (notif) { return _this.placeTileNotif(notif); });
    };
    PlaceTile.prototype.showSelectExternals = function (tiles) {
        var _this = this;
        var dirs = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
        ];
        var tileMap = new Set(tiles.map(function (t) { return "".concat(t.x, ",").concat(t.y); }));
        var externalsMap = [];
        var playerId = this.game.bga.players.getCurrentPlayerId();
        var gridBoxDiv = this.game.games.tileManager.getGridBoxDiv(playerId);
        gridBoxDiv.querySelectorAll('.undertheleaves-player-cell').forEach(function (cell) {
            if (cell.childNodes.length === 0)
                cell.remove();
        });
        tiles.forEach(function (tile) {
            dirs.forEach(function (_a) {
                var _b = __read(_a, 2), dx = _b[0], dy = _b[1];
                var x = tile.x + dx;
                var y = tile.y + dy;
                var key = "".concat(x, ",").concat(y);
                if (!tileMap.has(key)) {
                    tileMap.add(key);
                    externalsMap.push({ x: x, y: y });
                }
            });
        });
        var externalsSet = new Set(externalsMap.map(function (p) { return "".concat(p.x, ",").concat(p.y); }));
        externalsMap.forEach(function (pos) {
            var element = gridBoxDiv.querySelector(".undertheleaves-player-cell[data-x=\"".concat(pos.x, "\"][data-y=\"").concat(pos.y, "\"]"));
            if (!element) {
                gridBoxDiv.insertAdjacentHTML('beforeend', "<div class=\"undertheleaves-player-cell selectable\" data-x=".concat(pos.x, " data-y=").concat(pos.y, "></div>"));
                element = gridBoxDiv.querySelector(".undertheleaves-player-cell[data-x=\"".concat(pos.x, "\"][data-y=\"").concat(pos.y, "\"]"));
            }
            else {
                element.classList.add('selectable');
            }
            if (!externalsSet.has("".concat(pos.x, ",").concat(pos.y + 1)))
                element.classList.add('selectable-border-top');
            if (!externalsSet.has("".concat(pos.x - 1, ",").concat(pos.y)))
                element.classList.add('selectable-border-left');
            _this.handlers.push(dojo.connect(element, 'onclick', function () { return __awaiter(_this, void 0, void 0, function () {
                var tileElement;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.externalTileSelected && (this.externalTileSelected.x != pos.x || this.externalTileSelected.y != pos.y))) return [3 /*break*/, 2];
                            this.externalTileSelected.x = pos.x;
                            this.externalTileSelected.y = pos.y;
                            return [4 /*yield*/, this.moveTileSelected(this.externalTileSelected.tileId)];
                        case 1:
                            _a.sent();
                            tileElement = this.game.games.tileManager.getTileById(this.externalTileSelected.tileId);
                            tileElement.querySelectorAll('.undertheleaves-terrain').forEach(function (item) { return item.remove(); });
                            tileElement.insertAdjacentHTML('beforeend', this.game.games.tileManager.formatBeingPositions(pos.x, pos.y));
                            this.game.bga.states.setClientState('client_MoveTile', {
                                descriptionmyturn: _('${you} must place a garden tile'),
                            });
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); }));
        });
        this.game.games.tileManager.recalculateGrid(playerId);
        this.game.games.tileManager.applyZoom(Number(playerId), false);
    };
    PlaceTile.prototype.removeSelectExternals = function () {
        return __awaiter(this, void 0, void 0, function () {
            var playerId;
            return __generator(this, function (_a) {
                this.handlers.forEach(function (h) { return dojo.disconnect(h); });
                this.handlers = [];
                playerId = this.game.bga.players.getCurrentPlayerId();
                this.game.games.tileManager
                    .getGridBoxDiv(playerId)
                    .querySelectorAll('.selectable')
                    .forEach(function (item) { return item.classList.remove('selectable'); });
                this.game.games.tileManager.recalculateGrid(playerId);
                this.game.games.tileManager.applyZoom(playerId, false);
                return [2 /*return*/];
            });
        });
    };
    PlaceTile.prototype.onClick = function () {
        var _this = this;
        var rotation = ((this.externalTileSelected.rotation % 360) + 360) % 360;
        var tileId = this.externalTileSelected.tileId;
        this.game.bga.actions.performAction('actPlaceTile', __assign(__assign({}, this.externalTileSelected), { rotation: rotation })).then(function () {
            var _a;
            (_a = _this.game.games.tileManager.getTileById(tileId)) === null || _a === void 0 ? void 0 : _a.classList.remove('selected');
            _this.externalTileSelected = null;
            _this.removeSelectExternals();
        });
    };
    PlaceTile.prototype.onClickCancel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tileElement, offerElement, animation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tileElement = this.game.games.tileManager.getTileById(this.externalTileSelected.tileId);
                        offerElement = document.getElementById('undertheleaves-offer');
                        tileElement.classList.remove('selected');
                        if (!(tileElement.parentElement.id !== 'undertheleaves-offer')) return [3 /*break*/, 2];
                        animation = new BgaLocalAnimation(this.game);
                        animation.setOptions(tileElement, offerElement, 500);
                        return [4 /*yield*/, animation.call()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        tileElement.querySelector('.undertheleaves-tile-box').style.transform = "rotate(0deg)";
                        tileElement.querySelector('.undertheleaves-tile-flipper').style.transform = '';
                        this.externalTileSelected = null;
                        this.removeSelectExternals();
                        this.game.bga.states.setClientState('client_SelectTile', {
                            descriptionmyturn: _('${you} must select a garden tile'),
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    PlaceTile.prototype.onClickChangeDirection = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var tileElement, flipper, rotationDelta;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isAnimating)
                            return [2 /*return*/];
                        tileElement = this.game.games.tileManager.getBoxTileById(this.externalTileSelected.tileId);
                        flipper = this.game.games.tileManager.getFlipperTileById(this.externalTileSelected.tileId);
                        this.isAnimating = true;
                        rotationDelta = this.externalTileSelected.inverse ? -90 : 90;
                        if (type === 'right')
                            this.externalTileSelected.rotation += rotationDelta;
                        if (type === 'left')
                            this.externalTileSelected.rotation -= rotationDelta;
                        if (type === 'inverse')
                            this.externalTileSelected.inverse = !this.externalTileSelected.inverse;
                        tileElement.style.transform = "rotate(".concat(this.externalTileSelected.rotation, "deg)");
                        flipper.style.transform = this.externalTileSelected.inverse ? 'rotateY(180deg)' : '';
                        return [4 /*yield*/, delayTime(300)];
                    case 1:
                        _a.sent();
                        this.isAnimating = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    PlaceTile.prototype.moveTileSelected = function (tileSelectedId) {
        return __awaiter(this, void 0, void 0, function () {
            var playerId, tileElement, externalTileSelectedElement, animation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        playerId = this.game.bga.players.getCurrentPlayerId();
                        tileElement = this.game.games.tileManager.getTileById(tileSelectedId);
                        externalTileSelectedElement = this.game.games.tileManager
                            .getGridBoxDiv(playerId)
                            .querySelector(".undertheleaves-player-cell[data-x=\"".concat(this.externalTileSelected.x, "\"][data-y=\"").concat(this.externalTileSelected.y, "\"]"));
                        animation = new BgaLocalAnimation(this.game);
                        animation.setOptions(tileElement, externalTileSelectedElement, 500);
                        return [4 /*yield*/, animation.call()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PlaceTile.prototype.revealTileNotif = function (notif) {
        return __awaiter(this, void 0, void 0, function () {
            var offerElement, tileSelectedElement, animation;
            var _this = this;
            return __generator(this, function (_a) {
                document
                    .getElementById('undertheleaves-bag')
                    .insertAdjacentHTML('beforeend', this.game.games.tileManager.formatTile(notif.args.tile));
                offerElement = document.getElementById('undertheleaves-offer');
                tileSelectedElement = this.game.games.tileManager.getTileById(notif.args.tile.id);
                animation = new BgaLocalAnimation(this.game);
                animation.setWhere('afterbegin');
                animation.setOptions(tileSelectedElement, offerElement, 500);
                animation.call().then(function () { return _this.game.games.tileManager.deckCounter.incValue(-1); });
                return [2 /*return*/];
            });
        });
    };
    PlaceTile.prototype.placeTileNotif = function (notif) {
        return __awaiter(this, void 0, void 0, function () {
            var tileElement, alreadyInGrid, tileBoxElement, flipperElement, playerGridBoxElement, externalElement, animation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tileElement = this.game.games.tileManager.getTileById(notif.args.gridTile.tile.id);
                        alreadyInGrid = !!(tileElement === null || tileElement === void 0 ? void 0 : tileElement.closest('.undertheleaves-player-cell'));
                        if (!!alreadyInGrid) return [3 /*break*/, 3];
                        tileBoxElement = this.game.games.tileManager.getBoxTileById(notif.args.gridTile.tile.id);
                        flipperElement = this.game.games.tileManager.getFlipperTileById(notif.args.gridTile.tile.id);
                        tileBoxElement.style.transform = "rotate(".concat(notif.args.gridTile.rotation, "deg)");
                        flipperElement.style.transform = notif.args.gridTile.side == 1 ? 'rotateY(180deg)' : '';
                        playerGridBoxElement = this.game.games.tileManager.getGridBoxDiv(notif.args.playerId);
                        if (!playerGridBoxElement.querySelector(".undertheleaves-player-cell[data-x=\"".concat(notif.args.gridTile.x, "\"][data-y=\"").concat(notif.args.gridTile.y, "\"]"))) {
                            this.game.games.tileManager
                                .getGridBoxDiv(notif.args.playerId)
                                .insertAdjacentHTML('afterbegin', "<div class=\"undertheleaves-player-cell selectable\" data-x=\"".concat(notif.args.gridTile.x, "\" data-y=\"").concat(notif.args.gridTile.y, "\"></div>"));
                        }
                        this.game.games.tileManager.recalculateGrid(notif.args.playerId);
                        this.game.games.tileManager.applyZoom(notif.args.playerId);
                        this.game.games.tileManager.addTileToBeingsOverlay(notif.args.gridTile, notif.args.playerId);
                        return [4 /*yield*/, delayTime(300)];
                    case 1:
                        _a.sent();
                        externalElement = playerGridBoxElement.querySelector(".undertheleaves-player-cell[data-x=\"".concat(notif.args.gridTile.x, "\"][data-y=\"").concat(notif.args.gridTile.y, "\"]"));
                        animation = new BgaLocalAnimation(this.game);
                        animation.setWhere('afterbegin');
                        animation.setOptions(tileElement, externalElement, 700);
                        return [4 /*yield*/, animation.call()];
                    case 2:
                        _a.sent();
                        externalElement.classList.remove('selectable');
                        return [3 /*break*/, 4];
                    case 3:
                        this.game.games.tileManager.addTileToBeingsOverlay(notif.args.gridTile, notif.args.playerId);
                        _a.label = 4;
                    case 4:
                        this.game.games.playerManager.incCounter(notif.args.playerId, 'round', 1);
                        return [2 /*return*/];
                }
            });
        });
    };
    return PlaceTile;
}());
var ChooseBeing = /** @class */ (function () {
    function ChooseBeing(game) {
        this.game = game;
        this.handlers = [];
    }
    ChooseBeing.prototype.setup = function () {
        //
    };
    ChooseBeing.prototype.onEnteringState = function (stateName, notif) {
        var _this = this;
        if (stateName === 'ChooseBeing' && this.game.bga.players.isCurrentPlayerActive()) {
            this.game.bga.states.setClientState('client_ChooseBeing', {
                descriptionmyturn: _('${you} must choose a dweller'),
            });
        }
        else if (stateName === 'client_ChooseBeing') {
            var beingTypes = Object.keys(notif.args.beings);
            if (beingTypes.length == 1 && notif.args.beings[beingTypes[0]].length == 1) {
                this.chooseTerrain(beingTypes[0], notif.args.beings[beingTypes[0]][0], notif.args);
            }
        }
        else if (stateName === 'client_ChooseTerrain') {
            var playerId_1 = this.game.bga.players.getActivePlayerId();
            document.getElementById("undertheleaves-player-beings-".concat(playerId_1)).classList.add('selectable');
            notif.args.beingTerrains.forEach(function (terrain) {
                var terrainDiv = _this.game.games.beingsManager.getTerrainDiv(playerId_1, terrain);
                terrainDiv.classList.add('selectable');
                _this.handlers.push(dojo.connect(terrainDiv, 'onclick', function () {
                    var _a, _b;
                    if (_this.terrainSelected) {
                        _this.terrainSelected.classList.remove('selected');
                    }
                    if (((_a = _this.terrainSelected) === null || _a === void 0 ? void 0 : _a.dataset.x) == terrainDiv.dataset.x &&
                        ((_b = _this.terrainSelected) === null || _b === void 0 ? void 0 : _b.dataset.y) == terrainDiv.dataset.y) {
                        _this.terrainSelected = null;
                    }
                    else {
                        terrainDiv.classList.add('selected');
                        _this.terrainSelected = terrainDiv;
                    }
                    _this.actionButton.disabled = !_this.terrainSelected;
                }));
            });
        }
    };
    ChooseBeing.prototype.onLeavingState = function (stateName) {
        if (stateName === 'ChooseBeing') {
            this.cleanupTerrain();
        }
    };
    ChooseBeing.prototype.cleanupTerrain = function () {
        var playerId = this.game.bga.players.getActivePlayerId();
        this.handlers.forEach(function (h) { return dojo.disconnect(h); });
        this.handlers = [];
        document
            .querySelectorAll('.undertheleaves-terrain.selectable, .undertheleaves-terrain.selected')
            .forEach(function (el) { return el.classList.remove('selectable', 'selected'); });
        this.terrainSelected = null;
        this.actionButton = null;
        document.getElementById("undertheleaves-player-beings-".concat(playerId)).classList.remove('selectable');
    };
    ChooseBeing.prototype.onUpdateActionButtons = function (stateName, args) {
        var _this = this;
        if (stateName === 'client_ChooseBeing') {
            var _loop_1 = function (beingType) {
                args.beings[beingType].forEach(function (terrains) {
                    _this.game.statusBar.addActionButton(_this.game.games.beingsManager.formatPiece(beingType), function () { return _this.chooseTerrain(beingType, terrains, args); }, { color: 'secondary' });
                });
            };
            for (var beingType in args.beings) {
                _loop_1(beingType);
            }
            this.game.statusBar.addActionButton(_('Restart'), function () { return _this.onClickRestart(); }, { color: 'alert' });
        }
        else if (stateName === 'client_ChooseTerrain') {
            this.actionButton = this.game.statusBar.addActionButton(_('Place the dweller'), function () { return _this.onClickTerrain(args.beingType); }, { disabled: true });
            this.game.statusBar.addActionButton(_('Restart'), function () { return _this.onClickRestart(); }, { color: 'alert' });
        }
    };
    ChooseBeing.prototype.setupNotifications = function () {
        //
    };
    ChooseBeing.prototype.chooseTerrain = function (beingType, beingTerrains, args) {
        this.game.bga.states.setClientState('client_ChooseTerrain', {
            descriptionmyturn: _('${you} must choose a plot of land for ${being_icon}'),
            args: __assign(__assign({}, args), { beingType: beingType, beingTerrains: beingTerrains, being_icon: beingType }),
        });
    };
    ChooseBeing.prototype.onClickRestart = function () {
        this.game.bga.actions.performAction('actChooseBeingRestart');
    };
    ChooseBeing.prototype.onClickTerrain = function (beingType) {
        var _this = this;
        var x = parseInt(this.terrainSelected.dataset.x);
        var y = parseInt(this.terrainSelected.dataset.y);
        this.game.bga.actions.performAction('actChooseBeing', { beingType: beingType, x: x, y: y }).then(function () { return _this.cleanupTerrain(); });
    };
    return ChooseBeing;
}());
var BgaAnimation = /** @class */ (function () {
    function BgaAnimation(animationFunction, settings) {
        this.animationFunction = animationFunction;
        this.settings = settings;
        this.played = null;
        this.result = null;
        this.playWhenNoAnimation = false;
    }
    return BgaAnimation;
}());
/**
 * Just use playSequence from animationManager
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function attachWithAnimation(animationManager, animation) {
    var _a;
    var settings = animation.settings;
    var element = settings.animation.settings.element;
    var fromRect = animationManager.game.getBoundingClientRectIgnoreZoom(element);
    settings.animation.settings.fromRect = fromRect;
    settings.attachElement.insertAdjacentElement(settings.where, element);
    (_a = settings.afterAttach) === null || _a === void 0 ? void 0 : _a.call(settings, element, settings.attachElement);
    return animationManager.play(settings.animation);
}
var BgaAttachWithAnimation = /** @class */ (function (_super) {
    __extends(BgaAttachWithAnimation, _super);
    function BgaAttachWithAnimation(settings) {
        var _this = _super.call(this, attachWithAnimation, settings) || this;
        _this.playWhenNoAnimation = true;
        return _this;
    }
    return BgaAttachWithAnimation;
}(BgaAnimation));
/**
 * Just use playSequence from animationManager
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function cumulatedAnimations(animationManager, animation) {
    return animationManager.playSequence(animation.settings.animations);
}
var BgaCumulatedAnimation = /** @class */ (function (_super) {
    __extends(BgaCumulatedAnimation, _super);
    function BgaCumulatedAnimation(settings) {
        var _this = _super.call(this, cumulatedAnimations, settings) || this;
        _this.playWhenNoAnimation = true;
        return _this;
    }
    return BgaCumulatedAnimation;
}(BgaAnimation));
/**
 * Just does nothing for the duration
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function pauseAnimation(animationManager, animation) {
    var promise = new Promise(function (success) {
        var _a;
        var settings = animation.settings;
        var duration = (_a = settings === null || settings === void 0 ? void 0 : settings.duration) !== null && _a !== void 0 ? _a : 500;
        setTimeout(function () { return success(); }, duration);
    });
    return promise;
}
var BgaPauseAnimation = /** @class */ (function (_super) {
    __extends(BgaPauseAnimation, _super);
    function BgaPauseAnimation(settings) {
        return _super.call(this, pauseAnimation, settings) || this;
    }
    return BgaPauseAnimation;
}(BgaAnimation));
/**
 * Show the element at the center of the screen
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function showScreenCenterAnimation(animationManager, animation) {
    var promise = new Promise(function (success) {
        var _a, _b, _c, _d;
        var settings = animation.settings;
        var element = settings.element;
        var elementBR = animationManager.game.getBoundingClientRectIgnoreZoom(element);
        var xCenter = (elementBR.left + elementBR.right) / 2;
        var yCenter = (elementBR.top + elementBR.bottom) / 2;
        var x = xCenter - (window.innerWidth / 2);
        var y = yCenter - (window.innerHeight / 2);
        var duration = (_a = settings === null || settings === void 0 ? void 0 : settings.duration) !== null && _a !== void 0 ? _a : 500;
        var originalZIndex = element.style.zIndex;
        var originalTransition = element.style.transition;
        var transitionTimingFunction = (_b = settings.transitionTimingFunction) !== null && _b !== void 0 ? _b : 'linear';
        element.style.zIndex = "".concat((_c = settings === null || settings === void 0 ? void 0 : settings.zIndex) !== null && _c !== void 0 ? _c : 10);
        var timeoutId = null;
        var cleanOnTransitionEnd = function () {
            element.style.zIndex = originalZIndex;
            element.style.transition = originalTransition;
            success();
            element.removeEventListener('transitioncancel', cleanOnTransitionEnd);
            element.removeEventListener('transitionend', cleanOnTransitionEnd);
            document.removeEventListener('visibilitychange', cleanOnTransitionEnd);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
        var cleanOnTransitionCancel = function () {
            var _a;
            element.style.transition = "";
            element.offsetHeight;
            element.style.transform = (_a = settings === null || settings === void 0 ? void 0 : settings.finalTransform) !== null && _a !== void 0 ? _a : null;
            element.offsetHeight;
            cleanOnTransitionEnd();
        };
        element.addEventListener('transitioncancel', cleanOnTransitionEnd);
        element.addEventListener('transitionend', cleanOnTransitionEnd);
        document.addEventListener('visibilitychange', cleanOnTransitionCancel);
        element.offsetHeight;
        element.style.transition = "transform ".concat(duration, "ms ").concat(transitionTimingFunction);
        element.offsetHeight;
        element.style.transform = "translate(".concat(-x, "px, ").concat(-y, "px) rotate(").concat((_d = settings === null || settings === void 0 ? void 0 : settings.rotationDelta) !== null && _d !== void 0 ? _d : 0, "deg)");
        // safety in case transitionend and transitioncancel are not called
        timeoutId = setTimeout(cleanOnTransitionEnd, duration + 100);
    });
    return promise;
}
var BgaShowScreenCenterAnimation = /** @class */ (function (_super) {
    __extends(BgaShowScreenCenterAnimation, _super);
    function BgaShowScreenCenterAnimation(settings) {
        return _super.call(this, showScreenCenterAnimation, settings) || this;
    }
    return BgaShowScreenCenterAnimation;
}(BgaAnimation));
/**
 * Slide of the element from origin to destination.
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function slideAnimation(animationManager, animation) {
    var promise = new Promise(function (success) {
        var _a, _b, _c, _d, _e, _f;
        var settings = animation.settings;
        var element = settings.element;
        var _g = getDeltaCoordinates(element, settings, animationManager), x = _g.x, y = _g.y;
        var duration = (_a = settings.duration) !== null && _a !== void 0 ? _a : 500;
        var originalZIndex = element.style.zIndex;
        var originalTransition = element.style.transition;
        var transitionTimingFunction = (_b = settings.transitionTimingFunction) !== null && _b !== void 0 ? _b : 'linear';
        element.style.zIndex = "".concat((_c = settings === null || settings === void 0 ? void 0 : settings.zIndex) !== null && _c !== void 0 ? _c : 10);
        element.style.transition = null;
        element.offsetHeight;
        if ((settings === null || settings === void 0 ? void 0 : settings.rotationDelta) === 90) {
            element.style.transform = "translate(".concat(y, "px, ").concat(-x, "px) rotate(").concat((_d = settings === null || settings === void 0 ? void 0 : settings.rotationDelta) !== null && _d !== void 0 ? _d : 0, "deg)");
        }
        else {
            element.style.transform = "translate(".concat(-x, "px, ").concat(-y, "px) rotate(").concat((_e = settings === null || settings === void 0 ? void 0 : settings.rotationDelta) !== null && _e !== void 0 ? _e : 0, "deg)");
        }
        var timeoutId = null;
        var cleanOnTransitionEnd = function () {
            element.style.zIndex = originalZIndex;
            element.style.transition = originalTransition;
            success();
            element.removeEventListener('transitioncancel', cleanOnTransitionEnd);
            element.removeEventListener('transitionend', cleanOnTransitionEnd);
            document.removeEventListener('visibilitychange', cleanOnTransitionEnd);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
        var cleanOnTransitionCancel = function () {
            var _a;
            element.style.transition = "";
            element.offsetHeight;
            element.style.transform = (_a = settings === null || settings === void 0 ? void 0 : settings.finalTransform) !== null && _a !== void 0 ? _a : null;
            element.offsetHeight;
            cleanOnTransitionEnd();
        };
        element.addEventListener('transitioncancel', cleanOnTransitionCancel);
        element.addEventListener('transitionend', cleanOnTransitionEnd);
        document.addEventListener('visibilitychange', cleanOnTransitionCancel);
        element.offsetHeight;
        element.style.transition = "transform ".concat(duration, "ms ").concat(transitionTimingFunction);
        element.offsetHeight;
        element.style.transform = (_f = settings === null || settings === void 0 ? void 0 : settings.finalTransform) !== null && _f !== void 0 ? _f : null;
        // safety in case transitionend and transitioncancel are not called
        timeoutId = setTimeout(cleanOnTransitionEnd, duration + 100);
    });
    return promise;
}
var BgaSlideAnimation = /** @class */ (function (_super) {
    __extends(BgaSlideAnimation, _super);
    function BgaSlideAnimation(settings) {
        return _super.call(this, slideAnimation, settings) || this;
    }
    return BgaSlideAnimation;
}(BgaAnimation));
/**
 * Slide of the element from destination to origin.
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function slideToAnimation(animationManager, animation) {
    var promise = new Promise(function (success) {
        var _a, _b, _c, _d, _e;
        var settings = animation.settings;
        var element = settings.element;
        var _f = getDeltaCoordinates(element, settings, animationManager), x = _f.x, y = _f.y;
        var duration = (_a = settings === null || settings === void 0 ? void 0 : settings.duration) !== null && _a !== void 0 ? _a : 500;
        var originalZIndex = element.style.zIndex;
        var originalTransition = element.style.transition;
        var transitionTimingFunction = (_b = settings.transitionTimingFunction) !== null && _b !== void 0 ? _b : 'linear';
        element.style.zIndex = "".concat((_c = settings === null || settings === void 0 ? void 0 : settings.zIndex) !== null && _c !== void 0 ? _c : 10);
        var timeoutId = null;
        var cleanOnTransitionEnd = function () {
            element.style.zIndex = originalZIndex;
            element.style.transition = originalTransition;
            success();
            element.removeEventListener('transitioncancel', cleanOnTransitionEnd);
            element.removeEventListener('transitionend', cleanOnTransitionEnd);
            document.removeEventListener('visibilitychange', cleanOnTransitionEnd);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
        var cleanOnTransitionCancel = function () {
            var _a;
            element.style.transition = "";
            element.offsetHeight;
            element.style.transform = (_a = settings === null || settings === void 0 ? void 0 : settings.finalTransform) !== null && _a !== void 0 ? _a : null;
            element.offsetHeight;
            cleanOnTransitionEnd();
        };
        element.addEventListener('transitioncancel', cleanOnTransitionEnd);
        element.addEventListener('transitionend', cleanOnTransitionEnd);
        document.addEventListener('visibilitychange', cleanOnTransitionCancel);
        element.offsetHeight;
        element.style.transition = "transform ".concat(duration, "ms ").concat(transitionTimingFunction);
        element.offsetHeight;
        element.style.transform = "translate(".concat(-x, "px, ").concat(-y, "px) rotate(").concat((_d = settings === null || settings === void 0 ? void 0 : settings.rotationDelta) !== null && _d !== void 0 ? _d : 0, "deg) scale(").concat((_e = settings.scale) !== null && _e !== void 0 ? _e : 1, ")");
        // safety in case transitionend and transitioncancel are not called
        timeoutId = setTimeout(cleanOnTransitionEnd, duration + 100);
    });
    return promise;
}
var BgaSlideToAnimation = /** @class */ (function (_super) {
    __extends(BgaSlideToAnimation, _super);
    function BgaSlideToAnimation(settings) {
        return _super.call(this, slideToAnimation, settings) || this;
    }
    return BgaSlideToAnimation;
}(BgaAnimation));
function shouldAnimate(settings) {
    var _a;
    return document.visibilityState !== 'hidden' && !((_a = settings === null || settings === void 0 ? void 0 : settings.game) === null || _a === void 0 ? void 0 : _a.instantaneousMode);
}
/**
 * Return the x and y delta, based on the animation settings;
 *
 * @param settings an `AnimationSettings` object
 * @returns a promise when animation ends
 */
function getDeltaCoordinates(element, settings, animationManager) {
    var _a;
    if (!settings.fromDelta && !settings.fromRect && !settings.fromElement) {
        throw new Error("[bga-animation] fromDelta, fromRect or fromElement need to be set");
    }
    var x = 0;
    var y = 0;
    if (settings.fromDelta) {
        x = settings.fromDelta.x;
        y = settings.fromDelta.y;
    }
    else {
        var originBR = (_a = settings.fromRect) !== null && _a !== void 0 ? _a : animationManager.game.getBoundingClientRectIgnoreZoom(settings.fromElement);
        // TODO make it an option ?
        var originalTransform = element.style.transform;
        element.style.transform = '';
        var destinationBR = animationManager.game.getBoundingClientRectIgnoreZoom(element);
        element.style.transform = originalTransform;
        x = (destinationBR.left + destinationBR.right) / 2 - (originBR.left + originBR.right) / 2;
        y = (destinationBR.top + destinationBR.bottom) / 2 - (originBR.top + originBR.bottom) / 2;
    }
    if (settings.scale) {
        x /= settings.scale;
        y /= settings.scale;
    }
    return { x: x, y: y };
}
function logAnimation(animationManager, animation) {
    var settings = animation.settings;
    var element = settings.element;
    if (element) {
        console.log(animation, settings, element, element.getBoundingClientRect(), animationManager.game.getBoundingClientRectIgnoreZoom(element), element.style.transform);
    }
    else {
        console.log(animation, settings);
    }
    return Promise.resolve(false);
}
var AnimationManager = /** @class */ (function () {
    /**
     * @param game the BGA game class, usually it will be `this`
     * @param settings: a `AnimationManagerSettings` object
     */
    function AnimationManager(game, settings) {
        this.game = game;
        this.settings = settings;
        this.zoomManager = settings === null || settings === void 0 ? void 0 : settings.zoomManager;
        if (!game) {
            throw new Error('You must set your game as the first parameter of AnimationManager');
        }
    }
    AnimationManager.prototype.getZoomManager = function () {
        return this.zoomManager;
    };
    /**
     * Set the zoom manager, to get the scale of the current game.
     *
     * @param zoomManager the zoom manager
     */
    AnimationManager.prototype.setZoomManager = function (zoomManager) {
        this.zoomManager = zoomManager;
    };
    AnimationManager.prototype.getSettings = function () {
        return this.settings;
    };
    /**
     * Returns if the animations are active. Animation aren't active when the window is not visible (`document.visibilityState === 'hidden'`), or `game.instantaneousMode` is true.
     *
     * @returns if the animations are active.
     */
    AnimationManager.prototype.animationsActive = function () {
        return document.visibilityState !== 'hidden' && !this.game.instantaneousMode;
    };
    /**
     * Plays an animation if the animations are active. Animation aren't active when the window is not visible (`document.visibilityState === 'hidden'`), or `game.instantaneousMode` is true.
     *
     * @param animation the animation to play
     * @returns the animation promise.
     */
    AnimationManager.prototype.play = function (animation) {
        return __awaiter(this, void 0, void 0, function () {
            var settings, _a;
            var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
            return __generator(this, function (_s) {
                switch (_s.label) {
                    case 0:
                        animation.played = animation.playWhenNoAnimation || this.animationsActive();
                        if (!animation.played) return [3 /*break*/, 2];
                        settings = animation.settings;
                        (_b = settings.animationStart) === null || _b === void 0 ? void 0 : _b.call(settings, animation);
                        (_c = settings.element) === null || _c === void 0 ? void 0 : _c.classList.add((_d = settings.animationClass) !== null && _d !== void 0 ? _d : 'bga-animations_animated');
                        animation.settings = __assign({ duration: (_h = (_f = (_e = animation.settings) === null || _e === void 0 ? void 0 : _e.duration) !== null && _f !== void 0 ? _f : (_g = this.settings) === null || _g === void 0 ? void 0 : _g.duration) !== null && _h !== void 0 ? _h : 500, scale: (_m = (_k = (_j = animation.settings) === null || _j === void 0 ? void 0 : _j.scale) !== null && _k !== void 0 ? _k : (_l = this.zoomManager) === null || _l === void 0 ? void 0 : _l.zoom) !== null && _m !== void 0 ? _m : undefined }, animation.settings);
                        _a = animation;
                        return [4 /*yield*/, animation.animationFunction(this, animation)];
                    case 1:
                        _a.result = _s.sent();
                        (_p = (_o = animation.settings).animationEnd) === null || _p === void 0 ? void 0 : _p.call(_o, animation);
                        (_q = settings.element) === null || _q === void 0 ? void 0 : _q.classList.remove((_r = settings.animationClass) !== null && _r !== void 0 ? _r : 'bga-animations_animated');
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, Promise.resolve(animation)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Plays multiple animations in parallel.
     *
     * @param animations the animations to play
     * @returns a promise for all animations.
     */
    AnimationManager.prototype.playParallel = function (animations) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.all(animations.map(function (animation) { return _this.play(animation); }))];
            });
        });
    };
    /**
     * Plays multiple animations in sequence (the second when the first ends, ...).
     *
     * @param animations the animations to play
     * @returns a promise for all animations.
     */
    AnimationManager.prototype.playSequence = function (animations) {
        return __awaiter(this, void 0, void 0, function () {
            var result, others;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!animations.length) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.play(animations[0])];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, this.playSequence(animations.slice(1))];
                    case 2:
                        others = _a.sent();
                        return [2 /*return*/, __spreadArray([result], __read(others), false)];
                    case 3: return [2 /*return*/, Promise.resolve([])];
                }
            });
        });
    };
    /**
     * Plays multiple animations with a delay between each animation start.
     *
     * @param animations the animations to play
     * @param delay the delay (in ms)
     * @returns a promise for all animations.
     */
    AnimationManager.prototype.playWithDelay = function (animations, delay) {
        return __awaiter(this, void 0, void 0, function () {
            var promise;
            var _this = this;
            return __generator(this, function (_a) {
                promise = new Promise(function (success) {
                    var promises = [];
                    var _loop_2 = function (i) {
                        setTimeout(function () {
                            promises.push(_this.play(animations[i]));
                            if (i == animations.length - 1) {
                                Promise.all(promises).then(function (result) {
                                    success(result);
                                });
                            }
                        }, i * delay);
                    };
                    for (var i = 0; i < animations.length; i++) {
                        _loop_2(i);
                    }
                });
                return [2 /*return*/, promise];
            });
        });
    };
    /**
     * Attach an element to a parent, then play animation from element's origin to its new position.
     *
     * @param animation the animation function
     * @param attachElement the destination parent
     * @returns a promise when animation ends
     */
    AnimationManager.prototype.attachWithAnimation = function (animation, attachElement) {
        var attachWithAnimation = new BgaAttachWithAnimation({
            animation: animation,
            attachElement: attachElement
        });
        return this.play(attachWithAnimation);
    };
    return AnimationManager;
}());
