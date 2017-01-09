/*{
  home : numer_domu, // do jakiego dmu ma jechac
  landfill : "true"/"false", // jak ma jechac na wysypisko
  take: "true"/"false", //czy ma cos zabrac
  leave: "true"/"false", //czy ma coś zostawic
  paper: "true"/"false"
  plastic: "true"/"false"
  glass: "true"/"false" //co ma zabrac
  other: "true"/"false" //jesli wszystko to wszystko jest na "true" !!!
}*/
/*:- module(smieciarka,
      [  rozkaz/5
      ]).*/

jest("mieszane",trash).
jest("szkło",trash).
jest("plastik",trash).
jest("papier",trash).

komenda("zabierz", "false", "true", "false").
komenda("wywieź", "true", "false", "true").

jakiesmieci("papier", "true", "false", "false", "false").
jakiesmieci("plastik", "false", "true", "false", "false").
jakiesmieci("szkło", "false", "false", "true", "false").
jakiesmieci("mieszane", "false", "false", "false", "true").

lokacja("z domku nr", Nr).
lokacja("na wysypisko", Nr).


/*wywiez szklo na wysypisko nr 5*/

/*jesli zabierz*/
rozkaz(CoZrob,ZCzym,SkadGdzie,Adres,Reszta) :-
    komenda(CoZrob,CzyNaWysypisko,CzyZabiera,CzyZostawia),
    jest(ZCzym,trash),
    jakiesmieci(ZCzym,Paper,Plastic,Glass,Other),
    lokacja(SkadGdzie, Adres),
    format('{ home: ~w, ' , [Adres]),
    format('landfill: ~w, ', [CzyNaWysypisko]),
    format('take: ~w, ', [CzyZabiera]),
    format("leave: ~w, ", [CzyZostawia]),
    format("paper: ~w, ", [Paper]),
    format("plastic: ~w, ", [Plastic]),
    format("glass: ~w, ", [Glass]),
    format("other: ~w }", [Other]).
