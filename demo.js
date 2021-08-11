const {MongoClient} = require('mongodb');
async function main(){
    const uri="mongodb+srv://samanja:root@cluster0.7xfdx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


    const client = new MongoClient(uri);

    try{
    await client.connect();
     //create from CRUD  
    /**await createMultipleListings (client,[
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
    ]); **/
    //read from CRUD
   // await findOneListingByName(client,"Infinite Views");
   await findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client,{
       minimumNumberOfBedrooms:1,
       minimumNumberOfBathrooms:1,
       maximumNumberOfResults:5
    })
    }catch(e){
        console.error(e);
    }
    finally{
        await client.close();

    }
}
main().catch(console.error);
async function findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client,{
    minimumNumberOfBedrooms=0,
    minimumNumberOfBathrooms=0,
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER

}={}){
 const cursor= client.db("sample_airbnb").collection("listingsAndReviews").find({
       bedrooms:{$gte:minimumNumberOfBedrooms},
       bathrooms:{$gte:minimumNumberOfBathrooms}
   }).sort({last_review:-1})
   .limit(maximumNumberOfResults);

   const results = await cursor.toArray();
   if(results.length >0){
       console.log(`Found listings with at least ${minimumNumberOfBedrooms}
       bedrooms and ${minimumNumberOfBathrooms} bathrooms`);
   }

}

async function findOneListingByName(client, nameOfListing){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({name:nameOfListing});

    if(result){
        console.log(`Found a listing in the collection with the name '${nameOfListing}' `);
        console.log(result);
    }
    else {
        console.log(`No listings found with the name '${nameOfListing}`);
    }
}

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