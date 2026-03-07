---
id: deer
title: Deer
description: Manages the behavior, combat, and lifecycle of deer entities, including antler growth, migration, and gemmed variants that cast spells.
tags: [combat, ai, event, migration, boss]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d8fee5bb
system_scope: entity
---

# Deer

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The deer prefab defines the core logic for deer entities in DST, including base deer and gemmed variants (red/blue). It integrates with multiple components to handle combat (damage, retargeting, sharing), state behavior (sleep/wake, antler shedding), and migration (entity-based spawning/despawning based on proximity to structures). Gemmed deers function as spellcasters under a keeper's command, with complex targeting and spell placement logic to avoid overlap. The component is primarily instantiated via `common_fn`, `redfn`, and `bluefn` factory functions that configure variant-specific properties.

## Usage example
```lua
-- Create a standard deer
local deer = Prefab("deer", fn, assets, prefabs)()

-- Create a red gemmed deer
local red_deer = Prefab("deer_red", redfn, assets, redprefabs)()

-- Set up antler regrowth timer
deer.components.timer:StartTimer("growantler", TUNING.TOTAL_DAY_TIME)

-- Initiate migration behavior
deer:PushEvent("deerherdmigration")

-- Grow new antlers manually (e.g., from custom logic)
deer:SetAntlered(math.random(3), true)
```

## Dependencies & tags
**Components used:**  
`health`, `combat`, `sleeper`, `lootdropper`, `inspectable`, `locomotor`, `drownable`, `burnable`, `freezable`, `timer`, `knownlocations`, `entitytracker`, `saltlicker`, `spawnfader`, `workable`, `physics`

**Tags:**  
Adds `deer`, `animal`, `saltlicker` (for base deer), `deergemresistance` (for gemmed deer), `notaunt` (when under keeper command), and temporary tags like `FX`/`NOCLICK` for FX prefabs.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `hasantler` | number or nil | `nil` | Current antler variant (1, 2, or 3); `nil` when no antlers. |
| `migrating` | boolean or nil | `nil` | Whether the deer is in migration mode (spawns/de-spawns based on nearby structures). |
| `engaged` | boolean or nil | `nil` | For gemmed deers: whether they are currently engaged in casting (affects spell cooldown). |
| `gem` | "red" or "blue" or nil | `nil` | Variant type: `"red"` (fire spells), `"blue"` (ice spells), or `nil` (standard deer). |
| `castfx` | string | `"deer_fire_circle"` or `"deer_ice_circle"` | Prefab name of the spell to spawn for gemmed variants. |
| `castduration` | number | `4` or `6` | Duration in seconds before spell FX is destroyed. |
| `castcd` | number | `TUNING.DEER_*_CAST_CD` | Cooldown duration after casting successfully. |

## Main functions
### `setantlered(inst, antler, animate)`
*   **Description:** Sets or removes antlers on the deer and configures collision callbacks. Triggers FX events when `animate` is `true`.
*   **Parameters:**  
    `antler` (number or nil) — Antler type (1–3) or `nil` to remove antlers.  
    `animate` (boolean) — If `true`, pushes `"growantler"` event; otherwise calls `ShowAntler()` directly.
*   **Returns:** Nothing.

### `onqueuegrowantler(inst)`
*   **Description:** Starts a timer to randomly regrow antlers after `TUNING.TOTAL_DAY_TIME` seconds (plus random variance). Only starts if no antlers exist and timer is not already active.
*   **Parameters:** `inst` (entity) — The deer instance.
*   **Returns:** Nothing.
*   **Error states:** No effect if antlers are already present or timer is active.

### `FindCastTargets(inst, target)`
*   **Description:** Determines valid spell targets for gemmed deers. Supports single-target (if keeper provides target) or multi-target (when commanded).
*   **Parameters:**  
    `inst` (entity) — The gemmed deer instance.  
    `target` (entity or nil) — Optional target provided by keeper.
*   **Returns:** `{ entity }` (list of valid targets) or `nil` if none found.
*   **Error states:** Returns `nil` if target is invalid, dead, out of range, or overlaps existing spell circles. Multi-target list is capped at `SPELL_MAX_TARGETS = 20`.

### `DoCast(inst, targets)`
*   **Description:** Attempts to spawn spell FX for all valid targets, respecting overlap limits and cast cap (`TUNING.DEER_GEMMED_MAX_SPELLS`). Resets and restarts cast cooldown timer.
*   **Parameters:**  
    `inst` (entity) — The gemmed deer instance.  
    `targets` (`{ entity }` or nil) — List of target entities.
*   **Returns:** `{ entity }` — List of spawned spell prefabs, or `nil` if no spells cast.
*   **Error states:** Returns `nil` if `targets` is `nil` or all potential spell positions overlap within `SPELL_OVERLAP_MIN`.

### `SetEngaged(inst, engaged)`
*   **Description:** Manages cast engagement state for gemmed deers. When `true`, disables listening to `"newcombattarget"` and starts a cast cooldown timer. When `false`, re-enables the listener.
*   **Parameters:**  
    `inst` (entity) — The gemmed deer instance.  
    `engaged` (boolean) — Engagement state.
*   **Returns:** Nothing.

### `OnGotCommander(inst, data)`
*   **Description:** Handles assignment to a new keeper (commander). Records keeper location, adds `"notaunt"` tag, and notifies commander component to track this deer as a soldier.
*   **Parameters:** `data.commander` (entity) — The new keeper entity.
*   **Returns:** Nothing.

### `OnLostCommander(inst, data)`
*   **Description:** Cleans up when detached from a keeper. Forgets keeper location and removes `"notaunt"` tag.
*   **Parameters:** `data.commander` (entity) — The former keeper entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `"attacked"` — Triggers combat retargeting and sharing (varies by variant).  
  `"queuegrowantler"` — Queues antler regrowth timer for base deer.  
  `"timerdone"` — Handles antler regrowth completion (`data.name == "growantler"`).  
  `"deerherdmigration"` — Initiates migration mode.  
  `"gotcommander"` / `"lostcommander"` — Manages keeper relationships for gemmed deer.  
  `"newcombattarget"` — Triggers engagement for gemmed deer (disabled during active cast).

- **Pushes:**  
  `"growantler"` — Fired when antler growth animation begins.  
  `"soldierschanged"` — Pushed by `commander` component (via `AddSoldier`).  
  `"gotcommander"` / `"lostcommander"` — Pushed by external commander components.  
  `"on_loot_dropped"` — Pushed on loottarget drop.