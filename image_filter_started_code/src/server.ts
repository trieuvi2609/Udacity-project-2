import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";
import { Request, Response } from "express";

(async () => {
  // Init the Express application
  const app = express(); // Set the network port

  const port = process.env.PORT || 8082; // Use the body parser middleware for post requests

  app.use(bodyParser.json());

  app.get("/filteredimage/", async (req: Request, res: Response) => {
    const { image_url }: { image_url: string } = req.query;
    if (!image_url) {
      return res.status(422).send("Image URL need to be required");
    }
    filterImageFromURL(image_url)
      .then((imgResult) => {
        res.status(200).send("Filter image successfully");
        res.sendFile(imgResult);
        res.on("finish", () => deleteLocalFiles([imgResult]));
      })
      .catch((error) => res.status(422).send(error));
  });

  app.get("/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}");
  }); // Start the Server

  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
