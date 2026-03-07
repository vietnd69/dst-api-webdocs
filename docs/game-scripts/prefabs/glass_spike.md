---
id: glass_spike
title: Glass Spike
description: Creates deployable glass obstacles that can be hammered into blocks and used as defensive equipment with unique visual and behavioral states.
tags: [combat, crafting, equipment, physics, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7db1497a
system_scope: environment
---

# Glass Spike

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `glass_spike.lua` file defines prefabs for deployable glass obstacles used as defensive structures in DST. It produces four distinct prefabs: `glassspike_short`, `glassspike_med`, `glassspike_tall`, and `glassblock`. These prefabs combine physics interaction (as heavy obstacles), equipment functionality (worn on the body slot), workability (hammerable), and visual state transitions (sparkling idle → hit → broken). They are primarily used for environmental defense and crafting intermediates.

## Usage example
```lua
-- Create a short glass spike
local spike = Prefab("glassspike_short", MakeSpikeFn("spike", "short"), assets)
spawn(spike)

-- Access its components after spawning
spike.AnimState:PlayAnimation("short_glass_idle")
spike.components.workable:SetWorkLeft(5)
spike.components.equippable:SetOnEquip(function(inst, owner) owner.AnimState:OverrideSymbol("swap_body", "swap_glass_spike", "swap_body_short") end)
```

## Dependencies & tags
**Components used:**  
`heavyobstaclephysics`, `inspectable`, `inventoryitem`, `equippable`, `workable`, `submersible`, `symbolswapdata`, `hauntable`

**Tags:** Adds `heavy` to all instances.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `spikesize` | string | `"med"` (if random) | One of `"short"`, `"med"`, or `"tall"`; determines size variant. |
| `animname` | string | Derived from `spikesize` | Used to construct animation names (e.g., `"short"`, `"med"`, `"tall"`, `"block"`). |
| `spikeradius` | number | `0.12`, `0.25`, `0.3`, or `0.45` | Physics radius for the obstacle, mapped from `animname` in `RADIUS` table. |
| `scrapbook_proxy` | string | `"glassspike"` or `"glassblock"` | Key used for scrapbook entry association. |
| `scrapbook_anim` | string | `"tall_glass_idle"` (spike) / `"block_glass_idle"` (block) | Animation name used in scrapbook UI representation. |
| `sparkletask` | task | `nil` | Handle to the recurring sparkle task; cancelled on sleep. |

## Main functions
### `MakeSpikeFn(shape, size)`
* **Description:** Factory function that returns a prefab construction callback for either a spike (`shape = "spike"`) or block (`shape = "block"`). Called during `Prefab` registration to generate individual instances. Finalizes instance setup with components, physics, and event hooks. If on client, only basic visual setup occurs.
* **Parameters:**  
  `shape` (string) — Either `"spike"` or `"block"`.  
  `size` (string, optional) — Spike variant (`"short"`, `"med"`, or `"tall"`); only valid when `shape == "spike"`. Ignored for blocks.
* **Returns:** Function — A constructor function returning a fully initialized entity instance.
* **Error states:** None. Uses fallback random size if `size == nil` and `shape == "spike"`.

### `Sparkle(inst)`
* **Description:** Schedules a delayed sparkle animation and respawns itself recursively if the entity remains awake and workable. Used to simulate fragile glass glinting during idle state.
* **Parameters:**  
  `inst` (Entity) — The entity instance (glass spike or block).
* **Returns:** Nothing.
* **Error states:** Cancels existing sparkle task if present. Does nothing if entity is asleep or `workleft <= 0`.

### `onequipspike(inst, owner)` & `onequipblock(inst, owner)`
* **Description:** Equip handlers that override the `swap_body` symbol on the owner to show glass variant in first-person view.
* **Parameters:**  
  `inst` (Entity) — The glass spike/block being equipped.  
  `owner` (Entity) — The entity equipping the item.
* **Returns:** Nothing.
* **Error states:** None. Uses `animname` for spike-specific symbol names.

### `onunequip(inst, owner)`
* **Description:** Unequip handler that clears the `swap_body` override on the owner.
* **Parameters:**  
  `inst` (Entity) — The item being unequipped.  
  `owner` (Entity) — The entity unequipping the item.
* **Returns:** Nothing.

### `onworked(inst)`
* **Description:** Called each time the item is hammered. Triggers a hit animation.
* **Parameters:**  
  `inst` (Entity) — The glass spike/block being worked.
* **Returns:** Nothing.

### `onworkfinished(inst)`
* **Description:** Called when hammering completes. Disables physics, hides clickable interaction, transitions to break animation, and destroys entity after animation finishes.
* **Parameters:**  
  `inst` (Entity) — The glass spike/block whose work is finished.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `animover` — Triggers `ErodeAway` after break animation completes.  
  `onputininventory` / `ondropped` — Managed internally by `heavyobstaclephysics` to toggle physics state.  
  `onEntitySleep` / `onEntityWake` — Hooks to `OnEntitySleep` and `OnEntityWake` for sparkle task management.
- **Pushes:**  
  `imagechange` — Via `inventoryitem:ChangeImageName`.  
  Sound `"dontstarve/creatures/together/antlion/sfx/glass_break"` — Played on break completion.