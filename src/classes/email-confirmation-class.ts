import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";

export class EmailConfirmationClass {
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
    constructor(public email: string) {
        this.confirmationCode = uuidv4()
        this.expirationDate = add(new Date(), {minutes: 5})
        this.isConfirmed = false
    }
}