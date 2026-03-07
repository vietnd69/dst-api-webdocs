---
id: submersible
title: Submersible
description: Manages the submersion logic and underwater placement for salvageable entities, ensuring proper positioning in ocean tiles.
tags: [locomotion, salvage, environment, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: aaa1b38b
system_scope: environment
---

# Submersible

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Submersible` is a component that handles the process of submerging an entity (typically a salvaged item) into the ocean, including position validation, tile-space checks, and creation of the `underwater_salvageable` object. It is intended for use on items that can be recovered from the ocean and later placed back underwater. The component listens for `onsink` and `on_landed` events and reacts accordingly, using the `inventoryitem` component to determine where the item should be placed and the `world` map API to verify ocean tile placement.

## Usage example
```lua
local inst = Prefab("mysalvage")
inst:AddComponent("inventoryitem")
inst:AddComponent("submersible")
inst:AddTag("salvageable")

-- Trigger submersion logic (e.g., on player action)
inst:PushEvent("onsink", { boat = true })
```

## Dependencies & tags
**Components used:** `inventoryitem`, `inventory`, `transform`
**Tags:** Listens for events; no tags added, removed, or checked directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `force_no_repositioning` | boolean | `false` | When `true`, skips repositioning logic during submersion, forcing placement at the current location. |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Cleans up event listeners when the component is removed from the entity.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetUnderwaterObject()`
* **Description:** Returns the container entity if the current item is inside a valid underwater salvage container (i.e., an entity with the `underwater_salvageable` tag). Returns `nil` otherwise.
* **Parameters:** None.
* **Returns:** `Entity` or `nil`.
* **Error states:** Returns `nil` if `inventoryitem` is missing, if `GetContainer()` returns `nil`, or if the container lacks the `underwater_salvageable` tag.

### `OnLanded()`
* **Description:** Checks whether the entity landed on land but is still in water (e.g., due to falling off a boat). If so, immediately submerges again.
* **Parameters:** None.
* **Returns:** `nil`.

### `Submerge()`
* **Description:** Attempts to submerge the entity. Validates surroundings, checks for nearby obstacles or land, and optionally moves the entity to a valid ocean tile before spawning an `underwater_salvageable`. Repositioning may be skipped if `force_no_repositioning` is `true`.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if the entity was moved, otherwise `false`.

### `MakeSunken(x, z, ignore_boats, nosplash)`
* **Description:** Spawns an `underwater_salvageable` at the specified location, places the current entity into its inventory, and triggers the `on_submerge` event. Optionally avoids splash FX and ignores boat collisions.
* **Parameters:**
  * `x` (number) — X coordinate of placement.
  * `z` (number) — Z coordinate of placement.
  * `ignore_boats` (boolean?, optional) — If `true`, allows placement even if boats occupy the tile.
  * `nosplash` (boolean?, optional) — If `true`, suppresses the green splash FX.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes component state for save games.
* **Parameters:** None.
* **Returns:** `{ force_no_repositioning = boolean }`.

### `OnLoad(data)`
* **Description:** Restores component state from save data.
* **Parameters:** `data` (table) — Data returned by `OnSave()`.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onsink` — triggers submersion (often from boat sinking).
- **Pushes:** `on_submerge` — fired after successfully placing the entity underwater with an `underwater_salvageable`.
- **Listens to:** `on_landed` — triggers re-submersion check if landed in water.
- **Pushes:** None beyond `on_submerge`.
