---
id: vaultmusiclistener
title: Vaultmusiclistener
description: Triggers a one-time vault event when the entity remains stationary inside a vault area for 3.5 seconds without entering another vault.
tags: [audio, environment, vault]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 179bad17
system_scope: environment
---

# Vaultmusiclistener

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Vaultmusiclistener` is an environment-aware component that detects when an entity is inside a vault area and remains there long enough to trigger a vault-specific event. It listens for map area changes, tracks time spent in vault zones, and fires a `triggeredevent` with the name `"vault"` after a short grace period. It stops activity upon leaving vault zones or if music is not required.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("vaultmusiclistener")
-- The component activates automatically on `changearea` events,
-- no manual interaction required after addition.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `delay` | number? | `nil` | Countdown timer in seconds. Non-`nil` indicates active countdown; `nil` indicates stopped. |

## Main functions
### `IsMusicPlaying()`
* **Description:** Returns whether the component is currently in an active countdown state (i.e., waiting to trigger the vault event).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `self.delay` is not `nil`, otherwise `false`.

### `StartVaultMusic()`
* **Description:** Begins the 3.5-second countdown to trigger the vault event, starting entity updates for the component.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if already active (`self.delay` is non-`nil`).

### `StopVaultMusic()`
* **Description:** Cancels any ongoing countdown and stops entity updates for the component.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if not active (`self.delay` is `nil`).

### `OnUpdate(dt)`
* **Description:** Callback invoked each frame during active countdown. Decrements the internal timer and fires the vault event when elapsed.
* **Parameters:** `dt` (number) — time elapsed since last frame in seconds.
* **Returns:** Nothing.
* **Error states:** After the initial countdown (`3.5` seconds) elapses, the component sets `self.delay = 1` and pushes the event; it does not stop updating automatically here, relying on external logic to re-check area changes.

## Events & listeners
- **Listens to:** `changearea` — invokes `OnChangeArea` on map region changes to start/stop vault detection.
- **Pushes:** `triggeredevent` — fires with payload `{ name = "vault", duration = 5 }` after remaining in a vault for ~3.5 seconds.

## Notes
- This component relies on the `TheWorld.Map:IsPointInAnyVault(position)` check for precise zone determination, and uses `"Vault_Vault"` area ID detection as a secondary heuristic.
- It does not manage music playback itself; the name `vaultmusiclistener` is conventional—its actual purpose is to signal event triggering for *other* systems to act upon.
