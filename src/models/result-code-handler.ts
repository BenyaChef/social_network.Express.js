import {Errors} from "../enum/errors";

export interface ResultCodeHandler<T> {
    success: boolean
    data: T | null
    error?: Errors
}