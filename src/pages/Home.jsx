import Greetings from "../components/Greetings";
import { useState } from "react";
import UserCard from "../components/UserCard";

// Array de dados pode ser transformado em vários componentes com map().
const team = [
    {
        id: 1,
        name: 'Mauricinho',
        age: 25,
        profession: 'Desenvolvedor Front-end',
        avatarUrl: 'https://randomuser.me/api/portraits/men/12.jpg',
        isMentor: true,
        focus: 'Componentes e acessibilidade',
    },
    {
        id: 2,
        name: 'Mirian da Mary Kay',
        age: 23,
        profession: 'Desenvolvedora Back-end',
        avatarUrl: 'https://randomuser.me/api/portraits/women/19.jpg',
        focus: 'Integração entre serviços',
    },
    {
        id: 3,
        name: 'Silvan da Silva Feitoza',
        age: 42,
        profession: 'Analista de qualidade',
        avatarUrl: 'https://randomuser.me/api/portraits/men/31.jpg',
        focus: 'Testes e experiência do usuário',
    },
];

function Home() {
    const [visitorName, setVisitorName] = useState('');

    return (
        <>
            <div className="name-form">
                <label htmlFor="visitor-name">Quem é o cantor?</label>
                <input 
                    type="text" 
                    id="visitor-name" 
                    placeholder="Digite seu nome"
                    onChange={(evento) => setVisitorName(evento.target.value)}
                />
            </div>

            <Greetings nome={visitorName || "Visitante"}/>

            <section id="equipe">
                <div className="section-heading">
                    <div>
                        <span className="section-label">Capital Humano</span>
                        <h2>Conheça nossa Equipe:</h2>
                    </div>
                </div>
                <div className="team-grid">
                    {team.map((person) => (
                        <UserCard key={person.id} {...person}>
                            <p className="card-note">Foco: {person.focus}</p>
                        </UserCard>
                    ))}
                </div>
            </section>
        </>
    );
}
export default Home;
