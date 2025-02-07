export default class Route {
    constructor(path, name, component) {
      this.path = path;
      this.name = name;
      this.component = component;
      this.children = [];
    }
  
    addSubRoute(route) {
      this.children.push(route);
    }
  
    redirectTo(path) {
      this.redirect = path;
      return this;
    }

    static switch(url){
        window.location.replace(url);
    }

    static dive(url){
        window.location.assign(url);
    }

    static open(url){
        window.open(url);
    }

    static back(){
        window.history.back();
    }

    static forward(){
        window.history.forward();
    }

    static go(delta){
        window.history.go(delta);
    }
  }