const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

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

  if (index < 0) {
    return response.status(400).json({ message: "Repository is not exists." });    
  }

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

  if (index < 0) {
    return response.status(400).json({ message: "Repository is not exists." });    
  }
    
  repositories.splice(index, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repository => repository.id == id);

  if (index < 0) {
    return response.status(400).json({ message: "Repository is not exists." });    
  }

  const qtdLike = repositories[index].likes;

  repositories[index].likes = qtdLike + 1;

  const repository = repositories[index];

  return response.status(200).json(repository);

  });

module.exports = app;
