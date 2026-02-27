---
id: wormbrain
title: Wormbrain
description: Manages AI decision-making for the Worm boss, coordinating behavior such as hunting, returning to a home location, eating, and executing lure-based attacks.
tags: [ai, boss, combat, navigation, inventory]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: de1602b4
---

# Wormbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

Wormbrain is an AI control component responsible for directing the behavior of the Worm boss entity in Don't Starve Together. It implements a behavior tree (`BT`) to orchestrate high-priority priority-based decisions, including combat engagement, returning to its designated home location, consuming food, and executing the special `lure` attack mechanic. The component integrates with several core systems: combat (for target tracking), inventory (for food selection), known locations (for home positioning), and pickable/crop components (for foraging). It is loaded as part of the entity's brain definition and activates during gameplay via `OnStart()`, which initializes the behavior tree root node.

## Usage example

This component is not typically added manually by modders; it is automatically assigned to the Worm entity (`prefab/worm.lua`) during world initialization. A minimal example of how it might be attached programmatically (for testing or custom bosses) would look like this:

```lua
inst:AddComponent("brain")
inst.components.brain:SetBrain("wormbrain")
```

Note: In practice, the Worm brain is assigned internally by the game via its prefab definition and state graph integration; direct `SetBrain` calls should be avoided unless replicating internal logic precisely.

## Dependencies & tags
**Components used:**
- `combat` (checks for active target via `HasTarget`)
- `eater` (checks eating cooldown and edible items via `TimeSinceLastEating`, `CanEat`)
- `inventory` (finds edible items via `FindItem`, checks capacity via `IsFull`)
- `knownlocations` (retrieves `"home"` location via `GetLocation`)
- `pickable` (validates pickable interaction via `CanBePicked`, `caninteractwith`)
- `crop` (validates harvest readiness via `IsReadyForHarvest`)
- `inventoryitem` (verifies pickup state via `canbepickedup`, `IsHeld`)

**Tags:**  
No tags are added, removed, or checked directly by this brain. However, its behavior tree relies on state graph tags such as `"idle"`, `"busy"`, and `"lure"` via `inst.sg:HasStateTag(...)`.

## Properties
The component itself does not expose any public properties beyond the inherited `Brain` fields. All logic is driven internally via constructor initialization and dynamic evaluation within the behavior tree.

## Main functions

### `WormBrain:OnStart()`
* **Description:** Initializes and sets up the behavior tree root node using a priority-based structure. It defines fallback behaviors depending on whether the Worm has a known `"home"` location, including panic responses, leash constraints, combat, lure preparation, foraging, wandering, and idle states.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** None documented. Assumes all required components (especially `knownlocations` and `combat`) are attached to `inst`. Behavior may degrade if `TUNING` values for worm mechanics (`WORM_LURE_COOLDOWN`, `WORM_EATING_COOLDOWN`, `WORM_CHASE_DIST`, etc.) are undefined.

### `LayInWait(inst)`
* **Description:** Helper function that triggers the `"dolure"` event if the Worm is currently in the `"idle"` state (i.e., not engaged in a busy or active state like `lure`). Used to initiate the ambush behavior.
* **Parameters:**
  - `inst`: The entity instance (expected to have `sg` (state graph) component).
* **Returns:** `nil`.
* **Error states:** No-op if called when not in the `"idle"` state; no events are pushed in that case.

### `GoHomeAction(inst)`
* **Description:** Returns a `BufferedAction` to walk the Worm back to its `"home"` location (if known) and trigger `"dolure"` upon arrival. Aborts if the Worm has a target or if the `WORM_LURE_COOLDOWN` has not yet elapsed.
* **Parameters:**
  - `inst`: The entity instance (must have `knownlocations` and `combat` components).
* **Returns:** `BufferedAction` or `nil` (if conditions prevent action).
* **Error states:** Returns `nil` if:
  - `combat:HasTarget()` is true, or
  - `"home"` location is not set (`nil`), or
  - Cooldown has not elapsed since last lure.

### `EatFoodAction(inst)`
* **Description:** Attempts to feed the Worm by either consuming items from its inventory or picking up/harvesting edible items from the ground within `WORM_FOOD_DIST`. Prioritizes inventory items, then ground items, then harvestables like crops and pickables. Respects eating cooldown (`WORM_EATING_COOLDOWN`) and busy state (`"busy"`).
* **Parameters:**
  - `inst`: The entity instance (requires `eater`, `inventory`, `pickable`, `crop`, `inventoryitem`, `knownlocations` components as applicable).
* **Returns:** `BufferedAction` or `nil`.
* **Error states:** Returns `nil` if:
  - Worm is in `"busy"` state, or
  - Eating cooldown has not elapsed, or
  - Inventory is full and no inventory-based food can be consumed, or
  - No suitable ground items match criteria (valid tags, not held, on ground, edible, etc.), or
  - No harvestables are ready (`crop:IsReadyForHarvest()` false), or
  - No pickables are interactable or available.

## Events & listeners

- **Listens to:** None.  
- **Pushes:**  
  - `"dolure"`: Triggered via `inst:PushEvent("dolure")` when entering the `"lure"` state (initiates ambush). Called from:
    - `LayInWait()`
    - `GoHomeAction()`'s success callback (`ba:AddSuccessAction`)