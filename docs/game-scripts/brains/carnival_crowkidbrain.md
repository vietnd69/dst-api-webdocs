---
id: carnival_crowkidbrain
title: Carnival Crowkidbrain
description: Controls the AI behavior of the carnival crow kid, managing movement, minigame spectating, decor interaction, campfire watching, and vocalizations based on game state and environment.
tags: [ai, minigame, npc, environment, locomotion]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 902b1780
system_scope: brain
---

# Carnival Crowkidbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`CrowKidBrain` is a behavior tree controller for the carnival crow kid entity. It orchestrates a hierarchy of actions including wandering near home, watching campfires at night, interacting with carnival decorations, facing nearby players, spectating minigames, and fleeing from threats or when the carnival home is invalid or damaged. It interacts closely with the `homeseeker`, `minigame_spectator`, `burnable`, `fueled`, and `carnivaldecorranker` components to adapt behavior dynamically.

## Usage example
```lua
-- Automatically assigned to the carnival_crowkid prefab via its brain definition.
-- No manual usage is required in most modding scenarios.
-- To customize behavior, override the brain in the prefab's OnPostInit or via prefabs override.
```

## Dependencies & tags
**Components used:**  
- `homeseeker` (for home position and validity checks)  
- `burnable` (to detect if the home is burning)  
- `fueled` (to check campfire fuel levels)  
- `carnivaldecorranker` (to determine chatter lines based on decor rank)  
- `minigame` (via `minigame_spectator` for minigame state)  
- `minigame_spectator` (to access current minigame and outcomes)

**Tags:**  
- Checks tags: `notarget`, `INLIMBO`, `hostile`, `inactive`, `carnivaldecor`, `campfire`, `fire`, `burnt`  
- No tags are added or removed by this brain.

## Properties
No public properties are defined in the constructor or behavior logic.

## Main functions
### `HasValidHome(inst)`
*   **Description:** Verifies whether the entity has a valid, unburned home entity.
*   **Parameters:** `inst` (The crow kid entity instance).
*   **Returns:** `true` if `inst.components.homeseeker.home` exists, is valid, is not burning, and is not tagged `burnt`; otherwise `false`.
*   **Error states:** Returns `false` if any component check fails or returns `nil`.

### `GetHomePos(inst)`
*   **Description:** Returns the world position of the valid home if one exists.
*   **Parameters:** `inst` (The crow kid entity instance).
*   **Returns:** `Vector3` position of the home if `HasValidHome(inst)` is `true`, otherwise `nil`.

### `GetFaceTargetFn(inst)`
*   **Description:** Determines whether a nearby player should be faced (e.g., for interaction).
*   **Parameters:** `inst` (The crow kid entity instance).
*   **Returns:** Player entity if within `3` units (squared distance `<= 9`) and cooldown has expired; otherwise `nil`.

### `KeepFaceTargetFn(inst, target)`
*   **Description:** Verifies that the current face target remains valid.
*   **Parameters:** `inst` (entity), `target` (the target entity to keep facing).
*   **Returns:** `true` if `target` is still the nearest player and within `3` units; otherwise `false`.

### `IsHomeless(inst)`
*   **Description:** Returns whether the crow kid has no `homeseeker` component.
*   **Parameters:** `inst` (entity).
*   **Returns:** `true` if `inst.components.homeseeker == nil`; otherwise `false`.

### `ShouldFlyAway(inst)`
*   **Description:** Determines if the entity should flee due to danger or lunar hailing.
*   **Parameters:** `inst` (entity).
*   **Returns:** `true` if: lunar hailing is active; or the entity is not `sleeping`, `busy`, or `flight`; and there is a hostile or `notarget` entity within `8` units; otherwise `false`.

### `FlyHome(inst)`
*   **Description:** Initiates a `GOHOME` buffered action if `ShouldFlyAway(inst)` is `true`.
*   **Parameters:** `inst` (entity).
*   **Returns:** A `BufferedAction` to `ACTIONS.GOHOME`, or `nil` if conditions are not met.

### `ActivateDecor(inst)`
*   **Description:** Attempts to activate nearby carnival decorations or stoke a campfire, with chain delays and cooldowns.
*   **Parameters:** `inst` (entity).
*   **Returns:** A `BufferedAction` to `ACTIONS.ACTIVATE` or `ACTIONS.ADDFUEL`, or `nil` if no valid target found or on cooldown.

### `WatchCampfireFn(inst)`
*   **Description:** Checks for and selects a nearby campfire during night time.
*   **Parameters:** `inst` (entity).
*   **Returns:** `true` if a valid campfire is found and stored in `inst._watch_campfire`; otherwise `false`.

### `GetCurrentCampfirePos(inst)`
*   **Description:** Returns the current campfire’s position if valid.
*   **Parameters:** `inst` (entity).
*   **Returns:** `Vector3` of the campfire position, or `nil`.

### `GetCampfireChatterLines(inst)`
*   **Description:** Returns a random campfire-related dialogue line.
*   **Parameters:** `inst` (entity).
*   **Returns:** A string from `STRINGS.CARNIVAL_CROWKID_CAMPFIRE`.

### `WatchingMinigame(inst)`
*   **Description:** Returns the current minigame the entity is spectating.
*   **Parameters:** `inst` (entity).
*   **Returns:** Minigame entity, or `nil`.

### `IsWatchingMinigameIntro(inst)`
*   **Description:** Returns `true` if the watched minigame is in its intro phase.
*   **Parameters:** `inst` (entity).
*   **Returns:** `true` if `minigame.components.minigame:GetIsIntro()` is `true`; otherwise `false`.

### `WatchingMinigame_MinDist(inst)`
### `WatchingMinigame_TargetDist(inst)`
### `WatchingMinigame_MaxDist(inst)`
*   **Description:** Return minigame-specific movement distances for following/spectating.
*   **Parameters:** `inst` (entity).
*   **Returns:** Number from `minigame.components.minigame.watchdist_min/target/max`.

### `IsWatchingMinigameOutro(inst)`
*   **Description:** Returns `true` if the watched minigame is in its outro phase.
*   **Parameters:** `inst` (entity).
*   **Returns:** `true` if `minigame.components.minigame:GetIsOutro()` is `true`; otherwise `false`.

### `OnEndOfGame(inst)`
*   **Description:** Handles post-game behavior: triggers minigame outro, evaluates reward eligibility, and schedules reward toss if conditions met.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.
*   **Error states:** No error states documented; may produce no action if score thresholds or luck checks fail.

## Events & listeners
- **Listens to:** None directly.
- **Pushes:**  
  - `minigame_spectator_start_outro` — triggered in `OnEndOfGame` to signal outro phase.
