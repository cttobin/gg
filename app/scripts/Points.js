class Points extends Layer {
	
	constructor (userParameters) {

        let themeColours = {
            swatch: ['#2980b9', '#27ae60', '#e74c3c', '#9b59b6', '#1cccaa', '#f39c12'],
            gradient: ['#f1c40f', '#f39c12']
        };

		super ('layer-points', userParameters, {

			'size': new ContinuousRangeScale(4, [2, 6]),
            'fill': new OrdinalRangeScale(themeColours.swatch[1], themeColours.swatch, themeColours.gradient),
            'opacity': new ContinuousRangeScale(1, [0.1, 1]),
            'stroke': new OrdinalRangeScale(null, themeColours.swatch, themeColours.gradient)
	
		});
		
	}

	draw (data, mapping, scales, plotArea) {

        let parameterScales = super._generateScales(data);

		plotArea
			.append('g')
			.attr('class', this._className)
			.selectAll('.datum-points')
			.data(data.rows)
			.enter()
			.append('circle')
			.attr({
				'r': parameterScales.size,
				'cx': datum => scales.x(datum[mapping.x.name]),
				'cy': datum => scales.y(datum[mapping.y.name]),
				'class': scales.fill
			})
            .style({
                'fill': parameterScales.fill,
                'stroke': parameterScales.stroke,
                'opacity': parameterScales.opacity
            });
		
	}
	
}
