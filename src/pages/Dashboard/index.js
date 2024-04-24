import { AuthContext } from "../../contexts/auth"
import { useContext, useEffect, useState } from "react"
import Header from "../../components/Header";
import './dashboard.css'
import Title from "../../components/Title";
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { collection, getDocs, orderBy, limit, startAfter, query } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { format } from "date-fns";
import Modal from "../../components/Modal";

const listRef = collection(db, "tickets")


export default function Dashboard(){
    const {logOut} = useContext(AuthContext)
    const [chamados, setChamados] = useState([])
    const [loading, setLoading] = useState(true)
    const [isEmpty, setIsEmpty] = useState(false)
    const [lastDocs, setLastDocs] = useState()
    const [loadingMore, setLoadingMore] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [detail, setDetail] = useState()
    
    useEffect(() => {
        async function loadChamados(){
            const q = query(listRef, orderBy('created', 'desc'), limit(5));

            const querySnapshot = await getDocs(q)
            await updateState(querySnapshot)
            setLoading(false)

            if (querySnapshot.size < 5) {
                setIsEmpty(true);
            }

        }
        loadChamados()
        return() => {}
    }
    ,[])

    async function updateState(querySnapshot){
        const isCollectionEmpty = querySnapshot.size === 0

        if(!isCollectionEmpty){
            let lista = [];

            querySnapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente: doc.data().cliente,
                    clienteId: doc.data().clienteId,
                    created: doc.data().created,
                    createdFormat: format(doc.data().created.toDate(), 'dd/MM/yy'),
                    status: doc.data().status,                    
                    complemento: doc.data().complemento
                })
            })

            const lastDoc = querySnapshot.docs[querySnapshot.docs.length -1]

            setChamados(chamados => [...chamados, ...lista])
            setLastDocs(lastDoc)

        }else{
            setIsEmpty(true)
        }

        setLoadingMore(false)
    }



   async function handleMore(){
        setLoadingMore(true)
        const q = query(listRef, orderBy('created', 'desc'), startAfter(lastDocs), limit(5))
        const querySnapshot = await getDocs(q)
        await updateState(querySnapshot)
    }

    if(loading){
        return(
            <div>
                <Header/>

                <div className="content">
                    <Title nome="Tickets">
                    <FiMessageSquare size={25}/>
                    </Title>
                    <div className="container dashboard">
                        <span>Buscando chamados...</span>
                    </div>
                </div>
            </div>
        )
    }

    function mostraModal(item){
        setShowModal(!showModal)
        setDetail(item)
    }
    return(
        <div>
            <Header/>
            <div className="content">
                <Title nome='Tickets'>
                    <FiMessageSquare size={25}/>
                </Title>


                <>


                {chamados.length === 0 ? (
                    <div className="container dashboard">
                        <span>Nenhum chamado encontrado</span>
                        <Link to='/new' className="new">
                            <FiPlus color="#FFF" size={25}/>
                            Novo chamado
                        </Link>
                    </div>
                ) : (
                    <>
                    <Link to='/new' className="new">
                            <FiPlus color="#FFF" size={25}/>
                            Novo chamado
                        </Link>
                        <table>
                <thead>
                    <tr>
                        <th scope="col">Cliente</th>
                        <th scope="col">Assunto</th>
                        <th scope="col">Status</th>
                        <th scope="col">Cadastrado em</th>
                        <th scope="col">#</th>
                    </tr>
                </thead>
                <tbody>
                    {chamados.map((item, index) =>{
                        return(
                            <tr key={index}>
                            <td data-Label='Cliente'>{item.cliente}</td>
                            <td data-Label='Assunto'>{item.assunto}</td>
                            <td data-Label='Status'>
                                <span className="badge" style={{backgroundColor: item.status === 'Aberto' ? '#5cb85c' : (item.status === 'Em Progresso' ? '#3583f6' : '#999')}}>
                                    {item.status}
                                </span>
                            </td>
                            <td data-Label='Cadastrado'>{item.createdFormat}</td>
                            <td data-Label='#'>
                                <button onClick={() => mostraModal(item)} className="action" style={{backgroundColor: '#3583f6'}}><FiSearch color="#fff" size={25}/></button>
                                <Link to={`/new/${item.id}`} className="action" style={{backgroundColor: '#f6a935'}}><FiEdit2 color="#fff" size={25}/></Link>
                            </td>
                        </tr>
    
    
                        )
                    })}
                </tbody>
               </table>
               {loadingMore && <h4>Carregando itens...</h4>}
               {!loadingMore && !isEmpty &&  <button onClick={handleMore} className="btn-more">Buscar Mais</button>}
                    </>
                )}


                </>
            </div>

            {showModal && (
                <Modal
                    conteudo={detail}
                    close={() => setShowModal(!showModal)}
                />
            )}
        </div>
    )
}
