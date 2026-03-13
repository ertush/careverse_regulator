"""Custom login page for Compliance 360 Regulator Portal."""

from urllib.parse import urlparse

import frappe
from frappe import _

no_cache = True


def get_context(context):
    redirect_to = frappe.local.request.args.get("redirect-to")
    redirect_to = sanitize_redirect(redirect_to)

    if frappe.session.user != "Guest":
        frappe.local.flags.redirect_location = redirect_to
        raise frappe.Redirect

    context.no_cache = 1
    context.no_header = True
    context.no_breadcrumbs = True
    context.title = _("Sign In - Compliance 360")

    context.app_name = "Compliance 360"
    context.redirect_to = redirect_to
    context.login_name_placeholder = _("Email")
    context.support_email = "support@careverse.africa"
    context.headline = "Secure access for regulators, reviewers, and supervisory teams"
    context.subheadline = (
        "Enter your portal credentials to continue with licensing operations, compliance oversight, "
        "and regulator analytics."
    )
    context.perks = [
        "Centralized licensing and renewal reviews",
        "Real-time compliance monitoring and escalations",
        "Secure access with audit-ready decision history",
        "Direct switch to Frappe Desk for administrative work",
    ]

    return context


def sanitize_redirect(redirect_url):
    """Prevent open redirects and keep redirects inside portal routes."""
    default_redirect = "/compliance-360"

    if not redirect_url:
        return default_redirect

    parsed_redirect = urlparse(redirect_url)
    parsed_request = urlparse(frappe.local.request.url)

    if parsed_redirect.scheme or parsed_redirect.netloc:
        if parsed_redirect.netloc and parsed_redirect.netloc != parsed_request.netloc:
            return default_redirect

    path = parsed_redirect.path or "/"
    fragment = parsed_redirect.fragment or ""

    safe_prefixes = ["/compliance-360", "/desk", "/app"]
    if not any(path.startswith(prefix) for prefix in safe_prefixes):
        return default_redirect

    if fragment:
        return f"{path}#{fragment}"

    if parsed_redirect.query:
        return f"{path}?{parsed_redirect.query}"

    return path
