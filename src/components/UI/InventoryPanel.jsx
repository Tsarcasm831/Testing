import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect } from "react";
import { EquipmentSlot } from "./inventory/EquipmentSlot.jsx";
import { PotionSlot } from "./inventory/PotionSlot.jsx";
import { StorageSlot } from "./inventory/StorageSlot.jsx";
import { ItemTooltip } from "./inventory/ItemTooltip.jsx";
import { DraggedItemCursor } from "./inventory/DraggedItemCursor.jsx";
import { InventoryStats } from "./inventory/InventoryStats.jsx";
const InventoryPanel = ({ inventory, setInventory, onClose }) => {
  const [draggedItemInfo, setDraggedItemInfo] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const handleDragStart = (e, item, source, slot) => {
    setDraggedItemInfo({ item, source, slot });
    e.dataTransfer.effectAllowed = "move";
    const emptyImage = new Image();
    e.dataTransfer.setDragImage(emptyImage, 0, 0);
  };
  const handleDrop = (e, destination, slot) => {
    e.preventDefault();
    if (!draggedItemInfo) return;
    const { item: draggedItem, source: fromSource, slot: fromSlot } = draggedItemInfo;
    const toSource = destination;
    const toSlot = slot;
    if (fromSource === toSource && fromSlot === toSlot) {
      setDraggedItemInfo(null);
      return;
    }
    const newInventory = JSON.parse(JSON.stringify(inventory));
    let itemAtTarget = null;
    if (toSource === "equipment") {
      itemAtTarget = newInventory.equipment[toSlot];
    } else if (toSource === "storage") {
      itemAtTarget = newInventory.storage[toSlot];
    }
    if (fromSource === "equipment") {
      newInventory.equipment[fromSlot] = itemAtTarget;
    } else if (fromSource === "storage") {
      newInventory.storage[fromSlot] = itemAtTarget;
    }
    if (toSource === "equipment") {
      newInventory.equipment[toSlot] = draggedItem;
    } else if (toSource === "storage") {
      newInventory.storage[toSlot] = draggedItem;
    }
    setInventory(newInventory);
    setDraggedItemInfo(null);
  };
  const onItemUse = (potion) => {
    console.log("Using potion:", potion.name);
    const newInventory = JSON.parse(JSON.stringify(inventory));
    const potionIndex = newInventory.potions.findIndex((p) => p.id === potion.id);
    if (potionIndex !== -1) {
      newInventory.potions[potionIndex].count--;
      if (newInventory.potions[potionIndex].count <= 0) {
        newInventory.potions.splice(potionIndex, 1);
      }
      setInventory(newInventory);
    }
  };
  const handleMouseEnter = (item, event) => {
    if (item) {
      setHoveredItem(item);
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        x: rect.right + 10,
        y: rect.top
      });
    }
  };
  const handleMouseLeave = () => {
    setHoveredItem(null);
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm", children: /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: "bg-gradient-to-br from-amber-800 via-amber-900 to-amber-950 border-4 border-yellow-500 rounded-xl shadow-2xl relative overflow-hidden flex flex-col",
      style: { width: "min(1000px, 95vw)", height: "min(750px, 95vh)" },
      children: [
        /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-yellow-300 rounded-tl-lg" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 96,
          columnNumber: 9
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-yellow-300 rounded-tr-lg" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 97,
          columnNumber: 9
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-yellow-300 rounded-bl-lg" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 98,
          columnNumber: 9
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-yellow-300 rounded-br-lg" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 99,
          columnNumber: 9
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center p-6 border-b-2 border-yellow-600 flex-shrink-0", children: [
          /* @__PURE__ */ jsxDEV("h1", { className: "text-3xl font-bold text-yellow-200 font-serif tracking-wider drop-shadow-lg", children: "INVENTORY" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 103,
            columnNumber: 11
          }),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: onClose,
              className: "text-red-400 hover:text-red-300 text-3xl font-bold bg-gray-800 hover:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center border-2 border-red-500 hover:border-red-400 transition-all duration-200",
              children: "\u2715"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 106,
              columnNumber: 11
            }
          )
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 102,
          columnNumber: 9
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "flex p-6 gap-6 flex-1 overflow-y-auto", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "w-80 space-y-6", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-900 bg-opacity-40 border-2 border-yellow-600 rounded-lg p-4", children: [
              /* @__PURE__ */ jsxDEV("h3", { className: "text-yellow-300 font-bold text-lg mb-4 text-center", children: "EQUIPMENT" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 121,
                columnNumber: 15
              }),
              /* @__PURE__ */ jsxDEV("div", { className: "relative h-72", children: [
                /* @__PURE__ */ jsxDEV(
                  EquipmentSlot,
                  {
                    slotName: "helmet",
                    item: inventory.equipment.helmet,
                    position: "absolute top-0 left-1/2 transform -translate-x-1/2",
                    onMouseEnter: handleMouseEnter,
                    onMouseLeave: handleMouseLeave,
                    onDrop: handleDrop,
                    onDragStart: handleDragStart
                  },
                  void 0,
                  false,
                  {
                    fileName: "<stdin>",
                    lineNumber: 125,
                    columnNumber: 17
                  }
                ),
                /* @__PURE__ */ jsxDEV(
                  EquipmentSlot,
                  {
                    slotName: "weapon",
                    item: inventory.equipment.weapon,
                    position: "absolute top-20 left-4",
                    onMouseEnter: handleMouseEnter,
                    onMouseLeave: handleMouseLeave,
                    onDrop: handleDrop,
                    onDragStart: handleDragStart
                  },
                  void 0,
                  false,
                  {
                    fileName: "<stdin>",
                    lineNumber: 131,
                    columnNumber: 17
                  }
                ),
                /* @__PURE__ */ jsxDEV(
                  EquipmentSlot,
                  {
                    slotName: "shield",
                    item: inventory.equipment.shield,
                    position: "absolute top-20 right-4",
                    onMouseEnter: handleMouseEnter,
                    onMouseLeave: handleMouseLeave,
                    onDrop: handleDrop,
                    onDragStart: handleDragStart
                  },
                  void 0,
                  false,
                  {
                    fileName: "<stdin>",
                    lineNumber: 135,
                    columnNumber: 17
                  }
                ),
                /* @__PURE__ */ jsxDEV(
                  EquipmentSlot,
                  {
                    slotName: "armor",
                    item: inventory.equipment.armor,
                    position: "absolute top-20 left-1/2 transform -translate-x-1/2",
                    size: "w-20 h-20",
                    onMouseEnter: handleMouseEnter,
                    onMouseLeave: handleMouseLeave,
                    onDrop: handleDrop,
                    onDragStart: handleDragStart
                  },
                  void 0,
                  false,
                  {
                    fileName: "<stdin>",
                    lineNumber: 141,
                    columnNumber: 17
                  }
                ),
                /* @__PURE__ */ jsxDEV(
                  EquipmentSlot,
                  {
                    slotName: "gloves",
                    item: inventory.equipment.gloves,
                    position: "absolute top-44 left-4",
                    onMouseEnter: handleMouseEnter,
                    onMouseLeave: handleMouseLeave,
                    onDrop: handleDrop,
                    onDragStart: handleDragStart
                  },
                  void 0,
                  false,
                  {
                    fileName: "<stdin>",
                    lineNumber: 147,
                    columnNumber: 17
                  }
                ),
                /* @__PURE__ */ jsxDEV(
                  EquipmentSlot,
                  {
                    slotName: "boots",
                    item: inventory.equipment.boots,
                    position: "absolute top-44 right-4",
                    onMouseEnter: handleMouseEnter,
                    onMouseLeave: handleMouseLeave,
                    onDrop: handleDrop,
                    onDragStart: handleDragStart
                  },
                  void 0,
                  false,
                  {
                    fileName: "<stdin>",
                    lineNumber: 151,
                    columnNumber: 17
                  }
                ),
                /* @__PURE__ */ jsxDEV(
                  EquipmentSlot,
                  {
                    slotName: "ring1",
                    item: inventory.equipment.ring1,
                    position: "absolute top-44 left-20",
                    size: "w-12 h-12",
                    onMouseEnter: handleMouseEnter,
                    onMouseLeave: handleMouseLeave,
                    onDrop: handleDrop,
                    onDragStart: handleDragStart
                  },
                  void 0,
                  false,
                  {
                    fileName: "<stdin>",
                    lineNumber: 157,
                    columnNumber: 17
                  }
                ),
                /* @__PURE__ */ jsxDEV(
                  EquipmentSlot,
                  {
                    slotName: "ring2",
                    item: inventory.equipment.ring2,
                    position: "absolute top-44 right-20",
                    size: "w-12 h-12",
                    onMouseEnter: handleMouseEnter,
                    onMouseLeave: handleMouseLeave,
                    onDrop: handleDrop,
                    onDragStart: handleDragStart
                  },
                  void 0,
                  false,
                  {
                    fileName: "<stdin>",
                    lineNumber: 161,
                    columnNumber: 17
                  }
                ),
                /* @__PURE__ */ jsxDEV(
                  EquipmentSlot,
                  {
                    slotName: "amulet",
                    item: inventory.equipment.amulet,
                    position: "absolute bottom-0 left-1/2 transform -translate-x-1/2",
                    size: "w-14 h-14",
                    onMouseEnter: handleMouseEnter,
                    onMouseLeave: handleMouseLeave,
                    onDrop: handleDrop,
                    onDragStart: handleDragStart
                  },
                  void 0,
                  false,
                  {
                    fileName: "<stdin>",
                    lineNumber: 167,
                    columnNumber: 17
                  }
                )
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 122,
                columnNumber: 15
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 120,
              columnNumber: 13
            }),
            /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-900 bg-opacity-40 border-2 border-yellow-600 rounded-lg p-4", children: [
              /* @__PURE__ */ jsxDEV("h3", { className: "text-yellow-300 font-bold text-lg mb-3 text-center", children: "POTIONS" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 176,
                columnNumber: 15
              }),
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-center gap-2", children: inventory.potions.map((potion, index) => /* @__PURE__ */ jsxDEV(PotionSlot, { potion, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, onItemUse }, potion.id, false, {
                fileName: "<stdin>",
                lineNumber: 179,
                columnNumber: 19
              })) }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 177,
                columnNumber: 15
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 175,
              columnNumber: 13
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 117,
            columnNumber: 11
          }),
          /* @__PURE__ */ jsxDEV("div", { className: "flex-1 bg-gray-900 bg-opacity-40 border-2 border-yellow-600 rounded-lg p-4", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center mb-4", children: [
              /* @__PURE__ */ jsxDEV("h3", { className: "text-yellow-300 font-bold text-lg", children: "STORAGE" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 188,
                columnNumber: 15
              }),
              /* @__PURE__ */ jsxDEV("div", { className: "text-sm text-gray-300", children: [
                inventory.storage.filter((item) => item !== null).length,
                "/",
                inventory.storage.length,
                " slots"
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 189,
                columnNumber: 15
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 187,
              columnNumber: 13
            }),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-8 gap-2 mb-4", style: { height: "380px", alignContent: "start" }, children: inventory.storage.map((item, index) => /* @__PURE__ */ jsxDEV(StorageSlot, { item, index, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, onDrop: handleDrop, onDragStart: handleDragStart }, index, false, {
              fileName: "<stdin>",
              lineNumber: 196,
              columnNumber: 17
            })) }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 194,
              columnNumber: 13
            }),
            /* @__PURE__ */ jsxDEV(InventoryStats, { inventory }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 201,
              columnNumber: 13
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 186,
            columnNumber: 11
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 114,
          columnNumber: 9
        }),
        hoveredItem && /* @__PURE__ */ jsxDEV(ItemTooltip, { item: hoveredItem, position: tooltipPosition }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 206,
          columnNumber: 25
        }),
        draggedItemInfo && /* @__PURE__ */ jsxDEV(DraggedItemCursor, { item: draggedItemInfo.item }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 209,
          columnNumber: 29
        })
      ]
    },
    void 0,
    true,
    {
      fileName: "<stdin>",
      lineNumber: 92,
      columnNumber: 7
    }
  ) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 91,
    columnNumber: 5
  });
};
var stdin_default = InventoryPanel;
export {
  InventoryPanel,
  stdin_default as default
};
