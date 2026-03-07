---
id: dumbbells
title: Dumbbells
description: Implements a set of multipurpose workout equipment prefabs with weighted, elemental, and temperature-based variants, enabling melee combat, AOE attacks, and environmental thermoregulation.
tags: [inventory, combat, equipment, environment, temperature]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2bf84834
system_scope: entity
---

# Dumbbells

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `dumbbells.lua` file defines seven distinct dumbbell prefabs (`dumbbell`, `dumbbell_golden`, `dumbbell_marble`, `dumbbell_gem`, `dumbbell_heat`, `dumbbell_redgem`, `dumbbell_bluegem`). These prefabs integrate with multiple systems:
- As **equippable weapons** (via `equippable` and `weapon` components), usable for melee attacks that increase the owner’s `mightiness`.
- As **throwable projectiles** (via `complexprojectile`), enabling AOE attacks that trigger elemental effects (fire or ice) or heating/cooling based on variant.
- As **thermoregulatory tools** (only `dumbbell_heat`), functioning as heat rocks with dynamic temperature-based emissions and lighting.

Most functionality is centralized in a factory function `MakeDumbbell`, which configures components conditionally based on variant name. Key interactions include dynamic weapon state switching (`wimpy`/`mighty` via `mightiness` component), dynamic projectile behavior, and temperature tracking with visual and functional state updates.

## Usage example
```lua
-- Example: Spawn and configure a heat dumbbell
local inst = SpawnPrefab("dumbbell_heat")
-- Access equipped behavior
if inst.components.equippable then
    inst.components.equippable:SetOnEquip(function() print("Equipped heat dumbbell") end)
end
-- Access temperature-based heating properties
if inst.components.temperature and inst.components.heater then
    local ambient = GetLocalTemperature(inst)
    local temp = inst.components.temperature:GetCurrent()
    -- The heat emission is determined dynamically by HeatFn
end
```

## Dependencies & tags
**Components used:** `combat`, `complexprojectile`, `domesticatable`, `equippable`, `finiteuses`, `follower`, `freezable`, `heater`, `inventory`, `inventoryitem`, `lootdropper`, `mightiness`, `mightydumbbell`, `reticule`, `saltlicker`, `temperature`, `tradable`, `weapon`

**Tags added/checked:** `dumbbell`, `keep_equip_toss`, `NOCLICK`, `projectile`, `lifting`, `hasheater`, `icebox_valid`, `heatrock`, `punch`

## Properties
No direct public properties are exposed on the component itself, as this file defines prefabs rather than a reusable component class. However, individual prefabs set the following instance-level properties on their main `inst`:
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `isfireattack` | boolean | `false` | Set to `true` for `dumbbell_redgem`; triggers spawning of three `houndfire` entities on AOE hit. |
| `isiceattack` | boolean | `false` | Set to `true` for `dumbbell_bluegem`; applies `AddColdness(2)` to affected entities. |
| `thrown_consumption` | number | `consumption * TUNING.DUMBBELL_THROWN_CONSUMPTION_MULT` | Number of uses deducted when the dumbbell is thrown. |
| `impact_sound` | string | `"wolfgang1/dumbbell/stone_impact"` | Sound effect played on impact. |
| `currentTempRange` | number | `0` | Temperature band index (1–5) used for `dumbbell_heat`; drives visual state and light emission. |
| `highTemp` / `lowTemp` | number or `nil` | `nil` | Track highest/lowest recorded temperatures for `dumbbell_heat`. |

## Main functions
### `MakeDumbbell(name, consumption, efficiency, damage, impact_sound, walkspeedmult)`
*   **Description:** Factory function that constructs a prefab with the specified parameters. It initializes a base entity, attaches required components, and conditionally adds `temperature`, `heater`, `lootdropper`, and other variant-specific behaviors.
*   **Parameters:**
    *   `name` (string) – Base asset name (e.g., `"dumbbell_heat"`).
    *   `consumption` (number) – Base durability cost per action.
    *   `efficiency` (table) – Array of three efficiency multipliers for `wimpy`, `normal`, and `mighty` states.
    *   `damage` (number or function) – Base damage applied by the weapon.
    *   `impact_sound` (string) – Sound effect to play on impact.
    *   `walkspeedmult` (number or `nil`) – Optional walking speed penalty/bonus.
*   **Returns:** `Prefab` instance ready for registration.

### `OnAttack(inst, attacker, target)`
*   **Description:** Called on melee attack; invokes `mightydumbbell.DoAttackWorkout(attacker)` to increase `mightiness` only if the dumbbell is held by the attacker.
*   **Parameters:**
    *   `inst` (Entity) – The dumbbell instance.
    *   `attacker` (Entity) – The entity performing the attack.
    *   `target` (Entity) – The target being attacked.
*   **Returns:** Nothing.

### `OnThrownHit(inst, attacker, target)`
*   **Description:** Executed when a thrown dumbbell hits an entity or terrain; triggers AOE damage around impact point (2 radius), applies fire/ice effects (if applicable), consumes uses, updates physics, and resets behavior. Damage scaling is applied based on skill states `wolfgang_dumbbell_throwing_1` and `wolfgang_dumbbell_throwing_2`.
*   **Parameters:**
    *   `inst` (Entity) – The thrown dumbbell.
    *   `attacker` (Entity or `nil`) – The thrower; may be `nil` in server-authoritative attacks.
    *   `target` (Entity) – The primary hit entity (for reference); AOE targets are computed internally.
*   **Returns:** Nothing.
*   **Error states:** Skips AOE application if `CanDamage` returns `false` for a candidate entity; allows self-attack (`attacker == ent`) for cooling benefits.

### `TemperatureChange(inst, data)`
*   **Description:** Handles temperature updates for `dumbbell_heat`; recalculates the temperature band (1–5), updates visual assets, lighting intensity, and consumes durability when passing into extreme bands (e.g., `<=1` or `>=5`) while having a recorded `lowTemp` or `highTemp`.
*   **Parameters:**
    *   `inst` (Entity) – The dumbbell entity.
    *   `data` (table or `nil`) – Event data; if `data.hasrate` is `true`, durability decay may occur.
*   **Returns:** Nothing.

### `OnOwnerChange(inst)`
*   **Description:** Updates light entity parentage and visibility based on whether the dumbbell (or its chain of owners) is in a pocket dimension or buried. Maintains a set of owner instances and registers/unregisters event callbacks.
*   **Parameters:**
    *   `inst` (Entity) – The dumbbell entity.
*   **Returns:** Nothing.

### `ReticuleTargetFn()`
*   **Description:** Raycasts forward from the player to find a valid, passable ground point within range (3.5–6.5 units) for aiming the dumbbell. Used by `reticule` component to determine targeting location.
*   **Parameters:** None.
*   **Returns:** `Vector3` – World position of the reticule target, defaulting to zero vector if none found.

### `CanDamage(inst, target, attacker)`
*   **Description:** Validates whether an entity can be damaged with the dumbbell, respecting PVP settings, friendly leaders (including domesticated and salt-licked entities), and minigame participants.
*   **Parameters:**
    *   `inst` (Entity) – The dumbbell.
    *   `target` (Entity) – The entity to be damaged.
    *   `attacker` (Entity) – The potential attacker.
*   **Returns:** `boolean` – `true` if damage is allowed.

### `HasFriendlyLeader(inst, target, attacker)`
*   **Description:** Helper function to check if the target has a friendly leader (player-owned, domesticated, or salt-licked) under non-PVP conditions.
*   **Parameters:** As per `CanDamage`.
*   **Returns:** `boolean` – `true` if the target cannot be damaged due to friendly leadership.

## Events & listeners
- **Listens to:**
  - `"mightiness_statechange"` on owner (only when equipped) – triggers `CheckMightiness` to toggle tossable/punch state.
  - `"temperaturedelta"` (on `dumbbell_heat`) – triggers `TemperatureChange`.
  - `"onputininventory"` – triggers `OnPickup` and `OnOwnerChange` for dynamic behavior.
  - `"onputininventory"` / `"ondropped"` on owners – tracked via `_onownerchange` to manage light parentage for `dumbbell_heat`.
- **Pushes:** None directly; uses standard component events (e.g., `finiteuses` fires `"percentusedchange"` and `"usesdepleted"`).