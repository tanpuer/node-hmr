declare const module: any;
import print from "./test2";

let interval = undefined

function draw() {
    interval = setInterval(() => {
        print();
    }, 2000);
}

function clear() {
    clearInterval(interval);
}

console.log("page2 draw");
draw();

if (module.hot) {
    module.hot.accept(() => {
        console.log("page2 accept");
        draw();
    });
    module.hot.dispose(() => {
        console.log("page2 clear");
        clear();
    })
}
