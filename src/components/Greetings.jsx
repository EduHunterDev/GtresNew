import './Greetings.css'

function Greetings({ nome, mensagem = "Seja bem vindo(a)!" }) {
    return(
        <div className="greeting">
            <span className="greeting__eyebrow">React - Primeiros Passos</span>
            <h1>{nome}, {mensagem}</h1>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reiciendis, quaerat? Veniam id illum provident exercitationem nisi omnis, mollitia obcaecati minus officia, quam esse earum excepturi explicabo saepe nesciunt autem voluptatum.</p>
        </div>
    );
}
export default Greetings;