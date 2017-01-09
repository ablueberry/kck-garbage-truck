// var pengine;
// /*
//   // Obsługa inputa przeniesiona do controllera
//
//   var input = document.querySelector("input");
//   input.onchange = function() {
//     var ptrn = /[0-9]*[0-9]/g;
//     var coord = this.value.match(ptrn);
//     coord.forEach(function(e, i) {
//       coord[i] =  parseInt(e);
//     })
//     console.log(coord)
//     display.moveTruck(world.map[coord[0]][coord[1]], truck);
//   }
// */
// function parseInput(value) {
//   var array = value.replace(/[^a-ż0-9]/ig, " ").match(/\S+/g);
//   var query = "rozkaz("
//   array.forEach(function(e) {
//     query = query + '"' + e + '", ';
//   });
//   query += ")";
//   return query.replace(/, \)$/, ")");
// }
//
// var input = document.querySelector("input");
// input.onchange = function ask() {
//   // selector for input, that contains ready prolog query
//   var query = parseInput(this.value);
//   console.log(query);
//
//   if(query) {
//     pengine = new Pengine({
//       application: 'truck',
//       ask: query,
//       onsuccess: function() {
//         // otrzymujemy JSON.stringify(this.data) jako dane JSON
//         console.log(this.data);
//       },
//       onfailure: function() {
//         console.log("failure");
//       },
//       onstop: function() {
//         console.log("stop");
//       },
//       onabort: function() {
//         console.log("abort");
//       },
//       onerror: function() {
//         console.log("error");
//       }
//     })
//   }
// }
