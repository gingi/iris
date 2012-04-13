(function() {
    var schema = {
        properties: {
            type : {
                type : 'object',
                default : 'text'
            },
            name : {
                type : 'string',
                required : true
            },
            label : {
                type : 'any'
            },
            helpBlock : {
                type : 'any'
            },
            disabled : {
                type : 'boolean',
                default : false
            },
            value : {
                type : 'string'
            },
            placeholder : {
                type : 'string'
            },
            events : {
                type : 'any',
                default : {}
            }
        }
    };
    Iris.Renderer.extend({
        about: {
            name: "FormText",
            author: "Scott Devoid",
            version: "0.1",
            requires: ['jquery.js', 'revalidator.js'],
            options: schema
        },
        exampleData: function() {
            return {
                type  : 'text',
                name  : 'helloText',
                label : 'A simple text input',
                helpBlock : 'With additional helpBlock information',
                placeholder : 'insert text here...',
                events : {
                    'blur' : function (e) { alert(this.value); }
                }
            };
        },
        render: function(settings) {
            var config, target, text, controlGroup, label, controls, evType;
            config = settings.data;
            json.validate(config, schema);
            target = jQuery(settings.target);
            // settings for <input type='text'> element
            text = jQuery("<input>").attr("type", config.type)
                                        .attr("name", config.name);
            if(config.disabled) {
                text.addClass("disabled").attr("disabled", config.disabled);
            }
            if(config.hasOwnProperty('value')) {
                text.attr("value", config.value);
            }
            if(config.hasOwnProperty('placeholder')) {
                text.attr("placeholder", config.placeholder);
            }
            // configure other labels
            controlGroup = jQuery("<div>").addClass("control-group");
            label = jQuery("<label>").html(config.label);
            controls = jQuery("<div>").addClass("controls")
                                          .append(text);
            if(config.hasOwnProperty("helpBlock")) {
                controls.append(
                    jQuery("<p>").addClass("help-block").html(config.helpBlock)
                );
            }
            controlGroup.append(label);
            controlGroup.append(controls);
            // bind event listeners
            for( evType in config.events ) {
                if(!config.events.hasOwnProperty(evType)) {
                    continue; 
                }
                text.on(evType, null, this, config.events[evType]);
            }
            target.html(controlGroup);
        }
    });
}).call(this);
