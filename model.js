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


  pick(from) {
    this.other = from.clear();
  }

  leave(to) {
    to.other = this.other;
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

  clear() {
    var s = this.status;
    this.amount = 0;
    this.status = 0;
    this.paper = 0;
    this.plastic = 0;
    this.glass = 0;
    this.other = 0;
    console.log(s);
    return s;
  }
}

class Landfill extends Garbage {
  constructor(id, ...args) {
    super(...args);
    this.max_garbage = Math.floor((Math.random() * 2000) + 1000);
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
          }
          if (element instanceof Landfill) {
            var list = stats.querySelector("#landfills"),
                id = document.createTextNode("Landfill #" + element.id),

                full = document.createTextNode("Landfill full: " + precentage.full + "%");
          }

          var a = [full, glass, paper, plastic, other];
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

  const moveTruck = function(to, truck) {
    var interval = setInterval(function () {
      console.log('hiiii')
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
        if (to instanceof Home) {
          truck.pick(to);
        }
        if (to instanceof Landfill) {
          truck.leave(to);
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
    [ 0,  0,  0,  0,  0, -1, -1, -1, -1, -1, -1,  0,  0,  0,  0],
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

  var truck = new Truck({x: 5, y: 5});


  display.animate(ctx, world.map, truck);

  var input = document.querySelector("input");
  input.onchange = function() {
    var ptrn = /[0-9]*[0-9]/g;
    var coord = this.value.match(ptrn);
    coord.forEach(function(e, i) {
      coord[i] =  parseInt(e);
    })
    console.log(coord)
    display.moveTruck(world.map[coord[0]][coord[1]], truck);
  }


}())
