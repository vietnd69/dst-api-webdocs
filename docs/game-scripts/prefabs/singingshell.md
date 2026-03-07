---
id: singingshell
title: Singingshell
description: A musical harvesting component that cycles through musical notes, tending nearby plants when activated, and dropping loot upon being hammered.
tags: [audio, environment, harvesting, loot]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4092e2e8
system_scope: environment
---

# Singingshell

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `singingshell` is a musical collectible prefab component that cycles through 12 musical notes via the `cyclable` component. When activated (e.g., by a `singingshelltrigger`), it plays a sound and tends nearby `tendable_farmplant` entities. It can be harvested using `ACTIONS.HAMMER`, dropping shell pieces via the `lootdropper` component. The component integrates with the `singingshellmanager` to track active shells and persists state across saves using `OnSave`/`OnLoad`.

## Usage example
```lua
-- Typical usage: Spawn an octave-4 singing shell
local shell = SpawnPrefab("singingshell_octave4")
shell.Transform:SetPosition(x, y, z)

-- Manually cycle to next note
shell.components.cyclable:Cycle(player, false)

-- Tend all nearby plants by triggering activation
shell._activatefn(shell, player)
```

## Dependencies & tags
**Components used:**  
- `inspectable` (sets `descriptionfn`)  
- `inventoryitem` (sets `ondropfn`, `onputininventoryfn`, `sinks`)  
- `lootdropper` (sets loot table, triggers drop on hammer finish)  
- `workable` (sets `onfinish` callback, `action`, `workleft`)  
- `cyclable` (sets `oncyclefn`, `num_steps`, `step`)  
- `hauntable` (sets haunt value and callback)  

**Tags:** Adds `singingshell` and `NOCLICK` (for critter FX only).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_octave` | number | `3`, `4`, or `5` | Determines playback sample and visual variation (`octave3`, `octave4`, `octave5`). |
| `_variation` | number | `1`, `2`, or `3` | Randomly assigned shell texture variant. |
| `_sound` | string | `"hookline_2/common/shells/sea_sound_X_LP"` | Sound bank path for note playback. |
| `_activatefn` | function | `PlaySound` | Callback invoked when triggered (e.g., by nearby trigger entities). |
| `scrapbook_overridedata` | table | `{"shell_placeholder", "singingshell", octave_str.."_"..2}` | Custom icon data for scrapbook display. |

## Main functions
### `PlaySound(inst, doer)`
*   **Description:** Plays the current note sound using `SoundEmitter` with a note index derived from the `cyclable.step`, triggers an animation, and tends all nearby `tendable_farmplant` entities within range.
*   **Parameters:**  
    - `inst` (Entity) — the singing shell instance.  
    - `doer` (Entity) — the entity triggering activation (e.g., player or trigger).  
*   **Returns:** Nothing.
*   **Error states:** Does not tend non-plant entities; silently skips plants missing the `farmplanttendable` component.

### `OnCycle(inst, step, doer)`
*   **Description:** Called by `cyclable` when the step changes. Invokes `PlaySound` to confirm the new note.
*   **Parameters:**  
    - `inst` (Entity) — the shell instance.  
    - `step` (number) — new step index (`1`–`12`).  
    - `doer` (Entity?) — optional trigger entity.  
*   **Returns:** Nothing.

### `OnHaunt(inst, haunter)`
*   **Description:** Handles haunting: cycles the shell forward or backward (50% chance each) with a chance based on `TUNING.HAUNT_CHANCE_OCCASIONAL`. Fires the `"ontuned"` event.
*   **Parameters:**  
    - `inst` (Entity) — the shell instance.  
    - `haunter` (Entity) — the haunting entity.  
*   **Returns:** Nothing.
*   **Error states:** Only cycles if `haunter.isplayer` and random chance succeeds.

### `onfinishwork(inst, worker)`
*   **Description:** Called upon successful hammering. Drops loot, spawns a critter FX, plays destroy sound, and removes the shell.
*   **Parameters:**  
    - `inst` (Entity) — the shell instance.  
    - `worker` (Entity) — the player performing the action.  
*   **Returns:** Nothing.

### `getdescription(inst, viewer)`
*   **Description:** Provides a localized description string, substituted with the current musical note (e.g., `"C"`, `"D#"`) using `NOTES[step]`.
*   **Parameters:**  
    - `inst` (Entity) — the shell instance.  
    - `viewer` (Entity?) — the player viewing the item.  
*   **Returns:** `string` — localized description with note.

### `OnSave(inst, data)`
*   **Description:** Saves the shell’s `_variation` for persistence.
*   **Parameters:**  
    - `inst` (Entity) — the shell instance.  
    - `data` (table) — serialization table passed by DST save system.  
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores `_variation` and updates animation and inventory image to match saved variation.
*   **Parameters:**  
    - `inst` (Entity) — the shell instance.  
    - `data` (table?) — deserialized save data.  
*   **Returns:** Nothing.
*   **Error states:** No effect if `data` is `nil` or `data.variation` is missing.

### `PreventImmediateActivate(inst)`
*   **Description:** Registers the shell with overlapping `singingshelltrigger` entities upon waking (e.g., post-spawn or exiting Limbo) to prevent accidental immediate activation.
*   **Parameters:**  
    - `inst` (Entity) — the shell instance.  
*   **Returns:** Nothing.

### `RegisterActiveShell(inst)`
*   **Description:** Adds this shell to the global `singingshellmanager` for tracking active shells (e.g., on pickup or entity wake).
*   **Parameters:**  
    - `inst` (Entity) — the shell instance.  
*   **Returns:** Nothing.
*   **Error states:** Creates the `singingshellmanager` if it doesn’t exist.

### `UnregisterActiveShell(inst)`
*   **Description:** Removes this shell from the global `singingshellmanager` (e.g., on inventory pickup, removal, or sleep).
*   **Parameters:**  
    - `inst` (Entity) — the shell instance.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"onremove"` — triggers `UnregisterActiveShell`.  
  - `"exitlimbo"` — calls `PreventImmediateActivate`.  
- **Pushes:**  
  - `"ontuned"` — fired after successful haunting (in `OnHaunt`).  
  - `"imagechange"` — emitted by `inventoryitem:ChangeImageName` during `OnLoad`.  
  - `"entity_droploot"` — fired internally by `lootdropper:DropLoot`.  
  - `"animover"` — handled for critter FX (not the shell itself).