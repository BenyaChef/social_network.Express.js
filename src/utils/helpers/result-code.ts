import {Errors} from "../../enum/errors";

export const resultCodeMap = <T>(success: boolean, data: T, error?: Errors) => {
    return {
        success: success,
        data: data,
        error: error
    }
}