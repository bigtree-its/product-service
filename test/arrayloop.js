[1,2,3,4].forEach(function (i){
    console.log(i);
    delay();
});

setTimeout(function a(){
    console.log("Timeout finished");
}, 2000);

console.log("main finished")