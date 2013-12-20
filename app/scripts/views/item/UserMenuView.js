define( function ( require ) {
	'use strict';

	var _          = require( 'underscore' );
	var Marionette = require( 'marionette' );
	var template   = require( 'text!tmpl/item/userMenuView.html' );

	// Return a ItemView class definition
	return Marionette.ItemView.extend( {

		initialize : function ( options ) {
			var self = this;

			_.bindAll( this );

			_.each( options, function ( value, key ) {
				self[ key ] = value;
			} );

			this.listenTo(this.model, 'change', this.render);

			return this;
		},

		template : _.template( template ),

		className : 'panel panel-primary',

		// ui selector cache
		ui : {
			'menuOptions' : 'li a'
		},

		// Ui events hash
		events : {},

		// on render callback
		onRender : function() {},

	} );

} );