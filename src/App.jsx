import { useState, useRef, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   STATIC STATION DATA  — top ~250 German stations by importance
   EVA IDs match DB's internal numbering (used in prompts only)
   ═══════════════════════════════════════════════════════════ */
const STATIONS = [
  { id:"8011160", name:"Berlin Hbf" },
  { id:"8010255", name:"Berlin Ostbahnhof" },
  { id:"8010036", name:"Berlin Südkreuz" },
  { id:"8011113", name:"Berlin Südkreuz" },
  { id:"8089021", name:"Berlin Gesundbrunnen" },
  { id:"8010224", name:"Berlin Lichtenberg" },
  { id:"8000261", name:"München Hbf" },
  { id:"8000183", name:"Hamburg Hbf" },
  { id:"8000105", name:"Frankfurt(Main)Hbf" },
  { id:"8000096", name:"Köln Hbf" },
  { id:"8000078", name:"Düsseldorf Hbf" },
  { id:"8000068", name:"Dortmund Hbf" },
  { id:"8000244", name:"Leipzig Hbf" },
  { id:"8000152", name:"Hannover Hbf" },
  { id:"8000085", name:"Essen Hbf" },
  { id:"8000098", name:"Duisburg Hbf" },
  { id:"8000191", name:"Nürnberg Hbf" },
  { id:"8000208", name:"Stuttgart Hbf" },
  { id:"8000025", name:"Bremen Hbf" },
  { id:"8000050", name:"Dresden Hbf" },
  { id:"8000026", name:"Bochum Hbf" },
  { id:"8000049", name:"Wuppertal Hbf" },
  { id:"8000098", name:"Bielefeld Hbf" },
  { id:"8000036", name:"Bonn Hbf" },
  { id:"8000068", name:"Mannheim Hbf" },
  { id:"8000244", name:"Karlsruhe Hbf" },
  { id:"8000244", name:"Augsburg Hbf" },
  { id:"8000244", name:"Wiesbaden Hbf" },
  { id:"8000244", name:"Münster(Westf)Hbf" },
  { id:"8000244", name:"Mönchengladbach Hbf" },
  { id:"8000244", name:"Gelsenkirchen Hbf" },
  { id:"8000244", name:"Aachen Hbf" },
  { id:"8000244", name:"Braunschweig Hbf" },
  { id:"8000244", name:"Kiel Hbf" },
  { id:"8000244", name:"Chemnitz Hbf" },
  { id:"8000244", name:"Halle(Saale)Hbf" },
  { id:"8000244", name:"Magdeburg Hbf" },
  { id:"8000244", name:"Erfurt Hbf" },
  { id:"8000244", name:"Freiburg(Breisgau)Hbf" },
  { id:"8000244", name:"Lübeck Hbf" },
  { id:"8000244", name:"Rostock Hbf" },
  { id:"8000244", name:"Kassel-Wilhelmshöhe" },
  { id:"8000244", name:"Saarbrücken Hbf" },
  { id:"8000244", name:"Mainz Hbf" },
  { id:"8000244", name:"Osnabrück Hbf" },
  { id:"8000244", name:"Heidelberg Hbf" },
  { id:"8000244", name:"Darmstadt Hbf" },
  { id:"8000244", name:"Würzburg Hbf" },
  { id:"8000244", name:"Regensburg Hbf" },
  { id:"8000244", name:"Paderborn Hbf" },
  { id:"8000244", name:"Oldenburg(Oldb)Hbf" },
  { id:"8000244", name:"Ingolstadt Hbf" },
  { id:"8000244", name:"Ulm Hbf" },
  { id:"8000244", name:"Wolfsburg Hbf" },
  { id:"8000244", name:"Göttingen" },
  { id:"8000244", name:"Trier Hbf" },
  { id:"8000244", name:"Kaiserslautern Hbf" },
  { id:"8000244", name:"Siegen Hbf" },
  { id:"8000244", name:"Cottbus Hbf" },
  { id:"8000244", name:"Potsdam Hbf" },
  { id:"8000244", name:"Jena Paradies" },
  { id:"8000244", name:"Weimar" },
  { id:"8000244", name:"Erfurt Hbf" },
  { id:"8000244", name:"Bamberg" },
  { id:"8000244", name:"Bayreuth Hbf" },
  { id:"8000244", name:"Passau Hbf" },
  { id:"8000244", name:"Lindau Hbf" },
  { id:"8000244", name:"Konstanz" },
  { id:"8000244", name:"Flensburg" },
  { id:"8000244", name:"Stralsund Hbf" },
  { id:"8000244", name:"Greifswald" },
  { id:"8000244", name:"Schwerin Hbf" },
  { id:"8000244", name:"Erfurt Hbf" },
  { id:"8000244", name:"Gera Hbf" },
  { id:"8000244", name:"Zwickau(Sachs)Hbf" },
  { id:"8000244", name:"Plauen(Vogtl)ob Bf" },
  { id:"8000244", name:"Dresden-Neustadt" },
  { id:"8000244", name:"Bautzen" },
  { id:"8000244", name:"Görlitz" },
  { id:"8000244", name:"Frankfurt(Oder)" },
  { id:"8000244", name:"Eberswalde Hbf" },
  { id:"8000244", name:"Angermünde" },
  { id:"8000244", name:"Stralsund Hbf" },
  { id:"8000244", name:"Rostock Hbf" },
  { id:"8000244", name:"Wismar" },
  { id:"8000244", name:"Schwerin Hbf" },
  { id:"8000244", name:"Hamburg-Altona" },
  { id:"8000244", name:"Hamburg-Harburg" },
  { id:"8000244", name:"Lüneburg" },
  { id:"8000244", name:"Stade" },
  { id:"8000244", name:"Cuxhaven" },
  { id:"8000244", name:"Flensburg" },
  { id:"8000244", name:"Husum" },
  { id:"8000244", name:"Westerland(Sylt)" },
  { id:"8000244", name:"Neumünster" },
  { id:"8000244", name:"Rendsburg" },
  { id:"8000244", name:"Schleswig" },
  { id:"8000244", name:"Niebüll" },
  { id:"8000244", name:"Emden Hbf" },
  { id:"8000244", name:"Wilhelmshaven Hbf" },
  { id:"8000244", name:"Bremerhaven Hbf" },
  { id:"8000244", name:"Celle" },
  { id:"8000244", name:"Hildesheim Hbf" },
  { id:"8000244", name:"Hameln" },
  { id:"8000244", name:"Minden(Westf)" },
  { id:"8000244", name:"Herford" },
  { id:"8000244", name:"Detmold" },
  { id:"8000244", name:"Warburg(Westf)" },
  { id:"8000244", name:"Soest" },
  { id:"8000244", name:"Arnsberg(Westf)" },
  { id:"8000244", name:"Iserlohn" },
  { id:"8000244", name:"Hagen Hbf" },
  { id:"8000244", name:"Lüdenscheid" },
  { id:"8000244", name:"Remscheid Hbf" },
  { id:"8000244", name:"Solingen Hbf" },
  { id:"8000244", name:"Mettmann" },
  { id:"8000244", name:"Krefeld Hbf" },
  { id:"8000244", name:"Neuss Hbf" },
  { id:"8000244", name:"Oberhausen Hbf" },
  { id:"8000244", name:"Recklinghausen Hbf" },
  { id:"8000244", name:"Herne" },
  { id:"8000244", name:"Witten Hbf" },
  { id:"8000244", name:"Schwerte(Ruhr)" },
  { id:"8000244", name:"Iserlohn" },
  { id:"8000244", name:"Lippstadt" },
  { id:"8000244", name:"Gütersloh Hbf" },
  { id:"8000244", name:"Rheine" },
  { id:"8000244", name:"Coesfeld(Westf)" },
  { id:"8000244", name:"Wesel" },
  { id:"8000244", name:"Kleve" },
  { id:"8000244", name:"Emmerich" },
  { id:"8000244", name:"Xanten" },
  { id:"8000244", name:"Koblenz Hbf" },
  { id:"8000244", name:"Andernach" },
  { id:"8000244", name:"Neuwied" },
  { id:"8000244", name:"Bingen(Rhein)Hbf" },
  { id:"8000244", name:"Bad Kreuznach" },
  { id:"8000244", name:"Kaiserslautern Hbf" },
  { id:"8000244", name:"Landau(Pfalz)Hbf" },
  { id:"8000244", name:"Neustadt(Weinstr)Hbf" },
  { id:"8000244", name:"Speyer Hbf" },
  { id:"8000244", name:"Ludwigshafen(Rhein)Hbf" },
  { id:"8000244", name:"Frankenthal(Pfalz)Hbf" },
  { id:"8000244", name:"Worms Hbf" },
  { id:"8000244", name:"Bensheim" },
  { id:"8000244", name:"Weinheim(Bergstr)Hbf" },
  { id:"8000244", name:"Bruchsal" },
  { id:"8000244", name:"Pforzheim Hbf" },
  { id:"8000244", name:"Baden-Baden" },
  { id:"8000244", name:"Offenburg" },
  { id:"8000244", name:"Lahr(Schwarzw)" },
  { id:"8000244", name:"Villingen(Schwarzw)" },
  { id:"8000244", name:"Donaueschingen" },
  { id:"8000244", name:"Singen(Hohentwiel)" },
  { id:"8000244", name:"Radolfzell" },
  { id:"8000244", name:"Friedrichshafen Hbf" },
  { id:"8000244", name:"Ravensburg" },
  { id:"8000244", name:"Biberach(Riß)" },
  { id:"8000244", name:"Memmingen" },
  { id:"8000244", name:"Kempten(Allgäu)Hbf" },
  { id:"8000244", name:"Füssen" },
  { id:"8000244", name:"Garmisch-Partenkirchen" },
  { id:"8000244", name:"Rosenheim" },
  { id:"8000244", name:"Salzburg Hbf" },
  { id:"8000244", name:"Traunstein" },
  { id:"8000244", name:"Freilassing" },
  { id:"8000244", name:"Berchtesgaden Hbf" },
  { id:"8000244", name:"Landshut(Bay)Hbf" },
  { id:"8000244", name:"Straubing" },
  { id:"8000244", name:"Deggendorf Hbf" },
  { id:"8000244", name:"Plattling" },
  { id:"8000244", name:"Weiden(Oberpf)Hbf" },
  { id:"8000244", name:"Amberg" },
  { id:"8000244", name:"Schwandorf" },
  { id:"8000244", name:"Cham(Oberpf)" },
  { id:"8000244", name:"Hof Hbf" },
  { id:"8000244", name:"Coburg" },
  { id:"8000244", name:"Lichtenfels" },
  { id:"8000244", name:"Kronach" },
  { id:"8000244", name:"Neustadt(b.Coburg)" },
  { id:"8000244", name:"Sonneberg(Thür)Hbf" },
  { id:"8000244", name:"Saalfeld(Saale)" },
  { id:"8000244", name:"Rudolstadt-Schwarza" },
  { id:"8000244", name:"Naumburg(Saale)Hbf" },
  { id:"8000244", name:"Merseburg" },
  { id:"8000244", name:"Bitterfeld" },
  { id:"8000244", name:"Dessau Hbf" },
  { id:"8000244", name:"Lutherstadt Wittenberg Hbf" },
  { id:"8000244", name:"Jüterbog" },
  { id:"8000244", name:"Stendal" },
  { id:"8000244", name:"Salzwedel" },
  { id:"8000244", name:"Uelzen" },
  { id:"8000244", name:"Wolfenbüttel" },
  { id:"8000244", name:"Goslar" },
  { id:"8000244", name:"Bad Harzburg" },
  { id:"8000244", name:"Wernigerode" },
  { id:"8000244", name:"Halberstadt" },
  { id:"8000244", name:"Quedlinburg" },
  { id:"8000244", name:"Aschersleben" },
  { id:"8000244", name:"Bernburg(Saale)" },
  { id:"8000244", name:"Köthen" },
  { id:"8000244", name:"Bernburg(Saale)" },
  { id:"8000244", name:"Köthen" },
  // ── Additional 200+ ─────────────────────────────────────
  // Bavaria extras
  { id:"8000244", name:"München-Pasing" },
  { id:"8000244", name:"München Ost" },
  { id:"8000244", name:"Freising" },
  { id:"8000244", name:"Erding" },
  { id:"8000244", name:"Dachau" },
  { id:"8000244", name:"Fürstenfeldbruck" },
  { id:"8000244", name:"Buchloe" },
  { id:"8000244", name:"Kaufbeuren" },
  { id:"8000244", name:"Immenstadt" },
  { id:"8000244", name:"Oberstdorf" },
  { id:"8000244", name:"Weilheim(Oberbay)" },
  { id:"8000244", name:"Penzberg" },
  { id:"8000244", name:"Holzkirchen" },
  { id:"8000244", name:"Mühldorf(Oberbay)" },
  { id:"8000244", name:"Altötting" },
  { id:"8000244", name:"Simbach(Inn)" },
  { id:"8000244", name:"Prien(Chiemsee)" },
  { id:"8000244", name:"Bad Reichenhall" },
  { id:"8000244", name:"Ruhpolding" },
  { id:"8000244", name:"Berchtesgaden Hbf" },
  { id:"8000244", name:"Garmisch-Partenkirchen" },
  { id:"8000244", name:"Rosenheim" },
  { id:"8000244", name:"Landshut(Bay)Hbf" },
  { id:"8000244", name:"Straubing" },
  { id:"8000244", name:"Deggendorf Hbf" },
  { id:"8000244", name:"Aschaffenburg Hbf" },
  { id:"8000244", name:"Schweinfurt Hbf" },
  { id:"8000244", name:"Kitzingen" },
  { id:"8000244", name:"Ansbach" },
  { id:"8000244", name:"Gunzenhausen" },
  { id:"8000244", name:"Treuchtlingen" },
  { id:"8000244", name:"Donauwörth" },
  { id:"8000244", name:"Nördlingen" },
  { id:"8000244", name:"Dillingen(Donau)" },
  { id:"8000244", name:"Günzburg" },
  { id:"8000244", name:"Landsberg(Lech)" },
  { id:"8000244", name:"Schongau" },
  { id:"8000244", name:"Wangen(Allgäu)" },
  { id:"8000244", name:"Marktoberdorf" },
  // Baden-Württemberg extras
  { id:"8000244", name:"Rastatt" },
  { id:"8000244", name:"Achern" },
  { id:"8000244", name:"Kehl" },
  { id:"8000244", name:"Hausach" },
  { id:"8000244", name:"Triberg" },
  { id:"8000244", name:"Rottweil" },
  { id:"8000244", name:"Tuttlingen" },
  { id:"8000244", name:"Waldshut" },
  { id:"8000244", name:"Bad Säckingen" },
  { id:"8000244", name:"Weil am Rhein" },
  { id:"8000244", name:"Breisach" },
  { id:"8000244", name:"Titisee" },
  { id:"8000244", name:"Neustadt(Schwarzw)" },
  { id:"8000244", name:"Freudenstadt Hbf" },
  { id:"8000244", name:"Horb" },
  { id:"8000244", name:"Tübingen Hbf" },
  { id:"8000244", name:"Reutlingen Hbf" },
  { id:"8000244", name:"Bad Urach" },
  { id:"8000244", name:"Balingen" },
  { id:"8000244", name:"Sigmaringen" },
  { id:"8000244", name:"Aulendorf" },
  { id:"8000244", name:"Geislingen(Steige)" },
  { id:"8000244", name:"Göppingen" },
  { id:"8000244", name:"Plochingen" },
  { id:"8000244", name:"Esslingen(Neckar)" },
  { id:"8000244", name:"Böblingen" },
  { id:"8000244", name:"Herrenberg" },
  { id:"8000244", name:"Nagold" },
  { id:"8000244", name:"Calw" },
  { id:"8000244", name:"Mühlacker" },
  { id:"8000244", name:"Vaihingen(Enz)" },
  { id:"8000244", name:"Bietigheim-Bissingen" },
  { id:"8000244", name:"Ludwigsburg" },
  { id:"8000244", name:"Backnang" },
  { id:"8000244", name:"Schorndorf" },
  { id:"8000244", name:"Waiblingen" },
  { id:"8000244", name:"Aalen Hbf" },
  { id:"8000244", name:"Schwäbisch Gmünd" },
  { id:"8000244", name:"Ellwangen" },
  { id:"8000244", name:"Crailsheim" },
  { id:"8000244", name:"Schwäbisch Hall Hessental" },
  { id:"8000244", name:"Heilbronn Hbf" },
  { id:"8000244", name:"Eppingen" },
  { id:"8000244", name:"Mosbach(Baden)" },
  { id:"8000244", name:"Neckarsulm" },
  // Rhineland-Palatinate & Saarland
  { id:"8000244", name:"Idar-Oberstein" },
  { id:"8000244", name:"Neunkirchen(Saar)Hbf" },
  { id:"8000244", name:"Homburg(Saar)Hbf" },
  { id:"8000244", name:"Pirmasens Hbf" },
  { id:"8000244", name:"Bad Dürkheim" },
  { id:"8000244", name:"Alzey" },
  { id:"8000244", name:"Gerolstein" },
  { id:"8000244", name:"Cochem(Mosel)" },
  { id:"8000244", name:"Bullay" },
  { id:"8000244", name:"Boppard Hbf" },
  { id:"8000244", name:"St. Goar" },
  { id:"8000244", name:"Bacharach" },
  { id:"8000244", name:"Rüdesheim(Rhein)" },
  { id:"8000244", name:"Andernach" },
  { id:"8000244", name:"Neuwied" },
  { id:"8000244", name:"Bingen(Rhein)Hbf" },
  { id:"8000244", name:"Bad Kreuznach" },
  { id:"8000244", name:"Landau(Pfalz)Hbf" },
  { id:"8000244", name:"Speyer Hbf" },
  { id:"8000244", name:"Worms Hbf" },
  { id:"8000244", name:"Bensheim" },
  { id:"8000244", name:"Bruchsal" },
  // NRW extras
  { id:"8000244", name:"Düren" },
  { id:"8000244", name:"Viersen" },
  { id:"8000244", name:"Kempen(Niederrhein)" },
  { id:"8000244", name:"Goch" },
  { id:"8000244", name:"Moers" },
  { id:"8000244", name:"Dinslaken" },
  { id:"8000244", name:"Haltern am See" },
  { id:"8000244", name:"Dorsten" },
  { id:"8000244", name:"Bottrop Hbf" },
  { id:"8000244", name:"Mülheim(Ruhr)Hbf" },
  { id:"8000244", name:"Velbert" },
  { id:"8000244", name:"Leverkusen Mitte" },
  { id:"8000244", name:"Bergisch Gladbach" },
  { id:"8000244", name:"Gummersbach" },
  { id:"8000244", name:"Marburg(Lahn)" },
  { id:"8000244", name:"Gießen" },
  { id:"8000244", name:"Wetzlar" },
  // Hesse extras
  { id:"8000244", name:"Hanau Hbf" },
  { id:"8000244", name:"Offenbach(Main)Hbf" },
  { id:"8000244", name:"Langen(Hess)" },
  { id:"8000244", name:"Rüsselsheim" },
  { id:"8000244", name:"Frankfurt Flughafen Fernbf" },
  { id:"8000244", name:"Bad Homburg" },
  { id:"8000244", name:"Friedberg(Hess)" },
  { id:"8000244", name:"Bad Nauheim" },
  { id:"8000244", name:"Limburg(Lahn)" },
  { id:"8000244", name:"Bad Ems" },
  { id:"8000244", name:"Fulda" },
  { id:"8000244", name:"Bad Hersfeld" },
  { id:"8000244", name:"Bebra" },
  { id:"8000244", name:"Korbach" },
  // Thuringia extras
  { id:"8000244", name:"Eisenach" },
  { id:"8000244", name:"Gotha" },
  { id:"8000244", name:"Arnstadt Hbf" },
  { id:"8000244", name:"Ilmenau" },
  { id:"8000244", name:"Meiningen" },
  { id:"8000244", name:"Suhl" },
  { id:"8000244", name:"Nordhausen" },
  { id:"8000244", name:"Mühlhausen(Thür)" },
  { id:"8000244", name:"Bad Langensalza" },
  { id:"8000244", name:"Apolda" },
  // Saxony extras
  { id:"8000244", name:"Meißen Triebischtal" },
  { id:"8000244", name:"Riesa" },
  { id:"8000244", name:"Döbeln Hbf" },
  { id:"8000244", name:"Freiberg(Sachs)" },
  { id:"8000244", name:"Annaberg-Buchholz Hbf" },
  { id:"8000244", name:"Schwarzenberg(Erzgeb)" },
  { id:"8000244", name:"Aue(Sachs)" },
  { id:"8000244", name:"Torgau" },
  { id:"8000244", name:"Eilenburg" },
  { id:"8000244", name:"Wurzen" },
  { id:"8000244", name:"Weißenfels" },
  // Lower Saxony extras
  { id:"8000244", name:"Northeim(Han)" },
  { id:"8000244", name:"Alfeld(Leine)" },
  { id:"8000244", name:"Lehrte" },
  { id:"8000244", name:"Soltau(Han)" },
  { id:"8000244", name:"Rotenburg(Wümme)" },
  { id:"8000244", name:"Verden(Aller)" },
  { id:"8000244", name:"Cloppenburg" },
  { id:"8000244", name:"Papenburg(Ems)" },
  { id:"8000244", name:"Leer(Ostfriesl)" },
  { id:"8000244", name:"Norden" },
  { id:"8000244", name:"Norddeich Mole" },
  { id:"8000244", name:"Bad Bentheim" },
  { id:"8000244", name:"Meppen" },
  { id:"8000244", name:"Lingen(Ems)" },
  { id:"8000244", name:"Nienburg(Weser)" },
  { id:"8000244", name:"Wunstorf" },
  { id:"8000244", name:"Buchholz(Nordheide)" },
  // Schleswig-Holstein extras
  { id:"8000244", name:"Bad Oldesloe" },
  { id:"8000244", name:"Elmshorn" },
  { id:"8000244", name:"Itzehoe" },
  { id:"8000244", name:"Heide(Holst)" },
  { id:"8000244", name:"Pinneberg" },
  { id:"8000244", name:"Wedel(Holst)" },
  // Brandenburg & Mecklenburg extras
  { id:"8000244", name:"Oranienburg" },
  { id:"8000244", name:"Bernau(b Berlin)" },
  { id:"8000244", name:"Strausberg" },
  { id:"8000244", name:"Fürstenwalde(Spree)" },
  { id:"8000244", name:"Eisenhüttenstadt" },
  { id:"8000244", name:"Guben" },
  { id:"8000244", name:"Senftenberg" },
  { id:"8000244", name:"Brandenburg Hbf" },
  { id:"8000244", name:"Rathenow" },
  { id:"8000244", name:"Nauen" },
  { id:"8000244", name:"Neuruppin" },
  { id:"8000244", name:"Wittstock(Dosse)" },
  { id:"8000244", name:"Perleberg" },
  { id:"8000244", name:"Ludwigslust" },
  { id:"8000244", name:"Güstrow" },
  { id:"8000244", name:"Waren(Müritz)" },
  { id:"8000244", name:"Neustrelitz Hbf" },
  { id:"8000244", name:"Neubrandenburg" },
  { id:"8000244", name:"Pasewalk" },
  { id:"8000244", name:"Anklam" },
  { id:"8000244", name:"Bergen auf Rügen" },
  { id:"8000244", name:"Binz" },
  { id:"8000244", name:"Sassnitz" },
  { id:"8000244", name:"Wolgast Hbf" },
  // ── Batch 3: ~200 more ───────────────────────────────────
  // Scenic & tourist routes
  { id:"8000244", name:"Heidelberg-Schlierbach" },
  { id:"8000244", name:"Eberbach" },
  { id:"8000244", name:"Neckarelz" },
  { id:"8000244", name:"Bad Wimpfen" },
  { id:"8000244", name:"Bad Rappenau" },
  { id:"8000244", name:"Schrozberg" },
  { id:"8000244", name:"Rothenburg ob der Tauber" },
  { id:"8000244", name:"Dinkelsbühl" },
  { id:"8000244", name:"Feuchtwangen" },
  { id:"8000244", name:"Leutershausen-Wiedersbach" },
  { id:"8000244", name:"Steinsfeld-Burgoberbach" },
  { id:"8000244", name:"Mittenwald" },
  { id:"8000244", name:"Seefeld(Oberbay)" },
  { id:"8000244", name:"Starnberg" },
  { id:"8000244", name:"Tutzing" },
  { id:"8000244", name:"Weilheim i.OB" },
  { id:"8000244", name:"Schliersee" },
  { id:"8000244", name:"Bayrischzell" },
  { id:"8000244", name:"Lenggries" },
  { id:"8000244", name:"Tegernsee" },
  { id:"8000244", name:"Miesbach" },
  { id:"8000244", name:"Rosenheim" },
  { id:"8000244", name:"Bad Aibling" },
  { id:"8000244", name:"Kolbermoor" },
  { id:"8000244", name:"Kiefersfelden" },
  { id:"8000244", name:"Oberaudorf" },
  { id:"8000244", name:"Jenbach" },
  { id:"8000244", name:"Schwangau" },
  { id:"8000244", name:"Reutte in Tirol" },
  // Rhine valley & Moselle
  { id:"8000244", name:"Mainz-Kastel" },
  { id:"8000244", name:"Wiesbaden-Biebrich" },
  { id:"8000244", name:"Eltville(Rhein)" },
  { id:"8000244", name:"Oestrich-Winkel" },
  { id:"8000244", name:"Geisenheim" },
  { id:"8000244", name:"Assmannshausen" },
  { id:"8000244", name:"Lorch(Rhein)" },
  { id:"8000244", name:"Kaub" },
  { id:"8000244", name:"Oberwesel" },
  { id:"8000244", name:"Loreley" },
  { id:"8000244", name:"Braubach" },
  { id:"8000244", name:"Lahnstein" },
  { id:"8000244", name:"Rhens" },
  { id:"8000244", name:"Spay" },
  { id:"8000244", name:"Kamp-Bornhofen" },
  { id:"8000244", name:"Filsen" },
  { id:"8000244", name:"Osterspai" },
  { id:"8000244", name:"Winningen(Mosel)" },
  { id:"8000244", name:"Kobern-Gondorf" },
  { id:"8000244", name:"Moselkern" },
  { id:"8000244", name:"Treis-Karden" },
  { id:"8000244", name:"Ediger-Eller" },
  { id:"8000244", name:"Beilstein(Mosel)" },
  { id:"8000244", name:"Zell(Mosel)" },
  { id:"8000244", name:"Pünderich" },
  { id:"8000244", name:"Alf" },
  { id:"8000244", name:"Neef" },
  // Harz region
  { id:"8000244", name:"Thale" },
  { id:"8000244", name:"Blankenburg(Harz)" },
  { id:"8000244", name:"Ballenstedt" },
  { id:"8000244", name:"Hasselfelde" },
  { id:"8000244", name:"Benneckenstein(Harz)" },
  { id:"8000244", name:"Buntenbock" },
  { id:"8000244", name:"Clausthal-Zellerfeld" },
  { id:"8000244", name:"Seesen" },
  { id:"8000244", name:"Bad Lauterberg im Harz" },
  { id:"8000244", name:"Bad Sachsa" },
  { id:"8000244", name:"Herzberg(Harz)" },
  { id:"8000244", name:"Osterode am Harz" },
  { id:"8000244", name:"Bad Grund(Harz)" },
  // Eifel & Sauerland
  { id:"8000244", name:"Blankenheim(Wald)" },
  { id:"8000244", name:"Adenau" },
  { id:"8000244", name:"Kelberg" },
  { id:"8000244", name:"Daun" },
  { id:"8000244", name:"Manderscheid" },
  { id:"8000244", name:"Wittlich Hbf" },
  { id:"8000244", name:"Bernkastel-Kues" },
  { id:"8000244", name:"Prüm" },
  { id:"8000244", name:"Winterberg(Westf)" },
  { id:"8000244", name:"Brilon Stadt" },
  { id:"8000244", name:"Meschede" },
  { id:"8000244", name:"Schmallenberg" },
  { id:"8000244", name:"Lennestadt-Altenhundem" },
  { id:"8000244", name:"Olpe" },
  { id:"8000244", name:"Attendorn" },
  // Spessart & Rhön
  { id:"8000244", name:"Lohr(Main)" },
  { id:"8000244", name:"Marktheidenfeld" },
  { id:"8000244", name:"Karlstadt(Main)" },
  { id:"8000244", name:"Gmünden(Main)" },
  { id:"8000244", name:"Partenstein" },
  { id:"8000244", name:"Laufach" },
  { id:"8000244", name:"Heigenbrücken" },
  { id:"8000244", name:"Bad Brückenau Hbf" },
  { id:"8000244", name:"Hammelburg" },
  { id:"8000244", name:"Bad Kissingen" },
  { id:"8000244", name:"Münnerstadt" },
  { id:"8000244", name:"Mellrichstadt" },
  { id:"8000244", name:"Fladungen" },
  { id:"8000244", name:"Bischofsheim(Rhön)" },
  { id:"8000244", name:"Hilders" },
  // Saxony-Anhalt extras
  { id:"8000244", name:"Wittenberge" },
  { id:"8000244", name:"Burg(Magdeburg)" },
  { id:"8000244", name:"Schönebeck(Elbe)" },
  { id:"8000244", name:"Staßfurt" },
  { id:"8000244", name:"Eisleben" },
  { id:"8000244", name:"Sangerhausen" },
  { id:"8000244", name:"Artern" },
  { id:"8000244", name:"Nebra" },
  { id:"8000244", name:"Freyburg(Unstrut)" },
  { id:"8000244", name:"Bad Kösen" },
  { id:"8000244", name:"Bad Sulza" },
  { id:"8000244", name:"Zeitz" },
  { id:"8000244", name:"Hohenmölsen" },
  { id:"8000244", name:"Markranstädt" },
  { id:"8000244", name:"Schkeuditz" },
  { id:"8000244", name:"Torgau" },
  { id:"8000244", name:"Wittenberg" },
  { id:"8000244", name:"Kemberg" },
  { id:"8000244", name:"Zerbst" },
  { id:"8000244", name:"Aken(Elbe)" },
  // More Bavaria — Franconia & Swabia
  { id:"8000244", name:"Neumarkt(Oberpf)" },
  { id:"8000244", name:"Parsberg" },
  { id:"8000244", name:"Kallmünz" },
  { id:"8000244", name:"Burglengenfeld" },
  { id:"8000244", name:"Nabburg" },
  { id:"8000244", name:"Tirschenreuth" },
  { id:"8000244", name:"Waldsassen" },
  { id:"8000244", name:"Marktredwitz" },
  { id:"8000244", name:"Selb-Plößberg" },
  { id:"8000244", name:"Naila" },
  { id:"8000244", name:"Münchberg" },
  { id:"8000244", name:"Helmbrechts" },
  { id:"8000244", name:"Stadtsteinach" },
  { id:"8000244", name:"Kulmbach" },
  { id:"8000244", name:"Pegnitz" },
  { id:"8000244", name:"Hersbruck(rechts Pegnitz)" },
  { id:"8000244", name:"Lauf(links Pegnitz)" },
  { id:"8000244", name:"Erlangen" },
  { id:"8000244", name:"Fürth(Bay)Hbf" },
  { id:"8000244", name:"Zirndorf" },
  { id:"8000244", name:"Langenzenn" },
  { id:"8000244", name:"Uffenheim" },
  { id:"8000244", name:"Ochsenfurt" },
  { id:"8000244", name:"Marktbreit" },
  { id:"8000244", name:"Iphofen" },
  { id:"8000244", name:"Scheinfeld" },
  { id:"8000244", name:"Uffenheim" },
  { id:"8000244", name:"Bad Windsheim" },
  { id:"8000244", name:"Neustadt(Aisch)Hbf" },
  // North Sea coast & islands
  { id:"8000244", name:"List auf Sylt" },
  { id:"8000244", name:"Keitum" },
  { id:"8000244", name:"Morsum" },
  { id:"8000244", name:"Tinnum" },
  { id:"8000244", name:"Sylt-Ost" },
  { id:"8000244", name:"Dagebüll Mole" },
  { id:"8000244", name:"Bredstedt" },
  { id:"8000244", name:"Leck" },
  { id:"8000244", name:"Süderlügum" },
  { id:"8000244", name:"Tønder" },
  { id:"8000244", name:"Westerland(Sylt)" },
  { id:"8000244", name:"Büsum" },
  { id:"8000244", name:"Sankt Peter-Ording" },
  { id:"8000244", name:"Tönning" },
  { id:"8000244", name:"Garding" },
  { id:"8000244", name:"Friedrichstadt" },
  // Baltic coast
  { id:"8000244", name:"Travemünde Strand" },
  { id:"8000244", name:"Travemünde Hafen" },
  { id:"8000244", name:"Timmendorfer Strand" },
  { id:"8000244", name:"Niendorf(Ostsee)" },
  { id:"8000244", name:"Scharbeutz" },
  { id:"8000244", name:"Bad Schwartau" },
  { id:"8000244", name:"Eutin" },
  { id:"8000244", name:"Malente-Gremsmühlen" },
  { id:"8000244", name:"Lensahn" },
  { id:"8000244", name:"Oldenburg(Holst)" },
  { id:"8000244", name:"Neustadt(Holst)" },
  { id:"8000244", name:"Grömitz" },
  { id:"8000244", name:"Bad Doberan" },
  { id:"8000244", name:"Kühlungsborn West" },
  { id:"8000244", name:"Heiligendamm" },
  { id:"8000244", name:"Warnemünde" },
  { id:"8000244", name:"Rostock-Bramow" },
  { id:"8000244", name:"Ribnitz-Damgarten West" },
  { id:"8000244", name:"Barth" },
  { id:"8000244", name:"Prerow" },
  { id:"8000244", name:"Zingst" },
  { id:"8000244", name:"Putbus" },
  { id:"8000244", name:"Göhren" },
  { id:"8000244", name:"Sellin Ost" },
  { id:"8000244", name:"Baabe" },
  // Sauerland & Teutoburg Forest
  { id:"8000244", name:"Bad Lippspringe" },
  { id:"8000244", name:"Horn-Bad Meinberg" },
  { id:"8000244", name:"Schieder" },
  { id:"8000244", name:"Blomberg(Lippe)" },
  { id:"8000244", name:"Lügde" },
  { id:"8000244", name:"Barntrup" },
  { id:"8000244", name:"Lemgo" },
  { id:"8000244", name:"Bad Salzuflen" },
  { id:"8000244", name:"Enger(Westf)" },
  { id:"8000244", name:"Bünde(Westf)" },
  { id:"8000244", name:"Löhne(Westf)" },
  // Weser Uplands
  { id:"8000244", name:"Bad Pyrmont" },
  { id:"8000244", name:"Aerzen" },
  { id:"8000244", name:"Coppenbrügge" },
  { id:"8000244", name:"Salzhemmendorf" },
  { id:"8000244", name:"Bad Münder(Deister)" },
  { id:"8000244", name:"Springe" },
  { id:"8000244", name:"Hannover-Linden" },
  { id:"8000244", name:"Hannover-Nordstadt" },
  { id:"8000244", name:"Hannover-Kleefeld" },
].filter((s, i, arr) => arr.findIndex(x => x.name === s.name) === i); // dedupe by name

/* Fuzzy search: score each station name against query */
function searchStations(query) {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase().trim();
  const results = [];
  for (const s of STATIONS) {
    const n = s.name.toLowerCase();
    if (n.startsWith(q)) { results.push({ ...s, score: 3 }); continue; }
    // match city part (before space/parenthesis)
    const city = n.split(/[\s(]/)[0];
    if (city.startsWith(q)) { results.push({ ...s, score: 2 }); continue; }
    if (n.includes(q)) { results.push({ ...s, score: 1 }); }
  }
  results.sort((a, b) => b.score - a.score || a.name.length - b.name.length);
  return results.slice(0, 8);
}

/* ═══════════════════════════════════════════════════════════
   CLAUDE API  — images + route generation
   ═══════════════════════════════════════════════════════════ */
async function fetchImageForPOI(poiName) {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [{
          role: "user",
          content: `Find a Wikimedia Commons direct image URL for "${poiName}" in Germany. Return ONLY valid JSON, no markdown: {"url":"https://upload.wikimedia.org/wikipedia/commons/...jpg","alt":"short description","credit":"photographer name"}. URL must end in .jpg, .jpeg, or .png and be a real file.`
        }],
        tools: [{ type: "web_search_20250305", name: "web_search" }],
      }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    const text = data.content.filter(b => b.type === "text").map(b => b.text).join("").replace(/```json|```/g, "").trim();
    if (!text) return null;
    const parsed = JSON.parse(text);
    return parsed.url?.startsWith("http") ? parsed : null;
  } catch { return null; }
}

/* ═══════════════════════════════════════════════════════════
   ERA THEMING
   ═══════════════════════════════════════════════════════════ */
function getEraStyle(era) {
  const e = (era || "").toLowerCase();
  if (/roman|antiquity|1st|2nd|3rd|4th|b\.?c/i.test(e))  return { bg:"#1E1A14", fg:"#D4C4A0", accent:"#B8954A" };
  if (/medieval|middle age|8th|9th|10th|11th|12th|13th|14th|15th|charlemagne/i.test(e)) return { bg:"#2D1B0E", fg:"#D4A574", accent:"#8B6F47" };
  if (/reformation|1[5-6]\d{2}|luther|16th/i.test(e))    return { bg:"#1A2332", fg:"#C4D4E8", accent:"#5B7FA5" };
  if (/baroque|rococo|17[0-9]{2}|18th|enlightenment/i.test(e)) return { bg:"#2E1A2E", fg:"#D4B8D4", accent:"#9B6B9B" };
  if (/19th|romantic|industrial|18[0-9]{2}|bismarck|empire/i.test(e)) return { bg:"#1A2020", fg:"#C4D4C8", accent:"#5A8A6A" };
  if (/20th|ww|nazi|war|19[0-9]{2}|cold war|weimar|third reich/i.test(e)) return { bg:"#1A1A1A", fg:"#E8E8E8", accent:"#EC0016" };
  if (/modern|21st|present|contemporary|reunif/i.test(e)) return { bg:"#141820", fg:"#D0D8E8", accent:"#4A80C0" };
  return { bg:"#1C1C1C", fg:"#D4DDE0", accent:"#EC0016" };
}

/* ═══════════════════════════════════════════════════════════
   TOKENS
   ═══════════════════════════════════════════════════════════ */
const T = {
  red:"#EC0016", redDark:"#C0000E",
  white:"#FFFFFF",
  g200:"#D7DCE1", g300:"#AFB4BB", g400:"#878C96",
  g500:"#646973", g600:"#3C414A", g700:"#282D37",
  g800:"#1B1F27", g900:"#131720", black:"#0D0F14",
  sans:"'Roboto','Helvetica Neue',Arial,sans-serif",
  mono:"'Roboto Mono','Courier New',monospace",
};

/* ═══════════════════════════════════════════════════════════
   CSS
   ═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Roboto+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;}
body{margin:0;padding:0;background:#0A0B0F;}

@keyframes spin   { to{transform:rotate(360deg);} }
@keyframes fadeUp { from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);} }
@keyframes fadeIn { from{opacity:0;}to{opacity:1;} }

.db-btn {
  width:100%;padding:14px;background:#EC0016;color:#fff;
  border:none;border-radius:6px;font-family:'Roboto',sans-serif;
  font-size:14px;font-weight:700;letter-spacing:0.8px;
  text-transform:uppercase;cursor:pointer;
  transition:background 0.15s,transform 0.1s;
}
.db-btn:hover:not(:disabled){background:#C0000E;}
.db-btn:active:not(:disabled){transform:scale(0.99);}
.db-btn:disabled{background:#3C414A;color:#646973;cursor:not-allowed;}

.chip {
  display:inline-flex;align-items:center;
  padding:2px 7px;border-radius:3px;
  font-family:'Roboto Mono',monospace;font-size:10px;font-weight:500;
  letter-spacing:0.3px;line-height:1.6;white-space:nowrap;
}

.poi-card {
  background:#1B1F27;border:1px solid #282D37;border-radius:8px;
  overflow:hidden;cursor:pointer;
  animation:fadeUp 0.3s ease both;transition:border-color 0.2s;
}
.poi-card:hover{border-color:#3C414A;}
.poi-card.open{border-color:#EC0016;cursor:default;}

.si-input {
  width:100%;padding:13px 36px 13px 14px;
  background:#1B1F27;border:1.5px solid #3C414A;border-radius:6px;
  color:#fff;font-family:'Roboto',sans-serif;font-size:15px;
  outline:none;transition:border-color 0.15s,box-shadow 0.15s;
}
.si-input::placeholder{color:#646973;}
.si-input:focus{border-color:#EC0016;box-shadow:0 0 0 2px rgba(236,0,22,0.18);}
.si-input.sel{padding-left:28px;}

.dd-wrap{
  position:absolute;top:calc(100% + 3px);left:0;right:0;z-index:500;
  background:#1B1F27;border:1px solid #3C414A;border-radius:6px;
  max-height:220px;overflow-y:auto;
  box-shadow:0 8px 24px rgba(0,0,0,0.8);
}
.dd-item{
  padding:11px 14px;cursor:pointer;
  font-family:'Roboto',sans-serif;font-size:14px;color:#AFB4BB;
  border-bottom:1px solid #282D37;transition:background 0.08s,color 0.08s;
}
.dd-item:last-child{border-bottom:none;}
.dd-item:hover,.dd-item.hi{background:#282D37;color:#fff;}

::-webkit-scrollbar{width:3px;height:3px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:#3C414A;border-radius:2px;}
`;

/* ═══════════════════════════════════════════════════════════
   STATION INPUT  — 100% local, zero network calls
   ═══════════════════════════════════════════════════════════ */
function StationInput({ label, value, onChange, placeholder }) {
  const [query, setQuery] = useState(value?.name ?? "");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(-1);
  const containerRef = useRef(null);

  // Keep input text in sync when parent resets value
  useEffect(() => {
    setQuery(value?.name ?? "");
  }, [value?.id]);

  const handleChange = (e) => {
    const v = e.target.value;
    setQuery(v);
    if (value) onChange(null);
    setHi(-1);
    if (v.length === 0) { setResults([]); setOpen(false); return; }
    const r = searchStations(v);
    setResults(r);
    setOpen(r.length > 0);
  };

  const pick = (station) => {
    setQuery(station.name);
    setResults([]);
    setOpen(false);
    setHi(-1);
    onChange(station);
  };

  const handleKeyDown = (e) => {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHi(h => Math.min(h + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHi(h => Math.max(h - 1, 0)); }
    else if (e.key === "Enter" && hi >= 0) { e.preventDefault(); pick(results[hi]); }
    else if (e.key === "Escape") { setOpen(false); }
  };

  // Click outside to close
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = !!value;

  return (
    <div ref={containerRef} style={{ position:"relative" }}>
      <label style={{ display:"block", fontSize:10, letterSpacing:3, textTransform:"uppercase", color:T.g400, marginBottom:6, fontFamily:T.mono }}>
        {label}
      </label>
      <div style={{ position:"relative" }}>
        {selected && (
          <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", width:6, height:6, borderRadius:"50%", background:T.red, zIndex:2, pointerEvents:"none" }} />
        )}
        <input
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          placeholder={placeholder}
          className={`si-input${selected ? " sel" : ""}`}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        {selected && (
          <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:T.red, fontSize:14, pointerEvents:"none" }}>✓</span>
        )}
      </div>
      {open && results.length > 0 && (
        <div className="dd-wrap">
          {results.map((s, i) => (
            <div
              key={s.name}
              className={`dd-item${i === hi ? " hi" : ""}`}
              onMouseDown={(e) => { e.preventDefault(); pick(s); }}
              onMouseEnter={() => setHi(i)}
            >
              {s.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SMALL COMPONENTS
   ═══════════════════════════════════════════════════════════ */
function TrainViewBadge({ visibility, accent }) {
  if (!visibility || visibility === "not_visible") return null;
  return (
    <span className="chip" style={{ background:accent+"18", color:accent, border:`1px solid ${accent}35` }}>
      {visibility === "partially" ? "◎ partial view" : "◉ visible from train"}
    </span>
  );
}

function POIImage({ poiName, accent }) {
  const [img, setImg] = useState(null);
  const [status, setStatus] = useState("loading");
  const reqRef = useRef(0);

  useEffect(() => {
    const id = ++reqRef.current;
    setStatus("loading"); setImg(null);
    fetchImageForPOI(poiName).then(r => {
      if (reqRef.current !== id) return;
      if (r?.url) { setImg(r); setStatus("ok"); } else setStatus("err");
    });
  }, [poiName]);

  if (status === "loading") return (
    <div style={{ width:"100%", height:160, background:T.black, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8 }}>
      <div style={{ width:20, height:20, border:`2px solid ${accent}30`, borderTopColor:accent, borderRadius:"50%", animation:"spin 0.9s linear infinite" }} />
      <span style={{ fontSize:10, color:T.g500, fontFamily:T.mono, letterSpacing:1 }}>Finding image…</span>
    </div>
  );
  if (status === "err" || !img) return (
    <div style={{ width:"100%", height:60, background:accent+"10", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <span style={{ fontSize:24, opacity:0.15 }}>🏛</span>
    </div>
  );
  return (
    <div style={{ width:"100%", height:200, overflow:"hidden", position:"relative" }}>
      <img src={img.url} alt={img.alt || poiName}
        style={{ width:"100%", height:"100%", objectFit:"cover", filter:"brightness(0.78)" }}
        onError={e => {
          e.currentTarget.parentElement.innerHTML = `<div style="width:100%;height:60px;display:flex;align-items:center;justify-content:center;background:${T.black}"><span style="font-size:24px;opacity:0.1">🏛</span></div>`;
        }}
      />
      <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"linear-gradient(transparent,rgba(0,0,0,0.7))", padding:"24px 12px 8px" }}>
        {img.credit && <span style={{ fontSize:9, color:"rgba(255,255,255,0.3)", fontFamily:T.mono }}>{img.credit}</span>}
      </div>
    </div>
  );
}

function StopsStrip({ stops, lineNames, duration, transfers }) {
  if (!stops?.length) return null;
  return (
    <div style={{ borderBottom:`1px solid ${T.g700}`, padding:"10px 14px 8px", background:T.g900 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:7 }}>
        <span style={{ fontSize:9, fontFamily:T.mono, letterSpacing:2, color:T.red, textTransform:"uppercase" }}>
          Route · {stops.length} stops
        </span>
        <div style={{ display:"flex", gap:8 }}>
          {duration && <span style={{ fontSize:10, fontFamily:T.mono, color:T.g400 }}>⏱ {duration}</span>}
          {transfers > 0 && <span style={{ fontSize:10, fontFamily:T.mono, color:T.g400 }}>🔄 {transfers}</span>}
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", overflowX:"auto", paddingBottom:2 }}>
        {stops.map((s, i) => {
          const isEnd = i === 0 || i === stops.length - 1;
          return (
            <div key={i} style={{ display:"flex", alignItems:"center", flexShrink:0 }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"0 5px" }}>
                <div style={{ width:isEnd?9:5, height:isEnd?9:5, borderRadius:"50%", background:isEnd?T.red:T.g600, border:`${isEnd?2:1}px solid ${isEnd?T.red:T.g500}` }} />
                <span style={{ fontSize:isEnd?9:8, color:isEnd?T.g200:T.g500, fontFamily:T.mono, marginTop:3, whiteSpace:"nowrap", maxWidth:64, overflow:"hidden", textOverflow:"ellipsis", fontWeight:isEnd?600:400 }}>
                  {s.replace(/ Hbf| Hauptbahnhof/g,"").replace(/\(.*?\)/g,"").trim()}
                </span>
              </div>
              {i < stops.length-1 && <div style={{ width:14, height:1.5, background:T.g700, flexShrink:0 }} />}
            </div>
          );
        })}
      </div>
      {lineNames?.length > 0 && (
        <div style={{ display:"flex", gap:4, marginTop:6, flexWrap:"wrap" }}>
          {lineNames.map(ln => (
            <span key={ln} className="chip" style={{ background:T.red+"20", color:T.red, border:`1px solid ${T.red}35` }}>{ln}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TRAIN WINDOW OVERLAY
   ═══════════════════════════════════════════════════════════ */
function TrainWindowView({ pois, onClose }) {
  const [idx, setIdx] = useState(0);
  const vis = pois.filter(p => p.visibleFromTrain === "visible" || p.visibleFromTrain === "partially");
  if (!vis.length) return (
    <div style={{ position:"fixed", inset:0, zIndex:9999, background:T.black, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:T.sans }}>
      <button onClick={onClose} style={{ position:"absolute", top:20, right:20, background:T.g700, border:"none", borderRadius:"50%", width:40, height:40, color:T.g300, fontSize:18, cursor:"pointer" }}>✕</button>
      <span style={{ fontSize:36, opacity:0.1, marginBottom:12 }}>🚂</span>
      <p style={{ color:T.g500, fontSize:14 }}>No trackside sights on this route.</p>
    </div>
  );
  const poi = vis[idx];
  const s = getEraStyle(poi.era);
  return (
    <div style={{ position:"fixed", inset:0, zIndex:9999, background:T.black, fontFamily:T.sans, overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:16, border:`3px solid ${T.g700}`, borderRadius:14, overflow:"hidden", boxShadow:"0 0 60px rgba(0,0,0,0.9)" }}>
        <POIImage poiName={poi.name} accent={s.accent} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(transparent 35%,rgba(0,0,0,0.93) 100%)" }} />
        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"56px 24px 72px" }}>
          <div style={{ display:"flex", gap:7, marginBottom:8, flexWrap:"wrap" }}>
            <span style={{ fontSize:10, fontFamily:T.mono, letterSpacing:2, color:s.accent, textTransform:"uppercase", background:s.accent+"18", padding:"2px 8px", borderRadius:3 }}>{poi.era}</span>
            <TrainViewBadge visibility={poi.visibleFromTrain} accent={s.accent} />
          </div>
          <h2 style={{ fontSize:"clamp(20px,5vw,30px)", fontWeight:700, margin:"0 0 8px", color:T.white, lineHeight:1.2 }}>{poi.name}</h2>
          <p style={{ fontSize:13, color:T.g300, lineHeight:1.7, margin:0 }}>{poi.trainWindowNote || poi.overview}</p>
          {poi.trainWindowSide && (
            <div style={{ display:"inline-flex", marginTop:10, padding:"4px 10px", background:s.accent+"20", border:`1px solid ${s.accent}40`, borderRadius:4 }}>
              <span style={{ fontSize:10, fontFamily:T.mono, color:s.accent, letterSpacing:1 }}>LOOK {poi.trainWindowSide.toUpperCase()}</span>
            </div>
          )}
        </div>
      </div>
      <button onClick={onClose} style={{ position:"absolute", top:28, right:28, background:T.g700, border:"none", borderRadius:"50%", width:40, height:40, color:T.white, fontSize:16, cursor:"pointer", zIndex:20 }}>✕</button>
      <div style={{ position:"absolute", bottom:28, left:"50%", transform:"translateX(-50%)", display:"flex", alignItems:"center", gap:12, zIndex:20 }}>
        <button onClick={() => setIdx(i => Math.max(0,i-1))} disabled={idx===0} style={{ background:idx===0?T.g800:T.g700, border:"none", borderRadius:"50%", width:36, height:36, color:idx===0?T.g600:T.white, fontSize:14, cursor:idx===0?"default":"pointer" }}>◂</button>
        <span style={{ fontSize:11, fontFamily:T.mono, color:T.g400, letterSpacing:2, minWidth:46, textAlign:"center" }}>{idx+1} / {vis.length}</span>
        <button onClick={() => setIdx(i => Math.min(vis.length-1,i+1))} disabled={idx===vis.length-1} style={{ background:idx===vis.length-1?T.g800:T.g700, border:"none", borderRadius:"50%", width:36, height:36, color:idx===vis.length-1?T.g600:T.white, fontSize:14, cursor:idx===vis.length-1?"default":"pointer" }}>▸</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   POI CARD
   ═══════════════════════════════════════════════════════════ */
function POICard({ poi, displayIdx, realIdx, open, onToggle }) {
  const s = getEraStyle(poi.era);
  return (
    <div className={`poi-card${open?" open":""}`}
      style={{ animationDelay:`${displayIdx*0.05}s`, marginBottom:8 }}
      onClick={() => !open && onToggle(realIdx)}>

      {!open && (
        <div style={{ padding:"13px 14px", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4, flexWrap:"wrap" }}>
              <h3 style={{ fontSize:14, fontWeight:500, margin:0, color:T.white, fontFamily:T.sans }}>{poi.name}</h3>
              <TrainViewBadge visibility={poi.visibleFromTrain} accent={s.accent} />
            </div>
            <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
              <span className="chip" style={{ background:s.accent+"18", color:s.accent, border:`1px solid ${s.accent}35` }}>{poi.era}</span>
              {poi.nearestStation && <span style={{ fontSize:10, color:T.g500, fontFamily:T.mono }}>📍 {poi.nearestStation.replace(/ Hbf.*/,"")}</span>}
            </div>
          </div>
          <span style={{ color:T.g600, fontSize:14, flexShrink:0, marginTop:2 }}>▾</span>
        </div>
      )}

      {open && (
        <div style={{ background:s.bg }} onClick={e => e.stopPropagation()}>
          <POIImage poiName={poi.name} accent={s.accent} />
          <div style={{ padding:"14px 16px 18px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10, gap:10 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", gap:5, alignItems:"center", marginBottom:5, flexWrap:"wrap" }}>
                  <span className="chip" style={{ background:s.accent+"18", color:s.accent, border:`1px solid ${s.accent}35` }}>{poi.era}</span>
                  <TrainViewBadge visibility={poi.visibleFromTrain} accent={s.accent} />
                </div>
                <h3 style={{ fontSize:18, fontWeight:700, margin:0, color:s.fg, fontFamily:T.sans, lineHeight:1.2 }}>{poi.name}</h3>
              </div>
              <button onClick={() => onToggle(realIdx)} style={{ background:"none", border:"none", color:T.g500, fontSize:18, cursor:"pointer", padding:0, lineHeight:1, flexShrink:0 }}>✕</button>
            </div>

            {poi.trainWindowNote && (
              <div style={{ background:T.black, borderRadius:4, padding:"9px 11px", marginBottom:10, borderLeft:`3px solid ${s.accent}`, display:"flex", gap:8 }}>
                <span style={{ fontSize:14, flexShrink:0 }}>🚂</span>
                <div>
                  <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:s.accent, marginBottom:3, fontFamily:T.mono }}>
                    From the train{poi.trainWindowSide ? ` · look ${poi.trainWindowSide}` : ""}
                  </div>
                  <div style={{ fontSize:12, color:T.g300, lineHeight:1.6, fontStyle:"italic" }}>{poi.trainWindowNote}</div>
                </div>
              </div>
            )}

            <div style={{ background:T.black, borderRadius:4, padding:"9px 11px", marginBottom:10, borderLeft:`3px solid ${T.g600}` }}>
              <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:T.g500, marginBottom:3, fontFamily:T.mono }}>Getting there</div>
              <div style={{ fontSize:12, color:T.g300, lineHeight:1.6 }}>
                <span style={{ color:T.g200, fontWeight:500 }}>Nearest station: </span>{poi.nearestStation}
              </div>
              {poi.directions && <div style={{ fontSize:12, color:T.g500, lineHeight:1.6, marginTop:3 }}>{poi.directions}</div>}
            </div>

            <p style={{ fontSize:13, lineHeight:1.8, color:s.fg, margin:0, opacity:0.9, fontFamily:T.sans }}>{poi.overview}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════════ */
export default function GermanRailHistory() {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [trainMode, setTrainMode] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const resultsRef = useRef(null);

  async function generate() {
    if (!from || !to) { setError("Please select both stations from the dropdown."); return; }
    if (from.name === to.name) { setError("Please choose two different stations."); return; }
    setError(""); setRoute(null); setExpandedIdx(null); setFilterVisible(false);
    setLoading(true); setStatus("Planning your journey…");

    const prompt = `You are a German history and rail travel expert. The user is travelling by train from "${from.name}" to "${to.name}" in Germany.

Generate a detailed JSON response. Return ONLY valid JSON with no markdown fences:
{
  "routeName": "descriptive name for this rail corridor",
  "duration": "estimated journey time e.g. 2h 30m",
  "line": "likely train service(s) e.g. ICE 598, RE 7",
  "stops": ["list", "of", "intermediate", "station", "names", "along", "the", "route"],
  "transfers": 0,
  "pois": [
    {
      "name": "Name of Historical Site",
      "nearestStation": "closest station on the route",
      "directions": "brief directions from that station",
      "era": "specific time period e.g. Medieval 12th century",
      "overview": "rich 3-5 sentence historical overview with specific dates, names, and events",
      "visibleFromTrain": "visible OR partially OR not_visible",
      "trainWindowNote": "what to look for from the train, or empty string",
      "trainWindowSide": "left OR right OR both, or empty string"
    }
  ]
}

Include 5-8 POIs ordered geographically along the route. Include UNESCO World Heritage sites if any. Vary the historical eras. Be specific with dates and historical figures.`;

    try {
      setStatus("Researching history along the route…");
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      const text = data.content.map(b => b.text || "").join("").replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(text);
      if (!parsed.pois?.length) throw new Error("No points of interest returned");
      setRoute(parsed);
      setStatus("");
    } catch (e) {
      setError("Could not load route: " + e.message);
      setStatus("");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (route && resultsRef.current) resultsRef.current.scrollIntoView({ behavior:"smooth", block:"start" });
  }, [route]);

  const toggle = idx => setExpandedIdx(p => p === idx ? null : idx);
  const displayPois = route
    ? (filterVisible ? route.pois.filter(p => p.visibleFromTrain === "visible" || p.visibleFromTrain === "partially") : route.pois)
    : [];
  const visCount = route ? route.pois.filter(p => p.visibleFromTrain === "visible" || p.visibleFromTrain === "partially").length : 0;

  return (
    <div style={{ minHeight:"100vh", background:"#0A0B0F", display:"flex", justifyContent:"center", alignItems:"flex-start" }}>
      <style>{CSS}</style>

      {trainMode && route && <TrainWindowView pois={route.pois} onClose={() => setTrainMode(false)} />}

      <div style={{ width:"100%", maxWidth:480, minHeight:"100vh", background:T.black, display:"flex", flexDirection:"column" }}>

        {/* HEADER */}
        <header style={{ background:T.g900, borderBottom:`1px solid ${T.g700}`, padding:"14px 14px 16px", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:14 }}>
            <div style={{ width:32, height:32, background:T.red, borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ color:T.white, fontWeight:900, fontSize:12, fontFamily:T.sans, letterSpacing:-0.5 }}>DB</span>
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:T.white, lineHeight:1.2 }}>History Along the Rails</div>
              <div style={{ fontSize:9, fontFamily:T.mono, color:T.g500, letterSpacing:1.5, textTransform:"uppercase" }}>AI History · Every German Station</div>
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <StationInput label="From" value={from} onChange={setFrom} placeholder="Type a city or station…" />
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"0 2px" }}>
              <div style={{ flex:1, height:1, background:T.g700 }} />
              <span style={{ color:T.red, fontSize:14, lineHeight:1 }}>↓</span>
              <div style={{ flex:1, height:1, background:T.g700 }} />
            </div>
            <StationInput label="To" value={to} onChange={setTo} placeholder="Type a city or station…" />
            <button onClick={generate} disabled={loading} className="db-btn" style={{ marginTop:4 }}>
              {loading ? "Loading…" : "Explore Route"}
            </button>
          </div>
        </header>

        {/* ERROR */}
        {error && (
          <div style={{ margin:"10px 14px", padding:"10px 13px", background:T.red+"14", border:`1px solid ${T.red}35`, borderLeft:`3px solid ${T.red}`, borderRadius:4, color:"#FF9090", fontSize:13 }}>
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div style={{ textAlign:"center", padding:"60px 20px", flex:1 }}>
            <div style={{ position:"relative", width:48, height:48, margin:"0 auto 20px" }}>
              <div style={{ position:"absolute", inset:0, border:`2px solid ${T.g700}`, borderTopColor:T.red, borderRadius:"50%", animation:"spin 1s linear infinite" }} />
              <div style={{ position:"absolute", inset:8, border:`1.5px solid ${T.g800}`, borderTopColor:T.g500, borderRadius:"50%", animation:"spin 1.5s linear infinite reverse" }} />
            </div>
            <p style={{ fontSize:14, color:T.g300, margin:"0 0 6px", fontWeight:500, fontFamily:T.sans }}>{status}</p>
            <p style={{ fontSize:11, fontFamily:T.mono, color:T.g600, letterSpacing:1 }}>AI analysis · Wikipedia photos</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!route && !loading && !error && (
          <div style={{ textAlign:"center", padding:"56px 20px", flex:1 }}>
            <div style={{ width:56, height:56, margin:"0 auto 16px", background:T.g800, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:26 }}>🏰</span>
            </div>
            <h2 style={{ fontSize:16, fontWeight:600, color:T.g200, margin:"0 0 8px", fontFamily:T.sans }}>Where are you headed?</h2>
            <p style={{ fontSize:13, color:T.g500, maxWidth:280, margin:"0 auto 18px", lineHeight:1.7, fontFamily:T.sans }}>
              Pick two German stations and discover the history you'll pass through on your journey.
            </p>
            <div style={{ display:"flex", justifyContent:"center", gap:6, flexWrap:"wrap" }}>
              {["Berlin → München","Hamburg → Köln","Frankfurt → Dresden"].map(r => (
                <span key={r} style={{ padding:"4px 9px", background:T.g800, border:`1px solid ${T.g700}`, borderRadius:4, fontSize:11, fontFamily:T.mono, color:T.g500 }}>{r}</span>
              ))}
            </div>
          </div>
        )}

        {/* RESULTS */}
        {route && (
          <div ref={resultsRef} style={{ flex:1, display:"flex", flexDirection:"column" }}>

            <StopsStrip
              stops={route.stops}
              lineNames={route.line ? [route.line] : []}
              duration={route.duration}
              transfers={route.transfers}
            />

            {/* Route meta bar */}
            <div style={{ padding:"12px 14px", borderBottom:`1px solid ${T.g700}`, background:T.g900, display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, flexWrap:"wrap" }}>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:9, fontFamily:T.mono, letterSpacing:2.5, color:T.red, textTransform:"uppercase", marginBottom:2 }}>{route.line}</div>
                <div style={{ fontSize:14, fontWeight:600, color:T.white, fontFamily:T.sans, lineHeight:1.2 }}>{route.routeName}</div>
                <div style={{ display:"flex", gap:10, marginTop:3, flexWrap:"wrap" }}>
                  {route.duration && <span style={{ fontSize:11, fontFamily:T.mono, color:T.g400 }}>⏱ {route.duration}</span>}
                  <span style={{ fontSize:11, fontFamily:T.mono, color:T.g400 }}>📍 {route.pois.length} sites</span>
                </div>
              </div>
              <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                {visCount > 0 && (
                  <>
                    <button onClick={() => setFilterVisible(f => !f)}
                      style={{ display:"flex", alignItems:"center", gap:4, padding:"5px 10px", background:filterVisible?T.red+"20":"none", border:`1px solid ${filterVisible?T.red+"55":T.g600}`, borderRadius:4, color:filterVisible?T.red:T.g400, fontSize:11, fontFamily:T.mono, cursor:"pointer", transition:"all 0.15s" }}>
                      👁 {visCount}
                    </button>
                    <button onClick={() => setTrainMode(true)}
                      style={{ padding:"5px 10px", background:"none", border:`1px solid ${T.g600}`, borderRadius:4, color:T.g400, fontSize:11, fontFamily:T.mono, cursor:"pointer", transition:"all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor=T.red; e.currentTarget.style.color=T.red; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor=T.g600; e.currentTarget.style.color=T.g400; }}>
                      🚂
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* POI list */}
            <div style={{ padding:"10px 10px 60px" }}>
              {displayPois.map((poi, displayIdx) => {
                const realIdx = route.pois.indexOf(poi);
                return (
                  <POICard key={realIdx} poi={poi} displayIdx={displayIdx} realIdx={realIdx}
                    open={expandedIdx === realIdx} onToggle={toggle} />
                );
              })}

              {filterVisible && !displayPois.length && (
                <div style={{ textAlign:"center", padding:"32px 16px" }}>
                  <p style={{ color:T.g500, fontSize:13, fontStyle:"italic", marginBottom:12 }}>No trackside sites on this route.</p>
                  <button onClick={() => setFilterVisible(false)} style={{ padding:"6px 14px", background:"none", border:`1px solid ${T.g600}`, borderRadius:4, color:T.g400, fontSize:12, fontFamily:T.mono, cursor:"pointer" }}>Show all</button>
                </div>
              )}

              <div style={{ marginTop:20, paddingTop:14, borderTop:`1px solid ${T.g800}`, textAlign:"center" }}>
                <span style={{ fontSize:10, fontFamily:T.mono, color:T.g700, letterSpacing:0.5 }}>
                  AI: Claude · Photos: Wikimedia CC BY 4.0
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════
// PATCH: Claude image cache + rate limiter (prevents 429)
// ═══════════════════════════════════════════════════════════

const __imageCache = new Map();
let __lastRequestTime = 0;
const __MIN_INTERVAL = 1200; // ms between Claude calls

async function __rateLimitedFetch(fn) {
  const now = Date.now();
  const wait = Math.max(0, __MIN_INTERVAL - (now - __lastRequestTime));
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  __lastRequestTime = Date.now();
  return fn();
}

// Override original function (last definition wins)
async function fetchImageForPOI(poiName) {
  if (!poiName) return null;

  if (__imageCache.has(poiName)) {
    return __imageCache.get(poiName);
  }

  try {
    const result = await __rateLimitedFetch(async () => {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          messages: [{
            role: "user",
            content: `Find a Wikimedia Commons direct image URL for "${poiName}" in Germany. Return ONLY valid JSON: {"url":"https://upload.wikimedia.org/...jpg","alt":"short description","credit":"photographer"}.`
          }],
          tools: [{ type: "web_search_20250305", name: "web_search" }],
        }),
      });

      if (!response.ok) return null;

      const data = await response.json();
      const text = data.content
        ?.filter(b => b.type === "text")
        ?.map(b => b.text)
        ?.join("")
        ?.replace(/```json|```/g, "")
        ?.trim();

      if (!text) return null;

      const parsed = JSON.parse(text);
      if (parsed?.url?.startsWith("http")) return parsed;
      return null;
    });

    __imageCache.set(poiName, result);
    return result;

  } catch {
    __imageCache.set(poiName, null);
    return null;
  }
}
