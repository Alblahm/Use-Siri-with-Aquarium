
## Crontab Tasks <a href="https://github.com/Alblahm/Voice-Controled-Acuarium/blob/master/Arduino_Code/README.es.md"><img src="https://github.com/Alblahm/Voice-Controled-Acuarium/blob/master/img/Flag_of_Spain.png" align="right" hspace="0" vspace="0" width="35px"></a> <a href="https://github.com/Alblahm/Voice-Controled-Acuarium/blob/master/Arduino_Code/README.md"><img src="https://github.com/Alblahm/Voice-Controled-Acuarium/blob/master/img/Flag_of_Union.png" align="right" hspace="0" vspace="0" width="35px"></a>

This Crontab tasks can be added to your arduino Yun to manage all the program activities of your acuarium.

Only copy and paste the contents of one of them inside the crontab Tab inside the Yun web server. Then reboot your arduino and it will control all your connected devices in the way described inside this task file. There is no limit on the tasks you can add to this list.

* The "Crontab_es_Kodi.txt" file includes some commands to send a popup screen window to your kodi smartcenter with some messages, this 
can be used to get feedback about what is your acuarium doing, and whether it is doing in the right order.

* The "Crontab_es_Local.txt" file includes some commands to save the changes in a local log file inside the arduino yun SD.

Both files include the commands to turn off and on the lights of the acuarium and also to control the noisy water
pump to turn it off during night. It is also very healthy for the fishes (it resembles the natural environment), so the fishes will 
survive longer.
