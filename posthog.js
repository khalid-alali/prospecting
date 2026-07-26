!(function (t, e) {
  var o, n, p, r;
  e.__SV ||
    ((window.posthog = e),
    (e._i = []),
    (e.init = function (i, s, a) {
      function g(t, e) {
        var o = e.split(".");
        2 == o.length && ((t = t[o[0]]), (e = o[1])),
          (t[e] = function () {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
          });
      }
      ((p = t.createElement("script")).type = "text/javascript"),
        (p.crossOrigin = "anonymous"),
        (p.async = !0),
        (p.src =
          s.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") +
          "/static/array.js"),
        (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r);
      var u = e;
      for (
        void 0 !== a ? (u = e[a] = []) : (a = "posthog"),
          u.people = u.people || [],
          u.toString = function (t) {
            var e = "posthog";
            return "posthog" !== a && (e += "." + a), t || (e += " (stub)"), e;
          },
          u.people.toString = function () {
            return u.toString(1) + ".people (stub)";
          },
          o =
            "init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(
              " ",
            ),
          n = 0;
        n < o.length;
        n++
      )
        g(u, o[n]);
      e._i.push([i, s, a]);
    }),
    (e.__SV = 1));
})(document, window.posthog || []);

posthog.init("phc_p4qJVS74WFwHbSpCkzLddpSnHSCVRfKjgtf7oMnkhGgG", {
  api_host: "https://us.i.posthog.com",
  defaults: "2026-05-30",
  capture_pageview: true,
  capture_pageleave: true,
  autocapture: true,
});

(() => {
  const SERVICE_SLUGS = [
    "finance-ai",
    "customer-operations-ai",
    "field-service-ai",
    "operations-data",
    "what-should-ai-do-in-my-business",
  ];

  const path = window.location.pathname || "/";
  const page = path.replace(/\/index\.html$/i, "/");

  // Wizard CLI outro mentioned these names; keep them as aliases so
  // wizard-created insights/dashboards still receive data.
  const EVENT_ALIASES = {
    booking_started: ["assessment_cta_clicked"],
    contact_form_submitted: ["assessment_form_submitted"],
  };

  const capture = (event, properties = {}) => {
    if (!window.posthog || typeof window.posthog.capture !== "function") return;
    const payload = {
      page,
      ...properties,
    };
    window.posthog.capture(event, payload);
    (EVENT_ALIASES[event] || []).forEach((alias) => {
      window.posthog.capture(alias, payload);
    });
  };

  window.palaAnalytics = { capture };

  const service = SERVICE_SLUGS.find((slug) => page.includes(`/${slug}`));
  if (service) {
    capture("service_viewed", { service });
  }

  if (page.includes("/thank-you")) {
    capture("booking_completed", { method: "thank_you_page" });
  }

  const isAssessmentMailto = (href) => {
    try {
      const url = new URL(href);
      if (url.protocol !== "mailto:") return false;
      return /assessment/i.test(url.searchParams.get("subject") || "");
    } catch {
      return /mailto:.*assessment/i.test(href || "");
    }
  };

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const intakeOpener = target.closest("[data-intake-open]");
      if (intakeOpener) {
        capture("booking_started", {
          method: "intake_modal",
          cta: (intakeOpener.textContent || "").trim().slice(0, 80),
        });
        return;
      }

      const link = target.closest("a[href]");
      if (!link) return;

      const href = link.getAttribute("href") || "";

      if (href.startsWith("mailto:")) {
        capture("email_clicked", {
          location: link.closest("footer") ? "footer" : "page",
        });
        if (isAssessmentMailto(href) || link.classList.contains("btn-primary")) {
          capture("booking_started", { method: "email" });
        }
        return;
      }

      if (href.startsWith("tel:")) {
        capture("phone_clicked", {
          location: link.closest("footer") ? "footer" : "page",
        });
      }
    },
    true,
  );
})();
