import { useEffect, useState } from 'react';
import './Contact.css'

const initialForm = {
    cep: '',
    street: '',
    neighborhood: '',
    state: '',
    city: '',
    number: '',
    message: ''
}

export default function Contact() {
    const [form, setForm] = useState(initialForm)
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [isSearchingCep, setIsSearchingCep] = useState(false)
    const [status, setStatus] = useState({ type: '', message: '' })

    useEffect(() => {
        const controller = new AbortController()

        async function loadStates() {
            try {
                const response = await fetch(
                    'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome',
                    { signal: controller.signal }
                )
                if (!response.ok) {
                    throw new Error('Não foi possível carregar os estados.')
                }
                setStates(await response.json())
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setStatus({ type: 'error', message: error.message })
                }
            }
        }

        loadStates()
        return () => controller.abort()
    }, [])

    useEffect(() => {
        if (!form.state) {
            setCities([])
            return
        }

        const controller = new AbortController()

        async function loadCities() {
            try {
                const response = await fetch(
                    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${form.state}/municipios?orderBy=nome`,
                    { signal: controller.signal }
                )
                if (!response.ok) {
                    throw new Error('Não foi possível carregar as cidades.')
                }
                setCities(await response.json())
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setStatus({ type: 'error', message: error.message })
                }
            }
        }

        loadCities()
        return () => controller.abort()
    }, [form.state])

    function handleChange(event) {
        const { name, value } = event.target
        setForm(current => ({
            ...current,
            [name]: value,
            ...(name === 'state' ? { city: '' } : {})
        }))
        setStatus({ type: '', message: '' })
    }

    async function searchCep() {
        const cleanCep = form.cep.replace(/\D/g, '')
        if (cleanCep.length !== 8) {
            setStatus({ type: 'error', message: 'Digite um CEP válido com 8 números.' })
            return
        }

        setIsSearchingCep(true)
        setStatus({ type: '', message: '' })

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
            if (!response.ok) {
                throw new Error('Não foi possível consultar o CEP. Tente novamente.')
            }

            const address = await response.json()
            if (address.erro) {
                throw new Error('CEP não encontrado. Confira os números digitados.')
            }

            setForm(current => ({
                ...current,
                cep: cleanCep,
                street: address.logradouro || '',
                neighborhood: address.bairro || '',
                state: address.uf || '',
                city: address.localidade || ''
            }))
            setStatus({ type: 'success', message: 'Endereço preenchido pelo CEP.' })
        } catch (error) {
            setStatus({ type: 'error', message: error.message })
        } finally {
            setIsSearchingCep(false)
        }
    }

    function handleSubmit(event) {
        event.preventDefault()
        setStatus({
            type: 'success',
            message: 'Formulário validado. Para enviar a mensagem, ainda é necessário conectar um serviço de envio.'
        })
    }

    return (
        <section className="contact-page">
            <span className="section-label">Fale com a gente</span>
            <h1>Entre em contato</h1>
            <p className="page-intro">Consulte o CEP para completar seu endereço e escolha uma cidade carregada pela API do IBGE.</p>
            <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-section">
                    <h2>Endereço</h2>
                    <div className="form-grid">
                        <label>CEP
                            <div className="cep-field">
                                <input
                                    name="cep"
                                    value={form.cep}
                                    onChange={handleChange}
                                    inputMode="numeric"
                                    autoComplete="postal-code"
                                    placeholder="00000-000"
                                    required
                                />
                                <button type="button" onClick={searchCep} disabled={isSearchingCep}>
                                    {isSearchingCep ? 'Buscando...' : 'Buscar CEP'}
                                </button>
                            </div>
                        </label>
                        <label>Estado
                            <select name="state" value={form.state} onChange={handleChange} required>
                                <option value="">Selecione um estado</option>
                                {states.map(state => (
                                    <option key={state.id} value={state.sigla}>{state.nome}</option>
                                ))}
                            </select>
                        </label>
                        <label>Cidade
                            <select name="city" value={form.city} onChange={handleChange} required disabled={!form.state}>
                                <option value="">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.nome}>{city.nome}</option>
                                ))}
                            </select>
                        </label>
                        <label>Rua
                            <input
                                name="street"
                                value={form.street}
                                onChange={handleChange}
                                autoComplete="address-line1"
                                placeholder="Nome da rua"
                                required
                            />
                        </label>
                        <label>Número
                            <input
                                name="number"
                                value={form.number}
                                onChange={handleChange}
                                autoComplete="address-line2"
                                placeholder="123"
                                required
                            />
                        </label>
                        <label>Bairro
                            <input
                                name="neighborhood"
                                value={form.neighborhood}
                                onChange={handleChange}
                                placeholder="Seu bairro"
                                required
                            />
                        </label>
                    </div>
                </div>
                <label>Mensagem
                    <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows="5"
                        placeholder="Como podemos ajudar?"
                        required
                    />
                </label>
                <button className="submit-button" type="submit">Enviar mensagem</button>
                {status.message && (
                    <p className={`form-status ${status.type}`} role="status">{status.message}</p>
                )}
            </form>
        </section>
    );
}
