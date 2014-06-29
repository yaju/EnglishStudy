class StudyApp {
    element: HTMLElement;
    span: HTMLElement;
    span2: HTMLElement;
    timerToken: number;

    output: JSON;
    obj: any =
    {
        col001: { "Question": "これは教会です", "Answer": ["This", "is", "charch"], "Mark":"."},
        col002: { "Question": "あれは机ですか", "Answer": ["Is", "that", "a", "desk"], "Mark": "?" },
    };

    constructor(element: HTMLElement) {
        //this.output = JSON.parse(this.obj);

        var questionElm: HTMLElement = document.getElementById('question');
        questionElm.innerText += this.obj["col001"].Question;


        //this.element = element;
        //this.element.innerHTML += this.obj["col001"].Question;

        var wordelm: HTMLElement = document.getElementById('word');
       

        for (var ans in this.obj["col001"].Answer) {
            this.span = document.createElement('span');
            wordelm.appendChild(this.span);
            this.span.className = "wordOn";
            this.span.innerText = this.obj["col001"].Answer[ans];
            this.span.onclick = (event) => this.onWordClick(this, event);
        }
    }

    onWordClick(that, e: MouseEvent) {
        var answerElm: HTMLElement = document.getElementById('answer');
        var span2 = document.createElement('span');
        answerElm.appendChild(span2);
        var target: HTMLElement = <HTMLElement>e.target;
        target.className = "wordOff";
        span2.className = "answer";
        span2.innerText = target.outerText;

        //答え合わせ
        var ans: String = "";
        for (var i = 0; i < answerElm.childElementCount; i++) {
            var elm: HTMLElement = <HTMLElement>answerElm.childNodes[i];
            ans += elm.outerText + " ";
        }
        var str = "";
        for (var i in that.obj["col001"].Answer) {
            str += that.obj["col001"].Answer[i] + " ";
        }
        if (ans.trim() == str.trim()) {
            alert("Test");
        }
    }
}

window.onload = () => {
    var el = document.getElementById('content');
    var main = new StudyApp(el);
    //greeter.start();
};