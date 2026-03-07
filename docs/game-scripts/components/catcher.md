---
id: catcher
title: Catcher
description: Manages the ability to catch thrown projectiles based on proximity and state.
tags: [combat, projectile, state, interaction]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: bd95b072
system_scope: combat
---

# Catcher

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Catcher` component enables an entity to detect and intercept thrown projectiles within designated distance thresholds. It works in tandem with the `Projectile` component—specifically by invoking `Projectile:Catch()` when a projectile meets proximity and state conditions. This component is typically attached to characters or NPCs capable of blocking or snagging projectiles mid-flight.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("catcher")
inst.components.catcher:SetEnabled(true)
inst.components.catcher:SetActionDistance(12)
inst.components.catcher:SetCatchDistance(2)
inst.components.catcher:StartWatching(projectile_entity)
```

## Dependencies & tags
**Components used:** `projectile` (via `projectile:IsThrown()` and `projectile:Catch(catcher)`)
**Tags:** Adds `cancatch` when catch conditions are met (see `canact` logic); removes `cancatch` on removal from entity or when no longer valid.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | boolean | `true` | Whether the catcher is active and can process catch attempts. |
| `actiondistance` | number | `12` | Max distance at which the catch action UI appears (proximity threshold). |
| `catchdistance` | number | `2` | Max distance at which a projectile is actually caught (interception threshold). |
| `canact` | boolean | `false` | Whether the catcher is currently within range to initiate a catch action. |
| `watchlist` | table | `{}` | Set of projectiles (as keys) this component is monitoring for catching. |

## Main functions
### `SetEnabled(enable)`
* **Description:** Enables or disables the catcher. Disabling also cancels any ongoing catch action and forces `canact` to `false`.
* **Parameters:** `enable` (boolean) — whether to activate the catcher.
* **Returns:** Nothing.

### `SetActionDistance(dist)`
* **Description:** Sets the distance at which the catch action becomes available (e.g., for UI/hint display).
* **Parameters:** `dist` (number) — new proximity threshold in world units.
* **Returns:** Nothing.

### `SetCatchDistance(dist)`
* **Description:** Sets the distance at which a projectile is physically intercepted.
* **Parameters:** `dist` (number) — new catch radius in world units.
* **Returns:** Nothing.

### `StartWatching(projectile)`
* **Description:** Begins monitoring a projectile for potential catching.
* **Parameters:** `projectile` (Entity) — the projectile instance to watch (must have a `projectile` component).
* **Returns:** Nothing.
* **Error states:** If the projectile is invalid or lacks a `projectile` component, it is removed during the next `OnUpdate` cycle.

### `StopWatching(projectile)`
* **Description:** Stops monitoring a projectile and cleans up if no projectiles remain in `watchlist`.
* **Parameters:** `projectile` (Entity) — the projectile instance to stop watching.
* **Returns:** Nothing.

### `CanCatch()`
* **Description:** Returns whether the catcher is in a valid state to attempt catching (i.e., projectiles are being watched *and* `canact` is `true`).
* **Parameters:** None.
* **Returns:** boolean — `true` if at least one projectile is watchable and the catcher is within range; otherwise `false`.

### `OnUpdate()`
* **Description:** Main update loop that checks projectiles in `watchlist`, handles removal of invalid projectiles, evaluates catch readiness, triggers catch events, and updates the `canact` flag.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does nothing if the owner entity is no longer valid (`not self.inst:IsValid()`).

## Events & listeners
- **Listens to:** None (no direct `inst:ListenForEvent` calls).
- **Pushes:**
  - `catch` (data: `{ projectile = ProjectileEntity }`) — fired when a projectile is successfully caught.
  - `caught` (data: `{ catcher = Entity }`) — pushed on the projectile entity when caught.
  - `cancelcatch` — fired if catching is disabled while in the `readytocatch` state.
  - Internal `cancatch` tag updates via `inst:AddTag("cancatch")` / `inst:RemoveTag("cancatch")`.
