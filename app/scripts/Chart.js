function translate (x, y) {
	return `translate(${x}, ${y})`;
}

function setTransform (element, x, y) {
	element.attr('transform', translate(x, y));
}


class Chart {

	constructor (data, mapping, chartOptions) {

		let defaultChartOptions = {
			titlePadding: 8,
			axisTitlePadding: 8
		};

		this._theme = {
			swatch: ['#2980b9', '#27ae60', '#e74c3c',
				'#9b59b6', '#1cccaa', '#f39c12']
		};

		// Default axis text formatting.
		this._ticksFormat = {x: lodash.value, y: lodash.value};

		// Number of ticks on each axis.
		this._ticks = {x: 5, y: 5};

		// Overwrite default chart options with user options.
		this.chartOptions = lodash.assign(defaultChartOptions, chartOptions);

		// Chart main and axes titles.
		this._titles = {
			x: lodash.capitalize(mapping.x.name),
			y: lodash.capitalize(mapping.y.name)
		};
		
		// Check that the mapping fields are contained within 'data'.
		let mappingValid = lodash(mapping)
			.pluck('name')
			.every(field => lodash.has(data.fields, field));
		
		if (!mappingValid) {
			throw new Error('Fields given in "mapping" are not present in every "data" element.');
			return;
		}
		
		this.data = data;
		this.mapping = mapping;

		// Array to hold all layers in the plot.
		this.layers = [];
		this.scales = {};
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
	points (parameters) {
		this.layers.push(new Points(parameters));
		return this;
	}


	/**
	 * Lines chart.
	 */
	lines (parameters) {
		this.layers.push(new Lines(parameters));
		return this;
	}


	/**
	 * Vertical bars chart.
	 * @param parameters
	 * @returns {Chart}
	 */
	columns (parameters) {
		this.layers.push(new Columns(parameters));
		return this;
	}
	

	/**
	 * Set main plot title.
	 */
	title (titleText) {
		this._titles.main = titleText;
		return this;
	}

	titles (_titles) {
		this._replaceDefaults(this._titles, _titles);
		return this;
	}

	ticks (numberOfTicks) {
		this._replaceDefaults(this._ticks, numberOfTicks);
		return this;
	}

	ticksFormat (formats) {
		this._replaceDefaults(this._ticksFormat, formats)
		return this;
	}

	_replaceDefaults (defaults, replacements) {
		if (lodash.isPlainObject(defaults) && lodash.isPlainObject(replacements)) {
			lodash.assign(defaults, replacements);
		}
	}

	_drawTitle () {

		if (this._titles.main) {

			let padding = this.chartOptions.titlePadding * 2;

			this.titleElement = this.svg
				.append('text')
				.attr({
					'class': 'title',
					'alignment-baseline': 'central'
				})
				.text(this._titles.main);

			let titleBox = getBox(this.titleElement);
			this.plotAreaHeight -= (titleBox.height + padding);
			this.plotUpperOffset = (titleBox.height + padding);

		}

	}

	_drawAxesTitles () {

		// The total axis title padding is doubled since it will surround the text.
		let padding = this.chartOptions.axisTitlePadding * 2;

		this.xTitleElement = this.svg
			.append('text')
			.attr({
				'class': 'axis-title',
				'alignment-baseline': 'central'
			})
			.text(this._titles.x);

		// Vertically shrink available plot area.
		let xTitleBox = getBox(this.xTitleElement);
		this.plotAreaHeight -= (xTitleBox.height + padding);

		this.yTitleElement = this.svg
			.append('text')
			.attr({
				'class': 'axis-title',
				'transform': 'rotate(270)',
				'alignment-baseline': 'central'
			})
			.text(this._titles.y);

		let yTitleBox = getBox(this.yTitleElement);

		// After rotation, the height is the width.
		this.plotAreaWidth -= (yTitleBox.height + padding);
		this.plotLeftOffset += (yTitleBox.height + padding);

	}

	/**
	 * Position main and axes titles.
	 */
	_positionTitles () {

		// Position to horizontal centre in the middle of the plot area.
		let centred = this.plotLeftOffset + (this.plotAreaWidth / 2);

		let titleBox = getBox(this.titleElement);
		setTransform(this.titleElement, centred, this.chartOptions.titlePadding + (titleBox.height / 2));

		let xTitleBox = getBox(this.xTitleElement);
		setTransform(this.xTitleElement, centred, this.height - (xTitleBox.height / 2) - this.chartOptions.axisTitlePadding);

		let yTitleBox = getBox(this.yTitleElement);
		this.yTitleElement.attr('transform', translate(this.chartOptions.axisTitlePadding + (yTitleBox.height / 2), this.height / 2) + ' rotate(270)');

	}

	_drawPlotArea () {

		// The plot area
		this.plotArea = this.svg
			.append('g')
			.attr({
				'transform': translate(this.plotLeftOffset, this.plotUpperOffset),
				'class': 'plot-area'
			});

	}

	_drawLayers () {

		lodash.forEach(this.layers, function (layer) {
			layer.draw(this.data, this.mapping, this.scales, this.plotArea);
		}, this);

	}

	_drawAxes () {

		this.scales.y = d3
			.scale
			.linear()
			.domain(d3.extent(this.data.rows, datum => datum[this.mapping.y.name]))
			.range([this.plotAreaHeight, 0]);

		let yAxis = d3.svg.axis()
			.scale(this.scales.y)
			.orient('left')
			.ticks(this._ticks.y)
			.tickFormat(this._ticksFormat.y);

		let yAxisElement = this.svg
			.append('g')
			.attr('class', 'y axis')
			.call(yAxis);

		// Remove y-axis from available plot width.
		this.plotAreaWidth -= getBox(yAxisElement).width;

		// Create x scale.
		this.scales.x = d3
			.scale
			.linear()
			.domain(d3.extent(this.data.rows, datum => datum[this.mapping.x.name]))
			.range([0, this.plotAreaWidth]);

		let xAxis = d3.svg.axis()
			.scale(this.scales.x)
			.orient('bottom')
			.ticks(this._ticks.x)
			.tickFormat(this._ticksFormat.x);

		// Add x-axis to chart.
		let xAxisElement = this.svg
			.append('g')
			.attr('class', 'x axis')
			.call(xAxis);

		// Subtract x-axis height and overflow width from allowable area.
		let xAxisBox = getBox(xAxisElement);
		this.plotAreaHeight -= xAxisBox.height;
		this.plotAreaWidth -= this.chartOptions.axisTitlePadding + ((xAxisBox.width - this.plotAreaWidth) / 2);

		// Move the y-axis now that the height of the x-axis is known.
		this.scales.y.range([this.plotAreaHeight, 0]);
		yAxis.scale(this.scales.y);
		yAxisElement.call(yAxis);
		this.plotLeftOffset += getBox(yAxisElement).width;
		yAxisElement.attr('transform', translate(this.plotLeftOffset, this.plotUpperOffset));

		// Move x-axis after figuring out how much its labels overflow the canvas.
		this.scales.x.range([0, this.plotAreaWidth]);
		xAxis.scale(this.scales.x);
		xAxisElement.call(xAxis);
		xAxisElement.attr('transform', translate(this.plotLeftOffset, this.plotAreaHeight + this.plotUpperOffset));

	}

	_createParameterScales () {

		// Get all mappable parameters.
		let mappedFields = lodash.keys(this.mapping);
		lodash(this.layers)
			.map(function (layer) {
				return layer.getParameterNames();
			})
			.flatten()
			.unique()
			.forEach(function (parameterName) {

                // Input to output mapping.
                let scale;

                if (lodash.contains(mappedFields, parameterName)) {

                    // Get the field used for the current mapping.
                    var dataField = this.mapping[parameterName];

                    // Get all unique values in this field.
                    let domainValues = lodash(this.data.rows)
                        .pluck(dataField.name)
                        .unique()
                        .value();

                    // The range that the input will be mapped to.
                    let rangeValues = lodash.map(domainValues, (value, index) => 'fill-' + index);

                    if (dataField.isOrdinal()) {

                        scale = d3.scale.ordinal()
                            .domain(domainValues)
                            .range(rangeValues);

                    } else {

                    }

                    // Save method to apply scale.
                    this.scales[parameterName] = datum => {
                        return scale(datum[dataField.name]);
                    };

                } else {

                    scale = lodash.constant(5);

                }

			}, this)
            .value();

		//if (this.mapping.fill) {
        //
		//	let fillValues = lodash(this.data.rows)
		//		.pluck(this.mapping.fill.name)
		//		.unique()
		//		.value();
        //
		//	let fillRange = lodash.map(fillValues, (value, index) => 'fill-' + index);
        //
		//	let fillScale = d3.scale.ordinal()
		//		.domain(fillValues)
		//		.range(fillRange);
        //
		//	this.scales.fill = datum => {
		//		return fillScale(datum[this.mapping.fill.name]);
		//	};
        //
		//} else {
		//	this.scales.fill = lodash.value('fill-0');
		//}
        //
		//if (this.mapping.stroke) {
        //
		//	let fillValues = lodash(this.data.rows)
		//		.pluck(this.mapping.stroke.name)
		//		.unique()
		//		.value();
        //
		//	let fillRange = lodash.map(fillValues, (value, index) => 'stroke-' + index);
        //
		//	let fillScale = d3.scale.ordinal()
		//		.domain(fillValues)
		//		.range(fillRange);
        //
		//	this.scales.stroke = datum => {
		//		return fillScale(datum[this.mapping.stroke.name]);
		//	};
        //
		//} else {
		//	this.scales.stroke = lodash.value('stroke-0');
		//}

	}

	draw (selector) {
		
		// Use d3.select() on selector string.
		if (lodash.isString(selector)) {
			this.container = d3.select(selector);	
		} 
		
		// Ensure selector was valid.
		if (lodash.isUndefined(this.container)) {
			throw new Error('Selector returned undefined.');
		}
		
		// Add SVG for plot.
		this.svg = this.container.append('svg').attr('class', 'plot');
		
		// Make sure there are layers to plot.
		if (!this.layers.length) {
			throw new Error('No layers in plot.');
		}

		// Get container dimensions.
		var containerBox = this.container[0][0].getBoundingClientRect();
		this.height = containerBox.height;
		this.width = containerBox.width;
		this.plotAreaHeight = containerBox.height;
		this.plotAreaWidth = containerBox.width;
		this.plotUpperOffset = 0;
		this.plotLeftOffset = 0;

		this._drawTitle();
		this._drawAxesTitles();
		this._drawAxes();
		this._drawPlotArea();
		this._positionTitles();
		//this._createParameterScales();
		this._drawLayers();

		return new LiveChart(this);
		
	}
	
}