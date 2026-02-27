---
id: playerlightningtarget
title: Playerlightningtarget
description: Handles player-specific lightning strike logic, including chance modifiers, strike callbacks, and damage avoidance when insulated.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 2d6d39ea
---

# Playerlightningtarget

## Overview
This component manages lightning strike behavior specifically for player entities. It determines whether a player is struck by lightning (based on a configurable hit chance), executes a customizable callback function on strike (typically dealing damage or triggering avoidance logic), and emits events related to lightning targeting and impact.

## Dependencies & Tags
- **Dependencies:**
  - Relies on `LightningStrikeAttack` function (imported/defined externally; likely from `scripts prefabs/util.lua`)
  - Assumes the entity has the `health` and `inventory` components at runtime (checked dynamically in `DefaultOnStrike`)
- **Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `hitchance` | number | `TUNING.PLAYER_LIGHTNING_TARGET_CHANCE` | Base probability (0–1) that the player is targeted by lightning. |
| `onstrikefn` | function | `DefaultOnStrike` | Callback function invoked when a lightning strike is triggered. Defaults to handling damage/avoidance. |
| `hitchancemodifiers` | `SourceModifierList` | instance of `SourceModifierList(self.inst)` | Manages modifiers that adjust the effective hit chance (e.g., from equipment or status effects). |

## Main Functions

### `SetHitChance(chance)`
* **Description:** Overrides the base hit chance with the provided value. The effective hit chance used in `GetHitChance` ignores this and uses modifiers instead; this setter is typically for temporary, non-modifier adjustments.
* **Parameters:**
  * `chance` (number): The new base hit chance (expected in the range [0, 1]).

### `GetHitChance()`
* **Description:** Returns the *effective* hit chance, computed by multiplying the base `hitchance` by all active modifiers in `hitchancemodifiers`.
* **Parameters:** None.

### `SetOnStrikeFn(fn)`
* **Description:** Replaces the default strike callback with a custom function. This allows gameplay logic (e.g., quest triggers or mods) to alter how strikes are handled.
* **Parameters:**
  * `fn` (function): A function accepting a single argument `inst` (the entity being struck).

### `DoStrike()`
* **Description:** Triggers the strike process: invokes `onstrikefn` if assigned, then pushes the `"playerlightningtargeted"` event. Does not perform any checks beyond callback execution.
* **Parameters:** None.

## Events & Listeners
- Listens for:
  - *None* (does not register event listeners internally).
- Pushes:
  - `"playerlightningtargeted"`: Emitted after `DoStrike()` executes its callback, regardless of whether damage occurred.
  - `"lightningdamageavoided"`: Emitted by `DefaultOnStrike` when the player is insulated and would otherwise avoid damage.