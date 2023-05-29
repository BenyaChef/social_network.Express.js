import {ResultCodeHandler} from "../../models/result-code-handler";
import {ObjectId} from "mongodb";
import {Errors} from "../../enum/errors";
import {HTTP_STATUS} from "../../enum/enum-HTTP-status";

export const checkResultCode = (resultCode: ResultCodeHandler<ObjectId | null>) => {
    let result = 0
    switch (resultCode.error) {
        case Errors.Not_Found :
            result = HTTP_STATUS.Not_found
            break
        case Errors.Error_Server:
            result = HTTP_STATUS.Server_error
            break
        case Errors.Bad_Request:
            result = HTTP_STATUS.Bad_request
            break
    }
    return result
}