---
id: talker
title: Talker
description: Manages speech and chat functionality for entities, including line-based talking, chatter system, and visual follow-text display.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 87967613
---

# Talker

## Overview
The Talker component handles all speech-related behavior for an entity, including displaying animated dialogue bubbles (via `FollowText`), managing persistent "chatter" messages (used for NPC dialogue and ambient speech), supporting network synchronization, and integrating with the chat system. It is used by both player and NPC characters to say lines, process dialogue scripts, and respond to chatter triggers.

## Dependencies & Tags
- **Components**: Relies on `health` (for death state checks), `sleeper` (for sleep state checks), and `revivablecorpse` (to allow speech from corpses).
- **Tags**: Adds/Removes `"ignoretalking"` tag when `IgnoreAll`/`StopIgnoringAll` is called (master only).
- **Network Fields**: Defines multiple `net_*` fields for chatter state synchronization (`strtbl`, `strid`, `strtime`, `forcetext`, `echotochatpriority`), listening on `"chatterdirty"` event on clients.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed to constructor) | Reference to the entity the component is attached to. |
| `task` | `Task?` | `nil` | Active thread/task ID for the current speech sequence (used to cancel ongoing speech). |
| `ignoring` | `{ [any]: boolean }?` | `nil` | Table of sources that are currently ignored; enables "ignoretalking" tag when non-nil. |
| `mod_str_fn` | `function(string): string?` | `nil` | Optional function to modify spoken strings before display. |
| `offset` | `Vector3?` | `nil` | Static offset for follow-text; overridden by `offset_fn`. |
| `offset_fn` | `function(Entity): Vector3?` | `nil` | Optional function that returns dynamic offset per frame. |
| `disablefollowtext` | `boolean?` | `nil` | If truthy, disables creation of `FollowText` widget. |
| `resolvechatterfn` | `function(inst, strid, strtbl): string?` | `nil` | Optional override for resolving chatter string IDs. |
| `widget` | `FollowText?` | `nil` | Reference to the active follow-text widget instance. |

## Main Functions

### `SetOffsetFn(fn)`
* **Description:** Sets a function that computes the per-frame offset for the follow-text widget relative to the entity. Replaces static `offset`.
* **Parameters:**
  * `fn` (`function(Entity): Vector3`): A callback returning the offset vector for the text display.

### `MakeChatter()`
* **Description:** Initializes the chatter networked state structure (`strtbl`, `strid`, etc.) and sets up the `"chatterdirty"` event listener on non-master clients.
* **Parameters:** None.

### `Chatter(strtbl, strid, time, forcetext, echotochatpriority)`
* **Description:** Triggers a one-time chatter message. For master only; sets chatter state and dispatches `chatterdirty` to clients. If `forcetext` is true, speaks with `noanim=false` and `force=true`.
* **Parameters:**
  * `strtbl` (`string`): Dot-separated path to the localization table (e.g., `"CHATTER.WILSON.HAPPY"`).
  * `strid` (`number?`, default `0`): Index into the resolved table entry; if `0`, uses the table value directly.
  * `time` (`number?`, default `0`): Duration to display the chatter before canceling; if `> 0`, used for `Say`.
  * `forcetext` (`boolean?`): If true, forces speech (ignoring sleep/death/silence state).
  * `echotochatpriority` (`number?`): Priority level (`CHATPRIORITIES.*`) to echo to nearby players' chat; `0` or `nil` disables chat replication.

### `ShutUp()`
* **Description:** Immediately cancels any ongoing speech and clears active chatter state. Hides follow-text and kills pending tasks.

### `Say(script, time, noanim, force, nobroadcast, colour, text_filter_context, original_author_netid, onfinishedlinesfn, sgparam)`
* **Description:** Begins speaking a sequence of lines (string or array of `Line` objects). Handles animation, network broadcast, follow-text display, word filtering, and post-speech events.
* **Parameters:**
  * `script` (`string | Line[]`): Single message string or array of `Line` objects.
  * `time` (`number?`, default `nil`): Duration per line (applies only if `script` is a string).
  * `noanim` (`boolean?`, default `false`): Skip talking animation if true.
  * `force` (`boolean?`, default `false`): Ignore `ignoring` state, dead, or sleeping conditions.
  * `nobroadcast` (`boolean?`, default `false`): Suppress network broadcast of speech (client-side only).
  * `colour` (`{r,g,b,a}?`, default `nil`): Custom RGBA color for the text; falls back to `self.colour`.
  * `text_filter_context` (`number?`, default `nil`): Context for word filtering (e.g., `TEXT_FILTER_CTX_GAME`).
  * `original_author_netid` (`number?`, default `nil`): NetID of the original message author (used for filtering).
  * `onfinishedlinesfn` (`function(Entity)?`, default `nil`): Callback invoked when the last line finishes.
  * `sgparam` (`any?`, default `nil`): Custom state parameter passed to events and callbacks.

### `IgnoreAll(source)`
* **Description:** Adds a source to the ignore list; enables the `"ignoretalking"` tag on master. Subsequent `Say` calls are blocked unless `force=true`.
* **Parameters:**
  * `source` (`any?`, default `self`): Identifier for the ignoring source.

### `StopIgnoringAll(source)`
* **Description:** Removes a source from the ignore list; removes `"ignoretalking"` tag if list is empty. Restores normal speech behavior.
* **Parameters:**
  * `source` (`any?`, default `self`): Identifier for the ignoring source.

## Events & Listeners
- **Listens For:**
  - `"chatterdirty"` — triggers `OnChatterDirty`, which resolves and speaks the chatter string.
- **Emits:**
  - `"ontalk"` — fired when a line is spoken; payload: `{ noanim = boolean, duration = number, sgparam = any }`.
  - `"donetalking"` — fired after the final line completes; payload: none.
  - `TheNet:Talker(...)` — internal network call (not a pushEvent).