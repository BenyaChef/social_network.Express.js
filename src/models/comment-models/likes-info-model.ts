import {LikesStatus} from "../../enum/likes-status-enum";
import {newestLikesType} from "./like-model";

export interface LikesInfoModel {
    dislikesCount: number
    likesCount: number
    myStatus: LikesStatus
    newestLikes?: newestLikesType[]
}