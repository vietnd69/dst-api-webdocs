---
id: eyeofterror_mini_projectile
title: Eyeofterror Mini Projectile
description: Acts as a flying mini-eye projectile that lands and transforms into a grounded egg-like entity, which later hatches into an active mini-eye mob. It functions as a boss-spawned projectile with soldier-command integration.
tags: [combat, projectile, boss, ai, mob]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 24996352
system_scope: world
---

# Eyeofterror Mini Projectile

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `eyeofterror_mini_projectile` prefab represents a flying projectile spawned by the Eyeofterror boss. It uses the `complexprojectile` component for arc-based movement and lands on the ground, where it transforms into a `eyeofterror_mini_grounded` entity (an egg-like state). The projectile can be assigned a commander and automatically adds spawned ground mobs to that commander’s soldier list. It does not persist across sessions (`inst.persists = false`) and is purely a transient combat asset.

## Usage example
```lua
-- The projectile prefab is spawned internally by the Eyeofterror boss logic.
-- Example of attaching a commander to ensure spawned eggs/mobs join its army:
local projectile = SpawnPrefab("eyeofterror_mini_projectile")
projectile.Transform:SetPosition(x, y, z)
if commander then
    projectile:PushEvent("gotcommander", { commander = commander })
end
```

## Dependencies & tags
**Components used:** `complexprojectile`, `locomotor`, `health`, `combat`, `inspectable`, `groundshadowhandler` (client-only), `soundemitter`  
**Tags added:** `NOCLICK`, `projectile`, `complexprojectile`, `eyeofterror`, `hostile`, `smallcreature`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_commander` | Entity or nil | `nil` | Reference to the commander entity that owns this projectile/egg/mob as a soldier. Set via the `gotcommander` event. |

## Main functions
### `on_mini_eye_landed(inst)`
* **Description:** Callback triggered when the projectile hits the ground. Spawns the `eyeofterror_mini_grounded` entity at the impact location, plays landing animations, notifies listeners, and transfers the soldier relationship to the new grounded entity if a commander exists.
* **Parameters:** `inst` (Entity) — The projectile instance that landed.
* **Returns:** Nothing.
* **Error states:** If `_commander` is nil, no soldier assignment occurs.

### `on_became_soldier(inst, data)`
* **Description:** Event handler that registers the commander reference when the entity receives a `gotcommander` event. Sets up cleanup on commander removal.
* **Parameters:**  
  `inst` (Entity) — The instance receiving the soldier status.  
  `data` (table) — Must contain `{ commander = commander_entity }`.
* **Returns:** Nothing.

### `try_to_hatch(inst)`
* **Description:** Called after `TUNING.EYEOFTERROR_MINI_EGGTIME` seconds. Spawns an `eyeofterror_mini` mob from the grounded egg, transfers current health, assigns the same commander, and attempts to assign a target (from commander’s target or nearest player).
* **Parameters:** `inst` (Entity) — The grounded egg entity (`eyeofterror_mini_grounded`).
* **Returns:** Nothing.
* **Error states:** If `_commander` is nil, the spawned mob will not inherit a commander or automatic target suggestion.

### `on_grounded_hit(inst, attacker)`
* **Description:** Combat hit callback for the grounded egg. Plays hit sound and animation sequence.
* **Parameters:**  
  `inst` (Entity) — The grounded egg instance.  
  `attacker` (Entity or nil) — The attacking entity (unused except for presence check).
* **Returns:** Nothing.
* **Error states:** No effect if the egg is already dead (`health:IsDead()` returns true).

### `on_grounded_killed(inst)`
* **Description:** Death callback for the grounded egg. Cancels the hatch task and triggers break animation with sound.
* **Parameters:** `inst` (Entity) — The grounded egg instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `gotcommander` — Sets `inst._commander` and registers cleanup for when the commander is removed.  
  `onremove` — Clears `inst._commander` when the commander entity is removed.  
  `death` — Triggers `on_grounded_killed` for grounded eggs.
- **Pushes:**  
  `on_landed` — Announces successful landing to interested listeners (used by `grounded` prefabs).  
  `gotcommander` — Pushed by the commander when adding this entity as a soldier (via `Commander:AddSoldier`).