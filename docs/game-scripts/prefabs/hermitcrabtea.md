---
id: hermitcrabtea
title: Hermitcrabtea
description: Factory prefab generator for hermit crab tea items and their associated debuff effects, supporting reusable consumption, stat restoration, and temporary buffs.
tags: [inventory, consumable, buff, network]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a3e40c74
system_scope: inventory
---

# Hermitcrabtea

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `hermitcrabtea.lua` file is a prefab factory module responsible for generating two types of prefabs: tea items (`hermitcrabtea_<name>`) and their associated debuff effects (`hermitcrabtea_<name>_buff`). Each tea item functions as a reusable consumable that restores health, hunger, and sanity, and optionally applies a timed debuff. The tea uses a finite-uses system and supports stack-by-stack or full-stack consumption, refunding an empty bottle (`messagebottleempty`) on exhaustion.

## Usage example
```lua
-- To generate tea prefabs (called automatically at load time):
local teas = require("prefabs/hermitcrabtea")
-- The returned prefabs are already registered in the global prefab registry.

-- To spawn a specific tea and use it:
local tea = SpawnPrefab("hermitcrabtea_recovery")
tea.components.finiteuses:Use(1)
```

## Dependencies & tags
**Components used:** `finiteuses`, `edible`, `inventoryitem`, `inspectable`, `tradable`, `debuff`, `timer`  
**Tags added to tea items:** `cattoy`, `fooddrink`, `pre-preparedfood`  
**Tags added to debuff prefabs:** `CLASSIFIED` (non-persistent client-side entity)

## Properties
No public properties are exposed on a per-instance basis. Configuration is done via the `data` table passed to the factory functions `MakeTea` and `MakeTeaBuff`.

## Main functions
### `MakeTea(data)`
* **Description:** Generates a consumable tea item prefab with configurable stats, buff, and reuse behavior. Registers the prefab in the global registry via return value.
* **Parameters:**  
  `data` (table) - Configuration table with keys: `name` (string, required), `healthvalue`, `hungervalue`, `sanityvalue`, `temperaturedelta`, `temperatureduration`, `foodtype`, `buff`, `nochill`, `data_only` (boolean, skip prefab generation if true), and optional animation/build overrides.
* **Returns:** A `Prefab` object representing the tea item, or `nil` if `data.data_only` is true.

### `MakeTeaBuff(data)`
* **Description:** Generates a debuff prefab that applies and manages a temporary effect when a tea is consumed. This debuff is non-networked and tied to the eater's entity lifecycle.
* **Parameters:**  
  `data` (table) - Configuration table with keys: `name` (string, required), `duration` (number, required), `onattachedfn`, `onextendedfn`, `ondetachedfn`, and `data_only`.
* **Returns:** A `Prefab` object representing the debuff, or `nil` if `data.data_only` is true.

### `OnFinishTea(inst)`
* **Description:** Handles post-exhaustion logic: removes the tea, spawns an empty bottle (`messagebottleempty`), and attempts to return it to the original owner's inventory (including container or inventory slots); otherwise drops it on the ground.
* **Parameters:** `inst` (Entity) - The exhausted tea item.
* **Returns:** Nothing.

### `HandleEdibleRemove(inst, eatwholestack)`
* **Description:** Called when the tea is removed from consumption; reduces finite uses by one (partial) or to zero (full stack).
* **Parameters:**  
  `inst` (Entity) - The tea item.  
  `eatwholestack` (boolean) - If true, depletes all uses; otherwise, decrements by one use.
* **Returns:** Nothing.

### `GetWholeStackEatMultiplier(inst)`
* **Description:** Provides the stack multiplier when consuming the entire stack at once.
* **Parameters:** `inst` (Entity) - The tea item.
* **Returns:** number — The current number of uses remaining.

## Events & listeners
- **Listens to:**  
  - `percentusedchange` (on tea items) — Triggers `OnPercentChanged` to update animation based on remaining uses.  
  - `timerdone` (on debuff prefabs) — Triggers `Buff_OnTimerDone` to stop the debuff when the timer expires.  
  - `death` (on debuff prefabs, attached to eater) — Triggers debuff removal when the eater dies.
- **Pushes:**  
  - `percentusedchange` (on tea items) — Notifies listeners (e.g., animation) of use percentage change.  
  - `gotnewitem` (on inventory/container owners) — Fired when returning an empty bottle to an open inventory or container.  
  - `itemget` (on container/inventory) — Fired during item insertion into an owner's inventory/container.