(function() {
    var schema = {
        properties: {
            type : {
                type : 'string',
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
            },
            source : {
                type : 'any',
                default : []
            },
            items : {
                type : 'number',
                default : 8
            },
            matcher : { type : 'any' },
            storter : { type : 'any' },
            highlighter : { type : 'any' }
        }
    };
    return Iris.Renderer.extend({
        about: function() {
            return {
                name: "FormTypeahead",
                author: "Scott Devoid",
                version: "0.1",
                requires: ['jquery.js', 'revalidator.js', 'bootstrap-typeahead.js'],
                options: schema
            };
        },
        exampleData: function() {
            return {
                type  : 'text',
                name  : 'helloText',
                label : 'A simple text input',
                helpBlock : 'With additional helpBlock information',
                placeholder : 'insert text here...',
                source : "Alabama Alaska Arizona Arkansas California Colorado Connecticut Delaware Florida Georgia Hawaii Idaho Illinois Indiana Iowa Kansas Kentucky Louisiana Maine Maryland Massachusetts Michigan Minnesota Mississippi Missouri Montana Nebraska Nevada New-Hampshire New-Jersey New-Mexico New-York North-Carolina North-Dakota Ohio Oklahoma Oregon Pennsylvania Rhode-Island South-Carolina South-Dakota Tennessee Texas Utah Vermont Virginia Washington West-Virginia Wisconsin Wyoming".split(' ')
             };
        },
        render: function(settings) {
            var config, target, text, controlGroup, label, controls, evType, i, taConfig = {}; 
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
            // setup typeahead with info
            var attributes = 'source items matcher sorter highlighter'.split(' ');
            for(i=0; i<attributes.length; i++) {
                var attr = attributes[i];
                if(config.hasOwnProperty(attr)) {
                    taConfig[attr] = config[attr];
                }
            }
            text.typeahead(taConfig);

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
