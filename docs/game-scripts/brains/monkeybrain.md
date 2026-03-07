---
id: monkeybrain
title: Monkeybrain
description: AI brain controller for monkey characters that manages combat, foraging, item gathering, leash behavior, and leader harassment via behavior tree logic.
tags: [ai, combat, inventory, item, leader]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: d2714efe
---

# Monkeybrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `MonkeyBrain` component implements the artificial intelligence logic for monkey entities in Don't Starve Together. It is built on top of the Behavior Tree (`BT`) system and inherits from `Brain`. It coordinates multiple behaviors via a priority-weighted behavior tree to handle combat (including player harassment with throwing projectiles), food acquisition (eating, picking, harvesting), item gathering, and leash-following mechanics. The brain relies heavily on components such as `combat`, `eater`, `inventory`, `pickable`, `crop`, `container`, `burnable`, `homeseeker`, and `knownlocations` to make decisions. It also uses several external behavior modules (`wander`, `runaway`, `doaction`, `chaseandattack`, `leash`) and shares common utilities via `braincommon.lua`.

## Usage example
```lua
local MonkeyBrain = require("brains/monkeybrain")
local inst = Entity("monkey")
inst:AddComponent("combat")
inst:AddComponent("eater")
inst:AddComponent("inventory")
inst:AddComponent("homeseeker")
inst:AddComponent("knownlocations")
inst:AddComponent("burnable")
inst:AddComponent("container")
inst:AddComponent("pickable")
inst:AddComponent("crop")
inst:AddComponent("equippable")
inst:AddComponent("projectile")
inst:AddBrain(MonkeyBrain)
```

## Dependencies & tags
**Components used:** `combat`, `eater`, `inventory`, `homeseeker`, `knownlocations`, `burnable`, `container`, `pickable`, `crop`, `equippable`, `projectile`, `inventoryitem`, `harassplayer` (assumed property on entity), `weaponitems` (assumed property on entity), `HasAmmo` (assumed method on entity), `GetTimeAlive`, `GetBufferedAction`.

**Tags:** The brain internally defines and uses the following tag lists:
- `NO_LOOTING_TAGS`: `{ "INLIMBO", "catchable", "fire", "irreplaceable", "heavy", "outofreach", "spider" }`
- `NO_PICKUP_TAGS`: deepcopy of `NO_LOOTING_TAGS` plus `"_container"`
- `PICKUP_ONEOF_TAGS`: `{ "_inventoryitem", "pickable", "readyforharvest" }`
- `ANNOY_ONEOF_TAGS`: `{ "_inventoryitem", "_container" }`
- `ANNOY_ALT_MUST_TAG`: `{ "_inventoryitem" }`
- `CANT_PICKUP_TAGS`: `{ "heavy", "irreplaceable", "outofreach" }`

## Properties
The constructor initializes no new properties; it inherits from `Brain` via `Brain._ctor(self, inst)`. However, the brain relies on the following entity-level properties being present (not properties of the brain itself):

| Property | Type | Default Value | Description |
|---|---|---|---|
| `inst.harassplayer` | `Entity?` | `nil` | Reference to the player this monkey is harass-annotating. |
| `inst.weaponitems` | `table` | `{}` | Container with `thrower` and `hitter` weapon items. |
| `inst._curioustask` | `Task?` | `nil` | Internal task reference for curious state cooldown. |
| `inst.canlootchests` | `boolean` | `true` | Cooldown flag preventing chest looting. |
| `inst._canlootcheststask` | `Task?` | `nil` | Internal task for looting cooldown reset. |
| `inst.curious` | `boolean` | `false` | Flag indicating whether monkey is currently curious. |

## Main functions

### `MonkeyBrain:OnStart()`
* **Description:** Initializes the behavior tree for the monkey entity. Constructs a hierarchical priority node structure that defines decision precedence during state transitions. The tree handles panic triggers, combat (with and without player), looting, eating, following, wandering, and home returning.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** None documented. Assumes required components and properties are attached to `inst`.

### `GetPoop(inst)`
* **Description:** Locates a nearby `poop` prefab within `SEE_ITEM_DISTANCE` and returns a buffered `PICKUP` action if the monkey is not currently busy.
* **Parameters:**
  - `inst` (`Entity`): The monkey entity instance.
* **Returns:** `BufferedAction?` — Action if valid target found; otherwise `nil`.
* **Error states:** Returns `nil` if `inst.sg:HasStateTag("busy")` is true or no valid `poop` found.

### `EatFoodAction(inst)`
* **Description:** Handles the monkey's foraging logic: eating held food, picking up food items, harvesting crops, picking pickables (e.g., `worm`, `berries`), and equipping headgear. Prioritizes equipment if missing, then food, then crops/pickables, then random curious pickup.
* **Parameters:**
  - `inst` (`Entity`): The monkey entity instance.
* **Returns:** `BufferedAction?` — First valid action found in priority order; otherwise `nil`.
* **Error states:** Returns `nil` if inventory full, recently ate (`< TIME_BETWEEN_EATING`), or no suitable item found. May skip actions if `inst.sg:HasStateTag("busy")` is true.

### `AnnoyLeader(inst)`
* **Description:** Implements leader harassment: attempts to pick up recently spawned items, steal from player's container if it is closed, or intercept the player's pending `PICKUP` actions by being closer to the target.
* **Parameters:**
  - `inst` (`Entity`): The monkey entity instance.
* **Returns:** `BufferedAction?` — Action to take if any harassment opportunity exists; otherwise `nil`.
* **Error states:** Returns `nil` if `inst.sg:HasStateTag("busy")`, or no valid items found, or no harassment opportunity detected.

### `GoHome(inst)`
* **Description:** Returns a `GOHOME` buffered action to the monkey's home location if the home is valid and not burning.
* **Parameters:**
  - `inst` (`Entity`): The monkey entity instance.
* **Returns:** `BufferedAction?` — Action to go home; otherwise `nil`.
* **Error states:** Returns `nil` if `homeseeker.home` is invalid or missing, or if home is burning.

### `EquipWeapon(inst, weapon)`
* **Description:** Ensures the specified weapon is equipped in the monkey's hands.
* **Parameters:**
  - `inst` (`Entity`): The monkey entity instance.
  - `weapon` (`Entity`): The weapon entity to equip.
* **Returns:** `nil`.
* **Error states:** Skips equipping if `weapon.components.equippable:IsEquipped()` is already true.

## Events & listeners
- **Listens to:**
  - `"gohome"` — Triggered to initiate `GoHome` action (e.g., during acid rain or quakes).
- **Pushes:**
  - None documented.

Note: The brain does not directly register listeners for events beyond the `"gohome"` event; all other behavior is handled via state-based `WhileNode` conditions and priority evaluation.