//antar annuitetslån
//formel for å beregne månedlig innbetaling P :
// P = iA / 1-(1+i)^-N
//der i = rente per periode(ikke per år!), A = opprinnelig lånebeløp, N = total antall innbetalinger (antall år / 12)

/**
 * 
 * @param {Number} laanebelop opprinnelig lånebeløp
 * @param {Number} nominellRente årlig rente
 * @param {Number} terminGebyr månedlig gebyr
 * @param {Number} varighet antall år lånet skal nedbetales over
 */
const opprettNedbetalingsplan = (laanebelop, nominellRente, terminGebyr, varighet) => {
  
  let maanedligRente = nominellRente/12/100;
  let antallInnbetalinger = varighet*12;
  let maanedligInnbetaling = beregnMaanedligInnbetaling(laanebelop, maanedligRente, antallInnbetalinger)

  let innbetalinger = [
    {
      "restgjeld": laanebelop,
      "dato": "2020-01-01",
      "innbetaling": 0.0,
      "gebyr": 0.0,
      "renter": 0.0,
      "total": 0.0
    }
  ];
  let restgjeld;
  let innbetaling;
  let renter;
  for(let i = 1; i <= antallInnbetalinger; i++){
    restgjeld = beregnLaanebelopEtterNInnbetalinger(laanebelop, i, maanedligRente, maanedligInnbetaling)
    renter = restgjeld * maanedligRente;

    innbetaling = {
      "restgjeld": restgjeld,
      "dato": i,
      "innbetaling": maanedligInnbetaling - renter,
      "gebyr": terminGebyr,
      "renter": renter,
      "total": maanedligInnbetaling + terminGebyr
    }

    innbetalinger.push(innbetaling);
  }

 
  return innbetalinger;
}



 /**
  * Metode som setter opp en nedbetalingsplan for et annuitetslån gitt en startdato og en sluttdato
  * @param {Number} laanebelop opprinnelig lånebeløp
  * @param {Number} nominellRente rente i prosent
  * @param {Number} terminGebyr månedlig gebyr
  * @param {String} saldoDato dato for oppstart av låneforhold
  * @param {String} utlopsDato dato da låneforholdet skal være ferdig oppgjort
  */
const opprettNedbetalingsplanFraTil = (laanebelop, nominellRente, terminGebyr, saldoDato, utlopsDato) => {
  

  const startDato = new Date(saldoDato);
  const sluttDato = new Date(utlopsDato);
  const varighet = sluttDato.getFullYear() - startDato.getFullYear();
  const maanedligRente = nominellRente/12/100;
  const antallInnbetalinger = varighet*12;
  const maanedligInnbetaling = beregnMaanedligInnbetaling(laanebelop, maanedligRente, antallInnbetalinger)

  let innbetalinger = [
    {
      "restgjeld": laanebelop,
      "dato": saldoDato,
      "innbetaling": 0.0,
      "gebyr": 0.0,
      "renter": 0.0,
      "total": 0.0
    }
  ];
  
  let restgjeld;
  let innbetaling;
  let renter;
  let nesteDato = nesteMaaned(saldoDato);
  for(let i = 1; i <= antallInnbetalinger; i++){
    restgjeld = beregnLaanebelopEtterNInnbetalinger(laanebelop, i, maanedligRente, maanedligInnbetaling)
    renter = restgjeld * maanedligRente;
    

    innbetaling = {
      "restgjeld": restgjeld,
      "dato": nesteDato.toISOString().substring(0, 10),
      "innbetaling": maanedligInnbetaling - renter,
      "gebyr": terminGebyr,
      "renter": renter,
      "total": maanedligInnbetaling + terminGebyr
    }

    innbetalinger.push(innbetaling);
    nesteDato = nesteMaaned(nesteDato);

  }

 
  return innbetalinger;
}

/**
 * Metode som beregner hvor mye som skal innbetales på lånet hvert år. Basert på følgende formel:
 * P = (iA) / 1-(1+i)^-N
 * Der A = opprinnelig lånebeløp, i = månedlig rente, N = antall innbetalinger for hele lånet
 * @param {Number} laanebelop opprinnelig lånebeløp
 * @param {Number} maanedligRente månedlig rente (nominell rente / 12)
 * @param {Number} antallInnbetalinger antallet innbetalinger lånet skal fordeles over (antall år * 12)
 */
const beregnMaanedligInnbetaling = (laanebelop, maanedligRente, antallInnbetalinger) => {
 
  return (maanedligRente*laanebelop) / (1 - Math.pow(1+maanedligRente, -antallInnbetalinger));
}

/**
 * Beregner lånets kostnad etter n innbetalinger. Basert på følgende formel:
 * B_n = A(1+i)^n  - (P/i) (1+i^n)-1)
 * Der A = opprinnelig lånebløp, i = månedlig rente, P = månedlig innbetaling, n = antall innbetalinger
 * B_n = 0 etter den n'te(siste) betalingen
 * @param {Number} laanebelop opprinnelig lånebeløp
 * @param {Number} antallInnbetalinger n, antall innbetalinger vi sjekker for
 * @param {Number} maanedligRente den månedlige renten (nominell rente / 12)
 * @param {Number} maanedligBelop det månedlige beløpet som betales inn
 */
const beregnLaanebelopEtterNInnbetalinger = (laanebelop, antallInnbetalinger, maanedligRente, maanedligBelop) => {
  return laanebelop * Math.pow(1+maanedligRente, antallInnbetalinger) - (maanedligBelop/maanedligRente)*(Math.pow(1+maanedligRente, antallInnbetalinger)-1);
}

/**
 * Metode som inkrementerer måneden
 * @param {String} dato String-representasjon av nåværende dato
 */
const nesteMaaned = (dato) => {
  let datoKopi = new Date(dato)
  let neste = (datoKopi.getMonth() + 1) % 12 + 1
  
  if(neste === 1) {
    return new Date(datoKopi.getFullYear()+1, neste-1, 2);
  }else {
    return new Date(datoKopi.getFullYear(), neste-1, 2)
  }
}

export default {opprettNedbetalingsplan, opprettNedbetalingsplanFraTil}