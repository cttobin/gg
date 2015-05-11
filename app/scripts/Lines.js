class Lines extends Layer {
	
	constructor (userParameters) {

        let themeColours = {
            swatch: ['#2980b9', '#27ae60', '#e74c3c', '#9b59b6', '#1cccaa', '#f39c12'],
            gradient: ['#f1c40f', '#f39c12']
        };
		
		super ('layer-lines', userParameters, {

			// Line thickness.
			'thickness': new ContinuousRangeScale(2, [1, 10]),

			// Line shape.
            'interpolate': new StaticRangeScale('linear', ['linear','linear-closed','step-before','step-after','basis','basis-open','basis-closed','bundle','cardinal','cardinal-open','cardinal-closed','monotone']),

			// Dotted line or whatever.
			'dash': new OrdinalRangeScale('0', ['0', '4, 4', '2, 2']),
            'opacity': new ContinuousRangeScale(1, [0.1, 1]),
            'stroke': new OrdinalRangeScale(themeColours.swatch[1], themeColours.swatch, themeColours.gradient)

		});
		
	}

    _onFirstDatum (method) {
        return function (data) {
            return method(data[0]);
        };
    }

	draw (data, mapping, scales, plotArea) {

		let parameterScales = super._generateScales(data);

		let lineFunction = d3.svg.line()
			.x(datum => scales.x(datum[mapping.x.name]))
			.y(datum => scales.y(datum[mapping.y.name]))
			.interpolate(parameterScales.interpolate());

		// Assign the data has not been grouped and it should just
		// be plotted as it was given originally.
		let group = false;

		// Parameters that will cause grouping.
		let groupingParameters = ['stroke'];

		// The eventual chart data.
		let lineData;

		// Check all grouping variables to see if any have been mapped.
		lodash.forEach(groupingParameters, function (item) {

			// See if the grouping variable has been mapped by the user.
			let mappingExists = lodash(this._userParameters).keys().contains(item);
			if (!group && mappingExists) {

				lineData = lodash(data.rows)
					.groupBy(this._userParameters[item].name)
					.toArray()
					.value();

				// Found a group variable.
				group = true;

			}

		}, this);

		// Since no grouping variable has been found, the data must
		// be converted into a multidimensional array to suit d3.
		if (!group) {
			lineData = [data.rows];
		}

		plotArea
			.append('g')
			.attr('class', this._className)
			.selectAll('.datum-lines')
			.data(lineData)
			.enter()
			.append('path')
			.attr({
				'd': lineFunction,
				'stroke-width': this._onFirstDatum(parameterScales.thickness),
                'stroke': this._onFirstDatum(parameterScales.stroke)
			})
			.style({
                'stroke-dasharray': this._onFirstDatum(parameterScales.dash),
                'opacity': this._onFirstDatum(parameterScales.opacity)
            });
		
	}
	
}
