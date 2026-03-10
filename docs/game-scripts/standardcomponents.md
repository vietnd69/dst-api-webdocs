---
id: standardcomponents
title: Standardcomponents
description: A collection of utility functions for adding common physics, burnable, freezable, perishable, hauntable, and deployment behaviors to entities in Don't Starve Together.
tags: [physics, fire, freeze, spoilage, haunt, deployment]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: abff97d5
system_scope: entity
---

# Standardcomponents

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`standardcomponents.lua` provides a library of helper functions to quickly configure common entity behaviors in DST. It includes factory functions for physics setups (character, obstacle, inventory, floating), burnable and propagator components (with varying fire sizes), freeze/shatter behaviors, perishable lifecycle hooks, hauntable customization (launch, change-prefab, panic, anim, stategraph transitions), snow cover and lunar hail buildup, fertilizer deployment, and hermit crab area detection. These utilities abstract repetitive setup logic and ensure consistent behavior across prefabs.

## Usage example
```lua
local inst = ENTINST

-- Make a creature with small burnable and physics
MakeSmallBurnableCharacter(inst, "idle")

-- Add a medium perishable lifecycle
MakeSmallPerishableCreature(inst, TUNING.PERISH_TIME_MEDIUM)

-- Configure hauntable to launch and change prefab
MakeHauntableLaunchOrChangePrefab(
    inst,
    0.8, -- launch chance
    0.2, -- prefab change chance
    TUNING.LAUNCH_SPEED_MEDIUM,
    TUNING.HAUNT_COOLDOWN_MEDIUM,
    "prefab_after_haunt",
    TUNING.HAUNT_LARGE,
    TUNING.HAUNT_TINY,
    false
)

-- Set up snow coverage and lunar hail
MakeSnowCovered(inst)
MakeLunarHailBuildup(inst)
SetLunarHailBuildupAmountMedium(inst)

-- Deployable fertilizer with nutrient application
MakeDeployableFertilizer(inst)
```

## Dependencies & tags
**Components used:**
- `armor`, `burnable`, `childspawner`, `combat`, `constructionsite`, `container`, `dryer`, `dryingrack`, `eater`, `equippable`, `farming_manager`, `fertilizer`, `finiteuses`, `forgerepairable`, `freezable`, `fueled`, `grower`, `growable`, `harvestable`, `hauntable`, `health`, `homeseeker`, `inventory`, `inventoryitem`, `inventoryitemholder`, `lootdropper`, `lunarhailbuildup`, `pearldecorationscore`, `perishable`, `pickable`, `prototyper`, `sleeper`, `sleepingbag`, `spawner`, `stackable`, `stewer`, `wardrobe`, `waterphysics`, `workable`
- `physics` (via `inst.Physics`)
- `floater`, `deployable`, `waxable` (added conditionally)
- Global world components: `farming_manager`, `pearldecorationscore`, `hermitcrab_relocation_manager`

**Tags:**
- `"burnt"`, `"NOCLICK"`, `"blocker"`, `"SnowCovered"`, `"show_spoilage"`, `"small_livestock"`, `"deployable"`, `"tile_deploy"`, `"INLIMBO"`, `"character"`, `"locomotor"`, `"nosteal"`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `coldness` | number | `0` | Coldness level on `freezable` component (updated by `AddColdness`) |
| `restitution` | number | `1` | Bounciness on `waterphysics` component |
| `is_landed` | boolean | `false` | Whether an `inventoryitem` has landed |
| `owner` | entity | `nil` | Owner of an `inventoryitem` |
| `stacksize` | number | `1` | Current stack size on `stackable` component |
| `maxsize` | number | `TUNING.STACK_SIZE_MEDITEM` | Maximum stack size on `stackable` |
| `equipslot` | EQUIPSLOTS | `EQUIPSLOTS.HANDS` | Equipment slot on `equippable` |
| `isequipped` | boolean | `false` | Equipped state on `equippable` |
| `target` | entity | `nil` | Current combat target on `combat` |
| `home` | vector | `nil` | Home position on `homeseeker` |

## Main functions

### `DefaultIgniteFn(inst)`
* **Description:** Triggers wildfire behavior on the entity’s `burnable` component if present.
* **Parameters:** `inst` — The entity instance.
* **Returns:** None.

### `DefaultBurnFn(inst)`
* **Description:** Marks non-tree/non-structure entities as non-persistent when burning.
* **Parameters:** `inst` — The entity instance.
* **Returns:** None.

### `DefaultBurntFn(inst)`
* **Description:** Handles post-burn state: removes `growable` component, clears `inventoryitem` data, sets `workable` work to `0` (unless hammer action), spawns ash (unless on ocean), and removes the entity.
* **Parameters:** `inst` — The entity instance.
* **Returns:** None.

### `DefaultExtinguishFn(inst)`
* **Description:** Restores persistence for non-tree/non-structure entities.
* **Parameters:** `inst` — The entity instance.
* **Returns:** None.

### `DefaultBurntStructureFn(inst)`
* **Description:** Applies permanent burnt state to structures: adds `"burnt"` tag, disables lighting/anim/sound/minimap, resets `workable`, releases/queues children via `childspawner`, stops drying via `dryingrack`/`dryer`/`dryingbox`, clears containers, stops cooking via `stewer`, stops growing via `harvestable`, resets `grower`, releases spawner child, removes `prototyper`/`wardrobe`/`constructionsite`, and finally removes the entity.
* **Parameters:** `inst` — The entity instance.
* **Returns:** None.

### `DefaultBurntCorpseFn(inst)`
* **Description:** Applies charred appearance, sets `fastextinguish`, adds `"NOCLICK"` tag, marks non-persistent, and erodes away (instantly).
* **Parameters:** `inst` — The entity instance.
* **Returns:** None.

### `DefaultExtinguishCorpseFn(inst)`
* **Description:** Applies charred appearance for persistent entities, adds `"NOCLICK"`, marks non-persistent, and erodes away either immediately or after a short delay.
* **Parameters:** `inst` — The entity instance.
* **Returns:** None.

### `MakeSmallBurnable(inst, time, offset, structure, sym)`
* **Description:** Adds `burnable` component with small fire level (2), default time 10s, and default burnt/ignition/extinguish handlers.
* **Parameters:**
  - `inst` — Entity instance.
  - `time` — Optional burn duration (default `10`).
  - `offset` — Optional 3D offset (default `(0,0,0)`).
  - `structure` — Boolean to select burnt handler (`structure ? DefaultBurntStructureFn : DefaultBurntFn`).
  - `sym` — Animation symbol for FX.
* **Returns:** The added `burnable` component.

### `MakeMediumBurnable(inst, time, offset, structure, sym)`
* **Description:** Same as `MakeSmallBurnable`, but with FX level 3 and default time 20s.

### `MakeLargeBurnable(inst, time, offset, structure, sym)`
* **Description:** Same as `MakeSmallBurnable`, but with FX level 4 and default time 30s.

### `MakeSmallPropagator(inst)`
* **Description:** Adds `propagator` component configured for small heat propagation: heat-based ignition (flashpoint `5–10`), damage output, decay, range (`2–4`).
* **Parameters:** `inst` — Entity instance.
* **Returns:** The added `propagator` component.

### `MakeMediumPropagator(inst)`
* **Description:** Same as `MakeSmallPropagator`, but with larger flashpoint (`15–25`), range (`5–7`), and heatoutput (`5–8.5`).

### `MakeLargePropagator(inst)`
* **Description:** Same as `MakeSmallPropagator`, but with largest flashpoint (`45–55`), range (`6–8`), and heatoutput (`6–9.5`).

### `MakeSmallBurnableCharacter(inst, sym, offset)`
* **Description:** Adds `burnable` for characters with level 1 FX, no auto-ignition (`canlight=false`), and `MakeSmallPropagator` (heat disabled).
* **Parameters:**
  - `inst` — Entity instance.
  - `sym` — Animation symbol.
  - `offset` — Optional 3D offset (default varies by `sym`).
* **Returns:** Two values: `burnable`, `propagator` components.

### `MakeMediumBurnableCharacter(inst, sym, offset)`
* **Description:** Same as `MakeSmallBurnableCharacter`, but with burnable level 2 and propagator unchanged.

### `MakeLargeBurnableCharacter(inst, sym, offset, scale)`
* **Description:** Same as `MakeSmallBurnableCharacter`, but with burnable level 3 and `MakeLargePropagator` (heat disabled). Supports `scale`.

### `MakeSmallBurnableCorpse(inst, time, sym, offset, scale)`
* **Description:** Same as `MakeSmallBurnableCharacter`, but uses corpse-specific handlers (`DefaultExtinguishCorpseFn`, `DefaultBurntCorpseFn`) and a small propagator.

### `MakeMediumBurnableCorpse(inst, time, sym, offset, scale)`
* **Description:** Same as `MakeSmallBurnableCorpse`, but with burnable level 2 and small propagator.

### `MakeLargeBurnableCorpse(inst, time, sym, offset, scale)`
* **Description:** Same as `MakeSmallBurnableCorpse`, but with burnable level 3 and medium propagator.

### `MakeTinyFreezableCharacter(inst, sym, offset)`
* **Description:** Adds `freezable` component for tiny characters with shatter level 1.
* **Parameters:**
  - `inst` — Entity instance.
  - `sym` — Animation symbol.
  - `offset` — Optional 3D offset (default `(0,0,0)`).
* **Returns:** `freezable` component.

### `MakeSmallFreezableCharacter(inst, sym, offset)`
* **Description:** Same as `MakeTinyFreezableCharacter`, but shatter level 2.

### `MakeMediumFreezableCharacter(inst, sym, offset)`
* **Description:** Same as `MakeTinyFreezableCharacter`, but shatter level 3 and resistance `2`.

### `MakeLargeFreezableCharacter(inst, sym, offset)`
* **Description:** Same as `MakeTinyFreezableCharacter`, but shatter level 4 and resistance `3`.

### `MakeHugeFreezableCharacter(inst, sym, offset)`
* **Description:** Same as `MakeTinyFreezableCharacter`, but shatter level 5 and resistance `4`.

### `MakeInventoryPhysics(inst, mass, rad)`
* **Description:** Adds physics with inventory item collision settings: mass, friction/damping/restitution, collision group/items-only masks, sphere shape.
* **Parameters:**
  - `inst` — Entity instance.
  - `mass` — Optional mass (default `1`).
  - `rad` — Optional radius (default `0.5`).
* **Returns:** The physics object.

### `MakeProjectilePhysics(inst, mass, rad)`
* **Description:** Same as `MakeInventoryPhysics`, but collision mask includes `GROUND` instead of obstacles.

### `MakeCharacterPhysics(inst, mass, rad)`
* **Description:** Adds physics for standard characters: mass, no friction, damping `5`, collision group `CHARACTERS`, capsule shape, masks for world/obstacles/giants.
* **Parameters:**
  - `inst` — Entity instance.
  - `mass` — Optional mass (default `1`).
  - `rad` — Optional radius (default `0.5`).
* **Returns:** The physics object.

### `MakeFlyingCharacterPhysics(inst, mass, rad)`
* **Description:** Adds physics for flyers: collision group `FLYERS`, capsule shape, masks for world/ground (conditional on `CanFlyingCrossBarriers`), flyers.

### `MakeTinyFlyingCharacterPhysics(inst, mass, rad)`
* **Description:** Same as `MakeFlyingCharacterPhysics`, but collision mask excludes flyers.

### `MakeGiantCharacterPhysics(inst, mass, rad)`
* **Description:** Adds physics for giants: collision group `GIANTS`, capsule shape, masks for world/obstacles/characters/giants.
* **Parameters:**
  - `inst` — Entity instance.
  - `mass` — Optional mass (default `1`).
  - `rad` — Optional radius (default `0.5`).
* **Returns:** The physics object.

### `MakeFlyingGiantCharacterPhysics(inst, mass, rad)`
* **Description:** Same as `MakeGiantCharacterPhysics`, but collision group `GIANTS`, masks include flying-ground-conditional and characters/giants (obstacles commented out).

### `MakeGhostPhysics(inst, mass, rad)`
* **Description:** Adds physics for ghosts: collision group `CHARACTERS`, capsule shape, masks for flying-ground-conditional, characters/giants.

### `MakeTinyGhostPhysics(inst, mass, rad)`
* **Description:** Same as `MakeGhostPhysics`, but collision mask excludes characters/giants and includes only flying-ground-conditional.

### `ChangeToGhostPhysics(inst)`
* **Description:** Modifies existing physics to ghost behavior: sets collision group `CHARACTERS`, masks for flying-ground-conditional, characters/giants.

### `ChangeToFlyingCharacterPhysics(inst, mass, rad)`
* **Description:** Modifies existing physics to flying character: sets collision group `FLYERS`, masks for flying-ground-conditional and flyers. Optionally sets mass, friction, damping, capsule.

### `ChangeToCharacterPhysics(inst, mass, rad)`
* **Description:** Modifies existing physics to standard character: sets collision group `CHARACTERS`, masks for world/obstacles/smallobstacles/characters/giants. Optionally sets mass, friction, damping, capsule.

### `ChangeToGiantCharacterPhysics(inst, mass, rad)`
* **Description:** Modifies existing physics to giant character: sets collision group `GIANTS`, masks for world/obstacles/characters/giants. Optionally sets mass, friction, damping, capsule.

### `ChangeToObstaclePhysics(inst, rad, height)`
* **Description:** Modifies existing physics to static obstacle: sets collision group `OBSTACLES`, mass `0`, capsule shape.

### `ChangeToWaterObstaclePhysics(inst)`
* **Description:** Same as `ChangeToObstaclePhysics`, but includes `OBSTACLES` in collision mask.

### `ChangeToInventoryItemPhysics(inst, mass, rad)`
* **Description:** Modifies existing physics to inventory item: sets collision group `ITEMS`, mass/friction/damping/restitution. Optionally sets sphere radius.

### `MakeCollidesWithElectricField(inst)`
* **Description:** HACK: Makes physics instance collide with `GROUND` (for shockables like imprisoned daywalker).
* **Parameters:** `inst` — Entity instance.
* **Returns:** None.

### `ClearCollidesWithElectricField(inst)`
* **Description:** Removes ground collision from physics (reverse of `MakeCollidesWithElectricField`).
* **Parameters:** `inst` — Entity instance.
* **Returns:** None.

### `ChangeToInventoryPhysics(inst)`
* **Description:** (Commented as DEPTH WORM HACK.) Changes physics to obstacle group but with obstacle collision mask including world/obstacles/smallobstacles.

### `MakeObstaclePhysics(inst, rad, height)`
* **Description:** Adds static physics for standard obstacles: tag `"blocker"`, mass `0`, group `OBSTACLES`, capsule shape, masks for items/characters/giants.
* **Parameters:**
  - `inst` — Entity instance.
  - `rad` — Radius.
  - `height` — Height (default `2`).
* **Returns:** Physics object.

### `MakeWaterObstaclePhysics(inst, rad, height, restitution)`
* **Description:** Same as `MakeObstaclePhysics`, but includes `OBSTACLES` in collision mask, and adds `waterphysics` component setting restitution.
* **Parameters:**
  - `inst` — Entity instance.
  - `rad` — Radius.
  - `height` — Height.
  - `restitution` — Bounciness for water.
* **Returns:** Physics object.

### `MakeSmallObstaclePhysics(inst, rad, height)`
* **Description:** Same as `MakeObstaclePhysics`, but uses group `SMALLOBSTACLES` and masks for items/characters.

### `MakeHeavyObstaclePhysics(inst, rad, height)`
* **Description:** Adds physics for heavy obstacles: combines inventory item physics properties (friction/damping/restitution) with obstacle collision group and masks.
* **Parameters:**
  - `inst` — Entity instance.
  - `rad` — Radius.
  - `height` — Height (default `2`).
* **Returns:** Physics object.

### `MakeSmallHeavyObstaclePhysics(inst, rad, height)`
* **Description:** Same as `MakeHeavyObstaclePhysics`, but uses `SMALLOBSTACLES` group and masks.

### `MakePondPhysics(inst, rad, height)`
* **Description:** Adds physics to an entity to act as a static pond blocker; sets collision group/mask and capsule shape.
* **Parameters:**
  - `inst`: Entity instance to attach physics to
  - `rad`: Radius of the pond
  - `height`: Optional height; defaults to `2`
* **Returns:** Physics component

### `RemovePhysicsColliders(inst)`
* **Description:** Clears or resets collision mask on an entity’s physics component based on mass.
* **Parameters:** `inst` — Entity instance.
* **Returns:** None.

### `TogglePickable(pickable, iswinter)`
* **Description:** Pauses or resumes a `pickable` component based on season.
* **Parameters:**
  - `pickable`: Pickable component instance
  - `iswinter`: Boolean season flag
* **Returns:** None.

### `MakeNoGrowInWinter(inst)`
* **Description:** Sets up `pickable` to pause in winter via world state listener.
* **Parameters:** `inst` — Entity instance.
* **Returns:** None.

### `MakeSnowCoveredPristine(inst)`
* **Description:** Initializes snow-covered visual state: overrides snow symbol, adds `"SnowCovered"` tag, hides snow.
* **Parameters:** `inst` — Entity instance.
* **Returns:** None.

### `MakeSnowCovered(inst)`
* **Description:** Applies snow coverage logic — shows/hides snow symbol, creates lunar hail buildup on master sim.
* **Parameters:** `inst` — Entity instance.
* **Returns:** None.

### `UpdateLunarHailBuildup(inst)`
* **Description:** Updates snow symbol based on snow cover and lunar hail buildup workability.
* **Parameters:** `inst` — Entity instance.
* **Returns:** None.

### `OnLunarHailBuildupWorkableStateChanged(inst, data)`
* **Description:** Event callback to trigger symbol update when lunar hail buildable state changes.
* **Parameters:**
  - `inst`: Entity instance
  - `data`: Event payload (unused)
* **Returns:** None.

### `MakeLunarHailBuildup(inst)`
* **Description:** Adds `lunarhailbuildup` component and sets up listeners and task for dynamic symbol updates.
* **Parameters:** `inst` — Entity instance.
* **Returns:** None.

### `RemoveLunarHailBuildup(inst)`
* **Description:** Removes lunar hail buildup component and cleans up associated event listeners and task.
* **Parameters:** `inst` — Entity instance.
* **Returns:** None.

### `SetLunarHailBuildupAmountSmall(inst)`
* **Description:** Configures small lunar hail buildup amount using tuning values.
* **Parameters:** `inst` — Entity instance.
* **Returns:** None.

### `SetLunarHailBuildupAmountMedium(inst)`
* **Description:** Configures medium lunar hail buildup amount using tuning values.
* **Parameters:** `inst` — Entity instance.
* **Returns:** None.

### `SetLunarHailBuildupAmountLarge(inst)`
* **Description:** Configures large lunar hail buildup amount using tuning values.
* **Parameters:** `inst` — Entity instance.
* **Returns:** None.

### `oneat(inst)`
* **Description:** Event callback to mark item as fully spoiled when eaten.
* **Parameters:** `inst` — Entity instance.
* **Returns:** None.

### `onperish(inst)`
* **Description:** Handles post-perish behavior: generates loot (if applicable), cleans up item, moves loot into owner’s container.
* **Parameters:** `inst` — Perishing item entity.
* **Returns:** None.

### `MakeSmallPerishableCreaturePristine(inst)`
* **Description:** Marks creature as eligible for spoilage warnings via `show_spoilage` tag.
* **Parameters:** `inst` — Entity instance.
* **Returns:** None.

### `MakeSmallPerishableCreature(inst, starvetime, oninventory, ondropped)`
* **Description:** Adds perishable behavior with lifecycle hooks: starts/stops perishing when in inventory or dropped.
* **Parameters:**
  - `inst` — Entity instance.
  - `starvetime` — Perish time in seconds.
  - `oninventory` — Optional callback on inventory pickup.
  - `ondropped` — Optional callback on drop.
* **Returns:** None.

### `MakeSmallPerishableCreatureAlwaysPerishing(inst, starvetime, oninventory, ondropped)`
* **Description:** Same as `MakeSmallPerishableCreature`, but starts perishing immediately.

### `MakeFeedableSmallLivestockPristine(inst)`
* **Description:** Initializes base livestock perishable state, adds `small_livestock` tag.
* **Parameters:** `inst` — Entity instance.
* **Returns:** None.

### `MakeFeedableSmallLivestock(inst, starvetime, oninventory, ondropped)`
* **Description:** Adds eater and perishable components to livestock; triggers spoilage on eat.
* **Parameters:**
  - `inst` — Entity instance.
  - `starvetime` — Perish time in seconds.
  - `oninventory` — Optional callback on inventory pickup.
  - `ondropped` — Optional callback on drop.
* **Returns:** None.

### `MakeHauntable(inst, cooldown, haunt_value)`
* **Description:** Makes an entity hauntable with default haunt behavior.
* **Parameters:**
  - `inst` — Entity instance.
  - `cooldown` — Optional cooldown override.
  - `haunt_value` — Optional haunt value override.
* **Returns:** None.

### `MakeHauntableLaunch(inst, chance, speed, cooldown, haunt_value)`
* **Description:** Sets haunt function to launch entity with configurable chance/speed; sets landed state `false` on launch.
* **Parameters:**
  - `inst` — Entity instance.
  - `chance` — Haunt success chance.
  - `speed` — Launch speed.
  - `cooldown` — Cooldown override.
  - `haunt_value` — Haunt value on success.
* **Returns:** None.

### `MakeHauntableLaunchAndSmash(inst, launch_chance, smash_chance, speed, cooldown, launch_haunt_value, smash_haunt_value)`
* **Description:** Sets haunt function to launch entity; smash logic commented out (disabled).
* **Parameters:**
  - `inst` — Entity instance.
  - `launch_chance` — Launch chance.
  - `smash_chance` — Unused (commented out).
  - `speed` — Launch speed.
  - `cooldown` — Cooldown override.
  - `launch_haunt_value` — Haunt value on launch.
  - `smash_haunt_value` — Unused.
* **Returns:** None.

### `MakeHauntableWork(inst, chance, cooldown, haunt_value)`
* **Description:** Sets haunt function to attempt work on entity; logic commented out (disabled).
* **Parameters:**
  - `inst` — Entity instance.
  - `chance` — Work chance (unused).
  - `cooldown` — Cooldown override.
  - `haunt_value` — Haunt value (unused).
* **Returns:** None.

### `MakeHauntableWorkAndIgnite(inst, work_chance, ignite_chance, cooldown, work_haunt_value, ignite_haunt_value)`
* **Description:** Sets haunt function to attempt work or ignite; logic commented out (disabled).
* **Parameters:**
  - `inst` — Entity instance.
  - `work_chance` — Work chance (unused).
  - `ignite_chance` — Ignite chance (unused).
  - `cooldown` — Cooldown override.
  - `work_haunt_value` — Work haunt value (unused).
  - `ignite_haunt_value` — Ignite haunt value (unused).
* **Returns:** None.

### `MakeHauntableFreeze(inst, chance, cooldown, haunt_value)`
* **Description:** Sets haunt function to freeze entity if not already frozen.
* **Parameters:**
  - `inst` — Entity instance.
  - `chance` — Freeze chance.
  - `cooldown` — Cooldown override.
  - `haunt_value` — Haunt value on success.
* **Returns:** None.

### `MakeHauntableIgnite(inst, chance, cooldown, haunt_value)`
* **Description:** Sets haunt function to ignite entity; logic commented out (disabled).
* **Parameters:**
  - `inst` — Entity instance.
  - `chance` — Ignite chance (unused).
  - `cooldown` — Cooldown override.
  - `haunt_value` — Haunt value (unused).
* **Returns:** None.

### `MakeHauntableLaunchAndIgnite(inst, launchchance, ignitechance, speed, cooldown, launch_haunt_value, ignite_haunt_value)`
* **Description:** Sets haunt function to launch and optionally ignite; ignite logic commented out (disabled).
* **Parameters:**
  - `inst` — Entity instance.
  - `launchchance` — Launch chance.
  - `ignitechance` — Ignite chance (unused).
  - `speed` — Launch speed.
  - `cooldown` — Cooldown override.
  - `launch_haunt_value` — Haunt value on launch.
  - `ignite_haunt_value` — Haunt value on ignite (unused).
* **Returns:** None.

### `DoChangePrefab(inst, newprefab, haunter, nofx)`
* **Description:** Replaces entity with new prefab, transferring properties and triggering spawn events.
* **Parameters:**
  - `inst` — Old entity instance.
  - `newprefab` — Prefab name or list of names.
  - `haunter` — Haunting entity.
  - `nofx` — Boolean to skip visual effect.
* **Returns:** None.

### `MakeHauntableChangePrefab(inst, newprefab, chance, haunt_value, nofx)`
* **Description:** Sets haunt function to replace entity with new prefab on success.
* **Parameters:**
  - `inst` — Entity instance.
  - `newprefab` — Prefab name or list of names.
  - `chance` — Haunt chance.
  - `haunt_value` — Haunt value.
  - `nofx` — Skip FX.
* **Returns:** None.

### `MakeHauntableLaunchOrChangePrefab(inst, launchchance, prefabchance, speed, cooldown, newprefab, prefab_haunt_value, launch_haunt_value, nofx)`
* **Description:** Sets haunt function to either launch or change prefab, randomly.
* **Parameters:**
  - `inst` — Entity instance.
  - `launchchance` — Launch chance.
  - `prefabchance` — Prefab change chance.
  - `speed` — Launch speed.
  - `cooldown` — Cooldown.
  - `newprefab` — New prefab name.
  - `prefab_haunt_value` — Haunt value on prefab change.
  - `launch_haunt_value` — Haunt value on launch.
  - `nofx` — Skip FX.
* **Returns:** None.

### `MakeHauntablePerish(inst, perishpct, chance, cooldown, haunt_value)`
* **Description:** Sets haunt function to reduce perish %; logic commented out (disabled).
* **Parameters:**
  - `inst` — Entity instance.
  - `perishpct` — Perish % reduction.
  - `chance` — Haunt chance (unused).
  - `cooldown` — Cooldown.
  - `haunt_value` — Haunt value (unused).
* **Returns:** None.

### `MakeHauntableLaunchAndPerish(inst, launchchance, perishchance, speed, perishpct, cooldown, launch_haunt_value, perish_haunt_value)`
* **Description:** Sets haunt function to launch and optionally reduce perish %; perish logic commented out (disabled).
* **Parameters:**
  - `inst` — Entity instance.
  - `launchchance` — Launch chance.
  - `perishchance` — Perish chance (unused).
  - `speed` — Launch speed.
  - `perishpct` — Perish % reduction.
  - `cooldown` — Cooldown.
  - `launch_haunt_value` — Haunt value on launch.
  - `perish_haunt_value` — Haunt value on perish (unused).
* **Returns:** None.

### `MakeHauntablePanic(inst, panictime, chance, cooldown, haunt_value)`
* **Description:** Sets haunt function to wake sleeper and trigger panic state.
* **Parameters:**
  - `inst` — Entity instance.
  - `panictime` — Duration of panic.
  - `chance` — Haunt chance.
  - `cooldown` — Cooldown.
  - `haunt_value` — Haunt value.
* **Returns:** None.

### `MakeHauntablePanicAndIgnite(inst, panictime, panicchance, ignitechance, cooldown, panic_haunt_value, ignite_haunt_value)`
* **Description:** Attaches/ensures `hauntable` component and configures it to trigger panic state on haunt, optionally (commented-out) ignite fire if conditions met. Sets haunt value and cooldown.
* **Parameters:**
  - `inst` — Entity instance to attach to.
  - `panictime` — Duration of panic state (default: `TUNING.HAUNT_PANIC_TIME_SMALL`).
  - `panicchance` — Chance to trigger panic (default: `TUNING.HAUNT_CHANCE_ALWAYS`).
  - `ignitechance` — (commented) chance to ignite (default: `TUNING.HAUNT_CHANCE_RARE`).
  - `cooldown` — Haunt cooldown (default: `TUNING.HAUNT_COOLDOWN_MEDIUM`).
  - `panic_haunt_value` — Haunt value for panic effect (default: `TUNING.HAUNT_SMALL`).
  - `ignite_haunt_value` — (commented) haunt value if ignited (default: `TUNING.HAUNT_MEDIUM`).
* **Returns:** None.

### `MakeHauntablePlayAnim(inst, anim, animloop, pushanim, animduration, endanim, endanimloop, soundevent, soundname, soundduration, chance, cooldown, haunt_value)`
* **Description:** Attaches/ensures `hauntable` component and configures haunt to play an animation (pushed or immediate), optionally transition to another animation and play sound.
* **Parameters:**
  - `inst` — Entity instance.
  - `anim` — Animation name to play.
  - `animloop` — Boolean whether to loop animation (default: `false`).
  - `pushanim` — Boolean whether to push (`true`) or play immediately (`false`) animation.
  - `animduration` — Seconds before transitioning to end animation (optional).
  - `endanim` — Name of end animation (optional).
  - `endanimloop` — Loop flag for end animation (optional).
  - `soundevent` — Sound event (e.g., `"dontstarve/common"`).
  - `soundname` — Sound name to play/killed later (optional).
  - `soundduration` — Seconds before killing sound (optional).
  - `chance` — Trigger chance (default: `TUNING.HAUNT_CHANCE_ALWAYS`).
  - `cooldown` — Haunt cooldown (default: `TUNING.HAUNT_COOLDOWN_SMALL`).
  - `haunt_value` — Haunt value (default: `TUNING.HAUNT_TINY`).
* **Returns:** None.

### `MakeHauntableGoToState(inst, state, chance, cooldown, haunt_value)`
* **Description:** Attaches/ensures `hauntable` and configures haunt to transition entity’s stategraph to specified `state`.
* **Parameters:**
  - `inst` — Entity instance (must have valid `sg`).
  - `state` — StateGraph state name to switch to.
  - `chance` — Trigger chance (default: `TUNING.HAUNT_CHANCE_ALWAYS`).
  - `cooldown` — Haunt cooldown (default: `TUNING.HAUNT_COOLDOWN_SMALL`).
  - `haunt_value` — Haunt value (default: `TUNING.HAUNT_TINY`).
* **Returns:** None.

### `MakeHauntableGoToStateWithChanceFunction(inst, state, chancefn, cooldown, haunt_value)`
* **Description:** Same as above but accepts a function `chancefn(inst)` to dynamically compute haunt chance.
* **Parameters:**
  - `inst` — Entity instance.
  - `state` — StateGraph state name.
  - `chancefn` — Function returning a chance value (default: `TUNING.HAUNT_CHANCE_ALWAYS`).
  - `cooldown` — Haunt cooldown (default: `TUNING.HAUNT_COOLDOWN_SMALL`).
  - `haunt_value` — Haunt value (default: `TUNING.HAUNT_TINY`).
* **Returns:** None.

### `MakeHauntableDropFirstItem(inst, chance, cooldown, haunt_value)`
* **Description:** Attaches/ensures `hauntable` and configures haunt to drop first non-`nosteal` item from inventory or container (commented-out logic). Currently always returns `false`.
* **Parameters:**
  - `inst` — Entity instance.
  - `chance` — (commented) trigger chance (default: `TUNING.HAUNT_CHANCE_OCCASIONAL`).
  - `cooldown` — Haunt cooldown (default: `TUNING.HAUNT_COOLDOWN_SMALL`).
  - `haunt_value` — Haunt value (default: `TUNING.HAUNT_MEDIUM`).
* **Returns:** None.

### `MakeHauntableLaunchAndDropFirstItem(inst, launchchance, dropchance, speed, cooldown, launch_haunt_value, drop_haunt_value)`
* **Description:** Launches entity on haunt, optionally drops first non-`nosteal` item (commented). Sets inventoryitem landed state to `false` if floating.
* **Parameters:**
  - `inst` — Entity instance.
  - `launchchance` — Chance to launch (default: `TUNING.HAUNT_CHANCE_ALWAYS`).
  - `dropchance` — (commented) chance to drop item.
  - `speed` — Launch speed (default: `TUNING.LAUNCH_SPEED_SMALL`).
  - `cooldown` — Haunt cooldown (default: `TUNING.HAUNT_COOLDOWN_SMALL`).
  - `launch_haunt_value` — Haunt value for launch (default: `TUNING.HAUNT_TINY`).
  - `drop_haunt_value` — (commented) haunt value for drop.
* **Returns:** None.

### `AddHauntableCustomReaction(inst, fn, secondrxn, ignoreinitialresult, ignoresecondaryresult)`
* **Description:** Wraps existing/assigns new `onhaunt` function to chain custom reaction(s) before or after original.
* **Parameters:**
  - `inst` — Entity instance.
  - `fn` — Custom function `(inst, haunter) → boolean`.
  - `secondrxn` — If true, `fn` runs after original; if false, runs before.
  - `ignoreinitialresult` — If true, ignore original return value for logic.
  - `ignoresecondaryresult` — If true, return value of `fn` ignored.
* **Returns:** None.

### `AddHauntableDropItemOrWork(inst)`
* **Description:** Attaches/ensures `hauntable` and configures haunt to drop item (if container) or trigger work (if workable) (commented). Currently returns `false`.
* **Parameters:** `inst` — Entity instance.
* **Returns:** None.

### `OnUpdatePhysicsRadius(inst)`
* **Description:** (Internal helper) Updates entity’s physics radius based on proximity to nearby characters/locomotors, using `physicsradiusoverride`. Used by dynamic passthrough toggles.
* **Parameters:** `inst` — Entity instance.
* **Returns:** None.

### `ToggleOffCharacterCollisions(inst)`
* **Description:** Disables collision with characters, cancels periodic radius update task.
* **Parameters:** `inst` — Entity instance (must have `sg.mem` and `Physics`).
* **Returns:** None.

### `ToggleOnCharacterCollisions(inst)`
* **Description:** Enables periodic physics radius update and re-enables character collisions.
* **Parameters:** `inst` — Entity instance.
* **Returns:** None.

### `ToggleOffAllObjectCollisions(inst)`
* **Description:** Disables collisions with characters, obstacles, small obstacles, and giants. Cancels periodic radius task.
* **Parameters:** `inst` — Entity instance.
* **Returns:** None.

### `ToggleOnAllObjectCollisionsAt(inst, x, z)`
* **Description:** Re-enables obstacle/ground collisions (not characters), teleports to position, and re-enables character collision monitoring.
* **Parameters:**
  - `inst` — Entity instance.
  - `x` — X coordinate.
  - `z` — Z coordinate.
* **Returns:** None.

### `PreventCharacterCollisionsWithPlacedObjects(inst)`
* **Description:** Sets up periodic radius update for placed objects to dynamically shrink radius and avoid collisions with characters while preserving obstacle collisions.
* **Parameters:** `inst` — Entity instance.
* **Returns:** None.

### `StopTargetingAttacker(inst, attacker)`
* **Description:** If entity’s `combat` target is `attacker`, drops the target.
* **Parameters:**
  - `inst` — Entity instance.
  - `attacker` — Potential current target.
* **Returns:** None.

### `PreventTargetingOnAttacked(inst, attacker, tag)`
* **Description:** If `attacker` has specified `tag`, prevents `inst` from targeting them (e.g., after being attacked). Handles windstaff sub-casters.
* **Parameters:**
  - `inst` — Entity instance.
  - `attacker` — Attacker entity.
  - `tag` — Tag to check (e.g., `"player"` or custom).
* **Returns:** `true` if targeting prevented; `false` otherwise.

### `AddDefaultRippleSymbols(inst, ripple, shadow)`
* **Description:** Overrides water ripple/shadow symbols for inventory items (e.g., worn items).
* **Parameters:**
  - `inst` — Entity instance.
  - `ripple` — If true, override `water_ripple` symbol.
  - `shadow` — If true, override `water_shadow` symbol.
* **Returns:** None.

### `MakeInventoryFloatable(inst, size, offset, scale, swap_bank, float_index, swap_data)`
* **Description:** Adds `floater` component and configures float behavior (size, offset, scale, bank swap).
* **Parameters:**
  - `inst` — Entity instance.
  - `size` — Floater size (default: `"small"`).
  - `offset` — Vertical offset (optional).
  - `scale` — Float scale (optional).
  - `swap_bank` — Bank swap anim bank (optional).
  - `float_index` — Anim index (optional).
  - `swap_data` — Additional swap data (optional).
* **Returns:** `floater` component instance.

### `fertilizer_ondeploy(inst, pt, deployer)`
* **Description:** (Internal) Handles fertilizer deployment: applies nutrients to farm soil, triggers `fertilizer:OnApplied`, plays sound, and optional extra callback.
* **Parameters:**
  - `inst` — Fertilizer item instance.
  - `pt` — World point (Vector3).
  - `deployer` — Deploying entity (optional).
* **Returns:** None.

### `fertilizer_candeploy(inst, pt, mouseover, deployer)`
* **Description:** (Internal) Deployment validation: returns true if tile is farmable soil.
* **Parameters:**
  - `inst` — Item instance.
  - `pt` — World point.
  - `mouseover` — Mouse-over entity (unused).
  - `deployer` — Deployer entity (unused).
* **Returns:** Boolean.

### `MakeDeployableFertilizerPristine(inst)`
* **Description:** Adds `deployable`, `tile_deploy` tags and custom deploy logic via `gridplacer_farmablesoil`.
* **Parameters:** `inst` — Entity instance.
* **Returns:** None.

### `MakeDeployableFertilizer(inst)`
* **Description:** Adds `deployable` component with custom mode and `fertilizer_ondeploy` callback, keeps item in inventory after deploy.
* **Parameters:** `inst` — Entity instance.
* **Returns:** `deployable` component instance.

### `RemoveFromRegrowthManager(inst)`
* **Description:** Removes `inst` from regrowth callbacks. Clears `OnStartRegrowth` reference.
* **Parameters:** `inst` — Entity instance.
* **Returns:** None.

### `AddToRegrowthManager(inst)`
* **Description:** Registers callbacks for `onremove` and `despawnedfromhaunt` events and assigns `inst.OnStartRegrowth`.
* **Parameters:** `inst` — Entity instance.
* **Returns:** None.

### `MakeForgeRepairable(inst, material, onbroken, onrepaired)`
* **Description:** Adds `forgerepairable` component and configures `onbroken` callbacks for armor/finiteuses/fueled. On-break, unequips item if needed.
* **Parameters:**
  - `inst` — Entity instance.
  - `material` — Repair material prefab name.
  - `onbroken` — Callback when broken/depleted.
  - `onrepaired` — Callback when repaired.
* **Returns:** None.

### `MakeWaxablePlant(inst)`
* **Description:** Adds `waxable` component and configures wax plant callback and spray requirement.
* **Parameters:** `inst` — Entity instance.
* **Returns:** None.

### `GiveOrDropItem(item, inventory, pos)`
* **Description:** (Internal helper) Gives item to inventory or drops at position.
* **Parameters:**
  - `item` — Item instance.
  - `inventory` — Inventory component (optional).
  - `pos` — Drop position (Vector3).
* **Returns:** None.

### `MaterialRecycler_OnBuilt(inst, builder)`
* **Description:** (Internal) Called on construction complete: spawns reward items from `_recycle_materials_data`.
* **Parameters:**
  - `inst` — Built structure instance.
  - `builder` — Builder entity.
* **Returns:** None.

### `MakeCraftingMaterialRecycler(inst, data)`
* **Description:** Configures a crafting structure to recycle consumed materials into rewards on build completion.
* **Parameters:**
  - `inst` — Entity instance.
  - `data` — Map of `{material = reward}`.
* **Returns:** None.

### `IsWithinHermitCrabArea(inst)`
* **Description:** Checks if `inst` is within pearls house’s `pearldecorationscore` area.
* **Parameters:** `inst` — Entity instance.
* **Returns:** Boolean.

### `MakeHermitCrabAreaListener(inst, callbackfn)`
* **Description:** Registers event listeners to notify `callbackfn(inst, is_within)` when pearl decoration tile status changes.
* **Parameters:**
  - `inst` — Entity instance.
  - `callbackfn` — Function `(inst, is_within) → nil`.
* **Returns:** None.

## Events & listeners
- **Listens to:**
  - `lunarhailbuildupworkablestatechanged` — triggers `UpdateLunarHailBuildup` to update snow symbols
  - `onremove` — Cleans up regrowth manager tracking in `AddToRegrowthManager`/`RemoveFromRegrowthManager`
  - `despawnedfromhaunt` — Removes from regrowth manager
  - `entitywake` / `entitysleep` — Track entity’s visibility changes for hermit crab area
  - `ms_updatepearldecorationscore_tiles` — Update hermit crab area status
  - `pearldecorationscore_updatestatus` — Update hermit crab area status
  - `onbuilt` — Update hermit crab area status
- **Pushes:**
  - `spawnedfromhaunt` — emitted by new entity after hauntable prefab change
  - `despawnedfromhaunt` — emitted by old entity before hauntable removal
  - `detachchild` — emitted by old entity before hauntable replacement
  - `beginregrowth` — Pushed when `OnStartRegrowth` fires (from `onremove`)
  - `perishchange` — emitted by `perishable` on percent change
  - `stacksizechange` — emitted by `stackable` on stack size change
  - `ondropped` — emitted by `inventoryitem` on drop
  - `onignite` — emitted by `burnable` on ignition
  - `onclose` — emitted by `container` on close
  - `stacksizechange` — emitted by `stackable` on stack size change
  - `setoverflow` — emitted by `inventory` when setting overflow
  - `unequip` — emitted by `inventory` on unequip
  - `dropitem` — emitted by `inventory` on drop
  - `perishchange` — emitted by `perishable` on percent change
  - `perishchange` — emitted by `perishable` on percent change