(function($) {

    $.AnnotationsTab = function(options) {
        jQuery.extend(true, this, {
            element:           null,
            appendTo:          null,
            parent:            null,
            manifest:          null,
            visible:           null
        }, options);

        this.init();
    };

    $.AnnotationsTab.prototype = {
        init: function() {
            var _this = this;
            this.windowId = this.parent.id;

            var state = this.state({
                visible: this.visible,
                annotationLists: null
            }, true);

            this.listenForActions();
            this.bindEvents();
            this.loadTabComponents();
        },
        state: function(state, initial) {
            if (!arguments.length) return this.tabState;
            this.tabState = state;

            if (!initial) {
                jQuery.publish('annotationsTabStateUpdated' + this.windowId, this.tabState);
            }

            return this.tabState;
        },
        loadTabComponents: function() {
            var _this = this;
        },
        tabStateUpdated: function(visible) {
            var state = this.state();
            state.visible = state.visible ? false : true;

            this.state(state);
        },
        annotationListLoaded: function() {
            var _this = this,
                motivations = [],
                state = this.state();

            for(i = 0; i < _this.parent.annotationsList.length; i++)
            {
                for(x = 0; x < _this.parent.annotationsList[i].motivation.length; x++)
                {
                    motivation = _this.parent.annotationsList[i].motivation[x];
                    motivation = motivation.split(":")[1];
                    motivation = motivation.charAt(0).toUpperCase() + motivation.substr(1);
                    motivations.push(motivation);
                }
            }

            jQuery.unique(motivations);

            state.annotationsList = motivations;
            this.state(state);
        },
        toggle: function() {},
        listenForActions: function() {
            var _this = this;
            jQuery.subscribe('annotationsTabStateUpdated' + _this.windowId, function(_, data) {
                _this.render(data);
            });

            jQuery.subscribe('tabStateUpdated' + _this.windowId, function(_, data) {
                _this.tabStateUpdated(data.annotationsTab);
            });


            jQuery.subscribe('annotationListLoaded.' + _this.windowId, function(_, data) {
                _this.annotationListLoaded();
            });

            jQuery.subscribe('currentCanvasIDUpdated.' + _this.windowId, function(event) {
              jQuery.subscribe('annotationListLoaded.' + _this.windowId, function(event) {
                  _this.annotationListLoaded();
              });
            });
        },
        bindEvents: function() {
            var _this = this;
        },
        render: function(state) {
            var _this = this,
                templateData = {
                    motivations: state.annotationsList
                };

            if (!this.element) {
                this.element = jQuery(_this.template(templateData)).appendTo(_this.appendTo);
            } else {
                _this.appendTo.find(".annotationsPanel").remove();
                this.element = jQuery(_this.template(templateData)).appendTo(_this.appendTo);
            }

            if (state.visible) {
                this.element.show();
            } else {
                this.element.hide();
            }
        },
        template: Handlebars.compile([
            '<div class="annotationsPanel">',
            '<ul class="motivations">',
            '{{#each motivations}}<li><a href="#" class="motivation">{{this}}</li>{{/each}}',
            '</ul>',
            '</div>',
        ].join(''))
    };

}(Mirador));
