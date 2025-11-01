const unknownEndpoint = (request: any, response: any) => {
  response.status(404).send({ error: "unknown endpoint" });
};

export default unknownEndpoint;