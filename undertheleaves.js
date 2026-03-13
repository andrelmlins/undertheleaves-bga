var BOLD_ARGS_VALUE = [];
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
            placeTile: new PlaceTile(_this),
        };
        return _this;
    }
    UndertheLeavesGame.prototype.setup = function (gamedatas) {
        this.animationManager = new AnimationManager(this, {
            duration: 800,
        });
        document.getElementById('game_play_area').insertAdjacentHTML('beforeend', "\n        <div id=\"undertheleaves-box\" class=\"undertheleaves-box\">\n          <div id=\"undertheleaves-offer\" class=\"undertheleaves-offer\"></div>\n        </div>\n      ");
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
            _this.gridMap[playerId] = new ebg.scrollmapWithZoom();
            _this.gridMap[playerId].bAdaptHeightAuto = true;
            _this.gridMap[playerId].bEnableLongPress = false;
            _this.gridMap[playerId].create($("undertheleaves-player-map-container-".concat(playerId)), $("undertheleaves-player-map-scrollable-".concat(playerId)), $("undertheleaves-player-map-surface-".concat(playerId)), $("undertheleaves-player-map-scrollable-oversurface-".concat(playerId)));
            _this.gridMap[playerId].onsurface_div.insertAdjacentHTML('beforeend', "<div id=\"undertheleaves-player-grid-".concat(playerId, "\" class=\"undertheleaves-player-grid\"></div>"));
            _this.createGridTiles(_this.game.gamedatas.gridTiles[playerId], Number(playerId));
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
    TileManager.prototype.formatTile = function (tile, notif) {
        if (notif === void 0) { notif = false; }
        var tileConfig = this.getTileConfig(tile);
        return "\n      <div ".concat(!notif ? "id=\"undertheleaves-tile-".concat(tile.id, "\"") : '', " class=\"undertheleaves-tile ").concat(notif ? 'notif' : '', "\" line=\"").concat(tileConfig.position.row, "\" column=\"").concat(tileConfig.position.column, "\">\n        <div class=\"undertheleaves-tile-box\">  \n          <div class=\"undertheleaves-tile-inner\">\n            <div class=\"undertheleaves-tile-front\"></div>\n            <div class=\"undertheleaves-tile-back\"></div>\n          </div>\n        </div>\n      </div>\n    ");
    };
    TileManager.prototype.formatGridTile = function (gridTile) {
        var tileConfig = this.getTileConfig(gridTile.tile);
        return "\n      <div id=\"undertheleaves-tile-".concat(gridTile.tile.id, "\" class=\"undertheleaves-tile\" line=\"").concat(tileConfig.position.row, "\" column=\"").concat(tileConfig.position.column, "\">\n        <div class=\"undertheleaves-tile-box\" style=\"transform: rotate(").concat(gridTile.rotation, "deg)\">\n          <div class=\"undertheleaves-tile-inner\" style=\"").concat(gridTile.side == 1 ? 'transform: rotateY(180deg)' : '', "\">\n            <div class=\"undertheleaves-tile-front\"></div>\n            <div class=\"undertheleaves-tile-back\"></div>\n          </div>\n        </div>\n      </div>\n    ");
    };
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
            playerGridBox.insertAdjacentHTML('beforeend', "<div class=\"undertheleaves-player-cell\" data-x=".concat(gridTile.x, " data-y=").concat(gridTile.y, "></div>"));
            playerGridBox
                .querySelector('[data-x="' + gridTile.x + '"][data-y="' + gridTile.y + '"]')
                .insertAdjacentHTML('beforeend', _this.formatGridTile(gridTile));
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
                if (!playerGridBox.querySelector("[data-x=\"".concat(x, "\"][data-y=\"").concat(y, "\"]"))) {
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
        this.game.games.tileManager.createGridTiles(tiles, playerId);
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
            var element = gridBoxDiv.querySelector("[data-x=\"".concat(pos.x, "\"][data-y=\"").concat(pos.y, "\"]"));
            if (!element) {
                gridBoxDiv.insertAdjacentHTML('beforeend', "<div class=\"undertheleaves-player-cell selectable\" data-x=".concat(pos.x, " data-y=").concat(pos.y, "></div>"));
                element = gridBoxDiv.querySelector("[data-x=\"".concat(pos.x, "\"][data-y=\"").concat(pos.y, "\"]"));
            }
            else {
                element.classList.add('selectable');
            }
            _this.handlers.push(dojo.connect(element, 'onclick', function () { return __awaiter(_this, void 0, void 0, function () {
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
        this.game.games.tileManager.gridMap[playerId].scrollToCenter();
    };
    PlaceTile.prototype.removeSelectExternals = function () {
        return __awaiter(this, void 0, void 0, function () {
            var playerId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        playerId = this.game.bga.players.getCurrentPlayerId();
                        this.game.games.tileManager
                            .getGridBoxDiv(playerId)
                            .querySelectorAll('.selectable')
                            .forEach(function (item) { return item.classList.remove('selectable'); });
                        this.game.games.tileManager.recalculateGrid(playerId);
                        return [4 /*yield*/, delayTime(300)];
                    case 1:
                        _a.sent();
                        this.game.games.tileManager.gridMap[playerId].scrollToCenter();
                        return [2 /*return*/];
                }
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
                            .querySelector("[data-x=\"".concat(this.externalTileSelected.x, "\"][data-y=\"").concat(this.externalTileSelected.y, "\"]"));
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
                        if (!playerGridBoxElement.querySelector("[data-x=\"".concat(notif.args.gridTile.x, "\"][data-y=\"").concat(notif.args.gridTile.y, "\"]"))) {
                            this.game.games.tileManager
                                .getGridBoxDiv(notif.args.playerId)
                                .insertAdjacentHTML('afterbegin', "<div class=\"undertheleaves-player-cell selectable\" data-x=\"".concat(notif.args.gridTile.x, "\" data-y=\"").concat(notif.args.gridTile.y, "\"></div>"));
                        }
                        this.game.games.tileManager.recalculateGrid(notif.args.playerId);
                        return [4 /*yield*/, delayTime(300)];
                    case 1:
                        _a.sent();
                        tileElement = this.game.games.tileManager.getTileById(notif.args.gridTile.tile.id);
                        externalElement = playerGridBoxElement.querySelector("[data-x=\"".concat(notif.args.gridTile.x, "\"][data-y=\"").concat(notif.args.gridTile.y, "\"]"));
                        animation = new BgaLocalAnimation(this.game);
                        animation.setWhere('afterbegin');
                        animation.setOptions(tileElement, externalElement, 700);
                        return [4 /*yield*/, animation.call()];
                    case 2:
                        _a.sent();
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
