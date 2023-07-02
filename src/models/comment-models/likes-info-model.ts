import {LikesStatus} from "../../enum/likes-status-enum";

export interface LikesInfoModel {
    dislikesCount: number
    likesCount: number
    myStatus?: LikesStatus
}