var StudyApp = (function () {
    function StudyApp(element) {
        var _this = this;
        this.obj = {
            col001: { "Question": "これは教会です", "Answer": ["This", "is", "charch"], "Mark": "." },
            col002: { "Question": "あれは机ですか", "Answer": ["Is", "that", "a", "desk"], "Mark": "?" }
        };
        //this.output = JSON.parse(this.obj);
        var questionElm = document.getElementById('question');
        questionElm.innerText += this.obj["col001"].Question;

        //this.element = element;
        //this.element.innerHTML += this.obj["col001"].Question;
        var wordelm = document.getElementById('word');

        for (var ans in this.obj["col001"].Answer) {
            this.span = document.createElement('span');
            wordelm.appendChild(this.span);
            this.span.className = "wordOn";
            this.span.innerText = this.obj["col001"].Answer[ans];
            this.span.onclick = function (event) {
                return _this.onWordClick(_this, event);
            };
        }
    }
    StudyApp.prototype.onWordClick = function (that, e) {
        var answerElm = document.getElementById('answer');
        var span2 = document.createElement('span');
        answerElm.appendChild(span2);
        var target = e.target;
        target.className = "wordOff";
        span2.className = "answer";
        span2.innerText = target.outerText;

        //答え合わせ
        var ans = "";
        for (var i = 0; i < answerElm.childElementCount; i++) {
            var elm = answerElm.childNodes[i];
            ans += elm.outerText + " ";
        }
        var str = "";
        for (var i in that.obj["col001"].Answer) {
            str += that.obj["col001"].Answer[i] + " ";
        }
        if (ans.trim() == str.trim()) {
            alert("Test");
        }
    };
    return StudyApp;
})();

window.onload = function () {
    var el = document.getElementById('content');
    var main = new StudyApp(el);
    //greeter.start();
};
//# sourceMappingURL=app.js.map
