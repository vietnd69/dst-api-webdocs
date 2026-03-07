---
id: winona_battery_high
title: Winona Battery High
description: Manages high-capacity magical power storage, gem-based upgrades, circuit power distribution, and elemental state transitions for the Winona battery structure.
tags: [power, crafting, ui, inventory, network]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d1f18125
system_scope: world
---

# Winona Battery High

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `winona_battery_high` prefab implements a high-capacity engineering battery with dynamic fuel storage, gem-based power upgrades (Pure Brilliance and Alter Guardian Shard), overloaded states, and circuit-based power delivery. It integrates with the `fueled`, `battery`, `circuitnode`, `deployable`, `portablestructure`, `workable`, `hauntable`, `burnable`, `lootdropper`, `trader`, `timer`, `updatelooper`, `inspectable`, `inventoryitem`, `powerload`, `placer`, and `deployhelper` components. The battery supports skill-based efficiency modifiers, shard regeneration logic, and networked synchronization for multiplayer environments.

## Usage example
```lua
-- Typical usage in a prefab constructor
local inst = CreateEntity()
inst:AddComponent("fueled")
inst.components.fueled.maxfuel = TUNING.WINONA_BATTERY_HIGH_MAX_FUEL_TIME
inst.components.fueled.fueltype = FUELTYPE.MAGIC

inst:AddComponent("circuitnode")
inst.components.circuitnode:SetRange(TUNING.WINONA_BATTERY_RANGE)
inst.components.circuitnode.connectsacrossplatforms = false

inst:AddComponent("battery")
inst.components.battery.canbeused = CanBeUsedAsBattery
inst.components.battery.onused = UseAsBattery

-- Manually trigger battery usage
local can_use, reason = inst.components.battery:canbeused(user)
if can_use then
    inst.components.battery:onused(user)
end
```

## Dependencies & tags
**Components used:** `battery`, `burnable`, `circuitnode`, `deployable`, `deployhelper`, `fueled`, `hauntable`, `inspectable`, `inventoryitem`, `lootdropper`, `placer`, `portablestructure`, `powerload`, `skilltreeupdater`, `timer`, `trader`, `updatelooper`, `workable`.

**Tags added:** `structure`, `engineering`, `engineeringbattery`, `gemsocket`, `trader` (only on non-dedicated servers). Items carry `portableitem`; FX entities carry `FX`, `NOCLICK`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_gems` | table | `{}` | Array of gem prefabs (or save records) in socket slots. |
| `_gemsymfollowers` | table | `{}` | Array of symbol followers for gem FX entities. |
| `_shard_level` | number | `0` | Count of `alterguardianhatshard` gems inserted (affects drain logic). |
| `_brilliance_level` | number | `0` | Count of `purebrilliance` gems inserted (enables brilliance energy state). |
| `_noidledrain` | boolean | `false` | True if "winona_battery_idledrain" skill is activated (prevents idle power drain). |
| `_efficiency` | number | `0` | Efficiency tier (1–3) from skilltree; affects fuel consumption rate. |
| `_engineerid` | string or nil | `nil` | User ID of the engineer who built the battery; used for skill compatibility checks. |
| `_batterytask` | task or nil | `nil` | Periodic task sending power to connected circuits. |
| `_circuittask` | task or nil | `nil` | Delayed task to update power draw after circuit changes. |
| `_hitanim` | string or nil | `nil` | Temporary state tracking the currently playing hit animation. |
| `_lastchargeframe` | number or nil | `-1` | Last frame index checked for idle charge sound triggers. |
| `_updatingshardload` | boolean | `false` | Flag for shard overload timer updates via UpdateLooper. |
| `_inittask` | task or nil | `nil` | Initialization task run after load to connect to circuits. |

## Main functions
### `CalcEfficiencyMult(inst, override)`
*   **Description:** Calculates the current fuel consumption efficiency multiplier based on skill upgrades or a provided override level.
*   **Parameters:** `override` (number or nil) - If provided, use this level (1–3) instead of `inst._efficiency`.
*   **Returns:** `number` - Efficiency multiplier (`1`, or `TUNING.SKILLS.WINONA.BATTERY_EFFICIENCY_RATE_MULT[level]`).

### `ApplyEfficiencyBonus(inst)`
*   **Description:** Applies or removes the efficiency modifier on `fueled.rate_modifiers` based on current efficiency level.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `IsEngineerOnline(inst)`
*   **Description:** Checks whether the original builder (engineer) is currently connected to the server and playing as Winona.
*   **Parameters:** None.
*   **Returns:** `boolean` - True if builder is online and active.

### `ConfigureSkillTreeUpgrades(inst, builder)`
*   **Description:** Updates skill-based state (`_noidledrain`, `_efficiency`, `_engineerid`) based on the builder's skill tree. Returns whether any change occurred.
*   **Parameters:** `builder` (entity or nil) - Entity doing the build/deploy; used to read skills.
*   **Returns:** `boolean` - True if `noidledrain` or `efficiency` changed.

### `CalcShardRegenSpeedMult(inst)`
*   **Description:** Computes the combined shard regen speed multiplier from shard level and efficiency.
*   **Parameters:** None.
*   **Returns:** `number` - Product of shard regen base mult and efficiency mult.

### `CalcShardRegenDelay(inst)`
*   **Description:** Calculates the shard regeneration delay after overload.
*   **Parameters:** None.
*   **Returns:** `number` - Delay in seconds.

### `CalcOverloadThreshold(inst)`
*   **Description:** Calculates the shard threshold (in time units) that triggers overload based on gems inserted and shard/regen multipliers.
*   **Parameters:** None.
*   **Returns:** `number` - Threshold time in seconds.

### `DoIdleChargeSound(inst)`
*   **Description:** Plays a periodic electricity sound at specific animation frames during idle charge.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StartIdleChargeSounds(inst)`
*   **Description:** Begins idle charge sound monitoring via `updatelooper`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StopIdleChargeSounds(inst)`
*   **Description:** Stops idle charge sound monitoring.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetBrillianceEnergyEnabled(inst, enable)`
*   **Description:** Toggles the visual energy glow symbols (`PB_ENERGY` and related wire/plug symbols) and ambient sound for brilliance state.
*   **Parameters:** `enable` (boolean) - Turn energy glow on/off.
*   **Returns:** Nothing.

### `RefreshEnergyFX(inst)`
*   **Description:** Updates the hue/saturation and visibility of the `m2` (energy) symbol based on brilliance or shard state.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnUpdateShardLoad(inst)`
*   **Description:** Updates the overload visual indicator (`m2` override symbol) based on shard load timer and threshold.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StartUpdatingShardLoad(inst)`
*   **Description:** Begins shard load visual updates via `updatelooper`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StopUpdatingShardLoad(inst)`
*   **Description:** Ends shard load visual updates.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetGem(inst, slot, gemname, item)`
*   **Description:** Inserts a gem into a specific socket (`slot`), spawning visual FX or overriding symbols. Updates `_brilliance_level` or `_shard_level` as needed.
*   **Parameters:** `slot` (number) - 1-indexed socket index. `gemname` (string) - Prefab name of the gem. `item` (entity or nil) - Source item for shard FX setup.
*   **Returns:** Nothing.

### `UnsetGem(inst, slot, gemdata)`
*   **Description:** Removes a gem from a socket, spawns shatter FX, and updates internal counts. Does not drop item if shard (fueled separately).
*   **Parameters:** `slot` (number) - 1-indexed socket index. `gemdata` (string or table) - Gem prefab or save record.
*   **Returns:** Nothing.

### `CheckElementalBattery(inst)`
*   **Description:** Returns the current elemental battery type: `"brilliance"`, `"shard"`, or `nil`.
*   **Parameters:** None.
*   **Returns:** `string` or `nil`.

### `StartBattery(inst)`
*   **Description:** Starts the periodic battery power-delivery task (`_batterytask`).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StopBattery(inst)`
*   **Description:** Stops the battery power-delivery task.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UpdateCircuitPower(inst)`
*   **Description:** Recalculates the `fueled.rate` based on connected loads and battery count per node.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `BroadcastCircuitChanged(inst)`
*   **Description:** Triggers update for all connected nodes via `engineeringcircuitchanged` event.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnConnectCircuit(inst)`
*   **Description:** Callback when the battery connects to a circuit node. Starts battery task if fuel is consuming.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnDisconnectCircuit(inst)`
*   **Description:** Callback when the battery disconnects. Stops battery task if disconnected entirely.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `CanBeUsedAsBattery(inst, user)`
*   **Description:** Checks whether the battery can be used as a power source by a user (either for fuel or shard overload). Returns success flag and optional reason string.
*   **Parameters:** `user` (entity or nil) - Entity trying to use the battery.
*   **Returns:** `boolean, string?` - true and `nil` if allowed; false and a reason string (`"NOT_ENOUGH_CHARGE"`) otherwise.

### `UseAsBattery(inst, user)`
*   **Description:** Deducts fuel or shard charge based on usage, updates skill-based state.
*   **Parameters:** `user` (entity or nil) - Entity using the battery.
*   **Returns:** Nothing.

### `StartSoundLoop(inst)`
*   **Description:** Starts battery power loop sound and brilliance power loop (if active).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StopSoundLoop(inst)`
*   **Description:** Stops battery power loop and brilliance loop.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StartOverloadedSoundLoop(inst)`
*   **Description:** Starts the overloaded state sound.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StopOverloadedSoundLoop(inst)`
*   **Description:** Stops the overloaded state sound.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetStatus(inst)`
*   **Description:** Returns status string for `inspectable` component (`"OFF"`, `"LOWPOWER"`, `"BURNING"`, `"BURNT"`, `"OVERLOADED"`).
*   **Parameters:** None.
*   **Returns:** `string?` - Status label or `nil`.

### `SetOverloaded(inst, overloaded)`
*   **Description:** Enters or exits the overloaded state, controlling timers, animations, sounds, and fuel consumption.
*   **Parameters:** `overloaded` (boolean) - Enter overload if true; exit if false.
*   **Returns:** Nothing.

### `IsOverloaded(inst)`
*   **Description:** Checks if the overload timer exists.
*   **Parameters:** None.
*   **Returns:** `boolean`.

### `OnTimerDone(inst, data)`
*   **Description:** Event handler for timer completion (`"shardloaddelay"`, `"shardload"`, `"overloaded"`).
*   **Parameters:** `data` (table) - `{ name = "timername" }`.
*   **Returns:** Nothing.

### `OnFuelEmpty(inst)`
*   **Description:** Called when fuel depletes: stops consumption, updates visuals, shatters gems, and broadcasts circuit change.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnFuelSectionChange(new, old, inst)`
*   **Description:** Callback when fuel section changes (number of visible gem levels). Handles gem shattering and FX updates.
*   **Parameters:** `new` (number), `old` (number) - New and old section numbers (1–6).
*   **Returns:** Nothing.

### `ConsumeBatteryAmount(inst, cost, share, doer)`
*   **Description:** Deducts charge for battery usage, handling shard overload logic (increasing `shardload` timer) or fuel deduction.
*   **Parameters:** `cost` (table) - `{ fuel = number, shard = number }`. `share` (number) - Number of batteries sharing load. `doer` (entity or nil).
*   **Returns:** Nothing.

### `DropGems(inst)`
*   **Description:** Spawns all gems as loot, preserving shards (to avoid loss), and resets `_shard_level` and `_brilliance_level`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnBurnt(inst)`
*   **Description:** Called on burnout: extinguishes fire, drops gems, removes components, disconnects circuits, and resets timers.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnDismantle(inst)`
*   **Description:** Called when dismantled: converts to `winona_battery_high_item` with current fuel and gems.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ChangeToItem(inst)`
*   **Description:** Spawns a `winona_battery_high_item` copy, preserving fuel percentage and gem state.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `PlayHitAnim(inst, customanim)`
*   **Description:** Plays hit animation with logic for overloaded state and idle sound management.
*   **Parameters:** `customanim` (string or nil) - Optional animation override.
*   **Returns:** Nothing.

### `OnWorked(inst)`
*   **Description:** Callback on work (hammering) starts; plays hit sound and animation.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnWorkFinished(inst)`
*   **Description:** Called when hammering completes; drops loot, shatters gems, and removes entity.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnWorkedBurnt(inst)`
*   **Description:** Callback for burnt structure hammer finish; drops loot and removes entity.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnEntitySleep(inst)`
*   **Description:** Called when entity goes to sleep (night); stops all looping sounds.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnEntityWake(inst)`
*   **Description:** Called when entity wakes (day); resumes appropriate sounds and idle sounds if needed.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ItemTradeTest(inst, item, doer)`
*   **Description:** Validates whether a gem item can be added by the trader. Enforces skill requirements for rare gems.
*   **Parameters:** `item` (entity), `doer` (entity or nil).
*   **Returns:** `boolean, string?` - Acceptance status and optional reason string.

### `OnGemGiven(inst, doer, item)`
*   **Description:** Handles insertion of a gem during trade; updates gem count, visuals, fuel capacity, and triggers circuit broadcast if needed.
*   **Parameters:** `doer` (entity or nil), `item` (entity).
*   **Returns:** Nothing.

### `OnUsedIndirectly(inst, doer)`
*   **Description:** Updates skill-based state when used by a different user (non-builder).
*   **Parameters:** `doer` (entity).
*   **Returns:** Nothing.

### `OnDeployed(inst, deployer)`
*   **Description:** Called on deployment: configures initial state, sets energy FX, and starts build sequence.
*   **Parameters:** `deployer` (entity).
*   **Returns:** Nothing.

### `OnBuilt(inst, data)`
*   **Description:** Called on building: configures initial state and starts build sequence.
*   **Parameters:** `data` (table) - Contains `builder` entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` - Initialize state after construction.  
- **Listens to:** `ondeconstructstructure` - Drop gems on structure deconstruction.  
- **Listens to:** `engineeringcircuitchanged` - Recalculate power draw from connected loads.  
- **Listens to:** `timerdone` - Handle shard load delay and overload timer completions.  
- **Listens to:** `winona_batteryskillchanged` (world event) - Update skill-based state when builder's skills change.  
- **Pushes:** `engineeringcircuitchanged` - Notifies connected nodes of circuit changes.  
- **Pushes:** `percentusedchange` - Emitted by `fueled` component when fuel percentage changes.  
- **Pushes:** `onfueldsectionchanged` - Emitted by `fueled` component when fuel section changes.