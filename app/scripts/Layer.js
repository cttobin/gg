class Layer {
	
	constructor (className, chart, userParameters, defaultParameters) {

        //this._generateScales(data, userParameters, defaultParameters);

        this._userParameters = userParameters;
        this._defaultParameters = defaultParameters;

		// The class to apply to the layer when its drawn. Used for styling.
		this._className = className;

	}

	_generateScales (data) {

        let scales = {};

		lodash(this._userParameters)
            .forOwn(function (parameter, parameterName) {

				// Input to output mapping.
				let parameterScale;

                // Find the appropriate scale.
                let scaleObject = this._defaultParameters[parameterName];

                if (lodash.isUndefined(scaleObject)) {
                    let validParameters = lodash.keys(this._defaultParameters).join(', ');
                    throw new Error(`"${parameterName}" is not a valid parameter for ${this._className}. The parameters you may choose from are: ${validParameters}.`);
                }

                // Will map the parameter to a data field if necessary.
				if (isDataField(parameter)) {

                    // Get the field used for the current mapping.
                    var dataField = this._userParameters[parameterName];

                    // Static parameters can not be mapped.
                    if (scaleObject.isStatic()) {
                        let validValues = orList(scaleObject.validValues);
                        throw new Error(`You have attempted to map "${dataField.name}" to the "${parameterName}" parameter but this parameter cannot be mapped to the data. You may only specific a fixed value (one of: ${validValues}).`);
                    }

                    let scale;

					if (dataField.isOrdinal()) {

						scale = d3.scale.ordinal()
                            .domain(d3.extent(data.rows, datum => datum[dataField.name]));

                        scaleObject.getOrdinalRange(scale);

					} else if (dataField.isContinuous()) {

                        scale = d3.scale.linear()
                            .domain(d3.extent(data.rows, datum => datum[dataField.name]));

                        scaleObject.getContinuousRange(scale);

					}

					// Save method to apply scale.
					parameterScale = datum => {
						return scale(datum[dataField.name]);
					};

				} else {

                    // The parameter value is just a fixed/constant value. Make sure it's suitable.
                    if (!scaleObject.isValueValid(parameter)) {
                        throw new Error(`"${parameter}" is not a valid value for "${parameterName}".`);
                    }

					parameterScale = lodash.constant(parameter);

				}

                scales[parameterName] = parameterScale;

			}, this)
			.value();

        // All parameters provided by the user.
        let userParameterNames = lodash.keys(this._userParameters);
        lodash(this._defaultParameters)
            .keys()
            .reject(function (name) {

                // Do not apply default parameters if the user has overridden them.
                return lodash.contains(userParameterNames, name)

            })
            .forEach(function (name) {

                // Extract default scale.
                let parameter = this._defaultParameters[name];

                // Make constant getter for default value.
                scales[name] = lodash.constant(parameter.defaultValue);

            }, this)
            .value();



        return scales;

	}

	draw (data, mapping, scales, svg) {
		
	}

}