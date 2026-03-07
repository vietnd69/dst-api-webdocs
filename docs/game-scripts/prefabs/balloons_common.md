---
id: balloons_common
title: Balloons Common
description: Provides shared utility functions and initialization logic for balloon prefabs, including colouring, physics setup, popping behavior, and interaction with the player's inventory and combat systems.
tags: [balloon, inventory, combat, physics]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7506c48c
system_scope: inventory
---

# Balloons Common

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`balloons_common.lua` is a utility module used to initialize and configure balloon prefabs in DST. It provides helper functions for setting up core components (health, combat, inventoryitem, poppable), configuring flying physics, assigning colour tints, handling equipping/unequipping on the player, and managing the balloon’s popping behaviour—including area attacks, animations, and sound effects. This module is not a component itself but rather a collection of reusable functional definitions for prefabs like balloon hats or wearable items.

## Usage example
```lua
local inst = CreateEntity()
inst:AddPrefab("balloon")

-- Initialize master balloon properties
inst:function = function() end -- placeholder; actual usage is via returned functions
require("prefabs/balloons_common").MakeBalloonMasterInit(inst, my_onpop_fn, false)

-- Apply floating physics
require("prefabs/balloons_common").MakeFloatingBallonPhysics(inst)

-- Randomly set balloon colour
require("prefabs/balloons_common").SetColour(inst, nil)
```

## Dependencies & tags
**Components used:** `combat`, `health`, `inventoryitem`, `poppable`, `inspectable`, `rider`  
**Tags added/removed:** `notarget`, `NOCLICK` (during deactivation), `inlimbo`, `notarget`, `noattack`, `flight`, `invisible`, `playerghost` (used in `DoAreaAttack` exclusion list)

## Properties
No public properties. This file returns a table of functions for use by prefabs; it does not define an ECS component.

## Main functions
### `MakeBalloonMasterInit(inst, onpopfn, drop_on_built)`
* **Description:** Initializes common components and settings required for balloon prefabs, including health, combat, and poppable components, and registers the death handler. Called during prefab creation.
* **Parameters:**  
  `inst` (Entity) — the balloon entity instance.  
  `onpopfn` (function) — callback to execute when the balloon is popped.  
  `drop_on_built` (boolean) — unused in this implementation; included for signature compatibility only.
* **Returns:** Nothing.
* **Error states:** Skips adding `inspectable` and `inventoryitem` components if already present.

### `MakeFloatingBallonPhysics(inst)`
* **Description:** Configures the physics collider for a floating balloon, setting mass, damping, restitution, and collision masks to enable realistic bouncy movement and interaction with characters/obstacles.
* **Parameters:**  
  `inst` (Entity) — the balloon entity instance.
* **Returns:** The configured `Physics` component.
* **Error states:** Creates a physics component if one does not exist.

### `SetColour(inst, colour_idx)`
* **Description:** Applies a colour tint to the balloon using `AnimState:SetMultColour`. If `colour_idx` is omitted or invalid, a random index is selected.
* **Parameters:**  
  `inst` (Entity) — the balloon entity instance.  
  `colour_idx` (number?) — optional index (1–6) into the predefined colour table; `nil` triggers random selection.
* **Returns:** The resulting `colour_idx` (number) used.
* **Error states:** Clamps index to range `1` to `#colours` using `Clamp`.

### `SetRopeShape(inst)`
* **Description:** Randomly selects and overrides the rope visual asset for the balloon using `AnimState:OverrideSymbol`.
* **Parameters:**  
  `inst` (Entity) — the balloon entity instance.
* **Returns:** Nothing.

### `OnEquip_Hand(inst, owner, from_ground)`
* **Description:** Handles visual and logical setup when a balloon is equipped to the player’s hand. Spawns a child entity (`balloon_held_child`) to represent the held balloon, updates the owner’s animation, and sets up event callbacks for owner attacks (to drop the balloon) and removal.
* **Parameters:**  
  `inst` (Entity) — the balloon entity.  
  `owner` (Entity) — the player equipping the balloon.  
  `from_ground` (boolean) — whether the item was picked up from the ground.
* **Returns:** Nothing.

### `OnUnequip_Hand(inst, owner)`
* **Description:** Reverses `OnEquip_Hand`: removes the held child entity, cleans up event callbacks, and restores the owner’s default arm animation.
* **Parameters:**  
  `inst` (Entity) — the balloon entity.  
  `owner` (Entity) — the player unequipping the balloon.
* **Returns:** Nothing.

### `DeactiveBalloon(inst)`
* **Description:** Disables the balloon’s visual and physical presence: removes colliders, adds `notarget` and `NOCLICK` tags, disables persistence and pickup capability, and hides the dynamic shadow.
* **Parameters:**  
  `inst` (Entity) — the balloon entity.
* **Returns:** Nothing.

### `DoPop(inst)`
* **Description:** Triggers popping logic for a non-floating balloon. Attempts to spawn a local `balloon_pop_body` FX and area attack if owned by a valid non-mounted player. Otherwise, hides the balloon and schedules a delayed area attack and removal.
* **Parameters:**  
  `inst` (Entity) — the balloon entity.
* **Returns:** Nothing.
* **Error states:** Does nothing if mounted (`rider:IsRiding()` is true). Only triggers area attack and FX for valid owner context.

### `DoPop_Floating(inst)`
* **Description:** Handles popping logic for a floating balloon. Deactivates, plays the `pop` animation at variable speed, plays pop sound, schedules area attack, and removes the entity after animation completes.
* **Parameters:**  
  `inst` (Entity) — the floating balloon entity.
* **Returns:** Nothing.

### `FueledDepletedPop(inst)`
* **Description:** Helper to trigger `poppable:Pop()`—typically used when a fuelled balloon runs out of fuel.
* **Parameters:**  
  `inst` (Entity) — the balloon entity.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `death` — triggers `ondeath(inst)` → calls `poppable:Pop()`.  
  `onremove` — in `OnEquip_Hand`, removes child `_body` and nullifies `inst._body`.  
  `attacked` — in `OnEquip_Hand`, calls `inst:DropItem(inst)` if owner is not mounted.  
  `onremove` — also attached to `_body` to nullify `inst.body` if body is removed.

- **Pushes:**  
  None directly; delegates to `poppable:Pop()` which may trigger `onpopfn`. FX prefabs (`balloon_pop_head`, `balloon_pop_body`) trigger their own events.