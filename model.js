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
  }
}
class Truck extends Garbage {
  constructor(...args) {
    super(...args);
    this.max_garbage = Math.floor((Math.random() * 700) + 500);

  }

  go(from, to) {}

  pick(type) {}

  leave(type) {}


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
    this.image.src = 'img/droga_' + Math.floor(Math.random() * 6) + '.png'
  }
}

class Grass {
  constructor(coordinates) {
    this.coordinates = coordinates;
    this.width = 33;
    this.height = 33;
    this.image = new Image(33, 33);
    this.image.src = 'img/trawa_' + Math.floor(Math.random() * 6) + '.png'
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

  return {
    generateStats: generateStats
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
    [ 0,  0,  0,  0,  0, -1,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  1, -1,  1,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0, -1,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0, -1,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0, -1,  1,  0,  0,  0,  1,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  1,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]
  ];

  var world = new World(map);
  world.init();


  var stats = document.querySelector('.stats');

  setInterval(function() {
    display.generateStats(stats, world.map)
  }, 1000)



    var canvas = document.querySelector("canvas"),
    ctx = canvas.getContext("2d");

    canvas.width = 495;
    canvas.height = 495;

    map.forEach(function(line) {
      line.forEach(function(el) {
        console.log(el.image)
        el.image.onload = function() {
          ctx.drawImage(
              el.image,
              el.coordinates.x*33, el.coordinates.y*33,
              33, 33
          );
        }
      })
    });


}())
