class Scale {

    constructor (defaultValue) {
        this._defaultValue = defaultValue;
    }

    get defaultValue () {
        return this._defaultValue;
    }

    isStatic () {
        return this instanceof StaticRangeScale;
    }

}

class OrdinalRangeScale extends Scale {

    constructor (defaultValue, ordinalValues, continuousLimits) {

        super(defaultValue);
        this._ordinalValues = ordinalValues;
        this._continuousLimits = continuousLimits;

    }

    isValueValid (value) {
        return lodash.isString(value);
    }

    getOrdinalRange (scale) {
        scale.range(this._ordinalValues);
    }

    getContinuousRange (scale) {
        scale.range(this._continuousLimits);
    }

}


class ContinuousRangeScale extends Scale {

    constructor(defaultValue, limits) {

        super(defaultValue);
        this._limits = limits;

    }

    isValueValid (value) {
        return lodash.isNumber(value);
    }

    getOrdinalRange (scale) {
        scale.rangePoints(this._limits);
    }

    getContinuousRange (scale) {
        scale.range(this._limits);
    }

}

class StaticRangeScale extends Scale {

    constructor (defaultValue, validValues) {
        super(defaultValue);
        this._validValues = validValues;
    }

    get validValues () {
        return this._validValues;
    }

    isValueValid (value) {
        return lodash.contains(this._validValues, value);
    }

}
