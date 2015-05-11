var lodash = _.noConflict();
var PlotJS = {
	
	chart: function (data, mapping, chartOptions) {
		return new Chart(data, mapping, chartOptions);
	},
	
	select: function (selector) {
			
	},
	
	data: function (data) {
		return new Data(data);
	},

	type: {
		ordinal: function () {

		}
	},

	labels: {
		comma: d3.format(','),
		integer: function () { return d3.format('d') },
		currency: function (currencySymbol) {
			return d3.format('$,');
		}
	}
	
}