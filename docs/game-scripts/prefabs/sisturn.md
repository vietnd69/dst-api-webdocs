---
id: sisturn
title: Sisturn
description: A decorative and functional structure that accepts flower-type items, modifies perish rates and sanity aura based on item content and player skill tree upgrades, and triggers special effects during moon blossoms.
tags: [structure, inventory, skill, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b330b7f1
system_scope: entity
---

# Sisturn

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`Sisturn` is a specialized structure prefab that functions as a decorative flower stand. It accepts up to four flower-type items into its container slots (`petals_evil` or `moon_tree_blossom`) and dynamically adjusts game behavior: the `preserver` component modifies perish rate based on skill upgrades, while the `sanityaura` component adjusts aura magnitude and sign based on item composition (normal, evil, or blossom). It interacts with the `sisturnregistry` and `skilltreeupdater` components to support Wendy-specific skill effects and event coordination. The structure also triggers visual/audio effects when fully filled, especially when moon blossoms are present.

## Usage example
```lua
local inst = SpawnPrefab("sisturn")
inst.Transform:SetPos(x, y, z)
inst.components.container:InsertItem(item1)
inst.components.container:InsertItem(item2)
-- Add two more items to trigger full-state behavior
```

## Dependencies & tags
**Components used:** `burnable`, `container`, `inspectable`, `lootdropper`, `preserver`, `sanityaura`, `sisturnregistry`, `skilltreeupdater`, `talker`, `workable`, `fueled`, `hauntable`, `mini_map`, `rewards`
**Tags:** Adds `structure`. Checks `burnt`, `ghostlyfriend`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_petal_preserve` | boolean or nil | `nil` | Whether the "petal preserve" skill upgrade is active for this inst. |
| `_sanityaura_size` | number or nil | `nil` | Modulated base sanity aura value from skill upgrades (or default). |
| `_builder_id` | string or nil | `nil` | User ID of the player who built the sisturn (used for skill-change tracking). |
| `lune_fx` | Prefab or nil | `nil` | Reference to the moon blossom particle effect entity. |
| `AnimState` | AnimState | — | Runtime animation manager (inherited via `entity:AddAnimState()`). |

## Main functions
### `ConfigureSkillTreeUpgrades(inst, builder)`
*   **Description:** Checks if specific skill upgrades ("wendy_sisturn_1", "wendy_sisturn_2") are activated via the builder's `skilltreeupdater` component and caches the results. Returns `true` if any values changed from their prior cached state.
*   **Parameters:** `inst` (Entity instance), `builder` (Player entity or nil).
*   **Returns:** `true` if the cached values (`_petal_preserve`, `_sanityaura_size`) were updated; otherwise `false`.
*   **Error states:** Returns `false` if no skill tree data is available.

### `ApplySkillModifiers(inst)`
*   **Description:** Applies current skill-modified modifiers to `preserver.perish_rate_multiplier` and `sanityaura.aura`.
*   **Parameters:** `inst` (Entity instance).
*   **Returns:** Nothing.

### `IsFullOfFlowers(inst)`
*   **Description:** Checks whether the container has all four slots filled with items.
*   **Parameters:** `inst` (Entity instance).
*   **Returns:** `true` if `container:IsFull()` is `true`; otherwise `false`.

### `getstatus(inst)`
*   **Description:** Returns a status string describing the sisturn's fill level and content type for the `inspectable` component.
*   **Parameters:** `inst` (Entity instance).
*   **Returns:** One of `"LOTS_OF_FLOWERS_EVIL"`, `"LOTS_OF_FLOWERS_BLOSSOM"`, `"LOTS_OF_FLOWERS"`, `"SOME_FLOWERS"`, or `nil`.

### `getsisturnfeel(inst)`
*   **Description:** Determines the dominant content type of items in the container by checking for `"petals_evil"` (evil), `"moon_tree_blossom"` (blossom), or default.
*   **Parameters:** `inst` (Entity instance).
*   **Returns:** `"EVIL"`, `"BLOSSOM"`, or `"NORMAL"`.

### `update_sanityaura(inst)`
*   **Description:** Conditionally adds/removes the `sanityaura` component and sets its `aura` value based on fill state and `getsisturnfeel`.
*   **Parameters:** `inst` (Entity instance).
*   **Returns:** Nothing.

### `update_idle_anim(inst)`
*   **Description:** Switches between looping ambient animation/sound when full and idle state when empty.
*   **Parameters:** `inst` (Entity instance).
*   **Returns:** Nothing.

### `update_abigail_status(inst)`
*   **Description:** Manages the `moon_blossom_sisturn` world event and spawns/stops `sisturn_moon_petal_fx` when full and blossom content is present.
*   **Parameters:** `inst` (Entity instance).
*   **Returns:** Nothing.

### `add_decor(inst, data)`
*   **Description:** Handles the "itemget" event: updates visual decorators (flower layers), triggers sanity/anim updates, fires the `ms_updatesisturnstate` event, and optionally announces via talker when the container becomes full.
*   **Parameters:** `inst` (Entity instance), `data` (table with `slot`, `item`, `builder` fields).
*   **Returns:** Nothing.

### `remove_decor(inst, data)`
*   **Description:** Handles the "itemlose" event: updates visual decorators, triggers sanity/anim updates, fires `ms_updatesisturnstate`, and cleans up talker announcement.
*   **Parameters:** `inst` (Entity instance), `data` (table with `slot` field).
*   **Returns:** Nothing.

### `UpdateFlowerDecor(inst)`
*   **Description:** Syncs override symbols for flower layers (e.g., `"flowers_01"`) based on item prefab type (`petals_evil` → `flowers_evil`, `moon_tree_blossom` → `flowers_lunar`).
*   **Parameters:** `inst` (Entity instance).
*   **Returns:** Nothing.

### `onhammered(inst)`
*   **Description:** Called when the sisturn is hammered: drops loot and container contents, spawns a small collapse FX, and removes the inst.
*   **Parameters:** `inst` (Entity instance).
*   **Returns:** Nothing.

### `onhit(inst, worker, workleft)`
*   **Description:** Handles partial hammering: plays hit sound/anim and drops container contents if not burnt and work remains.
*   **Parameters:** `inst` (Entity instance), `worker` (Entity), `workleft` (number).
*   **Returns:** Nothing.

### `on_built(inst, data)`
*   **Description:** Initializes state on build: plays build animation/sound, sets builder ID, configures skill upgrades, and applies modifiers.
*   **Parameters:** `inst` (Entity instance), `data` (table with `builder` field).
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Serializes relevant state (`burnt`, `_petal_preserve`, `_sanityaura_size`, `builder_id`, `_preserve_rate`) into `data`.
*   **Parameters:** `inst` (Entity instance), `data` (table).
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores state on load: handles burnt state and re-applies skill modifiers if present.
*   **Parameters:** `inst` (Entity instance), `data` (table or nil).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `itemget` → `add_decor`
  - `itemlose` → `remove_decor`
  - `onbuilt` → `on_built`
  - `wendy_sisturnskillchanged` → skill upgrade re-evaluation (builder-scoped).
- **Pushes:**
  - `moon_blossom_sisturn` (when `update_abigail_status` detects full + blossom condition).
  - `ms_updatesisturnstate` (on `add_decor` and `remove_decor` to sync with UI/network).
