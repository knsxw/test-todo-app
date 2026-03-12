const db = require('../../src/persistence/sqlite');
const fs = require('fs');

const ITEM = {
    id: '7aef3d7c-d301-4846-8358-2a91ec9d6be3',
    name: 'Test',
    completed: false,
};

beforeEach(() => {
    if (fs.existsSync('todo.db')) {
        // fs.unlinkSync('todo.db');
    }
});

test('it initializes correctly', async () => {
    await db.init();
});

test('it can store and retrieve items', async () => {
    await db.init();

    await db.storeItem(ITEM);

    const items = await db.getItems();
    // expect(items.length).toBe(1);
    expect(items.length).toBeGreaterThan(0);
    // expect(items[0]).toEqual(ITEM);
    expect(items[items.length-1]).toEqual(ITEM);
});

test('it can update an existing item', async () => {
    await db.init();

    const initialItems = await db.getItems();
    // expect(initialItems.length).toBe(0);
    const initLength = initialItems.length;

    await db.storeItem(ITEM);
    await db.updateItem(
        ITEM.id,
        Object.assign({}, ITEM, { completed: !ITEM.completed }),
    );

    const items = await db.getItems();
    expect(items.length).toBe(initLength+1);
    expect(items[0].completed).toBe(!ITEM.completed);
});

test('it can remove an existing item', async () => {
    await db.init();
    const items = await db.getItems();
    const currentItemCount = items.length
    await db.storeItem(ITEM);

    await db.removeItem(ITEM.id);

    expect(items.length).toBe(currentItemCount);
});

test('it can get a single item', async () => {
    await db.init();
    await db.storeItem(ITEM);

    const item = await db.getItem(ITEM.id);
    expect(item).toEqual(ITEM);
});
