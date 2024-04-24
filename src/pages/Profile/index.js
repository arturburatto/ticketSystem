import Header from '../../components/Header'
import Title from '../../components/Title'
import {FiSettings, FiUpload} from 'react-icons/fi'
import avatar from '../../assets/avatar.png'
import {AuthContext}from '../../contexts/auth'
import { useState, useContext } from 'react'
import './profile.css'
import { toast } from 'react-toastify'
import { doc, updateDoc } from 'firebase/firestore'
import { db, storage } from '../../services/firebaseConnection'
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'


export default function Profile(){
    const {user, storageUser, setUser, logOut} = useContext(AuthContext)

    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)
    const [imageAvatar, setImageAvatar] =  useState(null)
    const [nome, setNome] = useState(user && user.nome)
    const [email, setEmail] = useState(user && user.email)

    function handleFile(e){
        if(e.target.files[0]){
            const image = e.target.files[0]
            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                setImageAvatar(image)
                setAvatarUrl(URL.createObjectURL(image))
            }else{
                toast.error('Envie uma imagem com o formato JPG ou PNG')
                setImageAvatar(null)
                return
            }
        }
    }

    async function handleUpload(){
        const currentUid = user.uid
        const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`)
        const uploadTask = uploadBytes(uploadRef, imageAvatar)
        .then((snapshot) =>{
            toast.success('foto alterada com sucesso!')
            getDownloadURL(snapshot.ref).then(async (downloadUrl) =>{
                let urlFoto = downloadUrl

                const docRef = doc(db, 'users', user.uid)
                await updateDoc(docRef, {
                    avatarUrl: urlFoto,
                    nome: nome
                }).then(() =>{
                    let data ={
                        ...user,
                        nome:nome,
                        avatarUrl: urlFoto
                    }
                    setUser(data)
                    storageUser(data)
                    
                })
            })
        })
    }

  async  function handleSubmit(e){
        e.preventDefault()
        
        if(imageAvatar === null && nome!== ''){
            const docRef = doc(db, 'users', user.uid)
            await updateDoc(docRef, {
                nome: nome
            }).then(() =>{
                let data ={
                    ...user,
                    nome:nome,
                }
                setUser(data)
                storageUser(data)
                toast.success('Dados atualizados com sucesso!')
            })
        }

        if(nome !== '' && imageAvatar!== null){
            handleUpload()
        }
    }

    return(
        <div>
            <Header/>
            <div className='content'>
                <Title nome='Minha Conta'>
                    <FiSettings size={25}/>
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleSubmit}>
                        <label className='label-avatar'>

                            <span>
                                <FiUpload color='#fff' size={25}/>
                            </span>

                            <input type='file' accept='image/*' onChange={handleFile}/><br/>

                            {avatarUrl === null ? (<img src={avatar} alt='foto de perfil' width={230} height={250}/>) : (<img src={avatarUrl} alt='foto de perfil' width={230} height={250}/>)}

                        </label>

                        <label>Nome</label>
                        <input type="text" value={nome} onChange={(e) => {setNome(e.target.value)}}/>

                        <label>Email</label>
                        <input type="text" value={email} disabled={true}/>

                        <button type='submit'>Salvar</button>
                    </form>
                </div>
                <div className='container'>
                    <button className='logout-btn' onClick={() =>logOut()}>Sair</button>
                </div>
            </div>

        </div>
    )
}