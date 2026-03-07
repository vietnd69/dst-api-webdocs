---
id: alterguardian_phase1
title: Alterguardian Phase1
description: Constructs the first phase of the Alterguardian boss entity, including its combat behavior, health system, teleportation logic, and support for multiple cosmetic variants (basic, lunar rift, and gestalt).
tags: [combat, boss, ai, entity]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0333cc36
system_scope: entity
---

# Alterguardian Phase1

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `alterguardian_phase1` prefab defines the first phase of the Alterguardian boss in DST. It sets up a large, aggressive entity with rolling mechanics, shield phases, and gestalt summoning. This prefab uses multiple post-initializers (`common_postinit_basic`, `common_postinit_rift`, `riftgestaltfn`) to support variants (standard, lunar rift, and gestalt), each adjusting stats, visuals, and components. The core logic includes dynamic retargeting, collision handling, music triggering, and camera focus support.

Key responsibilities:
- Initialization of combat, health, locomotion, and timer components.
- Definition of boss behavior via custom functions (`Retarget`, `KeepTarget`, `teleport_override_fn`).
- Support for three variants (basic, lunar rift, and gestalt) with distinct assets and behaviors.

## Usage example
```lua
-- Create standard Alterguardian Phase1
local boss = Prefab("alterguardian_phase1", fn, assets, prefabs)

-- Spawn the boss at a specific location
local inst = SpawnPrefab("alterguardian_phase1")
if inst ~= nil then
    inst.Transform:SetPosition(x, y, z)
end
```

## Dependencies & tags
**Components used:**  
`locomotor`, `health`, `combat`, `sanityaura`, `lootdropper`, `inspectable`, `knownlocations`, `timer`, `teleportedoverride`, `drownable`, `hauntable`, `focalpoint` (via `TheFocalPoint`), `colouraddersync` (local rift only), `planarentity`, `planardamage`, `gestaltcapturable` (riftgestalt only)

**Tags added:**  
`brightmareboss`, `epic`, `hostile`, `largecreature`, `mech`, `monster`, `noepicmusic`, `scarytoprey`, `soulless`, `lunar_aligned`  
(Additional tags for rift/gestalt variants: `FX`, `brightmare`, `NOCLICK`, `nointerpolate`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst._is_shielding` | boolean | `nil` | True when the boss is in shield mode, absorbing damage. |
| `inst._collisions` | table | `nil` | Tracks recently collided entities during roll phase. |
| `inst._playingmusic` | boolean | `false` | Whether boss music is currently playing. |
| `inst._start_sleep_time` | number | `nil` | Timestamp when sleep began, used to regain health on wake. |
| `inst.scrapbook_adddeps` | table | See source | Dependencies for scrapbook entries. |
| `inst.scrapbook_damage` | table | `[damage1, damage3]` | Damage values shown in scrapbook. |
| `inst.scrapbook_maxhealth` | number | Sum of all phase healths | Total health pool shown in scrapbook. |

## Main functions
### `EnableRollCollision(enable)`
*   **Description:** Enables or disables collision callbacks for the rolling state. When enabled, the boss detects collisions with valid targets and performs on-collision effects (e.g., damage, sound).
*   **Parameters:** `enable` (boolean) – whether to activate collision callbacks.
*   **Returns:** Nothing.

### `EnterShield(inst)`
*   **Description:** Activates the boss’s shield mode, setting health absorption and triggering gestalt summoning if not on cooldown.
*   **Parameters:** `inst` (entity instance) – the boss entity.
*   **Returns:** Nothing.

### `ExitShield(inst)`
*   **Description:** Deactivates the boss’s shield mode, resetting health absorption to zero.
*   **Parameters:** `inst` (entity instance) – the boss entity.
*   **Returns:** Nothing.

### `SetNoMusic(inst, val)`
*   **Description:** Adds or removes the `nomusic` tag on the boss and triggers music update logic.
*   **Parameters:** `inst` (entity instance), `val` (boolean) – whether to disable music.
*   **Returns:** Nothing.

### `Retarget(inst)`
*   **Description:** Searches for new valid targets within range that satisfy tag conditions (`_combat`, excluding `INLIMBO`/`playerghost`, and having one of `character`/`monster`/`shadowminion`). Returns the first valid target found.
*   **Parameters:** `inst` (entity instance).
*   **Returns:** `newtarget` (entity) or `nil`. Also returns a `true` flag when a new target is found.
*   **Error states:** Returns `nil` if no eligible target is found or the current target remains valid.

### `DoGestaltSummon(inst)`
*   **Description:** Spawns a variable number of gestalt minions in a ring around the boss, using timing delays and randomized positions. Also plays a summoning FX and starts the summon cooldown timer.
*   **Parameters:** `inst` (entity instance).
*   **Returns:** Nothing.

### `teleport_override_fn(inst)`
*   **Description:** Calculates a safe destination position after teleportation, attempting to find a walkable offset within a radius.
*   **Parameters:** `inst` (entity instance).
*   **Returns:** `Vector3` – destination position, or current position if no valid offset found.

### `Inspect_boss(inst)`
*   **Description:** Returns status string `"DEAD"` if the boss is in the `dead` state tag.
*   **Parameters:** `inst` (entity instance).
*   **Returns:** `"DEAD"` or `nil`.

### `commonfn(common_postinit, server_postinit)`
*   **Description:** Main constructor function used to build the base entity with shared logic. Invoked by all three prefab variants via wrapper functions (`fn`, `riftfn`, `riftgestaltfn`).
*   **Parameters:** `common_postinit` (function, optional), `server_postinit` (function, optional) – callbacks for variant-specific setup.
*   **Returns:** `inst` (entity instance).

## Events & listeners
- **Listens to:**
  - `"musicdirty"` – triggers `OnMusicDirty(inst)`.
  - `"attacked"` – triggers `OnAttacked(inst, data)` (regains health, suggests new target, plays hit sound).
  - `"phasetransition"` – triggers `OnPhaseTransition(inst)` (spawns Phase2).
  - `"blocked"` – triggers `play_custom_hit(inst)`.
  - `"timerdone"` – triggers `on_timer_finished(inst, data)`.
  - `"camerafocusdirty"` (client-only) – triggers `rift_OnCameraFocusDirty(inst)`.
  - `"onremove"` (internal for `focalpoint`/`OnMusicDirty`).

- **Pushes:**
  - `"triggeredevent"` – for music start/stop (via `ThePlayer:PushEvent(...)`).
  - `"startspawnanim"` – via `inst:PushEvent(...)`.
  - `"healthdelta"` – via `Health:DoDelta` (inherited from component).
  - `"attacked"` – via `OnPhaseTransition` (when spawning Phase2, sets target).
  - `"endloop"` – on FX cleanup (`spawn_warning:PushEvent("endloop")`).