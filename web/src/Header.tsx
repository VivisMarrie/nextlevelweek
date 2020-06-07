import React, {useState} from 'react';

interface HeaderProps {
    title : string; //se não for obrigatoria coloca ? depois de declarar
}

const Header: React.FC<HeaderProps> = (props) => {
    const [counter, setCounter] = useState(0); // < array primeiro item é o valor atual e o segundo é uma funcao pra atualizar a var
    
    function handleButton(){
        setCounter(counter+1);
    }
    return(
        <header>
            <h1>{props.title}</h1>
    <h1>{counter}</h1>
            <button type="button" onClick={handleButton}>Aumentar</button>
        </header>
    )
}

export default Header;