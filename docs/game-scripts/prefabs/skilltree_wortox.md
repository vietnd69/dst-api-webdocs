---
id: skilltree_wortox
title: Skilltree Wortox
description: Provides the skill tree data and functional callbacks for Wortox, including UI rendering logic, skill activation effects, and alignment-based combat modifiers.
tags: [ui, skills, alignment, combat,Prefab]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3a8c3542
system_scope: ui
---

# Skilltree Wortox

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`skilltree_wortox.lua` is not a component but a reusable Lua module that returns the complete skill tree configuration for the Wortox character prefab. It defines all skills (including progression paths, locks, tags, and effects), UI layout coordinates, and custom callback functions used during skill activation/deactivation and UI updates. The module depends on external functions like `SkillTreeFns.CountTags` and `SkillTreeFns.MakeCelestialChampionLock` from the skill tree system, and it interacts with components such as `inventory`, `timer`, `damagetyperesist`, `damagetypebonus`, and `linkeditemmanager` to apply gameplay effects.

## Usage example
```lua
local BuildSkillsData = require("prefabs/skilltree_wortox")
local skills_data = BuildSkillsData(SkillTreeFns)
-- skills_data.SKILLS contains the full skill definitions
-- skills_data.CUSTOM_FUNCTIONS contains helper functions for logic
-- skills_data.ORDERS defines title layout positions
```

## Dependencies & tags
**Components used:** `inventory`, `timer`, `damagetyperesist`, `damagetypebonus`, `linkeditemmanager`, `health`, `equippable`, `inventoryitem`.  
**Tags:** Adds `nabbaguser`, `player_lunar_aligned`, `player_shadow_aligned`, `nice`, `naughty`, `neutral`, `nice1`, `naughty1`, `allegiance`, `lunar_favor`, `shadow_favor`, `lock`, `overcharged`, `lunar`, `shadow`, `on`, `off`. Checks `wortox_panflute_buff`, `wortox_allegiance_lunar`, `wortox_allegiance_shadow`.

## Properties
No public properties are defined. This file exports a function (`BuildSkillsData`) that constructs and returns a table.

## Main functions
### `BuildSkillsData(SkillTreeFns)`
*   **Description:** Constructs and returns the complete skill tree configuration for Wortox. This includes all skill definitions (with positions, tags, locks, activation callbacks, etc.), the visual ordering of UI elements (`ORDERS`), and custom utility functions (`CUSTOM_FUNCTIONS`) for gameplay logic.
*   **Parameters:** `SkillTreeFns` (table) – A table of shared skill tree utility functions (e.g., `CountTags`, `MakeCelestialChampionLock`).
*   **Returns:** Table with keys: `SKILLS` (skill definitions), `ORDERS` (title positions), and `CUSTOM_FUNCTIONS` (helper functions).
*   **Error states:** None.

### `CUSTOM_FUNCTIONS.CalculateInclination(nice, naughty, affinitytype)`
*   **Description:** Determines the player’s current inclination (nice, naughty, or neutral) based on counts of activated `nice` and `naughty` skills, adjusting for alignment affinity (lunar/shadow). Returns a string or `nil`.
*   **Parameters:** `nice` (number) – Count of activated `nice`-tagged skills. `naughty` (number) – Count of activated `naughty`-tagged skills. `affinitytype` (string or nil) – Either `"lunar"` or `"shadow"`, or `nil`.
*   **Returns:** `"nice"`, `"naughty"`, or `nil` (neutral).
*   **Error states:** Returns `nil` if the difference is within the neutral threshold (`TUNING.SKILLS.WORTOX.TIPPED_BALANCE_THRESHOLD`).

### `CUSTOM_FUNCTIONS.ShouldResistFn(item)`
*   **Description:** A callback used by the `resistance` component to decide if damage should be resisted (e.g., for the Lunar allegiance).
*   **Parameters:** `item` (Entity) – The equipped item (e.g., a skill-locked armor piece).
*   **Returns:** Boolean (`true` if resistance should apply).
*   **Error states:** Returns `false` if the item is not equipped or if the owner is not aligned to lunar.

### `CUSTOM_FUNCTIONS.OnResistDamage(item, damage, attacker)`
*   **Description:** A callback used by the `resistance` component to spawn visual FX when damage is resisted (e.g., a burst around the player).
*   **Parameters:** `item` (Entity), `damage` (number, unused), `attacker` (Entity or nil).
*   **Returns:** Nothing.
*   **Error states:** None.

### `CUSTOM_FUNCTIONS.SetupLunarResists(item)`
*   **Description:** Attaches a `resistance` component to `item` and configures it to resist a predefined list of damage types (e.g., combat, explosive, trap) when Lunar allegiance is active.
*   **Parameters:** `item` (Entity) – The item to modify (typically a skill-locked armor piece).
*   **Returns:** Nothing.
*   **Error states:** None.

### `CUSTOM_FUNCTIONS.TryResetPanfluteTimer(inst)`
*   **Description:** Starts or resets the panflute inspiration timer if the panflute-playing skill is activated and the player is not dead. Does nothing if the timer already exists.
*   **Parameters:** `inst` (Entity) – The player instance.
*   **Returns:** Nothing.
*   **Error states:** Returns early if the player is dead (leaves timer paused).

### `CUSTOM_FUNCTIONS.TryPanfluteTimerSetup(inst)`
*   **Description:** Configures the panflute timer: starts it if the skill is active and not already running, pauses it if dead, and registers event listeners for death/respawn. Deactivates listeners and timer if the skill is not active.
*   **Parameters:** `inst` (Entity) – The player instance.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `inst.wortox_needstreeinit` is true (prevents setup before skill tree initialization).

## Events & listeners
- **Listens to:** `timerdone` – Fires `OnTimerDone` to apply the panflute buff when the timer completes. `death` – Pauses the panflute timer. `ms_respawnedfromghost` – Resumes the panflute timer.  
- **Pushes:** None directly (events are handled via callbacks).  
- **Callback listeners removed on skill deactivation:** `timerdone`, `death`, `ms_respawnedfromghost`.