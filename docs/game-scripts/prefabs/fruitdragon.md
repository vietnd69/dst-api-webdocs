---
id: fruitdragon
title: Fruitdragon
description: Manages the behavior, state (ripe/unripe), sleep cycle, combat interactions, and thermoregulatory home-finding logic for the Fruitdragon entity.
tags: [combat, ai, sleep, entity, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8b87ab87
system_scope: entity
---

# Fruitdragon

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `fruitdragon` prefab defines a combat-capable, heat-seeking creature that cycles between active and sleeping states, and transitions between unripe and ripe forms based on environmental temperature and home proximity. It integrates closely with `combat` (for challenge mechanics and target management), `sleeper` (for diurnal cycles and regeneration), `entitytracker` (for tracking its designated heat source), and `health` (for damage and regen). The fruitdragon enforces species-specific combat rules, such as alternating challenges and wake-up responses to combat threats.

## Usage example
```lua
local inst = SpawnPrefab("fruitdragon")
if inst ~= nil then
    -- Force the fruitdragon to become ripe if near a suitable heat source
    if inst.components.entitytracker:GetEntity("home") ~= nil then
        inst:MakeRipe()
    end
    -- Immediately start searching for a new heat source
    FindNewHome(inst)
end
```

## Dependencies & tags
**Components used:**  
- `combat`: Targeting, damage, retargeting, and challenge behavior.
- `health`: Max health, regen, invincibility, and damage scaling.
- `sleeper`: Sleep/wake logic based on time-of-day, heat, and nap duration.
- `entitytracker`: Tracks the current home (heat source) entity.
- `lootdropper`: Provides loot tables for unripe and ripe forms.
- `timer`: Manages sleep cycle timers, panic timers, and home-finding.
- `locomotor`: Sets movement speeds.
- `inspectable`: Exposes `RIPE` status.
- `drownable`: Prevents drowning.
- `light`: Emitted light with color and falloff.

**Tags added:** `smallcreature`, `animal`, `scarytoprey`, `fruitdragon`, `lunar_aligned`

**Tags checked/avoided:**  
- Must-have for heat sources: `{"HASHEATER"}`  
- Excluded heat sources: `{"monster"}`  
- State tags: `sleeping`, `busy`, `hiding`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_is_ripe` | boolean | `false` | Whether the fruitdragon is currently ripe (alters loot table, damage, animations, and nap behavior). |
| `_wakeup_time` | number | `GetTime()` at spawn | Timestamp when the last awake period started. Used to compute sleep-in time. |
| `_nap_time` | number | `-math.huge` at spawn | Timestamp when the last nap started. Used to compute wake-up time. |
| `sleep_variance` | number | `math.random()` per cycle | Random variance factor for sleep/awake durations. |
| `_sleep_interrupted` | boolean | `true` initially | Reset flag used during sleep transitions to control ripening logic. |
| `_findnewhometask` | Task | Periodic 3s task | Repeated task to search for better heat sources. |
| `_min_challenge_attacks` | number | `2` (or `0` if target is also a fruitdragon) | Remaining hits required to win a challenge. |
| `_ripen_pending` / `_unripen_pending` | boolean | `false` | Queues form transitions on waking or entity wake-up. |

## Main functions
### `FindNewHome(inst)`
*   **Description:** Scans nearby entities with the `HASHEATER` tag (excluding `monster` tags) to find a better exothermic heat source than the current one. Updates the `"home"` tracker. Does nothing if panicking, sleeping, or already in combat.
*   **Parameters:** `inst` (Entity) – The fruitdragon instance.
*   **Returns:** Nothing.
*   **Error states:** Skips execution if `inst.components.timer:TimerExists("panicing")` is true or if the sleeper is asleep.

### `OnNewTarget(inst, data)`
*   **Description:** Adjusts the minimum challenge attack count when a new target is assigned. If the target is another fruitdragon, it resets `_min_challenge_attacks` to `0` (if ripe) or `2` (if unripe).
*   **Parameters:**  
  - `inst` (Entity) – The fruitdragon.  
  - `data.target` (Entity) – The newly assigned combat target.
*   **Returns:** Nothing.

### `KeepTarget(inst, target)`
*   **Description:** Predicate function used by `combat` to decide whether to retain a current target. For other fruitdragons, it checks challenge validity (no panicking, within challenge distance, and the target is not already in another fight).
*   **Parameters:**  
  - `inst` (Entity) – The fruitdragon.  
  - `target` (Entity) – The proposed target.
*   **Returns:** `true` if target should be retained; otherwise `false`.

### `ShouldTarget(target)`
*   **Description:** Predicate for finding a new fruitdragon target. Requires the target is a fruitdragon, not panicking, and has no active combat target.
*   **Parameters:** `target` (Entity).
*   **Returns:** `true` if target is valid for challenge; otherwise `false`.

### `RetargetFn(inst)`
*   **Description:** Primary retargeting function for `combat:SetRetargetFunction`. Attempts to retain current target if valid; otherwise, searches nearby for another fruitdragon within challenge range. Also searches around the current home.
*   **Parameters:** `inst` (Entity).
*   **Returns:** The new target Entity, or `nil`.

### `OnAttacked(inst, data)`
*   **Description:** Handles incoming attacks. If the attacker is the home or its grand owner, the home is forgotten. Regardless, the attacker becomes the combat target.
*   **Parameters:**  
  - `inst` (Entity).  
  - `data.attacker` (Entity).
*   **Returns:** Nothing.

### `doattack(inst, data)`
*   **Description:** Called on successful attack. Wakes up sleeping targets and suggests the fruitdragon as a new combat target for them.
*   **Parameters:**  
  - `inst` (Entity).  
  - `data.target` (Entity).
*   **Returns:** Nothing.

### `OnLostChallenge(inst)`
*   **Description:** Called when a fruitdragon loses a challenge. Forgets current home, starts a panic timer, and drops combat target.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `onattackother(inst, data)`
*   **Description:** Tracks remaining attack count during a challenge. Drops target if challenge distance is exceeded, or if a random chance triggers the `lostfruitdragonchallenge` event on the opponent.
*   **Parameters:**  
  - `inst` (Entity).  
  - `data.target` (Entity).
*   **Returns:** Nothing.

### `onblocked(inst, data)`
*   **Description:** Responds to a blocked attack from a fruitdragon: suggests the attacker as a combat target and wakes up if sleeping.
*   **Parameters:**  
  - `inst` (Entity).  
  - `data.attacker` (Entity).
*   **Returns:** Nothing.

### `Sleeper_SleepTest(inst)`
*   **Description:** Determines if the fruitdragon should fall asleep. Sleeps at night or when awake duration expires, provided no combat or busy tags exist. Checks home proximity and minimum heat thresholds for nap eligibility.
*   **Parameters:** `inst` (Entity).
*   **Returns:** `true` if should sleep; otherwise `false`.

### `Sleeper_WakeTest(inst)`
*   **Description:** Determines if the fruitdragon should wake up. Returns `true` if combat target exists, nap duration expired, and it is not night.
*   **Parameters:** `inst` (Entity).
*   **Returns:** `true` if should wake; otherwise `false`.

### `Sleeper_OnSleep(inst)`
*   **Description:** Called when entering sleep. Starts nap timer, resets variance, and begins regen if not dead.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `Sleeper_OnWakeUp(inst)`
*   **Description:** Called when waking. Ends regen, resets sleep variance, and may queue ripening based on heat availability. Resets `_sleep_interrupted`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `MakeRipe(inst, force)`
*   **Description:** Transitions the fruitdragon to its ripe form. Updates loot table, damage, and animation build. Can be forced.
*   **Parameters:**  
  - `inst` (Entity).  
  - `force` (boolean) – Bypass pending checks.
*   **Returns:** Nothing.

### `MakeUnripe(inst, force)`
*   **Description:** Transitions the fruitdragon to its unripe form. Updates loot table, damage, and animation build. Can be forced.
*   **Parameters:**  
  - `inst` (Entity).  
  - `force` (boolean) – Bypass pending checks.
*   **Returns:** Nothing.

### `IsHomeGoodEnough(inst, dist, min_temp)`
*   **Description:** Helper to check if the tracked home exists, is within distance, is exothermic, and meets minimum heat threshold.
*   **Parameters:**  
  - `inst` (Entity).  
  - `dist` (number) – Max distance.  
  - `min_temp` (number) – Minimum heat required.
*   **Returns:** `true` if home meets criteria; otherwise `false`.

### `QueueRipen(inst)` / `QueueUnripe(inst)`
*   **Description:** Schedules a form transition to occur later (on entity wake or sleep exit).
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `GetRemainingTimeAwake(inst)` / `GetRemainingNapTime(inst)`
*   **Description:** Computes remaining time for the current awake or nap period, factoring in ripeness, home status, and variance.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Number (seconds remaining).

### `GetStatus(inst)`
*   **Description:** Returns `"RIPE"` if ripe; otherwise `nil`. Used by `inspectable` to show status.
*   **Parameters:** `inst` (Entity).
*   **Returns:** `"RIPE"` or `nil`.

### `GetDebugString(inst)`
*   **Description:** Produces a multi-line debug string including home entity, ripeness, and time until sleep/wake.
*   **Parameters:** `inst` (Entity).
*   **Returns:** String.

## Events & listeners
- **Listens to:**
  - `doattack` – Triggers `doattack`.
  - `attacked` – Triggers `OnAttacked`.
  - `onattackother` – Triggers `onattackother`.
  - `blocked` – Triggers `onblocked`.
  - `newcombattarget` – Triggers `OnNewTarget`.
  - `gotosleep` – Triggers `Sleeper_OnSleep`.
  - `onwakeup` – Triggers `Sleeper_OnWakeUp`.
  - `lostfruitdragonchallenge` – Triggers `OnLostChallenge`.
  - `onremove` (via `entitytracker`) – Forgets tracked entities.
  - `"panicing"` timer – Checked during home search and sleep transitions.

- **Pushes:**
  - `droppedtarget` (via `combat:DropTarget`).
  - `healthdelta` (via `health:DoDelta`).
  - `wake_up_to_challenge` (when waking a sleeping target to challenge).
  - `lostfruitdragonchallenge` (on challenge win).
  - `onwakeup`, `gotosleep` (via `sleeper`).