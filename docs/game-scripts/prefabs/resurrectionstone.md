---
id: resurrectionstone
title: Resurrectionstone
description: Manages the resurrection stone's lifecycle, including charging, haunt-based activation, light effects, and networked ID assignment for touchstone functionality.
tags: [world, entity, network]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c39ec531
system_scope: world
---

# Resurrectionstone

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `resurrectionstone` prefab implements the game's touchstone mechanism—a renewable item that allows ghosts to resurrect living players. It integrates multiple components: `cooldown` (for reuse delays), `hauntable` (for haunt-based activation), `lootdropper` (for salvage rewards), `inspectable` (for UI tracking), and `pointofinterest` (for minimap visibility). It features server-side logic (ID assignment, loot, haunt handling) and client-side visual effects (light FX synchronized with player ghost vision state).

## Usage example
```lua
local stone = Prefab("resurrectionstone", fn, assets, prefabs)
local inst = stone()
inst.components.cooldown:StartCharging() -- Manually trigger cooldown start
inst:PushEvent("activateresurrection", { guy = someplayer }) -- Activate resurrection for a player
```

## Dependencies & tags
**Components used:**  
- `cooldown` — manages charge/ready states and callbacks (`onchargedfn`, `startchargingfn`)  
- `hauntable` — handles haunt attempts and sets haunt value (`HAUNT_INSTANT_REZ`)  
- `lootdropper` — defines loot table and drops upon activation  
- `inspectable` — records view statistics  
- `pointofinterest` — sets minimap height (client-only)  

**Tags:**  
Adds `resurrector` and `antlion_sinkhole_blocker` to the entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_touchstoneid` | `net_smallbyte` | `1..` | Networked ID for identification (server-assigned, starts at 1). |
| `_enablelights` | `net_bool` | `true` | Controls light FX enablement and entity sleep/wake callbacks (client-only). |
| `_task` | `GOSTask` or `nil` | `nil` | Handles timeout for interrupted resurrection (haunt failsafe). |
| `_lightplayer` | `entity` or `nil` | `nil` | Reference to the player whose ghost vision triggers light FX. |
| `_lighttask` | `GOSTask` or `nil` | `nil` | Tasks for staggered light FX generation (client-only). |
| `_lightfx` | `entity` or `nil` | `nil` | FX entity instance for particle effects (client-only). |

## Main functions
### `SetTouchStoneID(inst, id)`
* **Description:** Assigns a unique networked ID to the stone if not already set, prevents duplicates, and prints warnings for errors.
* **Parameters:** `id` (number) — ID value to assign.
* **Returns:** Nothing.
* **Error states:** If `id <= 0` or duplicate, prints diagnostic message.

### `GetTouchStoneID(inst)`
* **Description:** Returns the current networked ID value.
* **Parameters:** None.
* **Returns:** number — the `_touchstoneid` value.

### `OnCharged(inst)`
* **Description:** Executed when cooldown completes (via `cooldown.onchargedfn`). Re-enables interaction and restores animation.
* **Parameters:** `inst` — the stone entity.
* **Returns:** Nothing.
* **Error states:** Early return if animation is not `"idle_off"`. Reschedules charging if another entity is blocking (e.g., player on top).

### `OnHaunt(inst, haunter)`
* **Description:** Callback for haunt attempts (`hauntable.onhaunt`). Initiates resurrection if conditions are met.
* **Parameters:** `haunter` (entity) — the ghost attempting to use the stone.
* **Returns:** `true` if haunt succeeded and resurrection starts; `nil` otherwise.
* **Error states:** Fails if `_task` is already set, haunter lacks `CanUseTouchStone`, or stone is not in `"idle_activate"` animation.

### `OnActivateResurrection(inst, guy)`
* **Description:** Executes upon successful haunt; triggers lightning FX, sound, loot drop, resets cooldown, and notifies the player.
* **Parameters:** `guy` (entity) — the player resurrected.
* **Returns:** Nothing.

### `CreateLight(parent)`
* **Description:** (Client-only) Spawns a non-networked FX entity that syncs with parent stone animation.
* **Parameters:** `parent` (entity) — the stone instance.
* **Returns:** entity — the FX entity with animation and bloom settings.

### `EndLight(inst)`
* **Description:** (Client-only) Marks light FX entity for removal (called via `inst.EndLight()` method).
* **Parameters:** `inst` — the FX entity.
* **Returns:** Nothing.

### `TryRandomLightFX(inst)`
* **Description:** (Client-only) Randomly spawns light FX if the assigned `_lightplayer` is able to use the touchstone and the stone animation is active.
* **Parameters:** `inst` — the stone entity.
* **Returns:** Nothing.

### `OnEnableLightsDirty(inst)`
* **Description:** (Client-only) Toggles light FX enablement and attach/detach sleep/wake callbacks based on `_enablelights` state.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetupLights(inst)`
* **Description:** (Client-only) Initializes player activation/deactivation listeners and sets up ghost vision callback for light FX.
* **Parameters:** `inst` — the stone entity.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `animover` (local callback `OnAnimOver`) — triggers hauntable component registration after activation animation completes.  
  - `activateresurrection` (local callback `OnActivateResurrection`) — activates resurrection for a specific player.  
  - `playeractivated`, `playerdeactivated` (server/world events) — used to track active light player.  
  - `ghostvision` (local callback via `_onghostvision`) — monitors light player’s ghost vision state for FX control.  
  - `enablelightsdirty` (local callback `OnEnableLightsDirty`) — internal signal for light FX enablement toggling.  

- **Pushes:**  
  - `"ms_sendlightningstrike"` — fires on resurrection activation to trigger world-wide lighting FX.  
  - No custom entity events are pushed; only engine events are fired via `TheWorld:PushEvent(...)`.