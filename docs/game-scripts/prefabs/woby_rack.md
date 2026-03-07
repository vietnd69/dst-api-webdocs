---
id: woby_rack
title: Woby Rack
description: Manages the visual rack slots, animation states, and owner-synced rendering for Woby's drying rack item.
tags: [inventory, visual, sync]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6e76229a
system_scope: entity
---

# Woby Rack

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `woby_rack` prefabs (`woby_rack_swap_fx` and `woby_rack_container`) implement the visual and logical representation of Woby's meat-drying rack. The `swap_fx` prefab renders the dynamic slot animations and handles syncing visual states (e.g., fading, swinging) to the owner's movement and fade states, while `container` provides the underlying inventory container structure. The component relies on `updatelooper`, `highlightchild`, and `colouraddersync` to coordinate updates and visual effects across networked environments.

## Usage example
```lua
-- Creating the visual rack instance (typically handled by the game)
local rack = CreateEntity()
rack:AddComponent("container")
rack.components.container:WidgetSetup("woby_rack_container")
-- The `woby_rack_swap_fx` entity is created and attached automatically via the widget system
rack.components.container:AddItem(item)
rack.components.container.slots[1]:SetItem(item)
```

## Dependencies & tags
**Components used:** `container`, `highlightchild`, `colouraddersync`, `updatelooper`, `animstate`, `transform`, `follower`, `network`
**Tags:** `FX`, `decor`, `NOCLICK`, `CLASSIFIED` (on container), `woby_dash_fade`, `woby_align_fade` (checked on owner)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `slots` | table | `{}` | Array of 3 slot tables, each containing `name` and `build` network hashes; populated during `swapfxfn` construction. |
| `owner` | entity | `nil` | The entity (usually the Woby player) whose movement and fade state control rack animation and colour. |
| `_updating` | boolean | `nil` | Tracks whether the component is actively updating (enabled when owner exists and world is running). |
| `_fading` | boolean | `false` | Indicates if the owner is currently fading (used to apply fade tint). |
| `wasmoving`, `wasrunning`, `wasnopredict` | boolean | `false` | Track previous states of owner to detect transitions and trigger animation changes. |
| `ismastersim` | boolean | `nil` | Set to `true` on the master simulation when `updatelooper` is added. |

## Main functions
### `ShowRackItem(slot, name, build)`
* **Description:** Sets the item visual in a specific slot (`1`, `2`, or `3`) using the provided `name` and `build` asset identifiers, and triggers a "bounce" animation if the rack is idle. Only has effect on non-dedicated clients.
* **Parameters:** 
  * `slot` (number) — Index of the slot (`1`–`3`).
  * `name` (string) — Texture/asset name for the dried item.
  * `build` (string) — Build/variant identifier for the item.
* **Returns:** Nothing.

### `HideRackItem(slot)`
* **Description:** Clears the visual item in the specified slot and resets it to the empty rope representation. Triggers animation changes. Only has effect on non-dedicated clients.
* **Parameters:** 
  * `slot` (number) — Index of the slot (`1`–`3`).
* **Returns:** Nothing.

### `CreateSlotFx()`
* **Description:** Internal helper that creates and configures a single slot's FX entity (non-networked, non-persistent, with `highlightchild` component) for visual feedback.
* **Parameters:** None.
* **Returns:** `inst` — The created FX entity.

### `OnOwnerChanged(inst, owner)`
* **Description:** Updates highlight ownership across all slot FX entities, initializes or removes the `updatelooper` component, and manages sleep/wake event bindings based on owner presence.
* **Parameters:** 
  * `inst` — The rack entity.
  * `owner` (entity or `nil`) — New owner entity.
* **Returns:** Nothing.

### `SetFadeColour(inst, r, g, b, a)`
* **Description:** Sets the tint (mult colour) on the rack and all slot FX entities. Used to synchronize fade appearance with the owner.
* **Parameters:** 
  * `inst` — The rack entity.
  * `r`, `g`, `b`, `a` (number) — RGBA colour values (0.0–1.0).
* **Returns:** Nothing.

### `OnPostUpdateFading(inst)`
* **Description:** Runs during post-update to match rack tint to the owner’s fade state when active; resets tint when fading ends.
* **Parameters:** 
  * `inst` — The rack entity.
* **Returns:** Nothing.

### `OnUpdate(inst)`
* **Description:** Updates rack animation based on owner’s movement and prediction state (e.g., running vs. idle, during `nopredict` transitions). Randomizes animation variants (`loop_swing_runN`, `pst_swing_settleN`, `idle_swayN`).
* **Parameters:** 
  * `inst` — The rack entity.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `slotdirty[1]`, `slotdirty[2]`, `slotdirty[3]` (client-side only) — Fires `_OnSlotDirty` to refresh slot visuals when network data changes.
- **Pushes:** None identified — this prefab does not fire custom events.
