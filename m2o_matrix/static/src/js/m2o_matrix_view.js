odoo.define('m2o_matrix.View', function (require) {
    'use strict';

    const BasicView = require('web.BasicView');
    const view_registry = require('web.view_registry');
    const M2oMatrixController = require('m2o_matrix.Controller');
    const M2oMatrixModel = require('m2o_matrix.Model');
    const M2oMatrixRenderer = require('m2o_matrix.Renderer');

    const M2oMatrixView = BasicView.extend({
        display_name: 'M2o matrix view',
        icon: 'fa-hashtag',
        config: {
            Model: M2oMatrixModel,
            Controller: M2oMatrixController,
            Renderer: M2oMatrixRenderer,
        },
        viewType: 'm2o_matrix',
        groupable: false,

        init: function () {
            this._super.apply(this, arguments);

            const attrs = this.arch.attrs;
            for (const attr of ["row", "col", "cell"]) {
                if (!attrs[attr]) {
                    throw new Error('m2o_matrix view has not defined "' + attr + '" attribute.');
                }

                const fieldName = attrs[attr];
                if (!this.fieldsInfo[this.viewType][fieldName]) {
                    throw new Error('Field "' + fieldName + '" must be present in view.');
                }

                if ($.inArray(attr, ["row", "col"]) != -1 && this.fields[fieldName].type != "many2one") {
                    throw new Error('"' + attr + '" attribute must be set to a many2one field.');
                }

            }

            this.rendererParams.row_field = attrs["row"]
            this.rendererParams.col_field = attrs["col"]
            this.rendererParams.cell_field = attrs["cell"]

            this.loadParams.row_field = attrs["row"]
            this.loadParams.col_field = attrs["col"]

        },

    });

    view_registry.add('m2o_matrix', M2oMatrixView);

    return M2oMatrixView;


});
