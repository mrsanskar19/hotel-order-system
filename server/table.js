const fs = require('fs');
const path = require('path');

// JSON file location
const TABLE_STATUS_FILE = path.join(__dirname, './data/tableStatus.json');

// Helper: Load current data
const loadTableStatus = () => {
  if (!fs.existsSync(TABLE_STATUS_FILE)) return [];
  const raw = fs.readFileSync(TABLE_STATUS_FILE);
  return JSON.parse(raw);
};

// Helper: Save data
const saveTableStatus = (data) => {
  fs.writeFileSync(TABLE_STATUS_FILE, JSON.stringify(data, null, 2));
};

//
// ✅ Add a table
//
const addTable = (table) => {
  let tables = loadTableStatus();
  tables.push(table);
  saveTableStatus(tables);
  return table;
};

//
// ✅ Get all tables (optionally by hotelId)
//
const getTables = (hotelId = null) => {
  const tables = loadTableStatus();
  return hotelId ? tables.filter(t => t.hotelId === hotelId) : tables;
};

//
// ✅ Remove a specific table by hotelId & tableId
//
const removeTable = (hotelId, tableId) => {
  let tables = loadTableStatus();
  tables = tables.filter(t => !(t.hotelId === hotelId && t.tableId === tableId));
  saveTableStatus(tables);
  return tables;
};

//
// ✅ Update a table (by hotelId & tableId)
//
const updateTable = (hotelId, tableId, updatedData) => {
  let tables = loadTableStatus();
  let updated = false;

  tables = tables.map(table => {
    if (table.hotelId === hotelId && table.tableId === tableId) {
      updated = true;
      return { ...table, ...updatedData };
    }
    return table;
  });

  if (updated) {
    saveTableStatus(tables);
  }

  return updated ? tables : null;
};

//
// ✅ Clear all tables (dangerous)
//
const clearAllTables = () => {
  saveTableStatus([]);
};

// ✅ Update table status by hotelId & tableId
//
const updateTableStatus = (hotelId, tableId, newStatus) => {
  let tables = loadTableStatus();
  let updated = false;

  tables = tables.map(table => {
    if (table.hotelId === hotelId && table.tableId === tableId) {
      updated = true;
      return { ...table,
        status: newStatus
      };
    }
    return table;
  });

  if (updated) {
    saveTableStatus(tables);
  }

  return updated ? tables : null;
};

//
// ✅ Get all orders from a specific table by hotelId & tableId
//
const getTableOrders = (hotelId, tableId) => {
  const tables = loadTableStatus();
  const table = tables.find(t => t.hotelId === hotelId && t.tableId === tableId);
  return table ? table.orders : null;
};


module.exports = {
  addTable,
  getTables,
  removeTable,
  updateTable,
  clearAllTables,
  updateTableStatus,
  getTableOrders,
};
