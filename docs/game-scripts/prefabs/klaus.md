---
id: klaus
title: Klaus
description: Manages the gameplay logic and state transitions for the Klaus boss entity, including phase changes, ally summoning, aggro management, and environmental interactions.
tags: [combat, ai, boss, event]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c884ff73
system_scope: entity
---

# Klaus

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`klaus.lua` defines the prefab and core behavior of Klaus, a boss entity in Don't Starve Together. It coordinates multiple components (`health`, `combat`, `commander`, `grouptargeter`, `sleeper`, `sanityaura`, etc.) to implement a multi-phase boss with phase transitions (based on health thresholds), helper summoning (red and blue deer), music control, chain-breaking mechanics (Unchained state), and rage state activation. The prefab is initialized using a factory function `fn()` and supports client-server network synchronization via `net_bool` variables.

## Usage example
Klaus is not intended to be manually instantiated by mods. It is instantiated by the game via its prefab definition. However, modders can interact with its public methods on the master server:
```lua
-- Example of triggering an action in the game logic (e.g., after an event)
local klaus = TheWorld:FindPrefab("klaus")
if klaus and not klaus.components.health:IsDead() then
    klaus:PushEvent("transition") -- Forces phase transition manually
    klaus:SpawnDeer() -- Manually spawn deer helpers
end
```

## Dependencies & tags
**Components used:** `spawnfader`, `inspectable`, `lootdropper`, `sleeper`, `locomotor`, `health`, `healthtrigger`, `combat`, `explosiveresist`, `grouptargeter`, `commander`, `timer`, `sanityaura`, `epicscare`, `knownlocations`, `drownable`, `burnable`, `freezable`, `talker` (via `Say` call).  
**Tags added:** `epic`, `noepicmusic`, `monster`, `hostile`, `scarytoprey`, `largecreature`, `deergemresistance`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `engaged` | boolean or `nil` | `nil` | Indicates whether Klaus is currently engaged in combat (affects health regen and command cooldown). |
| `nohelpers` | boolean or `nil` | `nil` | Prevents helper summoning until reset (e.g., on entering Phase 2 or rage). |
| `enraged` | boolean | `false` | `true` when Klaus has entered the enraged state (increased size, scaled stats, no helpers). |
| `recentattackers` | table | `{}` | Maps attacker entities to timer handles (for resetting attacker tracking after 30 seconds). |
| `recentlycharged` | table | `{}` | Maps damaged workable entities to `true` (to prevent repeated charging damage within 3 seconds). |
| `_unchained` | `net_bool` | `false` | Networked state indicating whether Klaus's chains have been broken (affects sanity, music, burnable state). |
| `_pausemusic` | `net_bool` | `false` | Networked state for music pausing (e.g., during boss death or state transitions). |
| `_playingmusic` | boolean | `false` | Local flag to prevent redundant music triggers. |
| `deer_dist` | number | `3.5` | Distance offset for deer positioning relative to Klaus. |
| `hit_recovery` | number | `TUNING.KLAUS_HIT_RECOVERY` | Hit recovery duration (scaled). |
| `attack_range`, `hit_range` | number | `TUNING.KLAUS_ATTACK_RANGE`, `TUNING.KLAUS_HIT_RANGE` | Combat ranges (scaled). |
| `chomp_range`, `chomp_min_range`, `chomp_hit_range` | number | Tuning constants (scaled) | Chomp attack range parameters (scaled). |
| `scrapbook_maxhealth`, `scrapbook_damage` | tables | Arrays of base and enraged values | Exposed for scrapbook display. |

## Main functions
### `SetPhysicalScale(inst, scale)`
*   **Description:** Adjusts visual scale, shadow size, physics mass, and capsule dimensions for Klaus. Typically used during rage or phase changes.
*   **Parameters:** `scale` (number) - Multiplicative scale factor.
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; assumes `scale > 0`.

### `SetStatScale(inst, scale)`
*   **Description:** Scales Klaus's health, damage, attack period, and ranges using a volume-scaled factor (`scale^3`). Updates the `combat` and `health` components accordingly.
*   **Parameters:** `scale` (number) - Multiplicative scale factor for stats.
*   **Returns:** Nothing.
*   **Error states:** None.

### `UpdatePlayerTargets(inst)`
*   **Description:** Periodically updates Klaus's target list in `grouptargeter` by checking which players are within `KLAUS_DEAGGRO_DIST` of the spawn point location. Adds/withdraws targets dynamically.
*   **Parameters:** `inst` (entity) - Klaus entity.
*   **Returns:** Nothing.

### `RetargetFn(inst)`
*   **Description:** Called periodically by the `combat` component to find a new target. Prioritizes players in `grouptargeter` (especially near spawn) and falls back to random nearby players. Returns a new target and a `true` flag to continue retargeting.
*   **Parameters:** `inst` (entity) - Klaus entity.
*   **Returns:** `target` (entity or `nil`) and `true` (to indicate readiness to retarget).
*   **Error states:** May return `nil` if no valid targets are found.

### `KeepTargetFn(inst, target)`
*   **Description:** Determines if Klaus should continue targeting a player. Returns `true` only if the target is valid and within `KLAUS_DEAGGRO_DIST` of the spawn point.
*   **Parameters:**  
    * `inst` (entity) - Klaus entity.  
    * `target` (entity) - Target player.
*   **Returns:** `true` or `false`.

### `SummonHelpers(inst, warning)`
*   **Description:** Spawns up to 2 red and 2 blue deer helpers near Klaus based on proximity to recent attackers or current combat target. Sets `nohelpers` to `true` to prevent repeat calls. Pushes `ms_forcenaughtiness` events for penalty calculation.
*   **Parameters:**  
    * `inst` (entity) - Klaus entity.  
    * `warning` (boolean) - Whether to warn nearby players via talker component.
*   **Returns:** `true` if helpers were spawned; `false` otherwise.

### `EnterPhase2Trigger(inst)`
*   **Description:** Called when Klaus's health drops to 50% of max. Pushes a `"transition"` event to trigger animation/state changes for Phase 2 (chain break, enraged).
*   **Parameters:** `inst` (entity) - Klaus entity.
*   **Returns:** Nothing.

### `SetEngaged(inst, engaged)`
*   **Description:** Manages combat state transition. When `engaged=true`: stops health regen, sets command cooldown timer, disables `newcombattarget` callback. When `engaged=false`: starts regen, resets cooldown, re-enables callback. Resets `nohelpers` on recovery.
*   **Parameters:**  
    * `inst` (entity) - Klaus entity.  
    * `engaged` (boolean) - Combat engagement state.
*   **Returns:** Nothing.

### `SpawnDeer(inst)`
*   **Description:** Instantiates a red deer and a blue deer, positions them in a spread arc around Klaus, and registers them as soldiers under the `commander` component.
*   **Parameters:** `inst` (entity) - Klaus entity.
*   **Returns:** Nothing.

### `Unchain(inst, warning)`
*   **Description:** Breaks Klaus's chains. Unhides chain visuals, enables chain-breaking effects, sets large sanity aura, allows burning (via `nocharring=false`), disables foley sounds, and sets `urchained=true`.
*   **Parameters:**  
    * `inst` (entity) - Klaus entity.  
    * `warning` (boolean) - Whether to warn nearby players.
*   **Returns:** Nothing.

### `Enrage(inst, warning)`
*   **Description:** Activates Klaus's rage state: stops physics, teleports to position, scales up size and stats, disables helper spawning, sets large sanity aura, resets combat FX override.
*   **Parameters:**  
    * `inst` (entity) - Klaus entity.  
    * `warning` (boolean) - Whether to warn nearby players.
*   **Returns:** Nothing.

### `PushMusic(inst, level)`
*   **Description:** Triggers the `triggeredevent` event for the player if within range, to control music volume levels (1=normal, 2=pause, 3=unchained/rage).
*   **Parameters:**  
    * `inst` (entity) - Klaus entity.  
    * `level` (number) - Music level indicator.
*   **Returns:** Nothing.

### `OnMusicDirty(inst)`
*   **Description:** Recalculates music level based on `urchained` and `pausemusic` flags and starts/stops a periodic task to update music state.
*   **Parameters:** `inst` (entity) - Klaus entity.
*   **Returns:** Nothing.

### `PauseMusic(inst, paused)`
*   **Description:** Toggles music pausing by updating `_pausemusic` net_bool and calling `OnMusicDirty`.
*   **Parameters:**  
    * `inst` (entity) - Klaus entity.  
    * `paused` (boolean) - `true` to pause, `false` to resume.
*   **Returns:** Nothing.

### `IsUnchained(inst)`
*   **Description:** Returns the current `urchained` state.
*   **Parameters:** `inst` (entity) - Klaus entity.
*   **Returns:** `true` if unchained; `false` otherwise.

### `FindChompTarget(inst)`
*   **Description:** Finds a valid chomp target from `AllPlayers`: prefers distant targets first, then nearby targets, and falls back to current combat target.
*   **Parameters:** `inst` (entity) - Klaus entity.
*   **Returns:** `target` (entity or `nil`).

### `OnSave(inst, data)`
*   **Description:** Saves `nohelpers`, `unchained`, and `enraged` state into `data` for world persistence.
*   **Parameters:**  
    * `inst` (entity) - Klaus entity.  
    * `data` (table) - Save data table.
*   **Returns:** Nothing.

### `OnPreLoad(inst, data)`
*   **Description:** Restores saved state (`nohelpers`, `unchained`, `enraged`) after loading from a save file.
*   **Parameters:**  
    * `inst` (entity) - Klaus entity.  
    * `data` (table or `nil`) - Loaded save data.
*   **Returns:** Nothing.

### `OnEntitySleep(inst)`
*   **Description:** Starts a 10-second delayed removal task for Klaus (and his deer) when world enters sleep mode, unless Klaus is unchained and dead.
*   **Parameters:** `inst` (entity) - Klaus entity.
*   **Returns:** Nothing.

### `OnEntityWake(inst)`
*   **Description:** Cancels the sleep removal task if Klaus wakes up.
*   **Parameters:** `inst` (entity) - Klaus entity.
*   **Returns:** Nothing.

### `OnAttacked(inst, data)`
*   **Description:** Handles damage event: adds attacker to `recentattackers`, updates combat target if needed, and shares attacker to all soldiers.
*   **Parameters:**  
    * `inst` (entity) - Klaus entity.  
    * `data` (table) - Attack event data.
*   **Returns:** Nothing.

### `OnCollide(inst, other)`
*   **Description:** On physics collision with a `workable` entity, schedules `OnDestroyOther` (with 2-FRAME delay) to destroy the workable and prevent rapid recharging.
*   **Parameters:**  
    * `inst` (entity) - Klaus entity.  
    * `other` (entity) - Collided entity.
*   **Returns:** Nothing.

### `OnDestroyOther(inst, other)`
*   **Description:** Destroys a `workable` entity (except dig/net) by triggering its destroy action. Prevents repeated charging with `recentlycharged` cooldown.
*   **Parameters:**  
    * `inst` (entity) - Klaus entity.  
    * `other` (entity) - Workable entity to destroy.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
    * `attacked` - Calls `OnAttacked`.  
    * `musicdirty` (client) - Calls `OnMusicDirty`.  
    * `newcombattarget` - Calls `OnNewTarget` (only when not engaged).  
- **Pushes:**  
    * `"transition"` - On health dropping to 50%.  
    * `"soldierschanged"` (via `commander`) - Soldier list changes.  
    * `"ms_forcenaughtiness"` (via `TheWorld:PushEvent`) - For Naughty player scoring.  
    * `"triggeredevent"` (via `ThePlayer:PushEvent`) - For music control.