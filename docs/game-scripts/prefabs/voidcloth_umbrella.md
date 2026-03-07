---
id: voidcloth_umbrella
title: Voidcloth Umbrella
description: A magical rain-protection item that deploys a dome to block rain and acid rain while consuming magic fuel, with unique behavior when damaged.
tags: [rain, magic, durability, equipment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 05b2c6e2
system_scope: inventory
---

# Voidcloth Umbrella

> Based on game build **7140014** | Last updated: 2026-03-07

## Overview
The `voidcloth_umbrella` is a unique equippable inventory item that provides absolute water and acid rain protection. When activated (via the machine interface), it creates a rain dome around the player that also provides a small sanity aura. It consumes magic fuel over time while active and has distinct "pristine" and "broken" states. If fuel runs out while active, it breaks and enters a permanent damaged state until repaired in a forge. The component integrates with multiple systems: equippable (for equip/unequip logic), fueled (for fuel consumption and depletion), machine (for dome activation), raindome (for rain protection), and floater (for float animation scaling based on damage state).

## Usage example
```lua
local umbrella = SpawnPrefab("voidcloth_umbrella")
umbrella.components.fueled:InitializeFuelLevel(100)
umbrella.components.machine:TurnOn() -- activates the dome
umbrella.components.raindome:Disable() -- deactivates dome manually
```

## Dependencies & tags
**Components used:** `equippable`, `fueled`, `floater`, `machine`, `raindome`, `sanityaura`, `waterproofer`, `insulator`, `inventoryitem`, `inspectable`, `shadowlevel`, `highlightchild`, `colouraddersync`, `updatelooper`, `tradable`, `inventory`, `colouradder`

**Tags added:** `nopunch`, `umbrella`, `acidrainimmune`, `shadow_item`, `show_broken_ui`, `lunarhailprotection`, `waterproofer`, `shadowlevel`, `FX` (for FX prefabs only)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `isbroken` | `net_bool` | `false` | Networked boolean indicating if the umbrella is in broken state |
| `triggerfx` | `net_event` | (event object) | Networked event used to trigger client-side FX when dome activates |
| `t` | number | `0` | Timer used in wave/dome FX update loop |
| `scalemult` | number | `0.75` | Scale multiplier applied in FX wave animation |
| `shadowtask` | `DoTaskInTime` | `nil` | Task scheduling shadow visibility changes |
| `_fx` | `Entity` | `nil` | Reference to attached voidcloth umbrella FX entity |

## Main functions
### `SetIsBroken(inst, isbroken)`
*   **Description:** Configures the umbrella to be in broken or pristine state, updating floater behavior, animation, and visual state.
*   **Parameters:** `isbroken` (boolean) — if `true`, sets broken state with smaller size, vertical offset, and broken float animation; if `false`, restores large size and default float animation.
*   **Returns:** Nothing.
*   **Error states:** None.

### `OnPerish(inst)`
*   **Description:** Handles transition to broken state when fuel is depleted while active. Removes equippable, sets broken state, drops item from inventory if equipped, and notifies owner.
*   **Parameters:** `inst` (Entity) — the umbrella instance.
*   **Returns:** Nothing.
*   **Error states:** None.

### `OnRepaired(inst)`
*   **Description:** Restores functionality after repair; re-adds equippable, resets animation, unsets broken state.
*   **Parameters:** `inst` (Entity) — the umbrella instance.
*   **Returns:** Nothing.
*   **Error states:** Only restores equippable if missing; otherwise does nothing.

### `turnon(inst)`
*   **Description:** Activates the dome functionality: consumes fuel, enables rain dome, adds sanity aura, disables pickup, and plays activation animations/SFX. Only works if fuel is available.
*   **Parameters:** `inst` (Entity) — the umbrella instance.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `fueled:IsEmpty()`.

### `turnoff(inst)`
*   **Description:** Deactivates dome: stops fuel consumption, disables rain dome, removes sanity aura, re-enables pickup, and plays deactivation animations/SFX. Handles both broken and non-broken states.
*   **Parameters:** `inst` (Entity) — the umbrella instance.
*   **Returns:** Nothing.
*   **Error states:** None.

## Events & listeners
- **Listens to:**  
  - `voidcloth_umbrella.triggerfx` — triggers client-side dome FX  
  - `isbrokendirty` — updates broken-state visuals  
  - `onputininventory` — plays broken/idle animation on stow  
  - `floater_startfloating` — stows item on float start  
  - `exitlimbo` — ensures shadow is disabled when exiting limbo  
  - `isacidraining` (via `WatchWorldState`) — adjusts fuel consumption rate  

- **Pushes:**  
  - `equipskinneditem` / `unequipskinneditem` — for skin support  
  - `umbrellaranout` — after umbrella breaks while equipped (data includes prefab and equipslot)  
  - `machineturnedoff` — via `machine` component