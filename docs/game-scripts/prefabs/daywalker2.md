---
id: daywalker2
title: Daywalker2
description: Manages the Daywalker2 boss entity, handling phase transitions, combat behavior, equipment management, and state persistence.
tags: [combat, boss, ai, entity]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 414971a0
system_scope: entity
---

# Daywalker2

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`daywalker2.lua` defines the `daywalker2` prefab — a boss entity with three combat phases, equipment-based ability unlocking (`swing`, `tackle`, `cannon`), and dynamic state transitions between buried, hostile, and defeated states. It integrates deeply with the game's Entity Component System (ECS), leveraging components like `combat`, `health`, `grouptargeter`, `lootdropper`, `sleeper`, and `freezable` for behavior and durability. Key features include junk-tracking for aggro decay, head-following logic for facing, and state-specific teleportation overrides. The component is responsible for managing all state transitions (`MakeBuried`, `MakeFreed`, `MakeDefeated`) and their associated cleanup/setup logic.

## Usage example
```lua
-- Assume `inst` is a newly created daywalker2 prefab instance
inst.components.combat:SetDefaultDamage(TUNING.DAYWALKER_DAMAGE)
inst.components.health:SetMaxHealth(TUNING.DAYWALKER_HEALTH)
inst.components.health:StartRegen(TUNING.DAYWALKER_HEALTH_REGEN, 1)
inst.components.lootdropper:SetChanceLootTable("daywalker2")
inst:SetHeadTracking(true)
inst:SetStalking(target)
inst:MakeBuried(junk)
-- Or when hostiling:
inst:SetBrain(brain)
inst:AddTag("hostile")
```

## Dependencies & tags
**Components used:**  
`combat`, `health`, `healthtrigger`, `grouptargeter`, `lootdropper`, `locomotor`, `sleeper`, `freezable`, `entitytracker`, `despawnfader`, `inspector`, `timer`, `updatelooper`, `stuckdetection`, `sanityaura`, `epicscare`, `teleportedoverride`, `collider`, ` colouradder`, `bloomer`, `explosiveresist`, `knownlocations`, `drownable`, `talker`, `rooted` (indirect via state checks).

**Tags added/checked:**  
Added tags: `epic`, `noepicmusic`, `monster`, `scarytoprey`, `largecreature`, `junkmob`, `pigtype`.  
Tag state toggling: `hostile` (added/removed), `notarget` (added when buried/defeated), `FX` (for sub-entities).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stalking` | entity or `nil` | `nil` | Current target the boss's head is tracking; set via `SetStalking()`. |
| `hostile` | boolean | `false` | Whether the boss is actively hostile. |
| `buried` | boolean | `false` | Whether the boss is currently buried in junk. |
| `defeated` | boolean | `false` | Whether the boss has been defeated. |
| `looted` | boolean | `false` | Whether the defeated boss has been looted. |
| `engaged` | boolean | `false` | Whether the boss is currently in an engaged combat state. |
| `_headtracking` | boolean | `false` | Whether head tracking is enabled (client/networked). |
| `_stalking` | entity or `nil` | `nil` | Networked stalking target. |
| `canswing` | boolean | `false` | Indicates whether the boss can swing a weapon. |
| `cantackle` | boolean | `false` | Indicates whether the boss can tackle with a spike. |
| `cancannon` | boolean | `false` | Indicates whether the boss has a cannon equipped. |
| `canmultiwield` | boolean | `false` | Indicates whether multi-wielding is unlocked (Phase 1+). |
| `candoublerummage` | boolean | `false` | Indicates whether double rummaging is unlocked (Phase 2+). |
| `canavoidjunk` | boolean | `true` | Whether the boss attempts to avoid colliding with junk when tackling. |
| `_thieflevel` | number | `0` | Tracks how many times junk was stolen, used to escalate aggro toward thief. |
| `override_combat_fx_size` | string | `"med"` (when buried) or `nil` | Controls combat FX size. |
| `override_combat_fx_height` | string | `"low"` or `nil` | Controls combat FX height. |

## Main functions
### `SetHeadTracking(inst, track)`
* **Description:** Enables or disables head tracking behavior. Spawns or removes the separate head entity (`CreateHead`) and attaches it to the main entity via a follower. Starts/stops the `UpdateHead` post-update function.
* **Parameters:** `track` (boolean) — if `true`, enables head tracking; `false` disables it.
* **Returns:** Nothing.

### `SetStalking(inst, stalking)`
* **Description:** Sets the entity the boss's head should track (e.g., a player). Enforces the rule that only hostile players can be stalked. Listens for `onremove` events on the stalking target to clear `stalking` on removal.
* **Parameters:** `stalking` (entity or `nil`) — the entity to stalk, or `nil` to clear tracking.
* **Returns:** Nothing.

### `GetNextItem(inst)`
* **Description:** Selects the next piece of equipment (`object`, `spike`, or `cannon`) for the boss to equip, respecting available items from the junk tracker and unlocked abilities (`canswing`, `cantackle`, `cancannon`, `canmultiwield`). Avoids re-equipping the same item consecutively if possible.
* **Parameters:** None.
* **Returns:** `junk` (entity) and `item` (string: `"object"`, `"spike"`, `"cannon"`), or `nil` if no equipment should be equipped.
* **Error states:** If `canmultiwield` is `false`, only one item can be equipped at a time — this function may return a fallback based on `inst.lastequip`.

### `SetEquip(inst, action, item, uses)`
* **Description:** Equips or unequips an item for a specific action (`"swing"`, `"tackle"`, `"cannon"`), updates AnimState visibility, and sets internal state flags (`canswing`, `numswings`, etc.). Updates combat range based on currently equipped items.
* **Parameters:** `action` (string), `item` (string or `nil`), `uses` (number, unused but kept for compatibility).
* **Returns:** Nothing.

### `DropItem(inst, action, nosound, _loot)`
* **Description:** Drops an equipped item as a break FX or loot, depending on `_loot` flag. Spawns appropriate FX prefab (`_break_fx` or `_loot_fx`), plays sound if `nosound` is `false`.
* **Parameters:** `action` (string: `"swing"`, `"tackle"`, `"cannon"`), `nosound` (boolean), `_loot` (boolean) — if `true`, spawns loot FX.
* **Returns:** Nothing.

### `CheckHealthPhase(inst)`
* **Description:** Evaluates current health percentage and applies phase modifiers by calling `fn` functions defined in `PHASES`. Each phase unlocks abilities (e.g., `canmultiwield`, `candoublerummage`, `canavoidjunk`) and updates `PHASES[0]` fallback.
* **Parameters:** None.
* **Returns:** Nothing.

### `MakeBuried(inst, junk)`
* **Description:** Transitions the boss into the *buried* state. Removes combat state (`SetEngaged(false)`), disables components (`freezable`, `sleeper`, `burnable`), adds `notarget` tag, spawns buried FX on the junk pile, switches state graph to `SGdaywalker2_buried`, and disables brain and tracking. Sets physics mass to `0` (static).
* **Parameters:** `junk` (entity) — the junk pile entity to bury into.
* **Returns:** Nothing.

### `MakeFreed(inst)`
* **Description:** Reverses `MakeBuried`, restoring combat components and tags, re-enabling brain, tracking, and loot drops. Resets state graph to `SGdaywalker2` and transitions to `"emerge"` state. Calls `CheckHealthPhase`.
* **Parameters:** None.
* **Returns:** Nothing.

### `MakeDefeated(inst, force)`
* **Description:** Transitions the boss into the *defeated* state. Stops combat, regen, brain, and tracking. Sets `notalksound` and `notarget` states. Starts a despawn timer. Removes combat components and changes sanity aura. Can be forced via `force=true`.
* **Parameters:** `force` (boolean) — if `true`, forces defeat regardless of current hostile state.
* **Returns:** Nothing.

### `SetEngaged(inst, engaged)`
* **Description:** Manages combat engagement state. When engaged: stops regen, sets combat period, triggers roar event. When disengaged: resumes regen (unless defeated), resets cooldown, drops target, clears stalking.
* **Parameters:** `engaged` (boolean).
* **Returns:** Nothing.

### `TestTackle(inst, target, range)`
* **Description:** Computes whether a tackle attack can reach `target` without colliding with the junk pile. Uses circle-circle collision and geometry to test path clearance.
* **Parameters:** `target` (entity), `range` (number or `nil`) — maximum range to consider; `nil` means combo range (always avoid junk).
* **Returns:** `true` if tackle is safe; `false` if collision with junk is inevitable.
* **Error states:** Returns `true` if no junk present; logic assumes no collision if junk is far away or in safe angular range.

### `lootsetfn(lootdropper)`
* **Description:** Custom loot setup function that dynamically decides between dropping blueprints or kits. Checks if lunar rifts are enabled; if so, inspects nearby players' builder knowledge and drops blueprints for unknown recipes. Falls back to `wagpunkbits_kit_blueprint` or `wagpunkbits_kit`.
* **Parameters:** `lootdropper` (component instance).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `attacked` (`OnAttacked`) — switches target to attacker if they're in range, especially if rooted/stuck.  
  `newcombattarget` (`OnNewTarget`) — triggers hostile state and engagement.  
  `minhealth` (`OnMinHealth`) — calls `MakeDefeated()` on health drop to zero.  
  `ms_junkstolen` (`OnJunkStolen`) — tracks thief and escalates aggression.  
  `teleported` (`OnTeleported`) — enforces teleportation behavior (e.g., re-burying near junk or staying near loot).  
  `stalkingdirty` (`OnStalkingDirty`) — updates stalked entity and updates head tracking.  
  `headtrackingdirty` (`OnHeadTrackingDirty`) — spawns/removes head entity on head tracking toggle.  
  `timerdone` (`OnDespawnTimer`) — cleans up defeated entity.  
  `onremove` (on stalked entity) — clears `stalking` on entity removal.  
  `onremove` (on junk pile during buried state) — removes boss entity.  
  `entitysleep` (`OnEntitySleep`) / `entitywake` (`OnEntityWake`) — manages despawn timer during sleep.

- **Pushes:**  
  `roar` (event data includes `{ target = combat.target }`) — triggered when engaging combat (once per engagement).  
  `invincibletoggle` (via health component).