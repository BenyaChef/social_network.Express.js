import {Errors} from "../../enum/errors";
import {ObjectId} from "mongodb";

export const resultCodeMap = (success: boolean, data: ObjectId | null, error?: Errors) => {
    return {
        success: success,
        data: data,
        error: error
    }
}