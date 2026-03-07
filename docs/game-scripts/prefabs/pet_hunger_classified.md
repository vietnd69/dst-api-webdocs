---
id: pet_hunger_classified
title: Pet Hunger Classified
description: Manages network-synchronized hunger state and metadata for pet entities, acting as a classified (dedicated) component that bridges server-side hunger logic and client-side UI updates for pet owners.
tags: [network, pet, hunger, classified]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3cd438e1
system_scope: network
---

# Pet Hunger Classified

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`pet_hunger_classified` is a specialized networked component that maintains and synchronizes pet hunger state for a specific owner (player). It operates as a "classified" component—meaning it exists in a dedicated instance tied to an entity rather than being attached directly to the pet—enabling proper client-server data routing and UI updates. It reflects the hunger state of a pet (via `hunger` component) on the owner's client, and supports metadata such as flags and build variant.

The component is typically associated with pets that require hunger tracking visible to their owner (e.g., Beefalo, Pigs, etc.). It leverages `net_ushortint`, `net_bool`, and `net_hash` network variables to replicate hunger data across the network, and dispatches custom events like `pet_hungerdelta`, `pet_startstarving`, and `pet_hunger_flags` to drive UI feedback.

Key relationships:
- Reads from the pet's `hunger` component (`GetPercent`, `IsStarving`, `current`, `max`)
- Attaches to and interacts with a player entity (`_parent`)
- Uses network dirty events (`hungerdirty`, `flagsdirty`, `builddirty`) for client-side propagation

## Usage example
```lua
-- Typically added automatically by the game engine when a pet is associated with an owner
-- Demonstrating manual setup in custom logic:
local inst = CreateEntity()
inst:AddComponent("pet_hunger_classified")

-- Attach to an owner (player) and link to a pet
inst.AttachClassifiedToPetOwner(inst, player_entity)
inst.InitializePetInst(inst, pet_entity)

-- Later, access pet hunger stats on the owner's client
if inst:GetPercent() <= 0 then
    print("Pet is starving")
end
```

## Dependencies & tags
**Components used:** `hunger` (accessed via `pet.components.hunger`)
**Tags:** Adds `CLASSIFIED`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_oldhungerpercent` | number | `1` | Tracks last known hunger percentage for delta detection on client |
| `currenthunger` | `net_ushortint` | `100` | Network variable for current hunger value |
| `maxhunger` | `net_ushortint` | `100` | Network variable for max hunger value |
| `ishungerpulseup` | `net_bool` | `false` | Flag to signal client-side UI pulse on hunger increase |
| `ishungerpulsedown` | `net_bool` | `false` | Flag to signal client-side UI pulse on hunger decrease |
| `flags` | `net_smallbyte` | `0` | Bit-packed metadata flags (e.g., pet-specific states) |
| `build` | `net_hash` | `0` | Build/skin identifier for pet visual variation |
| `_pet` | `Entity` | `nil` | Reference to associated pet entity |
| `_parent` | `Entity` | `nil` | Reference to owner (player) entity |

## Main functions
### `GetPercent()`
* **Description:** Returns the current hunger as a normalized percentage (`0.0` to `1.0`). On server, uses real-time hunger data; on client, uses networked values.
* **Parameters:** None.
* **Returns:** `number` — hunger percentage (`currenthunger / maxhunger`).

### `GetCurrent()`
* **Description:** Returns the current hunger value (absolute, not normalized). On server, reads from the pet's `hunger` component; on client, uses `currenthunger` network variable.
* **Parameters:** None.
* **Returns:** `number` — current hunger amount.

### `IsStarving()`
* **Description:** Returns whether the pet is starving (`hunger <= 0`). Delegates to `hunger:IsStarving()` on server; uses networked value on client.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if starving.

### `Max()`
* **Description:** Returns the max hunger value. Delegates to `hunger.max` on server; uses `maxhunger` network variable on client.
* **Parameters:** None.
* **Returns:** `number` — max hunger amount.

### `GetFlags()`
* **Description:** Returns all hunger-related flags as a byte value.
* **Parameters:** None.
* **Returns:** `number` — bit-packed flags.

### `GetFlagBit(bitnum)`
* **Description:** Returns the state of a specific flag bit.
* **Parameters:** `bitnum` (number) — bit index (0-based).
* **Returns:** `boolean` — `true` if the bit is set.

### `GetBuild()`
* **Description:** Returns the current pet build identifier (used for skin/variant rendering).
* **Parameters:** None.
* **Returns:** `number` — build hash.

### `SetValue(inst, name, value)`
* **Description:** (Server only) Sets a network variable (`hunger.current` or `hunger.max`) to a bounded integer. Asserts value is in `[0, 65535]`.
* **Parameters:**  
  - `inst` (table) — the `pet_hunger_classified` instance.  
  - `name` (string) — variable name (`"hunger.current"` or `"hunger.max"`).  
  - `value` (number) — integer to set.  
* **Returns:** Nothing.
* **Error states:** Fails with `assert` if `value` is outside `[0, 65535]`.

### `SetFlags(inst, value)`
* **Description:** (Server only) Sets the flags byte and broadcasts `pet_hunger_flags` event to parent if changed.
* **Parameters:**  
  - `inst` (table) — the `pet_hunger_classified` instance.  
  - `value` (number) — new flags byte.  
* **Returns:** Nothing.

### `SetFlagBit(inst, bitnum, value)`
* **Description:** (Server only) Sets or clears a specific flag bit.
* **Parameters:**  
  - `inst` (table) — the `pet_hunger_classified` instance.  
  - `bitnum` (number) — bit index to modify.  
  - `value` (boolean) — `true` to set, `false` to clear.  
* **Returns:** Nothing.

### `SetBuild(inst, build)`
* **Description:** (Server only) Sets the pet build identifier and triggers `pet_hunger_build` event if changed. If pet is newly spawned (`GetTimeAlive() <= 0`), sets `instant = true` in the event payload.
* **Parameters:**  
  - `inst` (table) — the `pet_hunger_classified` instance.  
  - `build` (number) — build hash (default `0`).  
* **Returns:** Nothing.

### `InitializePetInst(inst, pet)`
* **Description:** (Server only) Attaches this classified instance to a pet and links its hunger component. Handles replication on first attach; asserts consistency on re-attach.
* **Parameters:**  
  - `inst` (table) — the `pet_hunger_classified` instance.  
  - `pet` (Entity) — the pet entity to track.  
* **Returns:** Nothing.
* **Error states:** Asserts `inst._pet == nil` and `pet ~= nil`.

### `AttachClassifiedToPetOwner(inst, player)`
* **Description:** (Server only) Links this classified instance to an owner (player). Assigns parent, sets network target, and registers removal callback.
* **Parameters:**  
  - `inst` (table) — the `pet_hunger_classified` instance.  
  - `player` (Entity) — the player entity (owner).  
* **Returns:** Nothing.
* **Error states:** Asserts `_pet` exists, `_parent == nil`, and `player.pet_hunger_classified == nil`.

### `DetachClassifiedFromPet(inst, pet)`
* **Description:** (Server only) Breaks the link to a pet. Removes hunger event callbacks; clears parent if unlinked from player.
* **Parameters:**  
  - `inst` (table) — the `pet_hunger_classified` instance.  
  - `pet` (Entity) — the pet entity.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `hungerdelta` (from pet's `hunger` component) — triggers delta handling (`OnHungerDelta`) and UI events (`pet_hungerdelta`, `pet_startstarving`, `pet_stopstarving`) on the owner.  
  - `onremove` (from pet) — triggers `OnRemovePet` to cleanup the classified instance when pet is removed.  
  - `onremove` (from player) — triggers `OnRemovePlayer` to cleanup when owner is removed.  
  - `hungerdirty`, `flagsdirty`, `builddirty` (client only) — propagates dirty values to owner via events (`pet_hungerdelta`, `pet_hunger_flags`, `pet_hunger_build`).  
- **Pushes:**  
  - `pet_hungerdelta` — sent to owner on hunger change; includes `oldpercent`, `newpercent`, and `overtime` flag.  
  - `pet_startstarving` — sent to owner when pet transitions to starving state.  
  - `pet_stopstarving` — sent to owner when pet recovers from starvation.  
  - `pet_hunger_flags` — sent to owner when flags change.  
  - `pet_hunger_build` — sent to owner when build changes (includes `{ build, instant }` payload).  
  - `show_pet_hunger` — sent to owner when classified instance is attached/detached (boolean argument).