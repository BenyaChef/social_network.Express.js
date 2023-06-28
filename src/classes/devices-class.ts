export class Devices {
    constructor(public deviceId: string,
                public title: string = 'agent undefined',
                public issuedAt: number,
                public expiresAt: number,
                public userId: string,
                public ip: string) {
    }
}