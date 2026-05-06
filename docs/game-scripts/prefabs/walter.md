---
id: walter
title: Walter
description: Defines the Walter player character prefab using MakePlayerCharacter, including mounted command wheel setup, Woby companion management, sprint trail effects, campfire storytelling, and multiple helper prefabs for courier markers and story proxies.
tags: [player, companion, skills, storytelling, mount]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: feea3b72
system_scope: player
---

# Walter

> Based on game build **722832** | Last updated: 2026-04-28

## Overview

This file defines the Walter player character prefab using the `MakePlayerCharacter` macro from `prefabs/player_common`. Walter is a unique character with a companion dog named Woby that can be mounted for transportation. The prefab integrates extensive systems including a mounted spellbook command wheel for Woby abilities, sprint trail visual and audio effects, campfire storytelling mechanics that provide sanity aura to nearby players, and a courier system for item delivery tracking. Key component integrations include `spellbook` for mounted commands, `rider` for Woby mounting, `sanity` with custom rate calculations based on nearby trees, `storyteller` for campfire narratives, and `wobycourier` for delivery management. The file also registers three helper prefabs: `walter_campfire_story_proxy` for storytelling aura, `wobycourier_marker` for long-range delivery indicators, and `wobycourier_marker_close` for proximity markers.

## Usage example

```lua
-- Spawn Walter character (typically handled by character selection screen)
local walter = SpawnPrefab("walter")

-- Access Woby companion reference (stored directly on instance)
local woby = walter.woby

-- Access campfire story proxy for sanity aura
local storyProxy = SpawnPrefab("walter_campfire_story_proxy")
```

## Dependencies & tags

**External dependencies:**
- `prefabs/player_common` -- MakePlayerCharacter macro for player character prefab construction
- `util/sourcemodifierlist` -- SourceModifierList for _sanity_damage_protection modifier tracking
- `prefabs/wobycommon` -- WobyCommon for command wheel setup, MakeWobyCommand, MakeAutocastToggle, SetupMouseOver


**Components used:**
- `spellbook` -- SetRadius, SetFocusRadius, SetShouldOpenFn, SetItems, SetBgData, SetSpellName, SetSpellAction, closeonexecute
- `skilltreeupdater` -- IsActivated to check skill activation status
- `rider` -- IsRiding, GetMount to check riding state and get mount entity
- `temperature` -- inherentinsulation property set when mounted
- `sanity` -- DoDelta, SetNegativeAuraImmunity, SetPlayerGhostImmunity, SetLightDrainImmune, custom_rate_fn, get_equippable_dappernessfn, only_magic_dapperness, externalmodifiers
- `foodaffinity` -- AddPrefabAffinity for trailmix
- `eater` -- SetOnEatFn for oneat callback
- `sleepingbaguser` -- SetHungerBonusMult
- `petleash` -- SetMaxPets set to 0
- `storyteller` -- SetStoryToTellFn, SetOnStoryOverFn, AbortStory
- `wobycourier` -- Added as component for courier functionality
- `health` -- SetMaxHealth, GetPercentWithPenalty
- `hunger` -- SetMax
- `builder` -- RemoveRecipe for skill-based recipes
- `timer` -- TimerExists, SetTimeLeft, StartTimer, StopTimer for wobybuck timer
- `playeractionpicker` -- doubleclickactionsfn, pointspecialactionsfn assignment
- `playercontroller` -- isclientcontrollerattached check
- `replica.inventory` -- ThePlayer.replica.inventory:CastSpellBookFromInv (accessed via ThePlayer, not inst.components)
- `colourtweener` -- StartTween for Woby spawn FX
- `updatelooper` -- AddOnUpdateFn, AddPostUpdateFn, RemoveOnUpdateFn, RemovePostUpdateFn for sprint trail and banner
- `sanityaura` -- max_distsq, aurafn, fallofffn for campfire story proxy
- `focalpoint` -- StartFocusSource, StopFocusSource for camera focus and banner

**Tags:**
- `FX` -- add
- `NOCLICK` -- add
- `CLASSIFIED` -- add
- `expertchef` -- add
- `pebblemaker` -- add
- `pinetreepioneer` -- add
- `allergictobees` -- add
- `slingshot_sharpshooter` -- add
- `dogrider` -- add
- `nowormholesanityloss` -- add
- `storyteller` -- add
- `quagmire_shopper` -- add
- `NOBLOCK` -- add
- `globalmapicon` -- add
- `woby` -- check
- `INLIMBO` -- check
- `campfire` -- check
- `tree` -- check
- `burnt` -- check
- `stump` -- check
- `fire` -- check
- `force_sprint_woby` -- check

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | (see source) | Asset definitions including scripts, animations, and sounds for Walter, Woby, and related prefabs |
| `prefabs` | table | (see source) | Prefab dependencies including wobybig, wobysmall, walter_campfire_story_proxy, portabletent, slingshot items, and courier markers |
| `has_sprint_trail` | net_bool | false | Tracks sprint trail state; dirty event: `has_sprint_trail_dirty` |
| `woby` | entity | nil | Reference to Woby companion entity |
| `_sanity_damage_protection` | SourceModifierList | (new instance) | Modifier tracking for sanity damage protection |
| `_tree_sanity_gain` | number | 0 | Cached sanity gain from nearby trees |
| `_wobybuck_damage` | number | 0 | Accumulated damage while riding Woby (triggers buck at threshold) |
| `baglock` | nil/boolean | nil | Remembers Woby's baglock setting if despawned |
| `_woby_spawntask` | task | nil | Scheduled task for spawning Woby |
| `_woby_onremove` | function | nil | Callback function registered for Woby's onremove event |
| `_spells` | table | {} | Spell list for mounted command wheel, populated in SetupMountedCommandWheel |
| `_updatemountcommandstask` | task | nil | Scheduled task for updating mount commands, set in OnIsRiding_Client |
| `_disablesprinttrailtask` | task | nil | Scheduled task for disabling sprint trail, set in EnableWobySprintTrail_Server/Client |
| `_sprinttrailsfx` | entity | nil | Sprint trail sound FX entity, set in OnUpdateSprintTrail |
| `_updatingsprinttrail` | boolean | false | Flag tracking if sprint trail update is active, set in OnHasSprintTrail |
| `_story_proxy` | entity | nil | Campfire story proxy entity, set in StoryToTellFn |
| `_tempfocus` | entity | nil | Temporary focus entity for chest remembering, set in TempFocusRememberChest |
| `wobycourier_chesticon_CLIENT` | entity | nil | Client-side Woby courier chest icon marker, set in OnUpdateWobyCourierChestIcon |
| `showchestbanner` | boolean | nil | Flag to show chest banner effect, set in TempFocusRememberChest |
| `customidleanim` | string | `'idle_walter'` | Custom idle animation name for Walter character |
| `getlinkedspellbookfn` | function | GetLinkedSpellBook | Returns linked spellbook entity for Woby commands |
| `HasWhistleAction` | function | HasWhistleAction | Checks if whistle action should be available |
| `TempFocusRememberChest` | function | TempFocusRememberChest | Creates temporary focus entity at chest position |
| `CancelTempFocusRememberChest` | function | CancelTempFocusRememberChest | Cancels temporary focus task for chest remembering |
| `OnWobyTransformed` | function | OnWobyTransformed | Callback when Woby transforms, updates reference |
| `EnableWobySprintTrail` | function | EnableWobySprintTrail_Server/Client | Enables or disables Woby sprint trail effects |
| `OnSave` | function | OnSave | Saves Woby state, baglock, buck damage, and commands |
| `OnLoad` | function | OnLoad | Restores Woby from save record with FX and color tween |
| `OnDespawn` | function | OnDespawn | Calls OnPlayerLinkDespawn on Woby when player despawns |
| `_replacewobytask` | task | nil | Scheduled task to respawn Woby if still nil after removal |
| `_predict_sprint_trail` | boolean | false | Client-side flag for sprint trail prediction state |

## Main functions

### `DoSpellAction(inst)`
* **Description:** Casts spellbook from player inventory via replica.inventory component.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** None

### `RefreshSpells(inst)`
* **Description:** Refreshes the mounted command wheel spells based on skill tree activation status. Filters SPELLS_RIGHT and SPELLS_LEFT arrays, inserting BLANK_SPELL for inactive skills.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.components.skilltreeupdater` is nil (no nil guard before IsActivated access).

### `EnableMountedCommands(inst, enable)`
* **Description:** Enables or disables the mounted command wheel spellbook. Closes spell wheel if disabling while open.
* **Parameters:**
  - `inst` -- Player entity instance
  - `enable` -- Boolean to enable or disable mounted commands
* **Returns:** nil
* **Error states:** Errors if `inst.components.spellbook` or `inst.HUD` is nil (no nil guard present before member access).

### `DoUpdateMountCommandsTask(inst)`
* **Description:** Task callback that checks if player is riding Woby and enables mounted commands accordingly.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.replica.rider` is nil or `rider:GetMount()` returns nil (no nil guards before chained member access).

### `OnIsRiding_Client(inst)`
* **Description:** Client-side listener for isridingdirty event. Schedules DoUpdateMountCommandsTask if riding, disables commands if not.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.replica.rider` is nil (no nil guard before IsRiding access).

### `ShouldOpenWobyCommands(inst, user)`
* **Description:** Determines if Woby command wheel should open based on woby_commands_classified busy state.
* **Parameters:**
  - `inst` -- Player entity instance
  - `user` -- User entity checking command availability
* **Returns:** boolean
* **Error states:** None

### `OnSkillTreeInitialized_RefreshSpells(inst)`
* **Description:** Removes itself as event listener then calls RefreshSpells. Handles both server and client skill tree initialization events.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** None

### `SetupMountedCommandWheel(inst)`
* **Description:** Initializes spellbook component with radius, focus radius, open function, items, background data, and sounds. Registers skill activation/deactivation event listeners for server and client.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.components.spellbook` is nil (no nil guard before component method calls).

### `GetLinkedSpellBook(inst)`
* **Description:** Returns Woby entity if not in limbo, used for spellbook linking.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** Woby entity or nil
* **Error states:** None

### `GetDoubleClickActions(inst, pos, dir, target)`
* **Description:** Returns dash action if walter_woby_dash skill is activated and riding Woby. Calculates target position based on direction or target entity.
* **Parameters:**
  - `inst` -- Player entity instance
  - `pos` -- Double click coordinates or nil
  - `dir` -- WASD/analog direction or nil
  - `target` -- Double click mouseover target or nil
* **Returns:** Table with ACTIONS.DASH and position, or EMPTY_TABLE
* **Error states:** Errors if `inst.components.skilltreeupdater` is nil (no nil guard before IsActivated access).

### `HasWhistleAction(inst)`
* **Description:** Checks if whistle action should be available based on Woby courier delivery state and proximity.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** boolean
* **Error states:** None

### `GetPointSpecialActions(inst, pos, useitem, right, usereticulepos)`
* **Description:** Returns whistle action if right-click, no item, client controller attached, and HasWhistleAction returns true.
* **Parameters:**
  - `inst` -- Player entity instance
  - `pos` -- Point position
  - `useitem` -- Item being used or nil
  - `right` -- Boolean for right-click action
  - `usereticulepos` -- Reticule position
* **Returns:** Table with ACTIONS.WHISTLE or empty table
* **Error states:** None

### `OnSetOwner(inst)`
* **Description:** Sets playeractionpicker doubleclickactionsfn and pointspecialactionsfn to Walter-specific functions.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.components.playeractionpicker` is nil (no nil guard before property assignment).

### `FadeOutBanner(inst, dt)`
* **Description:** Updates banner fade animation over time. Stops focus source when delay expires, removes entity when fadetime expires.
* **Parameters:**
  - `inst` -- Banner entity instance
  - `dt` -- Delta time
* **Returns:** nil
* **Error states:** Errors if `inst.AnimState` is nil (no nil guard before SetMultColour access).

### `DoBannerSound(inst, sound)`
* **Description:** Plays a sound on the entity's SoundEmitter component.
* **Parameters:**
  - `inst` -- Entity with SoundEmitter
  - `sound` -- Sound path string
* **Returns:** nil
* **Error states:** None

### `CreateWobyCourierBanner()`
* **Description:** Creates a non-networked FX entity for Woby courier banner with anim state and sound emitter.
* **Parameters:** None
* **Returns:** Banner entity instance
* **Error states:** None

### `OnUpdateWobyCourierChestIcon(inst)`
* **Description:** Updates or creates Woby courier chest icon marker at chest position. Spawns ping and banner effects when showchestbanner is set.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.wobycourier_chesticon_CLIENT` is nil or lacks Transform component (no nil guards before member access).

### `CancelTempFocusRememberChest(inst)`
* **Description:** Cancels temporary focus task and removes temp focus entity for chest remembering.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** Errors if `inst._tempfocus` is nil (no nil guard before task/member access).

### `TempFocusRememberChest(inst, x, z)`
* **Description:** Creates temporary focus entity at chest position on client. Schedules cancellation after 2 seconds.
* **Parameters:**
  - `inst` -- Player entity instance
  - `x` -- X position
  - `z` -- Z position
* **Returns:** nil
* **Error states:** Errors if `inst._tempfocus` is nil (no nil guard before task/member access).

### `StoryTellingDone(inst, story)`
* **Description:** Removes story proxy entity and sets stategraph statemem.started flag if in dostorytelling state.
* **Parameters:**
  - `inst` -- Player entity instance
  - `story` -- Story data
* **Returns:** nil
* **Error states:** Errors if `inst.sg` is nil (no nil guard before stategraph member access).

### `StoryToTellFn(inst, story_prop)`
* **Description:** Returns campfire story data if at night, fire is fueled, and campfire stories exist. Returns NOT_NIGHT or NO_FIRE strings otherwise.
* **Parameters:**
  - `inst` -- Player entity instance
  - `story_prop` -- Story prop entity
* **Returns:** Story data table or string error code or nil
* **Error states:** None

### `OnHealthDelta(inst, data)`
* **Description:** Applies sanity damage based on health loss, scaled by overtime rate and sanity damage protection modifier.
* **Parameters:**
  - `inst` -- Player entity instance
  - `data` -- Health delta event data with amount and overtime
* **Returns:** nil
* **Error states:** Errors if `inst.components.sanity` or `inst._sanity_damage_protection` is nil (no nil guard present before access).

### `startsong(inst)`
* **Description:** Removes animqueueover listener and pushes singsong event if animation is done.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.AnimState` is nil (no nil guard before AnimDone access).

### `oneat(inst, food)`
* **Description:** Listens for animqueueover to trigger startsong when eating glommerfuel or tallbirdegg.
* **Parameters:**
  - `inst` -- Player entity instance
  - `food` -- Food entity eaten
* **Returns:** nil
* **Error states:** None

### `UpdateTreeSanityGain(inst)`
* **Description:** Counts nearby trees within WALTER_TREE_SANITY_RADIUS and sets _tree_sanity_gain based on threshold.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.Transform` is nil (no nil guard before GetWorldPosition access).

### `CustomSanityFn(inst, dt)`
* **Description:** Calculates custom sanity rate: tree sanity gain minus health drain scaled by WALTER_SANITY_HEALTH_DRAIN and protection modifier.
* **Parameters:**
  - `inst` -- Player entity instance
  - `dt` -- Delta time
* **Returns:** number
* **Error states:** Errors if `inst.components.health` is nil (no nil guard before GetPercentWithPenalty access).

### `SpawnWoby(inst)`
* **Description:** Spawns Woby at walkable offset from player, avoiding other players within 40 units. Retries up to 30 attempts.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** Woby entity instance
* **Error states:** Errors if `inst.Transform` is nil (no nil guard before GetWorldPosition() access).

### `ResetOrStartWobyBuckTimer(inst)`
* **Description:** Resets wobybuck timer to WALTER_WOBYBUCK_DECAY_TIME if exists, otherwise starts new timer.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.components.timer` is nil (no nil guard before timer method access).

### `OnTimerDone(inst, data)`
* **Description:** Resets _wobybuck_damage to 0 when wobybuck timer completes.
* **Parameters:**
  - `inst` -- Player entity instance
  - `data` -- Timer done event data with name
* **Returns:** nil
* **Error states:** None

### `OnAttacked(inst, data)`
* **Description:** Accumulates damage while riding Woby. Triggers buck if damage exceeds WALTER_WOBYBUCK_DAMAGE_MAX, otherwise resets timer.
* **Parameters:**
  - `inst` -- Player entity instance
  - `data` -- Attacked event data with damage
* **Returns:** nil
* **Error states:** Errors if `inst.components.rider` is nil (no nil guard before IsRiding() and GetMount() access).

### `OnMounted(inst, data)`
* **Description:** Enables mounted commands and sets temperature insulation to INSULATION_MED_LARGE when mounting Woby.
* **Parameters:**
  - `inst` -- Player entity instance
  - `data` -- Mounted event data with target
* **Returns:** nil
* **Error states:** None

### `OnDismounted(inst, data)`
* **Description:** Disables mounted commands, resets temperature insulation, and removes sanity external modifier from mount.
* **Parameters:**
  - `inst` -- Player entity instance
  - `data` -- Dismounted event data with target
* **Returns:** nil
* **Error states:** Errors if `inst.components.sanity` is nil (no nil guard before externalmodifiers access).

### `OnWobyTransformed(inst, woby)`
* **Description:** Updates Woby reference and re-registers onremove listener when Woby transforms.
* **Parameters:**
  - `inst` -- Player entity instance
  - `woby` -- New Woby entity
* **Returns:** nil
* **Error states:** None

### `OnWobyRemoved(inst)`
* **Description:** Clears Woby reference and schedules respawn task after 1 second if Woby is still nil.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.woby` is nil (no nil guard before RemoveEventCallback with woby parameter).

### `OnRemoveEntity(inst)`
* **Description:** Removes Woby if spawned during session reconstruction. Removes story proxy entity.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.woby` exists but lacks `spawntime` property (no property guard before access).

### `OnDespawn(inst)`
* **Description:** Calls OnPlayerLinkDespawn and pushes player_despawn event on Woby.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** None

### `OnReroll(inst)`
* **Description:** Calls OnPlayerLinkDespawn on Woby with true parameter for reroll.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** None

### `OnSave(inst, data)`
* **Description:** Saves Woby save record or baglock, buck damage, and Woby commands to save data.
* **Parameters:**
  - `inst` -- Player entity instance
  - `data` -- Save data table
* **Returns:** nil
* **Error states:** Errors if `inst.woby_commands_classified` exists but `:OnSave()` method is missing (no type guard before method call).

### `OnLoad(inst, data)`
* **Description:** Restores Woby from save record with color tween and spawn FX, or restores baglock. Restores buck damage.
* **Parameters:**
  - `inst` -- Player entity instance
  - `data` -- Load data table
* **Returns:** nil
* **Error states:** Errors if `inst._woby_spawntask` is nil (no nil guard before :Cancel() call)

### `GetEquippableDapperness(owner, equippable)`
* **Description:** Returns dapperness value for magic items only, using no_moisture_penalty flag.
* **Parameters:**
  - `owner` -- Owner entity
  - `equippable` -- Equippable item
* **Returns:** number
* **Error states:** None

### `OnDeactivateSkill(inst, data)`
* **Description:** Removes unlocked station recipes from builder when skill is deactivated.
* **Parameters:**
  - `inst` -- Player entity instance
  - `data` -- Skill deactivation data with skill name
* **Returns:** nil
* **Error states:** Errors if `inst.components.builder` is nil (no nil guard before RemoveRecipe access).

### `OnSkillTreeInitialized(inst)`
* **Description:** Removes recipes for skills that are not activated in skill tree.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.components.builder` is nil (no nil guard before RemoveRecipe access).

### `IncSprintTrailSound()`
* **Description:** Increments sprint trail sound count and cancels cleanup task if active.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `DumpSprintTrailSoundPool()`
* **Description:** Removes all entities in sprint trail sound pool.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `DecSprintTrailSound()`
* **Description:** Decrements sprint trail sound count and schedules pool cleanup after 30 seconds if count reaches 0.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `CreateSprintTrailSound()`
* **Description:** Creates classified non-networked entity with sound emitter for sprint trail audio.
* **Parameters:** None
* **Returns:** FX entity instance
* **Error states:** None

### `GetSprintTrailSound()`
* **Description:** Gets sprint trail sound from pool or creates new one. Sets OnRemoveEntity callback.
* **Parameters:** None
* **Returns:** FX entity instance
* **Error states:** None

### `RecycleSprintTrailSound(fx)`
* **Description:** Kills loop sound, clears parent and callback, removes from scene, and returns to pool.
* **Parameters:**
  - `fx` -- Sprint trail sound FX entity
* **Returns:** nil
* **Error states:** None

### `IncSprintTrailFx()`
* **Description:** Increments sprint trail FX count and cancels cleanup task if active.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `DumpSprintTrailFxPool()`
* **Description:** Removes all entities in sprint trail FX pool.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `DecSprintTrailFx()`
* **Description:** Decrements sprint trail FX count and schedules pool cleanup after 30 seconds if count reaches 0.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `CreateSprintTrailFx()`
* **Description:** Creates FX entity with anim state and updatelooper component for sprint trail visual effects.
* **Parameters:** None
* **Returns:** FX entity instance
* **Error states:** None

### `GetSprintTrailFx()`
* **Description:** Gets sprint trail FX from pool or creates new one. Resets entity state and sets OnRemoveEntity callback.
* **Parameters:** None
* **Returns:** FX entity instance
* **Error states:** None

### `SprintTrailFx_PostUpdate(fx)`
* **Description:** Updates FX position and rotation relative to parent entity. Makes facing dirty.
* **Parameters:**
  - `fx` -- Sprint trail FX entity
* **Returns:** nil
* **Error states:** Errors if `fx` lacks entity, Transform, or AnimState components (no nil guards before component access).

### `SprintTrailFx_OnUpdate(fx)`
* **Description:** Fades out FX alpha over time. Returns to pool when alpha reaches 0.
* **Parameters:**
  - `fx` -- Sprint trail FX entity
* **Returns:** nil
* **Error states:** Errors if `fx.components.updatelooper` is nil (no nil guard before method access).

### `OnUpdateSprintTrail(inst, dt)`
* **Description:** Updates sprint trail FX and sound based on current animation (sprint_woby_loop, dash_woby, sprint_woby_pst).
* **Parameters:**
  - `inst` -- Player entity instance
  - `dt` -- Delta time
* **Returns:** nil
* **Error states:** Errors if `inst.AnimState` or `inst.Transform` is nil (no nil guards before component access).

### `SprintTrail_OnEntitySleep(inst)`
* **Description:** Removes sprint trail update function and recycles sound FX when entity sleeps.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.components.updatelooper` is nil (no nil guard before RemoveOnUpdateFn access).

### `SprintTrail_OnEntityWake(inst)`
* **Description:** Adds sprint trail update function when entity wakes.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.components.updatelooper` is nil (no nil guard before AddOnUpdateFn access).

### `OnHasSprintTrail(inst)`
* **Description:** Enables or disables sprint trail update based on has_sprint_trail netvar or predict flag. Handles server and client differently.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.components.updatelooper` is nil or `inst.has_sprint_trail` is not a valid netvar (no nil guards before access).

### `OnDisableSprintTask_Server(inst)`
* **Description:** Server task to disable sprint trail by setting netvar to false.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.has_sprint_trail` is not a valid net_bool (no type guard before set access).

### `EnableWobySprintTrail_Server(inst, enable)`
* **Description:** Enables or disables Woby sprint trail on server with delayed disable task.
* **Parameters:**
  - `inst` -- Player entity instance
  - `enable` -- Boolean to enable sprint trail
* **Returns:** nil
* **Error states:** Errors if `inst.has_sprint_trail` is not a valid net_bool (no type guard before value/set access).

### `OnDisableSprintTask_Client(inst)`
* **Description:** Client task to disable sprint trail prediction flag.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** Errors if `inst` is invalid entity (no entity validity guard before property assignment).

### `EnableWobySprintTrail_Client(inst, enable)`
* **Description:** Enables or disables Woby sprint trail prediction on client with delayed disable task.
* **Parameters:**
  - `inst` -- Player entity instance
  - `enable` -- Boolean to enable sprint trail
* **Returns:** nil
* **Error states:** Errors if `inst` is invalid entity (no entity validity guard before property access).

### `OnEnableMovementPrediction_Client(inst, enable)`
* **Description:** Disables sprint trail prediction when movement prediction is disabled.
* **Parameters:**
  - `inst` -- Player entity instance
  - `enable` -- Boolean for movement prediction
* **Returns:** nil
* **Error states:** Errors if `inst` is invalid entity (no entity validity guard before property access).

### `common_postinit(inst)`
* **Description:** Client-side initialization: adds character tags, sets custom idle anim, initializes sprint trail netvar, sets up mounted command wheel, and registers event listeners for owner, courier icon, and sprint trail.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** None

### `master_postinit(inst)`
* **Description:** Server-only initialization: sets starting inventory, configures health/hunger/sanity max values, sets up sanity custom rate and immunities, adds food affinity, configures eater/sleepingbaguser/petleash, adds storyteller and wobycourier components, registers event listeners for health, combat, skills, Woby management, and save/load.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** nil
* **Error states:** None

### `CampfireStory_OnNotNight(inst, isnight)`
* **Description:** Aborts storytelling if not night via storyteller component.
* **Parameters:**
  - `inst` -- Proxy entity instance
  - `isnight` -- Boolean night state
* **Returns:** nil
* **Error states:** Errors if `inst.storyteller` is nil or lacks storyteller component (no nil guards before chained access).

### `CampfireStory_CheckFire(inst, data)`
* **Description:** Aborts storytelling if fire goes out (newsection == 0).
* **Parameters:**
  - `inst` -- Proxy entity instance
  - `data` -- Fuel section changed event data
* **Returns:** nil
* **Error states:** Errors if `inst.storyteller` is nil or lacks storyteller component (no nil guards before chained access).

### `CampfireStory_aurafallofffn(inst, observer, distsq)`
* **Description:** Returns constant 1 for aura falloff (no distance falloff).
* **Parameters:**
  - `inst` -- Aura source entity
  - `observer` -- Observer entity
  - `distsq` -- Distance squared
* **Returns:** number
* **Error states:** None

### `CampfireStory_ActiveFn(params, parent, best_dist_sq)`
* **Description:** Adjusts camera gains and distance for campfire storytelling view.
* **Parameters:**
  - `params` -- Focal point parameters
  - `parent` -- Parent entity
  - `best_dist_sq` -- Best distance squared
* **Returns:** nil
* **Error states:** None

### `SetupCampfireStory(inst, storyteller, prop)`
* **Description:** Sets parent to campfire prop, stores storyteller reference, and listens for fuel section changes.
* **Parameters:**
  - `inst` -- Proxy entity instance
  - `storyteller` -- Storyteller component
  - `prop` -- Campfire prop entity
* **Returns:** nil
* **Error states:** Errors if `inst.entity` or `prop.entity` is nil (no nil guard before SetParent access).

### `CampfireAuraFn(inst, observer)`
* **Description:** Calculates sanity aura value based on camp_fire skill activation and audience count within 16 units.
* **Parameters:**
  - `inst` -- Aura source entity
  - `observer` -- Observer entity
* **Returns:** number
* **Error states:** Errors if `inst.storyteller` is nil or lacks skilltreeupdater component (no nil guards before chained access).

### `walter_campfire_story_proxy_fn()`
* **Description:** Creates campfire story proxy entity with transform, network, sanityaura component, and night state watcher.
* **Parameters:** None
* **Returns:** Proxy entity instance
* **Error states:** None

### `wobycourier_marker_fn()`
* **Description:** Creates Woby courier marker entity with minimap icon, globalmapicon tag, and child marker.
* **Parameters:** None
* **Returns:** Marker entity instance
* **Error states:** None

### `wobycourier_marker_close_fn()`
* **Description:** Creates close-range Woby courier marker child entity with minimap icon.
* **Parameters:** None
* **Returns:** Marker entity instance
* **Error states:** None

## Events & listeners

**Listens to:**
- `onremove` -- Triggers OnWobyRemoved, CancelTempFocusRememberChest, and OnRemoveEntity for cleanup
- `onactivateskill_server` -- Triggers RefreshSpells on server when skill is activated
- `ondeactivateskill_server` -- Triggers RefreshSpells and OnDeactivateSkill on server when skill is deactivated
- `ms_skilltreeinitialized` -- Triggers OnSkillTreeInitialized_RefreshSpells and OnSkillTreeInitialized on server
- `isridingdirty` -- Triggers OnIsRiding_Client on client when riding state changes
- `onactivateskill_client` -- Triggers RefreshSpells on client when skill is activated
- `ondeactivateskill_client` -- Triggers RefreshSpells on client when skill is deactivated
- `skilltreeinitialized_client` -- Triggers OnSkillTreeInitialized_RefreshSpells on client
- `animqueueover` -- Triggers startsong when eating specific foods
- `healthdelta` -- Triggers OnHealthDelta for sanity damage calculation
- `attacked` -- Triggers OnAttacked for Woby buck damage accumulation
- `timerdone` -- Triggers OnTimerDone for Woby buck timer reset
- `setowner` -- Triggers OnSetOwner to configure player action picker
- `updatewobycourierchesticon` -- Triggers OnUpdateWobyCourierChestIcon for courier marker updates
- `has_sprint_trail_dirty` -- Triggers OnHasSprintTrail on client when sprint trail netvar changes
- `enablemovementprediction` -- Triggers OnEnableMovementPrediction_Client on client
- `mounted` -- Triggers OnMounted when mounting Woby
- `dismounted` -- Triggers OnDismounted when dismounting Woby
- `ms_playerreroll` -- Triggers OnReroll for character reroll
- `entitysleep` -- Triggers SprintTrail_OnEntitySleep on server
- `entitywake` -- Triggers SprintTrail_OnEntityWake on server
- `onfueldsectionchanged` -- Triggers CampfireStory_CheckFire for campfire story proxy

**Pushes:**
- `singsong` -- Pushed with sound and lines data when singing after eating specific foods
- `player_despawn` -- Pushed on Woby entity when player despawns
- `bucked` -- Pushed on mount entity when Woby buck damage threshold is exceeded

**World state watchers:**
- `isnight` -- triggers CampfireStory_OnNotNight to abort storytelling when night ends (walter_campfire_story_proxy)