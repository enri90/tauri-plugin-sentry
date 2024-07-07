import { Breadcrumb, Event, ErrorEvent } from "@sentry/types";
import * as Sentry from "@sentry/browser";
/** @ignore */
declare global {
    interface Window {
        Sentry: typeof Sentry;
    }
}
/**
 * A simple `beforeSend` that sends the envelope to the Rust process via Tauri invoke.
 */
declare function sendEventToRust(event: Event): Promise<ErrorEvent | null>;
/**
 * A simple `beforeBreadcrumb` hook that sends the breadcrumb to the Rust process via Tauri invoke.
 */
declare function sendBreadcrumbToRust(breadcrumb: Breadcrumb): Breadcrumb | null;
export type { Breadcrumb, Event, ErrorEvent };
export { sendEventToRust, sendBreadcrumbToRust };
