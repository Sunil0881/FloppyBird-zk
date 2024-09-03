import { ethers } from 'ethers';
import { ZkWasmServiceHelper, ProofSubmitMode, ZkWasmUtil } from 'zkwasm-service-helper';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
}

function __spreadArray(to, from, pack) {
    for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

/* HELPER FOR IMPORT ZK-WASM */

let _print_buf = [];

function print_result() {
  // Convert the array of numbers to a string
  const result = String.fromCharCode(..._print_buf);

  _print_buf = [];

  console.log("Wasm_dbg_char result", result);
}

const __wbg_star0 = {
  abort: () => {
    console.error("abort in wasm!");
    throw new Error("Unsupported wasm api: abort");
  },
  require: (b) => {
    if (!b) {
      console.error("require failed");
      throw new Error("Require failed");
    }
  },
  wasm_dbg: (c) => {
    console.log("wasm_dbg", c);
  },
  /**
 * - Convert the number to a character
 * - Check if the character is a newline
 * - Print the accumulated result when encountering a newline
 * - Append the character to the print buffer
 */
  wasm_dbg_char: (data) =>
    String.fromCharCode(Number(data)) === "\n"
      ? print_result()
      : _print_buf.push(Number(data)),

  wasm_input: () => {
    console.error("wasm_input should not been called in non-zkwasm mode");
    throw new Error("Unsupported wasm api: wasm_input");
  },
  wasm_output: () => {
    console.error("wasm_input should not been called in non-zkwasm mode");
    throw new Error("Unsupported wasm api: wasm_input");
  },
  babyjubjub_sum_push: () => {
    console.error("baby_jubjub_sum_new");
    throw new Error("Unsupported wasm api: wasm_input");
  },
  babyjubjub_sum_finalize: () => {
    console.error("baby_jubjub_sum_new");
    throw new Error("Unsupported wasm api: wasm_input");
  },
};
/* AUTO GENERATED BELOW */

let wasm;

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); }
let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}
/**
* @param {SpinGameInitArgs} args
*/
function initialize_game(args) {
    _assertClass(args, SpinGameInitArgs);
    var ptr0 = args.__destroy_into_raw();
    wasm.initialize_game(ptr0);
}

/**
* @param {bigint} input
*/
function step(input) {
    wasm.step(input);
}

/**
* @returns {SpinGameIntermediateStates}
*/
function get_game_state() {
    const ret = wasm.get_game_state();
    return SpinGameIntermediateStates.__wrap(ret);
}

const SpinGameInitArgsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_spingameinitargs_free(ptr >>> 0));
/**
*/
class SpinGameInitArgs {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SpinGameInitArgsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_spingameinitargs_free(ptr);
    }
    /**
    * @returns {bigint}
    */
    get total_steps() {
        const ret = wasm.__wbg_get_spingameinitargs_total_steps(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @param {bigint} arg0
    */
    set total_steps(arg0) {
        wasm.__wbg_set_spingameinitargs_total_steps(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {bigint}
    */
    get current_position() {
        const ret = wasm.__wbg_get_spingameinitargs_current_position(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @param {bigint} arg0
    */
    set current_position(arg0) {
        wasm.__wbg_set_spingameinitargs_current_position(this.__wbg_ptr, arg0);
    }
    /**
    * @param {bigint} total_steps
    * @param {bigint} current_position
    */
    constructor(total_steps, current_position) {
        const ret = wasm.spingameinitargs_new(total_steps, current_position);
        this.__wbg_ptr = ret >>> 0;
        return this;
    }
}

const SpinGameIntermediateStatesFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_spingameintermediatestates_free(ptr >>> 0));
/**
*/
class SpinGameIntermediateStates {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SpinGameIntermediateStates.prototype);
        obj.__wbg_ptr = ptr;
        SpinGameIntermediateStatesFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SpinGameIntermediateStatesFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_spingameintermediatestates_free(ptr);
    }
    /**
    * @returns {bigint}
    */
    get total_steps() {
        const ret = wasm.__wbg_get_spingameinitargs_total_steps(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @param {bigint} arg0
    */
    set total_steps(arg0) {
        wasm.__wbg_set_spingameinitargs_total_steps(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {bigint}
    */
    get current_position() {
        const ret = wasm.__wbg_get_spingameinitargs_current_position(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @param {bigint} arg0
    */
    set current_position(arg0) {
        wasm.__wbg_set_spingameinitargs_current_position(this.__wbg_ptr, arg0);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports['env'] = __wbg_star0;

    return imports;
}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedUint8Memory0 = null;


    return wasm;
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined') {
        input = new URL('gameplay_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

var GamePlay = /** @class */ (function () {
    function GamePlay() {
    }
    GamePlay.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/, __wbg_init().catch(function (e) {
                                return console.error("Error initializing game logic", e);
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    // BELOW FUNCTIONS CAN BE AUTO-GENERATED
    GamePlay.prototype.init_game = function (arg) {
        initialize_game(arg);
    };
    GamePlay.prototype.step = function (command) {
        step(command);
    };
    GamePlay.prototype.getGameState = function () {
        return get_game_state();
    };
    return GamePlay;
}());

/* SDK FILE*/
function signMessage(message, cloudCredential) {
    return __awaiter(this, void 0, void 0, function () {
        var signer, signature;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    signer = new ethers.Wallet(cloudCredential.USER_PRIVATE_KEY);
                    return [4 /*yield*/, signer.signMessage(message)];
                case 1:
                    signature = _a.sent();
                    return [2 /*return*/, signature];
            }
        });
    });
}
function add_proving_taks(inputs, witness, cloudCredential) {
    return __awaiter(this, void 0, void 0, function () {
        var helper, info, msgString, signature, e_1, task, tasksInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    helper = new ZkWasmServiceHelper(cloudCredential.CLOUD_RPC_URL, "", "");
                    info = {
                        user_address: cloudCredential.USER_ADDRESS,
                        md5: cloudCredential.IMAGE_HASH,
                        public_inputs: inputs,
                        private_inputs: witness,
                        proof_submit_mode: ProofSubmitMode.Manual,
                    };
                    msgString = ZkWasmUtil.createProvingSignMessage(info);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, signMessage(msgString, cloudCredential)];
                case 2:
                    // change to use whitelisted pkey to sign message
                    signature = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.log("error signing message", e_1);
                    throw Error("Signing transaction failed");
                case 4:
                    task = __assign(__assign({}, info), { signature: signature });
                    return [4 /*yield*/, helper.addProvingTask(task)];
                case 5:
                    tasksInfo = _a.sent();
                    console.log("tasksInfo = ", tasksInfo);
                    return [2 /*return*/, tasksInfo];
            }
        });
    });
}
function getImageCommitmentBigInts(cloudCredential) {
    return __awaiter(this, void 0, void 0, function () {
        var helper, imageInfo, commitment;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    helper = new ZkWasmServiceHelper(cloudCredential.CLOUD_RPC_URL, "", "");
                    return [4 /*yield*/, helper.queryImage(cloudCredential.IMAGE_HASH)];
                case 1:
                    imageInfo = _a.sent();
                    if (!imageInfo || !imageInfo.checksum) {
                        throw Error("Image not found");
                    }
                    commitment = commitmentUint8ArrayToVerifyInstanceBigInts$1(imageInfo.checksum.x, imageInfo.checksum.y);
                    return [2 /*return*/, commitment];
            }
        });
    });
}
function load_proving_taks_util_result(task_id_1, cloudCredential_1) {
    return __awaiter(this, arguments, void 0, function (task_id, cloudCredential, retry_interval // 10 seconds
    ) {
        var INITIAL_RETRY_INTERVAL, init_flag, _loop_1, state_1;
        if (retry_interval === void 0) { retry_interval = 10000; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    INITIAL_RETRY_INTERVAL = 40000;
                    init_flag = true;
                    _loop_1 = function () {
                        var result, sleep_time;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, load_proving_taks(task_id, cloudCredential)];
                                case 1:
                                    result = _b.sent();
                                    if (result.status == "Done") {
                                        return [2 /*return*/, { value: result }];
                                    }
                                    if (result.status == "Pending") {
                                        console.log("Pending");
                                    }
                                    else if (result.status == "Processing") {
                                        console.log("Processing");
                                    }
                                    else {
                                        throw new Error("Proof generation failed, ".concat(result));
                                    }
                                    if (init_flag) {
                                        sleep_time = INITIAL_RETRY_INTERVAL;
                                        init_flag = false;
                                    }
                                    else {
                                        sleep_time = retry_interval;
                                    }
                                    console.log("waiting for proof generation... sleeping for ".concat(sleep_time, "ms"));
                                    return [4 /*yield*/, new Promise(function (_) { return setTimeout(_, sleep_time); })];
                                case 2:
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 1;
                case 1:
                    return [5 /*yield**/, _loop_1()];
                case 2:
                    state_1 = _a.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function load_proving_taks(task_id, cloudCredential) {
    return __awaiter(this, void 0, void 0, function () {
        var helper, query, retryCount, tasksInfo, error_1, task, proof, verify_instance, aux, instances;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    helper = new ZkWasmServiceHelper(cloudCredential.CLOUD_RPC_URL, "", "");
                    query = {
                        md5: cloudCredential.IMAGE_HASH,
                        id: task_id,
                        user_address: cloudCredential.USER_ADDRESS,
                        tasktype: "Prove",
                        taskstatus: "",
                    };
                    retryCount = 0;
                    _a.label = 1;
                case 1:
                    if (!(retryCount < 4)) return [3 /*break*/, 9];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 8]);
                    return [4 /*yield*/, helper.loadTasks(query)];
                case 3:
                    tasksInfo = (_a.sent()).data;
                    console.log("proof data = ", tasksInfo);
                    return [3 /*break*/, 9];
                case 4:
                    error_1 = _a.sent();
                    console.error("Caught error: ".concat(error_1.message));
                    if (!((error_1.response && error_1.response.status === 429) ||
                        error_1.code == 429 ||
                        error_1.message.includes("Too many requests"))) return [3 /*break*/, 6];
                    console.log("Caught 429 error. Retrying in 5 seconds...");
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                case 5:
                    _a.sent();
                    retryCount++;
                    return [3 /*break*/, 7];
                case 6: throw error_1;
                case 7: return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 1];
                case 9:
                    if (!tasksInfo || tasksInfo.length == 0) {
                        return [2 /*return*/, null];
                    }
                    task = tasksInfo[0];
                    proof = ZkWasmUtil.bytesToBigIntArray(task.proof);
                    verify_instance = ZkWasmUtil.bytesToBigIntArray(task.shadow_instances);
                    console.log("verify_instance = ", task.shadow_instances);
                    aux = ZkWasmUtil.bytesToBigIntArray(task.aux);
                    instances = ZkWasmUtil.bytesToBigIntArray(task.instances);
                    return [2 /*return*/, {
                            proof: proof,
                            verify_instance: verify_instance,
                            aux: aux,
                            instances: instances,
                            status: task.status,
                        }];
            }
        });
    });
}
/* This function is used to convert the commitment hex to hex string
 * in the format of verifying instance
 * @param x: x hex string
 * @param y: y hex string
 */
function commitmentHexToHexString$1(x, y) {
    var hexString1 = "0x" + x.slice(12);
    var hexString2 = "0x" + y.slice(39) + "00000000000000000" + x.slice(2, 12);
    var hexString3 = "0x" + y.slice(2, 39);
    return [hexString1, hexString2, hexString3];
}
function commitmentUint8ArrayToVerifyInstanceBigInts$1(xUint8Array, yUint8Array) {
    var xHexString = ZkWasmUtil.bytesToHexStrings(xUint8Array);
    var yHexString = ZkWasmUtil.bytesToHexStrings(yUint8Array);
    console.log("xHexString = ", xHexString);
    console.log("yHexString = ", yHexString);
    var verifyInstances = commitmentHexToHexString$1(xHexString[0], yHexString[0]);
    console.log("verifyInstances = ", verifyInstances);
    var verifyingBytes = ZkWasmUtil.hexStringsToBytes(verifyInstances, 32);
    console.log("verifyingBytes = ", verifyingBytes);
    var verifyingBigInts = ZkWasmUtil.bytesToBigIntArray(verifyingBytes);
    console.log("verifyingBigInts = ", verifyingBigInts);
    return verifyingBigInts;
}

/* This Class is used to facilated core gameplay and zk proving*/
var Spin = /** @class */ (function () {
    /* Constructor */
    function Spin(_a) {
        var cloudCredentials = _a.cloudCredentials;
        this.inputs = []; // public inputs
        this.witness = []; // private inputs
        this.cloudCredentials = cloudCredentials;
        console.log("cloudCredentials = ", cloudCredentials);
        this.gamePlay = new GamePlay();
    }
    Spin.prototype.add_public_input = function (input) {
        this.inputs.push(input);
    };
    Spin.prototype.add_private_input = function (input) {
        this.witness.push(input);
    };
    // ================================================================================================
    // BELOW FUNCTIONS CAN BE AUTO-GENERATED
    /* Step the game
     * part of the private inputs
     */
    Spin.prototype.step = function (command) {
        this.gamePlay.step(BigInt(command));
        this.add_private_input(command);
    };
    /* Get the current game state */
    Spin.prototype.getGameState = function () {
        return this.gamePlay.getGameState();
    };
    Spin.prototype.initialize_import = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.gamePlay.init()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Spin.prototype.initialize_game = function (arg) {
        this.add_public_input(arg.total_steps);
        this.add_public_input(arg.current_position);
        this.gamePlay.init_game(arg);
        // TODO: dynamic add public inputs
        // args.map((a) => this.add_public_input(a));
    };
    Spin.prototype.getGameID = function () {
        return __awaiter(this, void 0, void 0, function () {
            var helper, retryCount, imageInfo, imageCommitment, gameID, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        helper = new ZkWasmServiceHelper(this.cloudCredentials.CLOUD_RPC_URL, "", "");
                        retryCount = 0;
                        _a.label = 1;
                    case 1:
                        if (!(retryCount < 3)) return [3 /*break*/, 9];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 8]);
                        return [4 /*yield*/, helper.queryImage(this.cloudCredentials.IMAGE_HASH)];
                    case 3:
                        imageInfo = _a.sent();
                        if (!imageInfo || !imageInfo.checksum) {
                            throw Error("Image not found");
                        }
                        imageCommitment = commitmentUint8ArrayToVerifyInstanceBigInts(imageInfo.checksum.x, imageInfo.checksum.y);
                        gameID = ethers.solidityPackedKeccak256(["uint256", "uint256", "uint256"], [imageCommitment[0], imageCommitment[1], imageCommitment[2]]);
                        return [2 /*return*/, gameID];
                    case 4:
                        error_1 = _a.sent();
                        console.error("Caught error: ".concat(error_1));
                        if (!error_1.message.startsWith("Too many requests")) return [3 /*break*/, 6];
                        console.log("Caught 429 error. Retrying in 5 seconds...");
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                    case 5:
                        _a.sent();
                        retryCount++;
                        return [3 /*break*/, 7];
                    case 6: throw error_1;
                    case 7: return [3 /*break*/, 8];
                    case 8: return [3 /*break*/, 1];
                    case 9: throw Error("Failed to get image commitment");
                }
            });
        });
    };
    // ================================================================================================
    Spin.prototype.generateProof = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tasksInfo, task_id, proof;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, add_proving_taks(this.inputs.map(function (i) { return "".concat(i, ":i64"); }), __spreadArray([
                            "".concat(this.witness.length, ":i64")
                        ], this.witness.map(function (m) { return "".concat(m, ":i64"); })), this.cloudCredentials)];
                    case 1:
                        tasksInfo = _a.sent();
                        task_id = tasksInfo.id;
                        return [4 /*yield*/, load_proving_taks_util_result(task_id, this.cloudCredentials)];
                    case 2:
                        proof = _a.sent();
                        console.log("final proof = ", proof);
                        return [2 /*return*/, proof];
                }
            });
        });
    };
    /* Reset the game
     * Keeping the same onReady callback and cloud credentials
     */
    Spin.prototype.reset = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.inputs = [];
                        this.witness = [];
                        this.gamePlay = new GamePlay();
                        return [4 /*yield*/, this.gamePlay.init()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Spin;
}());
function commitmentUint8ArrayToVerifyInstanceBigInts(xUint8Array, yUint8Array) {
    var xHexString = ZkWasmUtil.bytesToHexStrings(xUint8Array);
    var yHexString = ZkWasmUtil.bytesToHexStrings(yUint8Array);
    console.log("xHexString = ", xHexString);
    console.log("yHexString = ", yHexString);
    var verifyInstances = commitmentHexToHexString("0x" + xHexString[0].slice(2).padStart(64, "0"), "0x" + yHexString[0].slice(2).padStart(64, "0"));
    console.log("verifyInstances = ", verifyInstances);
    var verifyingBytes = ZkWasmUtil.hexStringsToBytes(verifyInstances, 32);
    console.log("verifyingBytes = ", verifyingBytes);
    var verifyingBigInts = ZkWasmUtil.bytesToBigIntArray(verifyingBytes);
    console.log("verifyingBigInts = ", verifyingBigInts);
    return verifyingBigInts;
}
/* This function is used to convert the commitment hex to hex string
 * in the format of verifying instance
 * @param x: x hex string
 * @param y: y hex string
 */
function commitmentHexToHexString(x, y) {
    var hexString1 = "0x" + x.slice(12, 66);
    var hexString2 = "0x" + y.slice(39) + "00000000000000000" + x.slice(2, 12);
    var hexString3 = "0x" + y.slice(2, 39);
    return [hexString1, hexString2, hexString3];
}

export { GamePlay, Spin, SpinGameInitArgs, SpinGameIntermediateStates, add_proving_taks, getImageCommitmentBigInts, load_proving_taks, load_proving_taks_util_result, signMessage };
//# sourceMappingURL=bundle.mjs.js.map
