---
id: yot_catcoonshrine
title: Yot Catcoonshrine
description: Acts as a special祭坛 that holds a birdfeather offering and becomes a prototyper once activated; supports burning, hammering, and state persistence.
tags: [crafting, structure, item_interaction, fire, persistence]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e3778dcb
system_scope: crafting
---

# Yot Catcoonshrine

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `yot_catcoonshrine` is a structure that functions as a offering altar and prototype station. When empty, it can accept a `birdfeather` item as an offering, after which it becomes a functional prototyper for Catcoon-related recipes. It supports burning, extinguishing, and hammering, with state transitions affecting its behavior: burnt shrines are destroyed upon damage, while non-burnt shrines may offer loot when struck. The component integrates with several systems: `workable` (for hammering), `burnable` (for fire damage), `lootdropper` (for item drops), `hauntable` (for hauntable decay), and `inspectable` (for UI status display).

## Usage example
```lua
local shrine = SpawnPrefab("yot_catcoonshrine")
shrine.Transform:SetPosition(x, y, z)

-- Accept a birdfeather offering
local offering = SpawnPrefab("birdfeather")
shrine.components.trader:AcceptItem(offering)

-- Or manually set offering and trigger state change
shrine.components.workable:WorkedBy(player)
```

## Dependencies & tags
**Components used:** `inspectable`, `prototyper`, `lootdropper`, `workable`, `burnable`, `propagator`, `hauntable`, `trader`
**Tags:** Adds `structure`, `catcoonshrine`, `prototyper` (in pristine state); checks `burnt`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `offering` | entity or `nil` | `nil` | The birdfeather item currently offered in the shrine. |

## Main functions
### `SetOffering(inst, offering, loading)`
* **Description:** Sets a `birdfeather` item as the current offering, updates visual symbolism, and transitions the shrine to a prototyper state.
* **Parameters:** `offering` (entity) — the item to offer; `loading` (boolean) — if `true`, suppresses sound and animation feedback.
* **Returns:** Nothing.

### `MakeEmpty(inst)`
* **Description:** Clears the current offering and restores the shrine to its empty state with trader functionality. Removes the `prototyper` tag and re-adds the `trader` component if missing.
* **Parameters:** `inst` — the shrine entity.
* **Returns:** Nothing.

### `OnBurnt(inst)`
* **Description:** Handles the burnt state transition: clears the offering, removes the `trader` component, and drops `ash` if an offering was present.
* **Parameters:** `inst` — the shrine entity.
* **Returns:** Nothing.

### `OnIgnite(inst)`
* **Description:** Triggered when the shrine catches fire: drops `ash` if an offering exists, empties the shrine, and disables the trader.
* **Parameters:** `inst` — the shrine entity.
* **Returns:** Nothing.

### `OnExtinguish(inst)`
* **Description:** Re-enables the trader when fire is extinguished, after calling `DefaultExtinguishFn`.
* **Parameters:** `inst` — the shrine entity.
* **Returns:** Nothing.

### `DropOffering(inst, worker)`
* **Description:** Removes and returns the current offering to the scene. If `worker` is provided, launches the item toward the worker; otherwise flings it at the shrine's position.
* **Parameters:** `inst` — the shrine entity; `worker` (entity or `nil`) — entity that removed the offering.
* **Returns:** Nothing.

### `GetStatus(inst)`
* **Description:** Returns the current status string for the `inspectable` component: `"BURNT"` if burnt, `"EMPTY"` if a functional trader exists, or `nil` otherwise.
* **Parameters:** `inst` — the shrine entity.
* **Returns:** `string` — status label; `nil` if unavailable.

## Events & listeners
- **Listens to:** `onremove` (offering) — triggers `MakeEmpty`; `onbuilt` — calls `onbuilt`; `ondeconstructstructure` — calls `DropOffering`.
- **Pushes:** `loot_prefab_spawned` — fired via `lootdropper`; `onextinguish`, `onignite`, `onburnt` — via `burnable` component.