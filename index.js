import express from "express";
import nedbetalingsKalkulator from "./js/nedbetalingsKalkulator";

const app = express();

app.use(express.json());

const requestLogger = (request, response, next) => {
  console.log(`Method: ${request.method}`);
  console.log(`Path: ${request.path}`);
  console.log(`Body: ${JSON.stringify(request.body)}`);
  console.log(`---`);
  next();
};

app.use(requestLogger);

/**
 * GET-REQUEST
 */
app.get("/", (request, response) => {
  response.send("<h1> Hei Stacc, jeg heter Espen Norvang! </h1>");
});

/**
 * GET-REQUEST
 */
app.get("/api/nedbetalingsplan", (request, response) => {
  response.send("<h1> Dette kan bli en bra nedbetalingsplan! </h1>");
});

/**
 * POST-REQUEST
 * Oppretter en nedbetalingsplan basert på et lånebeløp, rente, termingebyr og varighet
 */
app.post("/api/nedbetalingsplan", (request, response) => {
  const body = request.body;
  //kanskje legge på litt bedre tilbakemeldinger her...
  if(body.laanebelop === undefined || body.nominellRente === undefined || body.terminGebyr === undefined || body.varighet === undefined) {
    return response.status(400).json({error: "Husk å fylle inn all data..."})
  }
  
  const plan = nedbetalingsKalkulator.opprettNedbetalingsplan(body.laanebelop, body.nominellRente, body.terminGebyr, body.varighet);

  response.json(plan);
})

/**
 *   Oppretter en nedbetalingsplan basert på et lånebeløp, rente, termingebyr, saldoato og sluttdato
 */
app.post("/api/nedbetalingsplanFraTil", (request, response) => {
  const body = request.body;
  if(body.laanebelop === undefined || body.nominellRente === undefined || body.terminGebyr === undefined || body.saldoDato === undefined || body.utlopsDato === undefined) {
    return response.status(400).json({error: "Husk å fylle inn all data..."})
  }
  const plan = nedbetalingsKalkulator.opprettNedbetalingsplanFraTil(body.laanebelop, body.nominellRente, body.terminGebyr, body.saldoDato, body.utlopsDato);

  response.json(plan);
})

/**
 * Håndterer forsøk på tilgang til ukjente endepunkter.
 * @param {HTTPRequest} request 
 * @param {HTTPResponse} response 
 */
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});