---
id: wolfgang
title: Wolfgang
description: Implements Wolfgang’s gameplay mechanics including Mightiness system, sanity modifiers based on proximity to enemies/followers, special work gain, and gym-based bell-minigame for gym-based mightiness gain.
tags: [player, combat, progress, minigame, stamina]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9e81f081
system_scope: player
---

# Wolfgang

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wolfgang` is a player character prefab implementing the "Mightiness" progression system. It enhances outgoing damage and health as Mightiness increases across three states: `wimpy`, `normal`, and `mighty`. It dynamically adjusts sanity drain based on nearby enemies and followers, grants bonus mightiness through actions (attacking, working, rowing, etc.), and supports a minigame for increasing Mightiness beyond normal caps via a gym-based bell-timing mechanic.

## Usage example
The `wolfgang` prefab is automatically instantiated as a playable character. Modders typically do not manually construct this entity but may interact with its exposed helper methods or extend its behavior through component hooks.

Example of extending Mightiness gain on custom action:
```lua
inst:ListenForEvent("my_custom_action", function(inst, data)
    if inst.prefab == "wolfgang" and data.success then
        inst.components.mightiness:DoDelta(TUNING.WOLFGANG_MIGHTINESS_ATTACK_GAIN_DEFAULT)
    end
end)
```

## Dependencies & tags
**Components used:**  
`mightiness`, `health`, `hunger`, `sanity`, `inventory`, `foodaffinity`, `workmultiplier`, `playeractionpicker`, `playercontroller`, `playerspeedmult`, `skilltreeupdater`, `updatelooper`, `debuff`, `efficientuser`, `leader`, `planardamage`, `combat`, `dumbbelllifter`, `strongman`, `expertsailor`, `coach`

**Tags added:**  
`strongman`, `mightiness_normal`, `CLASSIFIED`, `NOCLICK`, `FX` (for temporary FX), `quagmire_ovenmaster`, `quagmire_shopper`

**Tags listened to in threat detection:**  
`bedazzled`, `INLIMBO`, `FX`, `NOCLICK`, `DECOR`, `epic`, `monster`, `player` (PVP-sensitive)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `bell_percent` | number | `0` | Current position of the gym bell (0.0 to 1.0). |
| `bell_forward` | boolean | `true` | Direction of bell movement (`true` = increasing). |
| `bell_speed` | number | `0.9` | Rate at which the bell moves per second. |
| `bell` | Entity | `nil` | Visual bell entity used in gym minigame. |
| `_mightyplanarweapon` | Entity or nil | `nil` | Reference to equipped weapon gaining Planar Damage bonus while Mighty. |
| `playercheck_task` | Task | `nil` | Periodic task tracking sanity-affecting entities. |
| `gym_skin` | string | `""` | Custom skin to apply to gym-related FX entities. |

## Main functions
### `GetMightiness(inst)`
*   **Description:** Returns current Mightiness as a normalized percentage (`0.0` to `1.0`). Falls back to network variable if `mightiness` component is not yet ready.
*   **Parameters:** `inst` (Entity) – the Wolfgang entity.
*   **Returns:** `number` – mightiness value between `0.0` and `1.0`.

### `GetMightinessRateScale(inst)`
*   **Description:** Returns current Mightiness drain rate scale (e.g., `RATE_SCALE.NEUTRAL`, `RATE_SCALE.SLOW`). Falls back to network variable if `mightiness` component unavailable.
*   **Parameters:** `inst` (Entity) – the Wolfgang entity.
*   **Returns:** `number` – rate scale constant.

### `GetCurrentMightinessState(inst)`
*   **Description:** Returns current Mightiness state (`"wimpy"`, `"normal"`, or `"mighty"`), computed either from the `mightiness` component or the network representation.
*   **Parameters:** `inst` (Entity) – the Wolfgang entity.
*   **Returns:** `string` – one of `"wimpy"`, `"normal"`, or `"mighty"`.

### `OnEquip(inst, data)`
*   **Description:** Triggered when an item is equipped. Pauses/Resumes Mightiness drain if the item has the `"heavy"` tag, and triggers Planar Damage recalculation if equipped to `HANDS`.
*   **Parameters:**  
    `inst` (Entity) – Wolfgang entity.  
    `data` (table) – event data with `item` (Entity), `eslot` (slot enum).  
*   **Returns:** Nothing.

### `OnUnequip(inst, data)`
*   **Description:** Opposite of `OnEquip`; resumes Mightiness drain if `"heavy"` item was unequipped, and triggers Planar Damage recalculation if hands slot was affected.
*   **Parameters:** Same as `OnEquip`.
*   **Returns:** Nothing.

### `RecalculatePlanarDamage(inst)`
*   **Description:** Adds or removes Planar Damage bonus to the currently held weapon based on skilltree upgrades and current `mightiness` state. Only applies to non-magic weapons when Mighty.
*   **Parameters:** `inst` (Entity) – Wolfgang entity.
*   **Returns:** Nothing.

### `RecalculateMightySpeed(inst)`
*   **Description:** Applies or removes a player speed bonus from skilltree when in `"normal"` state.
*   **Parameters:** `inst` (Entity) – Wolfgang entity.
*   **Returns:** Nothing.

### `SpecialWorkMultiplierFn(inst, action, target, tool, numworks, recoil)`
*   **Description:** Returns `99999` (simulating a critical work) if working while Mighty and RNG succeeds (based on skilltree tier). Triggers sound and resets work multiplier.
*   **Parameters:**  
    `inst` (Entity), `action` (table), `target` (Entity), `tool` (Entity), `numworks` (number), `recoil` (boolean).  
*   **Returns:** `number` – `99999` on critical success, `nil` otherwise.

### `Startbell(inst)`
*   **Description:** Adds `updatebell` function to `updatelooper` so bell animation runs when player enters gym.
*   **Parameters:** `inst` (Entity) – Wolfgang entity.
*   **Returns:** Nothing.

### `Stopbell(inst)`
*   **Description:** Removes `updatebell` from `updatelooper` and resets bell position.
*   **Parameters:** Same as `Startbell`.
*   **Returns:** Nothing.

### `Pausebell(inst)`
*   **Description:** Temporarily pauses gym minigame updates (does not reset bell state).
*   **Parameters:** Same as `Startbell`.
*   **Returns:** Nothing.

### `ResetBell(inst)`
*   **Description:** Resets bell to `percent = 0` and direction `forward = true`.
*   **Parameters:** Same as `Startbell`.
*   **Returns:** Nothing.

### `CalcLiftAction(inst)`
*   **Description:** Determines gym lift result (`LIFT_GYM_SUCCEED_PERFECT`, `LIFT_GYM_SUCCEED`, or `LIFT_GYM_FAIL`) based on current `bell_percent` and gym level thresholds.
*   **Parameters:** `inst` (Entity) – Wolfgang entity.
*   **Returns:** `Action` – one of the lift actions.

### `OnHitOther(inst, data)`
*   **Description:** Increases Mightiness upon hitting a target, with gains scaled by target type (`epic`, `smallcreature`, or default).
*   **Parameters:**  
    `inst` (Entity) – Wolfgang entity.  
    `data` (table) – event data with `target` (Entity) and `weapon` (Entity).  
*   **Returns:** Nothing.

### `OnDoingWork(inst, data)`
*   **Description:** Increases Mightiness when performing any work action, based on the action type (`TUNING.WOLFGANG_MIGHTINESS_WORK_GAIN`).
*   **Parameters:** Same as `OnHitOther`, but `data.target` must be workable.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `ms_respawnedfromghost` – calls `onbecamehuman` to resume mightiness and start sanity checks.  
  `ms_becameghost` – calls `onbecameghost` to pause mightiness and cancel sanity checks.  
  `equip` / `unequip` – adjust mightiness drain and recalculate Planar Damage.  
  `working`, `workinglunarhailbuildup`, `tilling`, `rowing`, `on_lower_sail_boost`, `onterraform` – gain mightiness.  
  `onhitother` – gain mightiness.  
  `mightiness_statechange` – triggers recalculation of Planar Damage and speed.  
  `inmightygym` – toggles gym minigame components (bell entity and action overrides).  
  `lift_gym` (client only) – pauses bell on failure.

- **Pushes:** None directly; delegates event handling to components.