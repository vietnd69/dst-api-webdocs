---
id: rabbitkinghorn
title: Rabbitkinghorn
description: A consumable musical instrument that summons a rabbit king chest when used; tracks usage and validates spawn locations.
tags: [instrument, tool, consumable, boss, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9da7fd21
system_scope: environment
---

# Rabbitkinghorn

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`rabbitkinghorn` is a_prefab_ that represents a playable horn used during the Rabbit King event. It functions as an `instrument`, `tool`, and `finiteuses`-enabled item: playing the horn may summon a `rabbitkinghorn_chest` if the player stands on valid ground, and its uses are consumed upon successful gameplay. The component logic resides in its prefab constructor function (`fn`) and does not define a separate component class — it relies entirely on stock components (`instrument`, `tool`, `finiteuses`, `inspectable`, `inventoryitem`) and custom callback functions (`OnPlayed`, `OnHeard`, `UseModifier`) for behavior.

## Usage example
The prefab is instantiated automatically by the game when spawned via `SpawnPrefab("rabbitkinghorn")`. Modders typically do not need to manually invoke internal logic, but for reference:

```lua
local horn = SpawnPrefab("rabbitkinghorn")
-- After equipping and playing, usage and chest-spawn behavior are handled automatically
-- via the instrument hooks and finiteuses logic defined in the prefab.
```

## Dependencies & tags
**Components used:** `instrument`, `tool`, `finiteuses`, `inspectable`, `inventoryitem`, `talker` (optional), `farmplanttendable` (optional).  
**Tags added:** `horn`, `tool`.  
**Tags checked:** `player` (in `UtterFailToSpawn`), `INLIMBO`, `NOCLICK`, `FX` (in area checks), and `ignoretalking` (via talker component logic).

## Properties
No public properties are defined or exposed on the instance beyond those managed by its components. Custom properties used internally are:
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `rabbitkinghorn_shouldfiniteuses_use` | boolean or nil | `nil` | Internal flag used to indicate whether a use should consume a finite charge. |
| `rabbitkinghorn_badspawnpoint` | boolean or nil | `nil` | Set if a chest spawn attempt fails due to invalid terrain; triggers a talker message. |
| `rabbitkinghorn_failtask` | Task or nil | `nil` | Task reference used to delay the spawn-failure announcement. |

## Main functions
The prefab itself does not define standalone functions — logic is encapsulated in callback functions passed to components.

### `OnPlayed(inst, musician)`
* **Description:** Callback invoked when the horn is played. Attempts to spawn a `rabbitkinghorn_chest` at a nearby valid position, or marks the item as unusable if the player's location is invalid.
* **Parameters:**  
  `inst` (Entity) — the horn instance.  
  `musician` (Entity) — the player who played the horn.  
* **Returns:** Nothing.

### `OnHeard(inst, musician, instrument)`
* **Description:** Callback invoked when the horn sound is heard. Triggers `TendTo` on the `farmplanttendable` component (if present), marking a tendable plant as tended.
* **Parameters:**  
  `inst` (Entity) — the horn instance.  
  `musician` (Entity) — the player who played the horn.  
  `instrument` (Entity) — the instrument component's source entity.  
* **Returns:** Nothing.

### `UseModifier(uses, action, doer, target, item)`
* **Description:** Modifies usage consumption for the `finiteuses` component. Returns `0` (no consumption) if the item failed to spawn a chest (`rabbitkinghorn_badspawnpoint`) or did not signal use (`rabbitkinghorn_shouldfiniteuses_use` is absent); otherwise returns `uses` unchanged.
* **Parameters:**  
  `uses` (number) — current usage count.  
  `action` (string) — action being performed (e.g., `"PLAY"`).  
  `doer` (Entity) — entity performing the action.  
  `target` (Entity or nil) — target entity (unused).  
  `item` (Entity or nil) — the horn instance being used.  
* **Returns:** `0` (if consumption should be skipped) or `uses` (if consumption proceeds).  
* **Error states:** Returns early with `0` if `item` is `nil` or lacks the `rabbitkinghorn_shouldfiniteuses_use` flag.

### `UtterFailToSpawn(doer)`
* **Description:** Internal helper used to display a localized message if the horn fails to spawn a chest due to bad terrain.
* **Parameters:**  
  `doer` (Entity) — the player who used the horn.  
* **Returns:** Nothing.  
* **Error states:** Does nothing if the `talker` component is missing or the doer lacks the `"player"` tag.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls in this prefab).
- **Pushes:** None (no `inst:PushEvent` calls in this prefab).
