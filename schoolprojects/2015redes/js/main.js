/* 
Noviembre de 2015
Instituto Politécnico Nacional
Escuela Superior de Ingeniería Mecánica y Eléctrica
Ingeniería en Comunicaciones y Electrónica

Tres algoritmos para correción de errores

Materia: Redes básicas

Grupo: 7cv4

Andrade Barrera Marco Antonio
Valencia Fonseca Jorge
 */
    //esta función oculta la presentación y despliega el menú de algoritmos
    iniciar = function(){
        $('#presentacion').toggle('slow');
        $('#menu').toggle('slow');
        $("#log").show();
        $("#log").resizable({
            minHeight: 75,
            minWidth: 618,
            maxWidth: 618
        });
        $("#log").draggable();
        actualizaInterfaz();              
    };

    //limipar log
    limpiarLog = function(){        
        $("#log").empty();
        $("#log").resizable("destroy");
        $("#log").draggable("destroy");
        $("#log").resizable({
            minHeight: 75,
            minWidth: 618,
            maxWidth: 618
        });
        $("#log").draggable();
    };   

    //esta función actualiza la interfaz para ingresar datos
    //de acuerdo al algoritmo seleccionado
    actualizaInterfaz=function(){           
        limpiarLog();
        //localizar cuál algoritmo seleccionó el usuario
        algoritmos = document.getElementsByName("algoritmos");        
        var algoritmo;
        for(var i = 0; i < algoritmos.length; i++){
            if(algoritmos[i].checked){
            algoritmo = algoritmos[i].value;
            }
        }        
        switch(algoritmo){
            case "vrc":
                document.getElementById("vrc").style.display="inline";
                document.getElementById("lrc").style.display="none";
                document.getElementById("crc").style.display="none";
                break;
            case "lrc":
                document.getElementById("vrc").style.display="none";
                document.getElementById("lrc").style.display="inline";
                document.getElementById("crc").style.display="none";
                break;
            case "crc":
                document.getElementById("vrc").style.display="none";
                document.getElementById("lrc").style.display="none";
                document.getElementById("crc").style.display="inline";
                break;
            default:
        }
    };    
    
    //función para desplegar errores o mensajes en consola, div de resultados
    mensaje = function(mensaje,clase,e){
        
        if(clase==="error"){
            if (typeof e === "undefined")
                mensaje = "1 error<br>" + mensaje;
            else
                mensaje = e + " errores<br>" + mensaje;
        }
        else
            mensaje = "0 errores<br>" + mensaje;
        $("#log").resizable("destroy");
        $("#log").html("<span class='"+clase+"'>"+mensaje+"<span>");
        //document.getElementById('log').innerHTML = "<span class='"+clase+"'>"+mensaje+"<span>";
        $("#log").resizable({
            minHeight: 75,
            minWidth: 618,
            maxWidth: 618
        });
    };
    //Mensajes predefinidos
    m01 = "La cadena de bits sólo puede contener ceros y unos. Verifique si no hay espacios u otros caracteres diferentes de 0 y 1";
    m02 = "Debe seleccionar un tipo de paridad.";
    m03 = "Debes escribir cuando menos una secuencia de bits en la caja de texto, o si escribiste una palabra, entonces presiona el botón de actualizar que está en el lado derecho de la caja de bits.";
    m04 = "Escribe una cadena de bits en la caja de texto para bits.";
    m05 = "Escribe un polinomio en la caja de texto para polinomio.";
    
    //deshabilitar Enter en forms
    $('.interfaz').on('keydown', function(event) {
       var x = event.which;
       if (x === 13) {
           event.preventDefault();
       }
    });

///////////////////////////////////////////////////////////////
/*Código para el primer método VRC*/
       
    //función para verificar que la cadena de bits sólo tenga 0's y 1's
    //regresa 1 si sólo hay 1's y 0's. regresa 0 de otro modo
    cerosYunos = function(cadena){
        resultado=1;
        for(var i = 0; i < cadena.length; i++){
            if(cadena.charAt(i)!=='0' && cadena.charAt(i)!=='1'){
                resultado = 0;
            }                
        }
        return resultado;
        };
    
    //Función para verificar errores con el método VRC
    vrc = function(bits,paridad){
        
        limpiarLog();
        //obtener cadena de bits
       //var bits = document.getElementById("vrc.bits").value;       
       
       //verificamos que se haya ingresado algo en la cadena de bits
       if(bits.length<2){
           mensaje("La cadena de bits no es válida. Ingrese cuando menos 8 bits. Uno de paridad y siete de mensaje.","error");
       }
       else{           
           //checar que sean sólo 0's y 1's
           if(cerosYunos(bits)===0){
               mensaje(m01,"error");
           }
           else{               
                   //extraemos bit de paridad
                   bitParidad = bits.charAt(0);
                   //contar número de 1's en el mensaje
                   unos=0;
                   for(var i=1; i<bits.length; i++)
                       if(bits[i]==='1') unos+=1;
                   //determinar si hay error en base a paridad                   
                   if(paridad==="par"){
                       if(bitParidad==='0') esperado="par"; else esperado="impar" ;
                       if(parseInt(bitParidad) !== unos%2)
                           resultado = "p0";                           
                        else
                           resultado = "p1";                           
                   }
                   else{//paridad impar
                       if(bitParidad==='0') esperado="impar"; else esperado="par" ;
                       if(parseInt(bitParidad) === unos%2)
                           resultado = "i0";
                        else
                            resultado = "i1";                           
                    }
           }
       }
       return {
           0:resultado,
           1:esperado,
           2:unos};
    };
    
    //función para desplegar resultados con el método vrc
    vrcd = function(){
        var bits = document.getElementById("vrc.bits").value;
        //determinar qué paridad seleccionó el usuario
        opciones = document.getElementsByName("vrc.paridad");
        var paridad;
        for(var i = 0; i < opciones.length; i++){
            if(opciones[i].checked){
            paridad = opciones[i].value;
             }
         }
        //corroborar que se haya seleccionado un tipo de paridad
        if (typeof paridad === "undefined") {
            mensaje(m02,"error");
        }                
        else{
            resultado = vrc(bits,paridad);
            switch(resultado[0]){
                case "p0":        
                    mensaje("Se encontraron errores en el mensaje.<br>\n\
                                        Número de unos esperado: "+ resultado[1] +"<br>\n\
                                        Número de unos encontrado: "+ resultado[2] +"","error");
                    break;
                case "p1":
                    mensaje("No se encontraron errores en el mensaje.<br>\n\
                                        Número de unos esperado: "+ resultado[1] +"<br>\n\
                                        Número de unos encontrado: "+ resultado[2] +"","mensaje");
                    break;
                case "i0":
                    mensaje("Se detectaron errores en el mensaje.<br>\n\
                                        Número de unos esperado: "+ resultado[1] +"<br>\n\
                                        Número de unos encontrado: "+ resultado[2],"error");
                    break;
                case "i1":
                    mensaje("No se detectaron errores en el mensaje.<br>\n\
                                        Número de unos esperado: "+ resultado[1] +"<br>\n\
                                        Número de unos encontrado: "+ resultado[2],"mensaje");
                    break;
                default:
            }
        }            
    };

///////////////////////////////////////////////////////////////
/*Código para el segundo método LCR*/

    //función para convertir letras a binario
    //el código original está en 
    //http://stackoverflow.com/questions/14430633/how-to-convert-text-to-binary-code-in-javascript
    //jAndy
    lettersToBinary = function(foo)
    {        
        var res = [ ];
        foo.split('').forEach(function( letter ) {
            var bin = letter.charCodeAt( 0 ).toString( 2 ),
            padding = 7 - bin.length;
            res.push( new Array( padding+1 ).join( '0' ) + bin );
        });
        return res;
    };
    
    //función para convertir binario a letras
    binaryToLetter = function(b){
      //conservamos sólo as 7 bits menos significativos, debido a que el bit 8, si lo hay, debe ser de paridad
      if(b.length>7)
          b = b.substr(1);//omitimos el primer bit de izquierda a derecha
      letra = parseInt(b,2);//convertir binario a decimal entero
      return String.fromCharCode(letra);
    };

    //esta función convierte la palabra a bits y los pone en la caja de texto lrc.bits
    palabraAbits = function(){
        palabra = document.getElementById("lrc.palabra").value;
        if(palabra.length===0)
            mensaje("La palabra debe tener cuando menos un caracter.","error");
        else{
            if(true){
            //if(confirm("Si continua, el contenido de la caja de texto con bits será remplazado. ¿Desea continuar?")){
                bits = lettersToBinary(palabra);
                document.getElementById("lrc.bits").value = bits;
            }
        }
            
    };
    
    //esta función convierte las cadenas de bits a una palabra y la pone en la cada de texto lrc.palabra
    bitsApalabra = function() {
      limpiarLog();
      var bits = document.getElementById("lrc.bits").value;
      var palabra = "";
      if(bits.length===0)
          mensaje(m03,"error");
      else{
          if(true){
          //if(confirm("Si continua, el contenido de la caja de texto con la palabra será remplazado. ¿Desea continuar?")){
              abits = bits.split(",");                
              for(var i=0; i < abits.length; i++){
                  letra = abits[i];                  
                  //verrificar que sólo haya 0's y 1'
                  if(cerosYunos(letra)!==1){
                      mensaje("Se encontró un error en la secuencia "+(i+1)+
                              ". "+m01,"error");
                      break;
                  }                  
                  //verificar que las cadenas sean de 7 u 8 bits
                  if(letra.length!==7 && letra.length!==8){
                      mensaje("Se encontró un error en la secuencia "+(i+1)+
                              ". Debe tener 7 digitos si no se ha agregado el\n\
                                 bit de paridad u 8 digitos si se incluye el bit de paridad.","error");
                        break;
                  }
                  palabra += binaryToLetter(letra);                  
              }                            
              document.getElementById("lrc.palabra").value=palabra;
          }
      }
    };
    
    //esta función agrega el bit de paridad correcto a las secuencias de bits en lrc.bits en base al
    //número de 1's y el tipo de paridad seleccionado
    agregarBitParidad = function(){
        limpiarLog();
        var bits = document.getElementById("lrc.bits").value;
        var bitsVRC = "", bitsLRC="";
        if(bits.length===0){
            mensaje(m03,"error");
        } else{
            //determinar qué paridad seleccionó el usuario
            opciones = document.getElementsByName("lrc.paridad");
            var paridad;
            for(i = 0; i < opciones.length; i++){ 
                if(opciones[i].checked){
                    paridad = opciones[i].value;
                }                
            }
            //corroborar que se haya seleccionado un tipo de paridad
            if (typeof paridad === "undefined") {
                mensaje(m02,"error");
            } else{
                if(true){
                //if(confirm("Si continua y ya se agregaron bits de paridad, estos serán remplazados por los bits de paridad correctos. ¿Desea continuar?")){
                    abits = bits.split(",");
                    for(i=0; i < abits.length; i++){
                        secuencia = abits[i];
                        //verrificar que sólo haya 0's y 1'
                        if(cerosYunos(secuencia)!==1){
                            mensaje("Se encontró un error en la secuencia "+(i+1)+
                              ". "+m01,"error");
                            return;
                            break;
                        }
                        //verificar que las cadenas sean de 7 u 8 bits
                        if(secuencia.length!==7 && secuencia.length!==8){
                            mensaje("Se encontró un error en la secuencia "+(i+1)+
                              ". Debe tener 7 digitos si no se ha agregado el\n\
                                 bit de paridad u 8 digitos si se incluye el bit de paridad.","error");
                            return;
                            break;
                        }
                        //contar número de 1's en el mensaje
                        unos=0;
                        if(secuencia.length===7) inicio=0; else inicio = 1;
                        for(var j=inicio; j<secuencia.length; j++)
                        if(secuencia[j]==='1') unos+=1;
                        
                        if(paridad==="par"){
                            if(unos%2===0)//número de unos par
                                bitsVRC += (',0' + secuencia.substr(inicio));
                            else
                                bitsVRC += (',1' + secuencia.substr(inicio));
                        } else{
                            if(unos%2===0)//número de unos par
                                bitsVRC += (',1' + secuencia.substr(inicio));
                            else
                                bitsVRC += (',0' + secuencia.substr(inicio));
                        }
                    }
                    document.getElementById("lrc.bits").value=bitsVRC.substr(1);//a partir del segundo caracter porque el primero es una coma
                    
                    //ahora creamos la secuencia de bits LRC
                    abits = bitsVRC.substr(1).split(",");
                    for(j=0; j<8; j++){
                        unos=0;                        
                        for(i=0; i<abits.length; i++){
                            secuencia = abits[i];
                            if(secuencia[j]==='1') unos+=1;
                        }                            
                        if(paridad==="par"){
                            if(unos%2 === 0)
                                bitsLRC += "0";
                            else
                                bitsLRC += "1";
                        }
                        else{
                            if(unos%2 === 0)
                                bitsLRC += "1";
                            else
                                bitsLRC += "0";
                        }
                    }                    
                    document.getElementById("lrc.secuencia").value=bitsLRC;                    
                }
            }
        }
    };
    
 //función para verificar y desplegar errores con lrc
 
 lcrd = function(){
     limpiarLog();
     var resultado;//resultado para VRC
     var bits = document.getElementById("lrc.bits").value;
     if(bits.length===0){
         mensaje(m03,"error");
         return;
     }
     //determinar qué paridad seleccionó el usuario
     opciones = document.getElementsByName("lrc.paridad");
     var paridad;
     for(i = 0; i < opciones.length; i++)
     {
         if(opciones[i].checked)
         {
         paridad = opciones[i].value;
         }
     }
     //corroborar que se haya seleccionado un tipo de paridad
     if (typeof paridad === "undefined") {
           mensaje(m02,"error");
           return;
       }
     else{
        abits = bits.split(",");
        errores=0; me="";
        /////verificamos VRC
        for(i=0; i < abits.length; i++){
            secuencia = abits[i];                  
            //verrificar que sólo haya 0's y 1'
            if(cerosYunos(secuencia)!==1){
                mensaje("Se encontró un error en la secuencia "+(i+1)+
                        ". "+m01,"error");
                return;
                break;
            }                  
            //verificar que las cadenas sean de 8 bits
            if(secuencia.length!==8){
                mensaje("Se encontró un error en la secuencia "+(i+1)+
                        ". Debe tener 7 digitos si no se ha agregado el\n\
                           bit de paridad u 8 digitos si se incluye el bit de paridad.\n\
                            Antes de verificar, asegurese que las secuencias tienen 8 bits en total.\n\
                            Presione 'Agregar bit de paridad' si quiere que la aplicación\n\
                            genere automáticamente estos bits.","error");
                 return;
                  break;
            }
            //contar número de 1's en el mensaje
             unos=0;
             if(secuencia.length===7) inicio=0; else inicio = 1;
             for(var j=inicio; j<secuencia.length; j++)
                 if(secuencia[j]==='1') unos+=1;
             
             resultado=vrc(secuencia,paridad);
             switch(resultado[0]){
                case "p0":        
                    me+="Se detectaron errores en la secuencia " + (i+1) + ".<br>\n\
                                        &nbsp;Número de unos esperado: "+ resultado[1] +"<br>\n\
                                        &nbsp;Número de unos encontrado: "+ resultado[2] + "<br>------------------<br>";
                    errores += 1;
                    break;
                case "p1":
                    me+="No se detectaron errores en la secuencia " + (i+1) + ".<br>\n\
                                        &nbsp;Número de unos esperado: "+ resultado[1] +"<br>\n\
                                        &nbsp;Número de unos encontrado: "+ resultado[2] + "<br>------------------<br>";
                    break;
                case "i0":
                    me+="Se detectaron errores en la secuencia " + (i+1) + ".<br>\n\
                                        &nbsp;Número de unos esperado: "+ resultado[1] +"<br>\n\
                                        &nbsp;Número de unos encontrado: "+ resultado[2] + "<br>------------------<br>";
                    errores += 1;
                    break;
                case "i1":
                    me+="No se detectaron errores en la secuencia " + (i+1) +".<br>\n\
                                        &nbsp;Número de unos esperado: "+ resultado[1] +"<br>\n\
                                        &nbsp;Número de unos encontrado: "+ resultado[2] + "<br>------------------<br>";
                    break;
                default:
            }            
     }
     me = "------------------<br>Resultados de VRC<br>------------------<br>" + me;
     /////Verificamos LRC
     me2="------------------<br>Resultados de LRC<br>------------------<br>";
     bitsLRC=document.getElementById("lrc.secuencia").value;
     for(j=0; j<8; j++){
         unos=0;                        
         for(i=0; i<abits.length; i++){
             secuencia = abits[i];
             if(secuencia[j]==='1') unos+=1;
         }
         //alert(unos);
         if(paridad==="par"){
             if(unos%2 === parseInt(bitsLRC[j]))
                 me2 += "No se detectaron errores en la columna "+(j+1)+
                     "<br>&nbsp;Número de unos encontrado: "+ unos + "<br>------------------<br>";
             else{
                 me2 += "Se detectaron errores en la columna "+(j+1)+
                     "<br>&nbsp;Número de unos encontrado: "+ unos + "<br>------------------<br>";
                errores+=1;
             }
         }
         else{
             if(unos%2 !== parseInt(bitsLRC[j]))
                 me2 += "No se detectaron errores en la columna "+(j+1)+
                     "<br>&nbsp;Número de unos encontrado: "+ unos + "<br>------------------<br>";
             else{
                 me2 += "Se detectaron errores en la columna "+(j+1)+
                     "<br>&nbsp;Número de unos encontrado: "+ unos + "<br>------------------<br>";
                errores+=1;
             }
         }
     }                    } 
     if(errores>0)
         mensaje(me2+me,"error",errores);
     else
         mensaje(me2+me,"mensaje");
    document.getElementById("lrc.mensaje").value=bitsLRC+ " " + bits.split(",").join("");
 }; 
 
 ///////////////////////////////////////////////////////////////////////
 //TErcer algoritmo CRC
 //
 
 //genera un polinomil del tipo X^7+X^3+X^0 que corresponde a una secuencia de bits 10001001
 polDesdeBits = function(bits){
     r="";
     p=bits.length-1;
     for(i=0; i<bits.length; i++){         
            r += ("+"+bits[i]+"X^"+p);
            p--;
     }
     return r.substr(1);
 };
 
 //en la parte del mensaje, esta función permite actualizar el polinomio en base a la
 //cadena de bits ingresada
 uPolFromBitsMes = function(box){
     limpiarLog();     
     v = document.getElementById(("crc.bits"+box)).value;     
     if(v.length===0){//revisar que haya cuando menos un bit
         mensaje(m04,"error");
         return;
     }
     else{
         if(cerosYunos(v)===0)
             mensaje(m01,"error");
         else
             document.getElementById(("crc.pol"+box)).value = polDesdeBits(v);
             
     }
 };
 
 ////genera una secuencia de bits 10001001 que corresponde a un polinomil del tipo X^7+X^3+X^0
 bitsDesdePol = function(pol){
   vbits = pol.split("+");//creamos un vector con cada uno de los términos del polinimio
   bits = "";
   for(i=0; i<vbits.length; i++){       
       coef=""; term = vbits[i];
       switch(term[0]){
           case "X":
               coef="1";
               term = coef + term;
               break;
           case "x":
               coef="1";
               term = coef + term;
               break;
           case "0":
               coef="0";
               break;
           case "1":
               coef="1";
               break;
           default:
               return {0: "error", 1: " en el término " + (i+1) + ". El coeficiente de X debe ser 0 o 1. Usted escribió: ", 2: vbits[i]};
       }       
       if(term[1]!=="X" && term[1]!=="x"){
           return{0: "error", 1: " en el término " + (i+1) + ". Debe escribir el coeficiente (0,1) y justo después X. usted escribió: ", 2: vbits[i]};
       }
       else{
           if(term[2]!=="^"){
               return{0: "error", 1: " en el término " + (i+1) + ". Después de X debe poner el simbolo de potencia ^. Usted escribió: ", 2: vbits[i]};
           }
           else {
               if(i===0)
                   potencia=term.substr(3);
               if(isNaN(parseInt(potencia)))
                   return{0: "error", 1: " en el término " + (i+1) + ". Debe poner una potencia entera después de ^. Usted escribió: ", 2: vbits[i]};
               else{
                   if((-parseInt(potencia) + parseInt(term.substr(3)))>0)
                       return{0: "error", 1: " en el término " + (i+1) + ". Debe poner el polinomio en orden descendente. Usted escribió: ", 2: vbits[i]};
                   if((parseInt(potencia) - parseInt(term.substr(3)))>1){                       
                       for(j=0; j<(parseInt(potencia) - parseInt(term.substr(3))-1); j++)
                           bits += "0";                       
                   }       
                   potencia=term.substr(3);
                   if(isNaN(parseInt(potencia)))
                       return{0: "error", 1: " en el término " + (i+1) + ". Debe poner una potencia entera después de ^. Usted escribió: ", 2: vbits[i]};
                   if(parseInt(potencia)!==0 && i===(vbits.length-1))
                       for(j=0; j<parseInt(potencia); j++)
                           bits += "0";                       
               }
           }
       }
       bits += coef;
   }
   return bits;
 };
 
 //en la parte del mensaje, esta función permite actualizar la cadena de bits en base al
 //polinomio ingresado
 uBitsFromPolMes = function(box){//se agregó v para tener la posibilidad de aplicar la f tanto al mensaje como al polinomio generado
     limpiarLog();      
     v = document.getElementById("crc.pol"+box).value;
     if(v.length===0){//revisar que haya cuando menos un bit
         mensaje(m05,"error");
         return;
     }
     else{
         resultado = bitsDesdePol(v);
         if(resultado[0]==="error")
             mensaje(resultado[1] + resultado[2],"error");                      
         else{
             document.getElementById("crc.bits"+box).value = resultado;
         }
     }
 };
 
 uPolFromBitsGen = function(box){
     uPolFromBitsMes(box);
 };
 
 uBitsFromPolGen = function(box){
     uBitsFromPolMes(box);
 };
 
 //realiza un xor entre dos sucesiones de bits. Deben ser del mismo tamaño
 xor = function(s1,s2){     
     var resultado="";
     for(i=0; i<s1.length; i++)
         if(s1[i]===s2[i]){ 
             resultado += "0";
         } else{         
            resultado += "1";
         }
     return resultado;         
 };
 
 //función para generar espacios en blanco
 espacios = function(n){
     var r = "";
     for(i=0; i<n;i++)
         r += "&nbsp;";
     return r;
 };
    
 //regresa la potencia más alta + 1 de una secuencia de bit. Ej. 0011001 regresa 5
 powBits = function(r){
     rSize=0;
     for(i=0; i<r.length; i++)
        if(r[i]==="1"){
            rSize = r.length - i;
            break;
        }
    return rSize;
 };
 
 crc = function(){
     me="";
     bitsMensaje = document.getElementById("crc.bitsMensaje").value;
     bitsGenerador = document.getElementById("crc.bitsGenerador").value;
     me += "$M(x)=" + bitsMensaje + "$<br>";
     me += "$M(x)=" + document.getElementById("crc.polMensaje").value + "$<br>";
     me += "$G(x)=" + bitsGenerador + "$<br>";
     me += "$G(x)=" + document.getElementById("crc.polGenerador").value + "$<br>";
     me += "----------------------<br>Operaciones XOR<br>----------------------<br>";
     margen=10;
     me += espacios(margen) + bitsMensaje + "<span style='color: gray;'>" + (new Array(bitsGenerador.length).join('0')) +"</span><br>";//&oplus;";
     bitsMensaje += (new Array(bitsGenerador.length).join('0'));//completamos el mensaje agregando ceros al final (derecha)
     posIni=0; posFin = bitsGenerador.length; bitsRestantes = bitsMensaje.length;
     s1 = bitsMensaje.slice(posIni,posFin);//extraer cadena de caracteres a dividir con el pol generador
     bitsRestantes -= bitsGenerador.length;
     while(bitsRestantes){//realizamos operaciones mientra aún queden bits         
         r = xor(s1,bitsGenerador);//guardar resultado de xor
         me += espacios(margen) + bitsGenerador + "<br>";
         me += espacios(margen-2) + "&oplus;----------<br>";         
         //revisamos qué posición tiene el bit más significativo diferente de 1 de r
         rSize = powBits(r);
                  
         //bajamos bits para completar resultado y continuar con XOR de nuevo
         while(bitsRestantes>0 && powBits(r)<bitsGenerador.length){
             r += bitsMensaje.slice(posFin,posFin+1);
             posFin++;
             bitsRestantes--;
             //alert(r);alert(bitsRestantes);
         }
         me += espacios(margen) + r + "<br>";
         s1 = r.slice(r.length-rSize);
         margen += (r.length - powBits(r));
         //bitsRestantes -= (bitsGenerador.length + r.length - rSize);
     }
     
     me += "Por lo tanto <br> $R(x) = $" + r.slice(r.length-bitsGenerador.length) + "<br>";
     bitsMensaje = document.getElementById("crc.bitsMensaje").value + r.slice(r.length-bitsGenerador.length+1);
     bitsMensaje = prompt("Se enviará la secuencia de bits:",bitsMensaje);
     me += "$M(x) + R(x) = $" + bitsMensaje + "<br>";
     
     me += "----------------------<br>Volvemos a Operaciones XOR para verificar errores<br>----------------------<br>";
     
     margen=10;
     me += espacios(margen) + document.getElementById("crc.bitsMensaje").value + "<span style='color: gray;'>" + r.slice(r.length-powBits(r)) +"</span><br>";
     posIni=0; posFin = bitsGenerador.length; bitsRestantes = bitsMensaje.length;
     s1 = bitsMensaje.slice(posIni,posFin);//extraer cadena de caracteres a dividir con el pol generador
     bitsRestantes -= bitsGenerador.length;
     while(bitsRestantes){//realizamos operaciones mientra aún queden bits         
         r = xor(s1,bitsGenerador);//guardar resultado de xor
         me += espacios(margen) + bitsGenerador + "<br>";
         me += espacios(margen-2) + "&oplus;----------<br>";         
         //revisamos qué posición tiene el bit más significativo diferente de 1 de r
         rSize = powBits(r);
                  
         //bajamos bits para completar resultado y continuar con XOR de nuevo
         while(bitsRestantes>0 && powBits(r)<bitsGenerador.length){
             r += bitsMensaje.slice(posFin,posFin+1);
             posFin++;
             bitsRestantes--;
             //alert(r);alert(bitsRestantes);
         }
         me += espacios(margen) + r + "<br>";
         s1 = r.slice(r.length-rSize);
         margen += (r.length - powBits(r));
         //bitsRestantes -= (bitsGenerador.length + r.length - rSize);
     }
     
     me += "<br> Resultado: " + r.slice(r.length-bitsGenerador.length) + "<br><br>";
     if(powBits(r)===0)
     {
         me+= "No se detectaron errores en el mensaje.";
         mensaje(me,"mensaje");
     }
     else{
         me+= "Se detectaron errores en el mensaje.";
         mensaje(me,"error");
     }

     //actualiza fórmulas en el log
     MathJax.Hub.Queue(["Typeset",MathJax.Hub,"log"]);
 };
 
//desplegar pantalla principal
$('#main').show();
//actualizar interfaz para ingresar datos del método
//actualizaInterfaz();