var Scene;
(function (Scene) {
    Scene[Scene["None"] = 0] = "None";
    Scene[Scene["Menu"] = 1] = "Menu";
    Scene[Scene["Game"] = 2] = "Game";
    Scene[Scene["Config"] = 3] = "Config";
})(Scene || (Scene = {}));

var Mode;
(function (Mode) {
    Mode[Mode["Ready"] = 0] = "Ready";
    Mode[Mode["Ready2"] = 1] = "Ready2";
    Mode[Mode["Start"] = 2] = "Start";
    Mode[Mode["Next"] = 3] = "Next";
    Mode[Mode["Next2"] = 4] = "Next2";
    Mode[Mode["End"] = 5] = "End";
})(Mode || (Mode = {}));

var StudyApp = (function () {
    // コンストラクタ
    function StudyApp(element) {
        this.speed = 150;
        this.waitInterval = 1;
        this.timeInterval = StudyApp.TIMER_COUNT_MAX;
        this.obj = {
            col001: { "Question": "これは教会です", "Answer": ["This", "is", "charch"], "Dummy": ["are"] },
            col002: { "Question": "あれは机ですか", "Answer": ["Is", "that", "a", "desk", "?"], "Dummy": ["Are"] }
        };
        this.resultList = {
            rtn1: { "Message": "Bad", "Range": 10, "Score": 0 },
            rtn2: { "Message": "Good", "Range": 30, "Score": 200 },
            rtn3: { "Message": "Great", "Range": 60, "Score": 500 },
            rtn4: { "Message": "Excelent", "Range": 80, "Score": 1000 },
            rtn5: { "Message": "Fanstastic", "Range": 100, "Score": 1500 }
        };
        this.sceneState = 2 /* Game */;
        this.questionNo = 1;

        this.Update(0 /* Ready */);
    }
    // 更新処理
    StudyApp.prototype.Update = function (gameState) {
        var _this = this;
        var questionElm = document.getElementById('question');
        var answerElm = document.getElementById('answer');
        var wordlistElm = document.getElementById('wordlist');
        var actionElm = document.getElementById('action');
        var colNo = "col" + this.zeroPadding(3, this.questionNo);
        this.gameState = gameState;

        switch (this.sceneState) {
            case 2 /* Game */:
                switch (gameState) {
                    case 0 /* Ready */:
                        // 問題表示
                        questionElm.className = "firstStyle";
                        questionElm.innerHTML = "<p>" + this.obj[colNo].Question + "</p>";

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

                    case 1 /* Ready2 */:
                        // ワードリストセット
                        this.setWordList(colNo);

                        // ウェイト
                        this.waitAction(2 /* Start */);
                        break;

                    case 2 /* Start */:
                        // ゲームスタート
                        this.timerAction();

                        // 問題表示スタイル変更
                        questionElm.className = "secondStyle";
                        questionElm.innerText = this.obj[colNo].Question;
                        break;

                    case 3 /* Next */:
                        // 次の問題ボタン表示
                        wordlistElm.className = "resultSecond";

                        wordlistElm.innerText = "";
                        actionElm.innerText = "";

                        var input;
                        input = this.createWordBottun(1, "wordOn", "次の問題");
                        input.onclick = function (event) {
                            return _this.onNextClick(_this, event);
                        };
                        actionElm.appendChild(input);
                        break;
                }
        }

        return true;
    };

    StudyApp.prototype.listener = function (e) {
        switch (e.type) {
            case "animationstart":
                break;
            case "animationend":
                break;
            case "animationiteration":
                break;
        }
    };

    // ワードクリック処理
    StudyApp.prototype.onWordClick = function (that, e) {
        var _this = this;
        if (this.gameState != 2 /* Start */)
            return;

        // 答えの位置に配置
        var target = e.target;
        var answerElm = document.getElementById('answer');

        target.className = "wordOff";
        var input = that.createWordBottun(that.zeroSuppress(target.id), "answer", target.value);
        input.onclick = function (event) {
            return _this.onWordCancelClick(_this, event);
        };
        answerElm.appendChild(input);

        var colNo = "col" + this.zeroPadding(3, this.questionNo);

        // 答え合わせ
        if (answerElm.childElementCount == this.answerCount) {
            // 全ての答え合わせ
            var resultVal = this.timeInterval;
            var ans = [];
            if (!this.checkingAnswers(colNo, answerElm, ans)) {
                // 正解表示と正解と違う箇所の背景色を変更させる
                this.missLastAction(colNo, answerElm);
                resultVal = 0;
            } else {
                // 全て正解
                // クリア
                this.removeChildNode(answerElm);
                answerElm.innerHTML = "<p>" + ans[0] + "</p>";
            }

            // 結果表示
            this.resultAction(resultVal);
        } else {
            // 正解と違う箇所をシェイクさせる
            this.missAction(colNo, answerElm);
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

    // 次の問題クリック処理
    StudyApp.prototype.onNextClick = function (that, e) {
        this.questionNo++;
        this.timeInterval = StudyApp.TIMER_COUNT_MAX;

        this.Update(0 /* Ready */);
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
    StudyApp.prototype.setWordList = function (colNo) {
        var _this = this;
        var wordlistElm = document.getElementById('wordlist');
        var input;
        var strWord = [];
        var r;
        var w;
        var i;

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
            input = this.createWordBottun(i + 1, "wordOn", strWord[i]);
            input.onclick = function (event) {
                return _this.onWordClick(_this, event);
            };
            wordlistElm.appendChild(input);
        }
    };

    // 答え合わせ処理
    StudyApp.prototype.checkingAnswers = function (colNo, answerElm, result) {
        var ans = "";

        for (var i = 0; i < answerElm.childElementCount; i++) {
            var elm = answerElm.childNodes[i];
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
    };

    // 不正解時のシェイク処理
    StudyApp.prototype.missAction = function (colNo, answerElm) {
        for (var i = 0; i < answerElm.childElementCount; i++) {
            var elm = answerElm.childNodes[i];
            if (elm.value != this.obj[colNo].Answer[i]) {
                elm.className = "answer rum";
            }
        }
    };

    // 不正解時の最終処理
    StudyApp.prototype.missLastAction = function (colNo, answerElm) {
        var wordelm = document.getElementById('check');

        var ptagElm = document.createElement('hr');
        wordelm.appendChild(ptagElm);
        var input;

        var i = 0;
        for (var ans in this.obj[colNo].Answer) {
            input = this.createWordBottun(ans, "answer", this.obj[colNo].Answer[ans]);
            wordelm.appendChild(input);

            //違うところは色を変える
            var elm = answerElm.childNodes[i];
            if (elm.value != input.value) {
                elm.className = "miss";
            }
            i++;
        }
    };

    // 結果表示処理
    StudyApp.prototype.resultAction = function (val) {
        // タイマー解除
        clearTimeout(this.timerToken);

        var len = this.getJSONLength(this.resultList);
        for (var i = 0; i < len; i++) {
            var col = "rtn" + (i + 1);
            if ((val / StudyApp.TIMER_COUNT_MAX) * 100 <= this.resultList[col].Range) {
                var wordlistElm = document.getElementById('wordlist');
                this.removeChildNode(wordlistElm);

                // 残り秒数による結果表示
                wordlistElm.className = "pulse";
                wordlistElm.innerText = this.resultList[col].Message;

                var scoreElm = document.getElementById('action');
                scoreElm.className = "scoreStyle";
                scoreElm.innerText = this.resultList[col].Score;

                // ウェイト
                this.waitInterval = 3;
                this.waitAction(3 /* Next */);
                break;
            }
        }
    };

    //----------------------------------------------------------
    // タイマー関連処理
    //----------------------------------------------------------
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
            this.Update(1 /* Ready2 */);
            return;
        }
        document.getElementById("wordlist").innerText = this.countDown + "";
    };

    // ウェイトアクション
    StudyApp.prototype.waitAction = function (nextState) {
        var _this = this;
        if (this.waitInterval > 0) {
            this.waitInterval--;
            this.timerToken = setTimeout(function () {
                return _this.waitAction(nextState);
            }, 500);
        } else {
            clearTimeout(this.timerToken);
            this.Update(nextState);
            return;
        }
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
            return;
        }
        document.getElementById("timer").style.width = this.timeInterval + "px";
    };

    // スリープ
    StudyApp.prototype.sleep = function (ms) {
        var d1 = new Date().getTime();
        var d2 = new Date().getTime();
        while (d2 < (d1 + ms)) {
            d2 = new Date().getTime();
        }
        return;
    };

    //----------------------------------------------------------
    // 共通関数
    //----------------------------------------------------------
    // ゼロサプレス
    StudyApp.prototype.zeroSuppress = function (val) {
        return Number(val.replace(/\D/g, ''));
    };

    // ゼロパディング
    StudyApp.prototype.zeroPadding = function (totalWidth, num) {
        return ("00000" + num).slice(-totalWidth);
    };

    // JSON件数
    StudyApp.prototype.getJSONLength = function (target) {
        var len = 0;
        for (var m in target) {
            len++;
        }

        return len;
    };

    // 子ノード全削除
    StudyApp.prototype.removeChildNode = function (target) {
        for (var i = target.childNodes.length - 1; i >= 0; i--) {
            target.removeChild(target.childNodes[i]);
        }
    };
    StudyApp.TIMER_COUNT_MAX = 240;
    StudyApp.COUNT_DOWN_MAX = 3;
    return StudyApp;
})();

window.onload = function () {
    var el = document.getElementById('content');
    var main = new StudyApp(el);
    //greeter.start();
};
//# sourceMappingURL=app.js.map
