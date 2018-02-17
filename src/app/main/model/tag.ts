import { TagType } from './tag-type';

export interface Tag {
    readonly id: string;
    readonly type: TagType;
    readonly value: number;
}
