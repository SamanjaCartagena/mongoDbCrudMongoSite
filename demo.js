const {MongoClient} = require('mongodb');
async function main(){
    const uri="mongodb+srv://samanja:root@cluster0.7xfdx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


    const client = new MongoClient(uri);

    try{
    await client.connect();
       
    await createMultipleListings (client,[
        {
            name:"Infinite Views",
            summary:"Modern home withb infinite pool",
            property_type:"house",
            bedrooms:5,
            bathrooms:4.5
        },
        {
            name:'Private room in London',
            summary:'beautifully furnished',
            property_type:'apartment',
            bathroom:1
        }
    ]);
   
    }catch(e){
        console.error(e);
    }
    finally{
        await client.close();

    }
}
main().catch(console.error);

async function createMultipleListings(client, newListings){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews")
    .insertMany(newListings);

    console.log(`${result.insertedCount} new listings created with the following ids: `);
    console.log(result.insertedIds);

}
async function createListing(client, newListing){
  const result = await client.db("sample_airbnb").collection("listingsAndReviews")
    .insertOne(newListing);

    console.log(`New listing created with the following id: ${result.insertedId}`);
}

async function listDatabases(client){
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases: ");
    databasesList.databases.forEach(db =>{
        console.log(`-${db.name}`);
    })
}