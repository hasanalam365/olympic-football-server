
// const express = require('express');
// const app = express();
// const cors = require('cors');
// const jwt = require('jsonwebtoken');
// require('dotenv').config();
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const { default: Stripe } = require('stripe');
// const crypto = require("crypto");


// const port = process.env.PORT || 5000;

// // middleware
// app.use(express.json());
// app.use(cors({
//   origin: ['http://localhost:5173', 'https://arabian-essense.vercel.app']
// }));

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.exdb7cl.mongodb.net/?appName=Cluster0`;

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// // verify token middleware
// const verifyToken = async (req, res, next) => {
//   if (!req.headers.authorization) {
//     return res.status(401).send({ message: 'unauthorized access' });
//   }

//   const token = req.headers.authorization.split(' ')[1];

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).send({ message: 'unauthorized access' });
//     }
//     req.decoded = decoded;
//     next();
//   });
// };

// async function run() {
//   try {
//     const productsCollection=client.db('Arabian-Essense').collection('Products')
//     const ordersCollection = client.db('Arabian-Essense').collection('Orders');
//     const usersCollection = client.db('Arabian-Essense').collection('Users');
    
//     const freeSampleCollection = client.db('Arabian-Essense').collection('FreeSampleRequests');

//     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//     // verify admin
//     const verifyAdmin = async (req, res, next) => {
//       const email = req.decoded.email;
//       const user = await usersCollection.findOne({ email });

//       if (user?.role !== 'admin') {
//         return res.status(403).send({ message: 'forbidden access' });
//       }
//       next();
//     };

//     // JWT
//     app.post('/jwt', async (req, res) => {
//       const token = jwt.sign(req.body, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
//       res.send({ token });
//     });


//          //check admin role
//         app.get('/users/admin/:email', verifyToken, async (req, res) => {
//             const email = req.params.email
//             if (email !== req.decoded.email) {
//                 return res.status(403).send({ message: 'forbidden access' })
//             }
//             const query = { email: email }
//             const user = await usersCollection.findOne(query)

//             let admin = false
//             if (user) {
//                 admin = user?.role === 'admin'
//             }
//             res.send({ admin })
//         })


//     // CREATE OR UPDATE USER
//     app.put('/userCreate/:email', async (req, res) => {
//       const userInfo = req.body;
//       const email = req.params.email;

//       const filter = { email };
//       const options = { upsert: true };
//       const updatedDoc = {
//         $set: {
//           name: userInfo.name,
//           email: userInfo.email,
//           phone:userInfo.phone,
//           photoURL: userInfo.photoURL,
//           status: userInfo.status,
//           role: userInfo.role
//         }
//       };

//       const result = await usersCollection.updateOne(filter, updatedDoc, options);
//       res.send(result);
//     });




// /* GET USER PROFILE */
// app.get("/users/profile", async (req, res) => {
//   const email = req.query.email;

//   if (!email) {
//     return res.status(400).send({ message: "Email is required" });
//   }

//   const user = await usersCollection.findOne({ email });

//   if (!user) {
//     return res.status(404).send({ message: "User not found" });
//   }

//   res.send(user);
// });

// // UPDATE USER PROFILE
// app.patch("/users/profile", async (req, res) => {
//   const { email, name, phone, photoURL } = req.body;

//   if (!email) {
//     return res.status(400).send({ message: "Email is required" });
//   }

//   const updateDoc = {
//     $set: {
//       name,
//       phone,
//       photoURL,
//     },
//   };

//   const result = await usersCollection.updateOne(
//     { email },
//     updateDoc
//   );

//   res.send(result);
// });



// // Assume verifyToken and verifyAdmin middleware are already defined
// app.patch("/user/role/:id", verifyToken, verifyAdmin, async (req, res) => {
//   try {
//     const id = req.params.id;
//     const { role } = req.body;

    

//     const result = await usersCollection.updateOne(
//       { _id: new ObjectId(id) },
//       { $set: { role: role } }
//     );

//     if (result.modifiedCount === 1) {
//       res.send({ success: true, message: `User role updated to ${role}` });
//     } else {
//       res.status(404).send({ success: false, message: "User not found" });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ success: false, message: "Server error" });
//   }
// });

// app.delete("/users/:id", verifyToken, verifyAdmin, async (req, res) => {
//   const id = req.params.id;

//   const result = await usersCollection.deleteOne({
//     _id: new ObjectId(id),
//   });

//   res.send(result);
// });


// // all products
// // GET all products
// app.get("/products", async (req, res) => {
//   const products = await productsCollection.find().toArray();
//   res.send(products);
// });



// app.get("/allProducts",verifyToken,verifyAdmin, async (req, res) => {
//   const page = Math.max(parseInt(req.query.page) || 1, 1);
//   const limit = Math.max(parseInt(req.query.limit) || 10, 1);

//   const skip = (page - 1) * limit;

//   const totalProducts = await productsCollection.countDocuments();

//   const products = await productsCollection
//     .find()
//     .skip(skip)
//     .limit(limit)
//     .toArray();

//   res.send({
//     products,
//     totalPages: Math.ceil(totalProducts / limit),
//     currentPage: page,
//     totalProducts,
//   });
// });


// app.get("/products/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const product = await productsCollection.findOne({ _id: new ObjectId(id) });
//     if (!product) return res.status(404).send({ message: "Product not found" });
//     res.send(product);
//   } catch (error) {
//     res.status(500).send({ message: "Server error", error });
//   }
// });

// // ADD PRODUCT (POST)
// app.post("/products", async (req, res) => {
//   try {
//     const {
//       title,
//       category,
//       price,
//       size,
//       description,
//       imgUrl,
//       featured,
//     } = req.body;

    
//     if (
//       !title ||
//       !category ||
//       !price ||
//       !size ||
//       !description ||
//       !imgUrl
//     ) {
//       return res.status(400).send({
//         success: false,
//         message: "All required fields must be provided",
//       });
//     }

//     const newProduct = {
//       title,
//       category,
//       price,         
//       size,
//       description,
//       imgUrl,
//       featured: featured || false,
//       createdAt: new Date(),
//     };

//     const result = await productsCollection.insertOne(newProduct);

//     res.status(201).send({
//       success: true,
//       message: "Product added successfully",
//       insertedId: result.insertedId,
//     });
//   } catch (error) {
//     console.error("Add product error:", error);
//     res.status(500).send({
//       success: false,
//       message: "Failed to add product",
//     });
//   }
// });


// app.delete("/product/:id", verifyToken, verifyAdmin, async (req, res) => {
//   const id = req.params.id;

//   const result = await productsCollection.deleteOne({
//     _id: new ObjectId(id),
//   });

//   res.send(result);
// });



//     // PAYMENT
//     app.post('/create-payment-intent', async (req, res) => {
//       try {
//         const { amount } = req.body;
//         const paymentIntent = await stripe.paymentIntents.create({
//           amount: parseInt(amount * 100),
//           currency: 'usd',
//           payment_method_types: ['card']
//         });

//         res.send({ clientSecret: paymentIntent.client_secret });
//       } catch (error) {
//         res.status(500).send({ error: error.message });
//       }
//     });

//     // ORDER
//  app.get("/order/:email", verifyToken, async (req, res) => {
//   try {
//     const email = req.params.email;

//     // 🔐 security check
//     if (req.decoded.email !== email) {
//       return res.status(403).send({ message: "Forbidden access" });
//     }

//     const orders = await ordersCollection
//       .find({ email })
//       .sort({ createdAt: -1 }) // recent first
//       .toArray();

//     res.send(orders);
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// });

// // Get all recent orders (Admin)
// app.get("/admin/orders/recent", verifyToken, verifyAdmin, async (req, res) => {
//   try {
//     const search = req.query.search || "";

//     // Query for all users, optional email search
//     const query = search
//       ? { email: { $regex: search, $options: "i" } }
//       : {};

//     const orders = await ordersCollection
//       .find(query)
//       .sort({ createdAt: -1 }) // recent first
//       .limit(10)
//       .toArray();

//     res.send(orders);
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// });

// app.post('/order', async (req, res) => {
//   try {
//     const orderData = req.body;

//     const orderId =
//       "ORD-" +
//       Date.now() +
//       "-" +
//       crypto.randomBytes(3).toString("hex");

//     const finalOrder = {
//       ...orderData,
//       orderId,

      
//       status: [
//         {
//           step: "pending",
//           date: new Date()
//         }
//       ],

//       createdAt: new Date()
//     };

//     const result = await ordersCollection.insertOne(finalOrder);

//     res.send({
//       success: true,
//       orderId,
//       insertedId: result.insertedId
//     });

//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: error.message
//     });
//   }
// });

// app.post("/order/:id/confirm", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const result = await ordersCollection.updateOne(
//       { _id: new ObjectId(id) },
//       {
//         $push: {
//           status: {
//             step: "confirmed",
//             date: new Date(),
//           },
//         },
//       }
//     );

//     res.send({
//       success: true,
//       message: "Order confirmed",
//     });
//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: error.message,
//     });
//   }
// });



//     app.get('/order/:email',verifyToken,async(req,res)=>{
//       const email= req.params.email;
//       if(email !== req.decoded.email){
//         return res.status(403).send({message: 'forbidden access'})
//       }
//       const result= await ordersCollection.find({email:email}).toArray()
//       res.send(result)
//     })



//     // allPending orders
//     // GET all pending orders with pagination & search
// app.get('/orders', verifyToken, verifyAdmin, async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const search = req.query.search || '';

//   const skip = (page - 1) * limit;

//   const query = {
//     // ✅ last status step must be "pending"
//     $expr: {
//       $eq: [
//         { $arrayElemAt: ["$status.step", -1] },
//         "pending"
//       ]
//     },

//     ...(search && {
//       email: {
//         $regex: search,
//         $options: 'i'
//       }
//     })
//   };

//   const orders = await ordersCollection
//     .find(query)
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit)
//     .toArray();

//   const total = await ordersCollection.countDocuments(query);

//   res.send({
//     orders,
//     total,
//     totalPages: Math.ceil(total / limit),
//     currentPage: page,
//   });
// });

// app.get('/confirmOrders', verifyToken, verifyAdmin, async (req, res) => {
//   const orders = await ordersCollection.find({
//     $expr: {
//       $in: [
//         { $arrayElemAt: ["$status.step", -1] },
//         ["confirmed", "packaged", "on_the_way", "delivered"]
//       ]
//     }
//   })
//   .sort({ createdAt: -1 })
//   .toArray();

//   res.send(orders);
// });

// app.patch('/orders/:id/status', verifyToken, verifyAdmin, async (req, res) => {
//   const { step } = req.body;
//   const { id } = req.params;

//   const result = await ordersCollection.updateOne(
//     { _id: new ObjectId(id) },
//     {
//       $push: {
//         status: {
//           step,
//           date: new Date()
//         }
//       }
//     }
//   );

//   res.send({ success: true, result });
// });


// app.get("/orders/:id", verifyToken,verifyAdmin, async (req, res) => {
//   const id = req.params.id;
//   const order = await ordersCollection.findOne({ _id: new ObjectId(id) });
//   res.send(order);
// });

// // order status update
// app.patch("/orders/:id/status",verifyToken,verifyAdmin, async (req, res) => {
//   const id = req.params.id;
//   const { status } = req.body;

//   const result = await ordersCollection.updateOne(
//     { _id: new ObjectId(id) },
//     {
//       $set: { status },
//       $push: {
//         orderTimeline: {
//           status,
//           time: new Date(),
//         },
//       },
//     }
//   );

//   res.send(result);
// });

// app.patch("/orders/:id/products",verifyToken,verifyAdmin, async (req, res) => {
//   const id = req.params.id;
//   const { products } = req.body; // updated products array

//   const result = await ordersCollection.updateOne(
//     { _id: new ObjectId(id) },
//     {
//       $set: {
//         "orderData.products": products,
//       },
//     }
//   );

//   res.send(result);
// });


// // confirm all orders api
// // get all confirm orders
// app.get("/confirmOrders", verifyToken, verifyAdmin, async (req, res) => {
//   const result = await ordersCollection.find().sort({ _id: -1 }).toArray();
//   res.send(result);
// });


// app.get("/confirmOrder-details/:id", verifyToken, verifyAdmin, async (req, res) => {
//   const { id } = req.params;

//   const order = await ordersCollection.findOne({
//     _id: new ObjectId(id),
//   });

//   if (!order) {
//     return res.status(404).send({ message: "Order not found" });
//   }

//   res.send(order);
// });



// app.patch("/confirmOrders/cancel/:id", verifyToken, verifyAdmin, async (req, res) => {
//   const result = await ordersCollection.updateOne(
//     { _id: new ObjectId(req.params.id) },
//     {
//       $push: {
//         status: {
//           step: "cancelled",
//           time: new Date(),
//         },
//       },
//     }
//   );

//   res.send(result);
// });

// app.delete("/confirmOrders/:id", verifyToken, verifyAdmin, async (req, res) => {
//   const result = await ordersCollection.deleteOne({
//     _id: new ObjectId(req.params.id),
//   });
//   res.send(result);
// });




//     // GET ALL USERS
//     app.get('/users',verifyToken,verifyAdmin,  async (req, res) => {
//       const result = await usersCollection.find().toArray();
//       res.send(result);
//     });


//     //  sampe request API
//     // Free Sample Request API
// app.get('/freeSampleRequest/:email', verifyToken, async (req, res) => {
//   const email = req.params.email;

//   const result = await freeSampleCollection
//     .find({ "shippingInfo.email": email })
//     .toArray();

   
//   res.send(result);
// });

// app.get("/admin/sampleRequests", verifyToken, verifyAdmin, async (req, res) => {
//   const result = await freeSampleCollection.find().sort({ _id: -1 }).toArray();
//   res.send(result);
// });

// // get single api from admin show details
// app.get("/admin/sampleRequests/:id", verifyToken, verifyAdmin, async (req, res) => {
//   const id = new ObjectId(req.params.id);
//   const result = await freeSampleCollection.findOne({ _id: id });
//   res.send(result);
// });


// // status change
// app.patch("/admin/sampleRequests/:id/status", verifyToken, verifyAdmin, async (req, res) => {
//   const id = new ObjectId(req.params.id);
//   const { step } = req.body;

//   const update = {
//     $push: {
//       status: {
//         step,
//         createdAt: new Date(),
//       },
//     },
//   };

//   const result = await freeSampleCollection.updateOne({ _id: id }, update);
//   res.send(result);
// });

// app.patch("/admin/sampleRequests/:id/cancel", verifyToken,verifyAdmin, async (req, res) => {
//   const id = new ObjectId(req.params.id);

//   const result = await freeSampleCollection.updateOne(
//     { _id: id },
//     {
//       $push: {
//         status: { step: "cancelled", createdAt: new Date() },
//       },
//     }
//   );

//   res.send(result);
// });

// app.delete("/admin/sampleRequests/:id", verifyToken,verifyAdmin, async (req, res) => {
//   const id = new ObjectId(req.params.id);
//   const result = await freeSampleCollection.deleteOne({ _id: id });
//   res.send(result);
// });


// app.post("/freeSampleRequest", async (req, res) => {
//   try {
//     const sampleData = req.body;

//     const requestId =
//       "FS-" +
//       Date.now() +
//       "-" +
//       crypto.randomBytes(3).toString("hex");

//     const finalSampleRequest = {
//       ...sampleData,
//       requestId,

//       status: [
//         {
//           step: "pending",
//           date: new Date(),
//         },
//       ],

//       createdAt: new Date(),
//     };

//     const result = await freeSampleCollection.insertOne(finalSampleRequest);

//     res.send({
//       success: true,
//       requestId,
//       insertedId: result.insertedId,
//     });
//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: error.message,
//     });
//   }
// });



//     console.log("Connected to MongoDB!");

//   } finally {}
// }
// run().catch(console.dir);

// app.get('/', (req, res) => {
//   res.send('Arabian Essense Server is Working');
// });

// app.listen(port, () => {
//   console.log(`this server is running on port ${port}`);
// });
