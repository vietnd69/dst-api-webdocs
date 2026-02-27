---
id: revivablecorpse
title: Revivablecorpse
description: Enables an entity to be flagged as a corpse and provides server-side logic for revival speed modifiers, health percentage on revival, and triggering resurrection events.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: d6e989bc
---

# Revivablecorpse

## Overview
This component allows an entity to be designated as a "corpse" and manages revival-related properties such as revive speed multipliers (based on tags), the health percentage restored upon revival, and the ability to trigger a resurrection event from the corpse. It operates on both client and server, but core state and logic (e.g., corpse tagging, health percent, revival event) only function in the master simulation (server) context.

## Dependencies & Tags
- **Tags Used/Modified:** `"corpse"` (added/removed via `SetCorpse`)
- **Component Dependencies:** None explicitly declared in this file (relies on standard `inst` behavior such as `HasTag`, `AddTag`, `RemoveTag`, `PushEvent`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance the component is attached to. |
| `ismastersim` | `boolean` | `TheWorld.ismastersim` | Indicates whether this instance is running in master simulation (server). |
| `canberevivedbyfn` | `function` | `nil` | Optional custom filter function `(corpse, reviver) → boolean` to determine if revival is allowed. |
| `revive_health_percet` | `number` | `0.5` (server only) | Health percentage (as decimal) to restore upon revival. *(Note: Typo in field name `revive_health_percet` vs. intended `revive_health_percent`.)* |
| `revivespeedmult` | `number` | `1` (server only) | Base multiplier applied to revive speed. |
| `tagmults` | `table` | `nil` (server only) | Optional map of `{ tag = multiplier }` to modify revive speed based on reviver's tags. |

## Main Functions

### `SetCanBeRevivedByFn(fn)`
* **Description:** Sets an optional filter function that determines whether a given reviver can revive this corpse. The function receives `(corpse_entity, reviver_entity)` and must return `true` to allow revival.
* **Parameters:**
  * `fn (function?)` — Function `(corpse, reviver) → boolean`, or `nil` to remove the filter.

### `CanBeRevivedBy(reviver)`
* **Description:** Checks whether the corpse can be revived by the specified reviver. Returns `false` if the entity lacks the `"corpse"` tag, or if `canberevivedbyfn` is defined and returns `false`.
* **Parameters:**
  * `reviver (Entity)` — The entity attempting to revive the corpse.

### `SetReviveSpeedMult(mult)`
* **Description:** Sets the base revival speed multiplier. Only effective on the server (`ismastersim`).
* **Parameters:**
  * `mult (number)` — New base multiplier for revive speed.

### `SetReviveSpeedMultForTag(tag, mult)`
* **Description:** Applies or removes a tag-specific multiplier to the revive speed. If `mult` is `nil` or `1`, the tag entry is removed. Otherwise, it is added/updated in `tagmults`. Only effective on the server.
* **Parameters:**
  * `tag (string)` — Tag name to match on the reviver entity.
  * `mult (number?)` — Multiplier to apply if reviver has the tag; `nil` or `1` removes the entry.

### `GetReviveSpeedMult(reviver)`
* **Description:** Calculates the effective revive speed multiplier for a given reviver by multiplying the base `revivespeedmult` with any tag-based modifiers in `tagmults`.
* **Parameters:**
  * `reviver (Entity)` — The entity reviving the corpse.

### `SetCorpse(corpse)`
* **Description:** Adds or removes the `"corpse"` tag on the entity, depending on the boolean argument. Only effective on the server.
* **Parameters:**
  * `corpse (boolean)` — `true` to tag as corpse; `false` to remove the tag.

### `Revive(reviver)`
* **Description:** Triggers a `"respawnfromcorpse"` event on the entity (server only), signaling intent to resurrect. The actual revival logic is handled elsewhere (e.g., by health or prefab scripts).
* **Parameters:**
  * `reviver (Entity)` — The reviving entity; passed in the event data as `source` and `user`.

### `SetReviveHealthPercent(percent)`
* **Description:** Sets the health percentage to restore upon revival. Only effective on the server.
* **Parameters:**
  * `percent (number)` — Decimal fraction (e.g., `0.5` for 50%).

### `GetReviveHealthPercent()`
* **Description:** Returns the current health percentage set for revival. Only implemented on the server.
* **Returns:** `number` — Current `revive_health_percet` value.

## Events & Listeners
- **Listens for:** None  
- **Triggers:**  
  - `"respawnfromcorpse"` — Pushed via `self.inst:PushEvent(...)` in `Revive` with payload `{ source = reviver, user = reviver }`.