class Data {
	constructor (data, types) {
		
		this.rows = data;
		this.fields = {};

        // Get all field names.
		let fields = lodash(data)
			.map(datum => lodash.keys(datum))
			.flatten()
			.unique()
			.value();

        // Types inferred so far.
        let row = 0;
        while (fields.length && row < data.length) {

            // The names of the fields for which types have been found on this row.
            let typesFound = [];
            lodash.forEach(fields, function (field) {

                // Field at current row.
                let value = data[row][field];

                // Determine the fields type.
                if (lodash.isString(value)) {
                    this._createDataField(typesFound, field, 'ordinal');
                } else if (lodash.isNumber(value)) {
                    this._createDataField(typesFound, field, 'continuous');
                } else if (lodash.isDate(value)) {
                    this._createDataField(typesFound, field, 'date');
                }

            }, this);

            // Remove the found fields from the overall list.
            fields = lodash.difference(fields, typesFound);

            // The field was null or undefined so move on to the next row.
            row++;

        }

	}

    _createDataField (fieldsFound, field, type) {
        this.fields[field] = new DataField(field, type);
        fieldsFound.push(field);
    }


}
