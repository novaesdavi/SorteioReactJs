import React, { Component } from "react";
import _forEach from 'lodash/forEach';
import './Sorteio.css';

export default class Sorteio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valorInicial_valor: 0,
            valorFinal_valor: 0,
            resultado_valor: 0,
            sorteioRodando: false,
        }

        this.IniciarSorteio = this.IniciarSorteio.bind(this);
        this.ControlarSorteio = this.ControlarSorteio.bind(this);
        this.setStatusSorteio = this.setStatusSorteio.bind(this);
        this.ResetSorteio = this.ResetSorteio.bind(this);
    }

    ResetSorteio() {

        setResetMemoria();
        let valorInicial_valor = 0;
        let valorFinal_valor = 0;
        let resultado_valor = 0;
        let sorteioRodando = false;

        this.setState({ valorInicial_valor, valorFinal_valor, resultado_valor, sorteioRodando });


    }

    IniciarSorteio() {

        let inicial_valor = parseInt(this.state.valorInicial_valor);
        let final_valor = parseInt(this.state.valorFinal_valor);

        let resultado_valor = getRandomInt(inicial_valor, final_valor);
        this.setState({ resultado_valor });
        setIniciaMemoriaSorteio(resultado_valor, final_valor);
        setMemoriaSorteio(resultado_valor, final_valor);
        console.log(resultado_valor);
        this.setStatusSorteio(true);

    }

    ControlarSorteio() {
        let resultado = 0;
        let exibirResultado = false;
        let finalizar = false;

        if (this.state.resultado_valor === "Sorteio Concluído") { this.ResetSorteio(); return; }

        let inicial_valor = parseInt(this.state.valorInicial_valor);
        let final_valor = parseInt(this.state.valorFinal_valor);
        resultado = getRandomInt(inicial_valor, final_valor);
        console.log("inciando do:" + resultado);
        do {
            if (getItemExistenteSorteio(resultado) === true && getEspacoLivreMemoria() === true) {
                console.log("entrou no if do do:" + resultado);
                resultado = getRandomInt(inicial_valor, final_valor);
            } else if (getEspacoLivreMemoria() === false) {
                console.log("entrou no if espaço livre" + resultado);
                finalizar = true;
            }
            else if (setMemoriaSorteio(resultado, final_valor) === true) {
                console.log("entrou no if set memoria" + resultado);
                exibirResultado = true;
            }
        } while (exibirResultado === false && finalizar === false);


        let resultado_valor = "";
        if (exibirResultado) {
            resultado_valor = parseInt(resultado);
        } else {
            resultado_valor = "Sorteio Concluído";
        }

        this.setState({ resultado_valor });


    }

    setStatusSorteio(valor_execucao) {
        let sorteioRodando = valor_execucao;
        this.setState({ sorteioRodando });
    }

    render() {
        const { sorteioRodando } = this.state;
        return (
            <div className="sorteio">
                <div style={{ display: !sorteioRodando ? "block" : "none" }}>
                    <h2>Sorteio por numero</h2>
                    <span>Valor Incial</span>
                    <input type="text" onChange={(event) => { this.setState({ valorInicial_valor: event.target.value }) }}></input>
                    <span>Valor Final</span>
                    <input type="text" onChange={(event) => { this.setState({ valorFinal_valor: event.target.value }) }}></input>
                    <input type="button" class="inicializador_botao" value="Iniciar" onClick={this.IniciarSorteio}></input>
                </div>

                <div style={{ display: sorteioRodando ? "block" : "none" }}>
                    <input type="button" class="gerador_botao" value="Gerar Próximo" onClick={this.ControlarSorteio}></input>
                    <p>{this.state.resultado_valor}</p>
                </div>
            </div>
        )
    }
}

let memoriaMax = 0;
let listaItens = null;
function setIniciaMemoriaSorteio(dado_memoria, tamanho_maximo) {
    memoriaMax = tamanho_maximo;
    listaItens = [dado_memoria];
}

function setResetMemoria() {
    memoriaMax = 0;
    listaItens = null;
}

function setMemoriaSorteio(dado_memoria, tamanho_maximo) {
    if (memoriaMax === 0 || listaItens == null) {
        setIniciaMemoriaSorteio(dado_memoria, tamanho_maximo);
        return true;
    } else if (listaItens.length <= memoriaMax) {
        listaItens.push(dado_memoria);
        return true;
    }
    return false;
}

function getEspacoLivreMemoria() {
    let calc = memoriaMax - listaItens.length + 1;
    if (calc > 0) { return true; }
    else { return false; }

}

function getItemExistenteSorteio(valor) {

    let achouValor = false;
    _forEach(listaItens, function (item) {
        console.log("Item na lista:" + item + "valor comparação:" + valor);
        if (item === valor) {
            console.log("ACHOU:" + item + "valor comparação:" + valor);
            achouValor = true;
        }
    });

    return achouValor;
}

function getRandomInt(min, max) {
    return parseInt(Math.floor(Math.random() * (max - min + 1)) + min);
}