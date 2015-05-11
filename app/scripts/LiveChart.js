class LiveChart {

	constructor (chart) {
		this.chart = chart;
	}

	title (titleText) {
		this.chart.titleElement.text(titleText);
	}

	

}