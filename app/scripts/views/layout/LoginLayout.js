define( function( require ) {
	'use strict';

	var _          = require( 'underscore' );
	var Backbone   = require( 'backbone' );
	var Marionette = require( 'marionette' );
	var Vent       = require( 'Vent' );
	var UserModel  = require( 'models/UserModel' );
	var Session    = require( 'models/SessionModel' );
	// var Reqres = require('')

	var ErrorView       = require( 'views/ErrorView' );
	var LoginLayoutTmpl = require( 'text!tmpl/views/layout/LoginLayout_tmpl.html' );

	/* Return a ItemView class definition */
	return Marionette.Layout.extend( {

		'initialize' : function() {},

		'template' : _.template( LoginLayoutTmpl ),

		'regions' : {
			'loginError' : '#login-error',
		},

		/* ui selector cache */
		'ui' : {
			'email'    : '#input-email',
			'password' : '#input-password',
		},

		/* Ui events hash */
		'events' : {
			'submit' : 'login'
		},

		'login' : function( event ) {

			this.regionManager.each( function( region ) {
				region.close();
			} );

			var email = this.ui.email.val();
			var password = this.ui.password.val();

			Session.fetch( {
				'email'    : email,
				'password' : password,
				'success'  : function( resp ) {
					console.log( resp );

				},
				'error'    : function( xhr, status, error ) {
					console.log( error );
				}
			} );

			return false;
		}
	} );
} );