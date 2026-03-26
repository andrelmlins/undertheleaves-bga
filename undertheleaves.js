var BOLD_ARGS_VALUE = ['count_beings'];
var BOLD_ARGS_I18N = [];
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
        };
        return _this;
    }
    UndertheLeavesGame.prototype.setup = function (gamedatas) {
        this.animationManager = new AnimationManager(this, {
            duration: 800,
        });
        document.getElementById('game_play_area').insertAdjacentHTML('beforeend', "\n        <div id=\"undertheleaves-box\" class=\"undertheleaves-box\">\n          <div id=\"undertheleaves-cards\" class=\"undertheleaves-cards\"></div>\n          <div id=\"undertheleaves-offer\" class=\"undertheleaves-offer\"></div>\n        </div>\n      ");
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
var TILE_SIZE = 180;
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
            _this.createGridTiles(_this.game.gamedatas.gridTiles[playerId], Number(playerId));
        });
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                _this.game.gamedatas.playerorder.forEach(function (playerId) {
                    _this.applyZoom(Number(playerId));
                });
            });
        });
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
    TileManager.prototype.applyZoom = function (playerId) {
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
        map.scrollToCenter();
    };
    TileManager.prototype.formatTile = function (tile, notif) {
        if (notif === void 0) { notif = false; }
        var tileConfig = this.getTileConfig(tile);
        return "\n      <div ".concat(!notif ? "id=\"undertheleaves-tile-".concat(tile.id, "\"") : '', " class=\"undertheleaves-tile ").concat(notif ? 'notif' : '', "\" line=\"").concat(tileConfig.position.row, "\" column=\"").concat(tileConfig.position.column, "\" type=\"").concat(tile.type, "\">\n        <div class=\"undertheleaves-tile-box\">  \n          <div class=\"undertheleaves-tile-inner\">\n            <div class=\"undertheleaves-tile-front\"></div>\n            <div class=\"undertheleaves-tile-back\"></div>\n          </div>\n        </div>\n      </div>\n    ");
    };
    TileManager.prototype.formatGridTile = function (gridTile) {
        var tileConfig = this.getTileConfig(gridTile.tile);
        return "\n      <div id=\"undertheleaves-tile-".concat(gridTile.tile.id, "\" class=\"undertheleaves-tile\" line=\"").concat(tileConfig.position.row, "\" column=\"").concat(tileConfig.position.column, "\" type=\"").concat(gridTile.tile.type, "\" data-x=\"").concat(gridTile.x, "\" data-y=\"").concat(gridTile.y, "\" data-rotation=\"").concat(gridTile.rotation, "\" data-side=\"").concat(gridTile.side, "\">\n        <div class=\"undertheleaves-tile-box\" style=\"transform: rotate(").concat(gridTile.rotation, "deg)\">\n          <div class=\"undertheleaves-tile-inner\" style=\"").concat(gridTile.side == 1 ? 'transform: rotateY(180deg)' : '', "\">\n            <div class=\"undertheleaves-tile-front\"></div>\n            <div class=\"undertheleaves-tile-back\"></div>\n          </div>\n        </div>\n        ").concat(this.formatBeingPositions(gridTile.x, gridTile.y), "\n      </div>\n    ");
    };
    TileManager.prototype.formatBeingPositions = function (x, y) {
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
        var html = "<div class=\"undertheleaves-being-center-position\" data-x=\"".concat(x, "\" data-y=\"").concat(y, "\"></div>");
        return (html +
            positions
                .map(function (pos) {
                var div = document.createElement('div');
                div.className = 'undertheleaves-being-position';
                div.dataset.localX = String(pos.localX);
                div.dataset.localY = String(pos.localY);
                div.dataset.x = String(pos.x);
                div.dataset.y = String(pos.y);
                return div.outerHTML;
            })
                .join(''));
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
        tiles.forEach(function (gridTile) {
            var cellDiv = document.createElement('div');
            cellDiv.className = 'undertheleaves-player-cell';
            cellDiv.dataset.x = String(gridTile.x);
            cellDiv.dataset.y = String(gridTile.y);
            playerGridBox.appendChild(cellDiv);
            cellDiv.insertAdjacentHTML('beforeend', _this.formatGridTile(gridTile));
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
    return TileManager;
}());
var CardManager = /** @class */ (function () {
    function CardManager(game) {
        this.game = game;
    }
    CardManager.prototype.setup = function () {
        var cardsBox = document.getElementById('undertheleaves-cards');
        cardsBox.insertAdjacentHTML('beforeend', this.formatCard(this.game.gamedatas.cards.leaf));
        cardsBox.insertAdjacentHTML('beforeend', this.formatCard(this.game.gamedatas.cards.mushroom));
        cardsBox.insertAdjacentHTML('beforeend', this.formatCard(this.game.gamedatas.cards.puddle));
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
        return "<div class=\"undertheleaves-card\" line=\"".concat(card.position.row, "\" column=\"").concat(card.position.column, "\"></div>");
    };
    return CardManager;
}());
var PlayerManager = /** @class */ (function () {
    function PlayerManager(game) {
        this.game = game;
        this.counters = {};
    }
    PlayerManager.prototype.setup = function () {
        var _a, _b, _c, _d, _e, _f;
        for (var playerId in this.game.gamedatas.players) {
            this.counters[playerId] = {
                leaf: new ebg.counter(),
                puddle: new ebg.counter(),
                mushroom: new ebg.counter(),
                hummingbird: new ebg.counter(),
                bee: new ebg.counter(),
            };
            var playerBoardHtml = "\n        <div id=\"undertheleaves-player-board-".concat(playerId, "\" class=\"undertheleaves-player-board\">\n          <div class=\"undertheleaves-player-board-count\">\n            ").concat(this.game.games.beingsManager.formatPiece('bee'), "\n            <span id=\"undertheleaves-bee-count-").concat(playerId, "\">0</span>\n          </div>\n          <div class=\"undertheleaves-player-board-count\">\n            ").concat(this.game.games.beingsManager.formatPiece('hummingbird'), "\n            <span id=\"undertheleaves-hummingbird-count-").concat(playerId, "\">0</span>\n          </div>\n          <div class=\"undertheleaves-player-board-count\">\n            ").concat(this.game.games.beingsManager.formatPiece('leaf'), "\n            <span id=\"undertheleaves-leaf-count-").concat(playerId, "\">0</span>\n          </div>\n          <div class=\"undertheleaves-player-board-count\">\n            ").concat(this.game.games.beingsManager.formatPiece('mushroom'), "\n            <span id=\"undertheleaves-mushroom-count-").concat(playerId, "\">0</span>\n          </div>\n          <div class=\"undertheleaves-player-board-count\">\n            ").concat(this.game.games.beingsManager.formatPiece('puddle'), "\n            <span id=\"undertheleaves-puddle-count-").concat(playerId, "\">0</span>\n          </div>\n        </div>\n      ");
            this.game.bga.playerPanels.getElement(Number(playerId)).insertAdjacentHTML('beforeend', playerBoardHtml);
            this.counters[playerId].leaf.create("undertheleaves-leaf-count-".concat(playerId));
            this.counters[playerId].puddle.create("undertheleaves-puddle-count-".concat(playerId));
            this.counters[playerId].mushroom.create("undertheleaves-mushroom-count-".concat(playerId));
            this.counters[playerId].hummingbird.create("undertheleaves-hummingbird-count-".concat(playerId));
            this.counters[playerId].bee.create("undertheleaves-bee-count-".concat(playerId));
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
        }
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
        //
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
        dojo.subscribe('arrivalBee', this, function (notif) { return _this.arrivalBeeNotif(notif); });
        dojo.subscribe('mergeBee', this, function (notif) { return _this.mergeBeeNotif(notif); });
        dojo.subscribe('arrivalHummingbird', this, function (notif) { return _this.arrivalHummingbirdNotif(notif); });
        dojo.subscribe('arrivalDiverPuddle', this, function (notif) { return _this.arrivalPuddleDwellerNotif(notif); });
        dojo.subscribe('arrivalSkipperPuddle', this, function (notif) { return _this.arrivalPuddleDwellerNotif(notif); });
        dojo.subscribe('arrivalShyPuddle', this, function (notif) { return _this.arrivalPuddleDwellerNotif(notif); });
        dojo.subscribe('arrivalHostMushroom', this, function (notif) { return _this.arrivalMushroomDwellerNotif(notif); });
        dojo.subscribe('arrivalExplorerMushroom', this, function (notif) { return _this.arrivalMushroomDwellerNotif(notif); });
        dojo.subscribe('arrivalLonerMushroom', this, function (notif) { return _this.arrivalMushroomDwellerNotif(notif); });
        dojo.subscribe('majorityBonus', this, function (notif) { return _this.majorityBonusNotif(notif); });
    };
    BeingsManager.prototype.renderBeing = function (being) {
        var _a;
        var gridBox = this.game.games.tileManager.getGridBoxDiv(being.playerId);
        for (var i = 0; i < being.count; i++) {
            var cell = being.cells[i % being.cells.length];
            (_a = this.getCellDiv(gridBox, cell)) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML('beforeend', this.formatPiece(being.type));
        }
    };
    BeingsManager.prototype.renderHummingbird = function (being) {
        var gridBox = this.game.games.tileManager.getGridBoxDiv(being.playerId);
        for (var i = 0; i < being.count; i++) {
            var nestBox = gridBox.querySelector(".undertheleaves-being-center-position[data-x='".concat(being.x, "'][data-y='").concat(being.y, "']"));
            nestBox === null || nestBox === void 0 ? void 0 : nestBox.insertAdjacentHTML('beforeend', this.formatPiece('hummingbird'));
        }
    };
    BeingsManager.prototype.formatPiece = function (piece, id) {
        return "<div ".concat(id ? "id=".concat(id) : '', " class=\"undertheleaves-piece\" piece=\"").concat(piece, "\"></div>");
    };
    BeingsManager.prototype.getCellDiv = function (gridBox, cell) {
        return gridBox.querySelector(".undertheleaves-being-position[data-x='".concat(cell[0], "'][data-y='").concat(cell[1], "']"));
    };
    BeingsManager.prototype.countPiecesInSector = function (gridBox, cells, pieceType) {
        var _this = this;
        return cells.reduce(function (acc, cell) {
            var _a, _b;
            var items = (_b = (_a = _this.getCellDiv(gridBox, cell)) === null || _a === void 0 ? void 0 : _a.querySelectorAll(".undertheleaves-piece[piece=\"".concat(pieceType, "\"]"))) !== null && _b !== void 0 ? _b : [];
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
    BeingsManager.prototype.mergeBeeNotif = function (notif) {
        return __awaiter(this, void 0, void 0, function () {
            var gridBox, existingPieces, cells;
            var _this = this;
            return __generator(this, function (_a) {
                gridBox = this.game.games.tileManager.getGridBoxDiv(notif.args.playerId);
                existingPieces = [];
                notif.args.oldBeings.forEach(function (being) {
                    being.cells.forEach(function (cell) {
                        var _a;
                        (_a = _this.getCellDiv(gridBox, cell)) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.undertheleaves-piece[piece="bee"]').forEach(function (el) { return existingPieces.push(el); });
                    });
                });
                cells = notif.args.mergedBeing.cells;
                existingPieces.forEach(function (piece, i) {
                    var cell = cells[i % cells.length];
                    var beingPositionElement = _this.getCellDiv(gridBox, cell);
                    var animation = new BgaLocalAnimation(_this.game);
                    animation.setWhere('afterbegin');
                    animation.setOptions(piece, beingPositionElement, 300);
                    animation.call();
                });
                return [2 /*return*/];
            });
        });
    };
    BeingsManager.prototype.arrivalMushroomDwellerNotif = function (notif) {
        return __awaiter(this, void 0, void 0, function () {
            var gridBox, _a, _b, sector, countBeings, cellDestination, destElement, e_2_1;
            var e_2, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        gridBox = this.game.games.tileManager.getGridBoxDiv(notif.args.playerId);
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 8]);
                        _a = __values(notif.args.sectors), _b = _a.next();
                        _d.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 5];
                        sector = _b.value;
                        countBeings = this.countPiecesInSector(gridBox, sector.cells, 'mushroom');
                        cellDestination = sector.cells[countBeings % sector.cells.length];
                        destElement = this.getCellDiv(gridBox, cellDestination);
                        if (!destElement)
                            return [3 /*break*/, 4];
                        return [4 /*yield*/, this.animatePieceFromVoid('mushroom', destElement)];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_2_1 = _d.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        this.game.games.playerManager.incCounter(notif.args.playerId, 'mushroom', notif.args.count_beings);
                        return [2 /*return*/];
                }
            });
        });
    };
    BeingsManager.prototype.arrivalPuddleDwellerNotif = function (notif) {
        return __awaiter(this, void 0, void 0, function () {
            var gridBox, _a, _b, sector, countBeings, cellDestination, destElement, e_3_1;
            var e_3, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        gridBox = this.game.games.tileManager.getGridBoxDiv(notif.args.playerId);
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 8]);
                        _a = __values(notif.args.sectors), _b = _a.next();
                        _d.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 5];
                        sector = _b.value;
                        countBeings = this.countPiecesInSector(gridBox, sector.cells, 'puddle');
                        cellDestination = sector.cells[countBeings % sector.cells.length];
                        destElement = this.getCellDiv(gridBox, cellDestination);
                        if (!destElement)
                            return [3 /*break*/, 4];
                        return [4 /*yield*/, this.animatePieceFromVoid('puddle', destElement)];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_3_1 = _d.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_3) throw e_3.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        this.game.games.playerManager.incCounter(notif.args.playerId, 'puddle', notif.args.count_beings);
                        return [2 /*return*/];
                }
            });
        });
    };
    BeingsManager.prototype.arrivalHummingbirdNotif = function (notif) {
        return __awaiter(this, void 0, void 0, function () {
            var gridBox, _a, _b, tile, nestBox, i, e_4_1;
            var e_4, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        gridBox = this.game.games.tileManager.getGridBoxDiv(notif.args.playerId);
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 8, 9, 10]);
                        _a = __values(notif.args.tiles), _b = _a.next();
                        _d.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 7];
                        tile = _b.value;
                        nestBox = gridBox.querySelector(".undertheleaves-being-center-position[data-x='".concat(tile.x, "'][data-y='").concat(tile.y, "']"));
                        i = 0;
                        _d.label = 3;
                    case 3:
                        if (!(i < tile.delta)) return [3 /*break*/, 6];
                        if (!nestBox)
                            return [3 /*break*/, 5];
                        return [4 /*yield*/, this.animatePieceFromVoid('hummingbird', nestBox)];
                    case 4:
                        _d.sent();
                        _d.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 3];
                    case 6:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_4_1 = _d.sent();
                        e_4 = { error: e_4_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_4) throw e_4.error; }
                        return [7 /*endfinally*/];
                    case 10:
                        this.game.games.playerManager.incCounter(notif.args.playerId, 'hummingbird', notif.args.count_beings);
                        return [2 /*return*/];
                }
            });
        });
    };
    BeingsManager.prototype.arrivalBeeNotif = function (notif) {
        return __awaiter(this, void 0, void 0, function () {
            var gridBox, _a, _b, sector, countBeings, cellDestination, destElement, e_5_1;
            var e_5, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        gridBox = this.game.games.tileManager.getGridBoxDiv(notif.args.playerId);
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 8]);
                        _a = __values(notif.args.sectors), _b = _a.next();
                        _d.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 5];
                        sector = _b.value;
                        countBeings = this.countPiecesInSector(gridBox, sector.cells, 'bee');
                        cellDestination = sector.cells[countBeings % sector.cells.length];
                        destElement = this.getCellDiv(gridBox, cellDestination);
                        if (!destElement)
                            return [3 /*break*/, 4];
                        return [4 /*yield*/, this.animatePieceFromVoid('bee', destElement)];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_5_1 = _d.sent();
                        e_5 = { error: e_5_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_5) throw e_5.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        this.game.games.playerManager.incCounter(notif.args.playerId, 'bee', notif.args.sectors.length);
                        return [2 /*return*/];
                }
            });
        });
    };
    BeingsManager.prototype.majorityBonusNotif = function (notif) {
        return __awaiter(this, void 0, void 0, function () {
            var pieceType, gridBox, i, cell, destBox;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pieceType = notif.args.type.replace('_dweller', '');
                        gridBox = this.game.games.tileManager.getGridBoxDiv(notif.args.player_id);
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < notif.args.count)) return [3 /*break*/, 4];
                        cell = notif.args.cells[i % notif.args.cells.length];
                        destBox = this.getCellDiv(gridBox, cell);
                        if (!destBox)
                            return [3 /*break*/, 3];
                        return [4 /*yield*/, this.animatePieceFromVoid(pieceType, destBox)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.game.games.playerManager.incCounter(notif.args.player_id, notif.args.type, notif.args.count);
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
            this.game.games.tileManager.getTileById(this.externalTileSelected.tileId).classList.add('selected');
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
        externalsMap.forEach(function (pos) {
            var element = gridBoxDiv.querySelector(".undertheleaves-player-cell[data-x=\"".concat(pos.x, "\"][data-y=\"").concat(pos.y, "\"]"));
            if (!element) {
                gridBoxDiv.insertAdjacentHTML('beforeend', "<div class=\"undertheleaves-player-cell selectable\" data-x=".concat(pos.x, " data-y=").concat(pos.y, "></div>"));
                element = gridBoxDiv.querySelector(".undertheleaves-player-cell[data-x=\"".concat(pos.x, "\"][data-y=\"").concat(pos.y, "\"]"));
            }
            else {
                element.classList.add('selectable');
            }
            _this.handlers.push(dojo.connect(element, 'onclick', function () { return __awaiter(_this, void 0, void 0, function () {
                var tileElement;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!(((_a = this.externalTileSelected) === null || _a === void 0 ? void 0 : _a.x) != pos.x || ((_b = this.externalTileSelected) === null || _b === void 0 ? void 0 : _b.y) != pos.y)) return [3 /*break*/, 2];
                            this.externalTileSelected.x = pos.x;
                            this.externalTileSelected.y = pos.y;
                            return [4 /*yield*/, this.moveTileSelected(this.externalTileSelected.tileId)];
                        case 1:
                            _c.sent();
                            tileElement = this.game.games.tileManager.getTileById(this.externalTileSelected.tileId);
                            tileElement.querySelectorAll('.undertheleaves-being-position').forEach(function (item) { return item.remove(); });
                            tileElement.insertAdjacentHTML('beforeend', this.game.games.tileManager.formatBeingPositions(pos.x, pos.y));
                            this.game.bga.states.setClientState('client_MoveTile', {
                                descriptionmyturn: _('${you} must place a garden tile'),
                            });
                            _c.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); }));
        });
        this.game.games.tileManager.recalculateGrid(playerId);
        this.game.games.tileManager.applyZoom(Number(playerId));
    };
    PlaceTile.prototype.removeSelectExternals = function () {
        return __awaiter(this, void 0, void 0, function () {
            var playerId;
            return __generator(this, function (_a) {
                playerId = this.game.bga.players.getCurrentPlayerId();
                this.game.games.tileManager
                    .getGridBoxDiv(playerId)
                    .querySelectorAll('.selectable')
                    .forEach(function (item) { return item.classList.remove('selectable'); });
                this.game.games.tileManager.recalculateGrid(playerId);
                this.game.games.tileManager.applyZoom(playerId);
                return [2 /*return*/];
            });
        });
    };
    PlaceTile.prototype.onClick = function () {
        var _this = this;
        var rotation = ((this.externalTileSelected.rotation % 360) + 360) % 360;
        this.game.bga.actions.performAction('actPlaceTile', __assign(__assign({}, this.externalTileSelected), { rotation: rotation })).then(function () {
            _this.game.games.tileManager.getTileById(_this.externalTileSelected.tileId).classList.remove('selected');
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
                        tileElement.querySelector('.undertheleaves-tile-inner').style.transform = '';
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
            var tileElement, inner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isAnimating)
                            return [2 /*return*/];
                        tileElement = this.game.games.tileManager.getBoxTileById(this.externalTileSelected.tileId);
                        inner = tileElement.querySelector('.undertheleaves-tile-inner');
                        this.isAnimating = true;
                        if (type === 'right')
                            this.externalTileSelected.rotation += 90;
                        if (type === 'left')
                            this.externalTileSelected.rotation -= 90;
                        if (type === 'inverse')
                            this.externalTileSelected.inverse = !this.externalTileSelected.inverse;
                        tileElement.style.transform = "rotate(".concat(this.externalTileSelected.rotation, "deg)");
                        inner.style.transform = this.externalTileSelected.inverse ? 'rotateY(180deg)' : '';
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
            return __generator(this, function (_a) {
                document
                    .getElementById('undertheleaves-general-void-stock')
                    .insertAdjacentHTML('beforeend', this.game.games.tileManager.formatTile(notif.args.tile));
                offerElement = document.getElementById('undertheleaves-offer');
                tileSelectedElement = this.game.games.tileManager.getTileById(notif.args.tile.id);
                animation = new BgaLocalAnimation(this.game);
                animation.setWhere('afterbegin');
                animation.setOptions(tileSelectedElement, offerElement, 500);
                animation.call();
                return [2 /*return*/];
            });
        });
    };
    PlaceTile.prototype.placeTileNotif = function (notif) {
        return __awaiter(this, void 0, void 0, function () {
            var tileBoxElement, inner, playerGridBoxElement, tileElement, externalElement, animation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (notif.args.playerId == this.game.bga.players.getCurrentPlayerId()) {
                            return [2 /*return*/];
                        }
                        tileBoxElement = this.game.games.tileManager.getBoxTileById(notif.args.gridTile.tile.id);
                        inner = tileBoxElement.querySelector('.undertheleaves-tile-inner');
                        tileBoxElement.style.transform = "rotate(".concat(notif.args.gridTile.rotation, "deg)");
                        inner.style.transform = notif.args.gridTile.side == 1 ? 'rotateY(180deg)' : '';
                        playerGridBoxElement = this.game.games.tileManager.getGridBoxDiv(notif.args.playerId);
                        if (!playerGridBoxElement.querySelector(".undertheleaves-player-cell[data-x=\"".concat(notif.args.gridTile.x, "\"][data-y=\"").concat(notif.args.gridTile.y, "\"]"))) {
                            this.game.games.tileManager
                                .getGridBoxDiv(notif.args.playerId)
                                .insertAdjacentHTML('afterbegin', "<div class=\"undertheleaves-player-cell selectable\" data-x=\"".concat(notif.args.gridTile.x, "\" data-y=\"").concat(notif.args.gridTile.y, "\"></div>"));
                        }
                        this.game.games.tileManager.recalculateGrid(notif.args.playerId);
                        this.game.games.tileManager.applyZoom(notif.args.playerId);
                        return [4 /*yield*/, delayTime(300)];
                    case 1:
                        _a.sent();
                        tileElement = this.game.games.tileManager.getTileById(notif.args.gridTile.tile.id);
                        externalElement = playerGridBoxElement.querySelector(".undertheleaves-player-cell[data-x=\"".concat(notif.args.gridTile.x, "\"][data-y=\"").concat(notif.args.gridTile.y, "\"]"));
                        animation = new BgaLocalAnimation(this.game);
                        animation.setWhere('afterbegin');
                        animation.setOptions(tileElement, externalElement, 700);
                        return [4 /*yield*/, animation.call()];
                    case 2:
                        _a.sent();
                        tileElement.insertAdjacentHTML('beforeend', this.game.games.tileManager.formatBeingPositions(notif.args.gridTile.x, notif.args.gridTile.y));
                        externalElement.classList.remove('selectable');
                        return [2 /*return*/];
                }
            });
        });
    };
    return PlaceTile;
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
                    var _loop_1 = function (i) {
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
                        _loop_1(i);
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
