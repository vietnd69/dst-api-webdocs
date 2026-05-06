---
id: spawnfader
title: Spawnfader
description: Controls entity visibility fade-in and fade-out animations using colour multiplication.
tags: [fx, animation, network]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: 6edc333a
system_scope: entity
---

# SpawnFader

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`SpawnFader` manages smooth visibility transitions for entities by animating the `AnimState` colour multiplier from transparent to opaque (fade in) or opaque to transparent (fade out). It uses netvars to synchronize fade state between master and clients, with dirty event listeners handling client-side updates. The component adds the `NOCLICK` tag during fading to prevent player interaction, and pushes completion events when the fade finishes.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("spawnfader")

-- Fade in (entity becomes visible)
inst.components.spawnfader:FadeIn()

-- Fade out (entity becomes invisible)
inst.components.spawnfader:FadeOut()

-- Cancel ongoing fade
inst.components.spawnfader:Cancel()
```

## Dependencies & tags
**Components used:**
- `AnimState` -- applies colour multiplication for fade effect via `OverrideMultColour`
**Tags:**
- `NOCLICK` -- added when fading starts, removed on master when fade-in completes

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | --- | The owning entity instance. |
| `_fade` | net_tinybyte | --- | Fade progress value (0-7 scale). Dirty event: `fadedirty`. Synced to clients. |
| `_fadeout` | net_bool | --- | Direction flag: `true` = fading out, `false` = fading in. |
| `fadeval` | number | `0` | Current fade progress (0 to 1). Used for animation interpolation. |
| `updating` | boolean | `false` | Whether the component is currently running its update loop. |

## Main functions
### `FadeIn()`
*   **Description:** Starts a fade-in animation, making the entity gradually visible. Sets fade direction to inward and initiates the update loop.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** Errors if `self.inst.AnimState` is nil when `OnUpdate` calls `OverrideMultColour` (no nil guard present).

### `FadeOut()`
*   **Description:** Starts a fade-out animation, making the entity gradually invisible. Sets fade direction to outward and initiates the update loop.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** Errors if `self.inst.AnimState` is nil when `OnUpdate` calls `OverrideMultColour` (no nil guard present).

### `Cancel()`
*   **Description:** Cancels any ongoing fade animation. Resets `fadeval` to 0 and triggers an immediate update to apply the cancellation.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** Errors if `self.inst.AnimState` is nil (no nil guard in `OnUpdate` called by `Cancel`).

### `OnUpdate(dt)`
*   **Description:** **Update loop.** Decrements `fadeval` by `dt` each frame and applies colour multiplication to the entity's `AnimState`. Behavior depends on `_fadeout` direction: fading out uses inverse quadratic interpolation (`k = 1 - k*k`) and pushes `spawnfaderout` event; fading in uses quadratic interpolation (`k = 1 - fadeval*fadeval`), pushes `spawnfaderin` event, and removes `NOCLICK` tag on master when complete. When `fadeval` reaches 0, stops updating.
*   **Parameters:**
    - `dt` -- number, delta time in frames
*   **Returns:** nil
*   **Error states:** Errors if `self.inst.AnimState` is nil — calls `OverrideMultColour` without nil guard. Errors if `self.inst.highlightchildren` exists but contains entities without `AnimState` component.

### `OnRemoveFromEntity()`
*   **Description:** Cleanup handler called when component is removed from entity. Removes event listeners on client to prevent dangling callbacks.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None

### `OnFadeDirty(inst)` (local)
*   **Description:** **Property watcher callback.** Fires when `_fade` netvar changes on client. Converts netvar value (0-7 scale) to `fadeval` (0-1 scale) and starts the update loop if not already updating.
*   **Parameters:**
    - `inst` -- entity instance
*   **Returns:** nil
*   **Error states:** None

### `OnDeath(inst)` (local)
*   **Description:** **Event listener callback.** Fires when entity dies. Cancels any ongoing fade animation to prevent orphaned update loops.
*   **Parameters:**
    - `inst` -- entity instance
*   **Returns:** nil
*   **Error states:** None

## Events & listeners
- **Listens to:**
  - `fadedirty` (client only) — triggers `OnFadeDirty`; syncs fade value from master
  - `death` (client only) — triggers `OnDeath`; cancels ongoing fade
- **Pushes:**
  - `spawnfaderout` — fired when fade-out animation completes (`fadeval` reaches 0 while fading out). Data: none
  - `spawnfaderin` — fired when fade-in animation completes (`fadeval` reaches 0 while fading in). Data: none