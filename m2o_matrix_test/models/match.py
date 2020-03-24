from odoo import models, fields


class Match(models.Model):

    _name = "match.result"

    joueur_1 = fields.Many2one("res.partner", required=True)
    joueur_2 = fields.Many2one("res.partner", required=True)

    resultat = fields.Integer()
