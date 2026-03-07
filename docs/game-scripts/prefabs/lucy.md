---
id: lucy
title: Lucy
description: Lucy is a sentient axe prefab that handles speech, equipping/unequipping, container storage, and transformation behaviors in the game.
tags: [combat, inventory, speech, transformation]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b7d1229d
system_scope: entity
---

# Lucy

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lucy` is a sentient axe prefab that integrates speech, inventory, and transformation systems. It functions as a combat tool with built-in dialogue capabilities via the `lucy_classified` component. The prefab dynamically handles its presence in containers and on the ground, manages equipment animations, and responds to hauntable interactions. It relies heavily on the `talker`, `sentientaxe`, `equippable`, `tool`, `weapon`, and `possessedaxe` components to deliver its gameplay behavior.

## Usage example
```lua
-- Typically instantiated via the Prefab system, not manually added.
-- Example of component interaction after instantiation:
inst = GetEntityFromGuid(instGUID) -- e.g., after spawning "lucy"
inst.components.weapon:SetDamage(new_damage)
inst.components.sentientaxe:Say(STRINGS.LUCY.on_haunt)
```

## Dependencies & tags
**Components used:** `talker`, `sentientaxe`, `equippable`, `tool`, `weapon`, `inspectable`, `inventoryitem`, `possessedaxe`, `container`, `inventoryitem`  
**Tags added:** `sharp`, `tool`, `weapon`  
**Tags checked/removed:** `FX` (for local sound entity), `ignoretalking` (via `talker:IgnoreAll`/`StopIgnoringAll`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `lucy_classified` | Entity or `nil` | `nil` | Reference to the classified speech controller prefab. |
| `_container` | Entity or `nil` | `nil` | Reference to the container (e.g., inventory or chest) the axe is stored in. |
| `localsounds` | Entity or `nil` | `nil` | Non-networked sound entity for local speech effects (not present on dedicated servers). |

## Main functions
### `AttachClassified(inst, classified)`
*   **Description:** Attaches a `lucy_classified` instance to this axe, setting up callbacks for cleanup when the classified entity is removed.
*   **Parameters:** `classified` (Entity) - the classified instance to attach.
*   **Returns:** Nothing.

### `DetachClassified(inst)`
*   **Description:** Removes the attached classified reference and cleans up the removal listener.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnRemoveEntity(inst)`
*   **Description:** Handles cleanup of the classified entity when this axe is removed. On master simulation, it removes the classified entity; on clients, it only clears local references.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `topocket(inst, owner)`
*   **Description:** Ensures the axe is tracked as stored in the specified owner (e.g., inventory), updates the classified target, and toggles speech ignoring during world migration.
*   **Parameters:** `owner` (Entity) - the entity (typically a player) storing the axe.
*   **Returns:** Nothing.

### `toground(inst)`
*   **Description:** Clears container tracking for the axe and sets the classified target to `nil`, allowing anyone to hear it.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `onequip(inst, owner)`
*   **Description:** Handles equipment animation and skin overrides when the axe is equipped.
*   **Parameters:** `owner` (Entity) - the entity equipping the axe.
*   **Returns:** Nothing.

### `onunequip(inst, owner)`
*   **Description:** Restores default arm animations when the axe is unequipped.
*   **Parameters:** `owner` (Entity) - the entity unequipping the axe.
*   **Returns:** Nothing.

### `ontalk(inst)`
*   **Description:** Plays speech sound effects using `lucy_classified` or a fallback default voice line.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ondonetalking(inst)`
*   **Description:** Terminates the local speech sound.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `CustomOnHaunt(inst)`
*   **Description:** Triggers a dialogue line when the axe is haunted. Returns `true` if handled, `false` otherwise.
*   **Parameters:** None.
*   **Returns:** `true` if `sentientaxe:Say()` was called; otherwise `false`.

## Events & listeners
- **Listens to:**  
  - `onputininventory` — triggers `topocket` to track storage in a container.  
  - `ondropped` — triggers `toground` to clear storage tracking.  
  - `onremove` — triggers `OnRemoveEntity` for cleanup (attached to both self and `lucy_classified`).  
  - `ontalk` — triggers `ontalk` for sound playback (only on non-dedicated servers).  
  - `donetalking` — triggers `ondonetalking` to stop local speech sound.
- **Pushes:**  
  - `equipskinneditem` and `unequipskinneditem` — fired during equip/unequip if a skin build is active.