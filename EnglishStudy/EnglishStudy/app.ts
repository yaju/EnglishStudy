class StudyApp {
    element: HTMLElement;
    span: HTMLElement;
    timerToken: number;

    output: JSON;
    obj: any =
    {
        col001: { "Question": "これは教会です", "Answer": ["This", "is", "charch"], "Mark":"."},
        col002: { "Question": "あれは机ですか", "Answer": ["Is", "that", "a", "desk"], "Mark": "?" },
    };

    constructor(element: HTMLElement) {
        //this.output = JSON.parse(this.obj);

        this.element = element;
        this.element.innerHTML += this.obj["col001"].Question;
        for (var ans in this.obj["col001"].Answer) {
            this.span = document.createElement('span');
            this.element.appendChild(this.span);
            this.span.innerText = this.obj["col001"].Answer[ans];
        }
    }
}

window.onload = () => {
    var el = document.getElementById('content');
    var main = new StudyApp(el);
    //greeter.start();
};