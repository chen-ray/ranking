interface IBase {
}

interface IRankingData {
    id: number,
    rank: number,
    rank_change: number,
    tournaments: number,
    points: number,
    player1_name: string,
    country_img: string,
    country_name: string,
    country_id: string,
    p1_country: string,
    player1_birth: string,
    player2_name: string,
    player2_birth: string
}

interface IPage{
    current: number,
    total: number,
    first: number,
    last: number,
    next: number,
    prev: number
}

interface ILinks {
    self: string,
    first: string,
    last: string,
    prev: string,
    next: string
}

interface IMetaLink {
    url: string,
    label: string,
    active: string
}

interface IMeta {
    // 当前是哪一页
    current_page: number
    /**
     * 第一条数据索引
     */
    from: number
    /**
     * 最后一页
     */
    last_page: number
    /**
     * 请求的API网址
     */
    path: string
    /**
     * 每页多少条数据
     */
    per_page: number
    /**
     * 最后一条数据索引
     */
    to: number
    /**
     * 一共多少条数据
     */
    total: number
    links: IMetaLink[]
    current: number
    last: number
    next: number
    prev: number
}

export class IRanking implements IBase{
    data: IRankingData[] = [];
    meta: IMeta = {
        current: 0, current_page: 0, from: 0, last: 0, last_page: 0, links: [], next: 0, path: "", per_page: 0, prev: 0, to: 0, total: 0
    };
    links: ILinks[] = [];
}

export interface IBreakdown {
    id: number,
    ranking_id: number,
    ranking_calc: number,
    result: number,
    points: number,
    date: string,
    name: string,
    url: string,
    created_at: string,
    updated_at: string,
}

export interface IWeek {
    id: number
    display: string
}
