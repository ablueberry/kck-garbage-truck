class Garbage {
  constructor(coordinates, glass = 0, paper = 0, plastic = 0, other = 0) {
    this.coordinates = coordinates;
    this.glass = glass;
    this.paper = paper;
    this.plastic = plastic;
    this.other = other;
    this.width = 33;
    this.height = 33;
    this.image = new Image(33, 33);
    this.ready = false;
    var that = this;
    this.image.onload = function () {
      that.ready = true;
    }
  }
}

class Truck extends Garbage {
  constructor(...args) {
    super(...args);
    this.max_garbage = Math.floor((Math.random() * 700) + 500);
    this.image.src = 'img/smieciarka_0.png';
  }


  pick(from, what) {
      this.other += from.clear(what);
  }

  leave(to, what) {
    to.status = this.other;
    this.other = 0;
  }


}

class Home extends Garbage {
  constructor(id, ...args) {
    super(...args);
    this.max_garbage = Math.floor((Math.random() * 200) + 100);
    this.status = 0;
    this.id = id;
    this.image.src = 'img/domek_' + Math.floor(Math.random() * 4) + '.png';
  }

  setStatus(amount) {
    this.status += amount;
  }
  // wylosuj ile śmieci sie uzupełnia i które
  fill() {
    var types = ['glass', 'paper', 'plastic', 'other'];
    var random = types[Math.floor(types.length * Math.random())];

    var amount = Math.floor((Math.random() * 2) + 10);
    if (this.status + amount <= this.max_garbage) {
      this[random] += amount;
      this.setStatus(amount);
    }
  }

  clear(what) {
    var s;
    for (let e in what) {
      if (what[e] && this[e]) {
        s = this[e];
        this.status -= this[e];
        this[e] = 0;
      }
    }
    return s;
  }
}

class Landfill extends Garbage {
  constructor(id, ...args) {
    super(...args);
    this.max_garbage = Math.floor((Math.random() * 1000) + 500);
    this.status = 0;
    this.id = id;
    this.image.src = 'img/wysypisko.png';
  }

  setStatus(amount) {
    this.status += amount;
  }

  // wylosuj ile śmieci ubywa i które
  empty() {
    var types = ['glass', 'paper', 'plastic', 'other'];
    var random = types[Math.floor(types.length * Math.random())];

    var amount = Math.floor((Math.random() * 100) + 300);
    if (this.status - amount >= 0) {
      this[random] -= amount;
      this.setStatus(amount*(-1));
    }
  };

}

class Road {
  constructor(coordinates) {
    this.coordinates = coordinates;
    this.width = 33;
    this.height = 33;
    this.image = new Image(33, 33);
    this.image.src = 'img/droga_' + Math.floor(Math.random() * 6) + '.png';
    this.ready = false;
    var that = this;
    this.image.onload = function () {
      that.ready = true;
    }
  }
}

class Grass {
  constructor(coordinates) {
    this.coordinates = coordinates;
    this.width = 33;
    this.height = 33;
    this.image = new Image(33, 33);
    this.image.src = 'img/trawa_' + Math.floor(Math.random() * 6) + '.png';
    this.ready = false;
    var that = this;
    this.image.onload = function () {
      that.ready = true;
    }
  }
}

const World = function(map) {
  var count = 0;

  // PRYWATNE FUNKCJE
  const autoActions = function(map) {
    setInterval(function() {
      // random coord.
      let x = Math.floor(Math.random() * 15);
      let y = Math.floor(Math.random() * 15);

      if (map[x][y].fill) {
        map[x][y].fill();

      }
    }, 30);

    setInterval(function() {
      // random coord.
      let x = Math.floor(Math.random() * 15);
      let y = Math.floor(Math.random() * 15);

      if (map[x][y].empty) {
        map[x][y].empty();
      }
    }, 50);
  }

  const initObject = function(symbol, x, y) {
    if (symbol === 0) {
      // trawa
      return new Grass({x: x, y: y})
    } else if (symbol === 1) {
      // dom
      return new Home(count++, {x: x, y: y})
    } else if (symbol === 2) {
      // wysypisko
      return new Landfill(count++, {x: x, y: y})
    } else if (symbol === 3) {
      // smieciarka
      return new Truck({x: x, y: y})
    } else {
      // droga
      return new Road({x: x, y: y})
    }
  }

  const init = function() {

    // zainicjalizuj wszystkie obiekty
    for (var i = 0; i < map.length; i++) {
      for (var j = 0; j < map[i].length; j++) {
        this.map[i][j] = initObject(map[i][j], i, j);
      }
    }

    // uruchom autofill w domkach i unfill na wysypiskach
    autoActions(map);

  };

  // ATRYBUTY

  // zwróć obiekt z niezbędnymi funkcjami
    this.map = map;
    this.init = init;
};

const display = (function() {

  const generateStats = function(stats, map) {
    while (stats.querySelector("#homes").firstChild) {
      stats.querySelector("#homes").removeChild(stats.querySelector("#homes").firstChild);
    }
    while (stats.querySelector("#landfills").firstChild) {
      stats.querySelector("#landfills").removeChild(stats.querySelector("#landfills").firstChild);
    }
    map.forEach(function(line) {
      line.forEach(function(element) {

        if (element instanceof Home || element instanceof Landfill) {
          var precentage = {
                full : Math.floor(element.status / element.max_garbage * 100),
                glass : Math.floor(element.glass / element.max_garbage * 100),
                paper : Math.floor(element.paper / element.max_garbage * 100),
                plastic : Math.floor(element.plastic / element.max_garbage * 100),
                other : Math.floor(element.other / element.max_garbage * 100)
              },
              glass = document.createTextNode("Glass: " + precentage.glass + "%"),
              paper = document.createTextNode("Paper: " + precentage.paper + "%"),
              plastic = document.createTextNode("Plastic: " + precentage.plastic + "%"),
              other = document.createTextNode("Other: " + precentage.other + "%"),

              li = document.createElement('LI'),
              h = document.createElement('h3');

          if (element instanceof Home) {
            var list = stats.querySelector("#homes"),
                id = document.createTextNode("Home #" + element.id),

                full = document.createTextNode("Dumpster full: " + precentage.full + "%");
                var a = [full, glass, paper, plastic, other];
          }
          if (element instanceof Landfill) {
            var list = stats.querySelector("#landfills"),
                id = document.createTextNode("Landfill #" + element.id),

                full = document.createTextNode("Landfill full: " + precentage.full + "%");
                var a = [full];
          }

          // var a = [full, glass, paper, plastic, other];
          var p = [];

          a.forEach(function(el) {
            var par = document.createElement("p");
            var pattern = /\d+/g;
            var res = el.textContent.match(pattern);

            if (res > 33) {
              par.className = "half-full";
            }
            if (res > 80) {
              par.className = "full";
            }
            par.appendChild(el);
            p.push(par);
          })

          h.appendChild(id);
          li.appendChild(h);
          p.forEach(function(el) {
            li.appendChild(el);
          })

          list.appendChild(li);
        }
      })
    })
  }

  const renderMap = function(ctx, map, truck) {

    map.forEach(function(line) {
      line.forEach(function(el) {
        if (el.ready) {
          ctx.drawImage(
              el.image,
              el.coordinates.x*33, el.coordinates.y*33,
              33, 33
          );
          if (el instanceof Home || el instanceof Landfill) {
            ctx.fillStyle = "white"
            ctx.font = "15px Georgia";
            ctx.fillText('#' + el.id, el.coordinates.x*33 - 10, el.coordinates.y*33 + 10)
          }
        }
      })
    });
    if (truck.ready) {
      ctx.drawImage(
        truck.image,
        truck.coordinates.x*33, truck.coordinates.y*33,
        33, 33
      );
    }
  }

  const moveTruck = function(to, truck, pick, leave, what) {
    var interval = setInterval(function () {
      if (truck.coordinates.x !== to.coordinates.x || truck.coordinates.y !== to.coordinates.y) {
        if (truck.coordinates.x < to.coordinates.x) {
          truck.coordinates.x += 0.25;
        } else if (truck.coordinates.x > to.coordinates.x){
          truck.coordinates.x -= 0.25;
        }
        if (truck.coordinates.y < to.coordinates.y) {
          truck.coordinates.y += 0.25;
        } else if (truck.coordinates.y > to.coordinates.y){
          truck.coordinates.y -= 0.25;
        }
      } else {
        if (to instanceof Home && pick) {
          truck.pick(to, what);
        }
        if (to instanceof Landfill && leave) {
          truck.leave(to, what);
        }
        clearInterval(interval);
      }
    }, 100);
  }
  const animate = function(ctx, map, truck) {
    var interval = setInterval(function () {
      renderMap(ctx, map, truck);
    }, 200);
  }
  return {
    generateStats: generateStats,
    renderMap: renderMap,
    animate: animate,
    moveTruck: moveTruck
  }

}());


(function() {
  /*
   * -1 - droga
   * 0 - trawa
   * 1 - dom
   * 2 - wysypisko
   * 3 - śmieciarka
   *
  */
  const map = [
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  1, -1,  1,  0,  0,  0,  0,  0,  2,  0,  0],
    [ 0,  0,  0,  0,  0, -1,  0,  0,  0,  0,  0,  0, -1,  0,  0],
    [ 0,  0,  0,  0,  1, -1,  1,  0,  0,  0,  0,  0, -1,  0,  0],
    [ 0,  0,  0,  0,  0, -1,  0,  0,  0,  0,  0,  0, -1,  0,  0],
    [ 0,  0,  0,  0,  0, -1,  0,  0,  0,  0,  0,  0, -1,  0,  0],
    [ 0,  0,  0,  0,  0, -1,  1,  0,  0,  0,  1,  0, -1,  0,  0],
    [ 0,  0,  0,  0,  0, -1, -1, -1, -1, -1, -1,  0, -1,  0,  0],
    [ 0,  0,  1, -1, -1, -1,  0,  0,  0,  0, -1, -1, -1,  0,  0],
    [ 0,  0,  0,  0,  0, -1,  0,  0,  0,  0, -1,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0, -1, -1, -1, -1, -1, -1,  1,  0,  0,  0],
    [ 0,  0,  0,  0,  0, -1,  1,  0,  0,  0,  1,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]
  ];

  var canvas = document.querySelector("canvas"),
  ctx = canvas.getContext("2d");

  canvas.width = 495;
  canvas.height = 495;


  var world = new World(map);
  world.init();


  var stats = document.querySelector('.stats');

  setInterval(function() {
    display.generateStats(stats, world.map)
  }, 1000)

  var log = document

  var truck = new Truck({x: 5, y: 5});


  display.animate(ctx, world.map, truck);


  var buildings = {};
  map.forEach(function(line, x) {
    line.forEach(function(el, y) {
      if (el.id !== undefined) {
        var id = "#" + el.id;
        buildings[id] = [x, y];
      }
    })
  })

  // Obsługa inputa przeniesiona do controllera

  var input = document.querySelector("input");
  input.onchange = function() {
    var dom_log = null; // na użytek eventloga
    EventLog.add_order(input.value); //event log księguje input
    var ptrn = /[0-9]*[0-9]|#\d+|zabierz|zostaw|papier|plastik|szkło|inne|wszystko|śmieci/gi;
    var value = this.value.match(ptrn);
    var coord = [];
    var leave = false, pick = false,
        what =  {
          plastic: false,
          glass: false,
          paper: false,
          other: false
        };
  //

    value.forEach(function(e) {
      e = e.toString();
      if (/zabierz/gi.test(e)) {
        pick = true;
      } else if (/zostaw/gi.test(e)) {
        leave = true;
      } else if (/#\d+/gi.test(e)) {
        coord = buildings[e];
        dom_log = e;
      } else if (/[0-9]*[0-9]/gi.test(e)) {
        let x =  parseInt(e);
        coord.push(x);
      }

      if (pick === true || leave === true) {
        if(/papier/gi.test(e)) {
          what.paper = true;
        }  else if(/plastik/gi.test(e)) {
          what.plastic = true;
        } else if(/szkło/gi.test(e)) {
          what.glass = true
        } else if(/inne/gi.test(e)) {
          what.other = true;
        } else if(/wszystko|śmieci/gi.test(e)){
          for(e in what) {
            what[e] = true;
          }
        }
      }
    })
    if (!coord[0] || !coord[1]) {
      coord = Object.keys(truck.coordinates).map(x => truck.coordinates[x]);
    }
    EventLog.add_order_approval(pick, leave, what, dom_log);
    display.moveTruck(world.map[coord[0]][coord[1]], truck, pick, leave, what);
  }


}())

const EventLog = (function(){
  var logged_events = [];

  const add_order = function(content) {
    add_event({
      who: "you",
      input: content
    });
  }

  const add_order_approval = function(pick,leave,what,dom) {
    add_event({
      who: "truck",
      input: create_order_approval(pick,leave,what,dom)
    });
  }

  /*const add_order_execution = function(from, what)
  {
    var ret = "zabrano";
    if(what.paper) ret += " papier";
    if(what.plastic && what.paper) ret += ", plastik"
    else if(what.plastic) ret += " plastik";
    if(what.glass && (what.plastic || what.paper)) ret += ", szkło"
    else if(what.glass) ret += " szkło";
    if(what.other && (what.plastic || what.paper || what.glass)) ret+= ", śmieci mieszane"
    else if(what.other) ret+= " śmieci mieszane";
    ret = " z domku nr " + what.Home.id;
    add_event({
      who: "home",
      input: ret
    })
  }*/

  const print_event = function(which = logged_events.length-1) {
    return logged_events[which];
  }

  const print_events = function(how_many = logged_events.length) {
    var ret = "";
    for(var i = logged_events.length-how_many; i < logged_events.length; i++){
      temp = print_event(i);
      ret += (i+1) + ".\t" + temp.who + ": " + temp.input + "\n"
    }
    return ret; 
  }

  /*const update_log = function() {
    var d = document.querySelector(".log");
    logged_events.forEach(function(iter) {
      var h = document.createElement("P");
      var s = document.createElement("SPAN");
      s.className = "who " + iter.who;
      var t = document.createTextNode(iter.input);
      d.appendChild(h.appendChild(s.appendChild(t)));
    }) 
  }*/


//funkcje prywatne
  const create_order_approval = function(pick,leave,what,dom) {
    var ret = ""; 
    if(pick) ret += "jadę odebrać z domu nr " + dom + "";
    if(leave) ret += "jadę zostawić";
    if(what.paper) ret += " papier";
    if(what.plastic && what.paper) ret += ", plastik"
    else if(what.plastic) ret += " plastik";
    if(what.glass && (what.plastic || what.paper)) ret += ", szkło"
    else if(what.glass) ret += " szkło";
    if(what.other && (what.plastic || what.paper || what.glass)) ret+= ", śmieci mieszane"
    else if(what.other) ret+= " śmieci mieszane";
    if(leave) ret += " na śmietnisku";
    return ret;
  }

  const update_log = function(a, b) {
    var event = print_event();
    var d = document.querySelector(".logs");
    //logged_events.forEach(function(iter) {
    var h = document.createElement("P");
    var s = document.createElement("SPAN");
    s.className = "who " + a;
    var t = document.createTextNode(b);
    d.appendChild(h.appendChild(s.appendChild(t))); 
  }
  
  const add_event = function(content) {
    logged_events.push(content);
    update_log(content.who, content.input);
  }

  return {
    add_order: add_order,
    //add_order_approval: add_order_approval,
    add_order_execution: add_order_execution,
    print_event: print_event,
    print_events: print_events
  }
}());
