---
id: hedgehound_bush
title: Hedgehound Bush
description: Acts as a dormant, thorny flower that transforms into a hedgehound upon activation, rewarding the activator with petals and dealing thorn damage if not protected.
tags: [combat, environment, transformation, reward]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 35fa21e8
system_scope: environment
---

# Hedgehound Bush

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`hedgehound_bush` is a prefab entity that functions as a temporary environmental hazard and resource. It appears as a flowering bush and remains dormant (`inactive`) until activated (typically by a player). Upon activation, it transforms into a hostile `hedgehound` entity while spawning `petals` as a reward. The transformation also triggers nearby bushes to wake up. It interacts with the `activatable`, `combat`, and `health` components to manage state transitions and damage.

## Usage example
```lua
local bush = SpawnPrefab("hedgehound_bush")
bush.Transform:SetPosition(x, y, z)
bush:SetReward("hedgeitem") -- optional, sets the item it will drop/transform into
-- When activated, it will spawn a hedgehound with the specified item and reward petals to the activator.
```

## Dependencies & tags
**Components used:** `activatable`, `combat`, `health`, `inspectable`, `network`, `animstate`, `soundemitter`, `transform`, `minimapentity`  
**Tags added:** `hedge_hound_bush`, `hedge`, `thorny`  
**Tags checked:** `bramble_resistant`, `NOCLICK`, `FX` (on internal child item)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `hedgeitem` | string or nil | `nil` | Name of the prefab to spawn when transforming (typically a hedgehound item). Set via `SetReward`. |
| `holdasbush` | boolean | `false` | If `true`, prevents automatic transformation after `reward_to_bush` animation completes (used for permanent decorative bushes). |

## Main functions
### `OnActivate(inst, doer)`
* **Description:** Handles the activation logic — transforms the bush into a hedgehound, rewards the activator with `petals`, and inflicts thorn damage (unless the activator wears `bramble_resistant` gear).
* **Parameters:**  
  `inst` (Entity) — The bush instance being activated.  
  `doer` (Entity or nil) — The entity that activated the bush (e.g., player). May be `nil` (e.g., proximity triggers).  
* **Returns:** Nothing.
* **Error states:** Silently ignores `doer` if `nil`. Damage is only applied if `doer.components.combat` exists.

### `SetReward(inst, reward_prefab)`
* **Description:** Assigns a reward item to be associated with the bush (e.g., the item the hedgehound carries). Spawns and attaches the item as a child entity that follows the bush visually.
* **Parameters:**  
  `reward_prefab` (string) — Name of the prefab to spawn (e.g., `"hedgeitem"`).  
* **Returns:** Nothing.
* **Error states:** None identified.

### `GetVerb()`
* **Description:** Returns the localized verb string for the "pick flower" action displayed in UI.
* **Parameters:** None.
* **Returns:** `"PICK_FLOWER"` (string).

## Events & listeners
- **Listens to:**  
  `animqueueover` — Triggered when an animation finishes; used to transition from `reward_to_bush` to `bush_idle`, and to finalize bush→hound transformation.  
  `attacked` — Triggers immediate transformation via `do_transform_and_wake`, even if animation state is not `bush_idle`.  
- **Pushes:**  
  None directly. Uses `PushEvent("trigger_hedge_respawn")` on spawners and `thorns` on the activator.
