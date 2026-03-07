---
id: redlantern
title: Redlantern
description: A magical lantern that emits light and consumes fuel over time; supports equipping, rain exposure handling, and dynamic visual effects via attached child entities.
tags: [light, fuel, equippable, environment]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 31dfca98
system_scope: environment
---

# Redlantern

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `redlantern` prefab implements a magical lantern that provides ambient light while draining stored fuel. It is a composite entity composed of multiple prefabs (`redlantern`, `redlanternlight`, `redlanternbody`) and integrates with several components: `fueled`, `equippable`, `inventoryitem`, `floater`, `burnable`, and `sheltered`/`rainimmunity`. The lantern automatically extinguishes when fuel is depleted and re-ignites when refueled and re-equipped. When equipped, it modifies the owner's animation using override symbols and spawns a `redlanternbody` child entity for proper rendering in first-person view.

## Usage example
```lua
local inst = SpawnPrefab("redlantern")
inst.components.fueled:InitializeFuelLevel(100) -- set custom fuel level
inst.components.fueled:StartConsuming() -- start consuming fuel (for testing)
inst.components.inventoryitem.owner = some_player
inst.components.equippable:Equip() -- simulate equipping
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `equippable`, `fueled`, `fuel`, `floater`, `burnable`, `propagator`, `hauntable`, `sheltered`, `rainimmunity`, `rider`, `bloomer`, `colouradder`  
**Tags added:** `light`, `redlantern`, `FX` (for child light/body prefabs)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_invimagename` | string | `nil` (set at runtime) | Base inventory image name used to switch between lit/unlit icons. |
| `_light` | Entity | `nil` | Reference to the spawned `redlanternlight` entity. |
| `_body` | Entity | `nil` | Reference to the spawned `redlanternbody` entity (used when equipped). |
| `_owner` | Entity | `nil` | Owner player entity, tracked while lantern is equipped and consuming fuel. |
| `_swapfile` | string | `nil` | Optional swap file override used for custom lantern variants (e.g., YOTS). |

## Main functions
### `turnon(inst)`
*   **Description:** Turns the lantern on by starting fuel consumption and spawning the light effect. Updates animations and inventory icons. Has no effect if fuel is empty.
*   **Parameters:** `inst` (Entity) — the lantern instance.
*   **Returns:** Nothing.
*   **Error states:** Returns early with no effect if `fueled:IsEmpty()` is `true`.

### `turnoff(inst)`
*   **Description:** Turns the lantern off by stopping fuel consumption, removing the light effect, and resetting animations/icons. Stops tracking the owner.
*   **Parameters:** `inst` (Entity) — the lantern instance.
*   **Returns:** Nothing.

### `ToggleOverrideSymbols(inst, owner)`
*   **Description:** Configures the owner’s animation system based on current state (e.g., riding, nodangle state). Switches between `swap_redlantern` (visible) and `swap_redlantern_stick` (hidden) symbols and manages `LANTERN_OVERLAY` visibility.
*   **Parameters:**  
  *   `inst` (Entity) — the lantern instance.  
  *   `owner` (Entity) — the player wearing the lantern.
*   **Returns:** Nothing.

### `onequip(inst, owner)`
*   **Description:** Called when lantern is equipped. Sets up visualAttachment via `redlanternbody`, updates owner’s arm animations (`ARM_carry`), configures override symbols, and appropriately handles lantern lighting based on fuel status.
*   **Parameters:**  
  *   `inst` (Entity) — the lantern instance.  
  *   `owner` (Entity) — the player equipping the lantern.
*   **Returns:** Nothing.

### `onunequip(inst, owner)`
*   **Description:** Called when lantern is unequipped. Removes the `redlanternbody`, resets owner’s arm animations and override symbols. Restarts fuel tracking if lantern is currently consuming.
*   **Parameters:**  
  *   `inst` (Entity) — the lantern instance.  
  *   `owner` (Entity) — the player unequipping the lantern.
*   **Returns:** Nothing.

### `onequiptomodel(inst, owner, from_ground)`
*   **Description:** Called when equipping from world model (e.g., ground pick-up). Similar to `onequip`, but always turns off the lantern and prepares animations for pick-up transition.
*   **Parameters:**  
  *   `inst` (Entity) — the lantern instance.  
  *   `owner` (Entity) — the player equipping the lantern.  
  *   `from_ground` (boolean) — unused, present for API compatibility.
*   **Returns:** Nothing.

### `nofuel(inst)`
*   **Description:** Handles lantern fuel exhaustion. Turns off the lantern and notifies owner via `"torchranout"` event if equipped.
*   **Parameters:** `inst` (Entity) — the lantern instance.
*   **Returns:** Nothing.

### `onupdatefueledraining(inst)`
*   **Description:** Dynamically adjusts fuel consumption rate based on rain exposure and sheltering. Increases rate if raining and not sheltered or rain-immune.
*   **Parameters:** `inst` (Entity) — the lantern instance.
*   **Returns:** Nothing.

### `onisraining(inst, israining)`
*   **Description:** Enables/disables dynamic rain-based fuel draining by setting/removing `fueled.updatefn`.
*   **Parameters:**  
  *   `inst` (Entity) — the lantern instance.  
  *   `israining` (boolean) — current precipitation state.
*   **Returns:** Nothing.

### `OnRemove(inst)`
*   **Description:** Cleanup on entity removal. Ensures `redlanternlight` and `redlanternbody` children are removed.
*   **Parameters:** `inst` (Entity) — the lantern instance.
*   **Returns:** Nothing.

### `start_floating(inst)`
*   **Description:** Starts floating animation (`float`) when lantern becomes buoyant (e.g., dropped in water).
*   **Parameters:** `inst` (Entity) — the lantern instance.
*   **Returns:** Nothing.

### `stop_floating(inst)`
*   **Description:** Restores idle loop animation when floating ends.
*   **Parameters:** `inst` (Entity) — the lantern instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"onremove"` (on light/body children) — cleans up `_light`/`_body` references via `onremovelight`/`onremovebody`.  
  - `"equip"` (on owner) — stops lantern if another item is equipped to conflicting slots (`HANDS` or `BODY`).  
  - `"floater_startfloating"` / `"floater_stopfloating"` — controls floating animation.  
  - `"newstate"` (on owner) — triggers `ToggleOverrideSymbols`.  
- **Pushes:**  
  - `"imagechange"` — via `inventoryitem:ChangeImageName()`.  
  - `"torchranout"` — when lantern runs out of fuel while equipped (sent to owner).  
  - `"onfueldsectionchanged"` — via `fueled` component.  
