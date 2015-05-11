(function () {

	var rawData = [
		{'year': 2010, 'sales': 1000, 'department': 'A'}, 
		{'year': 2011, 'sales': 2000, 'department': 'A'}, 
		{'year': 2012, 'sales': 3000, 'department': 'A'},
		{'year': 2013, 'sales': 800,  'department': 'A'},
		{'year': 2014, 'sales': 1250, 'department': 'A'},
		{'year': 2015, 'sales': 250,  'department': 'A'},
		{'year': 2010, 'sales': 1250, 'department': 'B'},
		{'year': 2011, 'sales': 1890, 'department': 'B'}, 
		{'year': 2012, 'sales': 2800, 'department': 'B'},
		{'year': 2013, 'sales': 2800, 'department': 'B'},
		{'year': 2014, 'sales': 2175, 'department': 'B'},
		{'year': 2015, 'sales': 1276, 'department': 'B'}
	];

	var data = new Data(rawData, { 
		year: PlotJS.type.ordinal
	});

	var chart = PlotJS.chart(data, {
		x: data.fields.year,
		y: data.fields.sales
	})
	.ticksFormat({
		y: PlotJS.labels.currency(),
		x: PlotJS.labels.integer()
	})
    .columns()
	.titles({ 
		main: 'What', 
		x: 'Current Year',
		y: 'Total Sales'
	})
	// .title('Chart Title')
	.draw('.some-container');

})();