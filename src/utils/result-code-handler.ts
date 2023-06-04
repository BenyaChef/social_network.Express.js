import {ResultCodeHandler} from "../models/result-code-handler";
import {Errors} from "../enum/errors";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";

export const resultCodeHandler =<T>(obj: ResultCodeHandler<T>) => {
    switch (obj.error){
        case Errors.Not_Found:
            return HTTP_STATUS.Not_found
        case Errors.Forbidden:
            return HTTP_STATUS.Forbidden
        default:
            return HTTP_STATUS.Server_error
    }
}