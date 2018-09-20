export class COMMON {
    static HOST = 'http://localhost/dgdb/';
    static SITE_NAME = "Divine Gate 資料庫"
}
export class URL {
    static AREA = COMMON.HOST + 'api/area/';
    static QUEST = COMMON.HOST + 'api/quest/';
    static QUESTLIST = COMMON.HOST + 'api/questlist';
    static RANK = COMMON.HOST + 'api/rank';
    static SKILL = COMMON.HOST + 'api/skill/';
    static STORY = COMMON.HOST + 'api/story';
    static UNIT = COMMON.HOST + 'api/unit/';
    static UNITLIST = COMMON.HOST + 'api/unitlist';
    static VOTE_RESULT = COMMON.HOST + 'api/voteresult/';
}
export class STATUS {
    static LOADING = 0;
    static SUCCESS = 1;
    static ERROR = 2;
}
export class VOTE_RESULT_TYPE {
    static UP = "up";
    static DOWN = "down";
    static EQUAL = "equal";
    static NEW = "new";
}