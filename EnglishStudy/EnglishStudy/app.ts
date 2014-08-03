enum Scene {
    None,   // 無し
    Menu,   // メニュー画面
    Game,   // ゲーム画面
    Config  // 設定画面
}

enum Mode {
    Ready,  // 準備
    Ready2, // 準備
    Start,  // 開始
    Next,   // 次問題
    Next2,  // 次問題
    End     // 終了
}

class StudyApp {
    private static TIMER_COUNT_MAX: number = 240;
    private static COUNT_DOWN_MAX: number = 3;      // カウントダウン数

    private element: HTMLElement;

    private sceneState: Scene;          // シーン状態
    private gameState: Mode;            // ゲーム状態

    private questionNo: number;         // 問題番号
    private answerCount: number;        // 正答数
    private speed:number = 150;         // 速度

    private timerToken: number;         // タイマートークン
    private waitInterval: number = 1;   // ウェイト数
    private countDown: number;        
    private timeInterval: number = StudyApp.TIMER_COUNT_MAX;

    private obj: any =
    {
        col001: { "Question": "これは教会です", "Answer": ["This", "is", "charch"], "Dummy":["are"]},
        col002: { "Question": "あれは机ですか", "Answer": ["Is", "that", "a", "desk", "?"], "Dummy": ["Are"]},
    };

    private resultList: any =
    {
        rtn1: { "Message": "Bad", "Range": 10, "Score": 0 },
        rtn2: { "Message": "Good", "Range": 30, "Score": 200 },
        rtn3: { "Message": "Great", "Range": 60, "Score": 500 },
        rtn4: { "Message": "Excelent", "Range": 80, "Score": 1000 },
        rtn5: { "Message": "Fanstastic", "Range": 100, "Score": 1500 }
    };


    // コンストラクタ
    constructor(element: HTMLElement) {

        this.sceneState = Scene.Game;
        this.questionNo = 1;

        this.Update(Mode.Ready);
    }        

    // 更新処理
    Update(gameState: Mode): boolean {
        var questionElm: HTMLElement = document.getElementById('question');
        var answerElm: HTMLElement = document.getElementById('answer');
        var wordlistElm: HTMLElement = document.getElementById('wordlist');
        var actionElm: HTMLElement = document.getElementById('action');
        var colNo: string = "col" + this.zeroPadding(3, this.questionNo);
        this.gameState = gameState;

        switch (this.sceneState) {
            case Scene.Game:
                switch (gameState) {
                    case Mode.Ready:
                        // 問題表示
                        questionElm.className = "firstStyle";
                        questionElm.innerHTML = "<p>" + this.obj[colNo].Question + "</p>"
                        // 正答数(ダミーは除く)
                        this.answerCount = this.obj[colNo].Answer.length;

                        // クリア
                        this.removeChildNode(answerElm);
                        this.removeChildNode(actionElm);

                        // カウントダウン
                        this.countDown = StudyApp.COUNT_DOWN_MAX + 1;
                        wordlistElm.className = "countDown";
                        this.startAction();
                        break;

                    case Mode.Ready2:
                        // ワードリストセット
                        this.setWordList(colNo);
                        // ウェイト
                        this.waitAction(Mode.Start);
                        break;

                    case Mode.Start:
                        // ゲームスタート
                        this.timerAction();

                        // 問題表示スタイル変更
                        questionElm.className = "secondStyle";
                        questionElm.innerText = this.obj[colNo].Question;
                        break;

                    case Mode.Next:
                        // 次の問題ボタン表示
                        wordlistElm.className = "resultSecond";

                        wordlistElm.innerText = "";
                        actionElm.innerText = "";

                        var input: HTMLInputElement;
                        input = this.createWordBottun(1, "wordOn", "次の問題");
                        input.onclick = (event) => this.onNextClick(this, event);
                        actionElm.appendChild(input);
                        break;

                }
        }

        return true;
    }

    listener(e) {
        switch (e.type) {
            case "animationstart":
                break;
            case "animationend":

                break;
            case "animationiteration":
                break;
        }
    }

    // ワードクリック処理
    onWordClick(that, e: MouseEvent) {
        if (this.gameState != Mode.Start) return;

        // 答えの位置に配置
        var target: HTMLInputElement = <HTMLInputElement>e.target;
        var answerElm: HTMLElement = document.getElementById('answer');

        target.className = "wordOff";
        var input: HTMLInputElement = that.createWordBottun(that.zeroSuppress(target.id), "answer", target.value);
        input.onclick = (event) => this.onWordCancelClick(this, event);
        answerElm.appendChild(input);

        var colNo: string = "col" + this.zeroPadding(3, this.questionNo);

        // 答え合わせ
        if (answerElm.childElementCount == this.answerCount) {
            // 全ての答え合わせ
            var resultVal: number = this.timeInterval;
            var ans = [];
            if (!this.checkingAnswers(colNo, answerElm, ans)) {
                // 正解表示と正解と違う箇所の背景色を変更させる
                this.missLastAction(colNo, answerElm);
                resultVal = 0;
            }
            else {
                // 全て正解 
 	            // クリア
                this.removeChildNode(answerElm);
                answerElm.innerHTML = "<p>" + ans[0] + "</p>"

            }
            // 結果表示
            this.resultAction(resultVal);
        }
        else {
            // 正解と違う箇所をシェイクさせる
            this.missAction(colNo, answerElm);
        }
    }

    // ワードキャンセルクリック処理
    onWordCancelClick(that, e: MouseEvent) {
        // 答えから対象ワードを削除する
        var target: HTMLInputElement = <HTMLInputElement>e.target;
        var answerElm: HTMLElement = document.getElementById('answer');
        answerElm.removeChild(target);

        // ワード一覧の対象ワードを戻す
        var wordlistElm: HTMLElement = document.getElementById('wordlist');
        for (var i = 0; i < wordlistElm.childElementCount; i++) {
            var elm: HTMLInputElement = <HTMLInputElement>wordlistElm.childNodes[i];
            if (elm.id == target.id) {
                elm.className = "wordOn";
                break;
            }
        }
    }

    // 次の問題クリック処理
    onNextClick(that, e: MouseEvent) {

        this.questionNo++;
        this.timeInterval = StudyApp.TIMER_COUNT_MAX;

        this.Update(Mode.Ready);
    }

    // ワードボタン生成
    createWordBottun(no: number, clsName: string, val: string): HTMLInputElement {
        var inputElm: HTMLInputElement;

        inputElm = document.createElement('input');
        inputElm.type = "button";
        inputElm.id = "btn" + this.zeroPadding(2, no);
        inputElm.className = clsName;
        inputElm.value = val;

        return inputElm;
    }

    // ワードリスト生成
    setWordList(colNo:string) {
        var wordlistElm: HTMLElement = document.getElementById('wordlist');
        var input: HTMLInputElement;
        var strWord = [];
        var r: number
        var w: string;
        var i: number;

        for (var ans in this.obj[colNo].Answer) {
            strWord.push(this.obj[colNo].Answer[ans]);
        }

        for (i = 0; i < strWord.length; i++) {
            r = Math.floor(Math.random() * strWord.length);
            w = strWord[i];
            strWord[i] = strWord[r];
            strWord[r] = w;
        }

        wordlistElm.innerText = "";
        wordlistElm.className = "wordStyle";
        for (i = 0; i < strWord.length; i++) {
            input = this.createWordBottun(i+1, "wordOn", strWord[i]);
            input.onclick = (event) => this.onWordClick(this, event);
            wordlistElm.appendChild(input);
        }
    }

    // 答え合わせ処理
    checkingAnswers(colNo:string, answerElm: HTMLElement, result):boolean {
        var ans:string = ""

        for (var i = 0; i < answerElm.childElementCount; i++) {
            var elm: HTMLInputElement = <HTMLInputElement>answerElm.childNodes[i];
            ans += elm.value + " ";
        }
        var str = "";
        for (var i in this.obj[colNo].Answer) {
            str += this.obj[colNo].Answer[i] + " ";
        }
        ans = ans.trim();
        if (ans == str.trim()) {
            // ?がなければね、ピリオドを付ける
            if (ans.indexOf("?") < 0) {
                ans += ".";
            }
            result.push(ans);
            return true;
        }
        
        return false;
    }

    // 不正解時のシェイク処理
    missAction(colNo: string, answerElm: HTMLElement) {
        for (var i = 0; i < answerElm.childElementCount; i++) {
            var elm: HTMLInputElement = <HTMLInputElement>answerElm.childNodes[i];
            if (elm.value != this.obj[colNo].Answer[i]) {
                elm.className = "answer rum";
            }
        }
    }

    // 不正解時の最終処理
    missLastAction(colNo: string, answerElm: HTMLElement) {
        var wordelm: HTMLElement = document.getElementById('check');

        var ptagElm: HTMLElement = document.createElement('hr');
        wordelm.appendChild(ptagElm);
        var input: HTMLInputElement;

        var i: number = 0;
        for (var ans in this.obj[colNo].Answer) {
            input = this.createWordBottun(ans, "answer", this.obj[colNo].Answer[ans]);
            wordelm.appendChild(input);
            //違うところは色を変える
            var elm: HTMLInputElement = <HTMLInputElement>answerElm.childNodes[i];
            if (elm.value != input.value) {
                elm.className = "miss";
            }
            i++;
        }
    }

    // 結果表示処理
    resultAction(val: number) {
        // タイマー解除
        clearTimeout(this.timerToken);

        var len = this.getJSONLength(this.resultList);
        for (var i = 0; i < len; i++) {
            var col: string = "rtn" + (i + 1);
            if ((val / StudyApp.TIMER_COUNT_MAX) * 100 <= this.resultList[col].Range) {
                var wordlistElm: HTMLElement = document.getElementById('wordlist');
                this.removeChildNode(wordlistElm);
                // 残り秒数による結果表示
                wordlistElm.className = "pulse";
                wordlistElm.innerText = this.resultList[col].Message;

                var scoreElm: HTMLElement = document.getElementById('action');
                scoreElm.className = "scoreStyle";
                scoreElm.innerText = this.resultList[col].Score;
                // ウェイト
                this.waitInterval = 3;
                this.waitAction(Mode.Next);
                break;
            }
        }
    }

    //----------------------------------------------------------
    // タイマー関連処理
    //----------------------------------------------------------
    // カウントダウンアクション
    startAction() {
        if (this.countDown > 1) {
            this.countDown--;
            this.timerToken = setTimeout(() => this.startAction(), 1000);
        }
        else {
            clearTimeout(this.timerToken);
            this.Update(Mode.Ready2);   
            return;
        }
        document.getElementById("wordlist").innerText = this.countDown + "";
    }

    // ウェイトアクション
    waitAction(nextState: Mode) {
        if (this.waitInterval > 0) {
            this.waitInterval--;
            this.timerToken = setTimeout(() => this.waitAction(nextState), 500);
        }
        else {
            clearTimeout(this.timerToken);
            this.Update(nextState);
            return;
        }
    }

    // タイマーアクション
    timerAction(){
        if (this.timeInterval > 0) {
            this.timeInterval--;
            this.timerToken = setTimeout(() => this.timerAction(), this.speed);
        }
        else {
            clearTimeout(this.timerToken);
            return;
        }
        document.getElementById("timer").style.width = this.timeInterval + "px";
    }

    // スリープ
    sleep(ms:number) {
        var d1 = new Date().getTime();
        var d2 = new Date().getTime();
        while (d2 < (d1 + ms)) {
            d2 = new Date().getTime();
        }
        return;
    }

    //----------------------------------------------------------
    // 共通関数
    //----------------------------------------------------------
    // ゼロサプレス
    zeroSuppress(val: string): number {
        return Number(val.replace(/\D/g, ''));
    }

    // ゼロパディング
    zeroPadding(totalWidth: number, num: number) {
        return ("00000" + num).slice(-totalWidth);
    }

    // JSON件数
    getJSONLength(target: Object): number {
        var len: number = 0;
        for (var m in target) {
            len++;
        }

        return len;
    }

    // 子ノード全削除
    removeChildNode(target: HTMLElement) {

        for (var i = target.childNodes.length - 1; i >= 0; i--) {
            target.removeChild(target.childNodes[i]);
        }
    }

}

window.onload = () => {
    var el = document.getElementById('content');
    var main = new StudyApp(el);
    //greeter.start();
};