
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

	function drawCircle(ctx, x, y)
    {
    var radius = 10;

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
	function truck(ctx, start, end) {
		var delay = 10;
		canvas.circle(ctx, start.x, start.y);
		console.log('hi')
		setInterval(function() {
			if (end.x === start.x && end.y !== start.y) {
				ctx.clearRect(start.x-11, start.y-11, 22, 22);
				if (start.y < end.y) {
					 start.y++;
				 } else if (start.y > end.y) {
					 start.y--;
				 }
				canvas.circle(ctx, start.x, start.y);
			}
			else if(end.y === start.y && end.x !== start.x){
				ctx.clearRect(start.x-11, start.y-11, 22, 22);
				if (start.x < end.x) {
					start.x++;
				} else if(start.x > end.x) {
					start.x--;
				}
				canvas.circle(ctx, start.x, start.y);
			} else {
				clearInterval();
			}
		}, delay);
	}

	return {
		truck: truck
	}
}());
function garbtruck(ctx, endx, endy, startx, starty) {
	var loc = [startx, starty] || [ctx.canvas.width/2, ctx.canvas.height/2];
	var delay = 10;
	canvas.circle(ctx, loc[0], loc[1]);
	setInterval(function(){
	if(endx === loc[0] && endy !==loc[1]){
		ctx.clearRect(loc[0]-11, loc[1]-11, 22, 22);
		if(loc[1] < endy) loc[1]++;
		else if(loc[1] > endy) loc[1]--;
		canvas.circle(ctx, loc[0], loc[1]);
	}
	else if(endy === loc[1] && endx !== loc[0]){
		ctx.clearRect(loc[0]-11, loc[1]-11, 22, 22);
		if(loc[0] < endx) loc[0]++;
		else if(loc[0] > endx) loc[0]--;
		canvas.circle(ctx, loc[0], loc[1]);
	}
	else clearInterval();
	}, delay);
}

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
			var pos = graph.nodes[parentId - 1].position ;
			if (!pos.length) {
				// ustawiamy pozycje rodzica jeśli jej nie miał
				graph.nodes[parentId - 1].position = root;
				// rysujemy rodzica
				canvas.rect(ctx, root[0], root[1]);
			}

			// ustalamy pozycje dziecka
			pos = graph.nodes[parentId - 1].position;
			var dir = edge.dir_form;
			var weigth = edge.weigth;
			var pos_child = [pos[0], pos[1]];
			if (dir === "n") { pos_child[1] += 50 * weigth;	}
			if (dir === "e") { pos_child[0] += 50 * weigth; }
			if (dir === "w") { pos_child[0] -= 50 * weigth; }
			if (dir === "s") { pos_child[1] -= 50 * weigth;}
			graph.nodes[childId - 1].position = pos_child;

			// rysujemy dziecko
			canvas.rect(ctx, pos_child[0], pos_child[1]);

			// rysujemy połączenie między nimi
			canvas.line(ctx, pos[0]-10, pos[1]-10, pos_child[0]-10, pos_child[1]-10)
		}
	}

	function create(ctx, min, max) {

		var graph = {
			v_amount: 0,

			landfills_a: 0,
		};
		// Generujemy ilosc wierzcholkow
		graph.v_amount = Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);

		// Generujemy ilosc wysypisk
		graph.landfills_a = Math.floor(Math.random() * (Math.floor(0.2 * max))) + 1;
		var landfills_left = graph.landfills_a;
		/*
		 			W O R K  I N  P R O G R E S S . . .
		*/
	}

	return {
		render: render,
		create: create
	}
})();

(function() {
	var graph = {
		nodes: [
			{id: 1, type: "landfill", edges: [], position: []},
			{id: 2, type: "home", edges: [], position: []},
			{id: 3, type: "home", edges: [], position: []},
			{id: 4, type: "home", edges: [], position: []},
			{id: 5, type: "home", edges: [], position: []},
			{id: 6, type: "home", edges: [], position: []},
			{id: 7, type: "home", edges: [], position: []}
		],
		edges: [
			{from: 1, to: 2, dir_form: "n", weigth: 1},
			{from: 1, to: 3, dir_form: "e", weigth: 2},
			{from: 1, to: 4, dir_form: "w", weigth: 1},
			{from: 1, to: 5, dir_form: "s", weigth: 1},
			{from: 5, to: 6, dir_form: "s", weigth: 3},
			{from: 5, to: 7, dir_form: "e", weigth: 3}
		]
	}
	var ctx = canvas.init();
 	map.render(ctx, graph);
	play.truck(ctx, {x: graph.nodes[2].position[0], y: graph.nodes[2].position[1]}, {x: graph.nodes[0].position[0], y: graph.nodes[0].position[1]});
	play.truck(ctx,  {x: graph.nodes[0].position[0], y: graph.nodes[0].position[1]}, {x: graph.nodes[5].position[0], y: graph.nodes[5].position[1]});
	play.truck(ctx, {x: 180, y: 180}, {x: 20, y: 20});
}());
