---
id: abigail
title: Abigail
description: Defines the Abigail prefab and related entities including retaliation attack, vex debuffs, and murder buff prefabs, with complete initialization logic, event handlers, and ghost command functions.
tags: [combat, companion, ghost, prefab, ai]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 5b06d733
system_scope: entity
---

# Abigail

> Based on game build **722832** | Last updated: 2026-0428

## Overview

This prefab file defines Abigail, Wendy's ghostly sister companion, along with several related entities including retaliation attack FX, vex debuffs, and murder buff debuffs. Abigail functions as a combat follower that can be summoned by Wendy and switches between defensive and aggressive modes. The prefab configures extensive component interactions for combat, health management, ghost commands, aura damage, and visual effects. Six prefabs are registered: `abigail` (main companion entity), `abigail_retaliation` (retaliation shield FX), `abigail_vex_debuff` (normal vex debuff), `abigail_vex_shadow_debuff` (shadow vex debuff), `abigail_vex_hit` (vex hit FX), and `abigail_murder_buff` (murder buff debuff). The system integrates with Wendy's ghostly bond level, skill tree upgrades, and elixir buffs to dynamically adjust health, damage, and behavior.

## Usage example

```lua
-- Spawn Abigail via Wendy's summoning (typically handled by ghostlybond component)
local abigail = SpawnPrefab("abigail")

-- Link Abigail to a player (Wendy)
abigail:LinkToPlayer(player)

-- Command Abigail to attack at a position
abigail:DoGhostAttackAt(target_pos)

-- Switch to aggressive mode
abigail:BecomeAggressive()

-- Check current bond level for health calculations
local bond_level = player.components.ghostlybond.bondlevel
```

## Dependencies & tags

**External dependencies:**
- `components/spdamageutil` -- CollectSpDamage for special damage calculation
- `brains/abigailbrain` -- AI brain attached via SetBrain
- `TheWorld` -- Access state.phase, components.sisturnregistry, CanFlyingCrossBarriers, ismastersim
- `TheNet` -- GetPVPEnabled, IsDedicated
- `TheSim` -- FindEntities for target searching
- `TUNING` -- All Abigail balance constants for health, damage, speed, ranges, durations
- `FRAMES` -- Animation frame timing constant
- `Asset` -- Define animation and sound assets
- `Prefab` -- Register spawnable prefabs
- `CreateEntity` -- Create new entity instances
- `MakeGhostPhysics` -- Apply ghost physics configuration
- `GetString` -- Get localized announcement string
- `GetTaskRemaining` -- Get remaining time on decay timer
- `SpawnPrefab` -- Spawn FX and debuff prefabs

**Components attached to abigail:**
- `aura` -- Enables/disables aura damage, sets radius and tickperiod, assigns auratestfn
- `combat` -- Sets damage, attack period, range, retarget functions, target, and custom damage multiplier
- `debuffable` -- Registers ondebuffadded and ondebuffremoved callbacks
- `follower` -- Configures leader keeping on attacked, dead leader, and minigame keeping
- `ghostlyelixirable` -- Added for ghostly elixir interactions
- `health` -- Sets max health, regen, nofadeout, and save_maxhealth
- `inspectable` -- Sets getstatus function for inspection text
- `locomotor` -- Sets walk/run speeds, path caps, and creep trigger
- `planardamage` -- Adds planar damage bonuses
- `damagetyperesist` -- Adds damage type resistance for shadow/lunar alignment
- `damagetypebonus` -- Adds damage type bonuses for shadow/lunar alignment
- `planardefense` -- Sets base defense and adds defense bonuses
- `timer` -- Manages block_retargets and decay timers
- `trader` -- Sets AbleToAcceptTest for heart giving interactions
- `fader` -- Handles transparency fade effects (client only; not present on dedicated servers)

**External entity components accessed:**
- `pethealthbar` (on player) -- Syncs max health and symbols
- `ghostlybond` (on player) -- Reads bond level and listens for changes
- `skilltreeupdater` (on player) -- Checks wendy skill activation
- `sisturnregistry` (on world) -- Checks blossom state for healing buff
- `sleeper` (on targets) -- Wakes up targets during ghost scare
- `hauntable` (on targets) -- Triggers panic on hauntable entities
- `spellbookcooldowns` (on player) -- Restarts spell cooldowns for gestalt attacks
- `talker` (on player) -- Displays low health announcement
- `leader` (on player) -- Adds Abigail as follower
- `minigame_participator` (on targets) -- Checks to exclude from targeting
- `debuff` (on spawned debuff entities) -- Manages vex and murder buff debuffs

**Tags:**
- `abigail` -- add
- `character` -- add
- `flying` -- add
- `ghost` -- add
- `girl` -- add
- `noauradamage` -- add
- `NOBLOCK` -- add
- `notraptrigger` -- add
- `scarytoprey` -- add
- `trader` -- add
- `ghostlyelixirable` -- add
- `gestalt` -- add/remove
- `shadow_aligned` -- add
- `lunar_aligned` -- add
- `has_aggressive_follower` -- add/remove
- `notarget` -- add/remove
- `INLIMBO` -- check
- `FX` -- add
- `CLASSIFIED` -- add
- `attacktriggereddebuff` -- add/remove
- `monster` -- check
- `prey` -- check
- `insect` -- check
- `hostile` -- check
- `animal` -- check
- `balloon` -- check
- `butterfly` -- check
- `companion` -- check
- `epic` -- check
- `groundspike` -- check
- `smashable` -- check
- `structure` -- check
- `wall` -- check
- `catchable` -- check
- `haunted` -- check
- `DECOR` -- check
- `NOCLICK` -- check
- `largecreature` -- check
- `ghostlyfriend` -- check
- `reviver` -- check
- `player_shadow_aligned` -- check
- `player_lunar_aligned` -- check
- `dissipate` -- check
- `busy` -- check
- `nocommand` -- check
- `player` -- check
- `hiding` -- check

## Properties

### File-scope constants and arrays

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | `---` | Animation and sound assets for Abigail and related prefabs |
| `prefabs` | table | `---` | List of prefab dependencies spawned by Abigail |
| `ABIGAIL_DEFENSIVE_MAX_FOLLOW_DSQ` | number | (computed) | File-scope constant: defensive max follow distance squared |
| `ABIGAIL_GESTALT_DEFENSIVE_MAX_FOLLOW_DSQ` | number | (computed) | File-scope constant: gestalt defensive max follow distance squared |
| `COMBAT_MUSHAVE_TAGS` | table | `{"_combat", "_health"}` | File-scope constant: tags required for combat targets |
| `COMBAT_CANTHAVE_TAGS` | table | `{"INLIMBO", "noauradamage", "companion"}` | File-scope constant: tags that exclude combat targets |
| `COMBAT_MUSTONEOF_TAGS_AGGRESSIVE` | table | `{"monster", "prey", "insect", "hostile", "character", "animal"}` | File-scope constant: tags required for aggressive combat targets (at least one must be present) |
| `COMBAT_MUSTONEOF_TAGS_DEFENSIVE` | table | `{"monster", "prey"}` | File-scope constant: tags required for defensive combat targets (at least one must be present) |
| `COMBAT_TARGET_DSQ` | number | (computed) | File-scope constant: combat target distance squared |
| `SCARE_RADIUS` | number | `10` | File-scope constant: radius for ghost scare ability |
| `ATTACK_MUST_TAGS` | table | `{"_health", "_combat"}` | File-scope constant: tags required for ghost attack targets |
| `ATTACK_NO_TAGS` | table | `{"DECOR", "FX", "INLIMBO", "NOCLICK"}` | File-scope constant: tags that exclude ghost attack targets |
| `HAUNT_CANT_TAGS` | table | `{"catchable", "DECOR", "FX", "haunted", "INLIMBO", "NOCLICK"}` | File-scope constant: tags that exclude haunt targets |

### `abigail` instance properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_damage` | table | `{TUNING.ABIGAIL_DAMAGE.day, TUNING.ABIGAIL_DAMAGE.night}` | Instance property: damage values for scrapbook |
| `scrapbook_ignoreplayerdamagemod` | boolean | `true` | Instance property: ignore player damage modifier for scrapbook |
| `scrapbook_speechstatus` | table | `{"LEVEL1", 1}` | Instance property: speech status for scrapbook |
| `is_defensive` | boolean | `true` | Instance property: whether Abigail is in defensive mode |
| `issued_health_warning` | boolean | `false` | Instance property: whether low health warning was issued |
| `base_max_health` | number | `TUNING.ABIGAIL_HEALTH_LEVEL1` | Instance property: base max health value |
| `bonus_max_health` | number | `0` | Instance property: bonus health from skills/buffs |
| `fade_toggle` | net_bool | `false` | Instance property: net variable for fade state, fires `fade_toggledirty` event when changed (requires fader component; client only) |
| `_playerlink` | entity | `nil` | Instance property: linked player entity |
| `_haunt_target` | entity | `nil` | Instance property: current haunt target entity |
| `_OnHauntTargetRemoved` | function | `nil (assigned in fn())` | Cleanup callback for haunt target removal; removes event listener and clears `_haunt_target` reference |

### `abigail_retaliation` instance properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_RetaliationTarget` | entity | `nil` | Instance property: target for retaliation attack |
| `detachretaliationattack` | function | `nil (assigned in SetRetaliationTarget)` | Cleanup function to detach retaliation from target on death/remove. Called as `inst:detachretaliationattack(target)` |

### `abigail_vex_debuff` instance properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `hitevent` | net_event | `---` | Fires when vex debuff target is attacked by ghostlyfriend. Client-only listener triggers do_hit_fx. Note: net_event has no `:value()` method, fires via `:push()` |
| `_on_target_attacked` | function | `nil (assigned in constructor)` | Callback for attacked event on debuff target; triggers hitevent when attacker has ghostlyfriend tag |

### `abigail_murder_buff` instance properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `murder_buff_OnExtended` | function | `nil (assigned in constructor)` | Extends the murder buff decay timer. Called externally to refresh buff duration |

## Main functions

### `do_transparency(transparency_level, inst)`
* **Description:** Applies colour multiplier transparency to the entity's AnimState.
* **Parameters:**
  - `transparency_level` -- number - alpha value for transparency override
  - `inst` -- entity instance to apply transparency to
* **Returns:** nil
* **Error states:** Errors if `inst.AnimState` is nil (no nil guard present before `inst.AnimState:OverrideMultColour()`).

### `UndoTransparency(inst)`
* **Description:** Restores entity from transparent escape state, re-enables aura, removes notarget tag, and transitions to escape_end state.
* **Parameters:**
  - `inst` -- entity instance to restore from transparency
* **Returns:** nil
* **Error states:** Errors if `inst.components.aura`, `inst.components.locomotor`, or `inst.sg` is nil (no nil guard present before access or `inst.sg:GoToState()`).

### `SetMaxHealth(inst)`
* **Description:** Updates max health based on base_max_health and bonus_max_health, preserving health percentage if alive, and syncs to player's pethealthbar.
* **Parameters:**
  - `inst` -- entity instance with health component
* **Returns:** nil
* **Error states:** Errors if `inst.components.health` is nil (no nil guard present before access). Also errors if `inst._playerlink.components.pethealthbar` is accessed when `_playerlink` exists but lacks pethealthbar component.

### `UpdateGhostlyBondLevel(inst, level)`
* **Description:** Updates Abigail's max health and light settings based on ghostly bond level from TUNING constants.
* **Parameters:**
  - `inst` -- entity instance
  - `level` -- number - ghostly bond level (1-3)
* **Returns:** nil
* **Error states:** Errors if `inst.Light` or `inst.AnimState` is nil (no nil guard present before `inst.Light:Enable/SetRadius/SetIntensity/SetFalloff()` or `inst.AnimState:SetLightOverride()`).

### `IsWithinDefensiveRange(inst)`
* **Description:** Checks if player link exists and distance squared is within defensive follow range, with gestalt mode using larger range.
* **Parameters:**
  - `inst` -- entity instance
* **Returns:** boolean
* **Error states:** Errors if `inst.components.combat` is nil (no nil guard present before `inst.components.combat.target` access).

### `SetTransparentPhysics(inst, on)`
* **Description:** Sets physics collision mask to allow flying through barriers when transparent, or restore normal collision when opaque.
* **Parameters:**
  - `inst` -- entity instance
  - `on` -- boolean - enable transparent physics collision mask
* **Returns:** nil
* **Error states:** Errors if `inst.Physics` is nil (no nil guard present before `inst.Physics:SetCollisionMask()`).

### `CommonRetarget(inst, v)`
* **Description:** Validates retarget candidate by checking visibility, distance to player, combat targeting rules, minigame participation, and ally status.
* **Parameters:**
  - `inst` -- entity instance
  - `v` -- potential target entity
* **Returns:** boolean
* **Error states:** Errors if `v` or `inst` lacks `components.combat`, or `inst` lacks `components.timer` (no nil guard present before `v.components.combat.target`, `inst.components.combat:CanTarget()`, `inst.components.combat:IsAlly()`, or `inst.components.timer:TimerExists()`).

### `DefensiveRetarget(inst)`
* **Description:** Finds valid targets within defensive range that are attacking the player or being attacked by the player.
* **Parameters:**
  - `inst` -- entity instance
* **Returns:** entity or nil
* **Error states:** Errors if `inst.Transform` is nil (no nil guard present before `inst.Transform:GetWorldPosition()`).

### `AggressiveRetarget(inst)`
* **Description:** Finds valid targets within aggressive combat range using broader target tags.
* **Parameters:**
  - `inst` -- entity instance
* **Returns:** entity or nil
* **Error states:** Errors if `inst.Transform` is nil (no nil guard present before `inst.Transform:GetWorldPosition()`).

### `StartForceField(inst)`
* **Description:** Adds forcefield debuff if not dissipating, not already forcefielded, and not dead.
* **Parameters:**
  - `inst` -- entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.sg`, `inst.components.health`, or `inst.components.debuffable` is nil (no nil guard present).

### `OnAttacked(inst, data)`
* **Description:** Handles attack events by setting combat target, triggering retaliation if elixir buff active, playing shield sound, and starting forcefield.
* **Parameters:**
  - `inst` -- entity instance
  - `data` -- table - attack data with attacker field
* **Returns:** nil
* **Error states:** Errors if `inst.components.combat` or `inst.SoundEmitter` is nil (no nil guard present before `inst.components.combat:SetTarget()` or `inst.SoundEmitter:PlaySound()`).

### `OnBlocked(inst, data)`
* **Description:** Recalls Abigail via ghostlybond if blocked by player link and not dead.
* **Parameters:**
  - `inst` -- entity instance
  - `data` -- table - block data with attacker field
* **Returns:** nil
* **Error states:** None

### `OnDeath(inst)`
* **Description:** Disables aura and removes ghostlyelixir and forcefield debuffs on death.
* **Parameters:**
  - `inst` -- entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.components.aura` is nil (no nil guard present before `inst.components.aura:Enable()`).

### `OnRemoved(inst)`
* **Description:** Sets Abigail to defensive mode when removed.
* **Parameters:**
  - `inst` -- entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.BecomeDefensive` is nil (no nil guard before call).

### `_auratest(inst, target, can_initiate)`
* **Description:** Determines if aura should affect target based on player link, minigame participation, ghost tags, defensive range, ally status, and combat targeting.
* **Parameters:**
  - `inst` -- entity instance
  - `target` -- potential aura target entity
  - `can_initiate` -- boolean - whether aura can initiate on this target
* **Returns:** boolean
* **Error states:** Errors if `target` lacks `components.minigame_participator` or `components.combat`, or `inst` lacks `components.combat` or `components.follower` (no nil guards present).

### `auratest(inst, target)`
* **Description:** Wrapper for _auratest with can_initiate set to false, used for aura and combat keeptarget.
* **Parameters:**
  - `inst` -- entity instance
  - `target` -- potential aura target entity
* **Returns:** boolean
* **Error states:** Errors if `target` or `inst` lacks required components (`minigame_participator`, `combat`, `follower`) — inherits from _auratest().

### `UpdateDamage(inst)`
* **Description:** Updates combat damage based on world phase and elixir buffs, sets attack_level, applies planar damage bonus for murder buff, and updates attack FX animation. If murderbuff debuff active, adds shadow planar damage bonus; otherwise sets planar damage bonus to 0.
* **Parameters:**
  - `inst` -- entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.components.combat` or `inst.components.planardamage` is nil (no nil guard present before access).

### `CustomCombatDamage(inst, target)`
* **Description:** Returns damage multiplier based on whether target has abigail vex debuff.
* **Parameters:**
  - `inst` -- entity instance
  - `target` -- attack target entity
* **Returns:** number
* **Error states:** Errors if target is nil or lacks GetDebuff method (no nil guard present).

### `AbigailHealthDelta(inst, data)`
* **Description:** Triggers low health warning talker message when health drops below 25%, clears warning when above 33%.
* **Parameters:**
  - `inst` -- entity instance
  - `data` -- table - health delta with oldpercent and newpercent
* **Returns:** nil
* **Error states:** Errors if `inst._playerlink` exists but lacks `components.talker` (no nil guard before `inst._playerlink.components.talker:Say()`). The initial nil check only guards the `_playerlink` reference itself.

### `DoAppear(sg)`
* **Description:** Transitions stategraph to appear state.
* **Parameters:**
  - `sg` -- stategraph instance
* **Returns:** nil
* **Error states:** None

### `AbleToAcceptTest(inst, item)`
* **Description:** Trader test function that rejects all items but returns ABIGAILHEART string for reviver tagged items.
* **Parameters:**
  - `inst` -- entity instance
  - `item` -- item entity to test
* **Returns:** boolean, string or nil
* **Error states:** None

### `OnDebuffAdded(inst, name, debuff)`
* **Description:** Updates player's pethealthbar symbol when elixir buffs are added.
* **Parameters:**
  - `inst` -- entity instance
  - `name` -- string - debuff name
  - `debuff` -- debuff instance
* **Returns:** nil
* **Error states:** Errors if `inst._playerlink` exists but lacks `components.pethealthbar` (no nil guard present).

### `OnDebuffRemoved(inst, name, debuff)`
* **Description:** Clears player's pethealthbar symbol when elixir buffs are removed.
* **Parameters:**
  - `inst` -- entity instance
  - `name` -- string - debuff name
  - `debuff` -- debuff instance
* **Returns:** nil
* **Error states:** Errors if `inst._playerlink` exists but lacks `components.pethealthbar` (no nil guard present).

### `on_ghostlybond_level_change(inst, player, data)`
* **Description:** Triggers ghostlybond levelup state and updates health/lighting when bond level increases above 1.
* **Parameters:**
  - `inst` -- entity instance
  - `player` -- player entity
  - `data` -- table - level change data
* **Returns:** nil
* **Error states:** Errors if `inst` lacks `sg` or `components.health` (no nil guards before `inst.sg:HasStateTag()`, `inst.components.health:IsDead()`, or `inst.sg:GoToState()`). The initial condition check does not guard these component accesses.

### `BecomeAggressive(inst)`
* **Description:** Switches to aggressive mode with angry eyes, sets is_defensive false, adds has_aggressive_follower tag to player, and sets aggressive retarget function.
* **Parameters:**
  - `inst` -- entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.AnimState`, `inst._playerlink`, or `inst.components.combat` is nil (no nil guard present before `inst.AnimState:OverrideSymbol()`, `inst._playerlink:AddTag()`, or `inst.components.combat:SetRetargetFunction()`).

### `BecomeDefensive(inst)`
* **Description:** Switches to defensive mode, clears eye override, sets is_defensive true, removes has_aggressive_follower tag, and sets defensive retarget function.
* **Parameters:**
  - `inst` -- entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.AnimState`, `inst.components.combat`, or `inst._playerlink` is nil (no nil guard present before `inst.AnimState:ClearOverrideSymbol()`, `inst.components.combat:SetRetargetFunction()`, or `inst._playerlink:RemoveTag()`).

### `onlostplayerlink(inst)`
* **Description:** Called via event listener registered on player entity for onremove event. Clears the player link reference when the linked player is removed.
* **Parameters:**
  - `inst` -- entity instance whose player link is being cleared
* **Returns:** nil
* **Error states:** None

### `ApplyDebuff(inst, data)`
* **Description:** Applies vex debuff to attack target, choosing shadow variant if super elixir shadow buff active, and overrides flower symbol with skin build.
* **Parameters:**
  - `inst` -- entity instance
  - `data` -- table - attack data with target field
* **Returns:** nil
* **Error states:** Errors if `data.target` is nil, or `target` lacks `GetDebuff`/`AddDebuff`/`RemoveDebuff` methods, or `debuff` lacks `AnimState` (no nil guards present).

### `linktoplayer(inst, player)`
* **Description:** Links Abigail to player, sets defensive mode, registers health and area attack listeners, adds as follower, sets up pethealthbar, applies shadow/lunar alignment bonuses, and listens for ghostlybond changes. If player has `player_shadow_aligned` tag: adds `shadow_aligned` tag, shadow resistance, vs lunar bonus, and ghost planar defense. If player has `player_lunar_aligned` tag: adds `lunar_aligned` tag, lunar resistance, vs shadow bonus, and ghost planar defense.
* **Parameters:**
  - `inst` -- entity instance
  - `player` -- player entity to link to
* **Returns:** nil
* **Error states:** Errors if `player` or `inst` lacks required components (`pethealthbar`, `leader`, `ghostlybond`, `damagetyperesist`, `damagetypebonus`, `planardefense`) — no nil guards present.

### `OnExitLimbo(inst)`
* **Description:** Enables light based on ghostly bond level when exiting limbo.
* **Parameters:**
  - `inst` -- entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.Light` is nil (no nil guard present before `inst.Light:Enable()`).

### `DoGhostEscape(inst)`
* **Description:** Initiates ghost escape command: disables aura, sets transparency speed multiplier, adds notarget tag, schedules undo task, and transitions to escape state.
* **Parameters:**
  - `inst` -- entity instance
* **Returns:** nil
* **Error states:** Errors if `inst` lacks `sg`, `components.health`, `components.aura`, `components.locomotor`, `components.combat`, or `fade_toggle` (no nil guards present).

### `apply_panic_fx(target, fx_prefab)`
* **Description:** Spawns panic FX at target position.
* **Parameters:**
  - `target` -- entity to spawn FX at
  - `fx_prefab` -- string - prefab name for panic FX
* **Returns:** entity
* **Error states:** None

### `DelayedGhostScare(target)`
* **Description:** Wakes up sleeper component and spawns panic FX after delay.
* **Parameters:**
  - `target` -- entity to scare
* **Returns:** nil
* **Error states:** Errors if `target` lacks `components.sleeper` or `DoTaskInTime` method (no nil guards present before `target.components.sleeper:WakeUp()` or `target:DoTaskInTime()`).

### `DoGhostScare(inst)`
* **Description:** Scares nearby hauntable entities within 10 unit radius that are valid combat targets.
* **Parameters:**
  - `inst` -- entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.sg`, `inst.components.health`, or `inst.Transform` is nil (no nil guard present).

### `DoGhostAttackAt(inst, pos)`
* **Description:** Commands Abigail to attack at position, sets combat target if entity found, starts block_retargets timer, disables aura, and transitions to attack state.
* **Parameters:**
  - `inst` -- entity instance
  - `pos` -- Vector3 - target position
* **Returns:** nil
* **Error states:** Errors if `inst` lacks `sg`, `components.health`, `components.combat`, `components.timer`, or `components.aura`, or `_playerlink` lacks `components.spellbookcooldowns` (no nil guards present).

### `DoGhostHauntAt(inst, pos)`
* **Description:** Commands Abigail to haunt at position, stores haunt target and listens for onremove.
* **Parameters:**
  - `inst` -- entity instance
  - `pos` -- Vector3 - target position
* **Returns:** nil
* **Error states:** Errors if `inst.sg`, `inst.components.health`, or `inst.Transform` is nil (no nil guard present).

### `OnDroppedTarget(inst, data)`
* **Description:** Stops block_retargets timer when target is dropped to allow retargeting.
* **Parameters:**
  - `inst` -- entity instance
  - `data` -- table - dropped target data
* **Returns:** nil
* **Error states:** Errors if `inst.components.timer` is nil (no nil guard present before `inst.components.timer:StopTimer()`).

### `getstatus(inst)`
* **Description:** Returns LEVEL1, LEVEL2, or LEVEL3 string based on ghostly bond level.
* **Parameters:**
  - `inst` -- entity instance
* **Returns:** string
* **Error states:** Errors if `inst._playerlink` exists but lacks `components.ghostlybond` (no nil guard before `.bondlevel` access).

### `DoShadowBurstBuff(inst, stack)`
* **Description:** Spawns shadow burst FX, adds murder buff debuff if not present, and extends buff duration.
* **Parameters:**
  - `inst` -- entity instance
  - `stack` -- number - buff stack count
* **Returns:** nil
* **Error states:** Errors if `inst.Transform` is nil (no nil guard present before `inst.Transform:GetWorldPosition()`). Also errors if `inst` lacks `GetDebuff`/`AddDebuff` methods or `murder_buff` lacks `decaytimer` (no nil guards present).

### `calcabigailmaxhealthbonus(inst)`
* **Description:** Calculates max health bonus based on leader's skilltreeupdater wendy_sisturn_4 activation.
* **Parameters:**
  - `inst` -- entity instance
* **Returns:** number
* **Error states:** Errors if `inst.components.follower` is nil, or `leader` lacks `components.skilltreeupdater` (no nil guard present).

### `UpdateBonusHealth(inst, newbonus)`
* **Description:** Updates bonus_max_health and pushes pethealthbar_bonuschange event with percent calculations.
* **Parameters:**
  - `inst` -- entity instance
  - `newbonus` -- number - new bonus health value
* **Returns:** nil
* **Error states:** Errors if `inst:PushEvent` is not available (no nil guard present).

### `AddBonusHealth(inst, val)`
* **Description:** Adds bonus health up to calculated max, spawns twinkles FX, and calls SetMaxHealth.
* **Parameters:**
  - `inst` -- entity instance
  - `val` -- number - health bonus to add
* **Returns:** nil
* **Error states:** Errors if `inst` lacks `UpdateBonusHealth` method or `AddChild` (no nil guard present).

### `OnHealthChanged(inst, data)`
* **Description:** Adjusts bonus_max_health when health changes, only allowing decreases through this handler.
* **Parameters:**
  - `inst` -- entity instance
  - `data` -- table - health change data with val field
* **Returns:** nil
* **Error states:** Errors if `inst.components.health` is nil (no nil guard present before `inst.components.health.maxhealth` assignment).

### `SetToGestalt(inst)`
* **Description:** Transforms Abigail to gestalt form: adds gestalt tag, disables aura, changes build, overrides symbols, sets attack period to 3, range to 6, and applies lunar elixir damage bonus.
* **Parameters:**
  - `inst` -- entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.components.aura`, `inst.AnimState`, `inst.components.combat`, or `inst.components.planardamage` is nil (no nil guard present before component method calls).

### `SetToNormal(inst)`
* **Description:** Transforms Abigail back to normal form: removes gestalt tag, enables aura, restores build, clears symbol overrides, sets attack period to 4, range to 3, and applies normal lunar elixir damage bonus.
* **Parameters:**
  - `inst` -- entity instance to transform back to normal form
* **Returns:** nil
* **Error states:** Errors if `inst.components.aura`, `inst.AnimState`, `inst.components.combat`, or `inst.components.planardamage` is nil (no nil guard present before component method calls).

### `OnSave(inst, data)`
* **Description:** Saves bonus_max_health and gestalt tag state.
* **Parameters:**
  - `inst` -- entity instance
  - `data` -- table - save data
* **Returns:** nil
* **Error states:** Errors if `inst` lacks `bonus_max_health` property or `HasTag` method (no nil guard present).

### `onload_bonushealth_task(inst, new_bonus_max_health)`
* **Description:** Delayed task to restore bonus health on load.
* **Parameters:**
  - `inst` -- entity instance
  - `new_bonus_max_health` -- number - bonus health to restore
* **Returns:** nil
* **Error states:** None

### `OnLoad(inst, data)`
* **Description:** Restores gestalt state and schedules bonus health restoration on load.
* **Parameters:**
  - `inst` -- entity instance
  - `data` -- table - load data
* **Returns:** nil
* **Error states:** Errors if `SetToGestalt` is nil or `inst` lacks `bonus_max_health` property or `DoTaskInTime` method (no nil guard present).

### `ChangeToGestalt(inst, togestalt)`
* **Description:** Pushes gestalt_mutate event when transforming to or from gestalt form.
* **Parameters:**
  - `inst` -- entity instance
  - `togestalt` -- boolean - transform to gestalt
* **Returns:** nil
* **Error states:** Errors if `inst` lacks `HasTag` or `PushEvent` methods (no nil guard present).

### `OnFadeToggleDirty(inst)`
* **Description:** Handles fade_toggle netvar dirty event by enabling point filtering and fading transparency via fader component.
* **Parameters:**
  - `inst` -- entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.AnimState` or `inst.components.fader` is nil (no nil guard present before `inst.AnimState:UsePointFiltering()` or `inst.components.fader:Fade()`).

### `updatehealingbuffs(inst)`
* **Description:** Adjusts elixir buff decay timer speed based on sisturn blossom, wendy_sisturn_3 skill, and in-world status.
* **Parameters:**
  - `inst` -- entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.components.follower` or `buff.components.timer` is nil (no nil guard present before `inst.components.follower:GetLeader()` or `buff.components.timer:GetTimeLeft/StartTimer/StopTimer()`).

### `fn()`
* **Description:** Main prefab constructor for abigail. Creates entity, adds components, sets up assets, configures combat/health/locomotor, registers event listeners, and attaches brain and stategraph.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** Errors if entity lacks required base components (`Transform`, `AnimState`, `SoundEmitter`, `Light`, `Network`) — `CreateEntity` should provide these but failure would crash.

### `SetRetaliationTarget(inst, target)`
* **Description:** Sets retaliation target, parents entity to target, scales based on target size, and registers cleanup listeners.
* **Parameters:**
  - `inst` -- retaliation entity
  - `target` -- target entity to attach to
* **Returns:** nil
* **Error states:** Errors if `target` is nil or lacks `entity`, `Transform`, or `HasTag` method (no nil guards present before `target.entity:SetParent()`, `target.Transform:GetScale()`, or `target:HasTag()`).

### `DoRetaliationDamage(inst)`
* **Description:** Deals retaliation damage to target and plays FX sound.
* **Parameters:**
  - `inst` -- retaliation entity
* **Returns:** nil
* **Error states:** Errors if `inst` lacks `detachretaliationattack` method or `SoundEmitter` component (no nil guard present before `inst:detachretaliationattack()` or `inst.SoundEmitter:PlaySound()`).

### `retaliationattack_fn()`
* **Description:** Prefab constructor for abigail_retaliation. Creates shield FX entity that deals damage after delay and removes itself.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** Errors if `inst.Transform` is nil (no nil guard present before `inst.Transform:SetScale()`). Also errors if `inst` lacks `AnimState` or `DoTaskInTime`/`Remove` methods (no nil guards present).

### `CreateDebuff(name)`
* **Description:** Factory function that creates vex debuff prefabs with attached, detached, and extended callbacks.
* **Parameters:**
  - `name` -- string - debuff prefab name
* **Returns:** Prefab
* **Error states:** None

### `abigail_vex_debuff_fn()`
* **Description:** Prefab constructor for vex debuff. Sets up anims, hitevent net_event, and debuff component callbacks.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** Errors if `inst` lacks required components (`debuff`, `damagetypebonus`) or methods (`AddComponent`, `AddTag`, `ListenForEvent`, `RemoveEventCallback`, `AnimState`) — no nil guards present.

### `abigail_vex_hit_fn()`
* **Description:** Prefab constructor for vex hit FX. Plays hit animation and removes on animover.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** Errors if `inst` lacks `ListenForEvent` or `Remove` methods (no nil guard present).

### `murder_buff_OnExtended(inst, duration)`
* **Description:** Extends murder buff decay timer.
* **Parameters:**
  - `inst` -- debuff entity
  - `duration` -- number - buff duration
* **Returns:** nil
* **Error states:** None

### `murder_buff_OnAttached(inst, target)`
* **Description:** Applies murder buff: updates damage, changes build to shadow, restarts aura, spawns FX, adds planar defense bonus.
* **Parameters:**
  - `inst` -- debuff entity
  - `target` -- target entity
* **Returns:** nil
* **Error states:** Errors if `target` lacks `AnimState`, `components.aura`, or `components.planardefense` (no nil guard present before `target.AnimState:SetBuild()`, `target.components.aura`, or `target.components.planardefense:AddBonus()`).

### `murder_buff_OnDetached(inst, target)`
* **Description:** Removes murder buff: cancels timer, updates damage, restores build, restarts aura, spawns FX, removes planar defense bonus.
* **Parameters:**
  - `inst` -- debuff entity
  - `target` -- target entity
* **Returns:** nil
* **Error states:** Errors if `target` lacks `AnimState`, `components.aura`, or `components.planardefense` (no nil guard present before `target.AnimState:SetBuild()`, `target.components.aura`, or `target.components.planardefense:RemoveBonus()`).

### `abigail_murder_buff_fn()`
* **Description:** Prefab constructor for murder buff debuff. Sets up debuff component with murder buff callbacks.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** Errors if `inst` lacks `AddComponent` method or `debuff` component (no nil guard present).

## Events & listeners

**Listens to:**
- `fade_toggledirty` -- Triggers OnFadeToggleDirty when fade_toggle netvar changes
- `attacked` -- Triggers OnAttacked when entity is attacked
- `blocked` -- Triggers OnBlocked when attack is blocked
- `death` -- Triggers OnDeath when entity dies
- `onremove` -- Triggers OnRemoved when entity is removed
- `exitlimbo` -- Triggers OnExitLimbo when exiting limbo state
- `do_ghost_escape` -- Triggers DoGhostEscape command
- `do_ghost_scare` -- Triggers DoGhostScare command
- `do_ghost_attackat` -- Triggers DoGhostAttackAt command
- `do_ghost_hauntat` -- Triggers DoGhostHauntAt command
- `pre_health_setval` -- Triggers OnHealthChanged before health value is set
- `droppedtarget` -- Triggers OnDroppedTarget when combat target is dropped
- `ghostlybond_level_change` -- Triggers on_ghostlybond_level_change when bond level changes
- `onareaattackother` -- Triggers ApplyDebuff on area attack
- `animqueueover` -- Triggers entity removal after animation queue completes
- `animover` -- Triggers entity removal after animation completes
- `abigail_vex_debuff.hitevent` -- Triggers hit FX on client (net_event fires without data table - callback receives inst only)

**World state watchers:**
- `phase` -- Triggers UpdateDamage when world phase changes (day/dusk/night), recalculating Abigail's damage and attack level

**Pushes:**
- `stopaura` -- Stops aura application
- `startaura` -- Starts aura application
- `transfercombattarget` -- Transfers combat target (nil to drop)
- `pethealthbar_bonuschange` -- Updates pet health bar bonus display
- `gestalt_mutate` -- Signals gestalt transformation state change