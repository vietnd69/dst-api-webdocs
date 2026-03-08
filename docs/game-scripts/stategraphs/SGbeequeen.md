---
id: SGbeequeen
title: Sgbeequeen
description: Manages the state machine for the Bee Queen boss, controlling her movement, attacks, screeching, guard spawning, target focus, sleep, and freeze states.
tags: [boss, ai, combat, locomotion, ai_commander]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 7f436fb8
system_scope: entity
---

# Sgbeequeen

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGbeequeen` is a `StateGraph` that defines the full behavioral state machine for the Bee Queen boss prefab. It orchestrates movement (`locomotor`), attack timing (`combat`), targeting (`grouptargeter`), and command coordination via the `commander` component to manage Beeguards. It also handles special conditions like sleeping, freezing, electrocution, and death. The stategraph uses memory (`sg.mem`) to persist command flags across transitions and integrates with common state handlers from `commonstates.lua` for sleep/freeze/electrocution logic.

## Usage example
```lua
-- The stategraph is returned and automatically used by the Bee Queen prefab.
-- Modders typically do not manually instantiate this.
-- The Bee Queen prefab internally uses:
-- inst:AddStateGraph("beequeen", "stategraphs/SGbeequeen")
```

## Dependencies & tags
**Components used:** `combat`, `commander`, `epicscare`, `grouptargeter`, `health`, `knownlocations`, `locomotor`, `sanityaura`, `timer`  
**Tags:** State tags include `idle`, `moving`, `busy`, `nosleep`, `nofreeze`, `noattack`, `noelectrocute`, `hit`, `attack`, `focustarget`, `screech`, `spawnguards`, `caninterrupt`, `canrotate`, `flight`, and `busy` (death). Prefab tags used/checked include `INLIMBO`, `player`, `bee`, `notarget`, `invisible`, `flight`, `playerghost`, `NOCLICK`, `_combat`, `_health`.

## Properties
No public properties are initialized in the stategraph definition itself. The `sg.statemem` and `sg.mem` tables hold transient state and command flags (e.g., `wantstoscreech`, `focuscount`), but these are internal to the stategraph logic and not exposed as persistent variables.

## Main functions
### `ShakeIfClose(inst)`
*   **Description:** Triggers a camera shake for nearby players when the Bee Queen is within 30 world units.
*   **Parameters:** `inst` (Entity instance) — the Bee Queen entity.
*   **Returns:** Nothing.

### `DoScreech(inst)`
*   **Description:** Triggers a full camera shake and plays the Bee Queen's screech sound.
*   **Parameters:** `inst` (Entity instance).
*   **Returns:** Nothing.

### `DoScreechAlert(inst)`
*   **Description:** Scare effect via `epicscare` and alerts all Beeguards using `commander:AlertAllSoldiers()`.
*   **Parameters:** `inst` (Entity instance).
*   **Returns:** Nothing.

### `ChooseAttack(inst)`
*   **Description:** Forces the stategraph into the `attack` state.
*   **Parameters:** `inst` (Entity instance).
*   **Returns:** `true`.

### `FaceTarget(inst)`
*   **Description:** Selects the closest valid target from `sg.mem.focustargets` or falls back to `combat.target`, then forces the entity to face that target.
*   **Parameters:** `inst` (Entity instance).
*   **Returns:** Nothing.

### `hit_recovery_skip_cooldown_fn(inst, last_t, delay)`
*   **Description:** Used by `CommonHandlers.HitRecoveryDelay` to determine if a hit recovery can be skipped. Only allows skip if currently at full hit recovery duration (`TUNING.BEEQUEEN_HIT_RECOVERY`), in cooldown, and in an idle state.
*   **Parameters:** `inst` (Entity), `last_t`, `delay` (unused in body).
*   **Returns:** `true` or `false`.

### `CleanupIfSleepInterrupted(inst)`
*   **Description:** Called on sleep exit or waking to restore flight state and honey production if interrupted.
*   **Parameters:** `inst` (Entity instance).
*   **Returns:** Nothing.

### `OnOverrideFrozenSymbols(inst)`
*   **Description:** Stategraph callback during freeze that stops flapping, honey production, and sets dodge/alert flags.
*   **Parameters:** `inst` (Entity instance).
*   **Returns:** Nothing.

### `OnClearFrozenSymbols(inst)`
*   **Description:** Stategraph callback during unfreeze that restores flapping and honey production.
*   **Parameters:** `inst` (Entity instance).
*   **Returns:** Nothing.

### `event handlers in `events`
*   **Description:** Listens to and handles high-level game events such as `doattack`, `attacked`, `screech`, `spawnguards`, `focustarget`, and `flee`. Many defer to state transitions with `wantsto*` memory flags if currently `busy` or `dead`. Death, sleep, and freeze handlers use common handlers from `commonstates.lua`.
*   **Parameters:** Event name and callback function (see full `events` table for details).
*   **Returns:** Varies per handler.

### `state onenter/onupdate/onexit callbacks`
*   **Description:** Each state (`idle`, `walk_start`, `walk`, `walk_stop`, `emerge`, `flyaway`, `hit`, `death`, `screech`, `attack`, `spawnguards`, `focustarget`, `focustarget_loop`, `focustarget_loop2`, `focustarget_pst`) has custom logic in `onenter`/`onupdate`/`onexit`. Core behaviors include:
    *   Starting/stopping movement (`locomotor`).
    *   Playing animations and sounds.
    *   Managing invincibility (`health:SetInvincible`).
    *   Starting/timing camera shakes and alerts.
    *   Spawning Beeguards and assigning targets via `commander`.
    *   Handling target focus logic (`grouptargeter` + `commander:FocusTarget`).
    *   Setting sanity aura based on focus state.
    *   Starting timers (`focustarget_cd`, `spawnguards_cd`).
*   **Parameters:** `inst` (Entity) is passed to callbacks.
*   **Returns:** Varies; usually nothing.

## Events & listeners
- **Listens to:**
  - `doattack`, `attacked`, `screech`, `spawnguards`, `focustarget`, `flee`, `animover`, `death`, `freeze`, `electrocute`, `sleep`, `wake`, `corpsechomped`, `nosleepanimover`, `nosleeptimeline`
- **Pushes:** None — this is a stategraph definition, not a component, so it does not directly push events. It reacts to events and transitions between states.
