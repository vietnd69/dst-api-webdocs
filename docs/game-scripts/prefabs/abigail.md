---
id: abigail
title: Abigail
description: Manages Abigail, Wendy's ghost companion, including combat behavior, leadership, buff application, transformation states, and interaction with player-bond mechanics.
tags: [combat, ai, ghost, leadership, buff]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: entity
source_hash: d249d0b0
system_scope: entity
---

# Abigail

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`abigail.lua` defines the behavior and state management for Abigail, Wendy’s ghost companion. It implements core combat logic (aggressive/defensive retargeting), leadership/follower mechanics, ghostly bonding state tracking (with dynamic health, lighting, and visual changes per bond level), and transient command states (escape, haunt, attack, scare). It integrates tightly with components like `aura`, `combat`, `debuffable`, `follower`, `health`, `locomotor`, `planardamage`, `planardefense`, `timer`, `pethealthbar`, and `ghostlybond`, and serves as a central hub for state graph (`SGabigail`) and brain (`abigailbrain`) coordination.

## Usage example
```lua
-- Spawning Abigail and linking to a player (e.g., Wendy)
local abigail = SpawnPrefab("abigail")
abigail:LinkToPlayer(player)

-- Example: triggering a ghost command
abigail:PushEvent("do_ghost_escape")

-- Example: toggling gestalt state (via external event)
abigail:ChangeToGestalt(true)

-- Example: adding bonus health via skill
abigail:AddBonusHealth(10)
```

## Dependencies & tags
**Components used:** `aura`, `combat`, `damagetypebonus`, `damagetyperesist`, `debuffable`, `follower`, `fader`, `ghostlybond`, `hauntable`, `health`, `inspectable`, `inventoryitem`, `leader`, `locomotor`, `minigame_participator`, `pethealthbar`, `planardamage`, `planardefense`, `saltlicker`, `skilltreeupdater`, `spdamageutil`, `spellbookcooldowns`, `talker`, `timer`, `trader`.

**Tags added:** `abigail`, `character`, `flying`, `ghost`, `girl`, `noauradamage`, `NOBLOCK`, `notraptrigger`, `scarytoprey`, `trader`, `ghostlyelixirable`. Additional tags: `gestalt`, `shadow_aligned`, `lunar_aligned`, `notarget`, `INLIMBO` (via world states or events).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `is_defensive` | boolean | `true` | Current combat mode (`true` = defensive only, `false` = aggressive). |
| `issued_health_warning` | boolean | `false` | Whether the low-health warning has been issued for the current bond. |
| `_playerlink` | entity | `nil` | The player (Wendy) to whom Abigail is linked. |
| `base_max_health` | number | `TUNING.ABIGAIL_HEALTH_LEVEL1` | Base health determined by bond level. |
| `bonus_max_health` | number | `0` | Bonus health derived from player skill states (e.g., Si Turn 3). |
| `attack_level` | number | `1` | Current attack level (1=day, 2=dusk, 3=night). |
| `attack_fx` | entity | `nil` | Reference to the active attack FX prefab (for animation syncing). |
| `fade_toggle` | net_bool | `false` | Client-side sync flag for transparency fading. |
| `_haunt_target` | entity | `nil` | Temporary haunt target during haunt command. |

## Main functions
### `linktoplayer(inst, player)`
*   **Description:** Links Abigail to a player, enabling follower behavior, health bar updates, and bonding level sync. Also configures planar resistances/bonuses based on the player’s alignment (`player_shadow_aligned` or `player_lunar_aligned`).
*   **Parameters:** `player` (entity) — the player instance to link.
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `UpdateDamage(inst, phase)`
*   **Description:** Updates Abigail’s damage output based on the current world phase (`day`, `dusk`, `night`) and the presence of `abigail_murder_buff`. Adjusts `combat.defaultdamage` and planar damage bonus. Syncs attack FX animation.
*   **Parameters:** `phase` (string, optional) — world phase to use for damage lookup. Defaults to `TheWorld.state.phase`.
*   **Returns:** Nothing.

### `BecomeAggressive(inst)`
*   **Description:** Switches Abigail to aggressive mode: changes eyes symbol to angry, removes defensive-only restriction, registers `AggressiveRetarget` as the retarget function, and adds the `has_aggressive_follower` tag to the linked player.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `BecomeDefensive(inst)`
*   **Description:** Switches Abigail to defensive mode: clears aggressive eyes symbol, adds defensive restriction, registers `DefensiveRetarget` as the retarget function, and removes `has_aggressive_follower` from the player.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DoGhostEscape(inst)`
*   **Description:** Activates the “escape” command: disables aura, sets speed multiplier, adds transparency, applies `notarget` tag, schedules undo transparency, and enters `escape` state.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `nocommand` state tag is active or Abigail is dead.

### `DoGhostScare(inst)`
*   **Description:** Scare command: finds nearby valid targets within range, applies panic to hauntable entities that can be targeted and are not friendly (respecting PVP rules and salted/domesticated status).
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `nocommand` state tag is active or Abigail is dead.

### `DoGhostAttackAt(inst, pos)`
*   **Description:** Attack command: finds entities at `pos`, sets them as combat target, blocks retargeting for the command cooldown, disables aura, and enters `abigail_attack_start` (or `gestalt_attack`) state.
*   **Parameters:** `pos` (Vector3) — position to target.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `nocommand` state tag is active or Abigail is dead.

### `DoShadowBurstBuff(inst, stack)`
*   **Description:** Applies a shadow-aligned bonus: spawns attack FX, ensures `abigail_murder_buff` exists, and extends its duration. Increases attack level and damage.
*   **Parameters:** `stack` (number) — number of stacks to add to the buff duration.
*   **Returns:** Nothing.

### `ChangeToGestalt(inst, togestalt)`
*   **Description:** Transitions between normal and gestalt forms. Sets `gestalt` tag, updates animations, combat stats (`attackperiod`, `attackrange`), and planar damage bonuses for lunar elixir.
*   **Parameters:** `togestalt` (boolean) — `true` to enter gestalt, `false` to revert.
*   **Returns:** Nothing.

### `SetToGestalt(inst)` / `SetToNormal(inst)`
*   **Description:** Internal helpers to apply gestalt or normal settings (animations, combat stats, planar bonus). Called by `ChangeToGestalt`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `AddBonusHealth(inst, val)`
*   **Description:** Increases `bonus_max_health` (capped by skill-based limit) and triggers FX. Does not lower bonus (handled via `pre_health_setval`).
*   **Parameters:** `val` (number) — amount to add.
*   **Returns:** Nothing.

### `UpdateBonusHealth(inst, newbonus)`
*   **Description:** Updates `bonus_max_health` and pushes `pethealthbar_bonuschange` event for UI sync.
*   **Parameters:** `newbonus` (number) — new bonus value.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `attacked` (→ `OnAttacked`)  
  `blocked` (→ `OnBlocked`)  
  `death` (→ `OnDeath`)  
  `onremove` (→ `OnRemoved`)  
  `exitlimbo` (→ `OnExitLimbo`)  
  `do_ghost_escape`, `do_ghost_scare`, `do_ghost_attackat`, `do_ghost_hauntat` (command events)  
  `pre_health_setval` (→ `OnHealthChanged`)  
  `droppedtarget` (→ `OnDroppedTarget`)  
  `ghostlybond_level_change` (→ `on_ghostlybond_level_change`)  
  `fade_toggledirty` (client-side `OnFadeToggleDirty`)  
  `onareaattackother` (→ `ApplyDebuff`)  
  `hitevent` for debuff FX (client-side)

- **Pushes:**  
  `transfercombattarget`, `gestalt_mutate`, `pethealthbar_bonuschange`, `startaura`/`stopaura` (via aura toggling), events via `hitevent` for debuffs.
