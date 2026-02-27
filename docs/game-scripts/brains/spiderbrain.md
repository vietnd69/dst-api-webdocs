---
id: spiderbrain
title: Spiderbrain
description: Manages the AI behavior tree for spiders, handling combat, following, hiding, foraging, and navigation based on spider type and state.
tags: [ai, combat, behavior-tree, spider]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: af43bdd1
---

# Spiderbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `SpiderBrain` component implements the AI behavior logic for spider entities in DST using a hierarchical behavior tree. It orchestrates high-priority panic responses, hiding/shield mechanics, combat (including spitter-specific acid-infused behavior), following a leader, foraging for food, and home-related actions. The behavior tree is constructed dynamically in `OnStart()` based on the spider's tags, state, and component presence (e.g., trader, follower, homeseeker). It interacts closely with components for combat, trader, eater, homeseeker, and known locations to make context-sensitive decisions.

## Usage example

This component is not typically added manually by modders; it is automatically assigned to spider prefabs during entity initialization (e.g., in their `fn` function in `prefabs/spider.lua`). A minimal example of its integration pattern:

```lua
inst:AddComponent("brain")
inst.components.brain:SetBrain("spiderbrain")

-- The behavior tree is initialized by calling:
inst.components.brain:OnStart()
```

The component relies on other attached components (e.g., `combat`, `follower`, `trader`, `eater`) to influence behavior. Modders usually customize spider behavior by overriding tunings (e.g., `SPIDER_AGGRESSIVE_MAX_CHASE_TIME`) or by manipulating tags and component states (e.g., `defensive`, `acidinfusible.infused`) rather than modifying `spiderbrain.lua` directly.

## Dependencies & tags

**Components used:**
- `combat`: To check `InCooldown()` and access `target`.
- `eater`: To determine edible food via `CanEat()` and `GetEdibleTags()`.
- `trader`: To detect trade attempts via `IsTryingToTradeWithMe()`.
- `follower`: To retrieve the leader via `GetLeader()`.
- `homeseeker`: To access the `home` location.
- `knownlocations`: To remember and retrieve locations like `"investigate"` and `"home"`.
- `health`: To check if the spider or home is dead via `IsDead()`.
- `burnable`: To detect if home is burning via `IsBurning()`.
- `freezable`: To detect if home is frozen via `IsFrozen()`.
- `childspawner`: To verify if home is valid for spiders to return to.

**Tags checked/added:**
- Tags checked: `"spider_spitter"`, `"spider_hider"`, `"defensive"`, `"outofreach"`, `"INLIMBO"`.
- Tags added: None directly by this component (tags are inherited from prefab or set externally, e.g., via `AddComponent("acidinfusible")`).

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity reference | — | The spider entity the brain controls; passed in constructor. |
| `bt` | `BT` (behavior tree) | `nil` (set in `OnStart()`) | The active behavior tree instance. |
| `SEE_FOOD_DIST` | Number (local constant) | 10 | Max range (squared distance not used) to search for food. |
| `TRADE_DIST` / `TRADE_DIST_SQ` | Number (local constants) | 20 / 400 | Max distance for trade interaction. |
| `MAX_WANDER_DIST` | Number (local constant) | 32 | Max wander radius from home. |
| `DAMAGE_UNTIL_SHIELD` / `SHIELD_TIME` | Number (local constants) | 50 / 3 | Damage threshold and duration for shield usage in hider mode. |
| `AVOID_PROJECTILE_ATTACKS` / `HIDE_WHEN_SCARED` | Boolean (local constants) | false / true | Behavior flags for shield usage. |

## Main functions

### `OnStart()`
* **Description:** Constructs and initializes the behavior tree root node based on spider type, tags, and state. It sets up a priority-based hierarchy: panic > hiding/shielding > combat > following > idle/post-actions.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** Does not return `nil`; fails silently if expected components are missing (e.g., no `homeseeker` will cause `GoHomeAction` to skip).

### `OnInitializationComplete()`
* **Description:** Records the spider's current world position as the `"home"` location using `knownlocations:RememberLocation()`. This ensures the spider has a reference point for home-based behaviors (e.g., returning when day begins in caves).
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** If position values are invalid, `knownlocations` may log an error and throw.

### `GetTraderFn(inst)`
* **Description:** Scans nearby players (within `TRADE_DIST`) for trade attempts and returns the first player actively trying to trade with this spider.
* **Parameters:** `inst` — The spider entity.
* **Returns:** Player entity or `nil`.
* **Error states:** Returns `nil` if no trader component exists or no active trade interaction.

### `KeepTraderFn(inst, target)`
* **Description:** Checks if a given entity (`target`) is still an active trader for this spider.
* **Parameters:** `inst` — Spider entity, `target` — Entity to check.
* **Returns:** `true` if the spider has a `trader` component and `IsTryingToTradeWithMe(target)` returns `true`; otherwise `false`.
* **Error states:** None; always returns boolean.

### `IsFoodValid(item, inst)`
* **Description:** Validates that an item can be eaten by the spider, is on valid ground, and has been in the world long enough (via `SPIDER_EAT_DELAY`).
* **Parameters:** `item` — The food entity, `inst` — Spider entity.
* **Returns:** `true` if all conditions pass, `false` otherwise.
* **Error states:** Returns `false` if `eater` component is missing or item is not edible.

### `EatFoodAction(inst)`
* **Description:** Attempts to find and return a buffered action to eat valid food within `SEE_FOOD_DIST`.
* **Parameters:** `inst` — Spider entity.
* **Returns:** `BufferedAction` or `nil` (if no valid food found).
* **Error states:** Returns `nil` if `FindEntity` returns `nil` or eater cannot consume anything.

### `GoHomeAction(inst)`
* **Description:** Returns a buffered action to go to the spider's `home` if it is valid and not dangerous (burning/frozen/dead).
* **Parameters:** `inst` — Spider entity.
* **Returns:** `BufferedAction` or `nil`.
* **Error states:** Returns `nil` if `homeseeker` missing, home invalid, or home is unsafe/missing `childspawner`.

### `InvestigateAction(inst)`
* **Description:** Returns a buffered action to investigate a remembered location (key `"investigate"`).
* **Parameters:** `inst` — Spider entity.
* **Returns:** `BufferedAction` or `nil`.
* **Error states:** Returns `nil` if `"investigate"` location not remembered or `knownlocations` missing.

### `GetLeader(inst)`
* **Description:** Retrieves the spider's current leader via the `follower` component.
* **Parameters:** `inst` — Spider entity.
* **Returns:** Leader entity or `nil`.
* **Error states:** Returns `nil` if `follower` component is absent or no leader assigned.

### `Is_AcidInfusedSpitter(inst)`
* **Description:** Checks if the spider is an acid-infused spitter (`"spider_spitter"` tag + `acidinfusible.infused` is `true`).
* **Parameters:** `inst` — Spider entity.
* **Returns:** `true` or `false`.
* **Error states:** Returns `false` if missing `"spider_spitter"` tag or `acidinfusible` component.

### `AcidInfusedSpitter_ShouldRunAway(hunter, inst)`
* **Description:** Determines if an acid-infused spitter should flee from a `hunter` based on range and cooldown status.
* **Parameters:** `hunter` — Attacking entity, `inst` — Spider entity.
* **Returns:** `true` if spitter is out of melee range while in cooldown and infuse state is active; otherwise `false`.
* **Error states:** Returns `false` if not an acid-infused spitter.

### `AcidInfusedSpitter_GetFaceTargetFn(inst)`
* **Description:** Returns the combat target only if spitter is in cooldown and acid-infused; otherwise `nil`.
* **Parameters:** `inst` — Spider entity.
* **Returns:** Target entity or `nil`.

### `AcidInfusedSpitter_KeepFaceTargetFn(inst, target)`
* **Description:** Verifies that the current face target matches the combat target for an acid-infused spitter in cooldown.
* **Parameters:** `inst` — Spider entity, `target` — Entity being faced.
* **Returns:** `true` or `false`.

## Events & listeners

This component does not register or push any events directly. It relies on behavior tree nodes (e.g., `PanicWhenScared`, `RunAway`) and component events for state changes (e.g., `health:IsDead()` updates, `combat` state changes), but these are handled internally by behavior functions like `WhileNode` and `IfNode` rather than explicit event listeners.