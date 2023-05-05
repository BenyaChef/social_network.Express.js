"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewId = void 0;
const createNewId = () => {
    const date = +(new Date());
    return date.toString();
};
exports.createNewId = createNewId;
