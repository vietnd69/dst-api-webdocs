---
id: horrorfuel
title: Horrorfuel
description: Manages local visual effects and spell functionality for Wurt's shadow-based item in DST.
tags: [fx, spell, visual]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b32937cb
system_scope: fx
---

# Horrorfuel

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`horrorfuel` is a prefabricated item (inventory item with local FX) used in DST for Wurt's shadow magic system. It serves two primary roles:
1. **Local visual effects container** — spawns and manages an `animstate`-based entity (`core`) that visually pulses based on the player's sanity.
2. **Spellcasting item** — when used, it triggers a spell (`Wurt_MermSpellFn`) that activates nearby shadow minions and consumes the item.

The component does not define a standalone component class but instead *is* the prefab definition. Its behavior is implemented directly in the `fn()` constructor.

## Usage example
This is not a component to be added manually — it is a prefab. To use this item in gameplay, simply spawn or craft `horrorfuel` (typically via Wurt's unique recipes). In mod code, you may reference it via `TheWorld:SpawnPrefab("horrorfuel")`.

```lua
-- Example: Spawn the horrorfuel item (non-visual on dedicated server)
local item = TheWorld:SpawnPrefab("horrorfuel")
if item ~= nil then
    -- Can be given to player inventory, used as spell item, etc.
    item.components.inventoryitem:OnPutInInventory(player.components.inventory)
end
```

## Dependencies & tags
**Components used:**
- `stackable`
- `inspectable`
- `fuel`
- `repairer`
- `waterproofer`
- `inventoryitem`
- `spellcaster`

**Tags added:**
- `waterproofer`
- `purehorror`
- `mermbuffcast`
- `FX` (only on the local FX `core` entity)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `core` | Entity or `nil` | `nil` | Local-only visual FX entity (not replicated). Only created on clients/non-dedicated servers. |
| `currentlight` | number | `0` | Current light override intensity (smoothed). |
| `targetlight` | number | `0` | Target light override intensity (based on sanity). |
| `highlightchildren` | table | `{ inst.core }` | Used for highlighting logic in editor/UI (non-functional in gameplay). |
| `scrapbook_anim` | string | `"scrapbook"` | Animation name used when displayed in scrapbook. |
| `lightcolour` | table | `{102/255, 16/255, 16/255}` | RGB color of emitted light (normalized 0–1). |
| `fxprefab` | string | `"horrorfuel_castfx"` | Prefab name used when casting the spell. |
| `castsound` | string | `"meta4/casting/shadow"` | Sound event path played on spell cast. |
| `_player` | Entity or `nil` | `nil` | Internal reference to the currently watched player for sanity tracking. |

## Main functions
### `Wurt_MermSpellFn(inst, target, pos, doer)`
*   **Description:** Spell function executed when the item is used as a spell. It activates Wurt's shadow minions by applying the `wurt_merm_planar` debuff and cheering them, then destroys the item.
*   **Parameters:**
    * `inst` (Entity) — The `horrorfuel` item instance.
    * `target` (Entity) — Target entity passed on cast (unused in this implementation).
    * `pos` (Vector3) — Target position (unused in this implementation).
    * `doer` (Entity) — The entity casting the spell (typically the player).
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; assumes `doer.components.leader` and minion components exist. If the item is not stackable, `inst:Remove()` is called directly.

### `CalcTargetLightOverride(player)`
*   **Description:** Computes the target light intensity for the local FX entity based on player sanity.
*   **Parameters:**
    * `player` (Entity or `nil`) — The player whose sanity is being evaluated.
*   **Returns:** Number in `[0, 1]` — 0 if sanity is ≥60% or no player; otherwise increases as sanity decreases to 0%.
*   **Error states:** Returns `0` if `player` is `nil`, or if sanity replica is missing or not in insanity mode.

### `UpdateLightOverride(inst, instant)`
*   **Description:** Updates the `AnimState` light override on the FX entity. Uses linear interpolation unless `instant` is `true`.
*   **Parameters:**
    * `inst` (Entity) — The FX entity (`core`).
    * `instant` (boolean) — If `true`, sets `currentlight` directly to `targetlight`.
*   **Returns:** Nothing.

### `OnSanityDelta(player, data)`
*   **Description:** Event callback that instantly updates all active `horrorfuel` entities when sanity changes (except overtime).
*   **Parameters:**
    * `player` (Entity) — The player whose sanity changed.
    * `data` (table) — Sanity change data (checks `data.overtime`).
*   **Returns:** Nothing.

### `OnEntityWake(inst)`
*   **Description:** Registers the entity to monitor sanity changes and starts a periodic task to update light override.
*   **Parameters:**
    * `inst` (Entity) — The entity being woken (either the main item or its `core`).
*   **Returns:** Nothing.

### `OnEntitySleep(inst)`
*   **Description:** Stops monitoring and cancels the periodic task when the entity falls asleep.
*   **Parameters:**
    * `inst` (Entity) — The entity falling asleep.
*   **Returns:** Nothing.

### `CreateCore()`
*   **Description:** Helper to spawn and configure the local FX entity (`core`). Not a component function; used only by `fn()`.
*   **Parameters:** None.
*   **Returns:** Entity — Non-networked, non-persistent FX entity.
*   **Error states:** None.

## Events & listeners
- **Listens to:** `sanitydelta` — updates FX lighting when player sanity changes.
- **Listens to:** `onremove` — clears the watched `_player` reference when the player is removed.
- **Listens to:** `playeractivated` — switches monitored player to the newly activated one.
- **Pushes:** None — this entity does not push events.