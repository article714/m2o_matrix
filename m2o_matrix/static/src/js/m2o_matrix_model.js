odoo.define('m2o_matrix.Model', function (require) {
    'use strict';

    const BasicModel = require('web.BasicModel');

    const M2oMatrixModel = BasicModel.extend({

        load: function (params) {
            const self = this;

            this.row_field = params.row_field;
            this.col_field = params.col_field;

            let toto = this._super.apply(this, arguments).then(res => self._completeMatrix(res).then(function () { return res }));
            return toto
        },

        reload: function () {
            const self = this;
            return this._super.apply(this, arguments).then(res => self._completeMatrix(res).then(function () { return res }));
        },

        save: function (recordID, options) {
            const self = this;
            const record = this.localData[recordID];
            if (record.type == "list") {
                this._visitChildren(this.localData[recordID], function (rec) {
                    if (rec.isDirty()) {
                        self._super.apply(self, [rec.id, options])
                    }
                })
            }
            return this._super.apply(this, arguments)
        },

        discardChanges: function (id, options) {
            options = options || {};
            if (!('rollback' in options)) {
                options.rollback = true;
            }
            this._super.apply(this, [id, options]);

            if (options.rollback) {
                this._visitChildren(this.localData[id], function (elem) {
                    elem._isDirty = false;
                });
            }
        },

        _completeMatrix: function (listID) {
            const self = this;

            const defs = []

            const data = this.get(listID).data;

            const row_ids = [];
            const row_display_name = {};
            const col_ids = [];
            const col_display_name = {};
            const cell_ids = {};

            data.map(rec => {
                const row_id = rec.data[this.row_field].res_id;
                const col_id = rec.data[this.col_field].res_id;

                if ($.inArray(row_id, row_ids) == -1) {
                    row_ids.push(row_id);
                    row_display_name[row_id] = rec.data[this.row_field].data.display_name;
                }
                if ($.inArray(col_id, col_ids) == -1) {
                    col_ids.push(col_id);
                    col_display_name[col_id] = rec.data[this.col_field].data.display_name;
                }

                if (!cell_ids[row_id]) {
                    cell_ids[row_id] = []
                }
                if ($.inArray(col_id, cell_ids[row_id] == -1)) {
                    cell_ids[row_id].push(col_id)
                }
            });

            for (const row_id of row_ids) {
                for (const col_id of col_ids) {
                    if ($.inArray(col_id, cell_ids[row_id]) == -1) {
                        defs.push(this.addDefaultRecord(listID).then(recordID => {
                            const changes = {}
                            changes[this.row_field] = { id: row_id, display_name: row_display_name[row_id] }
                            changes[this.col_field] = { id: col_id, display_name: col_display_name[col_id] }

                            defs.push(self.notifyChanges(recordID,
                                changes,
                                {
                                    doNotSetDirty: true,
                                    notifyChange: false
                                }).then(self.save.bind(self, recordID, {
                                    reload: false,
                                    savePoint: true
                                })));
                        }));
                    }
                }

            }
            return $.when.apply($, defs);
        },

    });

    return M2oMatrixModel;

});
