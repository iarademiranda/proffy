import React from 'react'
import whatsappIcon from '../../assets/images/icons/whatsapp.svg'
import './styles.css'
function TeacherItem(){
    return (
        <article className="teacher-item">
        <header>
            <img src="https://avatars2.githubusercontent.com/u/62669057?s=460&u=f636a3977399c3611c9f366a2e5f559027b0ec90&v=4" alt="avatar"/>
            <div>
                <strong>Iara de Miranda</strong>
                <span>Matemárica</span>
            </div>
        </header>
        <p>
            Apaixonada por ensinar e gosta de estar sempre atualizada em termos de tecnologia.
             <br/><br/>
             Se estiver precisando de uma ajuda com os números eu posso lhe ajudar!
        </p>
        <footer>
            <p>
                Preço/hora
                <strong>R$20,00</strong>
            </p>
            <button  type="button">
                <img src={whatsappIcon} alt="whatsapp"/>
                 Entrar em contato
            </button>

        </footer>
    </article>

    )
}
 export default TeacherItem;