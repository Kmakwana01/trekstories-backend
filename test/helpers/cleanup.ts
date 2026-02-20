import { Connection } from 'mongoose';

export async function clearTestData(connection: Connection) {
    if (!connection.db) return;
    const collections = await connection.db.listCollections().toArray();

    const UNIFIED_EMAILS = ['admin@e2e.com', 'customer@e2e.com'];

    for (const collection of collections)
    {
        if (collection.name === 'users')
        {
            // Delete all users EXCEPT the two unified ones
            await connection.collection('users').deleteMany({
                email: { $nin: UNIFIED_EMAILS }
            });
        }
        else
        {
            await connection.collection(collection.name).deleteMany({});
        }
    }
}
