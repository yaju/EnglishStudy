var StudyApp = (function () {
    // コンストラクタ
    function StudyApp(element) {
        this.speed = 150;
        this.timeInterval = 280;
        this.countDown = 3 + 1;
        this.obj = {
            col001: { "Question": "これは教会です", "Answer": ["This", "is", "charch"], "Mark": "." },
            col002: { "Question": "あれは机ですか", "Answer": ["Is", "that", "a", "desk"], "Mark": "?" }
        };
        // 問題表示
        var questionElm = document.getElementById('question');
        questionElm.innerText += this.obj["col001"].Question;

        // 正答数(ダミーは除く)
        this.answerCount = this.obj["col001"].Answer.length;

        this.startAction();
    }
    // ワードクリック処理
    StudyApp.prototype.onWordClick = function (that, e) {
        var _this = this;
        // 答えの位置に配置
        var target = e.target;
        var answerElm = document.getElementById('answer');

        target.className = "wordOff";
        var input = that.createWordBottun(that.zeroSuppress(target.id), "answer", target.value);
        input.onclick = function (event) {
            return _this.onWordCancelClick(_this, event);
        };
        answerElm.appendChild(input);

        // 答え合わせ
        if (answerElm.childElementCount == this.answerCount) {
            // 全ての答え合わせ
            if (this.checkingAnswers(answerElm)) {
                alert("Test");
            } else {
                // 正解表示と正解と違う箇所の背景色を変更させる
                this.missLastAction(answerElm);
            }
        } else {
            // 正解と違う箇所をぷるぷるさせる
            this.missAction(answerElm);
        }
    };

    // ワードキャンセルクリック処理
    StudyApp.prototype.onWordCancelClick = function (that, e) {
        // 答えから対象ワードを削除する
        var target = e.target;
        var answerElm = document.getElementById('answer');
        answerElm.removeChild(target);

        // ワード一覧の対象ワードを戻す
        var wordlistElm = document.getElementById('wordlist');
        for (var i = 0; i < wordlistElm.childElementCount; i++) {
            var elm = wordlistElm.childNodes[i];
            if (elm.id == target.id) {
                elm.className = "wordOn";
                break;
            }
        }
    };

    // ゼロサプレス
    StudyApp.prototype.zeroSuppress = function (val) {
        return Number(val.replace(/\D/g, ''));
    };

    // ゼロパディング
    StudyApp.prototype.zeroPadding = function (totalWidth, num) {
        return ("00000" + num).slice(-totalWidth);
    };

    // ワードボタン生成
    StudyApp.prototype.createWordBottun = function (no, clsName, val) {
        var inputElm;

        inputElm = document.createElement('input');
        inputElm.type = "button";
        inputElm.id = "btn" + this.zeroPadding(2, no);
        inputElm.className = clsName;
        inputElm.value = val;

        return inputElm;
    };

    // ワードリスト生成
    StudyApp.prototype.setWordList = function () {
        var _this = this;
        var wordlistElm = document.getElementById('wordlist');
        var input;

        wordlistElm.innerText = "";
        wordlistElm.className = "wordStyle";
        for (var ans in this.obj["col001"].Answer) {
            input = this.createWordBottun(ans, "wordOn", this.obj["col001"].Answer[ans]);
            input.onclick = function (event) {
                return _this.onWordClick(_this, event);
            };
            wordlistElm.appendChild(input);
        }
    };

    // 答え合わせ処理
    StudyApp.prototype.checkingAnswers = function (answerElm) {
        var ans = "";

        for (var i = 0; i < answerElm.childElementCount; i++) {
            var elm = answerElm.childNodes[i];
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
    };

    // 不正解時のぷるぷる処理
    StudyApp.prototype.missAction = function (answerElm) {
        for (var i = 0; i < answerElm.childElementCount; i++) {
            var elm = answerElm.childNodes[i];
            if (elm.value != this.obj["col001"].Answer[i]) {
                elm.className = "answer rum";
            }
        }
    };

    // 不正解時の最終処理
    StudyApp.prototype.missLastAction = function (answerElm) {
        var wordelm = document.getElementById('check');

        var ptagElm = document.createElement('hr');
        wordelm.appendChild(ptagElm);
        var input;

        var i = 0;
        for (var ans in this.obj["col001"].Answer) {
            input = this.createWordBottun(ans, "answer", this.obj["col001"].Answer[ans]);
            wordelm.appendChild(input);

            //違うところは色を変える
            var elm = answerElm.childNodes[i];
            if (elm.value != input.value) {
                elm.className = "miss";
            }
            i++;
        }
    };

    // カウントダウンアクション
    StudyApp.prototype.startAction = function () {
        var _this = this;
        if (this.countDown > 1) {
            this.countDown--;
            this.timerToken = setTimeout(function () {
                return _this.startAction();
            }, 1000);
        } else {
            clearTimeout(this.timerToken);
            this.setWordList();
            this.timerAction();
            return;
        }
        document.getElementById("wordlist").innerText = this.countDown + "";
    };

    // タイマーアクション
    StudyApp.prototype.timerAction = function () {
        var _this = this;
        if (this.timeInterval > 0) {
            this.timeInterval--;
            this.timerToken = setTimeout(function () {
                return _this.timerAction();
            }, this.speed);
        } else {
            clearTimeout(this.timerToken);
        }
        document.getElementById("timer").style.width = this.timeInterval + "px";
    };
    return StudyApp;
})();

window.onload = function () {
    var el = document.getElementById('content');
    var main = new StudyApp(el);
    //greeter.start();
};
//# sourceMappingURL=app.js.map
