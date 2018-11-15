"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs = __importStar(require("mz/fs"));
const fromOBJECT_1 = require("./fromOBJECT");
const WORKING_DIR = path_1.dirname(require.main.filename);
exports.fromJSON = async (path) => {
    const file = await fs.readFile(path_1.join(WORKING_DIR, path), 'utf8');
    const script = JSON.parse(file);
    await fromOBJECT_1.fromOBJECT(script);
};
