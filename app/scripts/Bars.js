class Bars extends Layer {

	constructor (userParameters) {

		super(userParameters, {});

	}

	draw (data, mapping, scales, plotArea) {

		plotArea.selectAll('.bar-datum')
			.data(data.rows)
			.enter()
			.append('rect')
			.attr({

			});

	}

}