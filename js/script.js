var Services = Backbone.Model.extend({
    default: {
        title: 'My service',
        price: 100,
        checked: false
    },
    toggle: function() {
        this.set('checked', !this.get('checked'));
    }
});

var ServiceList = Backbone.Collection.extend({
    model: Services,
    getChecked: function() {
        return this.where({checked: true});
    }
});

var services = new ServiceList([
    new Services({title: 'web development', price: 200}),
    new Services({title: 'web design', price: 250}),
    new Services({title: 'photography', price: 100}),
    new Services({title: 'coffee drinking', price: 20})
]);

var ServiceView = Backbone.View.extend({
    tagName: 'li',
    events: {
        'click': 'toggleServices'
    },
    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },
    render: function() {
        this.$el.html('<input type="checkbox" value="1" name="' + this.model.get('checked') + '"/>'
            + this.model.get('title') + '&nbsp;<span>$' + this.model.get('price') + '</span>');
        this.$('input').prop('checked', this.model.get('checked'));

        return this;
    },
    toggleServices: function() {
        this.model.toggle();
    }
});

var App = Backbone.View.extend({
    el: $('#main'),

    initialize: function() {
        this.total = $('#total span');
        this.list = $('#services');

        this.listenTo(services, 'change', this.render);

        services.each(function(service) {
            var view = new ServiceView({model: service});
            this.list.append(view.render().el);
        }, this);
    },

    render: function() {
        var total = 0;
        _.each(services.getChecked(), function(elem) {
            total += elem.get('price');
        });
        this.total.text('$' + total);
        return this;
    }
});

new App();
