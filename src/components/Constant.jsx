export class URL {
    static HOST = 'http://localhost/dgdb/';
    static AREA = URL.HOST + 'api/area/';
    static QUEST = URL.HOST + 'api/quest/';
    static QUESTLIST = URL.HOST + 'api/questlist';
    static RANK = URL.HOST + 'api/rank';
    static SKILL = URL.HOST + 'api/skill/';
    static STORY = URL.HOST + 'api/story';
    static UNIT = URL.HOST + 'api/unit/';
    static UNITLIST = URL.HOST + 'api/unitlist';
    static VOTE_RESULT = URL.HOST + 'api/voteresult/';
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
export class COMMON {
    static SITE_NAME = "Divine Gate 資料庫"
}