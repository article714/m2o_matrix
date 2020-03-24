odoo.define('m2o_matrix.Controller', function (require) {
    'use strict';

    const BasicController = require('web.BasicController');
    const core = require('web.core');
    const qweb = core.qweb;

    const M2oMatrixController = BasicController.extend({
        custom_events: _.extend({}, BasicController.prototype.custom_events, {
            bounce_edit: '_onBounceEdit',
        }),

        _update: function () {
            this._updateButtons();
            return this._super.apply(this, arguments);
        },

        _updateButtons: function () {
            if (this.$buttons) {
                const edit_mode = (this.mode === 'edit');
                this.$buttons.find('.o_form_buttons_edit')
                    .toggleClass('o_hidden', !edit_mode);
                this.$buttons.find('.o_form_buttons_view')
                    .toggleClass('o_hidden', edit_mode);
            }
        },

        renderButtons: function ($node) {
            this.$buttons = $('<div/>');
            this.$buttons.append(qweb.render("m2o_matrix.buttons", { widget: this }));
            this.$buttons.on('click', '.o_form_button_edit', this._onEdit.bind(this));
            this.$buttons.on('click', '.o_form_button_save', this._onSave.bind(this));
            this.$buttons.on('click', '.o_form_button_cancel', this._onDiscard.bind(this));
            this._updateButtons();

            this.$buttons.appendTo($node);
        },

        _onBounceEdit: function () {
            if (this.$buttons) {
                this.$buttons.find('.o_form_button_edit').odooBounce();
            }
        },

        _onEdit: function () {
            // wait for potential pending changes to be saved (done with widgets
            // allowing to edit in readonly)
            this.mutex.getUnlockedDef().then(this._setMode.bind(this, 'edit'));
        },

        _onSave: function (ev) {
            ev.stopPropagation(); // Prevent x2m lines to be auto-saved
            var self = this;
            this._disableButtons();
            this.saveRecord().always(function () {
                self._enableButtons();
            });
        },

        _onDiscard: function () {
            this._discardChanges();
        },

        _confirmSave: function (id) {
            if (this.mode === 'readonly') {
                return this.reload();
            } else {
                return this._setMode('readonly');
            }
        }
    });

    return M2oMatrixController;

});
