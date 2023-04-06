import './Pocetna.css';

const Pocetna = () => {
    return (
        <>
        <section className='sekcija-1'>
            <h3 className='tekst1'>- Dobro dosao na sajt!</h3>
            <h1 className='tekst2'>Luka Bickeji</h1>
            <h5 className='tekst3'>Pazljivo procitajte usluge prilikom zakazivanja termina. Mozete izabrati jednu ili vise usluga.</h5>
            <button className='dugme'>ZAKAZI TERMIN</button>
            <img className='slika1' src='https://images.unsplash.com/photo-1587909209111-5097ee578ec3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'  alt= 'React Image' />
        </section>
        </>
    )
};

export default Pocetna;