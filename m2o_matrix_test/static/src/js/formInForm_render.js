odoo.define('fif.Renderer', function (require) {
    'use strict';

    const BasicRenderer = require('web.BasicRenderer');
    const view_registry = require('web.view_registry');
    const data = require('web.data');

    const FifRenderer = BasicRenderer.extend({

        _render: function () {
            this.$el.empty();

            const FormView = view_registry.get('form');

            //boucle juste pour avoir des ID différent (1 et 2)
            for (let i = 1; i < 3; i++) {

                let self = this;
                let model = "res.partner"

                let dataset = new data.DataSet(this, model, this.state.context);

                this.getParent().loadFieldView(dataset, null, "form").then(function (viewInfo) {

                    const params = {
                        context: self.state.context,
                        ids: [i],
                        currentId: i,
                        modelName: model,
                    };

                    const formview = new FormView(viewInfo, params);

                    formview.getController(self.getParent()).then(function (formView) {

                        self.form_view = formView;
                        self.form_view.controllerID = self.getParent().controllerID
                        self.form_view.appendTo(self.$el);
                        self.form_view.renderButtons(self.$el);

                    })

                })

            }
            return this._super.apply(this, arguments);
        },
    });

    return FifRenderer;

});
