---
id: propsign
title: Propsign
description: Implements a breakable, equippable sign prop that functions as a lightweight weapon and interacts with minigame excitement tracking.
tags: [combat, inventory, environment, minigame]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 63bc9a72
system_scope: inventory
---

# Propsign

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `propsign` prefab is a reusable decorative and combat object that can be equipped, broken, or destroyed by fire. It integrates with the `equippable`, `weapon`, and `minigame_participator` systems to support both gameplay and environmental roles (e.g., Pig King minigame item). When broken, it plays an animation, emits sound, and optionally records excitement in a minigame context. It supports persistence across save/load cycles, tracking burnt state.

## Usage example
```lua
-- Create and configure a propsign instance
local sign = SpawnPrefab("propsign")
sign.Transform:SetPosition(x, y, z)

-- Equip it (typically done automatically by player)
local player = ThePlayer
player.components.inventory:AddItem(sign, false)
player.components.inventory:Equip(EQUIPSLOTS.HANDS, sign)

-- Break it programmatically
sign:PushEvent("propsmashed", { pos = sign:GetPosition() })
```

## Dependencies & tags
**Components used:** `inventoryitem`, `equippable`, `weapon`, `burnable`, `propagator`, `hauntable`, `inspectable`  
**Tags added:** `propweapon`, `minigameitem`, `irreplaceable`, `nonpotatable`, `weapon`, `FX` (for shatter effect), `NOCLICK`, `burnt` (when extinguished after burning), `knockbackdelayinteraction` (temporary)  
**Tags checked:** `burnt`, `NOCLICK`, `knockbackdelayinteraction`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `broken` | boolean | `false` | Indicates whether the sign has been broken or extinguished and is now nonfunctional. |
| `_knockbacktask` | Task | `nil` | Task handle for delayed interaction re-enable after knockback. |
| `_playerknockbacktask` | Task | `nil` | Task handle for delayed `NOCLICK` removal after knockback. |

## Main functions
### `BreakSign(inst)`
* **Description:** Handles the breaking logic for the sign. If held, it unequips and smashes; if not held, it sets burnt/nonfunctional state and begins erosion decay.
* **Parameters:** `inst` (Entity) — the propsign instance.
* **Returns:** Nothing.
* **Error states:** No effect if `inst.broken` is already `true`.

### `OnSmashed(inst, pos)`
* **Description:** Called on `propsmashed` event or when sign is smashed while held. Records minigame excitement, spawns shatter FX, and removes the entity.
* **Parameters:**  
  - `inst` (Entity) — the propsign instance.  
  - `pos` (Vector3) — world position for FX spawn.
* **Returns:** Nothing.
* **Error states:** No excitement recorded if grand owner has no minigame component, or minigame has no `minigame` component.

### `OnBurnt(inst)`
* **Description:** Called when the sign burns out via the `burnable` component. Marks as burnt, darkens visuals, and triggers `BreakSign`.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `OnKnockbackDropped(inst, data)`
* **Description:** Handles knockback cooldowns for interaction. Applies delayed re-enable of click and interaction flags based on `delayinteraction` and `delayplayerinteraction` values.
* **Parameters:**  
  - `inst` (Entity).  
  - `data` (table) — contains optional `delayinteraction` and `delayplayerinteraction` numbers (seconds).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `propsmashed` — triggers `OnSmashed` for external smash events.  
  - `knockbackdropped` — triggers `OnKnockbackDropped` for knockback interaction delays.  
  - `animover` (on shatter FX) — removes FX entity when animation completes.
- **Pushes:** None directly; relies on parent systems (e.g., `burnable` pushes `burnt`).