module.exports = {
	nx: {
		/* Core */
		Binding:       require('./core/binding'),
		Cell:          require('./core/cell'),
		Collection:    require('./core/collection'),
		Command:       require('./core/command'),
		Identity:      require('./core/identity'),
		LiveTransform: require('./core/live-transform'),
		Mapping:       require('./core/mapping')
	}
};
