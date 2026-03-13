"""Public landing page for Compliance 360."""

import frappe
from frappe import _

no_cache = True


def get_context(context):
    if frappe.session.user != "Guest":
        frappe.local.flags.redirect_location = "/compliance-360"
        raise frappe.Redirect

    context.no_cache = 1
    context.no_header = True
    context.no_breadcrumbs = True
    context.title = _("Compliance 360 - Regulators Portal")

    context.app_name = "Compliance 360"
    context.tagline = "Your National Hub for Healthcare Compliance"
    context.subtitle = (
        "Digitally manage licensing, accreditation, inspections, compliance monitoring, and "
        "enforcement for healthcare professionals and facilities across Kenya."
    )
    context.cta_text = "Open Compliance 360"
    context.cta_link = "/login?redirect-to=/compliance-360"
    context.cta_secondary_text = "Switch to Desk"
    context.cta_secondary_link = "/app"

    context.metrics = [
        {"value": "17+", "label": "Regulatory Bodies"},
        {"value": "50,000+", "label": "Licensed Professionals"},
        {"value": "5,000+", "label": "Facilities Regulated"},
        {"value": "100%", "label": "Digital and Secure"},
    ]

    context.showcase_stats = [
        {"label": "Active Renewals", "value": "2,430", "sub": "Currently under review"},
        {"label": "Inspection Alerts", "value": "164", "sub": "Flagged for action"},
        {"label": "Decision Time", "value": "5.2d", "sub": "Average turnaround"},
    ]

    context.features = [
        {
            "title": "License Management",
            "description": "Streamlined application processing with automated workflows and certificate generation.",
        },
        {
            "title": "Compliance Monitoring",
            "description": "Real-time tracking with alerts for CPD credits, expiries, and inspections.",
        },
        {
            "title": "Analytics & Insights",
            "description": "Powerful reporting with trends, filters, and export-ready regulatory summaries.",
        },
    ]

    context.capabilities = [
        {
            "title": "Risk-Led Oversight",
            "description": "Prioritize inspections, renewals, and escalations using a single supervisory queue.",
        },
        {
            "title": "Shared Regulatory Workspace",
            "description": "Coordinate national and county reviews inside one secure operating environment.",
        },
        {
            "title": "Decision Intelligence",
            "description": "Use metrics, trends, and alerts to improve approval quality and response speed.",
        },
        {
            "title": "Trusted Audit Trail",
            "description": "Every action is recorded for accountability, transparency, and follow-through.",
        },
    ]

    context.testimonials = [
        {
            "quote": "Compliance 360 has shortened facility review cycles by over 40% across our pilot counties.",
            "author": "Director, County Health Regulation Board",
        },
        {
            "quote": "Our inspectors now coordinate licensing and enforcement from one trusted digital workspace.",
            "author": "Chief Compliance Officer, National Health Authority",
        },
    ]

    context.contact_email = "support@careverse.africa"
    context.contact_phone = "+254 700 000 360"
    context.footer_links = {
        "Platform": ["Licensing", "Inspections", "Enforcement"],
        "Resources": ["Operational Support", "Implementation Guide", "Service Desk"],
        "Access": ["Switch to Desk", "Sign In", "Compliance 360"],
    }

    return context
