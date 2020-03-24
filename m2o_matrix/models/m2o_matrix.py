from odoo import models, fields


class ActWindowView(models.Model):
    _inherit = "ir.actions.act_window.view"
    view_mode = fields.Selection(selection_add=[("m2o_matrix", "M2o matrix")])


class View(models.Model):
    _inherit = "ir.ui.view"
    type = fields.Selection(selection_add=[("m2o_matrix", "M2o matrix")])
