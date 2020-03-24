odoo.define('m2o_matrix.Renderer', function (require) {
    'use strict';

    var BasicRenderer = require('web.BasicRenderer');

    var M2oMatrixRenderer = BasicRenderer.extend({
        events: _.extend({}, BasicRenderer.prototype.events, {
            'click .m2o_matrix': '_onClick',
        }),

        init: function (parent, state, params) {
            this._super.apply(this, arguments);

            this.row_field = params.row_field;
            this.col_field = params.col_field;
            this.cell_field = params.cell_field;

            // Parse fields node in order to use them later
            this.fieldsNodes = {};
            this.arch.children.forEach(node => {
                if (node.tag == 'field') {
                    this.fieldsNodes[node.attrs.name] = node
                }
            });
        },

        updateState: function (state, params) {
            this.mode = (params && 'mode' in params) ? params.mode : this.mode;

            return this._super.apply(this, arguments);
        },

        _renderView: function () {

            this.$el.empty();

            const row_ids = [];
            const col_ids = [];

            const $table = $('<table>', { class: 'table m2o_matrix' });
            this.$el.append($table);

            // header
            const $thead = $('<thead>');
            $thead.append($('<th>'));
            $table.append($thead);

            // body
            const $tbody = $('<tbody>');
            $table.append($tbody);

            for (const rec of this.state.data) {

                const row_id = rec.data[this.row_field].res_id;
                const col_id = rec.data[this.col_field].res_id;

                let col_pos = $.inArray(col_id, col_ids);
                if (col_pos == -1) {
                    col_ids.push(col_id);
                    col_pos = col_ids.length - 1;
                    const $th = $('<th>');
                    const widget = this._renderFieldWidget(
                        this.fieldsNodes[this.col_field],
                        rec,
                        { mode: 'readonly' })
                    $th.append(widget);
                    $thead.append($th);

                    $tbody.find('tr').append($('<td>'))
                }

                let row_pos = $.inArray(row_id, row_ids);
                if (row_pos == -1) {
                    row_ids.push(row_id);
                    row_pos = row_ids.length - 1;
                    const widget = this._renderFieldWidget(
                        this.fieldsNodes[this.row_field],
                        rec,
                        { mode: 'readonly' })
                    const $tr = $('<tr>');
                    $tbody.append($tr);
                    const $th = $('<th>');
                    $tr.append($th);
                    $th.append(widget);

                    for (let i = 0; i < col_ids.length; i++) {
                        $tr.append($('<td>'));
                    }
                }

                const $td = $tbody.find('tr:eq(' + row_pos + ')').find('td:eq(' + col_pos + ')')
                const widget = this._renderFieldWidget(this.fieldsNodes[this.cell_field], rec)
                $td.append(widget);
            }

            return this._super.apply(this, arguments);
        },

        /**
         * Makes the Edit button bounce in readonly
         *
         * @private
         */
        _onClick: function () {
            if (this.mode === 'readonly') {
                this.trigger_up('bounce_edit');
            }
        },
    });

    return M2oMatrixRenderer;

});
