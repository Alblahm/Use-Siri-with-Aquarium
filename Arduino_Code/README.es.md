## Tareas de Crontab <a href="https://github.com/Alblahm/Voice-Controled-Acuarium/blob/master/Arduino_Code/README.es.md"><img src="https://github.com/Alblahm/Voice-Controled-Acuarium/blob/master/img/Flag_of_Spain.png" align="right" hspace="0" vspace="0" width="35px"></a> <a href="https://github.com/Alblahm/Voice-Controled-Acuarium/blob/master/Arduino_Code/README.md"><img src="https://github.com/Alblahm/Voice-Controled-Acuarium/blob/master/img/Flag_of_Union.png" align="right" hspace="0" vspace="0" width="35px"></a>

Puedes añadir a tu arduino Yun las tareas de Crontab incluidas en estos archivos para controlar toda la programación de tu acuario.

Tan solo copia y pega los contenidos de uno de ellos dentro del crontab accediendo al servidor web del arduino Yun. A continuación reinicia
tu arduino Yun. Y este controlará todos los dispositivos conectados a tu acuario. No hay límite para el número de tareas que puedes añadir
a esta lista.

* El archivo "Crontab_es_Kodi.txt" incluye algunos comandos que permiten lanzar una ventana emergente en tu smartcenter Kodi con un mensaje.
Estos mensajes se pueden emplear como feedback para saber que está haciendo tu acuario, y si está haciendo las cosas en el orden correcto.

* El archivo "Crontab_es_Local.txt" incluye comandos para almacenar los comandos en un archivo local en la tarjeta SD del arduino Yun.

Ambos archivos incluyen los comandos necesarios para encender y apagar las luces del acuario, y también para controlar el ruidoso filtro
del acuario para que se apague durante la noche. Esto es muy saludable para los peces, ya que simula el comportamiento de la luz en su
ambiente natural. 
