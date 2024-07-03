const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const courseRouter = require("./routes/courseRouter");
const roomRouter = require("./routes/roomRouter");
const buildingRouter = require("./routes/buildingRouter");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");  
const { version } = require("./package.json");
const lessonRouter = require("./routes/lessonRouter");

const app = express();
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "REST API Docs",
      version,
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
// mongoose.connect("mongodb://localhost:27017/Login", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
//   useCreateIndex: true,
// });
// mongoose.Promise = global.Promise;
// mongoose.set("useNewUrlParser", true);
// mongoose.set("useFindAndModify", false);
// mongoose.set("useCreateIndex", true);

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error:"));
// db.once("open", function () {
//   console.log("Connected to MongoDB");
// });


app.get("/auth/login", (req, res) => {
  res.status(200).json({
    statusCode: 200,
    message: "Connect Success"
  });
});
app.use("/api", userRouter);
app.use("/api/edu", courseRouter);
app.use("/api/edu", roomRouter);
app.use("/api/edu", buildingRouter);
app.use("/api/edu", lessonRouter);

// Start Server
const PORT = process.env.PORT || 8080;
mongoose
  .connect("mongodb://127.0.0.1:27017/Login")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    throw ("MongoDB connection error: %s \n", err);
  });

