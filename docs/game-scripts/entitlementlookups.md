---
id: entitlementlookups
title: Entitlementlookups
description: Maps PlayStation Network (PSN) entitlement codes to corresponding item pack asset names for DLC content unlocks.
tags: [network, entitlement, dlc, psn]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 41f2dc65
system_scope: network
---

# Entitlementlookups

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`ENTITLEMENTLOOKUPS` is a globally defined table that serves as a static lookup mapping PlayStation Network (PSN) entitlement codes (e.g., `"WELCOM"`, `"FANTAS"`) to their corresponding internal asset pack identifiers (e.g., `"pack_boomerang_psn"`). It is used during account entitlement resolution to identify which DLC content packs are unlocked for the player on PSN platforms. This structure is read-only and populated at load time.

## Usage example
```lua
local entitlement_code = "DXWAND"
local pack_name = ENTITLEMENTLOOKUPS.PSN[entitlement_code]
-- pack_name == "pack_wanda_deluxe"
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `PSN` | table | `{}` | A nested table mapping PSN entitlement string codes (e.g., `"WELCOM"`) to pack asset names (e.g., `"pack_wanda_deluxe"`). |

## Main functions
None identified

## Events & listeners
None identified