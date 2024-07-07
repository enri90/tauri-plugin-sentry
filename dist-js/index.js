import { invoke } from '@tauri-apps/api/core';
import * as Sentry from '@sentry/browser';

//import { BrowserOptions } from "@sentry/browser";
/**
 * A simple `beforeSend` that sends the envelope to the Rust process via Tauri invoke.
 */
async function sendEventToRust(event) {
    // The Sentry Rust type de-serialisation doesn't like these in their
    // current state
    delete event.sdk;
    delete event.breadcrumbs;
    // These will be overridden in the host
    delete event.environment;
    // This isn't in the Rust types
    delete event.sdkProcessingMetadata;
    // We delete the user agent header so Sentry doesn't display guess weird browsers
    if (event?.request?.headers?.["User-Agent"]) {
        delete event.request.headers["User-Agent"];
    }
    await invoke("plugin:sentry|event", { event });
    // Stop events from being sent from the browser
    return null;
}
/**
 * A simple `beforeBreadcrumb` hook that sends the breadcrumb to the Rust process via Tauri invoke.
 */
function sendBreadcrumbToRust(breadcrumb) {
    if (typeof breadcrumb.data?.url === "string" && breadcrumb.data.url.startsWith("ipc://localhost/"))
        return null;
    invoke("plugin:sentry|breadcrumb", { breadcrumb });
    // We don't collect breadcrumbs in the renderer since they are passed to Rust
    return null;
}
window.Sentry = Sentry;
/**
 * Default options for the Sentry browser SDK to pass events and breadcrumbs to
 * the Rust SDK.
 */
Sentry.init({
    // We don't send from the browser but a DSN is required for the SDK to start
    dsn: "https://123456@dummy.dsn/0",
    // We want to track app sessions rather than browser sessions
    autoSessionTracking: false,
    beforeSend: sendEventToRust,
    beforeBreadcrumb: sendBreadcrumbToRust,
    // We replace this with true or false before injecting this code into the browser
    debug: false, //__DEBUG__,
});
console.log("isInitialized", Sentry.isInitialized());

export { sendBreadcrumbToRust, sendEventToRust };
