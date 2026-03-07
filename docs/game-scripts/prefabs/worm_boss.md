---
id: worm_boss
title: Worm Boss
description: Manages the lifecycle, state transitions, and chunked composition of the Worm Boss enemy including spawn, combat, death, chunk persistence, and loot generation.
tags: [combat, boss, entity, loot, state]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 723b7a34
system_scope: entity
---

# Worm Boss

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `worm_boss` prefab implements the primary boss entity for the Worm Boss encounter. It is composed of a hierarchical system of modular pieces—head, tail, segments, and dirt chunks—managed collectively as a "chunked" boss. It coordinates movement, combat, thorn-based retaliation, and death progression, leveraging multiple components (`combat`, `health`, `groundpounder`, `lootdropper`, `inventory`, `sanityaura`, `updatelooper`, `colouradder`) and external utilities (`worm_boss_util.lua`, `easing`, `commonstates`). The boss supports save/load via `OnSave`/`OnLoad`/`OnLoadPostPass` to persist state across world reloads and handles entity sleep/wake cycles for offscreen optimization.

## Usage example
The Worm Boss is instantiated automatically by the game via its `Prefab` definitions. A modder would not typically create it manually, but may interact with it during events (e.g., when triggering the boss). Example interaction:
```lua
-- Example: Check if Worm Boss is currently active and get target
if TheWorld.entitysearcher:FindWithTag("worm_boss_piece") then
    local worm = TheWorld.entitysearcher:FindWithTag("worm_boss_piece")[1]
    if worm.components.combat.target then
        print("Worm Boss is targeting: " .. worm.components.combat.target.prefab)
    end
end
```

## Dependencies & tags
**Components used:**  
- `lootdropper`, `inventory`, `health`, `combat`, `updatelooper`, `sanityaura`, `groundpounder`, `inspectable`, `highlightchild`, `colouradder`, `timer`  
**Tags added:**  
- `NOCLICK`, `INLIMBO`, `NOBLOCK`, `groundpound_immune`, `worm_boss_piece`, `epic`, `wet` (main worm);  
- `groundpound_immune`, `worm_boss_piece` (head, tail, segment);  
- `worm_boss_dirt`, `hostile` (dirt chunks).  
**Tags checked:**  
- `_combat`, `INLIMBO`, `notarget`, `noattack`, `flight`, `invisible`, `playerghost`, `character`, `animal`, `monster` (retarget logic);  
- `worm_boss_piece`, `playerghost` (thorn damage filtering);  
- `player` (on-attack handler).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `chunks` | table | `{}` | Array of chunk objects, each containing `dirt_start`, `dirt_end`, `segments`, `head`, `tail`, `state`, etc. |
| `segment_pool` | table | `{}` | Pool of reusable `worm_boss_segment` prefabs for efficient allocation/deallocation. |
| `state` | number | `WORMBOSS_UTILS.STATE.EMERGE` | Current boss state (e.g., `EMERGE`, `DORMANT`, `DEAD`). Set via `SetState`. |
| `head` | entity or nil | `nil` | Reference to the head chunk when in "free head" form (pre-merge). |
| `targettime` | number or nil | `nil` | Timestamp of last target change; used for target validity. |
| `headlootdropped` | Vector3 or nil | `nil` | Position where the head was when loot was dropped on death. |
| `_thorns_targets` | table or nil | `nil` | Tracks recent thorn hits per target to enforce knockback cooldown. |
| `devoured` | boolean or nil | `nil` | Indicates if boss is currently devouring prey. |
| `new_crack` | entity or nil | `nil` | Reference to ground crack FX spawned during emergence. |
| `current_death_chunk` | number | `0` | Tracks progress through chunk erasure in death animation. |
| `_playingmusic` | boolean or nil | `nil` | Tracks whether worm boss music is currently playing. |

## Main functions
### `SetState(inst, state)`
*   **Description:** Updates the boss's current state. Prevents setting state to `DEAD` once already dead to preserve death logic integrity.
*   **Parameters:** `state` (number) — A state constant from `WORMBOSS_UTILS.STATE`.
*   **Returns:** Nothing.

### `RetargetFn(inst)`
*   **Description:** Computes a new valid target within `TUNING.WORM_BOSS_TARGET_DIST`, respecting `RETARGET_MUST_TAGS`, `RETARGET_CANT_TAGS`, and `RETARGET_ONEOF_TAGS`. Falls back to first valid dirt chunk position if `inst.chunks` is empty.
*   **Parameters:** `inst` — the boss instance.
*   **Returns:** `target` — an entity or `nil`.

### `KeepTargetFn(inst, target)`
*   **Description:** Determines if the current target remains valid. Checks if the boss is still valid, if target is within range for ≤20 seconds after acquisition, and if `combat:CanTarget(target)` passes.
*   **Parameters:** `target` — the candidate target entity.
*   **Returns:** `true` if target is still valid, otherwise `false`.

### `OnUpdate(inst, dt)`
*   **Description:** Main update loop. Ensures at least one chunk exists and calls `WORMBOSS_UTILS.UpdateChunk` for each chunk. This handles segment movement, growth, and state transitions per chunk.
*   **Parameters:** `dt` (number) — delta time in seconds.
*   **Returns:** Nothing.

### `ProcessThornDamage(inst, target)`
*   **Description:** Handles damage and knockback from thorns/spikes when a target touches a chunk. Applies damage via `combat:GetAttacked`, tracks hits per target over `DECAY_THORNS_EFFECT_TIME`, and triggers `WORMBOSS_UTILS.Knockback` if ≥3 hits accumulate.
*   **Parameters:** `target` — the entity struck by thorns.
*   **Returns:** Nothing.

### `OnDeath(inst, data)`
*   **Description:** Initiates death sequence: sets state to `DEAD`, removes `new_crack`, iterates chunks to tag dirt pieces as `notarget` and animate them idle, records head loot position, and spawns the appropriate head corpse variant via `WORMBOSS_UTILS.SpawnAboveGroundHeadCorpse` or `SpawnUnderGroundHeadCorpse`.
*   **Parameters:** `data` — event data (unused).
*   **Returns:** Nothing.

### `OnDeathEnded(inst)`
*   **Description:** Finalizes death. Spits out devoured creatures, plays death animations on segments/dirt, drops inventory and loot, then removes the entity.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SerializePosition(pos)`
*   **Description:** Converts a `Vector3` to a serializable `{x,z}` table (y is assumed 0).
*   **Parameters:** `pos` — `Vector3` or `nil`.
*   **Returns:** `{x = x, z = z}` or `nil`.

### `DeserializePosition(data)`
*   **Description:** Converts serialized `{x,z}` back to `Vector3`.
*   **Parameters:** `data` — table with keys `x`, `z`.
*   **Returns:** `Vector3(x, 0, z)`.

### `OnSave(inst, data)`
*   **Description:** Persists boss state. If `DEAD`, saves `headlootdropped` and segment `lootspots` positions; otherwise, saves chunk `groundpoint` positions. Omits chunk data if ≤1 chunk.
*   **Parameters:** `data` — table passed to `OnSave` for serialization.
*   **Returns:** `nil` if only one chunk (not worth saving).

### `OnLoad(inst, data)`
*   **Description:** Restores boss state and chunks from `data`. Reconstructs chunks, head, tail, and ground positions. Handles `DEAD` state by doing nothing (loot spawns in `OnLoadPostPass`).
*   **Parameters:** `data` — previously saved table.
*   **Returns:** Nothing.

### `OnLoadPostPass(inst, newents, data)`
*   **Description:** Handles delayed post-load actions. Spawns loot at saved segment positions, drops head loot if needed, and removes the entity if dead.
*   **Parameters:** `newents`, `data` — standard post-load arguments.
*   **Returns:** Nothing.

### `Worm_GetSegmentFromPool(inst)`
*   **Description:** Retrieves a segment from the pool or spawns a new one; reuses existing segments by calling `Restart`.
*   **Parameters:** `inst` — the boss instance.
*   **Returns:** `segment` — a `worm_boss_segment` entity.

### `Worm_ReturnSegmentToPool(inst, segment)`
*   **Description:** Recycles a segment into the pool after removing it from the scene and clearing highlights.
*   **Parameters:** `segment` — the segment entity.
*   **Returns:** Nothing.

### `PushMusic(inst)`
*   **Description:** Periodically triggers the worm boss music event for nearby players (within 20 units upon entering range, 40 units while playing).
*   **Parameters:** `inst` — the boss instance.
*   **Returns:** Nothing.

### `SetHighlightOwners(inst, owner1, owner2)`
*   **Description:** Public API to set highlight owners (client-side) via network sync. Calls internal `OnSetHighlightOwners`.
*   **Parameters:** `owner1`, `owner2` — entities or `nil`.
*   **Returns:** Nothing.

### `OnSetHighlightOwners(inst, owner1, owner2)`
*   **Description:** Core logic to attach/detach highlight owner relationships (colouradder integration). Runs on both servers and clients.
*   **Parameters:** `owner1`, `owner2` — entities or `nil`.
*   **Returns:** Nothing.

### `DoThornDamage(inst)`
*   **Description:** Checks nearby entities within AOE radius; applies thorn damage and tracking per `ProcessThornDamage`.
*   **Parameters:** `inst` — the chunk (dirt or segment) with spikes.
*   **Returns:** Nothing.

### `Segment_Restart(inst)`
*   **Description:** Resets a segment’s transform, animation, and state flags, preparing it for reuse from the pool.
*   **Parameters:** `inst` — the segment entity.
*   **Returns:** Nothing.

### `Segment_OnAnimOver(inst)`
*   **Description:** Handles animation completion for segments: returns to pool on tail/head animations, drops loot on death animations.
*   **Parameters:** `inst` — the segment entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `death` — triggers `OnDeath`.  
  - `death_ended` — triggers `OnDeathEnded`.  
  - `newcombattarget` — updates `targettime` via `NewTarget`.  
  - `attacked` — sets combat target on player hit (`OnAttacked`).  
  - `animover` — processes chunk and segment animation completion (`Dirt_OnAnimOver`, `Segment_OnAnimOver`).  
  - `electrocute` — initiates electrocution effect chain (`Dirt_OnElectrocute`).  
  - `segtimedirty`, `dirtpositiondirty`, `worm_boss_segment.hitevent` (client-only) — syncs segment prediction data.

- **Pushes:**  
  - `invincibletoggle` — via `health:SetInvincible`.  
  - `hightlighownerdirty` — client-side highlight sync trigger.  
  - `entity_droploot` — via `lootdropper:DropLoot`.  
  - `sync_electrocute` —电击 effect sync on head/tail.
