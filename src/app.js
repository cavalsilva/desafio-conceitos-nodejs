const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

function VerifyRepositoryExists(request, response, next) {
  const { id } = request.params;
  const index = repositories.findIndex(repository => repository.id == id);

  if (index < 0) {
    return response.status(400).json({ message: "Repository is not exists." });    
  }

  return next();

}

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', VerifyRepositoryExists);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.status(201).json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const index = repositories.findIndex(repository => repository.id == id);

  const repository = {
    id,
    title, 
    url, 
    techs,
    likes: repositories[index].likes
  } 

  repositories[index] = repository;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repository => repository.id == id);

  repositories.splice(index, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repository => repository.id == id);

  repositories[index].likes = repositories[index].likes + 1;

  return response.status(200).json(repositories[index]);

  });

module.exports = app;
