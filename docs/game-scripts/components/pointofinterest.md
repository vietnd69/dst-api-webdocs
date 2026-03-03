---
id: pointofinterest
title: Pointofinterest
description: Manages visual indicators (HUD and world-space) for points of interest tied to entities, particularly when they are unlocked in the scrapbook and visible to the player.
tags: [hud, world, indicator, scrapbook]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d389d560
system_scope: hud
---
# Pointofinterest

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Pointofinterest` is an entity component responsible for displaying visual and HUD indicators for special entities (points of interest) based on scrapbook progression and player proximity. It manages both in-world marker entities (e.g., a stand and pulsing marker) and HUD target indicators, updating them each frame while the entity is active and within valid conditions. It relies on scrapbook data from `TheScrapbookPartitions` and scrapbook settings (`Profile:GetPOIDisplay()`) to determine visibility and behavior.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("pointofinterest")
inst.components.pointofinterest:SetShouldShowFn(function() return true end)
inst.components.pointofinterest:SetHeight(0.5)
-- The component automatically starts updating when conditions are met (e.g., scrapbook level >= 2).
```

## Dependencies & tags
**Components used:** None (does not access other components directly).  
**Tags added by component behavior:** Checks `inst:HasTag("CLASSIFIED")`, `inst:HasTag("NOCLICK")`, `inst:HasTag("FX")` on indicator entities (via `_CommonIndicator`).  
**External modules:** Requires `screens/redux/scrapbookdata.lua` (`SCRAPBOOK_DATA_SET`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GEntity` | `nil` | Reference to the entity this component is attached to (set in constructor). |
| `_showinghud` | `boolean` | `nil` | Tracks whether the HUD indicator is currently active. |
| `shouldshowfn` | `function?` | `nil` | Optional predicate function taking `inst` to determine if the HUD indicator should be shown. |
| `_updating` | `boolean` | `false` | Whether the component is actively updated each frame. |
| `height` | `number` | `0` | Vertical offset (Y) for world indicators (used in `FollowSymbol`). |
| `stand`, `marker`, `ring1`, `ring2` | `GEntity?` | `nil` | Runtime-created indicator entities. |

## Main functions
### `TryStartUpdating()`
* **Description:** Begins updating this component if the associated entity is present in the scrapbook and its discovery level is less than 2. Internally calls `inst:StartUpdatingComponent(self)` to enable `OnUpdate`.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetShouldShowFn(fn)`
* **Description:** Sets the optional predicate function used to decide whether the HUD indicator should be displayed (e.g., only if the point of interest is in scope).
* **Parameters:** `fn` (`function`) — function taking `inst` as argument, returning `true` or `false`.
* **Returns:** Nothing.

### `SetHeight(height)`
* **Description:** Sets the vertical offset (in world units) used when positioning the `marker` relative to the `stand`.
* **Parameters:** `height` (`number`) — vertical offset in world space.
* **Returns:** Nothing.

### `CreateWorldIndicator()`
* **Description:** Spawns and positions in-world indicator entities (`stand` and `marker`) as children of `self.inst`. Used to visually mark the point of interest in the world when applicable.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Returns early if `self.stand` or `self._removing` is already set.

### `TriggerPulse()`
* **Description:** Initiates a visual removal pulse sequence: plays a sound, plays the `dark` animation on the marker, and prepares to animate rings expanding outward.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Returns early if `self.marker` is `nil`.

### `TriggerRemove()`
* **Description:** Initiates full removal of the indicator: removes the HUD indicator, triggers the pulse sequence, and begins cleanup.
* **Parameters:** None.
* **Returns:** Nothing.

### `RemoveEverything()`
* **Description:** Removes all created indicator entities (`stand`, `marker`, `ring1`, `ring2`), stops component updates, and resets internal state.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Frame-by-frame logic that controls HUD visibility, world indicator creation/removal, and removal animation. Handles updates when the player is near and the scrapbook condition is met.
* **Parameters:** `dt` (`number`) — delta time in seconds since the last frame.
* **Returns:** Nothing.

### `OnRemoveEntity()`
* **Description:** Cleanup method called when the owning entity is removed. Removes HUD and world indicators and stops updates.
* **Parameters:** None.
* **Returns:** Nothing.

### `DebugForceShowIndicator()`
* **Description:** Forces display of the world indicator and ensures component updates continue, regardless of scrapbook state. Intended for debugging.
* **Parameters:** None.
* **Returns:** Nothing.

### `UpdateRing(ring, dt)`
* **Description:** Helper function that updates a single ring entity: scales it up, fades it out, and removes it once `scale > 2`.
* **Parameters:** 
  * `ring` (`GEntity?`) — the ring entity to update.
  * `dt` (`number`) — delta time.
* **Returns:** Nothing.

### `UpdateRemovePulse(dt)`
* **Description:** Animates the marker contraction and ring expansions during the removal sequence (loops twice, then triggers cleanup).
* **Parameters:** `dt` (`number`) — delta time.
* **Returns:** Nothing.

### `ShouldShowHudIndicator(distsq)`
* **Description:** Determines if the HUD indicator should be shown based on player distance (squared).
* **Parameters:** `distsq` (`number`) — squared distance from the player to the point of interest.
* **Returns:** `true` if `TUNING.MIN_INDICATOR_RANGE <= distance <= TUNING.MAX_INDICATOR_RANGE`, else `false`.

## Events & listeners
- **Listens to:** None explicitly (does not call `inst:ListenForEvent`).
- **Pushes:** None (does not call `inst:PushEvent`).
- **State changes triggered by events:** `OnEntitySleep` and `OnEntityWake` (called automatically when the owning entity sleeps/wakes in the world).
