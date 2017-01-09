#Seed of garbage truck by Jagoda R.


zalozenia:
jesli ma tylko gdzies jechac to podajemy tylko numer domu/smietnisko, reszta na false
jesli sie da - gdy mamy numer domu może byc na true take, gdy landfill to tylko true jest leave, nie ozstawiamy smieci w domu i nie bierzemy ich ze smietniska
{
  home : numer, // do jakiego dmu ma jechac
  pick: true/false, //czy ma cos zabrac
  leave: true/false, //czy ma coś zostawic
  paper: true/false
  plastic: true/false
  glass: true/false //co ma zabrac
  other: true/false //jesli wszystko to wszystko jest na true !!!
}
