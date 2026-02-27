---
id: preservative
title: Preservative
description: Calculates and applies a fractional food preservation multiplier based on item stack size and a configured percentage increase.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: c61174fc
---

# Preservative

## Overview
The `Preservative` component is a lightweight utility that stores configuration for food preservation behavior—specifically, the percentage increase in spoilage resistance and whether that bonus should be divided by stack size. It does not directly modify spoilage but provides the logic coefficients used by other systems (e.g., when food is preserved in a Preserving Bin or via ingredients like Saltpeter).

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `percent_increase` | `number` | `1` | The base percentage increase to spoilage resistance (e.g., `1` = +100%, `0.5` = +50%). |
| `divide_effect_by_stack_size` | `boolean` | `true` | If `true`, the effective spoilage bonus is reduced proportionally for stacks > 1 item (e.g., `percent_increase / stack_size`). |

## Main Functions
No documented main functions; the component serves only as a data store with no runtime logic methods beyond initialization.

## Events & Listeners
None.