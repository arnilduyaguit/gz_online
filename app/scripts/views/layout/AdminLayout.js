define( function ( require ) {
	'use strict';

	var Backbone = require( 'backbone' );
	var template = require( 'hbs!tmpl/layout/adminLayout' );

	/* Return a Layout class definition */
	return Backbone.Marionette.Layout.extend( {

		initialize : function() {
			console.log( 'initialize a adminLayout Layout' );
		},

		template : template,

		/* Layout sub regions */
		regions : {
			'menuRegion'    : '#menu-region',
			'contentRegion' : '#content-region'
		},

		/* ui selector cache */
		ui : {},

		/* Ui events hash */
		events : {},

		/* on render callback */
		onRender : function() {}
	} );

} );