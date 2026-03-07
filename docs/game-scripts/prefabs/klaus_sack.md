---
id: klaus_sack
title: Klaus Sack
description: A interactible container prefab that triggers Klaus's summoning when unlocked with the correct key, and drops loot bundles upon opening.
tags: [loot, boss, event, container, winter]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4e3bbad6
system_scope: world
---

# Klaus Sack

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`klaus_sack` is a special container entity that appears during the Krampus encounters and is central to Klaus's summoning mechanic. It remains dormant until unlocked using either the correct `klaus_key` (summons Klaus) or an incorrect key (summons a boneshard instead). When Klaus is successfully summoned, the sack immediately erodes away and deposits loot bundles around the map using the `lootdropper` component. The sack includes persistence logic to despawn after winter ends if Klaus has not been summoned and no key has been found.

It leverages multiple components for state tracking (`entitytracker`), key interaction (`klaussacklock`), loot generation (`klaussackloot`), and world persistence (`knownlocations`). The prefabs referenced include dynamic loot items and seasonal variant symbols (e.g., for Winters Feast).

## Usage example
```lua
local sack = SpawnPrefab("klaus_sack")
sack.Transform:SetPosition(x, 0, z)

-- Attach a correct key and use it (example logic not exhaustive)
local key = SpawnPrefab("klaus_key")
key.components.klaussackkey = { truekey = true }  -- simulated component
sack:PushEvent("usekey", { key = key, doer = player })

-- The sack will automatically unlock, drop loot, and self-destruct after 1 second
```

## Dependencies & tags
**Components used:** `inspectable`, `lootdropper`, `klaussacklock`, `entitytracker`, `spawnfader`, `knownlocations`, `unwrappable`, `stackable`, `klaussackloot`, `klaussackkey`

**Tags added:**
- `klaussacklock`
- `antlion_sinkhole_blocker`
- `NOCLICK` (added on successful unlock)

**Tags checked:**
- `klaus_key` via `key.components.klaussackkey`
- `klaus` and `key` via `entitytracker:GetEntity`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `despawnday` | number | `TheWorld.state.cycles + TheWorld.state.winterlength` | The world cycle at which the sack will self-remove if Klaus hasn't spawned and no key is present. |

## Main functions
### `DropBundle(inst, items)`
*   **Description:** Creates a bundle or gift (depending on season) containing the provided items, wraps them via `unwrappable`, and flings the bundle away using `lootdropper`.
*   **Parameters:**
    - `inst` (Entity): The sack entity.
    - `items` (table): Array of item names (string) or `{name, size}` pairs.
*   **Returns:** Nothing.
*   **Error states:** Spawns prefabs directly via `SpawnPrefab`, which may fail if item is unknown or asset-missing.

### `onuseklauskey(inst, key, doer)`
*   **Description:** Handler invoked when a key is used on the sack. Validates the key and either spawns Klaus, spawns a boneshard, or returns an error.
*   **Parameters:**
    - `inst` (Entity): The sack instance.
    - `key` (Entity): The key being used.
    - `doer` (Entity): The entity using the key (typically a player).
*   **Returns:** Three values: `(success, message, play_sfx)`, where:
    - On success: `true, nil, true`
    - On wrong key: `false, "WRONGKEY", true`
    - On Klaus already present: `false, "KLAUS", false`
*   **Error states:** Returns `false` early if `key.components.klaussackkey` is missing.

### `OnDropKey(inst, key, klaus)`
*   **Description:** Tracks the key entity dropped near the sack (usually when Klaus drops it upon death), replacing any previous tracked key.
*   **Parameters:**
    - `inst` (Entity): The sack instance.
    - `key` (Entity): The key being dropped.
    - `klaus` (Entity): Klaus, if present.
*   **Returns:** Nothing.

### `validatesack(inst)`
*   **Description:** Despawns the sack if it is not in winter, the current cycle is past `despawnday`, Klaus has not been spawned, and no key has been found. Called on entity wake/sleep.
*   **Parameters:**
    - `inst` (Entity): The sack instance.
*   **Returns:** Nothing.

### `OnInit(inst)`
*   **Description:** Initializes event hooks for wake/sleep to run `validatesack`. Immediately triggers validation if the entity is asleep at spawn.
*   **Parameters:**
    - `inst` (Entity): The sack instance.
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Serializes `despawnday` to save data.
*   **Parameters:**
    - `inst` (Entity): The sack instance.
    - `data` (table): Save table.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores `despawnday` from save data; defaults to `0` if absent.
*   **Parameters:**
    - `inst` (Entity): The sack instance.
    - `data` (table): Loaded save table.
*   **Returns:** Nothing.

### `OnLoadPostPass(inst)`
*   **Description:** After all entities load, re-registers `dropkey` event listener for Klaus if he is present (so key drops during Klaus's death still get tracked).
*   **Parameters:**
    - `inst` (Entity): The sack instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `"usekey"` — handled by `onuseklauskey` callback set via `klaussacklock:SetOnUseKey`.
  - `"dropkey"` — handled by `OnDropKey` on Klaus’s entity (registered when Klaus spawns or during post-load).
  - `"onremove"` — implicitly handled by `entitytracker:TrackEntity` via `onremove` listener to clear entity references.

- **Pushes:**
  - `"ms_registerklaussack"` — fired on master sim to register the sack instance globally (e.g., for world state tracking).