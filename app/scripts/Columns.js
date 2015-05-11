class Columns extends Layer {

    constructor () {
        super('layer-columns', {})
    }

    draw (data, mapping, scales, plotArea) {

        let parameterScales = this._generateScales(data);

        // Create x scale.
        let x;
        if (mapping.x.isContinuous()) {

            x = d3.scale
                .linear()
                .domain(d3.extent(data.rows, datum => datum[mapping.x.name]))
                .range([0, this.plotAreaWidth]);

        } else {

            x = d3.scale
                .linear()
                .domain(d3.extent(data.rows, datum => datum[mapping.x.name]))
                .range([0, this.plotAreaWidth]);

        }



        plotArea
            .append('g')
            .attr('class', this._className)
            .selectAll('rect')
            .data(data.rows)
            .enter()
            .append('rect')
            .attr({
                'x': 0,
                'y': 0
            });

    }

}