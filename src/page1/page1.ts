declare const module: any;
import print from "./test1";

let interval = undefined

function draw() {
    interval = setInterval(() => {
        print();
    }, 2000);
}

function clear() {
    clearInterval(interval);
}

console.log("page1 draw");
draw();

if (module.hot) {
    module.hot.accept(()=>{
        console.log("page1 update");
    });
    // module.hot.accept(["./test1.ts"], () => {
    //     console.log("test1 update");
    //     // draw();
    // });
    module.hot.dispose(() => {
        console.log("page1 clear");
        clear();
    })
}
