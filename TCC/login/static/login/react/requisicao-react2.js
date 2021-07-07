function Table(props) {
    var dados = props.data.data
    var onibusLista = props.data.onibusLista
    console.log(dados)
    var rows = []
    var pages = new Array();
    var usuarios = []
    var requisicoes = []
    var mensagem;
    var btnLeftStyle = {}
    var btnRightStyle = {}
    var pageSelecionada;
    recuperarUsuarios()
    recuperarRequisicoes()
    console.log(usuarios)
    console.log(requisicoes)
    console.log(onibusLista)
    const [pageIndex, setPageIndex] = React.useState(0)
    var rowIndex = pageIndex*10
    createRowsViews(requisicoes)
    const [rowsState, setRows] = React.useState(rows)
    if(rowsState.length !== 0){
       rowsToPages()
       var index = pageIndex
        //Provavelmente terei que adicionar o código para retroceder uma página
        //caso não haja mais requisições na última página.
        if (!pages[pageIndex]) {
            index--;
            setPageIndex((state) => {
                return index;
            })
        }
        console.log("INDEX: " + index)
        pageSelecionada = pages[index]
        console.log(pages)
        definirMensagem()
        definirVisibilidadeBtn()
    } else {
        mensagem = `Não há requisições a serem respondidas.`
        definirVisibilidadeBtn()
    }
    

    return (<div className="text-center">
        <TableData rows={pageSelecionada}>
        </TableData>
        <button className="btn" onClick={previousRows} style={btnLeftStyle}>
            <span className="fas fa-arrow-left" ></span>
        </button>
        {mensagem}
        <button className="btn" onClick={nextRows} style={btnRightStyle}>
            <span className="fas fa-arrow-right" ></span>
        </button>
    </div>)

function definirMensagem(){
    var inicio = index * 10 + 1
    var fim = index * 10 + pages[index].length
    mensagem = `Exibindo ${inicio}-${fim} de ${rowsState.length} requisicões.`
}

function rowsToPages(){
    var nRequisicoes = rowsState.length
    var nPaginas = Math.ceil(nRequisicoes / 10)

    for (let i = 0; i < nPaginas; i++) {
        var rowsPage = [];
        for (let j = i * 10; j < i * 10 + 10; j++) {
            if (rowsState.length > j) {
                rowsPage.push(rowsState[j])
            }
        }
        pages[i] = rowsPage
    }
    console.log(pages)
}
function createRowsViews(requisicoes){
    requisicoes.forEach((req) => {
        let selectedUser = getUserFromReq(req)
        createRowView(req, selectedUser)
    })
}

function createRowView(req, user){
    rowIndex++;
    var row = (<LinhaReq requisicao={req} usuario={user}
        index={rowIndex} update={update} />)
    rows.push(row)
    
}

function getUserFromReq(req){
    let selectedUser;
        usuarios.map((user) => {
            if(user.idUsuario == req.usuarioID){
                selectedUser = user;
            }
        })
    return selectedUser
}
function recuperarUsuarios(){
    console.log(dados)
    dados.forEach(element => {
        let user = element.user
        console.log(element)
        usuarios.push(user)
    });
}

function recuperarRequisicoes(){
    dados.forEach(element => {
        let reqs = element.requisicoes
        requisicoes.splice(-1, 0, ...reqs)
    });
}

function update(index) {
    var updatedRows = []
    console.log("Index a ser removido: " + index)
    setRows(function (prevRows) {
        for (let i = 0; i < prevRows.length; i++) {
            if (prevRows[i].props.index !== index) {
                updatedRows.push(prevRows[i])
            } else {
                console.log(prevRows[i])
            }
        }
        console.log(updatedRows)
        return updatedRows
    })
}


function nextRows() {
    if (pageIndex < pages.length) {
        setPageIndex((prevIndex) => {
            let newIndex = prevIndex + 1;
            return newIndex
        })
    }
}

function previousRows() {
    if (pageIndex > 0) {
        setPageIndex((prevIndex) => {
            let newIndex = prevIndex - 1;
            return newIndex
        })
    }
}


function definirVisibilidadeBtn() {
    if (!pages[pageIndex - 1]) {
        btnLeftStyle = {
            "display": "none"
        }
    }

    if (!pages[pageIndex + 1]) {
        btnRightStyle = {
            "display": "none"
        }
    }
}
}

function LinhaReq(props) {
    const rowAnimation = {
        "animation-name": "hide",
        "animation-duration": "1s",
        "animation-fill-mode": "forwards",
        "animation-play-state": "paused",
    }

    const style = {
        "animation-name": "hide",
        "animation-duration": "1s",
        "animation-fill-mode": "forwards",
        "animation-play-state": "paused",
    }

    const btnAnimation = {
        "animation-name": "hide-btn",
        "animation-duration": "0.5s",
        "animation-fill-mode": "forwards",
        "animation-play-state": "paused",
    }

    function deny() {
        //dbRef.child('dados/requisicoes/' + props.usuario.idUsuario + "/" + props.requisicao.requisicaoID + "/statusRequisicao").set(-1)
        props.update(props.index)
    }

    function confirm() {
        //dbRef.child('dados/requisicoes/' + props.usuario.idUsuario + "/" + props.requisicao.requisicaoID + "/statusRequisicao").set(1)
        props.update(props.index)
    }

    return (
        <tr className="requisicao" id={props.index} style={rowAnimation}>
            <th className="align-items-center" scope="row" style={style}>{props.index}</th>
            <td className="align-items-center" style={style}>{props.usuario.nome}</td>
            <td className="align-items-center" style={style}>{props.requisicao.dataViagem}</td>
            <td className="align-items-center" style={style}>{props.requisicao.dataHoraRequisicao}</td>
            <td className="align-items-center" style={style}>
                <input class="button" id="btn-confirm" style={btnAnimation} onClick={confirm} type="image" src="../static/login/img/confirm-button.png" value="" id="button-confirm" />
                <input class="button" id="btn-deny" style={btnAnimation} onClick={deny} type="image" src="../static/login/img/deny-button2.png" value="" id="button-deny" />
            </td>
        </tr>
    )
}

function TableData(props) {
    var rows = props.rows
    console.log(rows)
    return (
        <table class="table table-dark table-striped">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Passageiro</th>
                    <th scope="col">Viagem</th>
                    <th scope="col">Data/Hora Solicitação</th>
                    <th scope="colspan2"></th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    )
}