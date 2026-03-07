---
id: trap_vines
title: Trap Vines
description: A deployable trap entity that detects moving targets within its radius, applies a movement speed debuff, and deals damage.
tags: [combat, trap, buff, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 41bed71a
system_scope: environment
---

# Trap Vines

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`trap_vines` is a deployable environmental trap prefab that functions as an automated combat trigger. When active, it periodically scans the surrounding area for valid targets within its AOE radius using the `combat`, `planardamage`, and `damagetypebonus` components. Upon detecting a moving, non-ally target, it applies a temporary movement speed reduction via the `locomotor` component and deals damage. The trap exists for a fixed duration before naturally despawning, and it persists state across world saves via `OnSave`/`OnLoad` callbacks. It also uses a companion `trap_vines_base_fx` prefab to render visual effects anchored to the trap.

## Usage example
```lua
-- Deploy a trap at world position (x, y, z)
local trap = SpawnPrefab("trap_vines")
if trap and TheWorld.ismastersim then
    trap.Transform:SetPosition(x, y, z)
    -- The trap will auto-initialize via its OnInit callback
end
```

## Dependencies & tags
**Components used:** `combat`, `planardamage`, `damagetypebonus`, `locomotor`, `timer`, `follower`
**Tags:** Adds `trap`, `trap_vines`, `NOCLICK`; checks `player`, `flying`, `ghost`, `companion`, `shadowminion`, `playerghost`, `FX`, `INLIMBO`, `DECOR`, `notarget`, `debuffed`.
**Prefabs referenced:** `trap_vines_base_fx`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `AOE_RADIUS` | number | `1` | Base radius for target detection. |
| `AOE_RANGE_PADDING` | number | `3` | Extra padding added to detection radius. |
| `variation` | number | `math.random(3)` | Variant ID (1, 2, or 3) controlling animation selection. |
| `_task` | task or nil | `nil` | Reference to the periodic update task (`OnUpdate`). |
| `_base` | entity or nil | `nil` | The attached visual FX entity (`trap_vines_base_fx`). |
| `caster` | entity or nil | `nil` | Optional caster (player) that triggered the trap, used for ally checks. |
| `sound` | boolean or nil | `nil` | Tracks whether the looped sound is playing. |

## Main functions
### `OnUpdate(inst)`
*   **Description:** The core periodic task that scans for valid targets within the trap's AOE, applies a movement debuff, and triggers damage on moving entities.
*   **Parameters:** `inst` (entity) — the trap instance.
*   **Returns:** Nothing.
*   **Error states:** Safely handles invalid or removed targets; skips entities not visible, outside hit range, or tagged as allies (including player companions and followers).

### `TryDoDamage(inst, target)`
*   **Description:** Attempts to deal damage to a target if it hasn't been hit recently (based on `TUNING.TRAP_VINES_HIT_COOLDOWN`).
*   **Parameters:** `inst` (entity), `target` (entity) — the entity to damage.
*   **Returns:** `true` if damage was dealt, `nil` otherwise.
*   **Error states:** Returns early without damage if the target was recently hit (track maintained in `TARGETS` table).

### `ApplyDebuff(inst, target)`
*   **Description:** Applies a temporary movement speed reduction to a target and cancels any existing debuff on it.
*   **Parameters:** `inst` (entity), `target` (entity).
*   **Returns:** Nothing.
*   **Error states:** Only applies if the target has a `locomotor` component; debuff is canceled when the target is removed or after `0.2` seconds.

### `DespawnTrap(inst)`
*   **Description:** Initiates the trap’s visual despawn animation and removes it from the world. Cancels pending decay timer if active.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.
*   **Error states:** Skips FX animation cleanup if `_base` is nil; sets `persists = false` to avoid saving.

### `StartSoundLoop(inst)`
*   **Description:** Starts the looped sound effect if not already playing.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `OnTimerDone(inst, data)`
*   **Description:** Callback fired when the decay timer finishes; triggers `DespawnTrap`.
*   **Parameters:** `inst` (entity), `data` (table) — timer data; checks `data.name == "decay"`.
*   **Returns:** Nothing.

### `OnInit(inst)`
*   **Description:** Initialization handler, called after a short delay; spawns visual FX, plays spawn animation, and starts the periodic update task.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Serializes the trap's variation and sound state for world persistence.
*   **Parameters:** `inst` (entity), `data` (table) — table to populate.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores trap state after loading; reinitializes the update task, visual FX, and animation if applicable.
*   **Parameters:** `inst` (entity), `data` (table or nil).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `timerdone` — fires `OnTimerDone` when the decay timer completes.
- **Listens to:** `onremove` — on targets (via `ForgetTarget`, `RemoveDebuff`) to clean up state when they are removed.
- **Listens to:** `animover` — used during despawn to call `inst.Remove` after animation finishes.
- **Pushes:** None.