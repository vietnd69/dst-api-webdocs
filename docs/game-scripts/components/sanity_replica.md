---
id: sanity_replica
title: Sanity Replica
description: This component synchronizes sanity state and related properties across networked clients in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: c8a8ac98
---

# Sanity Replica

## Overview
The `sanity_replica` component acts as a network-aware proxy for a player entity’s sanity state. It holds synchronized boolean flags (`_issane`, `_isinsanitymode`) and interacts with the `player_classified` component to reflect current, max, penalty, rate scale, and ghost drain behavior for sanity across the server and clients. It does not compute sanity directly but replicates changes and exposes read/write interfaces to keep local and remote states consistent.

## Dependencies & Tags
- `net_bool`: Used to declare networked boolean fields.
- Relies on the presence of `inst.player_classified` component (typically `PlayerClassified`) for networked sanity values.
- Adds no permanent tags; listens for `"onremove"` events from the `player_classified` instance during attachment.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed in) | The entity the component is attached to. |
| `_oldissane` | `boolean` | `true` | Tracks previous `_issane` state to detect transitions. |
| `_oldisinsanitymode` | `boolean` | `true` | Tracks previous `_isinsanitymode` state to detect transitions. |
| `_issane` | `net_bool` | `nil` | Networked boolean indicating whether the player is currently "sane". |
| `_isinsanitymode` | `net_bool` | `nil` | Networked boolean indicating whether the player is in SANITY_MODE_INSANITY (`true`) or SANITY_MODE_LUNACY (`false`). |
| `classified` | `Component?` | `nil` | Reference to the `player_classified` component; may be `nil` on non-mastersim until attached. |
| `ondetachclassified` | `function?` | `nil` | Callback handler for `"onremove"` event on the classified component. |

## Main Functions

### `AttachClassified(classified)`
* **Description:** Associates the component with a `player_classified` instance, sets up event listeners for sanity state changes, and triggers initial updates.
* **Parameters:** `classified` — The `PlayerClassified` component instance to attach.

### `DetachClassified()`
* **Description:** Removes the reference to `player_classified`, and unregisters the `"issanedirty"` and `"isinsanitymodedirty"` event listeners.

### `SetCurrent(current)`
* **Description:** Updates the networked current sanity value in `player_classified`.
* **Parameters:** `current` — New current sanity value (must be compatible with the target `net_float` field).

### `SetMax(max)`
* **Description:** Updates the networked max sanity value in `player_classified`.
* **Parameters:** `max` — New max sanity value.

### `SetPenalty(penalty)`
* **Description:** Sets the sanity penalty as a fractional value (0–1), converting to an internal 0–200 scale for network sync.
* **Parameters:** `penalty` — A number between 0 and 1 inclusive. Throws an assertion if out of range.

### `Max()`
* **Description:** Returns the current max sanity, preferring the server-side `sanity` component if available; otherwise falls back to the networked value or defaults to `100`.
* **Return Value:** `number` — The maximum sanity value.

### `MaxWithPenalty()`
* **Description:** Returns the effective max sanity after applying the current penalty multiplier.
* **Return Value:** `number` — The max sanity adjusted for penalties.

### `GetPercent()`
* **Description:** Returns current sanity as a fraction of max sanity. Uses the server-side `sanity` component on the server; otherwise falls back to networked values on clients.
* **Return Value:** `number` — A value in [0, 1].

### `GetPercentNetworked()`
* **Description:** Returns current sanity as a fraction of max sanity *strictly from networked values*, regardless of simulation role.
* **Return Value:** `number` — A value in [0, 1] (defaults to `1` if no classified component exists).

### `GetCurrent()`
* **Description:** Returns current sanity from the server-side component if present; otherwise returns the networked value.
* **Return Value:** `number` — Current sanity value.

### `GetPercentWithPenalty()`
* **Description:** Returns current sanity as a fraction of *penalty-adjusted* max sanity.
* **Return Value:** `number` — A value in [0, 1] (defaults to `1` if no classified component exists).

### `GetPenaltyPercent()`
* **Description:** Returns the active sanity penalty as a fractional value (0–1).
* **Return Value:** `number` — Penalty value in [0, 1] (defaults to `0` if no classified component exists).

### `SetRateScale(ratescale)`
* **Description:** Updates the networked sanity drain/gain rate scale.
* **Parameters:** `ratescale` — A numeric rate multiplier (e.g., `RATE_SCALE.SPEEDY`, `RATE_SCALE.SLOW`).

### `GetRateScale()`
* **Description:** Returns the current rate scale from the server-side component if available; otherwise returns the networked value.
* **Return Value:** `number` — Rate scale constant.

### `SetSanityMode(mode)`
* **Description:** Sets the sanity mode to either `SANITY_MODE_INSANITY` or `SANITY_MODE_LUNACY` by toggling the `_isinsanitymode` net_bool.
* **Parameters:** `mode` — One of the SANITY_MODE_* constants.

### `SetIsSane(sane)`
* **Description:** Updates the `_issane` net_bool to reflect whether the player is currently sane.
* **Parameters:** `sane` — Boolean.

### `IsSane()`
* **Description:** Returns true if the player is in a sane state.
* **Return Value:** `boolean`

### `IsInsane()`
* **Description:** Returns true if the player is in sanity mode *and* not sane (i.e., in active insanity).
* **Return Value:** `boolean`

### `IsEnlightened()`
* **Description:** Returns true if the player is in lunacy mode *and* not sane.
* **Return Value:** `boolean`

### `IsCrazy()`
* **Description:** Deprecated alias for `IsInsane()`.
* **Return Value:** `boolean`

### `GetSanityMode()`
* **Description:** Returns the current sanity mode constant (`SANITY_MODE_INSANITY` or `SANITY_MODE_LUNACY`).
* **Return Value:** `number` — Constant representing the mode.

### `IsInsanityMode()`
* **Description:** Returns true if the player is in INSANITY mode.
* **Return Value:** `boolean`

### `IsLunacyMode()`
* **Description:** Returns true if the player is in LUNACY mode.
* **Return Value:** `boolean`

### `SetGhostDrainMult(ghostdrainmult)`
* **Description:** Sets whether ghost sanity drain is active based on the multiplier.
* **Parameters:** `ghostdrainmult` — Number; if > 0, ghost drain is enabled.

### `IsGhostDrain()`
* **Description:** Returns whether ghost sanity drain is active.
* **Return Value:** `boolean`

## Events & Listeners
- Listens for:
  - `"issanedirty"` — Triggers transition events (`gosane`, `goinsane`, `goenlightened`) and updates `_oldissane`.
  - `"isinsanitymodedirty"` — Triggers `sanitymodechanged`, additional transitions, and `"sanitydirty"` on `player_classified` if attached.
  - `"onremove"` — On the attached `player_classified` instance; triggers detachment.
- Pushes:
  - `"gosane"`, `"goinsane"`, `"goenlightened"` — On sanity mode/sane state transitions.
  - `"sanitymodechanged"` — With event data `{mode = bool}` when the sanity mode flips.
  - `"sanitydirty"` — On the `player_classified` component to force client-side updates.