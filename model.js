class Garbage {
  constructor(coordinates, glass = 0, paper = 0, plastic = 0, other = 0) {
    this.coordinates = coordinates;
    this.glass = glass;
    this.paper = paper;
    this.plastic = plastic;
    this.other = other;
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
  constructor(...args) {
    super(...args);
    this.max_garbage = Math.floor((Math.random() * 200) + 100);
    this.status = 0;
  }

  setStatus(amount) {
    this.status += amount;
  }
  // wylosuj ile śmieci sie uzupełnia i które
  fill() {
    var types = ['glass', 'paper', 'plastic', 'other'];
    var random = types[Math.floor(types.length * Math.random())];

    var amount = Math.floor((Math.random() * 50) + 10);
    if (this.status + amount <= this.max_garbage) {
      this[random] += amount;
      this.setStatus(amount);
    }
  }
}

class Landfill extends Garbage {
  constructor(...args) {
    super(...args);
    this.max_garbage = Math.floor((Math.random() * 2000) + 1000);
    this.status = 0;
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
  }
}

class Grass {
  constructor(coordinates) {
    this.coordinates = coordinates;
  }
}

const World = function(map) {

  // PRYWATNE FUNKCJE
  const autoActions = function(map) {
    setInterval(function() {
      // random coord.
      let x = Math.floor(Math.random() * 15);
      let y = Math.floor(Math.random() * 15);

      if (map[x][y].fill) {
        map[x][y].fill();
      }
    }, 200);

    setInterval(function() {
      // random coord.
      let x = Math.floor(Math.random() * 15);
      let y = Math.floor(Math.random() * 15);

      if (map[x][y].empty) {
        map[x][y].empty();
        console.log(map[x][y]);
      }
    }, 50);
  }

  const initObject = function(symbol, x, y) {
    if (symbol === 0) {
      // trawa
      return new Grass({x: x, y: y})
    } else if (symbol === 1) {
      // dom
      return new Home({x: x, y: y})
    } else if (symbol === 2) {
      // wysypisko
      return new Landfill({x: x, y: y})
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
    [ 0,  0,  0,  0,  1,  0,  1,  0,  0,  0,  0,  0,  2,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  1,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  1,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  3,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  1,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]
  ];

  var world = new World(map);

  world.init();
  console.log(world.map)
}())
