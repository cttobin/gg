class Layer {
	parameters: {};
	constructor (userParameters, defaultParameters) {
		this.parameters = userParameters;
	}
}

class Scatter extends Layer {
	
	constructor (parameters?: Object) {
		
		super (parameters, {
			
			// Point radius.
			'size': 3,
			
			'shape': 'Circle'
			
		});
		
	}
	
	draw (scale: Scale) {
		
	}
	
}

class Bar extends Layer {
	constructor (parameters?: Object) {
		super(parameters, {});	
	}
	
}

class Line extends Layer {
	constructor (parameters?: Object) {
		super(parameters, {});	
	}
}

class Scale {
	
}

class LinearScale extends Scale {
	
}

interface Mapping {
	x: string;
	y?: string;
	stroke?: string;
	fill?: string;
}

class ToberChartLive {
	
	chart: ToberChart;
	
	constructor (chart: ToberChart) {
		this.chart = chart;
	}
	
	clear () {
		
	}
	
	replaceData () {
		
	}
	
	addData (data: Array<Object>) {
		
	}
	
}

class ToberChart {
	
	layers: Array<Layer>;
	data: Array<Object>;
	mapping: Object;
	element: Object;
	
	constructor (data: Data, mapping: Mapping) {
		
		// Check that the mapping fields are contained within 'data'.
		let mappingKeys = lodash.keys(mapping);
		let mappingValid = lodash.every(data, function (datum) {
			return lodash.has(datum, mappingKeys);	
		});
		
		if (!mappingValid) {
			throw new Error('Fields given in "mapping" are not present in every "data" element.');
			return;
		}
		
		this.data = data;
		this.mapping = mapping;
		this.layers = [];
		return this;
		
	}
	
	/**
	 * Add custom layer.
	 */
	layer () {
		return this;
	}


	/**
	 * Scatter plot.
	 */
	scatter (layerMapping?: Object, parameters?: Object) {
		this.layers.push(new Scatter());
		return this;
	}
	
	
	/**
	 * Bar chart.
	 */
	bar (parameters: Object) {
		this.layers.push(new Bar());
		return this;
	}
	
	
	/**
	 * Column chart.
	 */
	column (parameters?: Object) {
		this.layers.push(new Line());
		return this;
	}
	
	draw (selector: string|Object) {
		
		if (lodash.isString(selector)) {
			this.element = d3.select(selector);	
		} 
		
		if (lodash.isUndefined(this.element)) {
			throw new Error('Selector returned undefined.');
		}
		
		if (!this.layers.length) {
			throw new Error('No layers.');
		}
		
		return new ToberChartLive(this);
		
	}
	
}

class Data {
	data: Array<Object>;
	keys: any;
	constructor (data: Array<Object>) {
		this.data = data;
		this.keys = {year: 1, sales: 1, department: 1};
	}
}

var rawData = [
	{'year': 2010, 'sales': 1000, 'department': 'A'}, 
	{'year': 2011, 'sales': 2000, 'department': 'A'}, 
	{'year': 2012, 'sales': 3000, 'department': 'A'},
	{'year': 2010, 'sales': 1250, 'department': 'B'}, 
	{'year': 2011, 'sales': 1890, 'department': 'B'}, 
	{'year': 2012, 'sales': 2800, 'department': 'B'}
];

var plot = {
	
	chart: function (data: Data, mapping: Mapping) {
		return new ToberChart(data, mapping);
	},
	
	select: function (selector: string|Object) {
			
	},
	
	data: function (data: Array<Object>) {
		return new Data(data);
	}
	
}


var data = plot.data(rawData);

var chart = plot.chart(data, { 
		x: data.keys.year,
		y: data.keys.sales
	})
	.scatter({ size: 3, colour: data.keys.department })
	.draw('figure');
	
chart.clear();