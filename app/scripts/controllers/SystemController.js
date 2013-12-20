define( function( require ) {
	'use strict';

	var _          = require( 'underscore' );
	var $          = require( 'jquery' );
	var Backbone   = require( 'backbone' );
	var Marionette = require( 'marionette' );
	var Reqres     = require( 'RequestResponse' );

	// require models
	var models = {
		User     : require( 'models/UserModel' )
		//Skills : require('models/SkillModel'),
	};

	// require collections
	var collections = {
		Users : require( 'collections/UsersCollection' )
	};

	// require layouts
	var layouts = {
		System : require( 'views/layout/SystemLayout' )
	};

	var count = {
		cnt : 0
	};

	// require views
	var views = {
		SystemMenuView     : require( 'views/item/SystemMenuView' ),
		SystemContentsView : require( 'views/composite/SystemContentsView' ),
		SystemUserView     : require( 'views/item/SystemUserView' ),
		SystemAssessorView : require( 'views/item/SystemAssessorView' ),
		SystemSkillView    : require( 'views/item/SystemSkillView' )
	};

	return Marionette.Controller.extend( {
		initialize: function( options ) {
			var self = this;

			_.bindAll( this );

			_.each( options, function( value, key ) {
				self[ key ] = value;
			} );

			return this;
		},

		showDefault: function() {
			if ( !Reqres.request( 'sessionAuthenticated' ) ) {
				return this.App.Router.navigate( 'login', { trigger : true } );
			}
			this.layout = this._getLayout();
			this.App.content.show( this.layout );
		},

		showUsers: function() {
			if ( !Reqres.request( 'sessionAuthenticated' ) ) {
				return this.App.Router.navigate( 'login', { trigger : true } );
			}
			this._getCollectionsAndActiveMenu( 'users', 'Users', views.SystemUserView );
		},

		showAssessors: function() {
			if ( !Reqres.request( 'sessionAuthenticated' ) ) {
				return this.App.Router.navigate( 'login', { trigger : true } );
			}
			this._getCollectionsAndActiveMenu( 'assessors', 'Assessors', views.SystemAssessorView );
		},

		showSkills: function() {
			this._setActiveMenu();

			var User = new models.User( {
				selectedMenu: 'Skills'
			} );

			var view = new views.SystemContentsView( {
				model: User,
				collection: new collections.Users(),
				itemView: views.SystemSkillView
			} );

			this.layout.contentRegion.show( view );
		},

		_getCollectionsAndActiveMenu: function( role, menu, itemview ) {
			this._setActiveMenu();
			var self = this;
			var Users = new collections.Users();
			Users.baucis( {
				conditions: {
					role: role
				}
			} ).then( function() {
				var User = new models.User( {
					selectedMenu: menu
				} );
				self.menuModel.set( role + 'Count', Users.length );
				var view = new views.SystemContentsView( {
					model: User,
					collection: Users,
					itemView: itemview
				} );
				//self.menuModel.set(role+'Count', Users.length );
				self.layout.contentRegion.show( view );
			} );
		},

		_getLayout: function() {

			var systemLayout = new layouts.System();

			this.listenTo( systemLayout, 'render', function() {
				this._showMenuAndContent( systemLayout );
			}, this );

			return systemLayout;
		},

		_showMenuAndContent: function() {
			this._showMenu( this.layout.menuRegion );
			this.showAssessors();
			this.showUsers( this.layout.contentRegion, 'Users' );
		},

		_showMenu: function() {
			this.menuModel = new models.User( {
				'usersCount': 0,
				'assessorsCount': 0,
				'skillsCount': 0
			} );
			this.menu = new views.SystemMenuView( {
				model: this.menuModel
			} );

			this.layout.menuRegion.show( this.menu );

		},

		_setActiveMenu: function() {
			var currentRoute = '#' + Backbone.history.fragment;
			var menuOptions = this.menu.ui.menuOptions;
			var hashes = [];

			menuOptions.parent().siblings().removeClass( 'active' );
			_.each( menuOptions, function( value, key ) {
				hashes.push( value.hash );

				if ( currentRoute === value.hash ) {
					$( menuOptions[ key ] ).parent().addClass( 'active' );
				}
			} );

			// Set default active menu if current route has no match in the options hashes
			if ( $.inArray( currentRoute, hashes ) === -1 ) {
				$( menuOptions[ 0 ] ).parent().addClass( 'active' );
			}
		}

	} );

} );