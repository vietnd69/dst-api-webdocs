---
id: scrapbook_notes
title: Scrapbook Notes
description: Factory function that generates scrapbook note prefabs for use in the Scrapbook UI, each tied to a specific教学 (e.g., Wagstaff blueprint notes).
tags: [crafting, ui, inventory]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d8e39396
system_scope: crafting
---

# Scrapbook Notes

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`scrapbook_notes.lua` is a prefab factory that defines and returns a set of scrapbook note prefabs used to teach curated knowledge entries in the Scrapbook UI. Each note is a lightweight inventory item with animation, networked behavior, and integration with the `scrapbookable` component to handle the teaching workflow. It is not a component itself, but rather a script that constructs and registers prefabs—specifically for the Wagstaff-related knowledge entries in this case.

## Usage example
```lua
local notes = require "prefabs/scrapbook_notes"
-- Returns a table of prefabs, e.g.:
-- { "wagstaff_mutations_note", "wagstaff_materials_note", ... }

-- To spawn one (server-side):
local note = Prefab("wagstaff_mutations_note")
local inst = spawn(prefab) -- or CreateEntity() + PrefabLoad() depending on context
inst.components.scrapbookable:Teach(player)
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `erasablepaper`, `fuel`, `scrapbookable`, `transform`, `animstate`, `network`, `physics`, `floatable`, `hauntable`
**Tags added:** `scrapbook_note`, plus any `data.tags` from the `NOTES` table (e.g., `"mutationsnote"` for the first entry)

## Properties
No public properties—this file is a factory returning prefabs. Any state resides in prefab instances (e.g., `inst.reserved_userid`), not in module-level variables.

## Main functions
### `MakeScrapbookNote(data)`
*   **Description:** Constructs and returns a prefab for a scrapbook note based on the provided `data` record. Creates an entity with animation, inventory, network sync, fuel, and scrapbook teaching capabilities.
*   **Parameters:** `data` (table) - A record with fields:  
    - `name` (string) – Base name for the prefab (e.g., `"wagstaff_mutations"` → `wagstaff_mutations_note`)  
    - `tags` (table, optional) – Additional tags to apply  
    - `build` (string, optional) – Anim bank/build name (defaults to `"blueprint_tackle"` if missing)
*   **Returns:** `Prefab` – A fully configured prefab function with associated assets.
*   **Error states:** None. Always returns a valid prefab.

### `OnTeach(inst, doer)`
*   **Description:** Handles the teaching logic when a player attempts to use a scrapbook note. Implements reservation logic to prevent concurrent use, validates permissions, and initiates teaching via `ScrapbookPartitions:TryToTeachScrapbookData`.
*   **Parameters:**  
    - `inst` (Entity) – The note instance being used  
    - `doer` (Entity) – The player attempting to teach
*   **Returns:** `true` – Always returns `true`, indicating the interaction was handled.
*   **Error states:**  
    - If another player holds the reservation, shows an in-use string and returns early.  
    - `nil` is returned implicitly in some client paths (e.g., when `TheWorld.ismastersim` is false).

### `OnScrapbookDataTaught(inst, doer, diduse)`
*   **Description:** Cleanup callback invoked after a successful or failed teaching attempt. Releases the reservation and cancels any pending timeout.
*   **Parameters:**  
    - `inst` (Entity) – The note instance  
    - `doer` (Entity) – The player who attempted teaching  
    - `diduse` (boolean) – Whether the note was consumed
*   **Returns:** Nothing.

### `CancelReservation(inst)`
*   **Description:** Internal utility to clear the reservation state and cancel the auto-timeout task.
*   **Parameters:** `inst` (Entity) – The note instance
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None directly via `inst:ListenForEvent`. However, it integrates with the Scrapbook system’s internal eventing via `TheScrapbookPartitions`.
- **Pushes:** `imagechange` (via `inventoryitem:ChangeImageName`) and the scrapbook system’s internal RPCs and callbacks (e.g., after `TryToTeachScrapbookData` completes).