class StudyApp {
    element: HTMLElement;
    timerToken: number;
    answerCount: number;
    speed:number = 150;          // 速度
    timeInterval: number = 280;
    countDown:number = 3+1;

    output: JSON;
    obj: any =
    {
        col001: { "Question": "これは教会です", "Answer": ["This", "is", "charch"], "Mark":"."},
        col002: { "Question": "あれは机ですか", "Answer": ["Is", "that", "a", "desk"], "Mark": "?" },
    };

    // コンストラクタ
    constructor(element: HTMLElement) {
        // 問題表示
        var questionElm: HTMLElement = document.getElementById('question');
        questionElm.innerText += this.obj["col001"].Question;
        // 正答数(ダミーは除く)
        this.answerCount = this.obj["col001"].Answer.length;

        this.startAction();
    }

    // ワードクリック処理
    onWordClick(that, e: MouseEvent) {
        // 答えの位置に配置
        var target: HTMLInputElement = <HTMLInputElement>e.target;
        var answerElm: HTMLElement = document.getElementById('answer');

        target.className = "wordOff";
        var input: HTMLInputElement = that.createWordBottun(that.zeroSuppress(target.id), "answer", target.value);
        input.onclick = (event) => this.onWordCancelClick(this, event);
        answerElm.appendChild(input);

        // 答え合わせ
        if (answerElm.childElementCount == this.answerCount) {
            // 全ての答え合わせ
            if (this.checkingAnswers(answerElm)) {
                alert("Test");
            }
            else {
                // 正解表示と正解と違う箇所の背景色を変更させる
                this.missLastAction(answerElm);
            }
        }
        else {
            // 正解と違う箇所をぷるぷるさせる
            this.missAction(answerElm);
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

    // ゼロサプレス
    zeroSuppress(val:string):number {
        return Number(val.replace(/\D/g, ''));
    }

    // ゼロパディング
    zeroPadding(totalWidth: number, num: number) {
        return ("00000" + num).slice(-totalWidth);
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
    setWordList() {
        var wordlistElm: HTMLElement = document.getElementById('wordlist');
        var input: HTMLInputElement;

        wordlistElm.innerText = "";
        wordlistElm.className = "wordStyle";
        for (var ans in this.obj["col001"].Answer) {
            input = this.createWordBottun(ans, "wordOn", this.obj["col001"].Answer[ans]);
            input.onclick = (event) => this.onWordClick(this, event);
            wordlistElm.appendChild(input);
        }
    }

    // 答え合わせ処理
    checkingAnswers(answerElm: HTMLElement):boolean {
        var ans: string = "";

        for (var i = 0; i < answerElm.childElementCount; i++) {
            var elm: HTMLInputElement = <HTMLInputElement>answerElm.childNodes[i];
            ans += elm.value + " ";
        }
        var str = "";
        for (var i in this.obj["col001"].Answer) {
            str += this.obj["col001"].Answer[i] + " ";
        }
        if (ans.trim() == str.trim()) {
            return true;
        }
        
        return false;
    }

    // 不正解時のぷるぷる処理
    missAction(answerElm: HTMLElement) {
        for (var i = 0; i < answerElm.childElementCount; i++) {
            var elm: HTMLInputElement = <HTMLInputElement>answerElm.childNodes[i];
            if (elm.value != this.obj["col001"].Answer[i]) {
                elm.className = "answer rum";
            }
        }
    }

    // 不正解時の最終処理
    missLastAction(answerElm: HTMLElement) {
        var wordelm: HTMLElement = document.getElementById('check');

        var ptagElm: HTMLElement = document.createElement('hr');
        wordelm.appendChild(ptagElm);
        var input: HTMLInputElement;

        var i: number = 0;
        for (var ans in this.obj["col001"].Answer) {
            input = this.createWordBottun(ans, "answer", this.obj["col001"].Answer[ans]);
            wordelm.appendChild(input);
            //違うところは色を変える
            var elm: HTMLInputElement = <HTMLInputElement>answerElm.childNodes[i];
            if (elm.value != input.value) {
                elm.className = "miss";
            }
            i++;
        }
    }

    // カウントダウンアクション
    startAction() {
        if (this.countDown > 1) {
            this.countDown--;
            this.timerToken = setTimeout(() => this.startAction(), 1000);
        }
        else {
            clearTimeout(this.timerToken);
            this.setWordList();
            this.timerAction();
            return;
        }
        document.getElementById("wordlist").innerText = this.countDown + "";
    }

    // タイマーアクション
    timerAction(){
        if (this.timeInterval > 0) {
            this.timeInterval--;
            this.timerToken = setTimeout(() => this.timerAction(), this.speed);
        }
        else {
            clearTimeout(this.timerToken);
        }
        document.getElementById("timer").style.width = this.timeInterval + "px";
    }
}

window.onload = () => {
    var el = document.getElementById('content');
    var main = new StudyApp(el);
    //greeter.start();
};