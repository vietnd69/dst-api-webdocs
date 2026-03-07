---
id: wickerbottom
title: Wickerbottom
description: Implements Wickerbottom's unique gameplay mechanics, including the ability to spawn shadow creatures from reading books while insane, refusal of spoiled food, and bonus book-related interactions.
tags: [player, sanity, book, combat, inventory]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c2f3d9df
system_scope: player
---

# Wickerbottom

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wickerbottom.lua` defines the character prefabs and initialization logic for Wickerbottom, the Bookish Scholar. It extends `MakePlayerCharacter` and configures her unique traits: she refuses spoiled food, gains an innate affinity for `surfnturf`, spawns shadow creatures when reading books while insane, and cannot be knocked out (insomnia). It integrates with core components like `reader`, `eater`, `health`, `hunger`, `sanity`, `builder`, and `foodaffinity` to enforce her gameplay behavior.

## Usage example
This is a prefab definition file, not a reusable component. It is instantiated automatically when Wickerbottom is selected as a player character.

```lua
-- Internally used by the game engine as part of MakePlayerCharacter(...)
-- Modders should not directly instantiate or modify this file.
-- Instead, extend or override via character-specific prefabs or post-init hooks.
return MakePlayerCharacter("wickerbottom", prefabs, assets, common_postinit, master_postinit)
```

## Dependencies & tags
**Components used:** `reader`, `eater`, `foodaffinity`, `health`, `hunger`, `sanity`, `builder`, `grogginess`, `shadowcreaturespawner`  
**Tags added/used:** `insomniac`, `bookbuilder`, `reader`, `nospoiledfood`, `quagmire_foodie` (Quagmire mode), `quagmire_shopper` (Quagmire mode), `shadowcreature`, `_combat`, `locomotor`, `INLIMBO`, `notaunt`

## Properties
No public properties defined in this file.

## Main functions
### `OnReadFn(inst, book)`
* **Description:** Triggered when Wickerbottom reads a book. If she is insane (per `sanity:IsInsane()`), it attempts to spawn a shadow creature if the current count is below `TUNING.BOOK_MAX_SHADOWCREATURES`.
* **Parameters:**  
  `inst` (EntityInstance) – The Wickerbottom character instance.  
  `book` (EntityInstance) – The book being read.  
* **Returns:** Nothing.  
* **Error states:** No direct failure paths; relies on world state (`TheWorld.components.shadowcreaturespawner`) and entity limits.

### `KnockOutTest(inst)`
* **Description:** Override function used by the `grogginess` component to determine whether Wickerbottom can be knocked out. Always returns `false`, enforcing insomnia.
* **Parameters:**  
  `inst` (EntityInstance) – The character instance.  
* **Returns:** `false` (boolean).

### `OnRespawnedFromGhost(inst)`
* **Description:** Callback fired when Wickerbottom respawns from a ghost. Ensures the `grogginess` component continues to disallow knockouts by re-registering `KnockOutTest`.
* **Parameters:**  
  `inst` (EntityInstance) – The respawned character instance.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `ms_respawnedfromghost` – fires `OnRespawnedFromGhost` to reapply insomnia.
- **Pushes:** No events directly; interacts via component callbacks (`reader:SetOnReadFn`, `grogginess:SetKnockOutTest`).