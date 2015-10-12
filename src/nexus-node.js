module.exports = {
	nx: {
		/* Core */
		Binding:       require('./core/binding'),
		Cell:          require('./core/cell'),
		Collection:    require('./core/collection'),
		Command:       require('./core/command'),
		Identity:      require('./core/identity'),
		LiveTransform: require('./core/live-transform'),
		Mapping:       require('./core/mapping'),

		/* Refinements */
		RefinedCollection: require('./refinements/refined-collection'),
		Refinement:        require('./refinements/refinement'),

		FilterRefinement:  require('./refinements/filter-refinement'),
		MapRefinement:     require('./refinements/map-refinement')
	}
};
