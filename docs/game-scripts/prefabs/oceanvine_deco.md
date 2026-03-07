---
id: oceanvine_deco
title: Oceanvine Deco
description: A decorative, non-interactive foliage prop used in ocean/vine environments that fades based on distance and contributes no gameplay functionality.
tags: [decoration, environment, visual]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 08e68963
system_scope: environment
---

# Oceanvine Deco

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`oceanvine_deco` is a visual-only decorative entity used in the game world to enhance environmental aesthetics, specifically in ocean or vine-dense zones. It has no gameplay mechanics, collision, or interactivity. The entity uses an animated visual (from `anim/waterforest_vines.zip`), randomly selects one of six idle animations, and integrates the `distancefade` component on non-dedicated clients to ensure smooth fading at distance.

The prefab is instantiated via a `Prefab` constructor and is fully pristined, meaning it does not participate in world serialization beyond basic position/orientation. No component logic is executed on dedicated servers.

## Usage example
This prefab is typically used internally by the world generation system (e.g., via rooms or layouts) and is not instantiated directly by modders.

```lua
-- Example usage in world generation (not modder-facing):
-- The prefab is referenced by name "oceanvine_deco" in room/static layout definitions.
local vine = SpawnPrefab("oceanvine_deco")
-- No further configuration needed; behavior is entirely static
```

## Dependencies & tags
**Components used:**  
- `transform` (added via `inst.entity:AddTransform()`)  
- `animstate` (added via `inst.entity:AddAnimState()`)  
- `network` (added via `inst.entity:AddNetwork()`)  
- `distancefade` (added conditionally on non-dedicated clients)  

**Tags added:**  
- `"NOBLOCK"` — prevents interaction/collision  
- `"NOCLICK"` — disables click/tap selection  
- `"flying"` — marks as non-grounded; affects certain visual layering and physics interactions  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `animnum` | number | `1`–`6` (random) | Index of the idle animation sequence played; set during construction via `math.random(1,6)`. |

## Main functions
### `onsave(inst, data)`
* **Description:** Serializes `animnum` into the save data during world save.  
* **Parameters:**  
  - `inst` (Entity) — the instance being saved.  
  - `data` (table) — save data table to populate.  
* **Returns:** Nothing.  

### `onload(inst, data)`
* **Description:** Restores and reapplies the animation state from saved data during world load.  
* **Parameters:**  
  - `inst` (Entity) — the instance being loaded.  
  - `data` (table?) — optional saved data (may be `nil`).  
* **Returns:** Nothing.  
* **Error states:** If `data` is `nil`, no action is taken beyond initialization.

## Events & listeners
None identified.

## Distance fading behavior
On non-dedicated clients (`TheNet:IsDedicated() == false`), the entity adds and configures the `distancefade` component:
- `Setup(15, 25)` sets the fade range such that the entity begins fading at 15 world units and becomes fully invisible at 25 units.
- This ensures optimal rendering performance and prevents visual pop-in at distance.