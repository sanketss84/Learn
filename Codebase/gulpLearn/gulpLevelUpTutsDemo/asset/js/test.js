// A function being attached to an object at runtime.

var myName = "the global object";

var sayHello = function() {
    console.log( "Hi! My name is " + this.myName );
};

var myObject = {
    myName: "Rebecca"
};

var secondObject = {
    myName: "Colin"
};

var test  = "";