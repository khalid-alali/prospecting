# PostHog setup report

Static HTML site (not Next.js). Single shared snippet: `posthog.js` on every page. Custom conversion events live in `posthog.js` + `intake-modal.js`.

The wizard CLI outro incorrectly described a Next.js App Router install. Ignore that summary. There is no Next.js app, no `instrumentation-client`, and no env-based client init. `.env` is gitignored and unused by the static site — the project token is set in `posthog.js`.

## Canonical events

| Event | Description | Source |
|---|---|---|
| `$pageview` / autocapture | Automatic pageviews + clicks | `posthog.js` init |
| `service_viewed` | Service / use-case page visit | `posthog.js` |
| `booking_started` | Assessment CTA (intake modal or mailto) | `posthog.js` |
| `email_clicked` | Any mailto click | `posthog.js` |
| `phone_clicked` | Any tel click | `posthog.js` |
| `contact_form_started` | Intake modal opened | `intake-modal.js` |
| `contact_form_submitted` | Intake form succeeded | `intake-modal.js` |
| `booking_completed` | Form success or `/thank-you` | both |

## Wizard aliases (no conflict)

Also fired so wizard dashboard/insights keep working if they used the CLI names:

| Alias | Mirrors |
|---|---|
| `assessment_cta_clicked` | `booking_started` |
| `assessment_form_submitted` | `contact_form_submitted` |

Use the **canonical** names for new funnels. Prefer one name per funnel step (don’t stack alias + canonical as separate steps).

## Recommended funnel

1. `$pageview` — visited site  
2. `service_viewed` — viewed service  
3. `booking_started` **or** `contact_form_started` — started contact/booking  
4. `contact_form_submitted` **or** `booking_completed` — submitted  

## Wizard links

- [Dashboard](https://us.posthog.com/project/529314/dashboard/1907967)
- [Notebook](https://us.posthog.com/project/529314/notebooks/e599Luz8)
- Assessment CTA insight: https://us.posthog.com/project/529314/insights/2TP9mbeC
- Assessment funnel: https://us.posthog.com/project/529314/insights/onZqeD4j
- Service page views: https://us.posthog.com/project/529314/insights/n21IsIM4
- Completed bookings: https://us.posthog.com/project/529314/insights/I42N1kcD

## Verify

- [ ] Deploy and load the live site (not `file://`)
- [ ] Confirm `$pageview` and a CTA click appear in Live events
- [ ] Confirm wizard dashboard insights receive data (aliases cover CLI names)
