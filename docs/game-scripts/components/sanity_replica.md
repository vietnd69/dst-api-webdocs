---
id: sanity_replica
title: Sanity Replica
description: Network-replicated component that synchronizes sanity state, mode, and related properties between server and client for player entities.
tags: [network, player, sanity]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: c8a8ac98
system_scope: network
---
# Sanity Replica

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`sanity_replica` is a client-side component that mirrors the server-side `sanity` component for network synchronization. It manages propagated sanity values (e.g., current/max sanity, penalty, mode) for player entities and exposes helper methods for querying and updating these values on both server and client. It coordinates with `player_classified` to transmit networked state and pushes events like `gosane`, `goinsane`, `goenlightened`, and `sanitymodechanged` when transitions occur.

## Usage example
```lua
local inst = TheInput:GetPlayerEntity()
if inst ~= nil and inst.replica.sanity ~= nil then
    local current = inst.replica.sanity:GetCurrent()
    local max = inst.replica.sanity:Max()
    local percent = inst.replica.sanity:GetPercent()
    inst.replica.sanity:SetSanityMode(SANITY_MODE_INSANITY)
end
```

## Dependencies & tags
**Components used:** `player_classified`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_issane` | `net_bool` | `true` | Networked boolean representing whether the player is currently sane. |
| `_isinsanitymode` | `net_bool` | `true` | Networked boolean indicating current sanity mode: `true` for SANITY_MODE_INSANITY, `false` for SANITY_MODE_LUNACY. |
| `_oldissane` | boolean | `true` | Internal cache of previous `_issane` state for detecting transitions. |
| `_oldisinsanitymode` | boolean | `true` | Internal cache of previous `_isinsanitymode` state for detecting transitions. |
| `classified` | `player_classified` component or `nil` | `nil` | Reference to `player_classified` for sending/receiving networked sanity data. |

## Main functions
### `AttachClassified(classified)`
*   **Description:** Attaches to a `player_classified` component, subscribes to relevant network dirty events, and performs initial event triggers to synchronize local state.
*   **Parameters:** `classified` (`player_classified`) — The `player_classified` component to attach to.
*   **Returns:** Nothing.

### `DetachClassified()`
*   **Description:** Detaches from the attached `player_classified`, removing event callbacks and clearing the reference.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetCurrent(current)`
*   **Description:** Sets the current sanity value on the `player_classified`, syncing it to the server.
*   **Parameters:** `current` (number) — The new current sanity value.
*   **Returns:** Nothing.
*   **Error states:** No-op if `classified` is `nil`.

### `SetMax(max)`
*   **Description:** Sets the maximum sanity value on the `player_classified`, syncing it to the server.
*   **Parameters:** `max` (number) — The new maximum sanity value.
*   **Returns:** Nothing.
*   **Error states:** No-op if `classified` is `nil`.

### `SetPenalty(penalty)`
*   **Description:** Sets the sanity penalty (0–1) on the `player_classified`, clamped and scaled to an integer (×200) for network efficiency.
*   **Parameters:** `penalty` (number) — Sanity penalty fraction, must be between `0` and `1` inclusive.
*   **Returns:** Nothing.
*   **Error states:** Asserts if `penalty` is outside `[0, 1]`; no-op if `classified` is `nil`.

### `Max()`
*   **Description:** Returns the current maximum sanity value, preferring the local `sanity` component on the server, then the networked `player_classified` value, otherwise defaulting to `100`.
*   **Parameters:** None.
*   **Returns:** `number` — The current maximum sanity.

### `MaxWithPenalty()`
*   **Description:** Returns the effective maximum sanity after applying penalty, computed using local or networked values as appropriate.
*   **Parameters:** None.
*   **Returns:** `number` — The effective maximum sanity.

### `GetPercent()`
*   **Description:** Returns the current sanity as a fraction (`0`–`1`). Uses server `sanity:GetPercent()` on the server, otherwise uses networked values.
*   **Parameters:** None.
*   **Returns:** `number` — Current sanity percentage.

### `GetPercentNetworked()`
*   **Description:** Returns sanity percentage using only networked values, regardless of simulation role.
*   **Parameters:** None.
*   **Returns:** `number` — Current sanity percentage computed from `currentsanity / maxsanity`.

### `GetCurrent()`
*   **Description:** Returns the current sanity value, preferring the local `sanity` component, then networked values.
*   **Parameters:** None.
*   **Returns:** `number` — Current sanity.

### `GetPercentWithPenalty()`
*   **Description:** Returns the current sanity percentage relative to the *penalized* maximum.
*   **Parameters:** None.
*   **Returns:** `number` — Percent relative to penalized max.

### `GetPenaltyPercent()`
*   **Description:** Returns the current sanity penalty fraction (e.g., `0.25` for 25% penalty), using local or networked values.
*   **Parameters:** None.
*   **Returns:** `number` — Penalty as a fraction.

### `SetRateScale(ratescale)`
*   **Description:** Sets the sanity regeneration/drain rate scale on the `player_classified`.
*   **Parameters:** `ratescale` (number) — Rate multiplier (e.g., `RATE_SCALE.NEUTRAL`).
*   **Returns:** Nothing.
*   **Error states:** No-op if `classified` is `nil`.

### `GetRateScale()`
*   **Description:** Returns the current sanity rate scale, using local or networked values.
*   **Parameters:** None.
*   **Returns:** `number` — Rate scale value.

### `SetSanityMode(mode)`
*   **Description:** Sets the sanity mode (`SANITY_MODE_INSANITY` or `SANITY_MODE_LUNACY`) on the networked boolean.
*   **Parameters:** `mode` (string) — Expected values: `"insanity"` or `"lunacy"` constants.
*   **Returns:** Nothing.

### `SetIsSane(sane)`
*   **Description:** Sets whether the player is currently sane (`true`) or insane (`false`).
*   **Parameters:** `sane` (boolean) — The desired sane state.
*   **Returns:** Nothing.

### `IsSane()`
*   **Description:** Returns `true` if the player is considered sane.
*   **Parameters:** None.
*   **Returns:** `boolean` — Whether the player is sane.

### `IsInsane()`
*   **Description:** Returns `true` if the player is in Insanity mode *and* is not sane.
*   **Parameters:** None.
*   **Returns:** `boolean` — Whether the player is insane.

### `IsEnlightened()`
*   **Description:** Returns `true` if the player is in Lunacy mode *and* is not sane (i.e., enlightened).
*   **Parameters:** None.
*   **Returns:** `boolean` — Whether the player is enlightened.

### `IsCrazy()`
*   **Description:** Deprecated alias for `IsInsane()`.
*   **Parameters:** None.
*   **Returns:** `boolean` — Whether the player is insane.

### `GetSanityMode()`
*   **Description:** Returns the current sanity mode as a string constant.
*   **Parameters:** None.
*   **Returns:** `string` — Either `SANITY_MODE_INSANITY` or `SANITY_MODE_LUNACY`.

### `IsInsanityMode()`
*   **Description:** Returns `true` if the current mode is Insanity.
*   **Parameters:** None.
*   **Returns:** `boolean` — Whether the mode is Insanity.

### `IsLunacyMode()`
*   **Description:** Returns `true` if the current mode is Lunacy.
*   **Parameters:** None.
*   **Returns:** `boolean` — Whether the mode is Lunacy.

### `SetGhostDrainMult(ghostdrainmult)`
*   **Description:** Sets the ghost drain flag on the `player_classified`.
*   **Parameters:** `ghostdrainmult` (number) — If `> 0`, ghost drain is enabled.
*   **Returns:** Nothing.
*   **Error states:** No-op if `classified` is `nil`.

### `IsGhostDrain()`
*   **Description:** Returns whether ghost drain is currently active.
*   **Parameters:** None.
*   **Returns:** `boolean` — Whether ghost drain is active.

## Events & listeners
- **Listens to:** `issanedirty`, `isinsanitymodedirty`, `onremove` — Used internally to trigger event callbacks during state transitions and detachment.
- **Pushes:** `gosane`, `goinsane`, `goenlightened`, `sanitymodechanged`, `sanitydirty` — Fired on state transitions or when attached classified is updated.
