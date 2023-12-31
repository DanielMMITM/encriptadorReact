import Terminal, { TerminalOutput } from "react-terminal-ui";
import { Footer } from "../Components/Footer/Footer";
import { NavBar } from "../Components/NavBar/NavBar";
import { useState } from "react";
import '../css/Algorithm.css'
import { ScrollRestoration } from "react-router-dom";

export function Encrypt(){

    const [terminalLineData, setTerminalLineData] = useState();


    const consumeColumn = async (terminalInput) => {
        let text = "", algoritmo = "", key = "", rowsNumber = 0, columnsNumber = 0, textBoolean, algoritmoBoolean, rowsNumberBoolean, keyBoolean, decrypt, columnsNumberBoolean;
        let myArray = terminalInput.split(" ");
        for (let i = 0; i < myArray.length; i++) {
            if (myArray[i].startsWith("-")) {
                algoritmoBoolean = textBoolean = rowsNumberBoolean  = keyBoolean = columnsNumberBoolean = false;
                switch (myArray[i]) {
                    case "-t":
                        textBoolean = true;
                        break;
                    case "-a":
                        algoritmoBoolean = true;
                        break;
                    case "-rn":
                        rowsNumberBoolean = true;
                        break;
                    case "-k":
                        keyBoolean = true;
                        break;
                    case "-d":
                        decrypt = true;
                        break;
                    case "-cn":
                        columnsNumberBoolean = true;
                        break;
                    default:
                        console.log("Error en default")
                        const terminalOutputRes = <TerminalOutput>{setTerminalLineData("Introduce una bandera existente")}</TerminalOutput>
                        return terminalOutputRes;
                }
            }
            else if (textBoolean) {
                text = text + " " + myArray[i];
            }
            else if (algoritmoBoolean) {
                if (myArray[i] === "Columna" || myArray[i] === "Clave") {
                    if (myArray[i + 1].startsWith("-")) {
                        algoritmo = myArray[i]
                    }
                    else {
                        console.log("Error en algoritmo parametros")
                        const terminalOutputRes = <TerminalOutput>{setTerminalLineData("Introdujiste parametros de más")}</TerminalOutput>
                        return terminalOutputRes;
                    }
                }
                else {
                    console.log("Error en algoritmo inexistente")

                    const terminalOutputRes = <TerminalOutput>{setTerminalLineData("Ese algoritmo no existe")}</TerminalOutput>
                    return terminalOutputRes;
                    
                }
            }
            else if (rowsNumberBoolean) {
                if (parseInt(myArray[i]) === 3 || parseInt(myArray[i]) === 4 || parseInt(myArray[i]) === 5) {
                    rowsNumber = parseInt(myArray[i]);
                }
                else {
                    console.log("Error en filas")

                    const terminalOutputRes = <TerminalOutput>{setTerminalLineData("Solo se permite de 3 a 5 filas")}</TerminalOutput>
                    return terminalOutputRes;
                }
            }
            else if (columnsNumberBoolean) {
                columnsNumber = parseInt(myArray[i]);

            }
            else if (keyBoolean) {
                key = key + " " + myArray[i];
            }
            else {
                console.log("Error incompleto")

                const terminalOutputRes = <TerminalOutput>{setTerminalLineData("Error. Asegurate de escribir la instruccion como se indica")}</TerminalOutput>
                return terminalOutputRes;
                
            }
        }
        if (algoritmo !== "" && (rowsNumber !== 0 || key !== "" || columnsNumber !== 0)) {
            if (algoritmo === "Columna" && !decrypt) {
                try {
                    const response = await fetch('http://localhost:8080/crypt/' + text + '/' + rowsNumber);
                    let data = await response.text();
                    const terminalOutputRes = <TerminalOutput>{setTerminalLineData(data)}</TerminalOutput>
                    return terminalOutputRes;
                }
                catch (err) {
                    console.log(err);
                    const terminalOutputRes = <TerminalOutput>{setTerminalLineData("Ocurrio un error, vuelve a intentarlo")}</TerminalOutput>
                    return terminalOutputRes;
                }         
            }
            else if (algoritmo === "Columna" && decrypt) {
                try {
                    const response = await fetch('http://localhost:8080/decrypt/' + text + '/' + columnsNumber);
                    let data = await response.text();
                    const terminalOutputRes = <TerminalOutput>{setTerminalLineData(data)}</TerminalOutput>
                    return terminalOutputRes;
                }
                catch (err) {
                    console.log(err);
                    const terminalOutputRes = <TerminalOutput>{setTerminalLineData("Ocurrio un error, vuelve a intentarlo")}</TerminalOutput>
                    return terminalOutputRes;
                }         
            }
            else if (algoritmo === "Clave" && !decrypt) {
                try {
                    const response = await fetch('http://localhost:8080/crypt?text=' + text + "&key=" + key);
                    let data = await response.text();
                    const terminalOutputRes = <TerminalOutput>{setTerminalLineData(data)}</TerminalOutput>
                    return terminalOutputRes;
                }
                catch (err) {
                    console.log(err);
                    const terminalOutputRes = <TerminalOutput>{setTerminalLineData("Ocurrio un error, vuelve a intentarlo")}</TerminalOutput>
                    return terminalOutputRes;
                } 
            }
            else if(algoritmo === "Clave" && decrypt) {
                try {
                    const response = await fetch('http://localhost:8080/decrypt?text=' + text + "&key=" + key);
                    let data = await response.text();
                    const terminalOutputRes = <TerminalOutput>{setTerminalLineData(data)}</TerminalOutput>
                    return terminalOutputRes;
                }
                catch (err) {
                    console.log(err);
                    const terminalOutputRes = <TerminalOutput>{setTerminalLineData("Ocurrio un error, vuelve a intentarlo")}</TerminalOutput>
                    return terminalOutputRes;
                } 
            }
        }
        else {
            const terminalOutputRes = <TerminalOutput>{setTerminalLineData("Error. Asegurate de escribir la instruccion como se indica")}</TerminalOutput>
            console.log("Error en fetch no se introdujo la instruccion completa");
            return terminalOutputRes;
        }
    }

    return (
        <>
            <ScrollRestoration/>
            <header>
                <NavBar></NavBar>
            </header>
            <section>
                <div className="containerTerminal">
                    <Terminal height="332px" name='Encripta tu texto' onInput={ terminalInput => consumeColumn(terminalInput) }>
                        <TerminalOutput key={"WelcomeText"}>Introduce una sentencia de encriptacion</TerminalOutput>
                        { terminalLineData }
                    </Terminal>
                </div>
                <div className="consoleInstructions">
                    <h3>Instrucciones de uso</h3>
                    <p>Para utilizar adecuadamente la consola y poder encriptar el texto mediante los algoritmos disponibles, ten en cuenta las siguientes indicaciones. De no seguirlas no sera llevada a cabo la encriptacion de tu texto</p>
                    <ul className="listInstructions">
                        <li>Utiliza -t y enseguida coloca el texto que deseas encriptar.</li>
                        <li>Utiliza -a y enseguida escribe el algoritmo que deseas utilizar (Clave o Columna). Actualmente solo se cuenta con algoritmos de transposicion por columna o transposicion por clave</li>
                        <li>Utiliza -rn y enseguida indica el numero de filas con el que deseas encriptar tu texto (3, 4 o 5).</li>
                        <li>Utiliza -k y enseguida introduce la clave con la que deseas encriptar tu texto.</li>
                        <li>Para descifrar por columna reescribe la sentencia pero asegurate de cambiar la bandera "-rn" por "-cn" e introduce el numero de columnas que se te dio al cifrar el texto y añade "-d" al final de la sentencia.</li>
                        <li>Para descifrar por clave reescribe la misma sentencia pero añade "-d" al final de la sentencia.</li>
                    </ul>
                </div>
            </section>
            <footer>
                <Footer></Footer>
            </footer>
        </>
    )
}

export default Encrypt;
