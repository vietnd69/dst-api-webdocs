---
id: oar
title: Oar
description: Handles rowing logic and failure mechanics for a player interacting with a boat.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 6a7ba30b
---

# Oar

## Overview
The `Oar` component manages the interaction between a player (typically rowing) and a boat’s physics system. It applies rowing forces to move the boat and handles failure states, including applying wetness damage to nearby entities when a row action fails.

## Dependencies & Tags
* Requires entity `inst` to have `Transform` and `playercontroller` components (used via `doer`).
* Depends on `doer` having optional `expertsailor` and `moisture` components.
* Relies on `platform` entity having `boatphysics` component and `moisture` functionality.
* No tags are added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fail_idx` | `number` | `0` | Index used to cycle through failure message variants (modulus `fail_string_count`). |
| `fail_string_count` | `number` | `3` | Number of distinct failure message variants (used for cycling `fail_idx`). |
| `fail_wetness` | `number` | `9` | Base amount of wetness added to nearby entities on row failure. |
| `max_velocity` | `number` | `TUNING.BOAT.MAX_FORCE_VELOCITY` | Maximum velocity cap for rowing force application. |
| `force` | `number` | `0.4` | Base rowing force applied to the boat. |

## Main Functions

### `Row(doer, pos)`
* **Description:** Applies rowing force to the current boat platform based on the player's position and orientation, respecting expert sailor bonuses. Triggers `"rowing"` and `"rowed"` events.
* **Parameters:**
  * `doer` (`Entity`): The entity (typically a player) performing the rowing action.
  * `pos` (`Vector3`): The position used to compute the intended rowing direction *unless* the player is locally controlled — in that case, the direction is inverted (from boat to player).

### `RowFail(doer)`
* **Description:** Handles a failed rowing action by increasing wetness on nearby wettable entities (e.g., via `moisture` component) and returning a randomized failure string identifier. Updates `fail_idx` to cycle messages.
* **Parameters:**
  * `doer` (`Entity`): The entity attempting to row (used for position and moisture effect calculation).
* **Returns:** A string `"BAD_TIMING" + N`, where `N` is the current `fail_idx` (0–2).

## Events & Listeners
* **Events pushed:**
  * `"rowing"` — pushed by `doer` (the rowing player) during a successful row.
  * `"rowed"` — pushed by `platform` (the boat), with `doer` passed as data.
* **No event listeners** are registered in this component.