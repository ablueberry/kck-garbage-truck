
const canvas = (function() {
	function init(w, h) {
		var w = w || window.innerWidth;
		var h = h || window.innerHeight;
		const canvas = document.querySelector('canvas');
		canvas.width = w;
		canvas.height = h;
		const ctx = canvas.getContext('2d');
		return ctx;
	}

	function drawRect(ctx, x, y) {
		ctx.strokeRect(x, y, 20, 20);
	}

	function drawLine(ctx, x1, y1, x2, y2) {
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	}

	function drawCircle(ctx, x, y){
    var radius = 5;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = "black";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke();
  }


	return {
		init: init,
		rect: drawRect,
		line: drawLine,
		circle: drawCircle
	};
})();

const play = (function() {
	function road(ctx, start, end, resolve) {
		var delay = 10;
		canvas.circle(ctx, start.x, start.y);
		setInterval(function() {
			if (end.x === start.x && end.y !== start.y) {
				ctx.clearRect(start.x-7, start.y-7, 15, 15);
				if (start.y < end.y) {
					 start.y++;
				 } else if (start.y > end.y) {
					 start.y--;
				 }
				canvas.circle(ctx, start.x, start.y);
			}
			else if(end.y === start.y && end.x !== start.x){
				ctx.clearRect(start.x-7, start.y-7, 15, 15);
				if (start.x < end.x) {
					start.x++;
				} else if(start.x > end.x) {
					start.x--;
				}
				canvas.circle(ctx, start.x, start.y);
			} else {
				resolve();
				clearInterval();
			}
		}, delay);
	}

	function path(ctx, graph, path) {

		var p = function(start, end){
			return new Promise(
				function(resolve, reject) {
					road(ctx, start, end, resolve);
				}
			);
		}

		var start = {
			x: graph.nodes[path[0]].position[0],
			y: graph.nodes[path[0]].position[1]
		};
		var end = {
			x: graph.nodes[path[1]].position[0],
			y: graph.nodes[path[1]].position[1]
		};

		var promise = p(start, end);
		var p1 = promise.then(() => {
			start = {
				x: graph.nodes[path[1]].position[0],
				y: graph.nodes[path[1]].position[1]
			};
			end = {
				x: graph.nodes[path[1+1]].position[0],
				y: graph.nodes[path[1+1]].position[1]
			};

			return p(start, end);
		});

		for (var i = 2; i < path.length-2; i++) {
				(function(i){
					p1 = p1.then(() => {
						start = {
							x: graph.nodes[path[i]].position[0],
							y: graph.nodes[path[i]].position[1]
						};
						end = {
							x: graph.nodes[path[i+1]].position[0],
							y: graph.nodes[path[i+1]].position[1]
						};
						return p(start, end);
					});
				})(i);
		}
	}

	return {
		path: path
	}
}());

const map = (function() {
	function render(ctx, graph, root_point) {
		// ustawiamy początek rysowania na dany punkt lub na środek canvasa
		var root = root_point || [ctx.canvas.width/2, ctx.canvas.height/2];

		// iterujemy po krawędziach
		for (let edge of graph.edges) {

			let parentId = edge.from;
			let childId = edge.to;

			// if wykona się tylko dla nowych, niepołączonych z innymi elementów
			// jeśli rodzic ma ustawioną pozycję to znaczy że został narysowany
			var pos = graph.nodes[parentId].position ;
			if (!pos.length) {
				// ustawiamy pozycje rodzica jeśli jej nie miał
				graph.nodes[parentId].position = root;
				// rysujemy rodzica
				canvas.rect(ctx, root[0], root[1]);
			}

			// ustalamy pozycje dziecka
			pos = graph.nodes[parentId].position;
			var dir = edge.dir_form;
			var weigth = edge.weigth;
			var pos_child = [pos[0], pos[1]];
			if (dir === "n") { pos_child[1] += 70 * weigth;	}
			if (dir === "e") { pos_child[0] += 70 * weigth; }
			if (dir === "w") { pos_child[0] -= 70 * weigth; }
			if (dir === "s") { pos_child[1] -= 70 * weigth;}
			graph.nodes[childId].position = pos_child;

			// rysujemy dziecko
			// canvas.rect(ctx, pos_child[0]+20, pos_child[1]+20);
			//
			// // rysujemy połączenie między nimi
			// canvas.line(ctx, pos[0]-10, pos[1]-10, pos_child[0]-10, pos_child[1]-10);
			// canvas.line(ctx, pos[0]+10, pos[1]+10, pos_child[0]+10, pos_child[1]+10);
		}
	}

	return {
		render: render
	}
})();

(function() {
	var graph = {
		nodes: {
			a: {type: "home", edges: [], position: []},
			b: {type: "home", edges: [], position: []},
			c: {type: "home", edges: [], position: []},
			d: {type: "home", edges: [], position: []},
			e: {type: "home", edges: [], position: []},
			f: {type: "home", edges: [], position: []},
			g: {type: "home", edges: [], position: []},
			h: {type: "home", edges: [], position: []},
			i: {type: "home", edges: [], position: []},
			j: {type: "home", edges: [], position: []},
			k: {type: "home", edges: [], position: []},
			l: {type: "home", edges: [], position: []},
			m: {type: "home", edges: [], position: []},
			n: {type: "home", edges: [], position: []},
			o: {type: "home", edges: [], position: []},
			p: {type: "home", edges: [], position: []},
			r: {type: "home", edges: [], position: []},
			s: {type: "home", edges: [], position: []},
			t: {type: "home", edges: [], position: []},
			u: {type: "home", edges: [], position: []},
			w: {type: "landfill", edges: [], position: []},
			x: {type: "landfill", edges: [], position: []}
		},
		edges: [
			{from: 'a', to: 'c', dir_form: "s", weigth: 1},
			{from: 'c', to: 'b', dir_form: "w", weigth: 1},
			{from: 'b', to: 'f', dir_form: "s", weigth: 1},
			{from: 'f', to: 'g', dir_form: "e", weigth: 1},
			{from: 'f', to: 'j', dir_form: "s", weigth: 1},
			{from: 'j', to: 'k', dir_form: "e", weigth: 1},
			{from: 'g', to: 'k', dir_form: "s", weigth: 1},
			{from: 'g', to: 'h', dir_form: "e", weigth: 1},
			{from: 'h', to: 'i', dir_form: "e", weigth: 2},
			{from: 'i', to: 'd', dir_form: "n", weigth: 1},
			{from: 'd', to: 'w', dir_form: "w", weigth: 2},
			{from: 'd', to: 'e', dir_form: "e", weigth: 1},
			{from: 'e', to: 'n', dir_form: "s", weigth: 2},
			{from: 'n', to: 'm', dir_form: "w", weigth: 2},
			{from: 'm', to: 'l', dir_form: "w", weigth: 1},
			{from: 'm', to: 'p', dir_form: "s", weigth: 1},
			{from: 'p', to: 'o', dir_form: "w", weigth: 2},
			{from: 'p', to: 't', dir_form: "s", weigth: 1},
			{from: 't', to: 's', dir_form: "w", weigth: 1},
			{from: 's', to: 'r', dir_form: "w", weigth: 1},
			{from: 'r', to: 'o', dir_form: "n", weigth: 1},
			{from: 't', to: 'u', dir_form: "s", weigth: 2},
			{from: 'u', to: 'x', dir_form: "e", weigth: 2}
		]
	}

	var djikstra_map = {
		a: {c: 1},
		b: {c: 1, f: 1},
		c: {a: 1, b: 1},
		d: {w: 2, i: 1, e: 1},
		e: {d: 1, n: 2},
		f: {b: 1, g: 1, j: 1},
		g: {f: 1, h: 1, k: 1},
		h: {g:1, i: 2},
		i: {d: 1, h: 2},
		j: {f: 1, k: 1},
		k: {j: 1, g: 1},
		l: {m: 1},
		m: {l: 1, n: 2, p: 1},
		n: {m: 2, e: 2},
		o: {r: 1, p: 2},
		p: {m: 1, t: 1, o: 2},
		r: {o: 1, s: 1},
		s: {r: 1, t: 1},
		t: {p: 1, u: 2},
		u: {t: 2, x: 1},
		w: {d: 2},
		x: {u: 1}
	};

	var ctx = canvas.init(645, 626);
	var djikstra_graph = new Graph(djikstra_map);

 	map.render(ctx, graph, [ctx.canvas.width/2-130, ctx.canvas.height/2+220]);

	var p = djikstra_graph.findShortestPath('i', 'n');
	play.path(ctx, graph, p);

console.log(graph)
	/*
			To do:
			1 OK. tło - statyczna mapa
			2. refactoring kodu
			3. staty miasta
			4. input dla usera -> prolog drama
	*/
}());
