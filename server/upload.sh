cd "C:/Users/Marci/Documents/Programming/Techtabor/CityQuest/server/"
#scp -rp -P 222 * szm@cityquesta.altalo.com:techtabor
scp -rp -P 222 app.js team.js szm@cityquesta.altalo.com:techtabor
scp -rp app.js team.js cityquest@cityquestb.altalo.com:techtabor
#scp -rp * cityquest@cityquestb.altalo.com:techtabor
ssh -n -f szm@cityquesta.altalo.com -p 222 "sh -c 'nohup ./start.sh > /dev/null 2>&1 &'"
ssh -n -f cityquest@cityquestb.altalo.com "sh -c 'nohup ./start.sh > /dev/null 2>&1 &'"