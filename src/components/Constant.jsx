export class URL {
    static HOST = 'http://localhost/dgdb/';
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