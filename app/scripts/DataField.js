class DataField {

	constructor (name, type) {
		this._name = name;
		this._type = type;
	}

    get name () {
        return this._name;
    }

    isOrdinal () {
        return this._type === 'ordinal';
    }

    isContinuous () {
        return this._type === 'continuous';
    }
}

function isDataField (value) {
    return value instanceof DataField;
}