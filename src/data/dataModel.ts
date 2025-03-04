export class userDataModel{
    id: string
    username: string
    password: string
    wallet: walletDataModel
    constructor(id: string, username: string, password: string, wallet: walletDataModel){
        this.id = id;
        this.username = username;
        this.password = password;
        this.wallet = wallet;
    }
}

export class walletDataModel{
    TotalDeposits: number
    assets: {
        [key: string]: number
    }
    constructor(TotalDeposits: number, assets: {[key: string]: number}){
        this.TotalDeposits = TotalDeposits;
        this.assets = assets;
    }
}
