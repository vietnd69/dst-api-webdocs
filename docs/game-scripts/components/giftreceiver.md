---
id: giftreceiver
title: Giftreceiver
description: Manages the receiver side of gift items, tracking gift count and coordinating with gift machines.
tags: [inventory, networking, player]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: fc384c8b
system_scope: inventory
---

# Giftreceiver

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`GiftReceiver` tracks the number of gifts available for a player and manages interactions with a connected `giftmachine` component. It is attached to player entities and synchronizes gift data across the client-server boundary. It coordinates opening gifts via the `ms_opengift` event and notifies the gift machine when gifts are added, removed, or in use.

## Usage example
```lua
local inst = TheSim:FindEntityByRef("player")
if inst and inst:HasTag("player") then
    inst:AddComponent("giftreceiver")
    inst.components.giftreceiver:SetGiftMachine(giftmachine_entity)
    inst.components.giftreceiver:OpenNextGift()
end
```

## Dependencies & tags
**Components used:** `player_classified`, `giftmachine`
**Tags:** Checks `player`; listens to `ms_closepopup`, `ms_updategiftitems`, `ms_opengift`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `giftcount` | number | `0` | Number of gifts currently available to the player. |
| `giftmachine` | `Entity` or `nil` | `nil` | Reference to the associated gift machine entity, if any. |

## Main functions
### `HasGift()`
* **Description:** Checks if the player has any gifts available.
* **Parameters:** None.
* **Returns:** `true` if `giftcount > 0`, otherwise `false`.

### `RefreshGiftCount()`
* **Description:** Updates the local `giftcount` from the server via `TheInventory:GetClientGiftCount(userid)` and synchronizes with the gift machine (if present).
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Performs no action if the new count matches the current `giftcount`.

### `SetGiftMachine(inst)`
* **Description:** Sets or updates the entity acting as the gift machine for this receiver. Automatically notifies the old and new machines of presence changes.
* **Parameters:** `inst` (`Entity` or `nil`) — the new gift machine entity, or `nil` to disconnect.
* **Returns:** Nothing.
* **Error states:** If the machine is set to `nil`, `OnStopOpenGift()` is called to ensure any open popup is dismissed.

### `OpenNextGift()`
* **Description:** Initiates the gift opening process if gifts are available and a gift machine is connected.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No effect unless both `giftcount > 0` and `giftmachine ~= nil`.

### `OnStartOpenGift()`
* **Description:** Notifies the gift machine that a gift is being opened.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnStopOpenGift(usewardrobe)`
* **Description:** Marks the gift opening as complete and optionally opens the wardrobe if `usewardrobe` is `true`.
* **Parameters:** `usewardrobe` (`boolean`) — whether the wardrobe UI should be opened after opening the gift.
* **Returns:** Nothing.
* **Error states:** If `usewardrobe` is `false` or `nil`, no wardrobe action is taken.

## Events & listeners
- **Listens to:**  
  - `ms_updategiftitems` — triggers `RefreshGiftCount()`.  
  - `ms_closepopup` — checks for `POPUPS.GIFTITEM` and calls `OnStopOpenGift()` with the popup's first argument.
- **Pushes:**  
  - `ms_opengift` — sent when `OpenNextGift()` is called.  
  - `ms_doneopengift` — sent when `OnStopOpenGift()` is called, optionally with `{ wardrobe = self.giftmachine }`.  
  - `ms_addgiftreceiver`, `ms_removegiftreceiver` — sent to the `giftmachine` component when the receiver's presence changes.
